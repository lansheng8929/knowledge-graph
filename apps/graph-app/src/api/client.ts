/**
 * 类型化 API 客户端（T1.3.2）。
 *
 * 类型来源：OpenAPI 生成的 SDK（@lansheng/api-client，见 shared/api-client/），
 * 运行时仍走 fetch + API_BASE（/api/v1，见 config.ts）。
 * 前端其余组件不再直接 fetch，统一经此封装。
 */

import type { components } from "@lansheng/api-client"
import { API_BASE } from "./config"

export type ApiGraphNode = components["schemas"]["GraphNode"]
export type ApiGraphLink = components["schemas"]["GraphLink"]
export type ApiGraphData = components["schemas"]["GraphData"]
export type ApiPageResult = components["schemas"]["PageResult"]
export type ApiSearchData = components["schemas"]["SearchData"]
export type ApiAnalyzeData = components["schemas"]["AnalyzeData"]
export type ApiExpandRequest = components["schemas"]["ExpandRequest"]

// ── 鉴权注入（T2.3.3）：token 由壳层注入，写入请求头 ──
let authToken = ""

/** 设置当前请求携带的 Bearer token（single-spa mount 时由 props.auth 注入）。 */
export function setAuthToken(token: string): void {
  authToken = token
}

/** init 响应 data：后端 query_init 返回 { graphData } 嵌套结构。 */
export interface InitData {
  graphData: ApiGraphData
}

async function request<T>(
  path: string,
  body: unknown,
  signal?: AbortSignal,
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }
  // T2.3.3：鉴权注入通道——由壳层（single-spa props）注入 token，请求自动携带
  if (authToken) headers["Authorization"] = `Bearer ${authToken}`
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
    signal,
  })
  if (!res.ok) {
    const errBody = await res.text()
    throw new Error(`API ${path} failed (${res.status}): ${errBody}`)
  }
  const json = (await res.json()) as { success: boolean; data: T }
  if (!json.success) throw new Error(`API ${path} failed`)
  return json.data
}

export const graphApi = {
  init(ids: string[]): Promise<InitData> {
    return request<InitData>("/graph/init", { ids })
  },
  search(
    query: string,
    limit = 10,
    signal?: AbortSignal,
  ): Promise<ApiSearchData> {
    return request<ApiSearchData>("/graph/search", { query, limit }, signal)
  },
  expand(body: ApiExpandRequest): Promise<ApiPageResult> {
    return request<ApiPageResult>("/graph/expand", body)
  },
  analyze(
    body: Record<string, unknown>,
    signal?: AbortSignal,
  ): Promise<ApiAnalyzeData> {
    return request<ApiAnalyzeData>("/graph/analyze", body, signal)
  },
}
