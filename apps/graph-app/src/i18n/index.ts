/**
 * i18n 公共入口。
 * - 注册内置语言包（zh-CN 默认 / en-US）
 * - 导出翻译函数 t / tValue 与语言切换 setLocale / getLocale
 * - 保留领域值便捷标签函数（底层走 tValue，未命中回退原 key）
 */
import zhCN from "./locales/zh-CN"
import enUS from "./locales/en-US"
import { registerLocale, setLocale, getLocale, t, tValue } from "./core"

registerLocale("zh-CN", zhCN)
registerLocale("en-US", enUS)

export { setLocale, getLocale, t, tValue }
export { zhCN }
export type { MessageKey, Messages } from "./types"

// ── 领域值便捷标签函数 ──
export const nodeTypeLabel = (key?: string): string => tValue("node.type", key)
export const relationLabel = (key?: string): string =>
  tValue("relation.type", key)
export const propertyLabel = (key?: string): string => tValue("property", key)
