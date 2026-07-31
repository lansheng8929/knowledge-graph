import { themed, createTypedStyle } from "../default/style"
import type { Theme } from "../../theme"

export const ipStyle = themed("#7f8c8d", "#596364")

export function createIpStyle(node: any, theme: Theme) {
  return createTypedStyle("ip", node, theme)
}
