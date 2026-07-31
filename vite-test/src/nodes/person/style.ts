import { themed, createTypedStyle } from "../default/style"
import type { Theme } from "../../theme"

export const personStyle = themed("#357abd", "#2a6090")

/** 动态创建 person 样式，根据节点数据与外部传入的主题调整 */
export function createPersonStyle(node: any, theme: Theme) {
  return createTypedStyle("person", node, theme)
}
