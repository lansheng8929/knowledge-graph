import type { GraphNode } from "../../client/type"

export type UserAccountNodeType = GraphNode<{
  account: string
  accType?: string
  nickName?: string
}>
