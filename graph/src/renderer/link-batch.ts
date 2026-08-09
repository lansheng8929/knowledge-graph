/**
 * LinkBatchRenderer — instanced line segment + arrow rendering with WebGL2
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

  // ── Line program ──
  private lineProgram: WebGLProgram
  private linePickProgram: WebGLProgram

  // ── Arrow program ──
  private arrowProgram: WebGLProgram
  private arrowPickProgram: WebGLProgram

  // ── VAOs ──
  private lineVao: WebGLVertexArrayObject | null = null
  private arrowVao: WebGLVertexArrayObject | null = null
  private _lineVerts = 0 // triangle strip vertex count

  // Uniforms (line render)
  private uLineResolution: WebGLUniformLocation | null = null
  private uLineTranslation: WebGLUniformLocation | null = null
  private uLineScale: WebGLUniformLocation | null = null
  private uLineZOffset: WebGLUniformLocation | null = null

  // Uniforms (line pick)
  private uLinePickResolution: WebGLUniformLocation | null = null
  private uLinePickTranslation: WebGLUniformLocation | null = null
  private uLinePickScale: WebGLUniformLocation | null = null
  private uLinePickZOffset: WebGLUniformLocation | null = null
  private uLinePickIdOffset: WebGLUniformLocation | null = null

  // Uniforms (arrow render)
  private uArrowResolution: WebGLUniformLocation | null = null
  private uArrowTranslation: WebGLUniformLocation | null = null
  private uArrowScale: WebGLUniformLocation | null = null

  // Uniforms (arrow pick)
  private uArrowPickResolution: WebGLUniformLocation | null = null
  private uArrowPickTranslation: WebGLUniformLocation | null = null
  private uArrowPickScale: WebGLUniformLocation | null = null

  // 动态 instanced buffer 缓存（按 attrib loc 复用，避免每帧 createBuffer 泄漏 + GC 卡顿）
  private _dynBufs = new Map<number, WebGLBuffer>()
  private _dynBufSizes = new Map<number, number>()

  constructor(gl: WebGL2RenderingContext) {
    this.gl = gl
    this.lineProgram = this.compile(LINE_VS, LINE_FS)
    this.linePickProgram = this.compile(PICK_LINE_VS, PICK_LINE_FS)
    this.arrowProgram = this.compile(ARROW_VS, ARROW_FS)
    this.arrowPickProgram = this.compile(PICK_ARROW_VS, PICK_ARROW_FS)

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
    // Line render
    this.uLineResolution = gl.getUniformLocation(
      this.lineProgram,
      "u_resolution",
    )
    this.uLineTranslation = gl.getUniformLocation(
      this.lineProgram,
      "u_translation",
    )
    this.uLineScale = gl.getUniformLocation(this.lineProgram, "u_scale")
    this.uLineZOffset = gl.getUniformLocation(this.lineProgram, "u_zOffset")

    // Line pick
    this.uLinePickResolution = gl.getUniformLocation(
      this.linePickProgram,
      "u_resolution",
    )
    this.uLinePickTranslation = gl.getUniformLocation(
      this.linePickProgram,
      "u_translation",
    )
    this.uLinePickScale = gl.getUniformLocation(this.linePickProgram, "u_scale")
    this.uLinePickZOffset = gl.getUniformLocation(
      this.linePickProgram,
      "u_zOffset",
    )
    this.uLinePickIdOffset = gl.getUniformLocation(
      this.linePickProgram,
      "u_idOffset",
    )

    // Arrow render
    this.uArrowResolution = gl.getUniformLocation(
      this.arrowProgram,
      "u_resolution",
    )
    this.uArrowTranslation = gl.getUniformLocation(
      this.arrowProgram,
      "u_translation",
    )
    this.uArrowScale = gl.getUniformLocation(this.arrowProgram, "u_scale")

    // Arrow pick
    this.uArrowPickResolution = gl.getUniformLocation(
      this.arrowPickProgram,
      "u_resolution",
    )
    this.uArrowPickTranslation = gl.getUniformLocation(
      this.arrowPickProgram,
      "u_translation",
    )
    this.uArrowPickScale = gl.getUniformLocation(
      this.arrowPickProgram,
      "u_scale",
    )
  }

  /** 三角带：t∈[0,1] 分割为 SEGMENTS 段, side=±1 交替 */
  private initLineGeometry(): void {
    const gl = this.gl
    const SEGMENTS = 16
    const verts = new Float32Array((SEGMENTS + 1) * 4) // 每对 (t, side) 2 floats
    for (let i = 0; i <= SEGMENTS; i++) {
      const t = i / SEGMENTS
      const base = i * 4
      verts[base] = t
      verts[base + 1] = -1.0 // left
      verts[base + 2] = t
      verts[base + 3] = 1.0 // right
    }

    const vao = gl.createVertexArray()!
    gl.bindVertexArray(vao)

    const buf = gl.createBuffer()!
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW)
    gl.enableVertexAttribArray(0)
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)

    gl.bindVertexArray(null)
    this.lineVao = vao
    this._lineVerts = (SEGMENTS + 1) * 2
  }

  /** 箭头三角形：x∈[-1,0] 沿方向偏移, y=±0.5 垂直宽度 */
  private initArrowGeometry(): void {
    const gl = this.gl
    const arrowPos = new Float32Array([-0.6, -0.45, -0.6, 0.45, -0.01, 0])

    const vao = gl.createVertexArray()!
    gl.bindVertexArray(vao)

    const buf = gl.createBuffer()!
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, arrowPos, gl.STATIC_DRAW)
    gl.enableVertexAttribArray(0)
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)

    gl.bindVertexArray(null)
    this.arrowVao = vao
  }

  /** Render link lines + arrows in two draw calls */
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
    const CURVE = 12

    // ── 按 (sourceId→targetId) 有向分组，计算二次 Bézier 控制点 ──
    const midX = new Float32Array(N),
      midY = new Float32Array(N)
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

    // ── 准备 instanced 数据 ──
    const srcData = new Float32Array(N * 2) // P0 — start (节点中心)
    const midData = new Float32Array(N * 2) // P1 — 控制点
    const tgtData = new Float32Array(N * 2) // P2 — end   (节点中心)
    const colorData = new Float32Array(N * 4)
    const widthData = new Float32Array(N)
    const arrowTipData = new Float32Array(N * 2) // 箭头尖端（节点边缘）
    const arrowDirData = new Float32Array(N * 2)
    const arrowSizeData = new Float32Array(N)

    for (let i = 0; i < N; i++) {
      const l = links[i]
      const tr = l.targetRadius ?? 0

      // 线端点：节点中心（不做半径偏移）
      srcData[i * 2] = l.sourceX
      srcData[i * 2 + 1] = l.sourceY
      tgtData[i * 2] = l.targetX
      tgtData[i * 2 + 1] = l.targetY

      // 控制点：曲线用计算值，直线用中点（(start+end)/2 使二次 Bézier 退化为直线）
      const mx = midX[i],
        my = midY[i]
      if (mx === 0 && my === 0) {
        midData[i * 2] = (l.sourceX + l.targetX) / 2
        midData[i * 2 + 1] = (l.sourceY + l.targetY) / 2
      } else {
        midData[i * 2] = mx
        midData[i * 2 + 1] = my
      }

      // 曲线到达方向：target → mid 的反方向（即 Bézier 在 t=1 的切线方向）
      const adx = l.targetX - midData[i * 2]
      const ady = l.targetY - midData[i * 2 + 1]
      const alen = Math.sqrt(adx * adx + ady * ady)
      const aux = alen > 0.001 ? adx / alen : 1
      const auy = alen > 0.001 ? ady / alen : 0

      // 箭头尖端：沿曲线到达方向回退半径距离
      arrowTipData[i * 2] = l.targetX - aux * tr
      arrowTipData[i * 2 + 1] = l.targetY - auy * tr

      colorData.set(l.color, i * 4)
      widthData[i] = l.width

      // 箭头方向 = tangent at t=1
      arrowDirData[i * 2] = adx
      arrowDirData[i * 2 + 1] = ady
      arrowSizeData[i] = l.arrowSize ?? Math.max(6, l.width * 16 + 4)
    }

    // ── 批量绘制线段（一次 instanced draw；避免逐条 2000+ draw call 拖低帧率） ──
    gl.useProgram(this.lineProgram)
    gl.uniform2f(this.uLineResolution, width, height)
    gl.uniform2f(this.uLineTranslation, tx, ty)
    gl.uniform1f(this.uLineScale, scale)
    gl.uniform1f(this.uLineZOffset, zOffset)
    gl.bindVertexArray(this.lineVao)

    this.instancedAttrib(1, srcData, 2)
    this.instancedAttrib(2, midData, 2)
    this.instancedAttrib(3, tgtData, 2)
    this.instancedAttrib(4, colorData, 4)
    this.instancedAttrib(5, widthData, 1)
    gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, this._lineVerts, N)
    for (let loc = 1; loc <= 5; loc++) gl.vertexAttribDivisor(loc, 0)
    gl.bindVertexArray(null)

    // ── 批量绘制箭头（关闭混合，避免半透明叠加） ──
    if (showArrows) {
      gl.useProgram(this.arrowProgram)
      gl.uniform2f(this.uArrowResolution, width, height)
      gl.uniform2f(this.uArrowTranslation, tx, ty)
      gl.uniform1f(this.uArrowScale, scale)
      gl.bindVertexArray(this.arrowVao)

      gl.disable(gl.BLEND)

      this.instancedAttrib(1, arrowTipData, 2)
      this.instancedAttrib(2, arrowDirData, 2)
      this.instancedAttrib(3, colorData, 4)
      this.instancedAttrib(4, arrowSizeData, 1)
      gl.drawArraysInstanced(gl.TRIANGLES, 0, 3, N)
      for (let loc = 1; loc <= 4; loc++) gl.vertexAttribDivisor(loc, 0)

      gl.enable(gl.BLEND)
      gl.bindVertexArray(null)
    }

    gl.bindVertexArray(null)
  }

  /** Batch-render links for FBO picking (lines only, triangle strip) */
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
    const N = links.length
    const CURVE = 12

    // ── 按 (sourceId→targetId) 有向分组，计算二次 Bézier 控制点（与 render() 保持一致） ──
    const midX = new Float32Array(N),
      midY = new Float32Array(N)
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

    gl.useProgram(this.linePickProgram)
    gl.uniform2f(this.uLinePickResolution, width, height)
    gl.uniform2f(this.uLinePickTranslation, tx, ty)
    gl.uniform1f(this.uLinePickScale, scale)
    gl.uniform1f(this.uLinePickZOffset, zOffset)
    gl.uniform1ui(this.uLinePickIdOffset, idOffset)

    gl.bindVertexArray(this.lineVao)

    const startData = new Float32Array(N * 2)
    const midData = new Float32Array(N * 2)
    const endData = new Float32Array(N * 2)
    const colorData = new Float32Array(N * 4)
    const widthData = new Float32Array(N)

    for (let i = 0; i < N; i++) {
      const l = links[i]
      const sx = l.sourceX,
        sy = l.sourceY
      const tx = l.targetX,
        ty = l.targetY
      startData[i * 2] = sx
      startData[i * 2 + 1] = sy
      endData[i * 2] = tx
      endData[i * 2 + 1] = ty

      // 使用与视觉 render 一致的曲线控制点
      const mx = midX[i],
        my = midY[i]
      if (mx === 0 && my === 0) {
        midData[i * 2] = (sx + tx) / 2
        midData[i * 2 + 1] = (sy + ty) / 2
      } else {
        midData[i * 2] = mx
        midData[i * 2 + 1] = my
      }

      widthData[i] = l.width + 8
    }

    this.instancedAttrib(1, startData, 2)
    this.instancedAttrib(2, midData, 2)
    this.instancedAttrib(3, endData, 2)
    this.instancedAttrib(4, colorData, 4)
    this.instancedAttrib(5, widthData, 1)

    gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, this._lineVerts, N)
    for (let loc = 1; loc <= 5; loc++) gl.vertexAttribDivisor(loc, 0)
    gl.bindVertexArray(null)
  }

  private instancedAttrib(
    loc: number,
    data: Float32Array,
    comps: number,
  ): void {
    const gl = this.gl
    this.uploadDynamic(loc, data)
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, comps, gl.FLOAT, false, 0, 0)
    gl.vertexAttribDivisor(loc, 1)
  }

  private instancedSingle(loc: number, x: number, y: number): void {
    this.instancedSingle1Arr(loc, new Float32Array([x, y]), 2)
  }

  private instancedSingle1(loc: number, v: number): void {
    this.instancedSingle1Arr(loc, new Float32Array([v]), 1)
  }

  private instancedSingle4(
    loc: number,
    arr: Float32Array,
    offset: number,
  ): void {
    this.instancedSingle1Arr(loc, arr.slice(offset, offset + 4), 4)
  }

  private instancedSingle1Arr(
    loc: number,
    data: Float32Array,
    comps: number,
  ): void {
    const gl = this.gl
    this.uploadDynamic(loc, data)
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, comps, gl.FLOAT, false, 0, 0)
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
    gl.deleteProgram(this.lineProgram)
    gl.deleteProgram(this.linePickProgram)
    gl.deleteProgram(this.arrowProgram)
    gl.deleteProgram(this.arrowPickProgram)
  }
}
