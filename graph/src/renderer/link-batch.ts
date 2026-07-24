/**
 * LinkBatchRenderer — instanced line segment rendering with WebGL2
 */

import { LINE_VS, LINE_FS, PICK_LINE_VS, PICK_LINE_FS } from "./shaders.js"
import type { RenderLink } from "./types.js"

export class LinkBatchRenderer {
  private gl: WebGL2RenderingContext
  private program: WebGLProgram
  private pickProgram: WebGLProgram

  private lineVao: WebGLVertexArrayObject | null = null

  // Uniforms (render)
  private uResolution: WebGLUniformLocation | null = null
  private uTranslation: WebGLUniformLocation | null = null
  private uScale: WebGLUniformLocation | null = null
  private uZOffset: WebGLUniformLocation | null = null

  // Uniforms (pick)
  private uPickResolution: WebGLUniformLocation | null = null
  private uPickTranslation: WebGLUniformLocation | null = null
  private uPickScale: WebGLUniformLocation | null = null
  private uPickZOffset: WebGLUniformLocation | null = null
  private uPickIdOffset: WebGLUniformLocation | null = null

  constructor(gl: WebGL2RenderingContext) {
    this.gl = gl
    this.program = this.compile(LINE_VS, LINE_FS)
    this.pickProgram = this.compile(PICK_LINE_VS, PICK_LINE_FS)

    this.initLineGeometry()
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
    this.uPickIdOffset = gl.getUniformLocation(this.pickProgram, "u_idOffset")
  }

  private initLineGeometry(): void {
    const gl = this.gl
    // Line quad (x:0..1, y:±1) + Arrow triangle (x:-1..0, y:±0.5)
    const pos = new Float32Array([
      0,
      -1,
      1,
      -1,
      0,
      1,
      0,
      1,
      1,
      -1,
      1,
      1, // line quad (x:0..1)
      -1,
      -0.5,
      -1,
      0.5,
      -0.01,
      0, // arrow tri (x:-1..-0.01, tip at -0.01)
    ])

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

  /** Render link lines + arrows in one draw call */
  render(
    links: RenderLink[],
    width: number,
    height: number,
    tx: number,
    ty: number,
    scale: number,
    showArrows = false,
    zOffset = 0,
  ): void {
    if (links.length === 0) return

    const gl = this.gl
    const N = links.length
    const CURVE = 24

    // ── 内部按 (sourceId→targetId) 有向分组 ──
    const midX = new Float32Array(N)
    const midY = new Float32Array(N)
    const groups = new Map<string, { idx: number; link: RenderLink }[]>()
    for (let i = 0; i < N; i++) {
      const l = links[i]
      const key = `${l.sourceId ?? ""}|${l.targetId ?? ""}`
      if (!groups.has(key)) groups.set(key, [])
      groups.get(key)!.push({ idx: i, link: l })
    }
    for (const [, bundle] of groups) {
      const M = bundle.length
      if (M <= 1) continue
      bundle.sort((a, b) => a.idx - b.idx)
      for (let i = 0; i < M; i++) {
        const { idx, link: l } = bundle[i]
        const dx = l.targetX - l.sourceX
        const dy = l.targetY - l.sourceY
        const len = Math.sqrt(dx * dx + dy * dy)
        const nx = len > 0.01 ? -dy / len : 1
        const ny = len > 0.01 ? dx / len : 0

        if (M % 2 === 1 && i === Math.floor(M / 2)) continue

        let pairIdx: number, side: number
        if (M % 2 === 1) {
          const center = Math.floor(M / 2)
          if (i < center) {
            pairIdx = center - i - 1
            side = 1
          } else {
            pairIdx = i - center - 1
            side = -1
          }
        } else {
          pairIdx = Math.floor(i / 2)
          side = i % 2 === 0 ? 1 : -1
        }
        const off = (pairIdx + 1) * CURVE
        midX[idx] = (l.sourceX + l.targetX) / 2 + nx * side * off
        midY[idx] = (l.sourceY + l.targetY) / 2 + ny * side * off
      }
    }

    // ── 上传 instanced 数据 ──
    gl.useProgram(this.program)
    gl.uniform2f(this.uResolution, width, height)
    gl.uniform2f(this.uTranslation, tx, ty)
    gl.uniform1f(this.uScale, scale)
    gl.uniform1f(this.uZOffset, zOffset)
    const uShowArrows = gl.getUniformLocation(this.program, "u_showArrows")
    gl.uniform1i(uShowArrows, showArrows ? 1 : 0)
    gl.bindVertexArray(this.lineVao)

    const srcData = new Float32Array(N * 2)
    const tgtData = new Float32Array(N * 2)
    const colorData = new Float32Array(N * 4)
    const widthData = new Float32Array(N)
    const midDat = new Float32Array(N * 2)
    const arrSizeData = new Float32Array(N)

    for (let i = 0; i < N; i++) {
      const l = links[i]
      const sr = l.sourceRadius ?? 0
      const tr = l.targetRadius ?? 0
      const dx = l.targetX - l.sourceX
      const dy = l.targetY - l.sourceY
      const len = Math.sqrt(dx * dx + dy * dy)
      const ux = len > 0.001 ? dx / len : 0
      const uy = len > 0.001 ? dy / len : 0
      srcData[i * 2] = l.sourceX + ux * sr
      srcData[i * 2 + 1] = l.sourceY + uy * sr
      tgtData[i * 2] = l.targetX - ux * tr
      tgtData[i * 2 + 1] = l.targetY - uy * tr
      colorData.set(l.color, i * 4)
      widthData[i] = l.width
      midDat[i * 2] = midX[i]
      midDat[i * 2 + 1] = midY[i]
      arrSizeData[i] = 10
    }

    this.instancedAttrib(1, srcData, 2)
    this.instancedAttrib(2, tgtData, 2)
    this.instancedAttrib(3, colorData, 4)
    this.instancedAttrib(4, widthData, 1)
    this.instancedAttrib(5, midDat, 2)
    this.instancedAttrib(6, arrSizeData, 1)

    gl.drawArraysInstanced(gl.TRIANGLES, 0, 9, N)
    for (let loc = 1; loc <= 6; loc++) gl.vertexAttribDivisor(loc, 0)
    gl.bindVertexArray(null)
  }

  /** Batch-render links for FBO picking (gl_InstanceID + idOffset encodes index) */
  renderPicking(
    links: RenderLink[],
    width: number,
    height: number,
    tx: number,
    ty: number,
    scale: number,
    idOffset = 0,
    zOffset = 0,
  ): void {
    if (links.length === 0) return

    const gl = this.gl

    gl.useProgram(this.pickProgram)
    gl.uniform2f(this.uPickResolution, width, height)
    gl.uniform2f(this.uPickTranslation, tx, ty)
    gl.uniform1f(this.uPickScale, scale)
    gl.uniform1f(this.uPickZOffset, zOffset)
    gl.uniform1ui(this.uPickIdOffset, idOffset)

    gl.bindVertexArray(this.lineVao)

    const srcData = new Float32Array(links.length * 2)
    const tgtData = new Float32Array(links.length * 2)
    const colorData = new Float32Array(links.length * 4)
    const widthData = new Float32Array(links.length)
    const midData = new Float32Array(links.length * 2)

    for (let i = 0; i < links.length; i++) {
      const l = links[i]
      srcData[i * 2] = l.sourceX
      srcData[i * 2 + 1] = l.sourceY
      tgtData[i * 2] = l.targetX
      tgtData[i * 2 + 1] = l.targetY
      widthData[i] = l.width + 4
      midData[i * 2] = l.midX ?? 0
      midData[i * 2 + 1] = l.midY ?? 0
    }

    this.instancedAttrib(1, srcData, 2)
    this.instancedAttrib(2, tgtData, 2)
    this.instancedAttrib(3, colorData, 4)
    this.instancedAttrib(4, widthData, 1)
    this.instancedAttrib(5, midData, 2)

    gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, links.length)
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

  destroy(): void {
    const gl = this.gl
    gl.deleteProgram(this.program)
    gl.deleteProgram(this.pickProgram)
  }
}
