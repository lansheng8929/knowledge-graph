import type { NodeStyle } from "@lansheng/knowledge-graph"
import { getPalette, type Theme } from "../../theme"

/**
 * 生成各状态下的节点样式
 */
export function themed(
  bg: string,
  stroke: string,
  textColor = "#2c2c2c",
): NodeStyle<any> {
  return {
    regular: {
      bgColor: bg,
      strokeColor: stroke,
      textColor,
      radius: 8,
      strokeWidth: 1,
      opacity: 1,
      fontSize: 16,
    },
    hovered: {
      bgColor: bg,
      strokeColor: "#00ccff",
      textColor,
      radius: 8,
      strokeWidth: 2,
      opacity: 1,
      fontSize: 16,
    },
    highlighted: {
      bgColor: bg,
      strokeColor: "#fde047",
      textColor: "#2c2c2c",
      radius: 8,
      strokeWidth: 2,
      opacity: 1,
      fontSize: 16,
    },
    selected: {
      bgColor: bg,
      strokeColor: "#0066ff",
      textColor,
      radius: 8,
      strokeWidth: 2,
      opacity: 1,
      fontSize: 16,
    },
    hidden: {
      bgColor: "#fff",
      strokeColor: stroke,
      textColor,
      radius: 8,
      strokeWidth: 1.5,
      opacity: 0.15,
      fontSize: 16,
    },
    root: {
      bgColor: "#fff",
      strokeColor: "#e67e00",
      textColor,
      radius: 6,
      strokeWidth: 2,
      opacity: 1,
      fontSize: 16,
    },
  }
}

export const defaultNodeStyle = themed("#357abd", "#ccc")

export type NodeTypeName =
  | "default"
  | "person"
  | "phone"
  | "address"
  | "account"
  | "company"
  | "ip"
  | "device"

/**
 * 依据外部传入的主题调色板 + 节点数据生成节点样式。
 * 主题切换后调用 GraphView.refreshTheme() 会重新走这里，实现动态换肤。
 */
export function createTypedStyle(
  type: NodeTypeName,
  node: any,
  theme: Theme,
): NodeStyle<any> {
  const p = getPalette(theme)
  const c = p.node[type] ?? p.node.default
  const style = themed(c.bg, c.stroke, p.text)
  const weight = (node.data as any)?.weight ?? 1
  return {
    ...style,
    regular: { ...style.regular, radius: weight * 8 },
    selected: { ...style.selected, radius: weight * 8 },
    hovered: { ...style.hovered, radius: weight * 8 },
  }
}

/** 动态创建默认节点样式 */
export function createDefaultNodeStyle(
  node: any,
  theme: Theme,
): NodeStyle<any> {
  return createTypedStyle("default", node, theme)
}
