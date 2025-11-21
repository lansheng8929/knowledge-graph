import type { GraphNode } from "../../client/type"

export type Ipv4NodeType = GraphNode<{
  ip?: string
  country?: string
  region?: string
  city?: string
  location?: string
  isp?: string
  isOverseas?: boolean
}>
