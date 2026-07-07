/**
 * Canvas2DRenderer — simple Canvas 2D fallback renderer.
 *
 * Provides:
 * - Pan/zoom via Canvas transform
 * - Node rendering (circles + labels)
 * - Link rendering (lines + arrows)
 * - Color-picking via offscreen canvas
 * - Mouse interaction (click, hover, drag, pan, zoom)
 */

import type { RenderNode, RenderLink, ViewTransform } from "./types.js"

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
  private container: HTMLElement
  canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private pickCanvas: HTMLCanvasElement
  private pickCtx: CanvasRenderingContext2D

  private transform: ViewTransform = { x: 0, y: 0, k: 1 }
  private width: number
  private height: number

  private nodes: RenderNode[] = []
  private links: RenderLink[] = []

  private showArrows: boolean
  private labelMinScale: number
  private labelFontSize: number
  private bgColor: string

  // Interaction state
  private isDragging = false
  private dragNodeId: string | null = null
  private hoveredId: string | null = null
  private lastMouseX = 0
  private lastMouseY = 0
  private isPanning = false
  private _destroyed = false
  private _rafId = 0

  // Callbacks
  onNodeClick?: (nodeId: string | null, event: MouseEvent) => void
  onNodeHover?: (nodeId: string | null) => void
  onNodeDrag?: (nodeId: string, x: number, y: number) => void
  onNodeDragEnd?: (nodeId: string) => void
  onLinkClick?: (linkId: string | null, event: MouseEvent) => void
  onBackgroundClick?: (event: MouseEvent) => void
  onZoom?: (transform: ViewTransform) => void

  constructor(opts: Canvas2DRendererOptions) {
    this.container = opts.container
    this.width = opts.width || this.container.clientWidth || 800
    this.height = opts.height || this.container.clientHeight || 600
    this.bgColor = opts.backgroundColor || "#1a1a2e"
    this.showArrows = opts.showArrows ?? false
    this.labelMinScale = opts.labelMinScale ?? 0.5
    this.labelFontSize = opts.labelFontSize ?? 12

    // Main canvas
    this.canvas = document.createElement("canvas")
    this.canvas.style.width = "100%"
    this.canvas.style.height = "100%"
    this.canvas.style.display = "block"
    this.canvas.width = this.width * (window.devicePixelRatio || 1)
    this.canvas.height = this.height * (window.devicePixelRatio || 1)
    this.ctx = this.canvas.getContext("2d")!

    // Picking canvas (offscreen)
    this.pickCanvas = document.createElement("canvas")
    this.pickCanvas.width = this.width * (window.devicePixelRatio || 1)
    this.pickCanvas.height = this.height * (window.devicePixelRatio || 1)
    this.pickCtx = this.pickCanvas.getContext("2d")!

    this.container.appendChild(this.canvas)

    this.setupInteraction()
    this.startRenderLoop()
  }

  // ========== Data ==========

  updateData(nodes: RenderNode[], links: RenderLink[]): void {
    this.nodes = nodes
    this.links = links
  }

  updateNodePositions(positions: Map<string, { x: number; y: number }>): void {
    for (const n of this.nodes) {
      const pos = positions.get(n.id)
      if (pos) {
        n.x = pos.x
        n.y = pos.y
      }
    }
    // Update links
    for (const l of this.links) {
      const sn = this.nodes.find((n) => n.id === l.sourceX?.toString())
      // Links already reference positions directly
    }
  }

  // ========== Rendering ==========

  private render(): void {
    const ctx = this.ctx
    const dpr = window.devicePixelRatio || 1
    const w = this.width * dpr
    const h = this.height * dpr

    // Scale context for HiDPI
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    // Clear
    ctx.fillStyle = this.bgColor
    ctx.fillRect(0, 0, this.width, this.height)

    // Apply camera transform
    ctx.save()
    ctx.translate(
      this.transform.x * this.transform.k,
      this.transform.y * this.transform.k,
    )
    ctx.scale(this.transform.k, this.transform.k)

    // Render links
    this.renderLinks(ctx)

    // Render nodes
    this.renderNodes(ctx)

    ctx.restore()
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

      // Arrow
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
    const dx = toX - fromX
    const dy = toY - fromY
    const len = Math.sqrt(dx * dx + dy * dy)
    if (len < 1) return
    const ux = dx / len
    const uy = dy / len
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
    for (const n of this.nodes) {
      const [r, g, b, a] = n.color
      const [sr, sg, sb, sa] = n.strokeColor || [1, 1, 1, 1]

      // Fill
      ctx.beginPath()
      ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${Math.round(r * 255)},${Math.round(g * 255)},${Math.round(b * 255)},${a})`
      ctx.fill()

      // Stroke
      if (n.strokeWidth && n.strokeWidth > 0) {
        ctx.lineWidth = n.strokeWidth
        ctx.strokeStyle = `rgba(${Math.round(sr * 255)},${Math.round(sg * 255)},${Math.round(sb * 255)},${sa})`
        ctx.stroke()
      }

      // Label
      if (n.label && this.transform.k > this.labelMinScale) {
        const fs = Math.max(8, this.labelFontSize / this.transform.k)
        ctx.font = `${fs}px sans-serif`
        ctx.fillStyle = `rgba(${Math.round(r * 255)},${Math.round(g * 255)},${Math.round(b * 255)},${a})`
        ctx.textAlign = "center"
        ctx.textBaseline = "top"
        ctx.fillText(n.label, n.x, n.y + n.radius + 4 / this.transform.k)
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

  // ========== Picking ==========

  pick(
    screenX: number,
    screenY: number,
  ): { type: "node" | "link"; id: string } | null {
    // Simple distance-based picking (works well for moderate node counts)
    const worldX =
      (screenX - this.transform.x * this.transform.k) / this.transform.k
    const worldY =
      (screenY - this.transform.y * this.transform.k) / this.transform.k

    // Check nodes (reverse order for top-most first)
    for (let i = this.nodes.length - 1; i >= 0; i--) {
      const n = this.nodes[i]
      const dx = worldX - n.x
      const dy = worldY - n.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist <= n.radius + 2) {
        return { type: "node", id: n.id }
      }
    }

    // Check links
    for (const l of this.links) {
      const dist = this.pointToLineDist(
        worldX,
        worldY,
        l.sourceX,
        l.sourceY,
        l.targetX,
        l.targetY,
      )
      if (dist < 5) {
        return { type: "link", id: l.id }
      }
    }

    return null
  }

  private pointToLineDist(
    px: number,
    py: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
  ): number {
    const dx = x2 - x1
    const dy = y2 - y1
    const len2 = dx * dx + dy * dy
    if (len2 === 0) return Math.sqrt((px - x1) ** 2 + (py - y1) ** 2)
    let t = ((px - x1) * dx + (py - y1) * dy) / len2
    t = Math.max(0, Math.min(1, t))
    const nearX = x1 + t * dx
    const nearY = y1 + t * dy
    return Math.sqrt((px - nearX) ** 2 + (py - nearY) ** 2)
  }

  // ========== Interaction ==========

  private setupInteraction(): void {
    this.canvas.addEventListener("pointerdown", this.onPointerDown)
    this.canvas.addEventListener("pointermove", this.onPointerMove)
    this.canvas.addEventListener("pointerup", this.onPointerUp)
    this.canvas.addEventListener("wheel", this.onWheel, { passive: false })
    this.canvas.addEventListener("contextmenu", (e) => e.preventDefault())

    const ro = new ResizeObserver(() => this.handleResize())
    ro.observe(this.container)
  }

  private getEventPos(e: MouseEvent): { x: number; y: number } {
    const rect = this.canvas.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  private onPointerDown = (e: PointerEvent): void => {
    const pos = this.getEventPos(e)
    this.lastMouseX = pos.x
    this.lastMouseY = pos.y

    const hit = this.pick(pos.x, pos.y)

    if (hit && hit.type === "node") {
      if (e.button === 0) {
        this.isDragging = true
        this.dragNodeId = hit.id
        this.canvas.setPointerCapture(e.pointerId)
      }
      this.onNodeClick?.(hit.id, e)
    } else if (hit && hit.type === "link") {
      this.onLinkClick?.(hit.id, e)
    } else {
      this.isPanning = true
      this.canvas.setPointerCapture(e.pointerId)
      this.onBackgroundClick?.(e)
    }
  }

  private onPointerMove = (e: PointerEvent): void => {
    const pos = this.getEventPos(e)
    const dx = pos.x - this.lastMouseX
    const dy = pos.y - this.lastMouseY

    if (this.isDragging && this.dragNodeId) {
      const node = this.nodes.find((n) => n.id === this.dragNodeId)
      if (node) {
        node.x += dx / this.transform.k
        node.y += dy / this.transform.k
        this.onNodeDrag?.(this.dragNodeId, node.x, node.y)
      }
    } else if (this.isPanning) {
      this.transform.x += dx / this.transform.k
      this.transform.y += dy / this.transform.k
      this.onZoom?.(this.transform)
    } else {
      const hit = this.pick(pos.x, pos.y)
      const newId = hit?.id ?? null
      if (newId !== this.hoveredId) {
        this.hoveredId = newId
        this.onNodeHover?.(newId)
        this.canvas.style.cursor = newId ? "pointer" : "default"
      }
    }

    this.lastMouseX = pos.x
    this.lastMouseY = pos.y
  }

  private onPointerUp = (e: PointerEvent): void => {
    if (this.isDragging && this.dragNodeId) {
      this.onNodeDragEnd?.(this.dragNodeId)
    }
    this.isDragging = false
    this.dragNodeId = null
    this.isPanning = false
    this.canvas.releasePointerCapture(e.pointerId)
  }

  private onWheel = (e: WheelEvent): void => {
    e.preventDefault()
    const pos = this.getEventPos(e)
    const ratio = e.deltaY > 0 ? 0.9 : 1.1
    const newK = Math.max(0.1, Math.min(10, this.transform.k * ratio))

    // Zoom toward cursor
    const worldX =
      (pos.x - this.transform.x * this.transform.k) / this.transform.k
    const worldY =
      (pos.y - this.transform.y * this.transform.k) / this.transform.k
    this.transform.x = pos.x / newK - worldX
    this.transform.y = pos.y / newK - worldY
    this.transform.k = newK

    this.onZoom?.(this.transform)
  }

  private handleResize(): void {
    const dpr = window.devicePixelRatio || 1
    this.width = this.container.clientWidth
    this.height = this.container.clientHeight
    this.canvas.width = this.width * dpr
    this.canvas.height = this.height * dpr
    this.pickCanvas.width = this.width * dpr
    this.pickCanvas.height = this.height * dpr
  }

  // ========== Camera ==========

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
    const scaleX = this.width / graphW
    const scaleY = this.height / graphH
    const scale = Math.min(scaleX, scaleY, 2)

    this.transform.k = scale
    this.transform.x = -(minX - padding) + (this.width / scale - graphW) / 2
    this.transform.y = -(minY - padding) + (this.height / scale - graphH) / 2
    this.transform.x /= scale
    this.transform.y /= scale

    this.onZoom?.(this.transform)
  }

  focusNode(nodeId: string): void {
    const node = this.nodes.find((n) => n.id === nodeId)
    if (!node) return
    this.transform.x = this.width / 2 / this.transform.k - node.x
    this.transform.y = this.height / 2 / this.transform.k - node.y
  }

  destroy(): void {
    this._destroyed = true
    if (this._rafId) cancelAnimationFrame(this._rafId)
    this.canvas.removeEventListener("pointerdown", this.onPointerDown)
    this.canvas.removeEventListener("pointermove", this.onPointerMove)
    this.canvas.removeEventListener("pointerup", this.onPointerUp)
    this.canvas.removeEventListener("wheel", this.onWheel)
    if (this.canvas.parentNode) this.container.removeChild(this.canvas)
  }
}
