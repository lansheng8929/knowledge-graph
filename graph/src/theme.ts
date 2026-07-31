import type { DefaultGraphDataGenerics, GraphDataGenerics } from "./client"

/**
 * 定义图视图的视觉样式配置。
 *
 * @template G - 图数据泛型类型,默认为 DefaultGraphDataGenerics
 *
 * @property background - 图视图的背景颜色或样式
 * @property node - 节点类型到其对应样式的映射,需要提供 'unknown' 作为回退样式
 * @property link - 连接线类型到其对应样式的映射,需要提供 'unknown' 作为回退样式
 *
 * @remarks
 * - node 和 link 属性使用 Partial 记录类型,允许每种类型的样式为可选
 * - node 和 link 都需要一个 'unknown' 样式作为未识别类型的回退
 * - G["NT"] 表示从图数据泛型中获取的节点类型判别器
 * - G["LT"] 表示从图数据泛型中获取的连接线类型判别器
 */
export interface GraphViewStyle<
  G extends GraphDataGenerics = DefaultGraphDataGenerics,
> {
  background?: string
  node: Partial<Record<G["NT"], NodeStyle<G>>>
  link: Partial<Record<G["LT"], LinkStyle<G>>>
}

export interface Style {
  textColor?: string
  bgColor?: string
  strokeWidth?: number
  strokeColor?: string
  tagColor?: string
  fontSize?: number
  radius?: number
  opacity?: number
}
export type NodeStyle<G extends GraphDataGenerics> = Record<G["NS"], Style>

export interface LStyle {
  color?: string
  stroke?: string
  strokeWidth?: number
  opacity?: number
  /** 箭头大小（屏幕像素），不设置则自动按线宽计算 */
  arrowSize?: number
}
export type LinkStyle<G extends GraphDataGenerics> = Record<G["LS"], LStyle>

const getNodeStyle = <G extends GraphDataGenerics>(
  v: NodeStyle<G>,
): NodeStyle<G> => {
  return v
}

export const getNodeStyleByType = <G extends GraphDataGenerics>(
  style: GraphViewStyle<G>,
  type?: G["NT"],
): NodeStyle<G> => {
  const key = type ?? ("default" as G["NT"])
  const v = style.node[key]
  if (v) return getNodeStyle<G>(v)
  // 未找到对应类型时回退到 default
  if (key !== ("default" as G["NT"])) {
    const fallback = style.node["default" as G["NT"]]
    if (fallback) return getNodeStyle<G>(fallback)
  }
  return {} as NodeStyle<G>
}

export const getNodeStyleByStateType = <G extends GraphDataGenerics>(
  style: NodeStyle<G>,
  type?: G["NS"],
): Style => {
  if (!type) return {} as Style
  const v = style[type]
  if (v) return v
  return {} as Style
}

const getLinkStyle = <G extends GraphDataGenerics>(
  v: LinkStyle<G>,
): LinkStyle<G> => {
  return v
}

export const getLinkStyleByType = <G extends GraphDataGenerics>(
  style: GraphViewStyle<G>,
  type?: G["LT"],
): LinkStyle<G> => {
  const key = type ?? ("default" as G["LT"])
  const v = style.link[key]
  if (v) return getLinkStyle<G>(v)
  if (key !== ("default" as G["LT"])) {
    const fallback = style.link["default" as G["LT"]]
    if (fallback) return getLinkStyle<G>(fallback)
  }
  return {} as LinkStyle<G>
}

export const getLinkStyleByStateType = <G extends GraphDataGenerics>(
  style: LinkStyle<G>,
  type?: G["LS"],
): LStyle => {
  if (!type) return {} as LStyle
  const v = style[type]
  if (v) return v
  return {} as LStyle
}
