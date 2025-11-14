import type { LinkState, LinkType, NodeState, NodeType } from "./type"
import { bankcardNodeStyle } from "./entity/bankcard/bankcard.style"
import { caseNodeStyle } from "./entity/case/case.style"
import { factorNodeStyle } from "./entity/factor/factor.style"
import { phoneNodeStyle } from "./entity/phone/phone.style"
import { serverNodeStyle } from "./entity/server/server.style"
import { defaultNodeStyle } from "./entity/default/default.style"

export interface GraphViewStyle {
  background: string
  node: Partial<Record<NodeType, NodeStyle>> & { unknown: NodeStyle }
  link: Partial<Record<LinkType, LinkStyle>> & { unknown: LinkStyle }
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
export type NodeStyle = Record<NodeState, Style>

export interface LStyle {
  color?: string
  stroke?: string
  opacity?: number
  light?: string
}
export type LinkStyle = Record<LinkState, LStyle>

export const getColorOnContainer = (
  container: HTMLElement,
  name: string,
  fallback: string
): string => {
  return getComputedStyle(container).getPropertyValue(name) || fallback
}

// 节点配置：定义每个类型的特定属性
const nodeConfigs: Record<NodeType | "unknown", NodeStyle> = {
  server: defaultNodeStyle,
  phone: defaultNodeStyle,
  bank_card: defaultNodeStyle,
  case: defaultNodeStyle,
  factor: defaultNodeStyle,
  default: defaultNodeStyle,
  unknown: defaultNodeStyle,
  relationship: defaultNodeStyle,
  reason: defaultNodeStyle,
  user_account: defaultNodeStyle,
  user_case: defaultNodeStyle,
  id_card: defaultNodeStyle,
  material: defaultNodeStyle,
  mac: defaultNodeStyle,
  orders: defaultNodeStyle,
  ipv4: defaultNodeStyle,
  paginator: defaultNodeStyle,
  email: defaultNodeStyle,
  ipv6: defaultNodeStyle,
  company: defaultNodeStyle,
}

// 辅助函数：从容器获取属性值，支持缓存
const getCachedProperty = (
  computedStyle: CSSStyleDeclaration,
  name: string,
  fallback: string
): string => {
  return computedStyle.getPropertyValue(name).trim() || fallback
}

// 辅助函数：生成默认节点样式
const createDefaultNodeStyle = (
  computedStyle: CSSStyleDeclaration,
  key: string,
  key2: string,
  overrides?: Partial<Style>
): Style => ({
  textColor: getCachedProperty(
    computedStyle,
    `--graph-${key}-node-textColor-${key2}`,
    "#000"
  ),
  strokeWidth: parseInt(
    getCachedProperty(
      computedStyle,
      `--graph-${key}-node-strokeWidth-${key2}`,
      "1.5"
    )
  ),
  strokeColor: getCachedProperty(
    computedStyle,
    `--graph-${key}-node-strokeColor-${key2}`,
    "#000"
  ),
  tagColor: getCachedProperty(
    computedStyle,
    `--graph-${key}-node-tagColor-${key2}`,
    "#000"
  ),
  radius: parseInt(
    getCachedProperty(computedStyle, `--graph-${key}-node-radius-${key2}`, "4")
  ),
  fontSize: parseInt(
    getCachedProperty(
      computedStyle,
      `--graph-${key}-node-fontSize-${key2}`,
      "2"
    )
  ),
  opacity: parseFloat(
    getCachedProperty(computedStyle, `--graph-${key}-node-opacity-${key2}`, "1")
  ),
  ...overrides,
})

/**
 * 通过使用提供的计算 CSS 样式、节点类型、配置和可选的默认覆盖，为每个节点状态（regular、highlighted、selected、hidden 和 root）生成样式，从而创建一个 NodeStyle 对象。
 *
 * @param computedStyle - 用于基于节点样式的计算 CSS 样式声明。
 * @param type - 节点的类型，可以是 NodeType、"default" 或 "unknown"。
 * @param config - 节点样式的基本配置。
 * @param defaultOverrides - 可选的部分样式覆盖，应用于所有节点状态。
 * @returns 包含每个节点状态样式的 NodeStyle 对象。
 */
const createNodeStyles = (
  computedStyle: CSSStyleDeclaration,
  type: NodeType | "default" | "unknown",
  config: NodeStyle,
  defaultOverrides?: Partial<Style>
): NodeStyle => {
  return {
    regular: createDefaultNodeStyle(computedStyle, type, "regular", {
      ...config.regular,
      ...defaultOverrides,
    }),
    highlighted: createDefaultNodeStyle(computedStyle, type, "highlighted", {
      ...config.highlighted,
      ...defaultOverrides,
    }),
    selected: createDefaultNodeStyle(computedStyle, type, "selected", {
      ...config.selected,
      ...defaultOverrides,
    }),
    hidden: createDefaultNodeStyle(computedStyle, type, "hidden", {
      ...config.hidden,
      ...defaultOverrides,
    }),
    root: createDefaultNodeStyle(computedStyle, "server", "root", {
      ...config.root,
      ...defaultOverrides,
    }),
  }
}

export const getDefaultColorOf = (opts: {
  container?: HTMLElement
  defaultNodeStyle?: Partial<Style>
}): GraphViewStyle => {
  const container = opts.container || document.body
  // 缓存样式计算
  const computedStyle = getComputedStyle(container)

  // 自定义默认节点样式覆盖
  const defaultOverrides = opts.defaultNodeStyle || {}

  return {
    background: getCachedProperty(
      computedStyle,
      `--graph-background`,
      "#f7f7f7"
    ),
    node: {
      server: createNodeStyles(
        computedStyle,
        "server",
        nodeConfigs["server"],
        defaultOverrides
      ),
      phone: createNodeStyles(
        computedStyle,
        "phone",
        nodeConfigs["phone"],
        defaultOverrides
      ),
      bank_card: createNodeStyles(
        computedStyle,
        "bank_card",
        nodeConfigs["bank_card"],
        defaultOverrides
      ),
      case: createNodeStyles(
        computedStyle,
        "case",
        nodeConfigs["case"],
        defaultOverrides
      ),
      factor: createNodeStyles(
        computedStyle,
        "factor",
        nodeConfigs["factor"],
        defaultOverrides
      ),
      default: createNodeStyles(
        computedStyle,
        "default",
        nodeConfigs["default"],
        defaultOverrides
      ),
      unknown: createNodeStyles(
        computedStyle,
        "unknown",
        nodeConfigs["unknown"],
        defaultOverrides
      ),
      relationship: createNodeStyles(
        computedStyle,
        "relationship",
        nodeConfigs["relationship"],
        defaultOverrides
      ),
      reason: createNodeStyles(
        computedStyle,
        "reason",
        nodeConfigs["reason"],
        defaultOverrides
      ),
      user_account: createNodeStyles(
        computedStyle,
        "user_account",
        nodeConfigs["user_account"],
        defaultOverrides
      ),
      user_case: createNodeStyles(
        computedStyle,
        "user_case",
        nodeConfigs["user_case"],
        defaultOverrides
      ),
      id_card: createNodeStyles(
        computedStyle,
        "id_card",
        nodeConfigs["id_card"],
        defaultOverrides
      ),
      material: createNodeStyles(
        computedStyle,
        "material",
        nodeConfigs["material"],
        defaultOverrides
      ),
      mac: createNodeStyles(
        computedStyle,
        "mac",
        nodeConfigs["mac"],
        defaultOverrides
      ),
      orders: createNodeStyles(
        computedStyle,
        "orders",
        nodeConfigs["orders"],
        defaultOverrides
      ),
      ipv4: createNodeStyles(
        computedStyle,
        "ipv4",
        nodeConfigs["ipv4"],
        defaultOverrides
      ),
      paginator: createNodeStyles(
        computedStyle,
        "paginator",
        nodeConfigs["paginator"],
        defaultOverrides
      ),
    },
    link: {
      unknown: {
        regular: {
          color: getCachedProperty(
            computedStyle,
            "--graph-link-color-regular",
            "#ccc"
          ),
          opacity: parseFloat(
            getCachedProperty(
              computedStyle,
              "--graph-link-opacity-regular",
              "1"
            )
          ),
        },
        highlighted: {
          color: getCachedProperty(
            computedStyle,
            "--graph-link-color-highlighted",
            "#ffff00"
          ),
          light: getCachedProperty(
            computedStyle,
            "--graph-link-light-highlighted",
            "#ffff00"
          ),
          opacity: parseFloat(
            getCachedProperty(
              computedStyle,
              "--graph-link-opacity-highlighted",
              "1"
            )
          ),
        },
        selected: {
          color: getCachedProperty(
            computedStyle,
            "--graph-link-color-selected",
            "#357abd"
          ),
          light: getCachedProperty(
            computedStyle,
            "--graph-link-light-selected",
            "#357abd"
          ),
          opacity: parseFloat(
            getCachedProperty(
              computedStyle,
              "--graph-link-opacity-selected",
              "1"
            )
          ),
        },
        hidden: {
          color: getCachedProperty(
            computedStyle,
            "--graph-link-color-hidden",
            "#ccc"
          ),
          opacity: parseFloat(
            getCachedProperty(
              computedStyle,
              "--graph-link-opacity-hidden",
              "0.3"
            )
          ),
        },
      },
    },
  }
}

const getNodeStyle = (v: NodeStyle): NodeStyle => {
  return v
}

export const getNodeStyleByType = (
  style: GraphViewStyle,
  type?: NodeType
): NodeStyle => {
  if (!type) return getNodeStyle(style.node.unknown)

  const v = style.node[type]
  if (!v) {
    const unknownStyle = getNodeStyle(style.node.unknown)
    return unknownStyle
  }
  return getNodeStyle(v)
}

export const getNodeStyleByStateType = (
  style: NodeStyle,
  type?: NodeState
): Style => {
  if (!type) return style.regular

  const v = style[type]
  if (!v) {
    return style.regular
  }

  return v
}

const getLinkStyle = (v: LinkStyle): LinkStyle => {
  return v
}

export const getLinkStyleByType = (
  style: GraphViewStyle,
  type?: LinkType
): LinkStyle => {
  if (!type) return getLinkStyle(style.link.unknown)

  const v = style.link[type]
  if (!v) {
    const unknownStyle = getLinkStyle(style.link.unknown)
    return unknownStyle
  }
  return getLinkStyle(v)
}

export const getLinkStyleByStateType = (
  style: LinkStyle,
  type?: LinkState
): LStyle => {
  if (!type) return style.regular

  const v = style[type]
  if (!v) {
    return style.regular
  }

  return v
}
