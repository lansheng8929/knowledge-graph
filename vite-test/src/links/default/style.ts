import type { LinkStyle } from "@lansheng/knowledge-graph"
import { getPalette, type Theme } from "../../theme"

export const defaultLinkStyle: LinkStyle<any> = {
  regular: {
    color: "#9ca3af",
    strokeWidth: 0.1,
    opacity: 0.8,
    arrowSize: 8,
  },
  hovered: {
    color: "#00ccff",
    strokeWidth: 1.5,
    opacity: 1,
  },
  highlighted: {
    color: "#ffff00",
    strokeWidth: 1.5,
    opacity: 1,
  },
  selected: {
    color: "#357abd",
    strokeWidth: 1.5,
    opacity: 1,
  },
  hidden: {
    color: "#9ca3af",
    strokeWidth: 0.8,
    opacity: 0.1,
  },
}

/**
 * 依据外部传入的主题调色板生成边样式。
 * 主题切换后 GraphView.refreshTheme() 会重新调用本函数实现换肤。
 */
export function createDefaultLinkStyle(theme: Theme): LinkStyle<any> {
  const p = getPalette(theme).link
  return {
    regular: { color: p.default, strokeWidth: 0.1, opacity: 0.8, arrowSize: 8 },
    hovered: { color: p.hovered, strokeWidth: 1.5, opacity: 1 },
    highlighted: { color: p.highlighted, strokeWidth: 1.5, opacity: 1 },
    selected: { color: p.selected, strokeWidth: 1.5, opacity: 1 },
    hidden: { color: p.hidden, strokeWidth: 0.8, opacity: 0.1 },
  }
}
