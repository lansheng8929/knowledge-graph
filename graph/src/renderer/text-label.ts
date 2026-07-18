/**
 * TextLabelRenderer — renders text labels as textured quads using WebGL2
 */

import { TEXT_VS, TEXT_FS } from "./shaders.js"
import { TextureAtlas, type AtlasGlyph } from "./atlas.js"
import type { RenderNode, RenderLink } from "./types.js"

export interface LabelInfo {
  /** Screen position */
  x: number
  y: number
  text: string
  color: [number, number, number, number]
}

export class TextLabelRenderer {
  private gl: WebGL2RenderingContext
  private program: WebGLProgram
  private atlas: TextureAtlas
  private quadVao: WebGLVertexArrayObject | null = null

  private uResolution: WebGLUniformLocation | null = null
  private uTranslation: WebGLUniformLocation | null = null
  private uScale: WebGLUniformLocation | null = null
  private uZOffset: WebGLUniformLocation | null = null
  private uTexture: WebGLUniformLocation | null = null

  constructor(gl: WebGL2RenderingContext, atlasSize = 2048, fontSize = 12) {
    this.gl = gl
    this.atlas = new TextureAtlas(atlasSize, fontSize)

    this.program = this.compile(TEXT_VS, TEXT_FS)
    this.initGeometry()
    this.cacheUniforms()
  }

  private compile(vs: string, fs: string): WebGLProgram {
    const gl = this.gl
    const v = this.makeShader(gl.VERTEX_SHADER, vs)
    const f = this.makeShader(gl.FRAGMENT_SHADER, fs)
    const p = gl.createProgram()!
    gl.attachShader(p, v)
    gl.attachShader(p, f)
    gl.linkProgram(p)
    return p
  }

  private makeShader(type: number, src: string): WebGLShader {
    const gl = this.gl
    const s = gl.createShader(type)!
    gl.shaderSource(s, src)
    gl.compileShader(s)
    return s
  }

  private cacheUniforms(): void {
    const gl = this.gl
    this.uResolution = gl.getUniformLocation(this.program, "u_resolution")
    this.uTranslation = gl.getUniformLocation(this.program, "u_translation")
    this.uScale = gl.getUniformLocation(this.program, "u_scale")
    this.uZOffset = gl.getUniformLocation(this.program, "u_zOffset")
    this.uTexture = gl.getUniformLocation(this.program, "u_texture")
  }

  private initGeometry(): void {
    const gl = this.gl
    // Unit quad: a_position in (0..1)
    const positions = new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1])

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

  /** Build labels from node data */
  buildNodeLabels(
    nodes: RenderNode[],
    scale: number,
    minScale: number,
  ): LabelInfo[] {
    const labels: LabelInfo[] = []
    if (scale < minScale) return labels

    for (const n of nodes) {
      if (!n.label) continue
      const glyph = this.atlas.getOrCreate(n.label)
      if (!glyph) continue
      labels.push({
        x: n.x,
        y: n.y + n.radius + 6 / scale,
        text: n.label,
        color: [1.0, 1.0, 1.0, 1.0], // white for readability
      })
    }
    return labels
  }

  /** Render labels — instanced with per-glyph UVs */
  render(
    labels: LabelInfo[],
    width: number,
    height: number,
    tx: number,
    ty: number,
    scale: number,
    zOffset = 0,
  ): void {
    if (labels.length === 0) return

    const gl = this.gl
    const texture = this.atlas.getTexture(gl)

    gl.useProgram(this.program)
    gl.uniform2f(this.uResolution, width, height)
    gl.uniform2f(this.uTranslation, tx, ty)
    gl.uniform1f(this.uScale, scale)
    gl.uniform1f(this.uZOffset, zOffset)
    gl.uniform1i(this.uTexture, 0)

    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, texture)

    gl.bindVertexArray(this.quadVao)

    const N = labels.length
    const centerData = new Float32Array(N * 2)
    const sizeData = new Float32Array(N * 2)
    const colorData = new Float32Array(N * 4)
    const uvOriginData = new Float32Array(N * 2)
    const uvSizeData = new Float32Array(N * 2)

    for (let i = 0; i < N; i++) {
      const l = labels[i]
      const glyph = this.atlas.getOrCreate(l.text)
      if (!glyph) continue

      centerData[i * 2] = l.x
      centerData[i * 2 + 1] = l.y
      sizeData[i * 2] = glyph.pw / scale
      sizeData[i * 2 + 1] = glyph.ph / scale
      colorData.set(l.color, i * 4)
      uvOriginData[i * 2] = glyph.uv[0]
      uvOriginData[i * 2 + 1] = glyph.uv[1]
      uvSizeData[i * 2] = glyph.uv[2] - glyph.uv[0]
      uvSizeData[i * 2 + 1] = glyph.uv[3] - glyph.uv[1]
    }

    this.instancedAttrib(1, centerData, 2)
    this.instancedAttrib(2, sizeData, 2)
    this.instancedAttrib(3, colorData, 4)
    this.instancedAttrib(4, uvOriginData, 2)
    this.instancedAttrib(5, uvSizeData, 2)

    gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, N)
    for (let loc = 1; loc <= 5; loc++) gl.vertexAttribDivisor(loc, 0)
    gl.bindVertexArray(null)
  }

  private instancedAttrib(
    loc: number,
    data: Float32Array,
    comps: number,
  ): void {
    const gl = this.gl
    const buf = gl.createBuffer()!
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW)
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, comps, gl.FLOAT, false, 0, 0)
    gl.vertexAttribDivisor(loc, 1)
  }

  /** Pre-register all labels to build atlas */
  preRegister(texts: string[]): void {
    for (const t of texts) {
      if (t) this.atlas.getOrCreate(t)
    }
  }

  destroy(): void {
    this.gl.deleteProgram(this.program)
  }
}
