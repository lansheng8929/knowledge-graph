import type { GraphNode } from "../../client/type"

/**
 * 标签节点中的案件数组类型
 */
export interface LabelCaseArrayItem {
  id: string
  number: string
  name: string
  time: string

  materialId?: string
  materialEvid?: string
  materialEvidType?: string
  materialDocType?: string
  materialDocTypeName?: string

  acc?: string
  accType?: string

  timeDiff?: number
  timeDiffUnit?: string
}

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
