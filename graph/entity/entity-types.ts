import type ColorTracker from "canvas-color-tracker"
import type { Style } from "../theme"

import type { TagManager } from "../tag-manager"
import type { LoadingManager } from "../loading-manager"
import type { GraphNode } from "../client/type"
import type { NodeType, NodeState, LinkType } from "../type"

export interface EntityRenderer<
  T extends string = NodeType,
  S extends string = NodeState
> {
  renderNodeCanvasObject: (props: {
    node: GraphNode<{
      nodeType?: T
      stateType?: S
    }>
    ctx: CanvasRenderingContext2D
    globalScale: number
    style: Style
    colorTracker: ColorTracker
    tagManager: TagManager
    loadingManager: LoadingManager
  }) => void

  renderNodePointerArea: (props: {
    node: GraphNode<{
      nodeType?: T
      stateType?: S
    }>
    indexColor: string
    ctx: CanvasRenderingContext2D
    style: Style
    globalScale: number
    colorTracker: ColorTracker
    tagManager: TagManager
    shadowCtx: CanvasRenderingContext2D
  }) => void

  renderNodeTools?: (props: {
    node: GraphNode<{
      nodeType?: T
      stateType?: S
    }>
    indexColor: string
    ctx: CanvasRenderingContext2D
    style: Style
    globalScale: number
    colorTracker: ColorTracker
    tagManager: TagManager
    shadowCtx: CanvasRenderingContext2D
  }) => void

  renderNodeToolsPointerArea?: (props: {
    node: GraphNode<{
      nodeType?: T
      stateType?: S
    }>
    indexColor?: string
    ctx: CanvasRenderingContext2D
    style: Style
    globalScale: number
    colorTracker: ColorTracker
    tagManager: TagManager
    shadowCtx: CanvasRenderingContext2D
  }) => void

  getCollisionRadius: (props: {
    node: GraphNode<{
      nodeType?: T
      stateType?: S
    }>
    style: Style
  }) => number
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

export type EntityCreator<
  T extends string = NodeType,
  S extends string = NodeState
> = () => EntityRenderer<T, S>

export type NodeRenderProcessorMap<T extends string = NodeType> = Partial<
  Record<T, EntityRenderer>
>

export type LinkRenderProcessorMap<T extends string = LinkType> = Partial<
  Record<T, EntityRenderer>
>
