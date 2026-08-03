import type { GraphDataGenerics } from "@lansheng/knowledge-graph/client/type"
import type { GraphView } from "@lansheng/knowledge-graph"
import type { defaultNodeStyle } from "./nodes/default/style"
import type { personStyle } from "./nodes/person/style"
import type { phoneStyle } from "./nodes/phone/style"
import type { addressStyle } from "./nodes/address/style"
import type { accountStyle } from "./nodes/account/style"
import type { companyStyle } from "./nodes/company/style"
import type { ipStyle } from "./nodes/ip/style"
import type { deviceStyle } from "./nodes/device/style"

/**
 * 应用层专属的图数据泛型参数。
 * 声明所有已知的节点/边类型，使 theme 配置获得类型提示。
 */
/** 应用层 GraphView 类型 */
export type MyGraphView = GraphView<AppGraphDataGenerics>

export interface AppGraphDataGenerics extends GraphDataGenerics {
  NT: string
  NS: "regular" | "root" | "highlighted" | "selected" | "hidden" | "hovered"
  // 关系类型来自后端（Neo4j 关系类型，如 USE_DEVICE / CALLED），运行时为任意字符串
  LT: string
  LS: "regular" | "highlighted" | "selected" | "hidden" | "hovered"
}
