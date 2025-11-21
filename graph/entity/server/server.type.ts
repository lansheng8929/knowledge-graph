import type { GraphNode } from "../../client/type"

export type ServerNodeType = GraphNode<{
  ip?: string
  account?: string
  docType?: string
}>
