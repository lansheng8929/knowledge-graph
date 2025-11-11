import type { GraphNode, LabelCaseArrayItem } from "../../type"

export type FactorNodeType = GraphNode<{
  connId?: string
  caseId?: string

  valueType?: string
  valueTypeName?: string

  label?: string
  reason?: string
  value?: string
  time?: string
  levelSub?: string
  location?: string

  materialId?: string
  docType?: string
  evid?: string
  evidType?: string

  caseArray?: LabelCaseArrayItem[]
  accArray?: {
    acc: string
    accType: string
  }[]

  total?: number
  pageIndex?: number | null
}>
