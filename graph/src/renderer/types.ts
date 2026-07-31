/**
 * Renderer type definitions
 */
import type {
  GraphNode,
  GraphLink,
  GraphDataGenerics,
  DefaultGraphDataGenerics,
} from "../client/type.js"

export interface ViewTransform {
  x: number
  y: number
  k: number
}

export interface Viewport {
  width: number
  height: number
}

/** Node shape type */
export type NodeShape = "circle"

export interface RenderNode {
  x: number
  y: number
  radius: number
  color: [number, number, number, number]
  strokeColor: [number, number, number, number]
  strokeWidth: number
  id: string
  label?: string
  /** Label text color (RGBA) */
  textColor?: [number, number, number, number]
  /** Label font size (px), defaults to atlas font size */
  fontSize?: number
  iconUrl?: string
  /** Node shape (default: "circle") */
  shape?: NodeShape
  /**
   * Shape-specific parameter:
   * - "rounded-rect": corner radius ratio (0-1, default 0.25)
   * - "star": inner radius ratio (0-1, default 0.4)
   * - other shapes: unused
   */
  shapeParam?: number

  /** 是否显示 "+" 拓出徽标 */
  showPlus?: boolean
  /** 徽标相对节点中心的 X 偏移比例 (节点半径的倍数), 正=右 */
  plusOffsetX?: number
  /** 徽标相对节点中心的 Y 偏移比例 (节点半径的倍数), 负=上 */
  plusOffsetY?: number
  /** 徽标整体大小 (节点半径的倍数), 控制白底圆+加号的大小 */
  plusScale?: number
}

export interface RenderLink {
  sourceX: number
  sourceY: number
  targetX: number
  targetY: number
  color: [number, number, number, number]
  width: number
  id: string
  label?: string
  /** 源头节点 ID（用于弧线分组） */
  sourceId?: string
  /** 目标节点 ID */
  targetId?: string
  /** Source node radius for endpoint offset */
  sourceRadius?: number
  /** Target node radius for endpoint offset */
  targetRadius?: number
  /** 箭头大小（屏幕像素） */
  arrowSize?: number
}

export interface RenderData {
  nodes: RenderNode[]
  links: RenderLink[]
}

export interface RendererOptions<
  G extends GraphDataGenerics = DefaultGraphDataGenerics,
> {
  container: HTMLElement
  width?: number
  height?: number
  backgroundColor?: string
  /** 节点渲染器：将 GraphNode 转为 RenderNode */
  mapNode?: (
    node: GraphNode<G["NO"], G["NT"], G["NS"]>,
    index: number,
  ) => RenderNode | null
  /** 边渲染器：将 GraphLink 转为 RenderLink */
  mapLink?: (link: GraphLink<G>, index: number) => RenderLink | null
}
