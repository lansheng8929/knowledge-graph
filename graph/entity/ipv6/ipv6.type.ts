import type { GraphNode } from "../../client/type"

export type Ipv6NodeType = GraphNode<{
  ip?: string
  port?: number
  country?: string
  region?: string
  city?: string
  location?: string
  isp?: string
  isOverseas?: boolean
  decimal?: number
}>
