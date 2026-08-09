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
import type { RenderPlugin } from "./render-plugin.js"
import type {
  GraphDataGenerics,
  DefaultGraphDataGenerics,
} from "../client/type.js"
import type { PickHit } from "./picker.js"
import type { RenderNode, RenderLink } from "./types.js"

// Re-export for backward compatibility
export { PlusBadgeLayer, type BadgeData } from "./plus-badge-layer.js"

export interface WebGLRendererOptions<
  G extends GraphDataGenerics = DefaultGraphDataGenerics,
> {
  container: HTMLElement
  width?: number
  height?: number
  backgroundColor?: string
  showArrows?: boolean
  /** Minimum scale to show labels */
  labelMinScale?: number
  /** 渲染插件工厂（必填，外部传入创建函数） */
  renderPlugin: (
    gl: WebGL2RenderingContext,
    canvas: HTMLCanvasElement,
  ) => RenderPlugin<G>
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

export class WebGLRenderer<
  G extends GraphDataGenerics = DefaultGraphDataGenerics,
> {
  readonly container: HTMLElement
  readonly canvas: HTMLCanvasElement
  readonly plugin: RenderPlugin<G>
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
  private _fitAnimId = 0
  // 首次尺寸就绪时是否已自动 fitView（修复 macOS 挂载初期 height=0 导致节点小/左上角）
  private _autoFitDone = false

  // 回调
  onNodeClick?: (nodeId: string | null, event: MouseEvent) => void
  onNodeHover?: (nodeId: string | null) => void
  onLinkHover?: (linkId: string | null) => void
  onNodeContextMenu?: (nodeId: string, clientX: number, clientY: number) => void
  onNodeDrag?: (nodeId: string, x: number, y: number) => void
  onNodeDragEnd?: (nodeId: string) => void
  onLinkClick?: (linkId: string | null, event: MouseEvent) => void
  onBackgroundClick?: (event: MouseEvent) => void
  onZoom?: (transform: ViewTransform) => void
  onPlusClick?: (nodeId: string) => void

  constructor(opts: WebGLRendererOptions<G>) {
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
      // 保留绘制缓冲：截图/导出画布时需要，也便于自动化验证渲染结果
      preserveDrawingBuffer: true,
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

    // 渲染插件（由外部工厂创建，必填）
    this.plugin = opts.renderPlugin(gl, this.canvas)

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

  // ========== Background ==========

  /** 运行时切换画布背景色（主题切换用） */
  setBackgroundColor(hex: string): void {
    this.bgColor = [
      parseInt(hex.slice(1, 3), 16) / 255,
      parseInt(hex.slice(3, 5), 16) / 255,
      parseInt(hex.slice(5, 7), 16) / 255,
      1.0,
    ]
  }

  // ========== 回调 ==========

  private makeCallbacks(): InteractionCallbacks {
    return {
      onNodeClick: (id, e) => this.onNodeClick?.(id, e),
      onLinkClick: (id, e) => this.onLinkClick?.(id, e),
      onNodeHover: (id) => this.onNodeHover?.(id),
      onLinkHover: (id) => this.onLinkHover?.(id),
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
      onNodeContextMenu: (id, cx, cy) => this.onNodeContextMenu?.(id, cx, cy),
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
      // u_resolution 用 CSS 尺寸（与 fitView/交互的 transform 同一坐标空间）
      width: this.width,
      height: this.height,
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
      overlays[i].renderPickBuffer(this.width, this.height, t.x, t.y, t.k)
      overlays[i].render(
        this.width,
        this.height,
        t.x,
        t.y,
        t.k,
        -0.6 - i * 0.01,
      )
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

    // 首次尺寸就绪（0 → 非 0）且已有节点 → 自动 fitView。
    // 修复：数据加载时容器 height 可能为 0（single-spa 挂载初期/macOS 时序），
    // 那帧 fitView 被跳过且无重试，导致相机停在默认态（节点小、堆在左上角）。
    if (
      !this._autoFitDone &&
      this.width > 0 &&
      this.height > 0 &&
      this.nodes.length > 0
    ) {
      this._autoFitDone = true
      this.fitView(40)
    }
  }

  // ========== Camera ==========

  /** 平滑过渡 transform（easeOutCubic），供 fitView 过渡动画使用。 */
  private animateTransform(
    from: { x: number; y: number; k: number },
    to: { x: number; y: number; k: number },
    duration = 320,
    onDone?: () => void,
  ): void {
    if (this._fitAnimId) cancelAnimationFrame(this._fitAnimId)
    const t = this.interaction.transform
    const start = performance.now()
    const ease = (p: number) => 1 - Math.pow(1 - p, 3)
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / duration)
      const e = ease(p)
      t.k = from.k + (to.k - from.k) * e
      t.x = from.x + (to.x - from.x) * e
      t.y = from.y + (to.y - from.y) * e
      if (p < 1) this._fitAnimId = requestAnimationFrame(step)
      else {
        this._fitAnimId = 0
        onDone?.()
      }
    }
    this._fitAnimId = requestAnimationFrame(step)
  }

  fitView(padding = 0, animate = true): void {
    // 尺寸为 0 时（如 single-spa 挂载初期容器高度未就绪）跳过，避免 k=0 / NaN 变换
    if (this.nodes.length === 0 || this.width <= 0 || this.height <= 0) return
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
    // padding 为像素留白：可用区域 = 画布尺寸 - 2*padding
    // （此前 padding 是“世界单位”加到 bbox 上，图很大时视觉留白趋近 0）
    const graphW = Math.max(1, maxX - minX)
    const graphH = Math.max(1, maxY - minY)
    const availW = Math.max(1, this.width - padding * 2)
    const availH = Math.max(1, this.height - padding * 2)
    const k = Math.min(availW / graphW, availH / graphH, 2)
    const t = this.interaction.transform
    // 世界平移语义（配合 shader `(world + u_translation) * u_scale`）：
    // world=中心 → 映射到画布中心；四周留 padding 像素
    const tx = this.width / (2 * k) - (minX + maxX) / 2
    const ty = this.height / (2 * k) - (minY + maxY) / 2
    const done = () => {
      this.camera.reset()
      this.onZoom?.(t)
    }
    // 目标与当前几乎一致 → 直接落位；否则平滑过渡
    if (
      !animate ||
      (Math.abs(t.k - k) < 1e-4 &&
        Math.abs(t.x - tx) < 1e-4 &&
        Math.abs(t.y - ty) < 1e-4)
    ) {
      t.k = k
      t.x = tx
      t.y = ty
      done()
      return
    }
    this.animateTransform(
      { k: t.k, x: t.x, y: t.y },
      { k, x: tx, y: ty },
      320,
      done,
    )
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
