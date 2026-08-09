import type { DefaultGraphDataGenerics } from "../../../client"
import type { LinkStyle } from "../../../theme"

/** 默认边样式（内置于框架） */
export const defaultLinkStyle: LinkStyle<DefaultGraphDataGenerics> = {
  regular: {
    color: "#9ca3af",
    // 默认边更细、更淡（配合 line.vert 的最小宽度，缩小视图时线不显粗）
    strokeWidth: 0.6,
    opacity: 0.5,
    arrowSize: 14,
  },
  hovered: {
    color: "#00ccff",
    strokeWidth: 1.2,
    opacity: 1,
  },
  highlighted: {
    color: "#ffff00",
    strokeWidth: 1.2,
    opacity: 1,
  },
  selected: {
    color: "#357abd",
    strokeWidth: 1.2,
    opacity: 1,
  },
  hidden: {
    color: "#9ca3af",
    strokeWidth: 0.6,
    opacity: 0.1,
  },
}
