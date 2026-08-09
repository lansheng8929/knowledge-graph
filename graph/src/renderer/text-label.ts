/**
 * TextLabelRenderer — 逐字符 instanced SDF 文字渲染。
 */
import { TEXT_VS, TEXT_FS } from "./shaders.js"
import { TextureAtlas, type AtlasGlyph } from "./atlas.js"
import type { RenderNode, RenderLink } from "./types.js"

/** 单个字符的渲染数据 */
export interface CharInfo {
  x: number
  y: number
  char: string
  color: [number, number, number, number]
  /** 相对于图集字号的缩放倍数 */
  scale: number
  /** 旋转角度（弧度），0=不旋转 */
  angle?: number
}

export class TextLabelRenderer {
  private gl: WebGL2RenderingContext
  private program: WebGLProgram
  private atlas: TextureAtlas
  private quadVao: WebGLVertexArrayObject | null = null
  private fontSize: number
  /** 字符间距（世界像素），按图集字号计算 */
  private letterSpacing: number

  private uResolution: WebGLUniformLocation | null = null
  private uTranslation: WebGLUniformLocation | null = null
  private uScale: WebGLUniformLocation | null = null
  private uZOffset: WebGLUniformLocation | null = null
  private uTexture: WebGLUniformLocation | null = null

  // 动态 instanced buffer 缓存（复用，避免每帧 createBuffer 泄漏 + GC 卡顿）
  private _dynBufs = new Map<number, WebGLBuffer>()
  private _dynBufSizes = new Map<number, number>()

  constructor(
    gl: WebGL2RenderingContext,
    atlasSize = 2048,
    fontSize = 48,
    letterSpacingRatio = 0.0,
  ) {
    this.gl = gl
    this.fontSize = fontSize
    this.letterSpacing = Math.round(fontSize * letterSpacingRatio)
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
    const positions = new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1])
    const vao = gl.createVertexArray()!
    gl.bindVertexArray(vao)
    const buf = gl.createBuffer()!
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW)
    gl.enableVertexAttribArray(0)
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)
    gl.bindVertexArray(null)
    this.quadVao = vao
  }

  /** 将节点标签展开为逐字符 quads */
  buildNodeLabels(
    nodes: RenderNode[],
    scale: number,
    minScale: number,
  ): CharInfo[] {
    const chars: CharInfo[] = []
    if (scale < minScale) return chars

    for (const n of nodes) {
      if (!n.label) continue
      const tc = n.textColor ?? [1.0, 1.0, 1.0, 1.0]
      const fs = (n.fontSize ?? this.fontSize) / this.fontSize
      const charScale = scale
      let cx = n.x - this.measureWidth(n.label, fs) / (2 * charScale)
      // 屏幕空间 gap：节点半径的 22%，下限 4px，上限 24px，+额外偏移
      const screenR = n.radius * scale
      const screenGap = Math.min(Math.max(screenR * 0.22, 4), 24) + 8
      const cy = n.y + n.radius + screenGap / scale
      for (const ch of n.label) {
        const glyph = this.atlas.getOrCreate(ch)
        if (!glyph) continue
        chars.push({
          x: cx + (glyph.advance * fs) / (2 * charScale),
          y: cy,
          char: ch,
          color: tc,
          scale: fs,
        })
        cx += ((glyph.advance + this.letterSpacing) * fs) / charScale
      }
    }
    return chars
  }

  /** 估算标签世界宽度（乘以 fontSize 缩放 + 间距） */
  private measureWidth(text: string, scale: number): number {
    let w = 0
    for (const ch of text) {
      const g = this.atlas.getOrCreate(ch)
      if (g) w += (g.advance + this.letterSpacing) * scale
    }
    return w
  }

  buildLinkLabels(
    links: RenderLink[],
    scale: number,
    minScale: number,
  ): CharInfo[] {
    const chars: CharInfo[] = []
    if (scale < minScale) return chars

    // ── 平行边错开（与 link-batch.ts updateData 保持一致）──
    // 同对(有向)节点之间有多条边时，边线会沿法线偏移成弧线；label 必须跟随
    // 各自弧线的控制点，否则所有平行边 label 会堆叠在同一边中点。
    const N = links.length
    const midX = new Float32Array(N)
    const midY = new Float32Array(N)
    const CURVE = 12
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

    for (let i = 0; i < N; i++) {
      const l = links[i]
      if (!l.label) continue
      // 边标签颜色：深灰色
      const tc: [number, number, number, number] = [0.35, 0.35, 0.35, 0.9]

      // 线方向角度
      const dx = l.targetX - l.sourceX
      const dy = l.targetY - l.sourceY
      const lineLen = Math.sqrt(dx * dx + dy * dy)
      if (lineLen < 1) continue
      const angle = Math.atan2(dy, dx)

      // 边标签字号：world 单位 ≈ 12（图集字号 48 → fs=0.25；旧值 0.375 基于图集 32 的过时假设，偏大）
      const fs = 0.25
      const labelText = l.label
      const charScale = scale
      const textWidth = this.measureWidth(labelText, fs)

      // 平行边错开后的控制点 P1（无错开时退化为直线中点）
      const hasCurve = midX[i] !== 0 || midY[i] !== 0
      const p1x = hasCurve ? midX[i] : (l.sourceX + l.targetX) / 2
      const p1y = hasCurve ? midY[i] : (l.sourceY + l.targetY) / 2
      // label 中心 = 二次 Bézier 弧线中点 P(0.5)=0.25P0+0.5P1+0.25P2，
      // 让文字落在弧线上（而非控制点），放大后不脱离弧线轨迹。
      const mx = 0.25 * l.sourceX + 0.5 * p1x + 0.25 * l.targetX
      const my = 0.25 * l.sourceY + 0.5 * p1y + 0.25 * l.targetY

      // 沿线的方向逐个字符定位，文字居中
      const halfW = textWidth / (2 * charScale)
      let cx = mx - halfW * Math.cos(angle)
      let cy = my - halfW * Math.sin(angle)

      for (const ch of labelText) {
        const glyph = this.atlas.getOrCreate(ch)
        if (!glyph) continue
        const advance = ((glyph.advance + this.letterSpacing) * fs) / charScale
        chars.push({
          x: cx + (advance / 2) * Math.cos(angle),
          y: cy + (advance / 2) * Math.sin(angle),
          char: ch,
          color: tc,
          scale: fs,
          angle,
        })
        cx += advance * Math.cos(angle)
        cy += advance * Math.sin(angle)
      }
    }
    return chars
  }

  /** instanced 逐字符渲染 */
  render(
    chars: CharInfo[],
    width: number,
    height: number,
    tx: number,
    ty: number,
    scale: number,
    zOffset = 0,
  ): void {
    const N = chars.length
    if (N === 0) return
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

    const centerData = new Float32Array(N * 2)
    const sizeData = new Float32Array(N * 2)
    const colorData = new Float32Array(N * 4)
    const uvOriginData = new Float32Array(N * 2)
    const uvSizeData = new Float32Array(N * 2)
    const angleData = new Float32Array(N)

    for (let i = 0; i < N; i++) {
      const c = chars[i]
      const glyph = this.atlas.getOrCreate(c.char)
      if (!glyph) continue
      centerData[i * 2] = c.x
      centerData[i * 2 + 1] = c.y
      sizeData[i * 2] = (glyph.pw * c.scale) / scale
      sizeData[i * 2 + 1] = (glyph.ph * c.scale) / scale
      colorData.set(c.color, i * 4)
      uvOriginData[i * 2] = glyph.uv[0]
      uvOriginData[i * 2 + 1] = glyph.uv[1]
      uvSizeData[i * 2] = glyph.uv[2] - glyph.uv[0]
      uvSizeData[i * 2 + 1] = glyph.uv[3] - glyph.uv[1]
      angleData[i] = c.angle ?? 0
    }

    this.instancedAttrib(1, centerData, 2)
    this.instancedAttrib(2, sizeData, 2)
    this.instancedAttrib(3, colorData, 4)
    this.instancedAttrib(4, uvOriginData, 2)
    this.instancedAttrib(5, uvSizeData, 2)
    this.instancedAttrib(6, angleData, 1)

    gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, N)
    for (let loc = 1; loc <= 6; loc++) gl.vertexAttribDivisor(loc, 0)
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

  /** 预注册所有字符到图集（逐字符拆分） */
  preRegister(texts: string[]): void {
    const chars = new Set<string>()
    for (const t of texts) {
      for (const c of t) chars.add(c)
    }
    for (const c of chars) this.atlas.getOrCreate(c)
  }

  destroy(): void {
    this.gl.deleteProgram(this.program)
  }
}
