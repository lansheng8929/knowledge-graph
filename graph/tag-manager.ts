import type { NodeId } from "./type"
import { ConnGraphEvents } from "./events"

export interface NodeTag {
  nodeId: NodeId
  label: string
  visible?: boolean
  icon?: string
  metadata?: Record<string, any>
}

/**
 * TagManager 模型层 - 负责数据存储和管理
 */
export class TagManagerModel {
  private tags: Map<NodeId, NodeTag[]>
  private events: ConnGraphEvents

  constructor(events: ConnGraphEvents) {
    this.tags = new Map()
    this.events = events
  }

  /**
   * 为节点添加标签
   */
  addTag(nodeId: NodeId, tag: Omit<NodeTag, "nodeId">): NodeTag {
    const nodeTag: NodeTag = {
      nodeId,
      ...tag,
    }

    const existingTags = this.tags.get(nodeId) || []
    existingTags.push(nodeTag)
    this.tags.set(nodeId, existingTags)

    // 发布标签变化事件
    this.events.publish("tagChange", {
      action: "add",
      nodeId,
      tag: nodeTag,
    })

    return nodeTag
  }

  /**
   * 移除节点的所有标签
   */
  removeAllTags(nodeId: NodeId): boolean {
    const tags = this.tags.get(nodeId)
    if (!tags || tags.length === 0) return false

    this.tags.delete(nodeId)

    // 发布标签变化事件
    this.events.publish("tagChange", {
      action: "remove",
      nodeId,
      tag: undefined,
    })

    return true
  }

  /**
   * 获取节点的所有标签
   */
  getTags(nodeId: NodeId): NodeTag[] {
    return this.tags.get(nodeId) || []
  }

  /**
   * 获取所有标签
   */
  getAllTags(): NodeTag[] {
    const allTags: NodeTag[] = []
    for (const tagArray of this.tags.values()) {
      allTags.push(...tagArray)
    }
    return allTags
  }

  /**
   * 获取所有有标签的节点ID
   */
  getTaggedNodeIds(): NodeId[] {
    return Array.from(this.tags.keys())
  }

  /**
   * 批量添加标签
   */
  addTags(
    tags: Array<{ nodeId: NodeId } & Omit<NodeTag, "nodeId">>
  ): NodeTag[] {
    const addedTags: NodeTag[] = []

    tags.forEach((tag) => {
      const { nodeId, ...tagData } = tag
      const nodeTag = this.addTag(nodeId, tagData)
      addedTags.push(nodeTag)
    })

    return addedTags
  }

  /**
   * 批量移除标签
   */
  removeAllTagsForNodes(nodeIds: NodeId[]): number {
    let removedCount = 0

    nodeIds.forEach((nodeId) => {
      if (this.removeAllTags(nodeId)) {
        removedCount++
      }
    })

    return removedCount
  }

  /**
   * 清空所有标签
   */
  clearAll(): void {
    const nodeIds = Array.from(this.tags.keys())
    this.tags.clear()

    // 发布标签清空事件
    this.events.publish("tagChange", {
      action: "clear",
      nodeIds,
    })
  }

  /**
   * 更新节点指定类型的标签
   */
  updateTagByType(
    nodeId: NodeId,
    type: string,
    updates: Partial<Omit<NodeTag, "nodeId">>
  ): NodeTag | undefined {
    const tags = this.tags.get(nodeId)
    if (!tags) return undefined

    const index = tags.findIndex((tag) => tag.metadata?.type === type)
    if (index === -1) return undefined

    const updatedTag: NodeTag = {
      ...tags[index],
      ...updates,
      metadata: {
        ...tags[index].metadata,
        ...updates.metadata,
        type, // 保持类型不变
      },
    }

    tags[index] = updatedTag
    this.tags.set(nodeId, tags)

    // 发布标签变化事件
    this.events.publish("tagChange", {
      action: "update",
      nodeId,
      tag: updatedTag,
    })

    return updatedTag
  }

  /**
   * 检查节点是否有标签
   */
  hasTag(nodeId: NodeId): boolean {
    const tags = this.tags.get(nodeId)
    return tags ? tags.length > 0 : false
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
  filterTags(predicate: (tag: NodeTag) => boolean): NodeTag[] {
    const allTags: NodeTag[] = []
    for (const tagArray of this.tags.values()) {
      allTags.push(...tagArray)
    }
    return allTags.filter(predicate)
  }

  /**
   * 设置指定类型标签的可见性
   */
  setTagVisibleByType(
    nodeId: NodeId,
    type: string,
    visible: boolean
  ): NodeTag | undefined {
    return this.updateTagByType(nodeId, type, { visible })
  }

  /**
   * 设置节点所有标签的可见性
   */
  setAllTagsVisibleForNode(nodeId: NodeId, visible: boolean): NodeTag[] {
    const tags = this.getTags(nodeId)
    const updatedTags: NodeTag[] = []

    tags.forEach((tag, index) => {
      const updatedTag: NodeTag = {
        ...tag,
        visible,
      }
      tags[index] = updatedTag
      updatedTags.push(updatedTag)
    })

    if (updatedTags.length > 0) {
      this.tags.set(nodeId, tags)
      // 发布标签变化事件
      updatedTags.forEach((tag) => {
        this.events.publish("tagChange", {
          action: "update",
          nodeId,
          tag,
        })
      })
    }

    return updatedTags
  }

  /**
   * 批量设置多个节点的所有标签可见性
   */
  setTagsVisible(nodeIds: NodeId[], visible: boolean): NodeTag[] {
    const updatedTags: NodeTag[] = []

    nodeIds.forEach((nodeId) => {
      const tags = this.setAllTagsVisibleForNode(nodeId, visible)
      updatedTags.push(...tags)
    })

    return updatedTags
  }

  /**
   * 切换指定类型标签的可见性
   */
  toggleTagVisibleByType(nodeId: NodeId, type: string): NodeTag | undefined {
    const tags = this.getTags(nodeId)
    const tag = tags.find((t) => t.metadata?.type === type)

    if (!tag) return undefined

    const newVisible = !(tag.visible ?? true)
    return this.setTagVisibleByType(nodeId, type, newVisible)
  }

  /**
   * 获取所有可见的标签
   */
  getVisibleTags(): NodeTag[] {
    return this.filterTags((tag) => tag.visible !== false)
  }

  /**
   * 获取所有隐藏的标签
   */
  getHiddenTags(): NodeTag[] {
    return this.filterTags((tag) => tag.visible === false)
  }

  /**
   * 隐藏全部标签
   */
  hideAllTags(): NodeTag[] {
    const allNodeIds = this.getTaggedNodeIds()
    return this.setTagsVisible(allNodeIds, false)
  }

  /**
   * 显示全部标签
   */
  showAllTags(): NodeTag[] {
    const allNodeIds = this.getTaggedNodeIds()
    return this.setTagsVisible(allNodeIds, true)
  }

  /**
   * 根据标签文本搜索
   */
  searchTags(query: string): NodeTag[] {
    const lowerQuery = query.toLowerCase()
    return this.filterTags((tag) =>
      tag.label.toLowerCase().includes(lowerQuery)
    )
  }

  /**
   * 导出标签数据
   */
  export(): NodeTag[] {
    return this.getAllTags()
  }

  /**
   * 导入标签数据
   */
  import(tags: NodeTag[]): void {
    this.clearAll()
    // 按节点ID分组标签
    const tagsByNodeId = new Map<NodeId, NodeTag[]>()

    tags.forEach((tag) => {
      const existing = tagsByNodeId.get(tag.nodeId) || []
      existing.push(tag)
      tagsByNodeId.set(tag.nodeId, existing)
    })

    // 设置到tags Map中
    for (const [nodeId, nodeTags] of tagsByNodeId) {
      this.tags.set(nodeId, nodeTags)
    }
  }

  /**
   * 为节点添加类型标签
   */
  addTypedTag(
    nodeId: NodeId,
    type: string,
    label: string,
    extra?: Partial<NodeTag>
  ): NodeTag {
    return this.addTag(nodeId, {
      label,
      metadata: { type, ...extra?.metadata },
      ...extra,
    })
  }

  /**
   * 获取节点指定类型的标签
   */
  getTagByType(nodeId: NodeId, type: string): NodeTag | undefined {
    return this.getTags(nodeId).find((tag) => tag.metadata?.type === type)
  }

  /**
   * 移除节点指定类型的标签
   */
  removeTagByType(nodeId: NodeId, type: string): boolean {
    const tags = this.getTags(nodeId)
    if (!tags || tags.length === 0) return false

    const index = tags.findIndex((tag) => tag.metadata?.type === type)
    if (index === -1) return false

    const removedTag = tags[index]
    const newTags = tags.filter((_, i) => i !== index)

    if (newTags.length === 0) {
      this.tags.delete(nodeId)
    } else {
      this.tags.set(nodeId, newTags)
    }

    // 发布标签变化事件
    this.events.publish("tagChange", {
      action: "remove",
      nodeId,
      tag: removedTag,
    })

    return true
  }

  /**
   * 获取节点标签数量
   */
  getNodeTagCount(nodeId: NodeId): number {
    const tags = this.tags.get(nodeId)
    return tags ? tags.length : 0
  }

  /**
   * 获取所有有标签的节点ID
   */
  getNodesWithTags(): NodeId[] {
    return Array.from(this.tags.keys())
  }

  getTagMap(): Map<NodeId, NodeTag[]> {
    return this.tags
  }
}

/**
 * TagManager - 整合模型层
 */
export class TagManager {
  public readonly model: TagManagerModel
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
  isTagVisible(tag: NodeTag): boolean {
    if (!this.globalVisible) return false
    return tag.visible !== false
  }

  /**
   * 获取节点所有应该显示的标签
   */
  getVisibleTags(nodeId: NodeId): NodeTag[] {
    if (!this.globalVisible) return []
    return this.model.getTags(nodeId).filter((tag) => tag.visible !== false)
  }

  /**
   * 获取所有应该显示的标签
   */
  getAllVisibleTags(): NodeTag[] {
    if (!this.globalVisible) return []
    return this.model.getAllTags().filter((tag) => tag.visible !== false)
  }

  /**
   * 获取所有隐藏的标签
   */
  getAllHiddenTags(): NodeTag[] {
    if (!this.globalVisible) {
      // 如果全局隐藏，返回所有标签
      return this.model.getAllTags()
    }
    return this.model.getAllTags().filter((tag) => tag.visible === false)
  }
}
