/**
 * WebGLRenderer — WebGL 图渲染器。
 *
 * 职责：WebGL 绘制节点、边、文字标签。
 * 相机由 Camera 类管理，交互委托给 InteractionManager + WebGLPicker。
 */

import { Camera } from "./camera.js"
import { NodeBatchRenderer } from "./node-batch.js"
import { LinkBatchRenderer } from "./link-batch.js"
import { TextLabelRenderer, type LabelInfo } from "./text-label.js"
import { WebGLPicker } from "./webgl-picker.js"
import { CpuPicker } from "./cpu-picker.js"
import {
  InteractionManager,
  type ViewTransform,
  type InteractionCallbacks,
} from "./interaction-manager.js"
import { PlusBadgeLayer, type BadgeData } from "./plus-badge-layer.js"
import type { Picker } from "./picker.js"
import type { RenderNode, RenderLink } from "./types.js"

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
  /** Plus 徽标边框宽度（世界坐标单位，默认 0） */
  plusBadgeBorderWidth?: number
  /** Plus 徽标边框颜色（默认红色） */
  plusBadgeBorderColor?: [number, number, number, number]
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
  readonly container: HTMLElement
  readonly canvas: HTMLCanvasElement
  readonly interaction: InteractionManager
  readonly picker: Picker
  readonly pickerMode: "gpu" | "cpu"
  readonly plusBadgeLayer: PlusBadgeLayer

  private gl: WebGL2RenderingContext
  private camera = new Camera()
  private nodeRenderer: NodeBatchRenderer
  private linkRenderer: LinkBatchRenderer
  private labelRenderer: TextLabelRenderer

  // Current data
  nodes: RenderNode[] = []
  links: RenderLink[] = []
  private labels: LabelInfo[] = []

  // Options
  private bgColor: [number, number, number, number] = [0.1, 0.1, 0.12, 1]
  private showArrows = false
  private labelMinScale = 0.2
  private width: number
  private height: number
  private _destroyed = false
  private _rafId = 0

  // 公开回调（桥接到 InteractionManager 和 PlusBadgeLayer）
  onNodeClick?: (nodeId: string | null, event: MouseEvent) => void
  onNodeHover?: (nodeId: string | null) => void
  onNodeDrag?: (nodeId: string, x: number, y: number) => void
  onNodeDragEnd?: (nodeId: string) => void
  onLinkClick?: (linkId: string | null, event: MouseEvent) => void
  onBackgroundClick?: (event: MouseEvent) => void
  onZoom?: (transform: ViewTransform) => void
  /** Plus 徽标点击回调（独立于 onNodeClick） */
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
      alpha: true,
      premultipliedAlpha: false,
    })
    if (!gl) throw new Error("WebGL2 not supported")
    this.gl = gl
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    gl.enable(gl.DEPTH_TEST)
    gl.depthFunc(gl.LEQUAL)

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
    this.labelRenderer = new TextLabelRenderer(gl, 2048, opts.labelFontSize)

    // 拾取器（可切换 GPU/FBO 或 CPU/SDF 模式）
    this.pickerMode = opts.pickerMode ?? "gpu"
    if (this.pickerMode === "cpu") {
      this.picker = new CpuPicker()
    } else {
      this.picker = new WebGLPicker({
        gl,
        nodeRenderer: this.nodeRenderer,
        linkRenderer: this.linkRenderer,
        width: this.width,
        height: this.height,
      })
    }

    // 交互管理器
    this.interaction = new InteractionManager(
      this.canvas,
      this.picker,
      this.makeCallbacks(),
    )
    // 保持相机同步
    this.interaction.transform = this.camera.state as ViewTransform

    // PlusBadgeLayer — 独立的工具交互层（capture phase 拦截事件）
    this.plusBadgeLayer = new PlusBadgeLayer({
      canvas: this.canvas,
      gl,
      onPlusClick: (nodeId) => {
        this.onPlusClick?.(nodeId)
      },
      borderWidth: opts.plusBadgeBorderWidth,
      borderColor: opts.plusBadgeBorderColor,
    })

    // 尺寸监听
    const ro = new ResizeObserver(() => this.handleResize())
    ro.observe(this.container)

    this.startRenderLoop()
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
        const k = self.interaction.transform.k
        const node = self.nodes.find((n) => n.id === nodeId)
        if (node) {
          node.x += dx / k
          node.y += dy / k
          self.onNodeDrag?.(nodeId, node.x, node.y)
          self.updatePlusBadges()
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

  // ========== Data ==========

  updateData(nodes: RenderNode[], links: RenderLink[]): void {
    this.nodes = nodes
    this.links = links
    this.picker.syncData(nodes, links)

    const texts = nodes.map((n) => n.label).filter(Boolean) as string[]
    texts.push(...(links.map((l) => l.label).filter(Boolean) as string[]))
    this.labelRenderer.preRegister(texts)

    // 同步 Plus 徽标数据
    this.updatePlusBadges()
  }

  /** 从节点数据构建并更新 Plus 徽标列表 */
  private updatePlusBadges(): void {
    const badges: BadgeData[] = []
    for (const n of this.nodes) {
      if (!n.showPlus) continue
      const offX = n.radius * (n.plusOffsetX ?? 0.5)
      const offY = n.radius * (n.plusOffsetY ?? -0.5)
      badges.push({
        x: n.x + offX,
        y: n.y + offY,
        radius: n.radius * (n.plusScale ?? 0.35),
        nodeId: n.id,
      })
    }
    this.plusBadgeLayer.updateBadges(badges)
  }

  updateNodePositions(positions: Map<string, { x: number; y: number }>): void {
    for (const n of this.nodes) {
      const pos = positions.get(n.id)
      if (pos) {
        n.x = pos.x
        n.y = pos.y
      }
    }
    // 物理 tick 后同步徽标位置
    this.updatePlusBadges()
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
    const { x, y, k } = t

    // Render links (z = 0.0, behind nodes)
    this.linkRenderer.render(this.links, w, h, x, y, k, this.showArrows, 0)

    // Render nodes (z = -0.5, in front of links)
    this.nodeRenderer.render(this.nodes, w, h, x, y, k, -0.5)

    // Render labels

    // Render labels
    this.labels = this.labelRenderer.buildNodeLabels(
      this.nodes,
      k,
      this.labelMinScale,
    )
    this.labelRenderer.render(this.labels, w, h, x, y, k, -1.0)

    // 同步拾取器的相机
    this.picker.tx = x
    this.picker.ty = y
    this.picker.k = k

    // PlusBadgeLayer：渲染拾取缓冲 + 徽标（在节点之上）
    this.plusBadgeLayer.renderPickBuffer(w, h, x, y, k)
    this.plusBadgeLayer.render(w, h, x, y, k, -0.6)
  }

  private startRenderLoop(): void {
    const loop = () => {
      if (this._destroyed) return
      this.render()
      this._rafId = requestAnimationFrame(loop)
    }
    this._rafId = requestAnimationFrame(loop)
  }

  // ========== Picking（委托给 WebGLPicker） ==========

  pick(
    screenX: number,
    screenY: number,
  ): { type: "node" | "link"; id: string } | null {
    return this.picker.pick(screenX, screenY)
  }

  // ========== 尺寸变化 ==========

  private handleResize(): void {
    const dpr = window.devicePixelRatio || 1
    this.width = this.container.clientWidth
    this.height = this.container.clientHeight
    this.canvas.width = this.width * dpr
    this.canvas.height = this.height * dpr
    this.gl.viewport(0, 0, this.width * dpr, this.height * dpr)
    this.picker.resize(this.width, this.height)
    this.plusBadgeLayer.ensurePickFbo(this.width * dpr, this.height * dpr)
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
    this.nodeRenderer.destroy()
    this.linkRenderer.destroy()
    this.labelRenderer.destroy()
    this.picker.destroy()
    this.plusBadgeLayer.destroy()
    if (this.canvas.parentNode) this.container.removeChild(this.canvas)
  }
}
