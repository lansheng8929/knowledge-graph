import type { LinkObject, NodeObject } from "force-graph"

export type { LinkObject, NodeObject } from "force-graph"

export type NodeState =
  | "regular"
  | "root"
  | "highlighted"
  | "selected"
  | "hidden"
export type LinkState = "regular" | "highlighted" | "selected" | "hidden"

export type NodeType =
  | "default"
  | "relationship"
  | "case"
  | "reason"
  | "factor"
  | "user_account"
  | "user_case"
  | "phone"
  | "id_card"
  | "bank_card"
  | "material"
  | "mac"
  | "orders"
  | "ipv4"
  | "paginator"
  | "server"
  | "email"
  | "ipv6"
  | "company"
export type LinkType =
  | "default"
  | "binding"
  | "access"
  | "owner"
  | "transaction"
  | "friend"

/** 节点ID类型 */
export type NodeId = string

/** 边ID类型 */
export type LinkId = string

/** 全要素图谱边类型 */
export type ConnLinkType = GraphLink<{
  type?: string // 'doc.alipay'
  action?: string // '登录'
  accType?: string // 'alipay'
  reason?: string
  // event_time: {
  //   year: number;
  //   month: number;
  //   day: number;
  //   hour: number;
  //   minute: number;
  //   sec: number;
  //   microsec: number;
  // };
  foryear?: string // '2024'
  formonth?: string // '202403'
  forhour?: string // '2024032610'
  forminute?: string // '202403261042'
  forday?: string // '20240326'
  forsecond?: string // '20240326104215'
}>

/**
 * 程序中使用的图数据模型类型
 */
export interface GraphViewModel {
  graphData: {
    nodes: GraphNode[]
    links: GraphLink[]
  }
  focusNodes?: NodeId[]
  focusLinks?: LinkId[]
  selectedNodes?: NodeId[]
  selectedLinks?: LinkId[]
  hiddenNodes?: NodeId[]
  hiddenLinks?: LinkId[]
}

/**
 * 动态图数据模型类型
 */
export type ModelNode<T = object> = NodeObject & GraphNode<T>
export type ModelLink<T = object> = LinkObject &
  Omit<GraphLink<T>, "source" | "target">
export interface ModelGraphData {
  nodes: ModelNode[]
  links: ModelLink[]
}

/**
 * 程序中的节点数据统一类型
 */
export interface GraphNode<D = object> {
  id: NodeId
  x?: number
  y?: number
  vx?: number
  vy?: number
  fx?: number
  fy?: number
  data?: GraphNodeInfo<D>
}

/**
 * 节点附加信息类型
 */
export type GraphNodeInfo<D = object> = {
  nodeType?: NodeType
  stateType?: NodeState
  label?: string
  loading?: boolean
  count?: number
  pageSize?: number
  pageIndex?: number
} & D

/**
 * 程序中的边数据统一类型
 */
export interface GraphLink<D = object> {
  id: LinkId
  source: LinkId | NonNullable<LinkObject["source"]>
  target: LinkId | NonNullable<LinkObject["target"]>
  ranking?: number
  data?: GraphLinkInfo<D>
}

/**
 * 边附加信息类型
 */
export type GraphLinkInfo<D = object> = {
  label?: string
  linkType?: LinkType
  stateType?: LinkState
  color?: string
  lineWidth?: number
} & D

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
