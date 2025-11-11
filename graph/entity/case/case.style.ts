import type { NodeStyle } from "../../theme"

export const caseNodeStyle: NodeStyle = {
  regular: {
    bgColor: "#f94144",
    strokeColor: "#000",
    textColor: "#000",
    radius: 4,
    strokeWidth: 3,
  },
  highlighted: {
    bgColor: "#f94144",
    strokeColor: "#0066ff",
    strokeWidth: 4,
    textColor: "#000",
  },
  selected: {
    bgColor: "#ff8c00",
    strokeColor: "#e67e00",
    strokeWidth: 5,
    textColor: "#000",
  },
  hidden: {
    opacity: 0.3,
  },
  root: {
    light: "#e67e00",
  },
}
