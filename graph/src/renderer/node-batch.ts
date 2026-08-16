/**
 * NodeBatchRenderer — instanced circle rendering with WebGL2 + SDF.
 *
 * All nodes rendered in a single instanced draw call.
 */

import { NODE_VS, NODE_FS, PICK_NODE_VS, PICK_NODE_FS } from "./shaders.js"
import type { NodeRenderPipeline } from "./node-pipeline.js"
import type { RenderNode } from "./types.js"
import { IconAtlas, type AtlasGlyph } from "./icon-atlas.js"

/** Shape type → float for shader uniform (always circle) */
export function shapeToType(_shape?: string): number {
  return 0
}

/** @deprecated 使用 RenderNode 替代 */
export interface BatchNode {
  x: number
  y: number
  radius: number
  color: [number, number, number, number]
  strokeColor: [number, number, number, number]
  strokeWidth: number
  shape?: string
  shapeParam?: number
}

export class NodeBatchRenderer implements NodeRenderPipeline {
  private gl: WebGL2RenderingContext
  private program: WebGLProgram
  private pickProgram: WebGLProgram

  // Shared quad geometry (unit square centered at origin)
  private quadVao: WebGLVertexArrayObject | null = null

  // 动态 instanced buffer 缓存（复用，避免每帧 createBuffer 泄漏 + GC 卡顿）
  private _dynBufs = new Map<number, WebGLBuffer>()
  private _dynBufSizes = new Map<number, number>()

  // Uniform locations (render)
  private uResolution: WebGLUniformLocation | null = null
  private uTranslation: WebGLUniformLocation | null = null
  private uScale: WebGLUniformLocation | null = null
  private uZOffset: WebGLUniformLocation | null = null
  private uIconAtlas: WebGLUniformLocation | null = null

  // Uniform locations (pick)
  private uPickResolution: WebGLUniformLocation | null = null
  private uPickTranslation: WebGLUniformLocation | null = null
  private uPickScale: WebGLUniformLocation | null = null
  private uPickZOffset: WebGLUniformLocation | null = null

  constructor(gl: WebGL2RenderingContext) {
    this.gl = gl
    this.program = this.compileProgram(NODE_VS, NODE_FS)
    this.pickProgram = this.compileProgram(PICK_NODE_VS, PICK_NODE_FS)
    this.initQuadGeometry()
    this.cacheUniforms()
  }

  private compileProgram(vs: string, fs: string): WebGLProgram {
    const gl = this.gl
    const vShader = this.compileShader(gl.VERTEX_SHADER, vs)
    const fShader = this.compileShader(gl.FRAGMENT_SHADER, fs)
    const prog = gl.createProgram()!
    gl.attachShader(prog, vShader)
    gl.attachShader(prog, fShader)
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      throw new Error("Shader link failed: " + gl.getProgramInfoLog(prog))
    }
    return prog
  }

  private compileShader(type: number, source: string): WebGLShader {
    const gl = this.gl
    const shader = gl.createShader(type)!
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error("Shader compile failed: " + gl.getShaderInfoLog(shader))
    }
    return shader
  }

  private cacheUniforms(): void {
    const gl = this.gl
    this.uResolution = gl.getUniformLocation(this.program, "u_resolution")
    this.uTranslation = gl.getUniformLocation(this.program, "u_translation")
    this.uScale = gl.getUniformLocation(this.program, "u_scale")
    this.uZOffset = gl.getUniformLocation(this.program, "u_zOffset")
    this.uIconAtlas = gl.getUniformLocation(this.program, "u_iconAtlas")

    this.uPickResolution = gl.getUniformLocation(
      this.pickProgram,
      "u_resolution",
    )
    this.uPickTranslation = gl.getUniformLocation(
      this.pickProgram,
      "u_translation",
    )
    this.uPickScale = gl.getUniformLocation(this.pickProgram, "u_scale")
    this.uPickZOffset = gl.getUniformLocation(this.pickProgram, "u_zOffset")
  }

  private initQuadGeometry(): void {
    const gl = this.gl
    const positions = new Float32Array([
      -1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1,
    ])

    const vao = gl.createVertexArray()!
    gl.bindVertexArray(vao)

    const posBuf = gl.createBuffer()!
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf)
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW)
    gl.enableVertexAttribArray(0)
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)

    gl.bindVertexArray(null)
    this.quadVao = vao
  }

  /** Render all nodes in one instanced draw call */
  render(
    nodes: RenderNode[],
    width: number,
    height: number,
    tx: number,
    ty: number,
    scale: number,
    zOffset = 0,
    iconAtlas?: IconAtlas,
  ): void {
    if (nodes.length === 0) return
    const gl = this.gl
    const N = nodes.length

    gl.useProgram(this.program)
    gl.uniform2f(this.uResolution, width, height)
    gl.uniform2f(this.uTranslation, tx, ty)
    gl.uniform1f(this.uScale, scale)
    gl.uniform1f(this.uZOffset, zOffset)
    gl.bindVertexArray(this.quadVao)

    // Build instance data arrays
    const center = new Float32Array(N * 2)
    const radius = new Float32Array(N)
    const color = new Float32Array(N * 4)
    const strokeColor = new Float32Array(N * 4)
    const strokeWidth = new Float32Array(N)
    const shapeType = new Float32Array(N)
    const shapeParam = new Float32Array(N)
    const showPlus = new Float32Array(N)
    const plusOffsetX = new Float32Array(N)
    const plusOffsetY = new Float32Array(N)
    const plusScale = new Float32Array(N)
    const hasIcon = new Float32Array(N)
    const iconUv = new Float32Array(N * 4)

    // 每个 url/文本 解析一次 UV
    const glyphCache = new Map<string, AtlasGlyph | null>()

    for (let i = 0; i < N; i++) {
      const n = nodes[i]
      center[i * 2] = n.x
      center[i * 2 + 1] = n.y
      radius[i] = n.radius
      color[i * 4] = n.color[0]
      color[i * 4 + 1] = n.color[1]
      color[i * 4 + 2] = n.color[2]
      color[i * 4 + 3] = n.color[3]
      strokeColor[i * 4] = n.strokeColor[0]
      strokeColor[i * 4 + 1] = n.strokeColor[1]
      strokeColor[i * 4 + 2] = n.strokeColor[2]
      strokeColor[i * 4 + 3] = n.strokeColor[3]
      strokeWidth[i] = n.strokeWidth
      shapeType[i] = shapeToType(n.shape)
      shapeParam[i] = n.shapeParam ?? 0.25
      showPlus[i] = n.showPlus ? 1 : 0
      plusOffsetX[i] = n.plusOffsetX ?? 0.5
      plusOffsetY[i] = n.plusOffsetY ?? -0.5
      plusScale[i] = n.plusScale ?? 0.35

      if (iconAtlas && n.iconUrl) {
        let glyph = glyphCache.get(n.iconUrl)
        if (glyph === undefined) {
          glyph = iconAtlas.getOrCreate(n.iconUrl)
          glyphCache.set(n.iconUrl, glyph)
        }
        if (glyph) {
          hasIcon[i] = 1
          iconUv[i * 4] = glyph.uv[0]
          iconUv[i * 4 + 1] = glyph.uv[1]
          iconUv[i * 4 + 2] = glyph.uv[2]
          iconUv[i * 4 + 3] = glyph.uv[3]
        }
      }
    }

    this.setupInstanceBuffer(1, center, 2)
    this.setupInstanceBuffer(2, radius, 1)
    this.setupInstanceBuffer(3, color, 4)
    this.setupInstanceBuffer(4, strokeColor, 4)
    this.setupInstanceBuffer(5, strokeWidth, 1)
    this.setupInstanceBuffer(6, shapeType, 1)
    this.setupInstanceBuffer(7, shapeParam, 1)
    this.setupInstanceBuffer(8, showPlus, 1)
    this.setupInstanceBuffer(9, plusOffsetX, 1)
    this.setupInstanceBuffer(10, plusOffsetY, 1)
    this.setupInstanceBuffer(11, plusScale, 1)
    this.setupInstanceBuffer(12, hasIcon, 1)
    this.setupInstanceBuffer(13, iconUv, 4)

    // 绑定图标纹理（TEXTURE1）
    if (iconAtlas) {
      gl.activeTexture(gl.TEXTURE1)
      gl.bindTexture(gl.TEXTURE_2D, iconAtlas.getTexture(gl))
      gl.uniform1i(this.uIconAtlas, 1)
    }

    gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, N)

    // Reset divisors to 0 for non-instanced attributes
    for (let loc = 1; loc <= 13; loc++) {
      gl.vertexAttribDivisor(loc, 0)
    }
    gl.bindVertexArray(null)
  }

  /** Batch-render all nodes for FBO picking (single draw call, gl_InstanceID encodes index) */
  renderPicking(
    nodes: RenderNode[],
    width: number,
    height: number,
    tx: number,
    ty: number,
    scale: number,
    zOffset = 0,
  ): void {
    if (nodes.length === 0) return
    const gl = this.gl
    const N = nodes.length

    gl.useProgram(this.pickProgram)
    gl.uniform2f(this.uPickResolution, width, height)
    gl.uniform2f(this.uPickTranslation, tx, ty)
    gl.uniform1f(this.uPickScale, scale)
    gl.uniform1f(this.uPickZOffset, zOffset)
    gl.bindVertexArray(this.quadVao)

    const center = new Float32Array(N * 2)
    const radius = new Float32Array(N)
    const dummyColor = new Float32Array(N * 4)
    const dummyStrokeColor = new Float32Array(N * 4)
    const strokeWidth = new Float32Array(N)
    const shapeType = new Float32Array(N)
    const shapeParam = new Float32Array(N)

    for (let i = 0; i < N; i++) {
      const n = nodes[i]
      center[i * 2] = n.x
      center[i * 2 + 1] = n.y
      radius[i] = n.radius
      strokeWidth[i] = n.strokeWidth
      shapeType[i] = shapeToType(n.shape)
      shapeParam[i] = n.shapeParam ?? 0.25
    }

    this.setupInstanceBuffer(1, center, 2)
    this.setupInstanceBuffer(2, radius, 1)
    this.setupInstanceBuffer(3, dummyColor, 4)
    this.setupInstanceBuffer(4, dummyStrokeColor, 4)
    this.setupInstanceBuffer(5, strokeWidth, 1)
    this.setupInstanceBuffer(6, shapeType, 1)
    this.setupInstanceBuffer(7, shapeParam, 1)

    gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, N)

    for (let loc = 1; loc <= 7; loc++) {
      gl.vertexAttribDivisor(loc, 0)
    }
    gl.bindVertexArray(null)
  }

  private setupInstanceBuffer(
    loc: number,
    data: Float32Array,
    components: number,
  ): void {
    const gl = this.gl
    this.uploadDynamic(loc, data)
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, components, gl.FLOAT, false, 0, 0)
    gl.vertexAttribDivisor(loc, 1)
  }

  /** 复用动态 buffer：首次 createBuffer，之后 bufferSubData（尺寸不够才重建） */
  private uploadDynamic(loc: number, data: Float32Array): void {
    const gl = this.gl
    const bytes = data.byteLength
    let buf = this._dynBufs.get(loc) ?? null
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    if (buf === null) {
      buf = gl.createBuffer()!
      this._dynBufs.set(loc, buf)
      this._dynBufSizes.set(loc, bytes)
      gl.bindBuffer(gl.ARRAY_BUFFER, buf)
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW)
      return
    }
    const prev = this._dynBufSizes.get(loc) ?? 0
    if (bytes > prev) {
      this._dynBufSizes.set(loc, bytes)
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW)
    } else {
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, data)
    }
  }

  destroy(): void {
    const gl = this.gl
    gl.deleteProgram(this.program)
    gl.deleteProgram(this.pickProgram)
  }
}
