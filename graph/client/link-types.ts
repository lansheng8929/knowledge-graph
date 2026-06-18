import type { GraphDataGenerics, GraphLink } from "./type"
import type { LStyle } from "../theme"

/**
 * 边渲染器的 Props
 */
export interface LinkRenderProps<G extends GraphDataGenerics = any> {
  link: GraphLink<G>
  ctx: CanvasRenderingContext2D
  globalScale: number
  style: LStyle
  startX: number
  startY: number
  endX: number
  endY: number
}

/**
 * 边指针区域渲染 Props
 */
export interface LinkPointerAreaProps<G extends GraphDataGenerics = any> {
  link: GraphLink<G>
  indexColor: string
  ctx: CanvasRenderingContext2D
  globalScale: number
  startX: number
  startY: number
  endX: number
  endY: number
}

/**
 * 边渲染器接口
 * 每种 LinkType 可实现自己的渲染逻辑
 */
export interface LinkRenderer<G extends GraphDataGenerics = any> {
  /** 渲染边主体 */
  renderLinkCanvasObject?: (props: LinkRenderProps<G>) => void

  /** 渲染边的指针交互区域（点击/悬停检测） */
  renderLinkPointerArea?: (props: LinkPointerAreaProps<G>) => void

  /** 获取边的宽度 */
  getLinkWidth?: (props: { link: GraphLink<G>; style: LStyle }) => number
}

/** 边渲染器部分实现（允许只实现部分方法） */
export type LinkCommonRenderer<G extends GraphDataGenerics = any> = Partial<
  LinkRenderer<G>
>

/** 边创建器：每次创建新的 LinkRenderer 实例 */
export type LinkCreator<G extends GraphDataGenerics = any> =
  () => LinkRenderer<G>

/** 边渲染器映射表 */
export type LinkRendererMap<G extends GraphDataGenerics = any> = Partial<
  Record<G["LT"], LinkRenderer<G>>
>
