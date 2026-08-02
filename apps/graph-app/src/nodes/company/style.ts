import { themed, createTypedStyle } from "../default/style"
import type { Theme } from "../../theme"

export const companyStyle = themed("#16a085", "#0e7c63")

export function createCompanyStyle(node: any, theme: Theme) {
  return createTypedStyle("company", node, theme)
}
