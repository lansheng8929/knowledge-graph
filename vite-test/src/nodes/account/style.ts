import { themed, createTypedStyle } from "../default/style"
import type { Theme } from "../../theme"

export const accountStyle = themed("#8e44ad", "#6c3483")

export function createAccountStyle(node: any, theme: Theme) {
  return createTypedStyle("account", node, theme)
}
