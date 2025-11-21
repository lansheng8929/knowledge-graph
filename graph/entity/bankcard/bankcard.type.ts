import type { GraphNode } from "../../client/type"

export type BankCardNodeType = GraphNode<{
  bankCard?: string
  bankName?: string
  name?: string
}>
