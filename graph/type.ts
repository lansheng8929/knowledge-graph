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
