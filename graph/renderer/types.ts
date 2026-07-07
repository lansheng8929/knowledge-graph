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

export interface RenderNode {
  x: number
  y: number
  radius: number
  color: [number, number, number, number]
  strokeColor: [number, number, number, number]
  strokeWidth: number
  id: string
  label?: string
  iconUrl?: string
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
