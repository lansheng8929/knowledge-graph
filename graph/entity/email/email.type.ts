import type { GraphNode } from "../../client/type"

export type EmailNodeType = GraphNode<{
  email?: string
  count?: number
}>
