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
      bgColor: bg,
      strokeColor: stroke,
      textColor,
      radius: 8,
      strokeWidth: 2,
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
/**
 * 节点权重→大小映射的边界配置（docs/graph-analysis-plan.md P1 ① 扩展）：
 * weight 为 0~1，节点半径 = MIN + weight × (MAX - MIN)；
 * MIN=变小边界、MAX=变大边界，默认半径 8 对应 weight=0.5。
 */
export const NODE_WEIGHT_MIN_RADIUS = 4
export const NODE_WEIGHT_MAX_RADIUS = 12

/** weight → 节点半径（默认边界插值；weight 自动钳制到 0~1） */
export function nodeRadiusByWeight(weight: number): number {
  const w = Math.min(1, Math.max(0, weight))
  return (
    NODE_WEIGHT_MIN_RADIUS +
    w * (NODE_WEIGHT_MAX_RADIUS - NODE_WEIGHT_MIN_RADIUS)
  )
}

export function createTypedStyle(
  type: NodeTypeName,
  node: any,
  theme: Theme,
): NodeStyle<any> {
  const p = getPalette(theme)
  const c = p.node[type] ?? p.node.default
  // 默认统一半径（8）；按权重放大/缩小由 useGraphApp 的"节点权重"开关控制
  return themed(c.bg, c.stroke, p.text)
}

/** 动态创建默认节点样式 */
export function createDefaultNodeStyle(
  node: any,
  theme: Theme,
): NodeStyle<any> {
  return createTypedStyle("default", node, theme)
}
