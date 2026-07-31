/**
 * 语义图标映射 —— 把后端返回的 icon 类型键（"person" 等）映射为图片 URL。
 *
 * 值可以是任意 png / jpg / svg 的 URL：
 * - 本地文件放 vite-test/public/ 下，用根路径引用（如 "/icons/person.svg"）
 * - 或任意 http(s) 外链 / data URI
 */

export const ICON_MAP: Record<string, string> = {
  person: "/icons/person.svg",
  phone: "/icons/phone.svg",
  address: "/icons/address.svg",
  account: "/icons/account.svg",
  company: "/icons/company.svg",
  ip: "/icons/ip.svg",
  device: "/icons/device.svg",
}

/**
 * 为节点数据补齐 icon 字段（把语义键替换为图片 URL）。
 * 兼容两种数据形状：{ graphData: { nodes } } 与 { nodes }。
 * 已存在且是图片 URL 的 icon 保持不变。
 */
export function applyIcons(data: any): any {
  const graph = data?.graphData ?? data
  const nodes = graph?.nodes
  if (!Array.isArray(nodes)) return data

  for (const n of nodes) {
    const key = n?.data?.icon
    if (typeof key === "string" && ICON_MAP[key]) {
      n.data.icon = ICON_MAP[key]
    }
  }
  return data
}
