import { version } from "../../package.json"
import type { EntityCreator } from "./entity-types"
import * as Entity from "../entity/index.client"
import type { NodeType } from "../type"
import type { DefaultGraphDataGenerics } from "./type"

export const ACCOUNT_NODE_TYPE = "account"

export const DEFAULT_BG_COLOR = "#fff"
export const DEFAULT_LIGHT_RADIUS = 5
export const DEFAULT_TEXT_COLOR = "#2c2c2c"
export const DEFAULT_OPACITY = 0.8
export const DEFAULT_STROKE_WIDTH = 1
export const DEFAULT_STROKE_COLOR = "#ccc"
export const DEFAULT_LINE_WIDTH = 1
export const DEFAULT_FOUCS_LINE_WIDTH = 1
export const ARROW_SIZE = 2
export const MAX_FONT_SIZE = 2
export const DEFAULT_BORDER_WIDTH = 1.5
export const DEFAULT_FOCUS_BORDER_WIDTH = 4
export const DEFAULT_RADIUS = 4
export const DEFAULT_FONT_SIZE = 2
export const DEFAULT_NODE_LABEL_SCALE_THRESHOLD = 4
export const DEFAULT_LINK_LABEL_SCALE_THRESHOLD = 5

/** 当前库版本号，自动从 package.json 读取 */
export const VERSION = version

/**
 * 获取默认的实体创建器映射
 * 这些是内置的节点类型，可以通过 EntityRegistry 进行注册
 */
export const getDefaultEntityCreators = (): Record<
  NodeType,
  EntityCreator<DefaultGraphDataGenerics>
> => ({
  default: Entity.createDefaultEntity,
})
