/**
 * NodeBatchRenderer — instanced circle rendering with WebGL2 + SDF.
 *
 * All nodes rendered in a single instanced draw call.
 */

import { NODE_VS, NODE_FS, PICK_NODE_VS, PICK_NODE_FS } from "./shaders.js"

/** Shape type → float for shader uniform (always circle) */
export function shapeToType(_shape?: string): number {
  return 0
}

/** Node interface accepted by the batch renderer */
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

export class NodeBatchRenderer {
  private gl: WebGL2RenderingContext
  private program: WebGLProgram
  private pickProgram: WebGLProgram

  // Shared quad geometry (unit square centered at origin)
  private quadVao: WebGLVertexArrayObject | null = null

  // Uniform locations (render)
  private uResolution: WebGLUniformLocation | null = null
  private uTranslation: WebGLUniformLocation | null = null
  private uScale: WebGLUniformLocation | null = null
  private uZOffset: WebGLUniformLocation | null = null

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
    nodes: BatchNode[],
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
    }

    this.setupInstanceBuffer(1, center, 2)
    this.setupInstanceBuffer(2, radius, 1)
    this.setupInstanceBuffer(3, color, 4)
    this.setupInstanceBuffer(4, strokeColor, 4)
    this.setupInstanceBuffer(5, strokeWidth, 1)
    this.setupInstanceBuffer(6, shapeType, 1)
    this.setupInstanceBuffer(7, shapeParam, 1)

    gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, N)

    // Reset divisors to 0 for non-instanced attributes
    for (let loc = 1; loc <= 7; loc++) {
      gl.vertexAttribDivisor(loc, 0)
    }
    gl.bindVertexArray(null)
  }

  /** Batch-render all nodes for FBO picking (single draw call, gl_InstanceID encodes index) */
  renderPicking(
    nodes: BatchNode[],
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
    const buf = gl.createBuffer()!
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW)
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, components, gl.FLOAT, false, 0, 0)
    gl.vertexAttribDivisor(loc, 1)
  }

  destroy(): void {
    const gl = this.gl
    gl.deleteProgram(this.program)
    gl.deleteProgram(this.pickProgram)
  }
}
