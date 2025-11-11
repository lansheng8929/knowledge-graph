import type { NodeStyle } from "../../theme"

export const factorNodeStyle: NodeStyle = {
  regular: {
    bgColor: "#999",
    strokeColor: "#000",
    textColor: "#000",
    radius: 4,
    strokeWidth: 1.5,
  },
  highlighted: {
    bgColor: "#999",
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
