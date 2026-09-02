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

/** 流式分块（NDJSON 行）：meta/node/link/done。 */
export interface StreamChunk {
  type: "meta" | "node" | "link" | "done"
  data?: Record<string, unknown>
  total?: number
  summary?: { nodeCount: number; linkCount: number; total?: number }
}

/**
 * 流式 NDJSON 请求：ReadableStream 逐行解析，每行回调 onChunk。
 * 用于 init/expand 边查边发、前端边收边增量渲染。
 */
async function streamRequest(
  path: string,
  body: unknown,
  onChunk: (chunk: StreamChunk) => void,
  signal?: AbortSignal,
): Promise<void> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }
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
  const reader = res.body!.getReader()
  const decoder = new TextDecoder()
  let buf = ""
  let linesSinceYield = 0
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    buf += decoder.decode(value, { stream: true })
    let nl: number
    while ((nl = buf.indexOf("\n")) >= 0) {
      const line = buf.slice(0, nl).trim()
      buf = buf.slice(nl + 1)
      if (!line) continue
      try {
        onChunk(JSON.parse(line) as StreamChunk)
      } catch {
        /* 跳过坏行 */
      }
      // 周期性让出事件循环（宏任务）：同步逐行解析会阻塞 d3 物理模拟的 timer，
      // 导致流式期间节点静止堆中心；让出后物理引擎每批行都能推进几帧，节点边收边被推动散开。
      if (++linesSinceYield >= 100) {
        linesSinceYield = 0
        await new Promise((r) => setTimeout(r))
      }
    }
  }
}

export const graphApi = {
  init(ids: string[]): Promise<InitData> {
    return request<InitData>("/graph/init", { ids })
  },
  /** 流式 init：边查边发，onChunk 收到 meta/node/link/done */
  initStream(
    ids: string[],
    onChunk: (c: StreamChunk) => void,
    signal?: AbortSignal,
  ): Promise<void> {
    return streamRequest("/graph/init/stream", { ids }, onChunk, signal)
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
  /** 流式 expand：先 meta(total) 后逐条 node/link，最后 done */
  expandStream(
    body: ApiExpandRequest,
    onChunk: (c: StreamChunk) => void,
    signal?: AbortSignal,
  ): Promise<void> {
    return streamRequest("/graph/expand/stream", body, onChunk, signal)
  },
  analyze(
    body: Record<string, unknown>,
    signal?: AbortSignal,
  ): Promise<ApiAnalyzeData> {
    return request<ApiAnalyzeData>("/graph/analyze", body, signal)
  },
}

/** 按导入任务 id 查询其导入的实体 id 列表（任务详情跳图谱定位用）。
 *  走 file-import-service（经 shell/网关代理），避免 URL 携带数千 ids。 */
export async function fetchTaskEntityIds(taskId: string): Promise<string[]> {
  const res = await fetch(
    `${API_BASE}/import/tasks/${encodeURIComponent(taskId)}`,
  )
  const body = await res.json().catch(() => null)
  if (!res.ok) {
    throw new Error(
      (body as { detail?: string } | null)?.detail || `HTTP ${res.status}`,
    )
  }
  const data = (body as { data?: { entity_ids?: string[] } } | null)?.data
  return Array.isArray(data?.entity_ids) ? data.entity_ids : []
}
