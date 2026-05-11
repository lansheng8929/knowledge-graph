import type { NodeId } from "./type"
import { ConnGraphEvents } from "./events"
import type { DefaultGraphDataGenerics, GraphDataGenerics } from "./client"

// 标签目标类型
export type TagTargetType = "node" | "link"

// 通用标签接口
export interface Tag<M extends object = object> {
  // 标签所属目标的ID（可以是节点ID或边ID）
  targetId: string
  // 目标类型：节点或边
  targetType: TagTargetType
  // 标签文本
  label?: string
  // 是否可见
  visible?: boolean
  // 图标
  icon?: string
  // 元数据
  metadata?: M
}

// 为了向后兼容，保留NodeTag类型别名
export type NodeTag<M extends object = object> = Tag<M> & {
  targetType: "node"
  targetId: NodeId
}
export type LinkTag<M extends object = object> = Tag<M> & {
  targetType: "link"
  targetId: string
}

/**
 * TagManager 模型层 - 负责数据存储和管理
 * 统一管理节点和边的标签
 */
export class TagManagerModel<G extends GraphDataGenerics> {
  private tags: Map<string, Tag<G["M"]>[]>
  private events: ConnGraphEvents

  constructor(events: ConnGraphEvents) {
    this.tags = new Map()
    this.events = events
  }

  /**
   * 生成存储键
   */
  private getKey(targetType: TagTargetType, targetId: string): string {
    return `${targetType}:${targetId}`
  }

  /**
   * 添加标签（通用方法）
   */
  addTag(
    targetId: string,
    targetType: TagTargetType,
    tag: Omit<Tag<G["M"]>, "targetId" | "targetType">,
  ): Tag<G["M"]> {
    const newTag: Tag<G["M"]> = {
      targetId,
      targetType,
      ...tag,
    }

    const key = this.getKey(targetType, targetId)
    const existingTags = this.tags.get(key) || []
    if (
      !existingTags.some(
        (tag) => JSON.stringify(tag) === JSON.stringify(newTag),
      )
    ) {
      existingTags.push(newTag)
    }

    this.tags.set(key, existingTags)

    // 发布标签变化事件
    this.events.publish("tagChange", {
      action: "add",
      targetId,
      targetType,
      tag: newTag,
    })

    return newTag
  }

  /**
   * 为节点添加标签（便捷方法，保持向后兼容）
   */
  addNodeTag(
    nodeId: NodeId,
    tag: Omit<Tag<G["M"]>, "targetId" | "targetType">,
  ): NodeTag {
    return this.addTag(nodeId, "node", tag) as NodeTag
  }

  /**
   * 为边添加标签（便捷方法）
   */
  addLinkTag(
    linkId: string,
    tag: Omit<Tag<G["M"]>, "targetId" | "targetType">,
  ): LinkTag {
    return this.addTag(linkId, "link", tag) as LinkTag
  }

  /**
   * 移除目标的所有标签
   */
  removeAllTags(targetId: string, targetType: TagTargetType): boolean {
    const key = this.getKey(targetType, targetId)
    const tags = this.tags.get(key)
    if (!tags || tags.length === 0) return false

    this.tags.delete(key)

    // 发布标签变化事件
    this.events.publish("tagChange", {
      action: "remove",
      targetId,
      targetType,
      tag: undefined,
    })

    return true
  }

  /**
   * 移除节点的所有标签（便捷方法，保持向后兼容）
   */
  removeAllNodeTags(nodeId: NodeId): boolean {
    return this.removeAllTags(nodeId, "node")
  }

  /**
   * 移除边的所有标签（便捷方法）
   */
  removeAllLinkTags(linkId: string): boolean {
    return this.removeAllTags(linkId, "link")
  }

  /**
   * 获取目标的所有标签
   */
  getTags(targetId: string, targetType: TagTargetType): Tag<G["M"]>[] {
    const key = this.getKey(targetType, targetId)
    return this.tags.get(key) || []
  }

  /**
   * 获取节点的所有标签（便捷方法，保持向后兼容）
   */
  getNodeTags(nodeId: NodeId): NodeTag[] {
    return this.getTags(nodeId, "node") as NodeTag[]
  }

  /**
   * 获取边的所有标签（便捷方法）
   */
  getLinkTags(linkId: string): LinkTag[] {
    return this.getTags(linkId, "link") as LinkTag[]
  }

  /**
   * 获取所有标签
   */
  getAllTags(): Tag<G["M"]>[] {
    const allTags: Tag<G["M"]>[] = []
    for (const tagArray of this.tags.values()) {
      allTags.push(...tagArray)
    }
    return allTags
  }

  /**
   * 获取所有节点标签
   */
  getAllNodeTags(): NodeTag[] {
    return this.getAllTags().filter(
      (tag) => tag.targetType === "node",
    ) as NodeTag[]
  }

  /**
   * 获取所有边标签
   */
  getAllLinkTags(): LinkTag[] {
    return this.getAllTags().filter(
      (tag) => tag.targetType === "link",
    ) as LinkTag[]
  }

  /**
   * 获取所有有标签的目标ID（按类型）
   */
  getTaggedTargetIds(targetType: TagTargetType): string[] {
    const ids: string[] = []
    for (const [key, tags] of this.tags.entries()) {
      if (tags.length > 0 && key.startsWith(`${targetType}:`)) {
        ids.push(key.substring(targetType.length + 1))
      }
    }
    return ids
  }

  /**
   * 获取所有有标签的节点ID
   */
  getTaggedNodeIds(): NodeId[] {
    return this.getTaggedTargetIds("node")
  }

  /**
   * 获取所有有标签的边ID
   */
  getTaggedLinkIds(): string[] {
    return this.getTaggedTargetIds("link")
  }

  /**
   * 批量添加标签
   */
  addTags(
    tags: Array<
      { targetId: string; targetType: TagTargetType } & Omit<
        Tag<G["M"]>,
        "targetId" | "targetType"
      >
    >,
  ): Tag<G["M"]>[] {
    const addedTags: Tag<G["M"]>[] = []

    tags.forEach((tag) => {
      const { targetId, targetType, ...tagData } = tag
      const newTag = this.addTag(targetId, targetType, tagData)
      addedTags.push(newTag)
    })

    return addedTags
  }

  /**
   * 批量移除标签
   */
  removeAllTagsForTargets(
    targets: Array<{ targetId: string; targetType: TagTargetType }>,
  ): number {
    let removedCount = 0

    targets.forEach(({ targetId, targetType }) => {
      if (this.removeAllTags(targetId, targetType)) {
        removedCount++
      }
    })

    return removedCount
  }

  /**
   * 批量移除节点标签（便捷方法）
   */
  removeAllTagsForNodes(nodeIds: NodeId[]): number {
    return this.removeAllTagsForTargets(
      nodeIds.map((id) => ({
        targetId: id,
        targetType: "node" as TagTargetType,
      })),
    )
  }

  /**
   * 批量移除边标签（便捷方法）
   */
  removeAllTagsForLinks(linkIds: string[]): number {
    return this.removeAllTagsForTargets(
      linkIds.map((id) => ({
        targetId: id,
        targetType: "link" as TagTargetType,
      })),
    )
  }

  /**
   * 清空所有标签
   */
  clearAll(): void {
    const allKeys = Array.from(this.tags.keys())
    this.tags.clear()

    // 发布标签清空事件
    this.events.publish("tagChange", {
      action: "clear",
      targetIds: allKeys,
    })
  }

  /**
   * 更新目标指定类型的标签
   */
  updateTagByType(
    targetId: string,
    targetType: TagTargetType,
    type: string,
    updates: Partial<Omit<Tag<G["M"]>, "targetId" | "targetType">>,
  ): Tag<G["M"]> | undefined {
    const tags = this.getTags(targetId, targetType)
    if (!tags) return undefined

    const index = tags.findIndex((tag) => tag.targetType === type)
    if (index === -1) return undefined

    const updatedTag: Tag<G["M"]> = {
      ...tags[index],
      ...updates,
      metadata: {
        ...tags[index].metadata,
        ...updates.metadata,
        type, // 保持类型不变
      },
    }

    tags[index] = updatedTag
    const key = this.getKey(targetType, targetId)
    this.tags.set(key, tags)

    // 发布标签变化事件
    this.events.publish("tagChange", {
      action: "update",
      targetId,
      targetType,
      tag: updatedTag,
    })

    return updatedTag
  }

  /**
   * 检查目标是否有标签
   */
  hasTag(targetId: string, targetType: TagTargetType): boolean {
    const tags = this.getTags(targetId, targetType)
    return tags.length > 0
  }

  /**
   * 检查节点是否有标签（便捷方法，保持向后兼容）
   */
  hasNodeTag(nodeId: NodeId): boolean {
    return this.hasTag(nodeId, "node")
  }

  /**
   * 检查边是否有标签（便捷方法）
   */
  hasLinkTag(linkId: string): boolean {
    return this.hasTag(linkId, "link")
  }

  /**
   * 获取标签数量
   */
  getTagCount(): number {
    let totalCount = 0
    for (const tagArray of this.tags.values()) {
      totalCount += tagArray.length
    }
    return totalCount
  }

  /**
   * 根据标签属性筛选
   */
  filterTags(predicate: (tag: Tag<G["M"]>) => boolean): Tag<G["M"]>[] {
    const allTags: Tag<G["M"]>[] = []
    for (const tagArray of this.tags.values()) {
      allTags.push(...tagArray)
    }
    return allTags.filter(predicate)
  }

  /**
   * 设置指定类型标签的可见性
   */
  setTagVisibleByType(
    targetId: string,
    targetType: TagTargetType,
    type: string,
    visible: boolean,
  ): Tag<G["M"]> | undefined {
    return this.updateTagByType(targetId, targetType, type, { visible })
  }

  /**
   * 设置目标所有标签的可见性
   */
  setAllTagsVisibleForTarget(
    targetId: string,
    targetType: TagTargetType,
    visible: boolean,
  ): Tag<G["M"]>[] {
    const tags = this.getTags(targetId, targetType)
    const updatedTags: Tag<G["M"]>[] = []

    tags.forEach((tag, index) => {
      const updatedTag: Tag<G["M"]> = {
        ...tag,
        visible,
      }
      tags[index] = updatedTag
      updatedTags.push(updatedTag)
    })

    if (updatedTags.length > 0) {
      const key = this.getKey(targetType, targetId)
      this.tags.set(key, tags)
      // 发布标签变化事件
      updatedTags.forEach((tag) => {
        this.events.publish("tagChange", {
          action: "update",
          targetId,
          targetType,
          tag,
        })
      })
    }

    return updatedTags
  }

  /**
   * 设置节点所有标签的可见性（便捷方法，保持向后兼容）
   */
  setAllTagsVisibleForNode(nodeId: NodeId, visible: boolean): NodeTag[] {
    return this.setAllTagsVisibleForTarget(nodeId, "node", visible) as NodeTag[]
  }

  /**
   * 设置边所有标签的可见性（便捷方法）
   */
  setAllTagsVisibleForLink(linkId: string, visible: boolean): LinkTag[] {
    return this.setAllTagsVisibleForTarget(linkId, "link", visible) as LinkTag[]
  }

  /**
   * 批量设置多个目标的所有标签可见性
   */
  setTagsVisible(
    targets: Array<{ targetId: string; targetType: TagTargetType }>,
    visible: boolean,
  ): Tag<G["M"]>[] {
    const updatedTags: Tag<G["M"]>[] = []

    targets.forEach(({ targetId, targetType }) => {
      const tags = this.setAllTagsVisibleForTarget(
        targetId,
        targetType,
        visible,
      )
      updatedTags.push(...tags)
    })

    return updatedTags
  }

  /**
   * 批量设置多个节点的所有标签可见性（便捷方法）
   */
  setNodeTagsVisible(nodeIds: NodeId[], visible: boolean): NodeTag[] {
    return this.setTagsVisible(
      nodeIds.map((id) => ({
        targetId: id,
        targetType: "node" as TagTargetType,
      })),
      visible,
    ) as NodeTag[]
  }

  /**
   * 批量设置多个边的所有标签可见性（便捷方法）
   */
  setLinkTagsVisible(linkIds: string[], visible: boolean): LinkTag[] {
    return this.setTagsVisible(
      linkIds.map((id) => ({
        targetId: id,
        targetType: "link" as TagTargetType,
      })),
      visible,
    ) as LinkTag[]
  }

  /**
   * 切换指定类型标签的可见性
   */
  toggleTagVisibleByType(
    targetId: string,
    targetType: TagTargetType,
    type: string,
  ): Tag<G["M"]> | undefined {
    const tags = this.getTags(targetId, targetType)
    const tag = tags.find((t) => t.targetType === type)

    if (!tag) return undefined

    const newVisible = !(tag.visible ?? true)
    return this.setTagVisibleByType(targetId, targetType, type, newVisible)
  }

  /**
   * 获取所有可见的标签
   */
  getVisibleTags(): Tag<G["M"]>[] {
    return this.filterTags((tag) => tag.visible !== false)
  }

  /**
   * 获取所有隐藏的标签
   */
  getHiddenTags(): Tag<G["M"]>[] {
    return this.filterTags((tag) => tag.visible === false)
  }

  /**
   * 隐藏全部标签
   */
  hideAllTags(): Tag<G["M"]>[] {
    const allTargets = Array.from(this.tags.keys()).map((key) => {
      const [targetType, ...rest] = key.split(":")
      return {
        targetId: rest.join(":"),
        targetType: targetType as TagTargetType,
      }
    })
    return this.setTagsVisible(allTargets, false)
  }

  /**
   * 显示全部标签
   */
  showAllTags(): Tag<G["M"]>[] {
    const allTargets = Array.from(this.tags.keys()).map((key) => {
      const [targetType, ...rest] = key.split(":")
      return {
        targetId: rest.join(":"),
        targetType: targetType as TagTargetType,
      }
    })
    return this.setTagsVisible(allTargets, true)
  }

  /**
   * 根据标签文本搜索
   */
  searchTags(query: string): Tag<G["M"]>[] {
    const lowerQuery = query.toLowerCase()
    return this.filterTags(
      (tag) => tag.label?.toLowerCase().includes(lowerQuery) || false,
    )
  }

  /**
   * 导出标签数据
   */
  export(): Tag<G["M"]>[] {
    return this.getAllTags()
  }

  /**
   * 导入标签数据
   */
  import(tags: Tag<G["M"]>[]): void {
    this.clearAll()
    // 按目标ID和类型分组标签
    const tagsByKey = new Map<string, Tag<G["M"]>[]>()

    tags.forEach((tag) => {
      const key = this.getKey(tag.targetType, tag.targetId)
      const existing = tagsByKey.get(key) || []
      existing.push(tag)
      tagsByKey.set(key, existing)
    })

    // 设置到tags Map中
    for (const [key, tagList] of tagsByKey) {
      this.tags.set(key, tagList)
    }
  }

  /**
   * 添加类型标签（通用）
   */
  addTypedTag(
    targetId: string,
    targetType: TagTargetType,
    type: string,
    label: string,
    extra?: Partial<Omit<Tag<G["M"]>, "targetId" | "targetType">>,
  ): Tag<G["M"]> {
    return this.addTag(targetId, targetType, {
      label,
      metadata: { type, ...extra?.metadata },
      ...extra,
    })
  }

  /**
   * 为节点添加类型标签（便捷方法，保持向后兼容）
   */
  addTypedNodeTag(
    nodeId: NodeId,
    type: string,
    label: string,
    extra?: Partial<Omit<Tag<G["M"]>, "targetId" | "targetType">>,
  ): NodeTag {
    return this.addTypedTag(nodeId, "node", type, label, extra) as NodeTag
  }

  /**
   * 为边添加类型标签（便捷方法）
   */
  addTypedLinkTag(
    linkId: string,
    type: string,
    label: string,
    extra?: Partial<Omit<Tag<G["M"]>, "targetId" | "targetType">>,
  ): LinkTag {
    return this.addTypedTag(linkId, "link", type, label, extra) as LinkTag
  }

  /**
   * 获取指定类型的标签
   */
  getTagByType(
    targetId: string,
    targetType: TagTargetType,
    type: string,
  ): Tag<G["M"]> | undefined {
    return this.getTags(targetId, targetType).find(
      (tag) => tag.targetType === type,
    )
  }

  /**
   * 获取节点指定类型的标签（便捷方法，保持向后兼容）
   */
  getNodeTagByType(nodeId: NodeId, type: string): NodeTag | undefined {
    return this.getTagByType(nodeId, "node", type) as NodeTag | undefined
  }

  /**
   * 获取边指定类型的标签（便捷方法）
   */
  getLinkTagByType(linkId: string, type: string): LinkTag | undefined {
    return this.getTagByType(linkId, "link", type) as LinkTag | undefined
  }

  /**
   * 移除指定类型的标签
   */
  removeTagByType(
    targetId: string,
    targetType: TagTargetType,
    type: string,
  ): boolean {
    const tags = this.getTags(targetId, targetType)
    if (!tags || tags.length === 0) return false

    const index = tags.findIndex((tag) => tag.targetType === type)
    if (index === -1) return false

    const removedTag = tags[index]
    const newTags = tags.filter((_, i) => i !== index)

    const key = this.getKey(targetType, targetId)
    if (newTags.length === 0) {
      this.tags.delete(key)
    } else {
      this.tags.set(key, newTags)
    }

    // 发布标签变化事件
    this.events.publish("tagChange", {
      action: "remove",
      targetId,
      targetType,
      tag: removedTag,
    })

    return true
  }

  /**
   * 移除节点指定类型的标签（便捷方法，保持向后兼容）
   */
  removeNodeTagByType(nodeId: NodeId, type: string): boolean {
    return this.removeTagByType(nodeId, "node", type)
  }

  /**
   * 移除边指定类型的标签（便捷方法）
   */
  removeLinkTagByType(linkId: string, type: string): boolean {
    return this.removeTagByType(linkId, "link", type)
  }

  /**
   * 获取目标标签数量
   */
  getTargetTagCount(targetId: string, targetType: TagTargetType): number {
    const tags = this.getTags(targetId, targetType)
    return tags.length
  }

  /**
   * 获取节点标签数量（便捷方法，保持向后兼容）
   */
  getNodeTagCount(nodeId: NodeId): number {
    return this.getTargetTagCount(nodeId, "node")
  }

  /**
   * 获取边标签数量（便捷方法）
   */
  getLinkTagCount(linkId: string): number {
    return this.getTargetTagCount(linkId, "link")
  }

  /**
   * 获取所有有标签的节点ID（保持向后兼容）
   */
  getNodesWithTags(): NodeId[] {
    return this.getTaggedNodeIds()
  }

  /**
   * 获取所有有标签的边ID
   */
  getLinksWithTags(): string[] {
    return this.getTaggedLinkIds()
  }

  /**
   * 获取标签Map（原始数据）
   */
  getTagMap(): Map<string, Tag<G["M"]>[]> {
    return this.tags
  }
}

/**
 * TagManager - 整合模型层
 */
export class TagManager<
  G extends GraphDataGenerics = DefaultGraphDataGenerics,
> {
  public readonly model: TagManagerModel<G>
  private globalVisible: boolean

  constructor(events: ConnGraphEvents) {
    this.model = new TagManagerModel(events)
    this.globalVisible = true // 默认显示所有标签
  }

  /**
   * 设置全局标签可见性
   */
  setGlobalVisible(visible: boolean): void {
    this.globalVisible = visible
  }

  /**
   * 获取全局标签可见性
   */
  getGlobalVisible(): boolean {
    return this.globalVisible
  }

  /**
   * 切换全局标签可见性
   */
  toggleGlobalVisible(): boolean {
    this.globalVisible = !this.globalVisible
    return this.globalVisible
  }

  /**
   * 判断标签是否应该显示（考虑全局和单个标签的可见性）
   */
  isTagVisible(tag: Tag<G["M"]>): boolean {
    if (!this.globalVisible) return false
    return tag.visible !== false
  }

  /**
   * 获取目标所有应该显示的标签
   */
  getVisibleTags(targetId: string, targetType: TagTargetType): Tag<G["M"]>[] {
    if (!this.globalVisible) return []
    return this.model
      .getTags(targetId, targetType)
      .filter((tag) => tag.visible !== false)
  }

  /**
   * 获取节点所有应该显示的标签（便捷方法，保持向后兼容）
   */
  getVisibleNodeTags(nodeId: NodeId): NodeTag<G["M"]>[] {
    return this.getVisibleTags(nodeId, "node") as NodeTag[]
  }

  /**
   * 获取边所有应该显示的标签（便捷方法）
   */
  getVisibleLinkTags(linkId: string): LinkTag<G["M"]>[] {
    return this.getVisibleTags(linkId, "link") as LinkTag[]
  }

  /**
   * 获取所有应该显示的标签
   */
  getAllVisibleTags(): Tag<G["M"]>[] {
    if (!this.globalVisible) return []
    return this.model.getAllTags().filter((tag) => tag.visible !== false)
  }

  /**
   * 获取所有隐藏的标签
   */
  getAllHiddenTags(): Tag<G["M"]>[] {
    if (!this.globalVisible) {
      // 如果全局隐藏，返回所有标签
      return this.model.getAllTags()
    }
    return this.model.getAllTags().filter((tag) => tag.visible === false)
  }
}
