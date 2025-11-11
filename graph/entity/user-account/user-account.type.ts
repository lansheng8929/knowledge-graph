import type { GraphNode } from "../../type"

export type UserAccountNodeType = GraphNode<{
  account: string
  accType?: string
  nickName?: string
}>
