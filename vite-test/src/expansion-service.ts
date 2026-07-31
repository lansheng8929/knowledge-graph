/**
 * ExpansionService — 图数据拓出服务
 */

import type { GraphModel } from "@lansheng/knowledge-graph"
import type { MetadataManager } from "@lansheng/knowledge-graph/meta-manager"
import type { LoadingManager } from "@lansheng/knowledge-graph/loading-manager"
import type { HistoryManager } from "@lansheng/knowledge-graph/history-manager"
import type {
  GraphNode,
  GraphLink,
} from "@lansheng/knowledge-graph/client/type"

export interface ExpansionRequest {
  sourceNodeId: string
  ruleId: string
  existingNodeIds: string[]
  existingLinkIds: string[]
  conditions: string
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
}

export type ExpansionFetcher = (
  request: ExpansionRequest,
) => Promise<ExpansionResponse>

export interface ExpansionServiceContext {
  /** 当前相机视角 */
  camera?: { x: number; y: number; k: number }
  /** 额外状态（焦点/选中等） */
  state?: Record<string, any>
}

export class ExpansionService {
  private model: GraphModel
  private metadataManager: MetadataManager
  private loadingManager: LoadingManager
  private historyManager: HistoryManager
  private fetcher: ExpansionFetcher
  /** 可选：获取快照额外上下文（相机、状态等） */
  private getContext?: () => ExpansionServiceContext

  constructor(deps: {
    model: GraphModel
    metadataManager: MetadataManager
    loadingManager: LoadingManager
    historyManager: HistoryManager
    fetcher: ExpansionFetcher
    getContext?: () => ExpansionServiceContext
  }) {
    this.model = deps.model
    this.metadataManager = deps.metadataManager
    this.loadingManager = deps.loadingManager
    this.historyManager = deps.historyManager
    this.fetcher = deps.fetcher
    this.getContext = deps.getContext
  }

  async expand(nodeId: string, conditions: string): Promise<void> {
    this.loadingManager.model.startLoading(nodeId, { message: "拓出中..." })

    try {
      const currentData = this.model.getGraphModelData().graphData
      const response = await this.fetcher({
        sourceNodeId: nodeId,
        ruleId: "__custom__",
        existingNodeIds: currentData.nodes.map((n: GraphNode) => n.id),
        existingLinkIds: currentData.links.map((l: GraphLink) => l.id),
        conditions,
      })
      this.mergeExpansionData(response)

      // 拓出成功后才记录历史
      const afterData = this.model.getGraphModelData().graphData
      const context = this.getContext?.() ?? {}
      this.historyManager.pushState({
        type: "expand",
        description: `拓出节点 ${nodeId}`,
        state: {
          graphData: afterData,
          customData: {
            camera: context.camera,
            state: context.state,
          },
        },
      })
    } catch (err) {
      console.error(`[Expand] Failed for node ${nodeId}:`, err)
      throw err
    } finally {
      this.loadingManager.model.stopLoading(nodeId)
    }
  }

  private mergeExpansionData(response: ExpansionResponse): void {
    const currentData = this.model.getGraphModelData().graphData
    const existNodeIds = new Set(currentData.nodes.map((n: GraphNode) => n.id))
    const existLinkIds = new Set(currentData.links.map((l: GraphLink) => l.id))
    const newNodes: GraphNode[] = []
    for (const n of response.nodes) {
      if (!existNodeIds.has(n.id)) {
        newNodes.push({
          id: n.id,
          data: { ...(n.data ?? {}) } as GraphNode["data"],
        })
        existNodeIds.add(n.id)
      }
    }
    const newLinks: GraphLink[] = []
    for (const l of response.links) {
      if (!existLinkIds.has(l.id)) {
        newLinks.push({
          id: l.id,
          source: l.source,
          target: l.target,
          data: { ...(l.data ?? {}) } as GraphLink["data"],
        })
        existLinkIds.add(l.id)
      }
    }
    if (!newNodes.length && !newLinks.length) return
    this.model.updateGraphData({
      graphData: {
        nodes: [...currentData.nodes, ...newNodes],
        links: [...currentData.links, ...newLinks],
      },
    })
  }
}
