import type { MessageKey, Messages } from "./types"

type LocaleName = string

/** 已注册语言包：名称 → 字典 */
const dictionaries = new Map<LocaleName, Messages>()

let currentLocale: LocaleName = "zh-CN"

/** 注册语言包（字典结构需与 Messages 一致） */
export function registerLocale(name: LocaleName, messages: Messages): void {
  dictionaries.set(name, messages)
}

/** 切换当前语言 */
export function setLocale(name: LocaleName): void {
  if (!dictionaries.has(name)) {
    throw new Error(`[i18n] locale "${name}" not registered`)
  }
  currentLocale = name
}

/** 获取当前语言 */
export function getLocale(): LocaleName {
  return currentLocale
}

/** 沿点路径读取字典值 */
function resolvePath(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc == null || typeof acc !== "object") return undefined
    return (acc as Record<string, unknown>)[key]
  }, obj)
}

/** 插值：{name} 占位符替换为 params 中的值 */
function interpolate(
  template: string,
  params?: Record<string, string | number>,
): string {
  if (!params) return template
  return template.replace(/\{(\w+)\}/g, (_, k: string) =>
    params[k] !== undefined ? String(params[k]) : `{${k}}`,
  )
}

/**
 * 翻译函数：按点路径取当前语言的文案。
 * 未命中回退 key 本身；支持 {param} 插值。
 */
export function t(
  key: MessageKey | string,
  params?: Record<string, string | number>,
): string {
  const raw = resolvePath(dictionaries.get(currentLocale), key)
  return interpolate(typeof raw === "string" ? raw : key, params)
}

/**
 * 动态领域值翻译：`namespace` 下的 `key`（运行期值，不做静态类型校验）。
 * 例如 tValue("import.status", status) → t("import.status.running")。
 */
export function tValue(
  namespace: string,
  key?: string,
  params?: Record<string, string | number>,
): string {
  if (!key) return ""
  return t(`${namespace}.${key}`, params)
}
