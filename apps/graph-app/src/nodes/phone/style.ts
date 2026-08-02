import { themed, createTypedStyle } from "../default/style"
import type { Theme } from "../../theme"

export const phoneStyle = themed("#27ae60", "#1e8449")

export function createPhoneStyle(node: any, theme: Theme) {
  return createTypedStyle("phone", node, theme)
}
