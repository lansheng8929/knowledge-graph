import type { Style } from "../theme"

import type { TagManager } from "../tag-manager"
import type { LoadingManager } from "../loading-manager"
import type { GraphNode } from "./type"

/** Simple color tracker type (replaces canvas-color-tracker dependency) */
export interface ColorTracker {
  register: (item: { type: string; d: unknown }) => string | undefined
  lookup: (color: string) => unknown | undefined
}

export interface ManagerProps<G extends GraphDataGenerics> {
  tagManager: TagManager<G>
  loadingManager: LoadingManager
}

import type { GraphDataGenerics } from "."

export interface EntityRenderer<G extends GraphDataGenerics> {
  renderNodeCanvasObject: (
    props: {
      node: GraphNode<G["NO"], G["NT"], G["NS"]>
      ctx: CanvasRenderingContext2D
      globalScale: number
      style: Style
      colorTracker: ColorTracker
    } & ManagerProps<G>,
  ) => void

  renderNodePointerArea: (
    props: {
      node: GraphNode<G["NO"], G["NT"], G["NS"]>
      indexColor: string
      ctx: CanvasRenderingContext2D
      style: Style
      globalScale: number
      colorTracker: ColorTracker
      shadowCtx: CanvasRenderingContext2D
    } & ManagerProps<G>,
  ) => void

  renderNodeTools?: (
    props: {
      node: GraphNode<G["NO"], G["NT"], G["NS"]>
      indexColor: string
      ctx: CanvasRenderingContext2D
      style: Style
      globalScale: number
      colorTracker: ColorTracker
      shadowCtx: CanvasRenderingContext2D
    } & ManagerProps<G>,
  ) => void

  renderNodeToolsPointerArea?: (
    props: {
      node: GraphNode<G["NO"], G["NT"], G["NS"]>
      indexColor?: string
      ctx: CanvasRenderingContext2D
      style: Style
      globalScale: number
      colorTracker: ColorTracker
      shadowCtx: CanvasRenderingContext2D
    } & ManagerProps<G>,
  ) => void

  getCollisionRadius: (props: {
    node: GraphNode<G["NO"], G["NT"], G["NS"]>
    style: Style
  }) => number
}

export type EntityCommonRenderer<G extends GraphDataGenerics = any> = Partial<
  EntityRenderer<G>
>

export interface EntityStyleConfig {
  radius?: number
  fontSize?: number
  bgColor?: string
  textColor?: string
  strokeColor?: string
  strokeWidth?: number
  opacity?: number
}

export type EntityCreator<G extends GraphDataGenerics> = () => EntityRenderer<G>

export type NodeRenderProcessorMap<G extends GraphDataGenerics> = Partial<
  Record<G["NT"], EntityRenderer<G>>
>

export type LinkRenderProcessorMap<G extends GraphDataGenerics> = Partial<
  Record<G["LT"], EntityRenderer<G>>
>
