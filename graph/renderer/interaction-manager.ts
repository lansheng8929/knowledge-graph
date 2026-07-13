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
  onNodeDrag?: (nodeId: string, x: number, y: number) => void
  onNodeDragEnd?: (nodeId: string) => void
  onBackgroundClick?: (event: PointerEvent) => void
  onZoom?: (transform: ViewTransform) => void
  onPan?: (transform: ViewTransform) => void
}

export class InteractionManager {
  private canvas: HTMLCanvasElement
  private picker: Picker
  private callbacks: InteractionCallbacks

  /** 当前相机变换（渲染器需保持同步） */
  transform: ViewTransform = { x: 0, y: 0, k: 1 }

  // 内部状态
  private isDragging = false
  private dragNodeId: string | null = null
  private hoveredId: string | null = null
  private lastMouseX = 0
  private lastMouseY = 0
  private isPanning = false
  /** 垂直缩放容忍度（px），在此范围内不触发平移/缩放手感混淆 */
  private panDeadZone = 3

  // 绑定的回调引用（用于 removeEventListener）
  private boundPointerDown: (e: PointerEvent) => void
  private boundPointerMove: (e: PointerEvent) => void
  private boundPointerUp: (e: PointerEvent) => void
  private boundPointerLeave: (e: PointerEvent) => void
  private boundWheel: (e: WheelEvent) => void
  private boundContextMenu: (e: Event) => void

  constructor(
    canvas: HTMLCanvasElement,
    picker: Picker,
    callbacks: InteractionCallbacks = {},
  ) {
    this.canvas = canvas
    this.picker = picker
    this.callbacks = callbacks

    // 预绑定 this
    this.boundPointerDown = this.onPointerDown.bind(this)
    this.boundPointerMove = this.onPointerMove.bind(this)
    this.boundPointerUp = this.onPointerUp.bind(this)
    this.boundPointerLeave = this.onPointerLeave.bind(this)
    this.boundWheel = this.onWheel.bind(this)
    this.boundContextMenu = (e: Event) => e.preventDefault()

    this.attach()
  }

  // ========== 生命周期 ==========

  /** 绑定事件到 canvas */
  attach(): void {
    this.canvas.addEventListener("pointerdown", this.boundPointerDown)
    this.canvas.addEventListener("pointermove", this.boundPointerMove)
    this.canvas.addEventListener("pointerup", this.boundPointerUp)
    this.canvas.addEventListener("pointerleave", this.boundPointerLeave)
    this.canvas.addEventListener("wheel", this.boundWheel, { passive: false })
    this.canvas.addEventListener("contextmenu", this.boundContextMenu)
  }

  /** 解绑事件 */
  detach(): void {
    this.canvas.removeEventListener("pointerdown", this.boundPointerDown)
    this.canvas.removeEventListener("pointermove", this.boundPointerMove)
    this.canvas.removeEventListener("pointerup", this.boundPointerUp)
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
      if (e.button === 0) {
        this.isDragging = true
        this.dragNodeId = hit.id
        this.canvas.setPointerCapture(e.pointerId)
      }
      this.callbacks.onNodeClick?.(hit.id, e)
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
      // 将 dead zone 消耗完：如果移动量还小于 dead zone，忽略本次平移
      this.callbacks.onPan?.(t)
    } else {
      // 悬停检测
      const hit = this.picker.pick(pos.x, pos.y)
      const newId = hit?.id ?? null
      if (newId !== this.hoveredId) {
        this.hoveredId = newId
        this.callbacks.onNodeHover?.(newId)
        this.canvas.style.cursor = newId ? "pointer" : "default"
      }
    }

    this.lastMouseX = pos.x
    this.lastMouseY = pos.y
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

  /** 指针离开 canvas → 清除 hover 状态 */
  private onPointerLeave(_e: PointerEvent): void {
    if (this.hoveredId !== null) {
      this.hoveredId = null
      this.canvas.style.cursor = "default"
      this.callbacks.onNodeHover?.(null)
    }
  }

  private onWheel(e: WheelEvent): void {
    e.preventDefault()
    const pos = this.getPos(e)
    const ratio = e.deltaY > 0 ? 0.9 : 1.1
    const t = this.transform
    const newK = Math.max(0.1, Math.min(10, t.k * ratio))

    // 以鼠标所在世界坐标为中心缩放
    const worldX = (pos.x - t.x * t.k) / t.k
    const worldY = (pos.y - t.y * t.k) / t.k
    t.x = pos.x / newK - worldX
    t.y = pos.y / newK - worldY
    t.k = newK

    this.callbacks.onZoom?.(t)
  }
}
