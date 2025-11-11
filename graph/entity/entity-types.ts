import { ConnGraphEvents } from "../client/events"
import type { Style } from "../theme"
import type { GraphNode, NodeType } from "../type"

export interface EntityRenderer {
  renderNodeCanvasObject: (
    node: GraphNode,
    ctx: CanvasRenderingContext2D,
    globalScale: number,
    style: Style
  ) => void

  renderNodePointerArea: (
    node: GraphNode,
    color: string,
    ctx: CanvasRenderingContext2D,
    style: Style
  ) => void

  renderNodeTools?: (
    node: GraphNode,
    ctx: CanvasRenderingContext2D,
    globalScale: number
  ) => void

  registerNodeToolsEvents?: (
    events: ConnGraphEvents,
    node: GraphNode,
    mousePosition: { x: number; y: number }
  ) => void

  getCollisionRadius: (node: GraphNode, style: Style) => number
}

export type EntityCommonRenderer = Partial<EntityRenderer>

export interface EntityStyleConfig {
  radius?: number
  fontSize?: number
  bgColor?: string
  textColor?: string
  strokeColor?: string
  strokeWidth?: number
  opacity?: number
}

export type EntityCreator = () => EntityRenderer
export type EntityConfig = Partial<Record<NodeType, EntityStyleConfig>>
export type NodeRenderProcessorMap = Partial<Record<NodeType, EntityRenderer>>
