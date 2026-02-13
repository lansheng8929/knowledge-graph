export type NodeState =
  | "regular"
  | "root"
  | "highlighted"
  | "selected"
  | "hidden"
  | "hovered"
export type LinkState =
  | "regular"
  | "highlighted"
  | "selected"
  | "hidden"
  | "hovered"

export type NodeType = "default"
export type LinkType = "default"

/** 节点ID类型 */
export type NodeId = string

/** 边ID类型 */
export type LinkId = string
