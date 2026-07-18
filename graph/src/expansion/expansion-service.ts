/**
 * ExpansionService — 图数据拓出服务
 *
 * 职责：
 * 1. 根据配置的规则，从源节点拓出关联数据
 * 2. 管理拓出过程中的加载状态、分页、历史记录
 * 3. 将新数据合并到现有图数据中（自动去重）
 * 4. 更新节点的元数据（count/total/pagination）
 */

import type { GraphModel } from "../model"
import type { MetadataManager } from "../meta-manager"
import type { LoadingManager } from "../loading-manager"
import type { HistoryManager } from "../history-manager"
import type { GraphNode, GraphLink } from "../client/type"
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

// ─── ExpansionService ────────────────────────────────

export class ExpansionService {
  private model: GraphModel
  private metadataManager: MetadataManager
  private loadingManager: LoadingManager
  private historyManager: HistoryManager
  private fetcher: ExpansionFetcher
  private events: ExpansionEvents = {}

  constructor(deps: {
    model: GraphModel
    metadataManager: MetadataManager
    loadingManager: LoadingManager
    historyManager: HistoryManager
    fetcher: ExpansionFetcher
    events?: ExpansionEvents
  }) {
    this.model = deps.model
    this.metadataManager = deps.metadataManager
    this.loadingManager = deps.loadingManager
    this.historyManager = deps.historyManager
    this.fetcher = deps.fetcher
    this.events = deps.events ?? {}
  }

  /** 更新事件回调 */
  setEvents(events: ExpansionEvents): void {
    this.events = { ...this.events, ...events }
  }

  /**
   * 对指定节点执行拓出
   * @param nodeId  源节点 ID
   * @param ruleId  使用的规则 ID（如果不传，使用第一条规则）
   */
  async expand(nodeId: NodeId, ruleId?: string): Promise<void> {
    // 1. 获取节点的规则元数据
    const meta = this.metadataManager.getMeta({ id: nodeId, type: "node" })
    const rules = (meta?.rules ?? []) as unknown as ExpansionRule[]
    if (rules.length === 0) {
      console.warn(`[ExpansionService] Node ${nodeId} has no expansion rules`)
      return
    }

    const rule = ruleId ? rules.find((r) => r.id === ruleId) : rules[0]
    if (!rule) {
      console.warn(
        `[ExpansionService] Rule "${ruleId}" not found for node ${nodeId}`,
      )
      return
    }

    // 2. 获取分页信息
    const pagination = this.metadataManager.getPagination({
      id: nodeId,
      type: "node",
    })
    const pageIndex = (pagination.pageIndex ?? 0) + 1
    const pageSize = rule.limit ?? 20

    // 3. 设置加载状态
    this.loadingManager.model.startLoading(nodeId, {
      message: `正在拓出 ${rule.name}...`,
    })

    // 4. 触发开始事件
    this.events.onExpandStart?.({ nodeId, rule })

    // 5. 保存历史快照（支持撤销）
    this.historyManager.pushState({
      type: "expand",
      description: `拓出节点 ${nodeId} 的 ${rule.name}`,
      state: { graphData: this.model.getGraphModelData().graphData },
    })

    try {
      // 6. 调用后端 API
      const currentData = this.model.getGraphModelData().graphData
      const response = await this.fetcher({
        sourceNodeId: nodeId,
        ruleId: rule.id,
        pageIndex,
        pageSize,
        existingNodeIds: currentData.nodes.map((n: GraphNode) => n.id),
        existingLinkIds: currentData.links.map((l: GraphLink) => l.id),
      })

      // 7. 触发成功事件
      this.events.onExpandSuccess?.({ nodeId, rule, response })

      // 8. 合并数据到图中
      this.mergeExpansionData(response)

      // 9. 更新节点的分页元数据
      this.metadataManager.updatePagination(
        { id: nodeId, type: "node" },
        {
          pageIndex: response.pageIndex,
          total: response.total,
          count: (pagination.count ?? 0) + response.nodes.length,
        },
      )

      // 10. 为新节点注册规则元数据
      for (const newNode of response.nodes) {
        // 如果后端没有附带 rules，可以在这里查询
        // 如果有 rulesMap 可以在这里注册
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      this.events.onExpandError?.({ nodeId, rule, error })
      console.error(
        `[ExpansionService] Expand failed for node ${nodeId}:`,
        error,
      )
      throw error
    } finally {
      this.loadingManager.model.stopLoading(nodeId)
      this.events.onExpandComplete?.({ nodeId, rule })
    }
  }

  /**
   * 将后端返回的新数据合并到现有图数据中
   * 自动进行节点和边的去重
   */
  private mergeExpansionData(response: ExpansionResponse): void {
    const currentData = this.model.getGraphModelData().graphData
    const existingNodeIds = new Set(
      currentData.nodes.map((n: GraphNode) => n.id),
    )
    const existingLinkIds = new Set(
      currentData.links.map((l: GraphLink) => l.id),
    )

    // 去重新节点
    const newNodes: GraphNode[] = []
    for (const n of response.nodes) {
      if (!existingNodeIds.has(n.id)) {
        newNodes.push({
          id: n.id,
          data: {
            nodeType: "default",
            label: n.id,
            count: 0,
            total: 0,
            ...(n.data ?? {}),
          } as GraphNode["data"],
        })
        existingNodeIds.add(n.id)
      }
    }

    // 去重新边
    const newLinks: GraphLink[] = []
    for (const l of response.links) {
      if (!existingLinkIds.has(l.id)) {
        newLinks.push({
          id: l.id,
          source: l.source,
          target: l.target,
          data: {
            linkType: "default",
            label: undefined,
            ...(l.data ?? {}),
          } as GraphLink["data"],
        })
        existingLinkIds.add(l.id)
      }
    }

    if (newNodes.length === 0 && newLinks.length === 0) {
      console.log("[ExpansionService] No new data to merge")
      return
    }

    console.log(
      `[ExpansionService] Merging ${newNodes.length} nodes and ${newLinks.length} links`,
    )

    // 全量替换图数据（触发 dataChange 事件 → 视图自动刷新）
    this.model.updateGraphData({
      graphData: {
        nodes: [...currentData.nodes, ...newNodes],
        links: [...currentData.links, ...newLinks],
      },
    })
  }

  /**
   * 获取节点的可用规则列表
   */
  getRules(nodeId: NodeId): ExpansionRule[] {
    const meta = this.metadataManager.getMeta({ id: nodeId, type: "node" })
    return (meta?.rules ?? []) as unknown as ExpansionRule[]
  }

  /**
   * 为节点设置规则
   */
  setRules(nodeId: NodeId, rules: ExpansionRule[]): void {
    this.metadataManager.setRules(
      { id: nodeId, type: "node" },
      rules as unknown as Record<string, unknown>[],
    )
  }

  /**
   * 批量设置规则映射
   */
  setRulesMap(rulesMap: Record<string, ExpansionRule[]>): void {
    for (const [nodeId, rules] of Object.entries(rulesMap)) {
      this.setRules(nodeId, rules)
    }
  }

  /**
   * 自动拓出 — 从根节点开始 BFS 拓出
   */
  async autoExpand(
    rootNodeId: NodeId,
    options?: {
      maxDepth?: number
      maxNodes?: number
      /** 只拓出 autoExpand=true 的规则 */
      autoOnly?: boolean
    },
  ): Promise<void> {
    const maxDepth = options?.maxDepth ?? 2
    const maxNodes = options?.maxNodes ?? 200
    const autoOnly = options?.autoOnly ?? true

    const queue: Array<{ nodeId: string; depth: number }> = [
      { nodeId: rootNodeId, depth: 0 },
    ]
    const visited = new Set<string>()
    let totalNodes = 0

    while (queue.length > 0) {
      const { nodeId, depth } = queue.shift()!
      if (visited.has(nodeId) || depth >= maxDepth) continue
      visited.add(nodeId)

      const rules = this.getRules(nodeId).filter(
        (r) => !autoOnly || r.autoExpand,
      )
      if (rules.length === 0) continue

      for (const rule of rules) {
        await this.expand(nodeId, rule.id)
        totalNodes++

        // 获取这次拓出加入的新节点 ID，继续 BFS
        const meta = this.metadataManager.getMeta({ id: nodeId, type: "node" })
        const pagination = this.metadataManager.getPagination({
          id: nodeId,
          type: "node",
        })
        const currentData = this.model.getGraphModelData().graphData

        for (const node of currentData.nodes) {
          if (!visited.has(node.id) && queue.length + visited.size < maxNodes) {
            // 检查该节点是否有规则（可拓出）
            const nodeRules = this.getRules(node.id)
            if (nodeRules.length > 0) {
              queue.push({ nodeId: node.id, depth: depth + 1 })
            }
          }
        }
      }
    }

    console.log(
      `[ExpansionService] Auto-expand complete, visited ${visited.size} nodes`,
    )
  }
}
