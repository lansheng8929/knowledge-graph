/**
 * GraphRenderer — 渲染器代理门面。
 *
 * 职责：
 * - 根据配置选择 Canvas2D 或 WebGL 渲染后端
 * - 确保 Canvas2D ↔ CanvasColorPicker、WebGL ↔ WebGLPicker 的正确绑定
 * - 对外暴露统一 API
 */

import { Canvas2DRenderer } from "./canvas2d-renderer.js"
import { WebGLRenderer } from "./webgl-renderer.js"
import {
  InteractionManager,
  type ViewTransform,
} from "./interaction-manager.js"
import type { CanvasColorPicker } from "./canvas-picker.js"
import type { WebGLPicker } from "./webgl-picker.js"
import type { RenderNode, RenderLink } from "./types.js"

export type RendererBackend = "canvas" | "webgl"

export interface GraphRendererOptions {
  container: HTMLElement
  width?: number
  height?: number
  backgroundColor?: string
  showArrows?: boolean
  labelMinScale?: number
  labelFontSize?: number
  /** 渲染后端，默认 "canvas" */
  renderer?: RendererBackend
}

/**
 * 统一回调接口（与 InteractionCallbacks 对齐）
 */
export interface GraphRendererCallbacks {
  onNodeClick?: (nodeId: string | null, event: MouseEvent) => void
  onNodeHover?: (nodeId: string | null) => void
  onNodeDrag?: (nodeId: string, x: number, y: number) => void
  onNodeDragEnd?: (nodeId: string) => void
  onLinkClick?: (linkId: string | null, event: MouseEvent) => void
  onBackgroundClick?: (event: MouseEvent) => void
  onZoom?: (transform: ViewTransform) => void
}

export class GraphRenderer {
  /** 实际渲染器 */
  readonly backend: Canvas2DRenderer | WebGLRenderer
  /** 渲染后端类型 */
  readonly backendType: RendererBackend

  /** 画布元素 */
  get canvas(): HTMLCanvasElement {
    return this.backend.canvas
  }

  /** 交互管理器（WebGL 与 Canvas2D 共享同一接口） */
  get interaction(): InteractionManager {
    return this.backend.interaction
  }

  /**
   * 当前绑定的拾取器。
   * Canvas2D 模式下为 CanvasColorPicker，WebGL 模式下为 WebGLPicker。
   */
  get picker(): CanvasColorPicker | WebGLPicker {
    return this.backend.picker
  }

  /** 渲染器内部节点数据 */
  get nodes(): RenderNode[] {
    return (this.backend as any).nodes ?? []
  }

  /** 渲染器内部边数据 */
  get links(): RenderLink[] {
    return (this.backend as any).links ?? []
  }

  // ========== 回调桥接 ==========

  onNodeClick?: GraphRendererCallbacks["onNodeClick"]
  onNodeHover?: GraphRendererCallbacks["onNodeHover"]
  onNodeDrag?: GraphRendererCallbacks["onNodeDrag"]
  onNodeDragEnd?: GraphRendererCallbacks["onNodeDragEnd"]
  onLinkClick?: GraphRendererCallbacks["onLinkClick"]
  onBackgroundClick?: GraphRendererCallbacks["onBackgroundClick"]
  onZoom?: GraphRendererCallbacks["onZoom"]

  constructor(opts: GraphRendererOptions) {
    const backend = opts.renderer ?? "canvas"

    if (backend === "webgl") {
      // WebGL 模式：WebGLRenderer ← 绑定 → WebGLPicker
      this.backendType = "webgl"
      this.backend = new WebGLRenderer({
        container: opts.container,
        width: opts.width,
        height: opts.height,
        backgroundColor: opts.backgroundColor,
        showArrows: opts.showArrows,
        labelMinScale: opts.labelMinScale,
        labelFontSize: opts.labelFontSize,
      })
    } else {
      // Canvas 2D 模式：Canvas2DRenderer ← 绑定 → CanvasColorPicker
      this.backendType = "canvas"
      this.backend = new Canvas2DRenderer({
        container: opts.container,
        width: opts.width,
        height: opts.height,
        backgroundColor: opts.backgroundColor,
        showArrows: opts.showArrows,
        labelMinScale: opts.labelMinScale,
        labelFontSize: opts.labelFontSize,
      })
    }

    // 桥接渲染器的回收到外层
    this.backend.onNodeClick = (...args) => this.onNodeClick?.(...args)
    this.backend.onNodeHover = (...args) => this.onNodeHover?.(...args)
    this.backend.onNodeDrag = (...args) => this.onNodeDrag?.(...args)
    this.backend.onNodeDragEnd = (...args) => this.onNodeDragEnd?.(...args)
    this.backend.onLinkClick = (...args) => this.onLinkClick?.(...args)
    this.backend.onBackgroundClick = (...args) =>
      this.onBackgroundClick?.(...args)
    this.backend.onZoom = (...args) => this.onZoom?.(...args)
  }

  // ========== 统一 API ==========

  /** 更新数据 */
  updateData(nodes: RenderNode[], links: RenderLink[]): void {
    this.backend.updateData(nodes, links)
  }

  /** 更新节点位置（物理 tick 回调） */
  updateNodePositions(positions: Map<string, { x: number; y: number }>): void {
    this.backend.updateNodePositions(positions)
  }

  /** 自适应视图 */
  fitView(padding?: number): void {
    this.backend.fitView(padding)
  }

  /** 聚焦到某节点 */
  focusNode(nodeId: string): void {
    this.backend.focusNode(nodeId)
  }

  /** 销毁释放资源 */
  destroy(): void {
    this.backend.destroy()
  }
}
