/**
 * IconAtlas — 节点图标纹理图集（仅支持 png / jpg / svg 图片）。
 *
 * 图标源为图片 URL 或 data URI（data:image/...），
 * 异步加载后按 contain 缩放放入 slot，加载完成后 dirty=true，
 * 下一帧自动上传到 GPU 并显示。
 */

export interface AtlasGlyph {
  /** Normalized UV: [u0, v0, u1, v1] */
  uv: [number, number, number, number]
  /** 视觉像素尺寸 */
  pw: number
  ph: number
}

/** 是否是可加载的图片源（png/jpg/svg URL 或 data URI） */
function isImageSource(value: string): boolean {
  if (/^(https?:|blob:)/i.test(value)) return true
  if (value.startsWith("data:image/")) return true
  // 相对路径（如 /icons/person.png）
  if (value.startsWith("/")) return true
  return false
}

export class IconAtlas {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private texture: WebGLTexture | null = null
  private entries = new Map<string, AtlasGlyph>()
  /** 已分配 slot 但尚未加载完成的 url → glyph 占位 */
  private pending = new Map<string, AtlasGlyph>()
  private cursorX = 2
  private cursorY = 2
  private rowHeight = 0
  private slotSize: number
  private dirty = false

  constructor(size = 1024, slotSize = 64) {
    this.canvas = document.createElement("canvas")
    this.canvas.width = size
    this.canvas.height = size
    this.ctx = this.canvas.getContext("2d")!
    this.slotSize = slotSize
  }

  /** 获取图标的 UV。首次调用时异步加载，返回 null；加载完成后返回 glyph */
  getOrCreate(value: string): AtlasGlyph | null {
    if (!value || !isImageSource(value)) return null
    const hit = this.entries.get(value)
    if (hit) return hit
    // 已分配 slot 且正在加载
    if (this.pending.has(value)) return null

    const slot = this.slotSize
    if (this.cursorX + slot > this.canvas.width) {
      this.cursorX = 2
      this.cursorY += this.rowHeight + 2
      this.rowHeight = 0
    }
    if (this.cursorY + slot > this.canvas.height) {
      console.warn("[IconAtlas] overflow:", value)
      return null
    }

    const x = this.cursorX
    const y = this.cursorY
    const w = this.canvas.width
    const h = this.canvas.height
    this.cursorX += slot + 1
    this.rowHeight = Math.max(this.rowHeight, slot)

    const glyph: AtlasGlyph = {
      uv: [x / w, y / h, (x + slot) / w, (y + slot) / h],
      pw: slot,
      ph: slot,
    }

    this.loadImage(value, glyph, x, y, slot)
    return null
  }

  private loadImage(
    url: string,
    glyph: AtlasGlyph,
    x: number,
    y: number,
    slot: number,
  ): void {
    this.pending.set(url, glyph)
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      // contain 缩放绘制，保持宽高比
      const scale = Math.min(slot / img.width, slot / img.height)
      const dw = img.width * scale
      const dh = img.height * scale
      this.ctx.clearRect(x, y, slot, slot)
      this.ctx.drawImage(img, x + (slot - dw) / 2, y + (slot - dh) / 2, dw, dh)
      this.entries.set(url, glyph)
      this.pending.delete(url)
      this.dirty = true
    }
    img.onerror = () => {
      // 加载失败：记录为空 slot，避免反复请求
      this.entries.set(url, glyph)
      this.pending.delete(url)
      this.dirty = true
    }
    img.src = url
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
    this.pending.clear()
    this.cursorX = 2
    this.cursorY = 2
    this.rowHeight = 0
    this.dirty = true
  }
}
