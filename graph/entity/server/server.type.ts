import type { GraphNode } from "../../type"

export type ServerNodeType = GraphNode<{
  ip?: string
  account?: string
  docType?: string
}>
