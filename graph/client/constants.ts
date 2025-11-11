import type { EntityConfig, NodeRenderProcessorMap } from "../entity"

import * as Entity from "../entity/index.client"
import { createEntity } from "../entity/common"

export const ACCOUNT_NODE_TYPE = "account"

export const DEFAULT_BG_COLOR = "#fff"
export const DEFAULT_LIGHT_RADIUS = 5
export const DEFAULT_TEXT_COLOR = "#000"
export const DEFAULT_OPACITY = 0.8
export const DEFAULT_STROKE_WIDTH = 1
export const DEFAULT_STROKE_COLOR = "#000"
export const DEFAULT_LINE_WIDTH = 1
export const DEFAULT_FOUCS_LINE_WIDTH = 1
export const ARROW_SIZE = 10
export const MAX_FONT_SIZE = 2
export const DEFAULT_BORDER_WIDTH = 1.5
export const DEFAULT_FOCUS_BORDER_WIDTH = 4
export const DEFAULT_RADIUS = 4
export const DEFAULT_FONT_SIZE = 4
export const DEFAULT_NODE_LABEL_SCALE_THRESHOLD = 4
export const DEFAULT_LINK_LABEL_SCALE_THRESHOLD = 5

// 自带的已设定好的节点（后续可通过外部传入节点定义）
export const nodeRenderProcessorMap = (): NodeRenderProcessorMap => ({
  factor: createEntity(Entity.createFactorEntity),
  case: createEntity(Entity.createCaseEntity),
  server: createEntity(Entity.createServerEntity),
  paginator: createEntity(Entity.createPaginatorEntity),
  relationship: createEntity(Entity.createRelationshipEntity),
  phone: createEntity(Entity.createPhoneEntity),
  id_card: createEntity(Entity.createIdcardEntity),
  bank_card: createEntity(Entity.createBankCardEntity),
  mac: createEntity(Entity.createMacEntity),
  user_case: createEntity(Entity.createUserCaseEntity),
  material: createEntity(Entity.createMaterialEntity),
  orders: createEntity(Entity.createOrdersEntity),
  user_account: createEntity(Entity.createUserAccountEntity),
  ipv4: createEntity(Entity.createIpv4Entity),
  email: createEntity(Entity.createEmailEntity),
  default: createEntity(Entity.createDefaultEntity),
  ipv6: createEntity(Entity.createIpv6Entity),
  company: createEntity(Entity.createCompanyEntity),
})
