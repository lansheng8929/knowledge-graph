import type { DefaultGraphDataGenerics } from "../../client"
import type { NodeStyle, Style } from "../../theme"

function themed(
  bg: string,
  stroke: string,
): NodeStyle<DefaultGraphDataGenerics> {
  return {
    regular: {
      bgColor: bg,
      strokeColor: stroke,
      textColor: "#2c2c2c",
      radius: 8,
      strokeWidth: 1,
      opacity: 1,
      fontSize: 16,
    },
    hovered: {
      bgColor: bg,
      strokeColor: "#00ccff",
      textColor: "#2c2c2c",
      radius: 8,
      strokeWidth: 2,
      opacity: 1,
      fontSize: 16,
    },
    highlighted: {
      bgColor: bg,
      strokeColor: "#fde047",
      textColor: "#2c2c2c",
      radius: 8,
      strokeWidth: 2,
      opacity: 1,
      fontSize: 16,
    },
    selected: {
      bgColor: bg,
      strokeColor: "#0066ff",
      textColor: "#2c2c2c",
      radius: 8,
      strokeWidth: 2,
      opacity: 1,
      fontSize: 16,
    },
    hidden: {
      bgColor: "#fff",
      strokeColor: stroke,
      textColor: "#2c2c2c",
      radius: 8,
      strokeWidth: 1.5,
      opacity: 0.15,
      fontSize: 16,
    },
    root: {
      bgColor: "#fff",
      strokeColor: "#e67e00",
      textColor: "#2c2c2c",
      radius: 6,
      strokeWidth: 2,
      opacity: 1,
      fontSize: 16,
    },
  }
}

export const defaultNodeStyle = themed("#357abd", "#ccc")
export const personStyle = themed("#357abd", "#2a6090")
export const phoneStyle = themed("#27ae60", "#1e8449")
export const addressStyle = themed("#e67e22", "#ba5c12")
export const accountStyle = themed("#8e44ad", "#6c3483")
export const companyStyle = themed("#16a085", "#0e7c63")
export const ipStyle = themed("#7f8c8d", "#596364")
export const deviceStyle = themed("#2c3e50", "#1a252f")
