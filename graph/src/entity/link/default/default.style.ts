import type { DefaultGraphDataGenerics } from "../../../client"
import type { LinkStyle } from "../../../theme"

/** 默认边样式（内置于框架） */
export const defaultLinkStyle: LinkStyle<DefaultGraphDataGenerics> = {
  regular: {
    color: "#9ca3af",
    strokeWidth: 0.1,
    opacity: 0.8,
  },
  hovered: {
    color: "#00ccff",
    strokeWidth: 1.5,
    opacity: 1,
    light: "#00ccff",
  },
  highlighted: {
    color: "#ffff00",
    strokeWidth: 1.5,
    opacity: 1,
    light: "#ffff00",
  },
  selected: {
    color: "#357abd",
    strokeWidth: 1.5,
    opacity: 1,
    light: "#357abd",
  },
  hidden: {
    color: "#9ca3af",
    strokeWidth: 0.8,
    opacity: 0.1,
  },
}
