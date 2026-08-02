import { themed, createTypedStyle } from "../default/style"
import type { Theme } from "../../theme"

export const deviceStyle = themed("#2c3e50", "#1a252f")

export function createDeviceStyle(node: any, theme: Theme) {
  return createTypedStyle("device", node, theme)
}
