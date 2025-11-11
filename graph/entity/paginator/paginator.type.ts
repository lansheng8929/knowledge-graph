import type { GraphNode } from "../../type"

export type PaginatorNodeType = GraphNode<{
  pageIndex: number
  pageSize: number
  pagedNodeType: string
  rootNodeId: string
  total: number
}>
