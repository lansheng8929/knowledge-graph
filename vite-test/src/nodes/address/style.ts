import { themed, createTypedStyle } from "../default/style"
import type { Theme } from "../../theme"

export const addressStyle = themed("#e67e22", "#ba5c12")

export function createAddressStyle(node: any, theme: Theme) {
  return createTypedStyle("address", node, theme)
}
