/**
 * TextureAtlas — 逐字符 SDF 纹理图集。
 *
 * 每个字符渲染到正方形 slot，blur 生成距离场梯度，
 * fragment shader 通过 smoothstep 实现任意缩放下清晰边沿。
 */
export interface AtlasGlyph {
  /** Normalized UV: [u0, v0, u1, v1] */
  uv: [number, number, number, number]
  /** 视觉像素尺寸 */
  pw: number
  ph: number
  /** 字符水平步进 */
  advance: number
}

export class TextureAtlas {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private texture: WebGLTexture | null = null
  private entries = new Map<string, AtlasGlyph>()
  private buf: number
  private slotSize: number
  private cursorX = 2
  private cursorY = 2
  private rowHeight = 0
  private fontSize: number
  private fontFamily: string
  private dirty = true

  private charCanvas: HTMLCanvasElement
  private charCtx: CanvasRenderingContext2D

  constructor(size = 2048, fontSize = 48, fontFamily = "sans-serif") {
    this.canvas = document.createElement("canvas")
    this.canvas.width = size
    this.canvas.height = size
    this.ctx = this.canvas.getContext("2d")!
    this.fontSize = fontSize
    this.fontFamily = fontFamily
    this.buf = Math.max(2, Math.ceil(fontSize / 8))
    this.slotSize = fontSize + 2 * this.buf

    this.charCanvas = document.createElement("canvas")
    this.charCanvas.width = this.slotSize
    this.charCanvas.height = this.slotSize
    this.charCtx = this.charCanvas.getContext("2d")!
    this.charCtx.textBaseline = "middle"
    this.charCtx.textAlign = "center"
    this.charCtx.font = `${fontSize}px ${fontFamily}`
  }

  getTexture(gl: WebGL2RenderingContext): WebGLTexture {
    if (!this.texture) {
      this.texture = gl.createTexture()!
      gl.bindTexture(gl.TEXTURE_2D, this.texture)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    }
    if (this.dirty) this.upload(gl)
    return this.texture
  }

  getOrCreate(char: string): AtlasGlyph | null {
    if (!char) return null
    const existing = this.entries.get(char)
    if (existing) return existing

    const slot = this.slotSize
    if (this.cursorX + slot > this.canvas.width) {
      this.cursorX = 2
      this.cursorY += this.rowHeight + 2
      this.rowHeight = 0
    }
    if (this.cursorY + slot > this.canvas.height) {
      console.warn("[TextureAtlas] overflow:", char)
      return null
    }

    // 1) 逐字符绘制到临时 canvas
    this.charCtx.clearRect(0, 0, slot, slot)
    this.charCtx.fillStyle = "#ffffff"
    this.charCtx.fillText(char, slot / 2, slot / 2)

    // 2) 复制到主图集
    this.ctx.drawImage(this.charCanvas, this.cursorX, this.cursorY)

    const m = this.charCtx.measureText(char)
    const w = this.canvas.width
    const h = this.canvas.height
    const glyph: AtlasGlyph = {
      uv: [
        this.cursorX / w,
        this.cursorY / h,
        (this.cursorX + slot) / w,
        (this.cursorY + slot) / h,
      ],
      pw: this.fontSize,
      ph: this.fontSize,
      advance: m.width,
    }

    this.entries.set(char, glyph)
    this.cursorX += slot + 1
    this.rowHeight = Math.max(this.rowHeight, slot)
    this.dirty = true
    return glyph
  }

  private upload(gl: WebGL2RenderingContext): void {
    gl.bindTexture(gl.TEXTURE_2D, this.texture)
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      this.canvas,
    )
    this.dirty = false
  }

  clear(): void {
    this.entries.clear()
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.cursorX = 2
    this.cursorY = 2
    this.rowHeight = 0
    this.dirty = true
  }

  get size(): number {
    return this.entries.size
  }
}
