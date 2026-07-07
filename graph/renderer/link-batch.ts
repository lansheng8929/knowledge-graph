/**
 * LinkBatchRenderer — instanced line segment rendering with WebGL2
 */

import {
  LINE_VS,
  LINE_FS,
  PICK_LINE_VS,
  PICK_LINE_FS,
  ARROW_VS,
  ARROW_FS,
  PICK_ARROW_VS,
  PICK_ARROW_FS,
} from "./shaders.js"
import type { RenderLink } from "./types.js"

export class LinkBatchRenderer {
  private gl: WebGL2RenderingContext
  private program: WebGLProgram
  private pickProgram: WebGLProgram
  private arrowProgram: WebGLProgram
  private pickArrowProgram: WebGLProgram

  // Line quad geometry: a_position.x = [0,1] along line, a_position.y = [-1,1] perpendicular
  private lineVao: WebGLVertexArrayObject | null = null
  // Arrow triangle geometry
  private arrowVao: WebGLVertexArrayObject | null = null

  // Uniforms (line render)
  private uResolution: WebGLUniformLocation | null = null
  private uTranslation: WebGLUniformLocation | null = null
  private uScale: WebGLUniformLocation | null = null

  // Uniforms (line pick)
  private uPickResolution: WebGLUniformLocation | null = null
  private uPickTranslation: WebGLUniformLocation | null = null
  private uPickScale: WebGLUniformLocation | null = null
  private uPickColor: WebGLUniformLocation | null = null

  // Uniforms (arrow render)
  private uArrowResolution: WebGLUniformLocation | null = null
  private uArrowTranslation: WebGLUniformLocation | null = null
  private uArrowScale: WebGLUniformLocation | null = null

  // Uniforms (arrow pick)
  private uPickArrowResolution: WebGLUniformLocation | null = null
  private uPickArrowTranslation: WebGLUniformLocation | null = null
  private uPickArrowScale: WebGLUniformLocation | null = null
  private uPickArrowColor: WebGLUniformLocation | null = null

  constructor(gl: WebGL2RenderingContext) {
    this.gl = gl
    this.program = this.compile(LINE_VS, LINE_FS)
    this.pickProgram = this.compile(PICK_LINE_VS, PICK_LINE_FS)
    this.arrowProgram = this.compile(ARROW_VS, ARROW_FS)
    this.pickArrowProgram = this.compile(PICK_ARROW_VS, PICK_ARROW_FS)

    this.initLineGeometry()
    this.initArrowGeometry()
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

    this.uPickResolution = gl.getUniformLocation(
      this.pickProgram,
      "u_resolution",
    )
    this.uPickTranslation = gl.getUniformLocation(
      this.pickProgram,
      "u_translation",
    )
    this.uPickScale = gl.getUniformLocation(this.pickProgram, "u_scale")
    this.uPickColor = gl.getUniformLocation(this.pickProgram, "u_pickColor")

    this.uArrowResolution = gl.getUniformLocation(
      this.arrowProgram,
      "u_resolution",
    )
    this.uArrowTranslation = gl.getUniformLocation(
      this.arrowProgram,
      "u_translation",
    )
    this.uArrowScale = gl.getUniformLocation(this.arrowProgram, "u_scale")

    this.uPickArrowResolution = gl.getUniformLocation(
      this.pickArrowProgram,
      "u_resolution",
    )
    this.uPickArrowTranslation = gl.getUniformLocation(
      this.pickArrowProgram,
      "u_translation",
    )
    this.uPickArrowScale = gl.getUniformLocation(
      this.pickArrowProgram,
      "u_scale",
    )
    this.uPickArrowColor = gl.getUniformLocation(
      this.pickArrowProgram,
      "u_pickColor",
    )
  }

  private initLineGeometry(): void {
    const gl = this.gl
    // Two triangles forming a quad along the line
    // a_position: (x = 0..1 along line, y = -1..1 across line)
    const pos = new Float32Array([0, -1, 1, -1, 0, 1, 0, 1, 1, -1, 1, 1])

    const vao = gl.createVertexArray()!
    gl.bindVertexArray(vao)

    const buf = gl.createBuffer()!
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, pos, gl.STATIC_DRAW)
    gl.enableVertexAttribArray(0)
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)

    gl.bindVertexArray(null)
    this.lineVao = vao
  }

  private initArrowGeometry(): void {
    const gl = this.gl
    // Arrow triangle: tip at (0,0), base at (-1,±0.5)
    const pos = new Float32Array([-1, -0.5, -1, 0.5, 0, 0])

    const vao = gl.createVertexArray()!
    gl.bindVertexArray(vao)

    const buf = gl.createBuffer()!
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, pos, gl.STATIC_DRAW)
    gl.enableVertexAttribArray(0)
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)

    gl.bindVertexArray(null)
    this.arrowVao = vao
  }

  /** Render link lines */
  render(
    links: RenderLink[],
    width: number,
    height: number,
    tx: number,
    ty: number,
    scale: number,
    showArrows = false,
  ): void {
    if (links.length === 0) return

    const gl = this.gl

    // --- Lines ---
    gl.useProgram(this.program)
    gl.uniform2f(this.uResolution, width, height)
    gl.uniform2f(this.uTranslation, tx, ty)
    gl.uniform1f(this.uScale, scale)

    gl.bindVertexArray(this.lineVao)

    const srcData = new Float32Array(links.length * 2)
    const tgtData = new Float32Array(links.length * 2)
    const colorData = new Float32Array(links.length * 4)
    const widthData = new Float32Array(links.length)

    for (let i = 0; i < links.length; i++) {
      const l = links[i]
      srcData[i * 2] = l.sourceX
      srcData[i * 2 + 1] = l.sourceY
      tgtData[i * 2] = l.targetX
      tgtData[i * 2 + 1] = l.targetY
      colorData.set(l.color, i * 4)
      widthData[i] = l.width
    }

    this.instancedAttrib(1, srcData, 2)
    this.instancedAttrib(2, tgtData, 2)
    this.instancedAttrib(3, colorData, 4)
    this.instancedAttrib(4, widthData, 1)

    gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, links.length)
    for (let loc = 1; loc <= 4; loc++) gl.vertexAttribDivisor(loc, 0)
    gl.bindVertexArray(null)

    // --- Arrows ---
    if (showArrows) {
      gl.useProgram(this.arrowProgram)
      gl.uniform2f(this.uArrowResolution, width, height)
      gl.uniform2f(this.uArrowTranslation, tx, ty)
      gl.uniform1f(this.uArrowScale, scale)

      gl.bindVertexArray(this.arrowVao)

      const tipData = new Float32Array(links.length * 2)
      const dirData = new Float32Array(links.length * 2)
      const arrColorData = new Float32Array(links.length * 4)
      const sizeData = new Float32Array(links.length)

      for (let i = 0; i < links.length; i++) {
        const l = links[i]
        tipData[i * 2] = l.targetX
        tipData[i * 2 + 1] = l.targetY
        const dx = l.targetX - l.sourceX
        const dy = l.targetY - l.sourceY
        const len = Math.sqrt(dx * dx + dy * dy)
        if (len > 0.001) {
          dirData[i * 2] = dx / len
          dirData[i * 2 + 1] = dy / len
        }
        arrColorData.set(l.color, i * 4)
        sizeData[i] = 8 // arrow size in world units
      }

      this.instancedAttrib(1, tipData, 2)
      this.instancedAttrib(2, dirData, 2)
      this.instancedAttrib(3, arrColorData, 4)
      this.instancedAttrib(4, sizeData, 1)

      gl.drawArraysInstanced(gl.TRIANGLES, 0, 3, links.length)
      for (let loc = 1; loc <= 4; loc++) gl.vertexAttribDivisor(loc, 0)
      gl.bindVertexArray(null)
    }
  }

  /** Render links for picking */
  renderPicking(
    links: RenderLink[],
    width: number,
    height: number,
    tx: number,
    ty: number,
    scale: number,
    pickColor: [number, number, number, number],
  ): void {
    if (links.length === 0) return

    const gl = this.gl

    // Lines picking
    gl.useProgram(this.pickProgram)
    gl.uniform2f(this.uPickResolution, width, height)
    gl.uniform2f(this.uPickTranslation, tx, ty)
    gl.uniform1f(this.uPickScale, scale)
    gl.uniform4f(this.uPickColor, ...pickColor)

    gl.bindVertexArray(this.lineVao)

    const srcData = new Float32Array(links.length * 2)
    const tgtData = new Float32Array(links.length * 2)
    const colorData = new Float32Array(links.length * 4)
    const widthData = new Float32Array(links.length)

    for (let i = 0; i < links.length; i++) {
      const l = links[i]
      srcData[i * 2] = l.sourceX
      srcData[i * 2 + 1] = l.sourceY
      tgtData[i * 2] = l.targetX
      tgtData[i * 2 + 1] = l.targetY
      widthData[i] = l.width + 4 // wider for easier picking
    }

    this.instancedAttrib(1, srcData, 2)
    this.instancedAttrib(2, tgtData, 2)
    this.instancedAttrib(3, colorData, 4)
    this.instancedAttrib(4, widthData, 1)

    gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, links.length)
    for (let loc = 1; loc <= 4; loc++) gl.vertexAttribDivisor(loc, 0)
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

  destroy(): void {
    const gl = this.gl
    gl.deleteProgram(this.program)
    gl.deleteProgram(this.pickProgram)
    gl.deleteProgram(this.arrowProgram)
    gl.deleteProgram(this.pickArrowProgram)
  }
}
