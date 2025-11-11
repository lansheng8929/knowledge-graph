import type { NodeStyle } from "../../theme"

export const phoneNodeStyle: NodeStyle = {
  regular: {
    bgColor: "#2ed573",
    strokeColor: "#26a65b",
    textColor: "#000",
    radius: 4,
    strokeWidth: 1.5,
  },
  highlighted: {
    bgColor: "#2ed573",
    strokeColor: "#0066ff",
    strokeWidth: 3,
    textColor: "#000",
  },
  selected: {
    bgColor: "#ff8c00",
    strokeColor: "#e67e00",
    strokeWidth: 4,
    textColor: "#000",
  },
  hidden: {
    opacity: 0.3,
  },
  root: {
    light: "#e67e00",
  },
}
