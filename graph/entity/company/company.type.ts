import type { GraphNode } from "../../client/type"

export type CompanyNodeType = GraphNode<{
  usccNo?: string
  name?: string
  docType?: string
}>
