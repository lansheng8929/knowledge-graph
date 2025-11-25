export type NodeState =
  | "regular"
  | "root"
  | "highlighted"
  | "selected"
  | "hidden"
export type LinkState = "regular" | "highlighted" | "selected" | "hidden"

export type NodeType = "default"
export type LinkType = "default"

/** 节点ID类型 */
export type NodeId = string

/** 边ID类型 */
export type LinkId = string
