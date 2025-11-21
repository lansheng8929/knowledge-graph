import type { GraphNode } from "../../client/type"

export type IdCardNodeType = GraphNode<{
  idCard?: string
  name?: string
  homeAddress?: string
}>
