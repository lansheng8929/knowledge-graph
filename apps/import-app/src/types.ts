/** import-app 类型定义（与 file-import-service 契约对齐）。 */

export interface TagConfig {
  tenantId: string
  classification: number
  owner: string
  visibility: string
}

export interface ImportConfig {
  tags: TagConfig
  edge?: {
    businessKey?: Array<{ col: string }>
    insertMode?: "update" | "insert"
  }
  sheetMapping?: { entities?: string; edges?: string }
  nodeTypeDefault?: string
  nodeTypes?: string[]
  strictNodeTypes?: boolean
  dangling?: "skip" | "auto-create"
  danglingNodeType?: string
  /** 用户勾选排除的实体 id（未选中不写库；边自动跟随端点） */
  excludeEntityIds?: string[]
}

export interface ParsedEntity {
  id: string
  nodeType: string
  label: string
  icon: string
  props: Record<string, unknown>
}

export interface ParsedEdge {
  id: string
  source: string
  target: string
  linkType: string
  label: string
  time: string
  rank?: number
  props: Record<string, unknown>
}

export interface PreviewData {
  entityCount: number
  edgeCount: number
  skipped: number
  /** 筛选后实体总数（后端分页） */
  entityTotal: number
  /** 筛选后边总数（后端分页） */
  edgeTotal: number
  page: number
  pageSize: number
  /** 实体页（当前页） */
  entities: ParsedEntity[]
  /** 边页（当前页） */
  edges: ParsedEdge[]
  errors: string[]
  warnings: string[]
  /** 图谱全量（includeGraph=true 时返回，供图谱渲染与选择联动） */
  graph?: { entities: ParsedEntity[]; edges: ParsedEdge[] }
  /** 筛选后实体 id 全集（includeIds=true 时返回，供「全选已筛」） */
  entityIds?: string[]
}

/** preview 接口的查询参数（表格后端分页 + 筛选） */
export interface PreviewQuery {
  page?: number
  pageSize?: number
  entQ?: string
  entType?: string
  entOnlySel?: boolean
  edgeQ?: string
  edgeType?: string
  edgeStatus?: "all" | "in" | "out"
  /** 未选中的实体 id（供 仅已选 / 已排除 服务端过滤） */
  excludedIds?: string[]
  includeGraph?: boolean
  includeIds?: boolean
  /** 类型驱动筛选：条件 DSL JSON（{ and: [{attr,op,value}...] }） */
  entityConditions?: string
  edgeConditions?: string
}

export interface ImportTask {
  id: string
  filename: string
  status: "pending" | "queued" | "running" | "success" | "failed"
  stage: string
  imported: number
  skipped: number
  error_count: number
  warnings: string[]
  errors: string[]
  created_at: string
  finished_at: string
  /** 该任务实际导入的实体 id（跳转图谱定位展示用） */
  entity_ids: string[]
  /** 创建人用户名 */
  owner: string
  /** 创建人 uid */
  owner_uid: string
}

export type View = "import" | "report"

/** /api/v1/import/templates：解析模板（内置种子）。 */
export interface ImportTemplate {
  id: string
  name: string
  description: string
  format: string
  default?: boolean
  /** 客户端合并进 ImportConfig 的结构默认（dangling/businessKey/...） */
  config?: {
    dangling?: "skip" | "auto-create"
    danglingNodeType?: string
    nodeTypeDefault?: string
    strictNodeTypes?: boolean
    edge?: { businessKey?: Array<{ col: string }> }
    sheetMapping?: { entities?: string; edges?: string }
  }
}

/** /api/v1/import/options：按当前登录用户权限返回的可配置项。 */
export interface ImportOptions {
  user: {
    username: string
    uid: string
    tenantId: string
    clearance: number
    roles: string[]
    teams: string[]
    orgPath: string
  }
  defaults: {
    tenantId: string
    owner: string
    classification: number
    visibility: string
  }
  constraints: {
    classificationMax: number
    visibilityAllowed: string[]
    nodeTypes: string[]
    canSetTenant: boolean
    canSetOwner: boolean
  }
}
