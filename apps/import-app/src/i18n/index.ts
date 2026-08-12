/**
 * i18n 公共入口。
 * - 注册内置语言包（zh-CN 默认 / en-US）
 * - 导出翻译函数 t / tValue 与语言切换 setLocale / getLocale
 * - 保留领域值便捷标签函数与 App 需要的原始 map（可见性 / 密级选项）
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
export const statusText = (key?: string): string => tValue("import.status", key)
export const stageText = (key?: string): string => tValue("import.stage", key)
export const visibilityLabel = (key?: string): string =>
  tValue("visibility", key)

// App 仍需要原始 map：可见性 key 列表 / 密级下拉选项
export const VISIBILITY_LABELS: Record<string, string> = { ...zhCN.visibility }
export const CLASSIFICATION_OPTIONS: { value: number; label: string }[] =
  Object.entries(zhCN.classification).map(([value, label]) => ({
    value: Number(value),
    label,
  }))
