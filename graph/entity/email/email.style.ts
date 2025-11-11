import type { NodeStyle } from "../../theme"

export const EmailNodeStyle: NodeStyle = {
  regular: {
    bgColor: "#3742fa",
    strokeColor: "#2f3542",
    textColor: "#fff",
    radius: 4,
    strokeWidth: 1.5,
  },
  highlighted: {
    bgColor: "#3742fa",
    strokeColor: "#0066ff",
    strokeWidth: 3,
    textColor: "#fff",
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
