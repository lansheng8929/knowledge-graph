import type { GraphNode } from "../../client/type"

export type PaginatorNodeType = GraphNode<{
  pageIndex: number
  pageSize: number
  pagedNodeType: string
  rootNodeId: string
  total: number
}>
