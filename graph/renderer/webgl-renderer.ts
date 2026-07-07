/**
 * WebGLRenderer — main orchestrator for WebGL-based graph rendering.
 *
 * Manages:
 * - WebGL2 context and canvas
 * - Camera (pan/zoom)
 * - Node rendering (instanced circles)
 * - Link rendering (instanced lines + arrows)
 * - Text labels (texture atlas)
 * - Color-picking framebuffer (hit detection)
 * - Interaction (click, hover, drag)
 */

import { Camera } from "./camera.js"
import { NodeBatchRenderer } from "./node-batch.js"
import { LinkBatchRenderer } from "./link-batch.js"
import { TextLabelRenderer, type LabelInfo } from "./text-label.js"
import type {
  RenderNode,
  RenderLink,
  ViewTransform,
  Viewport,
} from "./types.js"

export interface WebGLRendererOptions {
  container: HTMLElement
  width?: number
  height?: number
  backgroundColor?: string
  showArrows?: boolean
  /** Minimum scale to show labels */
  labelMinScale?: number
  /** Font size for labels (affects atlas) */
  labelFontSize?: number
}

/** Color-coded ID for picking: encodes an index into RGBA */
export function encodePickColor(
  index: number,
): [number, number, number, number] {
  return [
    ((index >> 16) & 0xff) / 255,
    ((index >> 8) & 0xff) / 255,
    (index & 0xff) / 255,
    1.0,
  ]
}

/** Decode a pick color back to index */
export function decodePickColor(r: number, g: number, b: number): number {
  return (
    (Math.round(r * 255) << 16) |
    (Math.round(g * 255) << 8) |
    Math.round(b * 255)
  )
}

export class WebGLRenderer {
  private container: HTMLElement
  private canvas: HTMLCanvasElement
  private gl: WebGL2RenderingContext
  private camera = new Camera()
  private nodeRenderer: NodeBatchRenderer
  private linkRenderer: LinkBatchRenderer
  private labelRenderer: TextLabelRenderer

  // Picking framebuffer
  private pickFbo: WebGLFramebuffer | null = null
  private pickTexture: WebGLTexture | null = null
  private pickDepth: WebGLRenderbuffer | null = null

  // Current data
  private nodes: RenderNode[] = []
  private links: RenderLink[] = []
  private labels: LabelInfo[] = []

  // Options
  private bgColor: [number, number, number, number] = [0.1, 0.1, 0.12, 1]
  private showArrows = false
  private labelMinScale = 0.5
  private width: number
  private height: number

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

  constructor(opts: WebGLRendererOptions) {
    this.container = opts.container

    // Create canvas
    this.canvas = document.createElement("canvas")
    this.canvas.style.width = "100%"
    this.canvas.style.height = "100%"
    this.canvas.style.display = "block"

    const dpr = window.devicePixelRatio || 1
    this.width = opts.width || this.container.clientWidth
    this.height = opts.height || this.container.clientHeight
    this.canvas.width = this.width * dpr
    this.canvas.height = this.height * dpr

    this.container.appendChild(this.canvas)

    // Init WebGL2
    const gl = this.canvas.getContext("webgl2", {
      antialias: true,
      alpha: true,
      premultipliedAlpha: false,
    })
    if (!gl) throw new Error("WebGL2 not supported")
    this.gl = gl

    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

    if (opts.backgroundColor) {
      const hex = opts.backgroundColor
      this.bgColor = [
        parseInt(hex.slice(1, 3), 16) / 255,
        parseInt(hex.slice(3, 5), 16) / 255,
        parseInt(hex.slice(5, 7), 16) / 255,
        1.0,
      ]
    }

    this.showArrows = opts.showArrows ?? false
    this.labelMinScale = opts.labelMinScale ?? 0.5

    this.nodeRenderer = new NodeBatchRenderer(gl)
    this.linkRenderer = new LinkBatchRenderer(gl)
    this.labelRenderer = new TextLabelRenderer(
      gl,
      2048,
      opts.labelFontSize ?? 24,
    )

    this.initPicking()
    this.setupInteraction()
    this.startRenderLoop()
  }

  private initPicking(): void {
    const gl = this.gl
    const dpr = window.devicePixelRatio || 1
    const w = this.width * dpr
    const h = this.height * dpr

    this.pickFbo = gl.createFramebuffer()

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

    this.pickDepth = gl.createRenderbuffer()!
    gl.bindRenderbuffer(gl.RENDERBUFFER, this.pickDepth)
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, w, h)
  }

  // ========== Data ==========

  updateData(nodes: RenderNode[], links: RenderLink[]): void {
    this.nodes = nodes
    this.links = links
    // Pre-register labels
    const texts = nodes.map((n) => n.label).filter(Boolean) as string[]
    texts.push(...(links.map((l) => l.label).filter(Boolean) as string[]))
    this.labelRenderer.preRegister(texts)
  }

  updateNodePositions(positions: Map<string, { x: number; y: number }>): void {
    for (const n of this.nodes) {
      const pos = positions.get(n.id)
      if (pos) {
        n.x = pos.x
        n.y = pos.y
      }
    }
    // Also update link endpoints from node positions
    // (links store sourceX/sourceY/targetX/targetY which reference node positions)
    // The caller should update links separately if needed
  }

  getCamera(): Camera {
    return this.camera
  }

  getCanvas(): HTMLCanvasElement {
    return this.canvas
  }

  // ========== Rendering ==========

  private render(): void {
    const gl = this.gl
    const dpr = window.devicePixelRatio || 1
    const w = this.width * dpr
    const h = this.height * dpr

    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    gl.viewport(0, 0, w, h)
    gl.clearColor(...this.bgColor)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    const { x, y, k } = this.camera.state

    // Render links (temporarily disabled for debugging)
    // this.linkRenderer.render(this.links, w, h, x, y, k, this.showArrows)

    // Render nodes
    this.nodeRenderer.render(this.nodes, w, h, x, y, k)

    // Render labels
    this.labels = this.labelRenderer.buildNodeLabels(
      this.nodes,
      k,
      this.labelMinScale,
    )
    this.labelRenderer.render(this.labels, w, h, x, y, k)
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

  /** Read pixel at screen position, returns encoded index or -1 */
  pick(
    screenX: number,
    screenY: number,
  ): { type: "node" | "link"; id: string } | null {
    const gl = this.gl
    const dpr = window.devicePixelRatio || 1
    const w = this.width * dpr
    const h = this.height * dpr

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

    const { x, y, k } = this.camera.state

    // Render nodes for picking (each with unique color)
    for (let i = 0; i < this.nodes.length; i++) {
      const pickColor = encodePickColor(i)
      this.nodeRenderer.renderPicking([this.nodes[i]], w, h, x, y, k, pickColor)
    }

    // Read pixel
    const px = Math.round(screenX * dpr)
    const py = Math.round(h - screenY * dpr) // flip Y
    const pixel = new Uint8Array(4)
    gl.readPixels(px, py, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel)

    gl.bindFramebuffer(gl.FRAMEBUFFER, null)

    if (pixel[3] === 0) return null

    const index = decodePickColor(
      pixel[0] / 255,
      pixel[1] / 255,
      pixel[2] / 255,
    )
    if (index >= 0 && index < this.nodes.length) {
      return { type: "node", id: this.nodes[index].id }
    }

    return null
  }

  // ========== Interaction ==========

  private setupInteraction(): void {
    this.canvas.addEventListener("pointerdown", this.onPointerDown)
    this.canvas.addEventListener("pointermove", this.onPointerMove)
    this.canvas.addEventListener("pointerup", this.onPointerUp)
    this.canvas.addEventListener("wheel", this.onWheel, { passive: false })
    this.canvas.addEventListener("contextmenu", (e) => e.preventDefault())

    // Resize
    const ro = new ResizeObserver(() => this.handleResize())
    ro.observe(this.container)
  }

  private getEventPos(e: MouseEvent): { x: number; y: number } {
    const rect = this.canvas.getBoundingClientRect()
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
  }

  private onPointerDown = (e: PointerEvent): void => {
    const pos = this.getEventPos(e)
    this.lastMouseX = pos.x
    this.lastMouseY = pos.y

    // Check if clicked on a node
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
      // Start panning
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
      // Drag node in world space
      const worldDx = dx / this.camera.k
      const worldDy = dy / this.camera.k

      const node = this.nodes.find((n) => n.id === this.dragNodeId)
      if (node) {
        node.x += worldDx
        node.y += worldDy
        this.onNodeDrag?.(this.dragNodeId, node.x, node.y)
      }
    } else if (this.isPanning) {
      this.camera.pan(dx, dy)
      this.onZoom?.(this.camera.state)
    } else {
      // Hover detection
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
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    this.camera.zoomTo(delta, pos.x, pos.y)
    this.onZoom?.(this.camera.state)
  }

  private handleResize(): void {
    const dpr = window.devicePixelRatio || 1
    this.width = this.container.clientWidth
    this.height = this.container.clientHeight
    this.canvas.width = this.width * dpr
    this.canvas.height = this.height * dpr
    this.gl.viewport(0, 0, this.width * dpr, this.height * dpr)

    // Recreate picking resources
    if (this.pickTexture) this.gl.deleteTexture(this.pickTexture)
    if (this.pickDepth) this.gl.deleteRenderbuffer(this.pickDepth)

    this.pickTexture = this.gl.createTexture()!
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.pickTexture)
    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      0,
      this.gl.RGBA,
      this.width * dpr,
      this.height * dpr,
      0,
      this.gl.RGBA,
      this.gl.UNSIGNED_BYTE,
      null,
    )
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_MIN_FILTER,
      this.gl.NEAREST,
    )
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_MAG_FILTER,
      this.gl.NEAREST,
    )

    this.pickDepth = this.gl.createRenderbuffer()!
    this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, this.pickDepth)
    this.gl.renderbufferStorage(
      this.gl.RENDERBUFFER,
      this.gl.DEPTH_COMPONENT16,
      this.width * dpr,
      this.height * dpr,
    )
  }

  /** Fit all nodes in view */
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

    this.camera.reset()
    this.camera.setZoom(scale)
    this.camera.pan(
      -(minX - padding) + (this.width / scale - graphW) / 2,
      -(minY - padding) + (this.height / scale - graphH) / 2,
    )
    this.onZoom?.(this.camera.state)
  }

  /** Center on a specific node */
  focusNode(nodeId: string): void {
    const node = this.nodes.find((n) => n.id === nodeId)
    if (!node) return

    const targetX = this.width / 2 / this.camera.k - node.x
    const targetY = this.height / 2 / this.camera.k - node.y
    this.camera.pan(targetX - this.camera.x, targetY - this.camera.y)
  }

  destroy(): void {
    this._destroyed = true
    if (this._rafId) cancelAnimationFrame(this._rafId)
    this.canvas.removeEventListener("pointerdown", this.onPointerDown)
    this.canvas.removeEventListener("pointermove", this.onPointerMove)
    this.canvas.removeEventListener("pointerup", this.onPointerUp)
    this.canvas.removeEventListener("wheel", this.onWheel)
    this.nodeRenderer.destroy()
    this.linkRenderer.destroy()
    this.labelRenderer.destroy()
    if (this.pickFbo) this.gl.deleteFramebuffer(this.pickFbo)
    if (this.pickTexture) this.gl.deleteTexture(this.pickTexture)
    if (this.pickDepth) this.gl.deleteRenderbuffer(this.pickDepth)
    if (this.canvas.parentNode) this.container.removeChild(this.canvas)
  }
}
