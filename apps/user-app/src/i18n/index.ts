/**
 * i18n 公共入口。
 * - 注册内置语言包（zh-CN 默认 / en-US）
 * - 导出翻译函数 t / tValue 与语言切换 setLocale / getLocale
 * - 保留领域值便捷标签函数（密级）
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
export const clearanceText = (key?: number): string =>
  tValue("clearance", key !== undefined ? String(key) : undefined)
