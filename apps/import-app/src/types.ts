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
  entities: ParsedEntity[]
  edges: ParsedEdge[]
  errors: string[]
  warnings: string[]
}

export interface ImportTask {
  id: string
  filename: string
  status: "pending" | "running" | "success" | "failed"
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
