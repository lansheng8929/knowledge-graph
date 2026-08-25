import zhCN from "./locales/zh-CN"

/** 字典消息结构（以 zh-CN 为基准） */
export type Messages = typeof zhCN

type Join<K, P> = K extends string | number
  ? P extends string | number
    ? `${K}${"" extends P ? "" : "."}${P}`
    : never
  : never

type NestedKeys<T> = T extends object
  ? { [K in keyof T]-?: Join<K, NestedKeys<T[K]>> }[keyof T]
  : ""

/** 翻译 key 的类型（点路径），编译期可校验 */
export type MessageKey = NestedKeys<Messages>
