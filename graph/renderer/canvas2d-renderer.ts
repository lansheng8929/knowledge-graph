/**
 * Canvas2DRenderer — Canvas 2D 图渲染器。
 *
 * 职责：绘制节点、边、文字标签。
 * 交互（点击/拖拽/平移/缩放）委托给 InteractionManager + CanvasColorPicker。
 */

import type { RenderNode, RenderLink } from "./types.js"
import { CanvasColorPicker } from "./canvas-picker.js"
import {
  InteractionManager,
  type ViewTransform,
  type InteractionCallbacks,
} from "./interaction-manager.js"

export interface Canvas2DRendererOptions {
  container: HTMLElement
  width?: number
  height?: number
  backgroundColor?: string
  showArrows?: boolean
  labelMinScale?: number
  labelFontSize?: number
}

export class Canvas2DRenderer {
  readonly container: HTMLElement
  readonly canvas: HTMLCanvasElement
  readonly interaction: InteractionManager
  readonly picker: CanvasColorPicker

  private ctx: CanvasRenderingContext2D
  private width: number
  private height: number
  private nodes: RenderNode[] = []
  private links: RenderLink[] = []
  private showArrows: boolean
  private labelMinScale: number
  private labelFontSize: number
  private bgColor: string
  private _destroyed = false
  private _rafId = 0

  constructor(opts: Canvas2DRendererOptions) {
    this.container = opts.container
    this.width = opts.width || this.container.clientWidth || 800
    this.height = opts.height || this.container.clientHeight || 600
    this.bgColor = opts.backgroundColor || "#1a1a2e"
    this.showArrows = opts.showArrows ?? false
    this.labelMinScale = opts.labelMinScale ?? 0.5
    this.labelFontSize = opts.labelFontSize ?? 12

    // 主 Canvas
    this.canvas = document.createElement("canvas")
    this.canvas.style.width = "100%"
    this.canvas.style.height = "100%"
    this.canvas.style.display = "block"
    this.canvas.width = this.width * (window.devicePixelRatio || 1)
    this.canvas.height = this.height * (window.devicePixelRatio || 1)
    this.ctx = this.canvas.getContext("2d")!

    // 颜色拾取器
    this.picker = new CanvasColorPicker(this.width, this.height)

    // 交互管理器
    this.interaction = new InteractionManager(
      this.canvas,
      this.picker,
      this.makeCallbacks(),
    )
    // 保持相机同步
    this.interaction.transform = { x: 0, y: 0, k: 1 }

    this.container.appendChild(this.canvas)

    // 监听容器尺寸变化
    const ro = new ResizeObserver(() => this.handleResize())
    ro.observe(this.container)

    this.startRenderLoop()
  }

  private handleResize(): void {
    const dpr = window.devicePixelRatio || 1
    this.width = this.container.clientWidth
    this.height = this.container.clientHeight
    this.canvas.width = this.width * dpr
    this.canvas.height = this.height * dpr
  }

  // ========== 回调桥接 ==========

  private makeCallbacks(): InteractionCallbacks {
    const self = this
    return {
      onNodeClick(nodeId, event) {
        self.onNodeClick?.(nodeId, event)
      },
      onLinkClick(linkId, event) {
        self.onLinkClick?.(linkId, event)
      },
      onNodeHover(nodeId) {
        self.onNodeHover?.(nodeId)
      },
      onNodeDrag(nodeId, dx, dy) {
        // dx/dy 是屏幕像素偏移，转为世界坐标偏移
        const k = self.interaction.transform.k
        const node = self.nodes.find((n) => n.id === nodeId)
        if (node) {
          node.x += dx / k
          node.y += dy / k
          self.onNodeDrag?.(nodeId, node.x, node.y)
        }
      },
      onNodeDragEnd(nodeId) {
        self.onNodeDragEnd?.(nodeId)
      },
      onBackgroundClick(event) {
        self.onBackgroundClick?.(event)
      },
      onZoom(transform) {
        self.onZoom?.(transform)
      },
      onPan(transform) {
        self.onZoom?.(transform)
      },
    }
  }

  // ========== 公开回调 ==========

  onNodeClick?: (nodeId: string | null, event: MouseEvent) => void
  onNodeHover?: (nodeId: string | null) => void
  onNodeDrag?: (nodeId: string, x: number, y: number) => void
  onNodeDragEnd?: (nodeId: string) => void
  onLinkClick?: (linkId: string | null, event: MouseEvent) => void
  onBackgroundClick?: (event: MouseEvent) => void
  onZoom?: (transform: ViewTransform) => void

  // ========== Data ==========

  updateData(nodes: RenderNode[], links: RenderLink[]): void {
    this.nodes = nodes
    this.links = links
    this.picker.syncData(nodes, links)
  }

  updateNodePositions(positions: Map<string, { x: number; y: number }>): void {
    for (const n of this.nodes) {
      const pos = positions.get(n.id)
      if (pos) {
        n.x = pos.x
        n.y = pos.y
      }
    }
  }

  // ========== Rendering ==========

  private render(): void {
    const ctx = this.ctx
    const dpr = window.devicePixelRatio || 1
    const w = this.width * dpr
    const h = this.height * dpr
    const t = this.interaction.transform

    // ---- 主 Canvas ----
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.fillStyle = this.bgColor
    ctx.fillRect(0, 0, this.width, this.height)

    ctx.save()
    ctx.translate(t.x * t.k, t.y * t.k)
    ctx.scale(t.k, t.k)

    this.renderLinks(ctx)
    this.renderNodes(ctx)
    ctx.restore()

    // ---- 影子 Canvas ----
    this.picker.renderFrame(t.x, t.y, t.k, dpr, this.width, this.height)
  }

  private renderLinks(ctx: CanvasRenderingContext2D): void {
    for (const l of this.links) {
      const [r, g, b, a] = l.color
      ctx.strokeStyle = `rgba(${Math.round(r * 255)},${Math.round(g * 255)},${Math.round(b * 255)},${a})`
      ctx.lineWidth = l.width
      ctx.beginPath()
      ctx.moveTo(l.sourceX, l.sourceY)
      ctx.lineTo(l.targetX, l.targetY)
      ctx.stroke()
      if (this.showArrows) {
        this.drawArrow(ctx, l.sourceX, l.sourceY, l.targetX, l.targetY, [
          r,
          g,
          b,
          a,
        ])
      }
    }
  }

  private drawArrow(
    ctx: CanvasRenderingContext2D,
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    color: [number, number, number, number],
  ): void {
    const dx = toX - fromX,
      dy = toY - fromY
    const len = Math.sqrt(dx * dx + dy * dy)
    if (len < 1) return
    const ux = dx / len,
      uy = dy / len
    const size = 8
    const [r, g, b, a] = color
    ctx.fillStyle = `rgba(${Math.round(r * 255)},${Math.round(g * 255)},${Math.round(b * 255)},${a})`
    ctx.beginPath()
    ctx.moveTo(toX, toY)
    ctx.lineTo(
      toX - ux * size + uy * size * 0.4,
      toY - uy * size - ux * size * 0.4,
    )
    ctx.lineTo(
      toX - ux * size - uy * size * 0.4,
      toY - uy * size + ux * size * 0.4,
    )
    ctx.closePath()
    ctx.fill()
  }

  private renderNodes(ctx: CanvasRenderingContext2D): void {
    const t = this.interaction.transform
    for (const n of this.nodes) {
      const [r, g, b, a] = n.color
      const [sr, sg, sb, sa] = n.strokeColor || [1, 1, 1, 1]
      ctx.beginPath()
      ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${Math.round(r * 255)},${Math.round(g * 255)},${Math.round(b * 255)},${a})`
      ctx.fill()
      if (n.strokeWidth && n.strokeWidth > 0) {
        ctx.lineWidth = n.strokeWidth
        ctx.strokeStyle = `rgba(${Math.round(sr * 255)},${Math.round(sg * 255)},${Math.round(sb * 255)},${sa})`
        ctx.stroke()
      }
      if (n.label && t.k > this.labelMinScale) {
        const fs = Math.max(8, this.labelFontSize / t.k)
        ctx.font = `${fs}px sans-serif`
        ctx.fillStyle = `rgba(${Math.round(r * 255)},${Math.round(g * 255)},${Math.round(b * 255)},${a})`
        ctx.textAlign = "center"
        ctx.textBaseline = "top"
        ctx.fillText(n.label, n.x, n.y + n.radius + 4 / t.k)
      }
    }
  }

  private startRenderLoop(): void {
    const loop = () => {
      if (this._destroyed) return
      this.render()
      this._rafId = requestAnimationFrame(loop)
    }
    this._rafId = requestAnimationFrame(loop)
  }

  // ========== 相机控制 ==========

  fitView(padding = 40): void {
    if (this.nodes.length === 0) return
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity
    for (const n of this.nodes) {
      minX = Math.min(minX, n.x - n.radius)
      minY = Math.min(minY, n.y - n.radius)
      maxX = Math.max(maxX, n.x + n.radius)
      maxY = Math.max(maxY, n.y + n.radius)
    }
    const graphW = maxX - minX + padding * 2
    const graphH = maxY - minY + padding * 2
    const k = Math.min(this.width / graphW, this.height / graphH, 2)
    const t = this.interaction.transform
    t.k = k
    t.x = -(minX - padding) + (this.width / k - graphW) / 2
    t.y = -(minY - padding) + (this.height / k - graphH) / 2
    t.x /= k
    t.y /= k
    this.onZoom?.(t)
  }

  focusNode(nodeId: string): void {
    const node = this.nodes.find((n) => n.id === nodeId)
    if (!node) return
    const t = this.interaction.transform
    t.x = this.width / 2 / t.k - node.x
    t.y = this.height / 2 / t.k - node.y
  }

  destroy(): void {
    this._destroyed = true
    if (this._rafId) cancelAnimationFrame(this._rafId)
    this.interaction.detach()
    this.interaction.reset()
    if (this.canvas.parentNode) this.container.removeChild(this.canvas)
  }
}
