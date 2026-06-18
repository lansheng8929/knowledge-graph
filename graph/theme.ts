import type { LinkState, LinkType, NodeState, NodeType } from "./type"
import { defaultNodeStyle } from "./entity/default/default.style"
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
  background: string
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
  light?: string
}
export type NodeStyle<G extends GraphDataGenerics> = Record<G["NS"], Style>

export interface LStyle {
  color?: string
  stroke?: string
  opacity?: number
  light?: string
}
export type LinkStyle<G extends GraphDataGenerics> = Record<G["LS"], LStyle>

export const getColorOnContainer = (
  container: HTMLElement,
  name: string,
  fallback: string,
): string => {
  return getComputedStyle(container).getPropertyValue(name) || fallback
}

// 节点配置：定义每个类型的特定属性
const nodeConfigs: Record<NodeType, NodeStyle<DefaultGraphDataGenerics>> = {
  default: defaultNodeStyle,
}

// 辅助函数：从容器获取属性值，支持缓存
export const getCachedProperty = (
  computedStyle: CSSStyleDeclaration,
  name: string,
  fallback: string,
): string => {
  return computedStyle.getPropertyValue(name).trim() || fallback
}

// 辅助函数：生成默认节点样式
const createDefaultNodeStyle = (
  computedStyle: CSSStyleDeclaration,
  key: string,
  key2: string,
  overrides?: Partial<Style>,
): Style => ({
  textColor: getCachedProperty(
    computedStyle,
    `--graph-${key}-node-textColor-${key2}`,
    "#000",
  ),
  strokeWidth: parseInt(
    getCachedProperty(
      computedStyle,
      `--graph-${key}-node-strokeWidth-${key2}`,
      "1.5",
    ),
  ),
  strokeColor: getCachedProperty(
    computedStyle,
    `--graph-${key}-node-strokeColor-${key2}`,
    "#000",
  ),
  tagColor: getCachedProperty(
    computedStyle,
    `--graph-${key}-node-tagColor-${key2}`,
    "#000",
  ),
  radius: parseInt(
    getCachedProperty(computedStyle, `--graph-${key}-node-radius-${key2}`, "4"),
  ),
  fontSize: parseInt(
    getCachedProperty(
      computedStyle,
      `--graph-${key}-node-fontSize-${key2}`,
      "2",
    ),
  ),
  opacity: parseFloat(
    getCachedProperty(
      computedStyle,
      `--graph-${key}-node-opacity-${key2}`,
      "1",
    ),
  ),
  ...overrides,
})

/**
 * 通过使用提供的计算 CSS 样式、节点类型和配置，为每个节点状态（regular、highlighted、selected、hidden 和 root）生成样式，从而创建一个 NodeStyle 对象。
 *
 * @param computedStyle - 用于基于节点样式的计算 CSS 样式声明。
 * @param type - 节点的类型，可以是 NodeType、"default" 或 "unknown"。
 * @param config - 节点样式的基本配置。
 * @returns 包含每个节点状态样式的 NodeStyle 对象。
 */
const createNodeStyles = (
  computedStyle: CSSStyleDeclaration,
  type: NodeType | "default",
  config: NodeStyle<DefaultGraphDataGenerics>,
): NodeStyle<DefaultGraphDataGenerics> => {
  return {
    regular: createDefaultNodeStyle(
      computedStyle,
      type,
      "regular",
      config.regular,
    ),
    hovered: createDefaultNodeStyle(
      computedStyle,
      type,
      "hovered",
      config.hovered,
    ),
    highlighted: createDefaultNodeStyle(
      computedStyle,
      type,
      "highlighted",
      config.highlighted,
    ),
    selected: createDefaultNodeStyle(
      computedStyle,
      type,
      "selected",
      config.selected,
    ),
    hidden: createDefaultNodeStyle(
      computedStyle,
      type,
      "hidden",
      config.hidden,
    ),
    root: createDefaultNodeStyle(computedStyle, "server", "root", config.root),
  }
}

export const getDefaultColorOf = <G extends GraphDataGenerics>(
  container: HTMLElement,
): GraphViewStyle<G> => {
  // 缓存样式计算
  const computedStyle = getComputedStyle(container)

  return {
    background: getCachedProperty(
      computedStyle,
      `--graph-background`,
      "#f7f7f7",
    ),
    node: {
      default: createNodeStyles(
        computedStyle,
        "default",
        nodeConfigs["default"],
      ) as NodeStyle<G>,
    } as Partial<Record<G["NT"], NodeStyle<G>>>,
    link: {
      default: {
        regular: {
          color: getCachedProperty(
            computedStyle,
            "--graph-link-color-regular",
            "#ccc",
          ),
          opacity: parseFloat(
            getCachedProperty(
              computedStyle,
              "--graph-link-opacity-regular",
              "1",
            ),
          ),
        },
        highlighted: {
          color: getCachedProperty(
            computedStyle,
            "--graph-link-color-highlighted",
            "#ffff00",
          ),
          light: getCachedProperty(
            computedStyle,
            "--graph-link-light-highlighted",
            "#ffff00",
          ),
          opacity: parseFloat(
            getCachedProperty(
              computedStyle,
              "--graph-link-opacity-highlighted",
              "1",
            ),
          ),
        },
        selected: {
          color: getCachedProperty(
            computedStyle,
            "--graph-link-color-selected",
            "#357abd",
          ),
          light: getCachedProperty(
            computedStyle,
            "--graph-link-light-selected",
            "#357abd",
          ),
          opacity: parseFloat(
            getCachedProperty(
              computedStyle,
              "--graph-link-opacity-selected",
              "1",
            ),
          ),
        },
        hidden: {
          color: getCachedProperty(
            computedStyle,
            "--graph-link-color-hidden",
            "#ccc",
          ),
          opacity: parseFloat(
            getCachedProperty(
              computedStyle,
              "--graph-link-opacity-hidden",
              "0.3",
            ),
          ),
        },
      } as LinkStyle<G>,
    } as Partial<Record<G["LT"], LinkStyle<G>>>,
  }
}
const getNodeStyle = <G extends GraphDataGenerics>(
  v: NodeStyle<G>,
): NodeStyle<G> => {
  return v
}

export const getNodeStyleByType = <G extends GraphDataGenerics>(
  style: GraphViewStyle<G>,
  type?: G["NT"],
): NodeStyle<G> => {
  if (!type) return {} as NodeStyle<G>
  const v = style.node[type]
  if (v) return getNodeStyle<G>(v)
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
  if (!type) return {} as LinkStyle<G>
  const v = style.link[type as G["LT"]]
  if (v) return getLinkStyle<G>(v)
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
