import type { GraphNode } from "../../type"

export type Ipv4NodeType = GraphNode<{
  ip?: string
  country?: string
  region?: string
  city?: string
  location?: string
  isp?: string
  isOverseas?: boolean
}>
