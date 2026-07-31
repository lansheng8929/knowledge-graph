/**
 * GraphRenderer — WebGL 渲染器门面。
 *
 * 职责：
 * - 创建 WebGLRenderer 并对外暴露统一 API
 */

import { WebGLRenderer } from "./webgl-renderer.js"
import {
  InteractionManager,
  type ViewTransform,
} from "./interaction-manager.js"
import type { Picker } from "./picker.js"
import type { RenderPlugin } from "./render-plugin.js"
import type {
  GraphDataGenerics,
  DefaultGraphDataGenerics,
} from "../client/type.js"
import type { RenderNode, RenderLink } from "./types.js"

export interface GraphRendererOptions<
  G extends GraphDataGenerics = DefaultGraphDataGenerics,
> {
  container: HTMLElement
  width?: number
  height?: number
  backgroundColor?: string
  showArrows?: boolean
  labelMinScale?: number
  /** 渲染插件工厂（必填） */
  renderPlugin: (
    gl: WebGL2RenderingContext,
    canvas: HTMLCanvasElement,
  ) => RenderPlugin<G>
}

/**
 * 统一回调接口（与 InteractionCallbacks 对齐）
 */
export interface GraphRendererCallbacks {
  onNodeClick?: (nodeId: string | null, event: MouseEvent) => void
  onNodeHover?: (nodeId: string | null) => void
  onLinkHover?: (linkId: string | null) => void
  onNodeDrag?: (nodeId: string, x: number, y: number) => void
  onNodeDragEnd?: (nodeId: string) => void
  onNodeContextMenu?: (nodeId: string, clientX: number, clientY: number) => void
  onLinkClick?: (linkId: string | null, event: MouseEvent) => void
  onBackgroundClick?: (event: MouseEvent) => void
  onZoom?: (transform: ViewTransform) => void
  /** Plus 徽标点击回调 */
  onPlusClick?: (nodeId: string) => void
}

export class GraphRenderer<
  G extends GraphDataGenerics = DefaultGraphDataGenerics,
> {
  /** 实际渲染器 */
  readonly backend: WebGLRenderer<G>

  /** 画布元素 */
  get canvas(): HTMLCanvasElement {
    return this.backend.canvas
  }

  /** 交互管理器 */
  get interaction(): InteractionManager {
    return this.backend.interaction
  }

  /** 当前绑定的拾取器 */
  get picker(): Picker {
    return this.backend.plugin
  }

  /** 渲染器内部节点数据 */
  get nodes(): RenderNode[] {
    return this.backend.nodes
  }

  /** 渲染器内部边数据 */
  get links(): RenderLink[] {
    return this.backend.links
  }

  /** 获取当前渲染插件 */
  get plugin(): RenderPlugin<G> {
    return this.backend.plugin
  }

  /** 运行时切换画布背景色（主题切换用） */
  setBackgroundColor(hex: string): void {
    this.backend.setBackgroundColor(hex)
  }

  // ========== 回调桥接 ==========

  onNodeClick?: GraphRendererCallbacks["onNodeClick"]
  onNodeHover?: GraphRendererCallbacks["onNodeHover"]
  onLinkHover?: GraphRendererCallbacks["onLinkHover"]
  onNodeDrag?: GraphRendererCallbacks["onNodeDrag"]
  onNodeDragEnd?: GraphRendererCallbacks["onNodeDragEnd"]
  onNodeContextMenu?: GraphRendererCallbacks["onNodeContextMenu"]
  onLinkClick?: GraphRendererCallbacks["onLinkClick"]
  onBackgroundClick?: GraphRendererCallbacks["onBackgroundClick"]
  onZoom?: GraphRendererCallbacks["onZoom"]
  onPlusClick?: GraphRendererCallbacks["onPlusClick"]

  constructor(opts: GraphRendererOptions<G>) {
    this.backend = new WebGLRenderer<G>({
      container: opts.container,
      width: opts.width,
      height: opts.height,
      backgroundColor: opts.backgroundColor,
      showArrows: opts.showArrows,
      labelMinScale: opts.labelMinScale,
      renderPlugin: opts.renderPlugin,
    })

    this.backend.onNodeClick = (...args) => this.onNodeClick?.(...args)
    this.backend.onNodeHover = (...args) => this.onNodeHover?.(...args)
    this.backend.onLinkHover = (...args) => this.onLinkHover?.(...args)
    this.backend.onNodeDrag = (...args) => this.onNodeDrag?.(...args)
    this.backend.onNodeDragEnd = (...args) => this.onNodeDragEnd?.(...args)
    this.backend.onNodeContextMenu = (...args) =>
      this.onNodeContextMenu?.(...args)
    this.backend.onLinkClick = (...args) => this.onLinkClick?.(...args)
    this.backend.onBackgroundClick = (...args) =>
      this.onBackgroundClick?.(...args)
    this.backend.onZoom = (...args) => this.onZoom?.(...args)
    this.backend.onPlusClick = (...args) => this.onPlusClick?.(...args)
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
