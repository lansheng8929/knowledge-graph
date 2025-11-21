import type { GraphNode } from "../../client/type"

export type CaseNodeType = GraphNode<{
  caseId: string
  number?: string
  name?: string
  time?: string

  materialId?: string
  materialEvid?: string
  materialEvidType?: string
  materialDocType?: string
  materialDocTypeName?: string

  total?: number
  pageIndex?: number | null
}>
