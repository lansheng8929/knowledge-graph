/**
 * ExpansionService types — 图数据拓出服务类型定义
 */

import type { NodeId } from "../type"

// ─── 类型定义 ────────────────────────────────────────

export interface ExpansionRule {
  id: string
  name: string
  targetNodeType: string
  relationType: string
  direction: "out" | "in" | "both"
  params?: Record<string, unknown>
  limit?: number
  autoExpand?: boolean
}

export interface ExpansionRequest {
  sourceNodeId: string
  ruleId: string
  pageIndex: number
  pageSize: number
  existingNodeIds: string[]
  existingLinkIds: string[]
}

export interface ExpansionResponse {
  nodes: Array<{ id: string; data?: Record<string, unknown> }>
  links: Array<{
    id: string
    source: string
    target: string
    data?: Record<string, unknown>
  }>
  total: number
  pageIndex: number
  hasMore: boolean
}

export type ExpansionFetcher = (
  request: ExpansionRequest,
) => Promise<ExpansionResponse>

// ─── 事件类型 ────────────────────────────────────────

export interface ExpansionEvents {
  /** 拓出开始 */
  onExpandStart?: (params: { nodeId: NodeId; rule: ExpansionRule }) => void
  /** 拓出成功 */
  onExpandSuccess?: (params: {
    nodeId: NodeId
    rule: ExpansionRule
    response: ExpansionResponse
  }) => void
  /** 拓出失败 */
  onExpandError?: (params: {
    nodeId: NodeId
    rule: ExpansionRule
    error: Error
  }) => void
  /** 拓出完成（无论成功失败） */
  onExpandComplete?: (params: { nodeId: NodeId; rule: ExpansionRule }) => void
}
