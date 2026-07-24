/**
 * TextLabelRenderer — 逐字符 instanced SDF 文字渲染。
 */
import { TEXT_VS, TEXT_FS } from "./shaders.js"
import { TextureAtlas, type AtlasGlyph } from "./atlas.js"
import type { RenderNode } from "./types.js"

/** 单个字符的渲染数据 */
export interface CharInfo {
  x: number
  y: number
  char: string
  color: [number, number, number, number]
  /** 相对于图集字号的缩放倍数 */
  scale: number
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
      const cy = n.y + n.radius + 12 / scale
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
