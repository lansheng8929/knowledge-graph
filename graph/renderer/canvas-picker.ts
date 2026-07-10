/**
 * CanvasColorPicker — 基于 ColorTracker + 离屏 Canvas 的拾取器。
 *
 * 原理：
 * - 维护一个离屏（shadow）canvas，每帧用唯一颜色重绘所有节点和边
 * - pick() 时 getImageData(1,1) + ColorTracker.lookup() → O(1)
 *
 * 适用于 Canvas2DRenderer。
 */

import { ColorTracker } from "./color-tracker.js"
import type { Picker, PickHit } from "./picker.js"
import type { RenderNode, RenderLink } from "./types.js"

export class CanvasColorPicker implements Picker {
  readonly shadowCanvas: HTMLCanvasElement
  private shadowCtx: CanvasRenderingContext2D
  private colorTracker = new ColorTracker()
  private idToType = new Map<string, "node" | "link">()

  nodes: RenderNode[] = []
  links: RenderLink[] = []

  /** 拾取线的宽度（比视觉线宽，方便命中） */
  linkPickWidth = 6

  constructor(width: number, height: number) {
    this.shadowCanvas = document.createElement("canvas")
    this.shadowCanvas.width = width
    this.shadowCanvas.height = height
    this.shadowCtx = this.shadowCanvas.getContext("2d", {
      willReadFrequently: true,
    })!
  }

  // ========== 数据同步 ==========

  /** 数据变更时重新注册颜色（清空旧注册、登记新对象） */
  syncData(nodes: RenderNode[], links: RenderLink[]): void {
    this.nodes = nodes
    this.links = links
    this.colorTracker.reset()
    this.idToType.clear()
    for (const n of nodes) {
      this.colorTracker.register({ id: n.id })
      this.idToType.set(n.id, "node")
    }
    for (const l of links) {
      this.colorTracker.register({ id: l.id })
      this.idToType.set(l.id, "link")
    }
  }

  // ========== 每帧渲染 ==========

  /**
   * 在离屏 canvas 上用唯一填充色绘制所有节点和边。
   * 需在每一帧（或至少每次 pick 前）与主画面同步调用。
   *
   * @param tx,ty,k  - 相机变换（与主渲染一致）
   * @param dpr       - 设备像素比
   * @param width,height - CSS 尺寸
   */
  renderFrame(
    tx: number,
    ty: number,
    k: number,
    dpr: number,
    width: number,
    height: number,
  ): void {
    const ctx = this.shadowCtx
    // 确保 canvas 尺寸匹配
    const cw = width * dpr
    const ch = height * dpr
    if (this.shadowCanvas.width !== cw || this.shadowCanvas.height !== ch) {
      this.shadowCanvas.width = cw
      this.shadowCanvas.height = ch
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, width, height)

    ctx.save()
    ctx.translate(tx * k, ty * k)
    ctx.scale(k, k)

    // 绘制边（粗线方便拾取）
    for (const l of this.links) {
      const color = this.colorTracker.register({ id: l.id })
      if (!color) continue
      ctx.strokeStyle = color
      ctx.lineWidth = Math.max(l.width, this.linkPickWidth)
      ctx.beginPath()
      ctx.moveTo(l.sourceX, l.sourceY)
      ctx.lineTo(l.targetX, l.targetY)
      ctx.stroke()
    }

    // 绘制节点
    for (const n of this.nodes) {
      const color = this.colorTracker.register({ id: n.id })
      if (!color) continue
      ctx.beginPath()
      ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2)
      ctx.fillStyle = color
      ctx.fill()
    }

    ctx.restore()
  }

  // ========== 拾取 ==========

  pick(screenX: number, screenY: number): PickHit | null {
    const dpr = window.devicePixelRatio || 1
    const px = screenX * dpr
    const py = screenY * dpr

    if (
      px < 0 ||
      py < 0 ||
      px >= this.shadowCanvas.width ||
      py >= this.shadowCanvas.height
    ) {
      return null
    }

    const pixel = this.shadowCtx.getImageData(px, py, 1, 1).data
    if (pixel[3] === 0) return null

    const obj = this.colorTracker.lookup(pixel)
    if (!obj) return null

    const entry = obj as { id: string }
    const type = this.idToType.get(entry.id)
    if (!type) return null

    return { type, id: entry.id }
  }

  /** 重置颜色跟踪器（完全重建索引） */
  reset(): void {
    this.colorTracker.reset()
    this.idToType.clear()
  }
}
