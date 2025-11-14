import type ColorTracker from "canvas-color-tracker"
import { ConnGraphEvents } from "../client/events"
import type { Style } from "../theme"
import type { GraphNode, NodeType } from "../type"
import type { TagManager } from "../tag-manager"
import type { LoadingManager } from "../loading-manager"

export interface EntityRenderer {
  renderNodeCanvasObject: (props: {
    node: GraphNode
    ctx: CanvasRenderingContext2D
    globalScale: number
    style: Style
    colorTracker: ColorTracker
    tagManager: TagManager
    loadingManager: LoadingManager
  }) => void

  renderNodePointerArea: (props: {
    node: GraphNode
    indexColor: string
    ctx: CanvasRenderingContext2D
    style: Style
    globalScale: number
    colorTracker: ColorTracker
    tagManager: TagManager
  }) => void

  renderNodeTools?: (props: {
    node: GraphNode
    ctx: CanvasRenderingContext2D
    globalScale: number
  }) => void

  registerNodeToolsEvents?: (props: {
    events: ConnGraphEvents
    node: GraphNode
    mousePosition: { x: number; y: number }
  }) => void

  getCollisionRadius: (props: { node: GraphNode; style: Style }) => number
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
