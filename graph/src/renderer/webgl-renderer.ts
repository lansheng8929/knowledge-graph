/**
 * WebGLRenderer — WebGL 图渲染器（轻量化）。
 *
 * 核心职责：Canvas 管理、WebGL 上下文、渲染循环、交互。
 * 具体绘制全部委托给 RenderPlugin。
 */
import { Camera } from "./camera.js"
import {
  InteractionManager,
  type ViewTransform,
  type InteractionCallbacks,
} from "./interaction-manager.js"
import { DefaultRenderPlugin } from "./default-render-plugin.js"
import type { RenderPlugin } from "./render-plugin.js"
import type { PickHit } from "./picker.js"
import type { RenderNode, RenderLink } from "./types.js"

// Re-export for backward compatibility
export { PlusBadgeLayer, type BadgeData } from "./plus-badge-layer.js"

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
  /** 拾取模式: "gpu" = FBO (默认), "cpu" = CPU SDF 计算 */
  pickerMode?: "gpu" | "cpu"
  /** 自定义渲染插件（不传则使用 DefaultRenderPlugin） */
  renderPlugin?: (
    gl: WebGL2RenderingContext,
    canvas: HTMLCanvasElement,
  ) => RenderPlugin
  /** Plus 徽标边框宽度（世界坐标单位，默认 0） */
  plusBadgeBorderWidth?: number
  /** Plus 徽标边框颜色（默认红色） */
  plusBadgeBorderColor?: [number, number, number, number]
}

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

export function decodePickColor(r: number, g: number, b: number): number {
  return (
    (Math.round(r * 255) << 16) |
    (Math.round(g * 255) << 8) |
    Math.round(b * 255)
  )
}

export class WebGLRenderer {
  readonly container: HTMLElement
  readonly canvas: HTMLCanvasElement
  readonly plugin: RenderPlugin
  readonly interaction: InteractionManager

  private gl: WebGL2RenderingContext
  private camera = new Camera()

  nodes: RenderNode[] = []
  links: RenderLink[] = []

  private bgColor!: [number, number, number, number]
  private showArrows = false
  private labelMinScale = 0.5
  private width: number
  private height: number
  private _destroyed = false
  private _rafId = 0

  // 回调
  onNodeClick?: (nodeId: string | null, event: MouseEvent) => void
  onNodeHover?: (nodeId: string | null) => void
  onNodeDrag?: (nodeId: string, x: number, y: number) => void
  onNodeDragEnd?: (nodeId: string) => void
  onLinkClick?: (linkId: string | null, event: MouseEvent) => void
  onBackgroundClick?: (event: MouseEvent) => void
  onZoom?: (transform: ViewTransform) => void
  onPlusClick?: (nodeId: string) => void

  constructor(opts: WebGLRendererOptions) {
    this.container = opts.container

    // Canvas
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

    // WebGL2
    const gl = this.canvas.getContext("webgl2", {
      antialias: true,
      premultipliedAlpha: false,
    })
    if (!gl) throw new Error("WebGL2 not supported")
    this.gl = gl
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    gl.enable(gl.DEPTH_TEST)
    gl.depthFunc(gl.LEQUAL)

    // Background
    if (opts.backgroundColor) {
      const hex = opts.backgroundColor
      this.bgColor = [
        parseInt(hex.slice(1, 3), 16) / 255,
        parseInt(hex.slice(3, 5), 16) / 255,
        parseInt(hex.slice(5, 7), 16) / 255,
        1.0,
      ]
    } else {
      this.bgColor = [1, 1, 1, 1]
    }

    this.showArrows = opts.showArrows ?? false
    this.labelMinScale = opts.labelMinScale ?? 0.5

    // 渲染插件
    if (opts.renderPlugin) {
      this.plugin = opts.renderPlugin(gl, this.canvas)
    } else {
      this.plugin = new DefaultRenderPlugin({
        gl,
        canvas: this.canvas,
        width: this.width,
        height: this.height,
        pickerMode: opts.pickerMode,
        labelFontSize: opts.labelFontSize,
        plusBadgeBorderWidth: opts.plusBadgeBorderWidth,
        plusBadgeBorderColor: opts.plusBadgeBorderColor,
        onPlusClick: (nodeId) => this.onPlusClick?.(nodeId),
      })
    }

    // 交互管理器（插件即 Picker）
    this.interaction = new InteractionManager(
      this.canvas,
      this.plugin,
      this.makeCallbacks(),
    )
    this.interaction.transform = this.camera.state as ViewTransform

    // 尺寸监听
    const ro = new ResizeObserver(() => this.handleResize())
    ro.observe(this.container)

    this.startRenderLoop()
  }

  // ========== 回调 ==========

  private makeCallbacks(): InteractionCallbacks {
    return {
      onNodeClick: (id, e) => this.onNodeClick?.(id, e),
      onLinkClick: (id, e) => this.onLinkClick?.(id, e),
      onNodeHover: (id) => this.onNodeHover?.(id),
      onNodeDrag: (id, dx, dy) => {
        const k = this.interaction.transform.k
        const node = this.nodes.find((n) => n.id === id)
        if (node) {
          node.x += dx / k
          node.y += dy / k
          this.onNodeDrag?.(id, node.x, node.y)
          this.plugin.afterPositionUpdate?.(this.nodes)
        }
      },
      onNodeDragEnd: (id) => this.onNodeDragEnd?.(id),
      onBackgroundClick: (e) => this.onBackgroundClick?.(e),
      onZoom: (t) => this.onZoom?.(t),
      onPan: (t) => this.onZoom?.(t),
    }
  }

  // ========== Data ==========

  updateData(nodes: RenderNode[], links: RenderLink[]): void {
    this.nodes = nodes
    this.links = links
    this.plugin.syncData(nodes, links)
  }

  updateNodePositions(positions: Map<string, { x: number; y: number }>): void {
    for (const n of this.nodes) {
      const pos = positions.get(n.id)
      if (pos) {
        n.x = pos.x
        n.y = pos.y
      }
    }
    this.plugin.afterPositionUpdate?.(this.nodes)
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

    const t = this.interaction.transform

    this.plugin.render({
      nodes: this.nodes,
      links: this.links,
      width: w,
      height: h,
      tx: t.x,
      ty: t.y,
      scale: t.k,
      showArrows: this.showArrows,
      labelMinScale: this.labelMinScale,
    })

    // 同步相机
    this.plugin.tx = t.x
    this.plugin.ty = t.y
    this.plugin.k = t.k

    // 覆盖层
    const overlays = this.plugin.getOverlays()
    for (let i = 0; i < overlays.length; i++) {
      overlays[i].renderPickBuffer(w, h, t.x, t.y, t.k)
      overlays[i].render(w, h, t.x, t.y, t.k, -0.6 - i * 0.01)
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

  pick(screenX: number, screenY: number): PickHit | null {
    return this.plugin.pick(screenX, screenY)
  }

  // ========== Resize ==========

  private handleResize(): void {
    const dpr = window.devicePixelRatio || 1
    this.width = this.container.clientWidth
    this.height = this.container.clientHeight
    this.canvas.width = this.width * dpr
    this.canvas.height = this.height * dpr
    this.gl.viewport(0, 0, this.width * dpr, this.height * dpr)
    this.plugin.resize(this.width, this.height)
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
    const k = Math.min(this.width / graphW, this.height / graphH, 2)
    const t = this.interaction.transform
    t.k = k
    t.x = this.width / (2 * k) - (minX + maxX) / 2
    t.y = this.height / (2 * k) - (minY + maxY) / 2
    this.camera.reset()
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
    this.plugin.destroy()
    if (this.canvas.parentNode) this.container.removeChild(this.canvas)
  }
}
