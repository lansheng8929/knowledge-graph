import type { DefaultGraphDataGenerics } from "../../client"
import type { NodeStyle } from "../../theme"

export const defaultNodeStyle: NodeStyle<DefaultGraphDataGenerics> = {
  regular: {
    bgColor: "#fff",
    strokeColor: "#ccc",
    textColor: "#2c2c2c",
    radius: 4,
    strokeWidth: 1.5,
    opacity: 0.9,
  },
  hovered: {
    bgColor: "#fff",
    strokeColor: "#00ccff",
    textColor: "#2c2c2c",
    radius: 4,
    strokeWidth: 2,
    opacity: 1,
    light: "#00ccff",
  },
  highlighted: {
    bgColor: "#fff",
    strokeColor: "#0066ff",
    textColor: "#2c2c2c",
    radius: 4,
    strokeWidth: 2,
    opacity: 1,
    light: "#ffff00",
  },
  selected: {
    bgColor: "#fff",
    strokeColor: "#357abd",
    textColor: "#2c2c2c",
    radius: 4,
    strokeWidth: 3,
    opacity: 1,
    light: "#357abd",
  },
  hidden: {
    bgColor: "#fff",
    strokeColor: "#ccc",
    textColor: "#2c2c2c",
    radius: 4,
    strokeWidth: 1.5,
    opacity: 0.15,
  },
  root: {
    bgColor: "#fff",
    strokeColor: "#e67e00",
    textColor: "#2c2c2c",
    radius: 6,
    strokeWidth: 2,
    opacity: 1,
    light: "#e67e00",
  },
}
