import type { GraphNode } from "../../client/type"

export type UserCaseNodeType = GraphNode<{
  caseId?: string
  caseNumber?: string
  caseName?: string
}>
