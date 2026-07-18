/**
 * TextureAtlas — GPU text rendering via canvas-based texture atlas.
 *
 * Renders text labels to an offscreen canvas, uploads as a WebGL texture,
 * then renders textured quads per label.
 */

export interface AtlasGlyph {
  /** Normalized UV: [u0, v0, u1, v1] */
  uv: [number, number, number, number]
  /** Pixel size of glyph in atlas */
  pw: number
  ph: number
}

export interface AtlasEntry {
  text: string
  glyph: AtlasGlyph
}

export class TextureAtlas {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private texture: WebGLTexture | null = null
  private entries = new Map<string, AtlasGlyph>()
  private cursorX = 2
  private cursorY = 2
  private rowHeight = 0
  private fontSize: number
  private fontFamily: string
  private dirty = true

  constructor(size = 2048, fontSize = 24, fontFamily = "sans-serif") {
    this.canvas = document.createElement("canvas")
    this.canvas.width = size
    this.canvas.height = size
    this.ctx = this.canvas.getContext("2d")!
    this.fontSize = fontSize
    this.fontFamily = fontFamily
    this.ctx.font = `${fontSize}px ${fontFamily}`
    this.ctx.textBaseline = "top"
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
    if (this.dirty) {
      this.upload(gl)
    }
    return this.texture
  }

  /** Get or create a glyph for text. Returns normalized UV coords */
  getOrCreate(text: string): AtlasGlyph | null {
    if (!text) return null
    const existing = this.entries.get(text)
    if (existing) return existing

    const metrics = this.ctx.measureText(text)
    const tw = Math.ceil(metrics.width) + 4
    const th = this.fontSize + 4

    if (this.cursorX + tw > this.canvas.width) {
      this.cursorX = 2
      this.cursorY += this.rowHeight + 2
      this.rowHeight = 0
    }
    if (this.cursorY + th > this.canvas.height) {
      console.warn("[TextureAtlas] Atlas overflow, cannot add:", text)
      return null
    }

    // Draw to atlas
    this.ctx.fillStyle = "#ffffff"
    this.ctx.fillText(text, this.cursorX + 2, this.cursorY + 2)

    const w = this.canvas.width
    const h = this.canvas.height
    const glyph: AtlasGlyph = {
      uv: [
        this.cursorX / w,
        this.cursorY / h,
        (this.cursorX + tw) / w,
        (this.cursorY + th) / h,
      ],
      pw: tw,
      ph: th,
    }

    this.entries.set(text, glyph)
    this.cursorX += tw + 4
    this.rowHeight = Math.max(this.rowHeight, th)
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

  /** Clear all entries */
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
