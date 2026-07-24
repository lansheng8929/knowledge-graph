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
import type { RenderNode, RenderLink } from "./types.js"

export interface GraphRendererOptions {
  container: HTMLElement
  width?: number
  height?: number
  backgroundColor?: string
  showArrows?: boolean
  labelMinScale?: number
  labelFontSize?: number
  /** 拾取模式: "gpu" = FBO (默认), "cpu" = CPU SDF 计算 */
  pickerMode?: "gpu" | "cpu"
  /** 自定义渲染插件 */
  renderPlugin?: (
    gl: WebGL2RenderingContext,
    canvas: HTMLCanvasElement,
  ) => RenderPlugin
  /** Plus 徽标边框宽度（世界坐标单位，默认 0） */
  plusBadgeBorderWidth?: number
  /** Plus 徽标边框颜色（默认红色） */
  plusBadgeBorderColor?: [number, number, number, number]
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
  /** Plus 徽标点击回调 */
  onPlusClick?: (nodeId: string) => void
}

export class GraphRenderer {
  /** 实际渲染器 */
  readonly backend: WebGLRenderer

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
  get plugin(): RenderPlugin {
    return this.backend.plugin
  }

  // ========== 回调桥接 ==========

  onNodeClick?: GraphRendererCallbacks["onNodeClick"]
  onNodeHover?: GraphRendererCallbacks["onNodeHover"]
  onNodeDrag?: GraphRendererCallbacks["onNodeDrag"]
  onNodeDragEnd?: GraphRendererCallbacks["onNodeDragEnd"]
  onLinkClick?: GraphRendererCallbacks["onLinkClick"]
  onBackgroundClick?: GraphRendererCallbacks["onBackgroundClick"]
  onZoom?: GraphRendererCallbacks["onZoom"]
  onPlusClick?: GraphRendererCallbacks["onPlusClick"]

  constructor(opts: GraphRendererOptions) {
    this.backend = new WebGLRenderer({
      container: opts.container,
      width: opts.width,
      height: opts.height,
      backgroundColor: opts.backgroundColor,
      showArrows: opts.showArrows,
      labelMinScale: opts.labelMinScale,
      labelFontSize: opts.labelFontSize,
      pickerMode: opts.pickerMode,
      renderPlugin: opts.renderPlugin,
      plusBadgeBorderWidth: opts.plusBadgeBorderWidth,
      plusBadgeBorderColor: opts.plusBadgeBorderColor,
    })

    this.backend.onNodeClick = (...args) => this.onNodeClick?.(...args)
    this.backend.onNodeHover = (...args) => this.onNodeHover?.(...args)
    this.backend.onNodeDrag = (...args) => this.onNodeDrag?.(...args)
    this.backend.onNodeDragEnd = (...args) => this.onNodeDragEnd?.(...args)
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
