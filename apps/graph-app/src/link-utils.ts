import type { GraphLink } from "@lansheng/knowledge-graph/client/type"

/**
 * 归一化边的端点 id：source/target 可能是 string 或节点对象（含 id）。
 * 统一返回字符串 id 对，避免各调用点重复写 typeof 判断。
 */
export function linkEndpoints(
  link: Pick<GraphLink, "source" | "target">,
): [string, string] {
  const endpointId = (e: string | { id: string }): string =>
    typeof e === "object" && e !== null ? String(e.id) : String(e)
  return [endpointId(link.source), endpointId(link.target)]
}
