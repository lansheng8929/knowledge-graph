import type {
  NodeType,
  NodeState,
  LinkId,
  LinkType,
  LinkState,
  NodeId,
} from "../type"

/**
 * 统一的图数据泛型参数
 */
export interface GraphDataGenerics {
  NO: object
  NT: string
  NS: string
  LO: object
  LT: string
  LS: string

  M: object
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

  M: {}
}

/**
 * 程序中的边数据统一类型
 */
export interface GraphLink<
  G extends GraphDataGenerics = DefaultGraphDataGenerics,
> {
  id: LinkId
  source: LinkId | GraphNode<G["NO"], G["NT"], G["NS"]>
  target: LinkId | GraphNode<G["NO"], G["NT"], G["NS"]>
  ranking?: number
  data?: GraphLinkInfo<G["LO"], G["LT"], G["LS"]>
  __rawLabel?: string
}

export interface GraphViewModelGraphData<
  G extends GraphDataGenerics = DefaultGraphDataGenerics,
> {
  graphData: {
    nodes: GraphNode<G["NO"], G["NT"], G["NS"]>[]
    links: GraphLink<G>[]
  }
}

/**
 * 程序中使用的图数据模型类型
 */
export type GraphViewModel<
  G extends GraphDataGenerics = DefaultGraphDataGenerics,
> = GraphViewModelGraphData<G>

/**
 * 状态配置接口
 */
export interface StateConfig {
  focusNodes?: NodeId[]
  focusLinks?: LinkId[]
  selectedNodes?: NodeId[]
  selectedLinks?: LinkId[]
  hiddenNodes?: NodeId[]
  hiddenLinks?: LinkId[]
  rootNodes?: NodeId[]
  hoveredNodes?: NodeId[]
  hoveredLinks?: LinkId[]
  [key: string]: NodeId[] | undefined
}

/**
 * 程序中的节点数据统一类型
 */
export interface GraphNode<
  D extends object = object,
  T extends string = NodeType,
  S extends string = NodeState,
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
  D extends object = object,
  T extends string = NodeType,
  S extends string = NodeState,
> = {
  nodeType?: T
  stateType?: S
  label?: string
  pageIndex?: number
  count?: number
  total?: number
} & D

/**
 * 边附加信息类型
 */
export type GraphLinkInfo<
  D = object,
  T extends string = LinkType,
  S extends string = LinkState,
> = {
  label?: string
  linkType?: T
  stateType?: S
  color?: string
  lineWidth?: number
  /** 箭头方向。target-指向目标节点(默认), source-指向源节点, both-两端都有箭头 */
  direction?: "source" | "target" | "both"
} & D
