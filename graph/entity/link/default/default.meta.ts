import type { LinkType } from "../../../type"

/** 默认边元数据 */
export const defaultLinkMeta = {
  key: "default" as LinkType,
  description: "默认连线",
  properties: {},
} as const

export type DefaultLinkMeta = typeof defaultLinkMeta
