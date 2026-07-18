/**
 * 实体元数据管理器（MetadataManager）
 *
 * 用于管理图谱中节点和边的动态元数据，包括：
 * - 分页信息（pageIndex / total / count）
 * - 拓展规则（rules）
 *
 * 不依赖 React，可在服务端/客户端通用使用。
 */
export interface EntityMeta {
  /** 当前页索引 */
  pageIndex?: number
  /** 总数量 */
  total?: number
  /** 已加载数量 */
  count?: number
  /** 拓展使用的规则列表 */
  rules?: Record<string, unknown>[]
}

/** 实体标识 */
export interface MetaEntityIdentifier {
  id: string
  type: "node" | "link"
}

export class MetadataManager {
  private store = new Map<string, EntityMeta>()

  /** 生成唯一键 */
  private key(entity: MetaEntityIdentifier): string {
    return `${entity.type}:${entity.id}`
  }

  /** 设置实体元数据（合并模式） */
  setMeta(entity: MetaEntityIdentifier, meta: Partial<EntityMeta>): void {
    const k = this.key(entity)
    this.store.set(k, { ...this.store.get(k), ...meta })
  }

  /** 获取实体元数据 */
  getMeta(entity: MetaEntityIdentifier): EntityMeta | undefined {
    return this.store.get(this.key(entity))
  }

  /** 更新分页信息 */
  updatePagination(
    entity: MetaEntityIdentifier,
    pagination: { pageIndex?: number; total?: number; count?: number },
  ): void {
    this.setMeta(entity, pagination)
  }

  /** 获取分页信息 */
  getPagination(entity: MetaEntityIdentifier): {
    pageIndex?: number
    total?: number
    count?: number
  } {
    const meta = this.getMeta(entity)
    return {
      pageIndex: meta?.pageIndex,
      total: meta?.total,
      count: meta?.count,
    }
  }

  /** 设置拓展规则 */
  setRules(
    entity: MetaEntityIdentifier,
    rules: Record<string, unknown>[],
  ): void {
    this.setMeta(entity, { rules })
  }

  /** 获取拓展规则 */
  getRules(
    entity: MetaEntityIdentifier,
  ): Record<string, unknown>[] | undefined {
    return this.getMeta(entity)?.rules
  }

  /** 删除实体元数据 */
  deleteMeta(entity: MetaEntityIdentifier): void {
    this.store.delete(this.key(entity))
  }

  /** 清空所有元数据 */
  clear(): void {
    this.store.clear()
  }

  /** 实体数量 */
  get size(): number {
    return this.store.size
  }
}
