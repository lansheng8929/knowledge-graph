/**
 * InteractionManager — 统一管理 Canvas 上的交互事件。
 *
 * 职责：
 * - 监听 pointerdown / pointermove / pointerup / wheel
 * - 维护拖拽 / 平移 / 悬停的状态机
 * - 通过 Picker 接口做命中检测
 * - 通过回调对外通知交互事件
 *
 * 不与任何特定渲染器耦合，可同时用于 Canvas2D 和 WebGL。
 */

import type { Picker, PickHit } from "./picker.js"

export interface ViewTransform {
  x: number
  y: number
  k: number
}

export interface InteractionCallbacks {
  onNodeClick?: (nodeId: string | null, event: PointerEvent) => void
  onLinkClick?: (linkId: string | null, event: PointerEvent) => void
  onNodeHover?: (nodeId: string | null) => void
  onLinkHover?: (linkId: string | null) => void
  onNodeDrag?: (nodeId: string, x: number, y: number) => void
  onNodeDragEnd?: (nodeId: string) => void
  onNodeContextMenu?: (nodeId: string, clientX: number, clientY: number) => void
  onBackgroundClick?: (event: PointerEvent) => void
  onZoom?: (transform: ViewTransform) => void
  onPan?: (transform: ViewTransform) => void
}

/** 缩放配置——库不内置默认值，全部由外部传入。
 *  - step：必填语义；未提供则滚轮不缩放
 *  - min/max/fitMin/fitMax：可选；未提供则不钳制
 */
export interface ZoomOptions {
  /** 滚轮每格缩放增量比例（0.05 = 每格 5%）；未提供则滚轮不缩放 */
  step?: number
  /** 滚轮最小倍率；未提供则不设下限 */
  min?: number
  /** 滚轮最大倍率；未提供则不设上限 */
  max?: number
  /** fitView 放大上限；未提供则不设上限 */
  fitMax?: number
  /** fitView 缩小下限；未提供则不设下限 */
  fitMin?: number
}

export class InteractionManager {
  private canvas: HTMLCanvasElement
  private picker: Picker
  private callbacks: InteractionCallbacks
  private zoom: ZoomOptions

  /** 当前相机变换（渲染器需保持同步） */
  transform: ViewTransform = { x: 0, y: 0, k: 1 }

  // 内部状态
  private isDragging = false
  private dragNodeId: string | null = null
  private hoveredId: string | null = null
  private hoveredType: "node" | "link" | null = null
  private lastMouseX = 0
  private lastMouseY = 0
  private lastClientX = 0
  private lastClientY = 0

  /** 鼠标在视口中的最后位置（由 pointermove 同步更新） */
  get mousePosition(): { x: number; y: number } {
    return { x: this.lastClientX, y: this.lastClientY }
  }
  private isPanning = false

  // 绑定的回调引用（用于 removeEventListener）
  private boundPointerDown: (e: PointerEvent) => void
  private boundPointerMove: (e: PointerEvent) => void
  private boundPointerUp: (e: PointerEvent) => void
  private boundPointerCancel: (e: PointerEvent) => void
  private boundLostCapture: (e: PointerEvent) => void
  private boundPointerLeave: (e: PointerEvent) => void
  private boundWheel: (e: WheelEvent) => void
  private boundContextMenu: (e: Event) => void

  constructor(
    canvas: HTMLCanvasElement,
    picker: Picker,
    callbacks: InteractionCallbacks = {},
    options: ZoomOptions = {},
  ) {
    this.canvas = canvas
    this.picker = picker
    this.callbacks = callbacks
    this.zoom = options

    // 预绑定 this
    this.boundPointerDown = this.onPointerDown.bind(this)
    this.boundPointerMove = this.onPointerMove.bind(this)
    this.boundPointerUp = this.onPointerUp.bind(this)
    this.boundPointerCancel = this.onPointerCancel.bind(this)
    this.boundLostCapture = this.onLostCapture.bind(this)
    this.boundPointerLeave = this.onPointerLeave.bind(this)
    this.boundWheel = this.onWheel.bind(this)
    this.boundContextMenu = this.onContextMenu.bind(this)

    this.attach()
  }

  // ========== 生命周期 ==========

  /** 绑定事件到 canvas */
  attach(): void {
    this.canvas.addEventListener("pointerdown", this.boundPointerDown)
    this.canvas.addEventListener("pointermove", this.boundPointerMove)
    this.canvas.addEventListener("pointerup", this.boundPointerUp)
    this.canvas.addEventListener("pointercancel", this.boundPointerCancel)
    this.canvas.addEventListener("lostpointercapture", this.boundLostCapture)
    this.canvas.addEventListener("pointerleave", this.boundPointerLeave)
    this.canvas.addEventListener("wheel", this.boundWheel, { passive: false })
    this.canvas.addEventListener("contextmenu", this.boundContextMenu)
  }

  /** 解绑事件 */
  detach(): void {
    this.canvas.removeEventListener("pointerdown", this.boundPointerDown)
    this.canvas.removeEventListener("pointermove", this.boundPointerMove)
    this.canvas.removeEventListener("pointerup", this.boundPointerUp)
    this.canvas.removeEventListener("pointercancel", this.boundPointerCancel)
    this.canvas.removeEventListener("lostpointercapture", this.boundLostCapture)
    this.canvas.removeEventListener("pointerleave", this.boundPointerLeave)
    this.canvas.removeEventListener("wheel", this.boundWheel)
    this.canvas.removeEventListener("contextmenu", this.boundContextMenu)
  }

  /** 替换拾取器（运行时切换 CanvasPicker ↔ WebGLPicker） */
  setPicker(picker: Picker): void {
    this.picker = picker
  }

  /** 重置交互状态（销毁时或数据重置时调用） */
  reset(): void {
    this.isDragging = false
    this.dragNodeId = null
    this.isPanning = false
    this.hoveredId = null
    this.hoveredType = null
    this.canvas.style.cursor = "default"
  }

  // ========== 事件处理 ==========

  private getPos(e: MouseEvent): { x: number; y: number } {
    const rect = this.canvas.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  private onPointerDown(e: PointerEvent): void {
    const pos = this.getPos(e)
    this.lastMouseX = pos.x
    this.lastMouseY = pos.y

    const hit = this.picker.pick(pos.x, pos.y)

    if (hit && hit.type === "node") {
      // 仅左键触发点击/选中；右键只走 contextmenu
      if (e.button === 0) {
        this.isDragging = true
        this.dragNodeId = hit.id
        this.canvas.setPointerCapture(e.pointerId)
        this.callbacks.onNodeClick?.(hit.id, e)
      }
    } else if (hit && hit.type === "link") {
      this.callbacks.onLinkClick?.(hit.id, e)
    } else {
      this.isPanning = true
      this.canvas.setPointerCapture(e.pointerId)
      this.callbacks.onBackgroundClick?.(e)
    }
  }

  private onPointerMove(e: PointerEvent): void {
    const pos = this.getPos(e)
    const dx = pos.x - this.lastMouseX
    const dy = pos.y - this.lastMouseY

    if (this.isDragging && this.dragNodeId) {
      // 拖拽节点 — 在渲染器中实际移动节点
      this.callbacks.onNodeDrag?.(this.dragNodeId, dx, dy)
    } else if (this.isPanning) {
      // 平移画布
      const t = this.transform
      t.x += dx / t.k
      t.y += dy / t.k
      this.callbacks.onPan?.(t)
    } else {
      // 悬停检测
      const hit = this.picker.pick(pos.x, pos.y)
      const newId = hit?.id ?? null
      const newType = hit?.type ?? null
      if (newId !== this.hoveredId || newType !== this.hoveredType) {
        this.hoveredId = newId
        this.hoveredType = newType
        if (newType === "link") {
          this.callbacks.onLinkHover?.(newId)
          this.callbacks.onNodeHover?.(null)
        } else {
          this.callbacks.onNodeHover?.(newId)
          this.callbacks.onLinkHover?.(null)
        }
        this.canvas.style.cursor = newId ? "pointer" : "default"
      }
    }

    this.lastMouseX = pos.x
    this.lastMouseY = pos.y
    this.lastClientX = e.clientX
    this.lastClientY = e.clientY
  }

  private onContextMenu(e: Event): void {
    e.preventDefault()
    const me = e as MouseEvent
    const pos = this.getPos(me)
    const hit = this.picker.pick(pos.x, pos.y)
    if (hit?.type === "node") {
      this.callbacks.onNodeContextMenu?.(hit.id, me.clientX, me.clientY)
    }
  }

  private onPointerUp(e: PointerEvent): void {
    if (this.isDragging && this.dragNodeId) {
      this.callbacks.onNodeDragEnd?.(this.dragNodeId)
    }
    this.isDragging = false
    this.dragNodeId = null
    this.isPanning = false
    this.canvas.releasePointerCapture(e.pointerId)
  }

  /** 手势被取消（如触控滚动拦截/系统打断）→ 复位平移/拖拽状态，避免 isPanning 卡死导致 hover 永久失效 */
  private onPointerCancel(_e: PointerEvent): void {
    this.isDragging = false
    this.dragNodeId = null
    this.isPanning = false
    this.clearHover()
  }

  /** 指针捕获丢失（浏览器主动释放）→ 同样复位状态 */
  private onLostCapture(_e: PointerEvent): void {
    this.isDragging = false
    this.dragNodeId = null
    this.isPanning = false
  }

  private clearHover(): void {
    if (this.hoveredId !== null || this.hoveredType !== null) {
      this.hoveredId = null
      this.hoveredType = null
      this.canvas.style.cursor = "default"
      this.callbacks.onNodeHover?.(null)
      this.callbacks.onLinkHover?.(null)
    }
  }

  /** 指针离开 canvas → 清除 hover 状态并复位平移（防御 pointerup 丢失） */
  private onPointerLeave(_e: PointerEvent): void {
    this.isPanning = false
    this.isDragging = false
    this.clearHover()
  }

  private onWheel(e: WheelEvent): void {
    e.preventDefault()
    const pos = this.getPos(e)
    // 缩放配置全部外部传入：step 未提供则不缩放；min/max 未提供则不钳制
    const step = this.zoom.step
    if (typeof step !== "number" || !(step > 0)) return
    const ratio = e.deltaY > 0 ? 1 - step : 1 + step
    const t = this.transform
    let newK = t.k * ratio
    if (typeof this.zoom.min === "number") newK = Math.max(this.zoom.min, newK)
    if (typeof this.zoom.max === "number") newK = Math.min(this.zoom.max, newK)

    // 以鼠标所在世界坐标为中心缩放
    const worldX = (pos.x - t.x * t.k) / t.k
    const worldY = (pos.y - t.y * t.k) / t.k
    t.x = pos.x / newK - worldX
    t.y = pos.y / newK - worldY
    t.k = newK

    this.callbacks.onZoom?.(t)
  }
}
