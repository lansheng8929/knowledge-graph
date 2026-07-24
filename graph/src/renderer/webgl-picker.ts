/**
 * WebGLPicker — 基于 WebGL 帧缓冲（FBO）的拾取器。
 *
 * 原理：
 * - 维护一个离屏 FBO + 颜色纹理
 * - pick() 时绑定 FBO，用唯一颜色绘制所有对象到纹理
 * - readPixels(1,1) 读回像素颜色 → 解码 → O(1) 获取对象
 *
 * 注意：每次 pick() 都会触发一次完整 GPU 渲染，适合 pointerdown 等低频事件。
 */

import type { Picker, PickHit } from "./picker.js"
import type { RenderNode, RenderLink } from "./types.js"
import type { NodeRenderPipeline } from "./node-pipeline.js"
import type { LinkBatchRenderer } from "./link-batch.js"

/** RGBA → 24-bit 索引 */
function decodePickColor(r: number, g: number, b: number): number {
  return (
    (Math.round(r * 255) << 16) |
    (Math.round(g * 255) << 8) |
    Math.round(b * 255)
  )
}

/**
 * WebGL 拾取器配置
 */
export interface WebGLPickerOptions {
  gl: WebGL2RenderingContext
  nodeRenderer: NodeRenderPipeline
  linkRenderer?: LinkBatchRenderer
  width: number
  height: number
}

export class WebGLPicker implements Picker {
  private gl: WebGL2RenderingContext
  private nodeRenderer: NodeRenderPipeline
  private linkRenderer?: LinkBatchRenderer

  private pickFbo: WebGLFramebuffer | null = null
  private pickTexture: WebGLTexture | null = null
  private pickDepth: WebGLRenderbuffer | null = null
  private pickerWidth = 0
  private pickerHeight = 0

  nodes: RenderNode[] = []
  links: RenderLink[] = []

  /** 节点索引 → 节点 ID（解码用） */
  private nodeIds: string[] = []
  /** 边的起始索引（nodeIds.length） */
  private linkOffset = 0
  private linkIds: string[] = []

  // 相机变换（需与主渲染同步）
  tx = 0
  ty = 0
  k = 1

  constructor(opts: WebGLPickerOptions) {
    this.gl = opts.gl
    this.nodeRenderer = opts.nodeRenderer
    this.linkRenderer = opts.linkRenderer
    this.initFBO(opts.width, opts.height)
  }

  // ========== FBO 管理 ==========

  private initFBO(w: number, h: number): void {
    const gl = this.gl
    const dpr = window.devicePixelRatio || 1
    this.pickerWidth = w * dpr
    this.pickerHeight = h * dpr

    this.pickFbo = gl.createFramebuffer()

    this.pickTexture = gl.createTexture()!
    gl.bindTexture(gl.TEXTURE_2D, this.pickTexture)
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      this.pickerWidth,
      this.pickerHeight,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      null,
    )
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)

    this.pickDepth = gl.createRenderbuffer()!
    gl.bindRenderbuffer(gl.RENDERBUFFER, this.pickDepth)
    gl.renderbufferStorage(
      gl.RENDERBUFFER,
      gl.DEPTH_COMPONENT16,
      this.pickerWidth,
      this.pickerHeight,
    )
  }

  resize(width: number, height: number): void {
    const gl = this.gl
    const dpr = window.devicePixelRatio || 1
    const w = width * dpr
    const h = height * dpr
    if (w === this.pickerWidth && h === this.pickerHeight) return

    this.pickerWidth = w
    this.pickerHeight = h

    if (this.pickTexture) gl.deleteTexture(this.pickTexture)
    this.pickTexture = gl.createTexture()!
    gl.bindTexture(gl.TEXTURE_2D, this.pickTexture)
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      w,
      h,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      null,
    )
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)

    if (this.pickDepth) gl.deleteRenderbuffer(this.pickDepth)
    this.pickDepth = gl.createRenderbuffer()!
    gl.bindRenderbuffer(gl.RENDERBUFFER, this.pickDepth)
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, w, h)
  }

  // ========== 数据同步 ==========

  syncData(nodes: RenderNode[], links: RenderLink[]): void {
    this.nodes = nodes
    this.links = links
    this.nodeIds = nodes.map((n) => n.id)
    this.linkIds = links.map((l) => l.id)
    this.linkOffset = nodes.length
  }

  // ========== 拾取 ==========

  pick(screenX: number, screenY: number): PickHit | null {
    const gl = this.gl
    const dpr = window.devicePixelRatio || 1
    const w = this.pickerWidth
    const h = this.pickerHeight

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.pickFbo!)
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      this.pickTexture!,
      0,
    )
    gl.framebufferRenderbuffer(
      gl.FRAMEBUFFER,
      gl.DEPTH_ATTACHMENT,
      gl.RENDERBUFFER,
      this.pickDepth,
    )
    gl.viewport(0, 0, w, h)
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    gl.enable(gl.DEPTH_TEST)
    gl.depthFunc(gl.LEQUAL)

    // 1) Render links (z = 0.0, behind nodes)
    if (this.linkRenderer) {
      this.linkRenderer.renderPicking(
        this.links,
        w,
        h,
        this.tx,
        this.ty,
        this.k,
        this.linkOffset,
        0, // zOffset = 0
      )
    }

    // 2) Render nodes (z = -0.5, in front of links)
    this.nodeRenderer.renderPicking(
      this.nodes,
      w,
      h,
      this.tx,
      this.ty,
      this.k,
      -0.5,
    )

    // 读像素
    const px = Math.round(screenX * dpr)
    const py = Math.round(h - screenY * dpr) // WebGL Y 轴翻转
    const pixel = new Uint8Array(4)
    gl.readPixels(px, py, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel)

    gl.bindFramebuffer(gl.FRAMEBUFFER, null)

    if (pixel[3] === 0) return null

    // Decode gl_InstanceID from RGBA (R=high 8 bits, G=middle 8 bits, B=low 8 bits)
    const index = decodePickColor(
      pixel[0] / 255,
      pixel[1] / 255,
      pixel[2] / 255,
    )

    if (index >= 0 && index < this.linkOffset) {
      return { type: "node", id: this.nodeIds[index] }
    }
    const linkIdx = index - this.linkOffset
    if (linkIdx >= 0 && linkIdx < this.linkIds.length) {
      return { type: "link", id: this.linkIds[linkIdx] }
    }

    return null
  }

  destroy(): void {
    const gl = this.gl
    gl.deleteFramebuffer(this.pickFbo)
    gl.deleteTexture(this.pickTexture)
    gl.deleteRenderbuffer(this.pickDepth)
  }
}
