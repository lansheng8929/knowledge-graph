import type { GraphNode } from "../../type"

export type RealationshipNodeType = GraphNode<{
  name: string
  type: string // 目标节点类型
  count?: number
  pageSize?: number
  pageIndex?: number
  rootNodeType?: string // 源节点类型
  rootNodeId?: string
}>
