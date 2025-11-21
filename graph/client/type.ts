import type { LinkObject } from "force-graph"
import type {
  NodeType,
  NodeState,
  LinkId,
  LinkType,
  LinkState,
  NodeId,
} from "../type"

export type { LinkObject, NodeObject } from "force-graph"

/**
 * 统一的图数据泛型参数
 */
export interface GraphDataGenerics {
  NO?: object
  NT: string
  NS: string
  LO?: object
  LT: string
  LS: string
}

/**
 * 默认的图数据泛型参数
 */
export type DefaultGraphDataGenerics = {
  NO: {}
  NT: NodeType
  NS: NodeState
  LO: {}
  LT: LinkType
  LS: LinkState
}

/**
 * 程序中的边数据统一类型
 */
export interface GraphLink<
  D = object,
  T extends string = LinkType,
  S extends string = LinkState
> {
  id: LinkId
  source: LinkId | NonNullable<LinkObject["source"]>
  target: LinkId | NonNullable<LinkObject["target"]>
  ranking?: number
  data?: GraphLinkInfo<D, T, S>
}

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

export interface GraphViewModelGraphData<
  G extends GraphDataGenerics = DefaultGraphDataGenerics
> {
  graphData: {
    nodes: GraphNode<G["NO"], G["NT"], G["NS"]>[]
    links: GraphLink<G["LO"], G["LT"], G["LS"]>[]
  }
}

/**
 * 程序中使用的图数据模型类型
 */
export type GraphViewModel<
  G extends GraphDataGenerics = DefaultGraphDataGenerics
> = GraphViewModelGraphData<G> & GraphViewModelMetaData

/**
 * 程序中的节点数据统一类型
 */
export interface GraphNode<
  D = object,
  T extends string = NodeType,
  S extends string = NodeState
> {
  id: NodeId
  x?: number
  y?: number
  vx?: number
  vy?: number
  fx?: number
  fy?: number
  data?: GraphNodeInfo<D, T, S>
  __toolIndexColor?: string
  __indexColor?: string
}

/**
 * 节点附加信息类型
 */
export type GraphNodeInfo<
  D = object,
  T extends string = NodeType,
  S extends string = NodeState
> = {
  nodeType?: T
  stateType?: S
  label?: string
  count?: number
  pageSize?: number
  pageIndex?: number
} & D

/**
 * 边附加信息类型
 */
export type GraphLinkInfo<
  D = object,
  T extends string = LinkType,
  S extends string = LinkState
> = {
  label?: string
  linkType?: T
  stateType?: S
  color?: string
  lineWidth?: number
} & D

export interface GraphViewModelMetaData {
  focusNodes?: NodeId[]
  focusLinks?: LinkId[]
  selectedNodes?: NodeId[]
  selectedLinks?: LinkId[]
  hiddenNodes?: NodeId[]
  hiddenLinks?: LinkId[]
}
