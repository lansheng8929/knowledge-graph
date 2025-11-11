import type { NodeStyle } from "../../theme"

export const defaultNodeStyle: NodeStyle = {
  regular: {
    bgColor: "#fff",
    strokeColor: "#000",
    textColor: "#000",
    radius: 4,
    strokeWidth: 1.5,
  },
  highlighted: {
    bgColor: "#fff",
    strokeColor: "#000",
    textColor: "#000",
    radius: 4,
    strokeWidth: 1.5,

    light: "#ffff00",
  },
  selected: {
    bgColor: "#fff",
    strokeColor: "#000",
    textColor: "#000",
    radius: 4,
    strokeWidth: 1.5,

    light: "#0066ff",
  },
  hidden: {
    bgColor: "#fff",
    strokeColor: "#000",
    textColor: "#000",
    radius: 4,
    strokeWidth: 1.5,
    opacity: 0.3,
  },
  root: {
    bgColor: "#fff",
    strokeColor: "#000",
    textColor: "#000",
    radius: 4,
    strokeWidth: 1.5,

    light: "#e67e00",
  },
}
