import type { DefaultGraphDataGenerics } from "../../../client"
import type { LinkStyle } from "../../../theme"

/** 默认边样式（内置于框架） */
export const defaultLinkStyle: LinkStyle<DefaultGraphDataGenerics> = {
  regular: {
    color: "#9ca3af",
    strokeWidth: 1,
    opacity: 0.8,
    arrowSize: 14,
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
