import type { GraphEvents } from "./events"
import type { NodeId, LinkId } from "./type"
import type {
  GraphDataGenerics,
  DefaultGraphDataGenerics,
  StateConfig,
} from "./client/type"

/**
 * 状态信息接口
 */
export type StateInfo = Required<StateConfig>

/**
 * 状态管理器
 * 负责管理图中节点和连线的临时状态（焦点、选中、隐藏等）
 * 这些状态不同于节点的 stateType，是运行时的临时状态
 */
export class StateManager<
  G extends GraphDataGenerics = DefaultGraphDataGenerics,
> {
  private state: StateInfo
  private events: GraphEvents<G>

  constructor(events: GraphEvents<G>) {
    this.events = events
    this.state = {
      highlightNodes: [],
      highlightLinks: [],
      selectedNodes: [],
      selectedLinks: [],
      hiddenNodes: [],
      hiddenLinks: [],
      rootNodes: [],
      hoveredNodes: [],
      hoveredLinks: [],
    }
  }

  // ============ 焦点状态管理 ============

  /**
   * 设置高亮节点
   */
  setHighlightNodes(nodeIds: NodeId[], linkIds?: LinkId[]): void {
    this.state.highlightNodes = [...new Set(nodeIds)]
    this.state.highlightLinks = linkIds ? [...new Set(linkIds)] : []

    this.events.publish("highlightChange", {
      nodeIds: this.state.highlightNodes,
      linkIds: this.state.highlightLinks,
    })

    this.publishMetaDataChange()
  }

  /**
   * 添加高亮节点
   */
  addHighlightNodes(nodeIds: NodeId[], linkIds?: LinkId[]): void {
    this.state.highlightNodes = [
      ...new Set([...this.state.highlightNodes, ...nodeIds]),
    ]
    if (linkIds) {
      this.state.highlightLinks = [
        ...new Set([...this.state.highlightLinks, ...linkIds]),
      ]
    }

    this.events.publish("highlightChange", {
      nodeIds: this.state.highlightNodes,
      linkIds: this.state.highlightLinks,
    })

    this.publishMetaDataChange()
  }

  /**
   * 移除高亮节点
   */
  removeHighlightNodes(nodeIds: NodeId[]): void {
    const nodeIdSet = new Set(nodeIds)
    this.state.highlightNodes = this.state.highlightNodes.filter(
      (id) => !nodeIdSet.has(id),
    )

    this.events.publish("highlightChange", {
      nodeIds: this.state.highlightNodes,
      linkIds: this.state.highlightLinks,
    })

    this.publishMetaDataChange()
  }

  /**
   * 清空高亮
   */
  clearHighlightNodes(): void {
    this.state.highlightNodes = []
    this.state.highlightLinks = []

    this.events.publish("highlightChange", {
      nodeIds: [],
      linkIds: [],
    })

    this.publishMetaDataChange()
  }

  /**
   * 获取高亮节点
   */
  getHighlightNodes(): NodeId[] {
    return [...this.state.highlightNodes]
  }

  /**
   * 获取高亮连线
   */
  getHighlightLinks(): LinkId[] {
    return [...this.state.highlightLinks]
  }

  /**
   * 判断节点是否在高亮中
   */
  isHighlighted(nodeId: NodeId): boolean {
    return this.state.highlightNodes.includes(nodeId)
  }

  // ============ 选中状态管理 ============

  /**
   * 设置选中节点
   */
  setSelectedNodes(nodeIds: NodeId[], linkIds?: LinkId[]): void {
    this.state.selectedNodes = [...new Set(nodeIds)]
    this.state.selectedLinks = linkIds ? [...new Set(linkIds)] : []

    this.events.publish("selectionChange", {
      nodeIds: this.state.selectedNodes,
      linkIds: this.state.selectedLinks,
    })

    this.publishMetaDataChange()
  }

  /**
   * 添加选中节点
   */
  addSelectedNodes(nodeIds: NodeId[], linkIds?: LinkId[]): void {
    this.state.selectedNodes = [
      ...new Set([...this.state.selectedNodes, ...nodeIds]),
    ]
    if (linkIds) {
      this.state.selectedLinks = [
        ...new Set([...this.state.selectedLinks, ...linkIds]),
      ]
    }

    this.events.publish("selectionChange", {
      nodeIds: this.state.selectedNodes,
      linkIds: this.state.selectedLinks,
    })

    this.publishMetaDataChange()
  }

  /**
   * 移除选中节点
   */
  removeSelectedNodes(nodeIds: NodeId[]): void {
    const nodeIdSet = new Set(nodeIds)
    this.state.selectedNodes = this.state.selectedNodes.filter(
      (id) => !nodeIdSet.has(id),
    )

    this.events.publish("selectionChange", {
      nodeIds: this.state.selectedNodes,
      linkIds: this.state.selectedLinks,
    })

    this.publishMetaDataChange()
  }

  /**
   * 清空选中
   */
  clearSelection(): void {
    this.state.selectedNodes = []
    this.state.selectedLinks = []

    this.events.publish("selectionChange", {
      nodeIds: [],
      linkIds: [],
    })

    this.publishMetaDataChange()
  }

  /**
   * 获取选中节点
   */
  getSelectedNodes(): NodeId[] {
    return [...this.state.selectedNodes]
  }

  /**
   * 获取选中连线
   */
  getSelectedLinks(): LinkId[] {
    return [...this.state.selectedLinks]
  }

  /**
   * 判断节点是否被选中
   */
  isSelected(nodeId: NodeId): boolean {
    return this.state.selectedNodes.includes(nodeId)
  }

  // ============ 隐藏状态管理 ============

  /**
   * 设置隐藏节点
   */
  setHiddenNodes(nodeIds: NodeId[], linkIds?: LinkId[]): void {
    this.state.hiddenNodes = [...new Set(nodeIds)]
    this.state.hiddenLinks = linkIds ? [...new Set(linkIds)] : []

    this.events.publish("hiddenChange", {
      nodeIds: this.state.hiddenNodes,
      linkIds: this.state.hiddenLinks,
    })

    this.publishMetaDataChange()
  }

  /**
   * 添加隐藏节点
   */
  addHiddenNodes(nodeIds: NodeId[], linkIds?: LinkId[]): void {
    this.state.hiddenNodes = [
      ...new Set([...this.state.hiddenNodes, ...nodeIds]),
    ]
    if (linkIds) {
      this.state.hiddenLinks = [
        ...new Set([...this.state.hiddenLinks, ...linkIds]),
      ]
    }

    this.events.publish("hiddenChange", {
      nodeIds: this.state.hiddenNodes,
      linkIds: this.state.hiddenLinks,
    })

    this.publishMetaDataChange()
  }

  /**
   * 移除隐藏节点（显示节点）
   */
  removeHiddenNodes(nodeIds: NodeId[]): void {
    const nodeIdSet = new Set(nodeIds)
    this.state.hiddenNodes = this.state.hiddenNodes.filter(
      (id) => !nodeIdSet.has(id),
    )

    this.events.publish("hiddenChange", {
      nodeIds: this.state.hiddenNodes,
      linkIds: this.state.hiddenLinks,
    })

    this.publishMetaDataChange()
  }

  /**
   * 显示所有节点
   */
  showAll(): void {
    this.state.hiddenNodes = []
    this.state.hiddenLinks = []

    this.events.publish("hiddenChange", {
      nodeIds: [],
      linkIds: [],
    })

    this.publishMetaDataChange()
  }

  /**
   * 获取隐藏节点
   */
  getHiddenNodes(): NodeId[] {
    return [...this.state.hiddenNodes]
  }

  /**
   * 获取隐藏连线
   */
  getHiddenLinks(): LinkId[] {
    return [...this.state.hiddenLinks]
  }

  /**
   * 判断节点是否被隐藏
   */
  isHidden(nodeId: NodeId): boolean {
    return this.state.hiddenNodes.includes(nodeId)
  }

  // ============ 根节点状态管理 ============

  /**
   * 设置根节点
   */
  setRootNodes(nodeIds: NodeId[]): void {
    this.state.rootNodes = [...new Set(nodeIds)]

    this.events.publish("rootNodesChange", {
      nodeIds: this.state.rootNodes,
    })

    this.publishMetaDataChange()
  }

  /**
   * 添加根节点
   */
  addRootNodes(nodeIds: NodeId[]): void {
    this.state.rootNodes = [...new Set([...this.state.rootNodes, ...nodeIds])]

    this.events.publish("rootNodesChange", {
      nodeIds: this.state.rootNodes,
    })

    this.publishMetaDataChange()
  }

  /**
   * 移除根节点
   */
  removeRootNodes(nodeIds: NodeId[]): void {
    const nodeIdSet = new Set(nodeIds)
    this.state.rootNodes = this.state.rootNodes.filter(
      (id) => !nodeIdSet.has(id),
    )

    this.events.publish("rootNodesChange", {
      nodeIds: this.state.rootNodes,
    })

    this.publishMetaDataChange()
  }

  /**
   * 清空根节点
   */
  clearRootNodes(): void {
    this.state.rootNodes = []

    this.events.publish("rootNodesChange", {
      nodeIds: [],
    })

    this.publishMetaDataChange()
  }

  /**
   * 获取根节点
   */
  getRootNodes(): NodeId[] {
    return [...this.state.rootNodes]
  }

  /**
   * 判断节点是否为根节点
   */
  isRootNode(nodeId: NodeId): boolean {
    return this.state.rootNodes.includes(nodeId)
  }

  // ============ 悬浮节点状态管理 ============

  /**
   * 设置悬浮节点
   */
  setHoveredNodes(nodeIds: NodeId[]): void {
    this.state.hoveredNodes = [...new Set(nodeIds)]

    this.events.publish("nodesHoverChange", {
      nodeIds: this.state.hoveredNodes,
    })

    this.publishMetaDataChange()
  }

  /**
   * 添加悬浮节点
   */
  addHoveredNodes(nodeIds: NodeId[]): void {
    this.state.hoveredNodes = [
      ...new Set([...this.state.rootNodes, ...nodeIds]),
    ]

    this.events.publish("nodesHoverChange", {
      nodeIds: this.state.hoveredNodes,
    })

    this.publishMetaDataChange()
  }

  /**
   * 移除悬浮节点
   */
  removeHoveredNodes(nodeIds: NodeId[]): void {
    const nodeIdSet = new Set(nodeIds)
    this.state.hoveredNodes = this.state.hoveredNodes.filter(
      (id) => !nodeIdSet.has(id),
    )

    this.events.publish("nodesHoverChange", {
      nodeIds: this.state.hoveredNodes,
    })

    this.publishMetaDataChange()
  }

  /**
   * 清空悬浮节点
   */
  clearHoveredNodes(): void {
    this.state.hoveredNodes = []

    this.events.publish("nodesHoverChange", {
      nodeIds: [],
    })

    this.publishMetaDataChange()
  }

  /**
   * 获取悬浮节点
   */
  getHoveredNodes(): NodeId[] {
    return [...this.state.hoveredNodes]
  }

  /**
   * 判断节点是否为悬浮节点
   */
  isHoveredNode(nodeId: NodeId): boolean {
    return this.state.hoveredNodes.includes(nodeId)
  }

  // ============ 悬浮连线状态管理 ============

  /**
   * 设置悬浮连线
   */
  setHoveredLinks(linkIds: LinkId[]): void {
    this.state.hoveredLinks = [...new Set(linkIds)]

    this.events.publish("linksHoverChange", {
      linkIds: this.state.hoveredLinks,
    })

    this.publishMetaDataChange()
  }

  /**
   * 清空悬浮连线
   */
  clearHoveredLinks(): void {
    this.state.hoveredLinks = []

    this.events.publish("linksHoverChange", {
      linkIds: [],
    })

    this.publishMetaDataChange()
  }

  /**
   * 获取悬浮节点
   */
  getHoveredLinks(): LinkId[] {
    return [...this.state.hoveredLinks]
  }

  /**
   * 判断节点是否为悬浮连线
   */
  isHoveredLink(linkId: LinkId): boolean {
    return this.state.hoveredLinks.includes(linkId)
  }

  // ============ 单个节点/边状态查询 ============

  /**
   * 获取节点的所有状态
   */
  getNodeState(nodeId: NodeId): {
    highlighted: boolean
    selected: boolean
    hidden: boolean
    hovered: boolean
    root: boolean
  } {
    return {
      highlighted: this.isHighlighted(nodeId),
      selected: this.isSelected(nodeId),
      hidden: this.isHidden(nodeId),
      hovered: this.isHoveredNode(nodeId),
      root: this.isRootNode(nodeId),
    }
  }

  /**
   * 获取边的所有状态
   */
  getLinkState(linkId: LinkId): {
    highlighted: boolean
    selected: boolean
    hidden: boolean
    hovered: boolean
  } {
    return {
      highlighted: this.state.highlightLinks.includes(linkId),
      selected: this.state.selectedLinks.includes(linkId),
      hidden: this.state.hiddenLinks.includes(linkId),
      hovered: this.isHoveredLink(linkId),
    }
  }

  // ============ 通用方法 ============

  /**
   * 获取所有状态
   */
  getState(): StateInfo {
    return {
      highlightNodes: [...this.state.highlightNodes],
      highlightLinks: [...this.state.highlightLinks],
      selectedNodes: [...this.state.selectedNodes],
      selectedLinks: [...this.state.selectedLinks],
      hiddenNodes: [...this.state.hiddenNodes],
      hiddenLinks: [...this.state.hiddenLinks],
      rootNodes: [...this.state.rootNodes],
      hoveredNodes: [...this.state.hoveredNodes],
      hoveredLinks: [...this.state.hoveredLinks],
    }
  }

  /**
   * 批量更新状态
   */
  updateState(config: StateConfig): void {
    let changed = false

    if (config.highlightNodes !== undefined) {
      this.state.highlightNodes = [...new Set(config.highlightNodes)]
      changed = true
    }

    if (config.highlightLinks !== undefined) {
      this.state.highlightLinks = [...new Set(config.highlightLinks)]
      changed = true
    }

    if (config.selectedNodes !== undefined) {
      this.state.selectedNodes = [...new Set(config.selectedNodes)]
      changed = true
    }

    if (config.selectedLinks !== undefined) {
      this.state.selectedLinks = [...new Set(config.selectedLinks)]
      changed = true
    }

    if (config.hiddenNodes !== undefined) {
      this.state.hiddenNodes = [...new Set(config.hiddenNodes)]
      changed = true
    }

    if (config.hiddenLinks !== undefined) {
      this.state.hiddenLinks = [...new Set(config.hiddenLinks)]
      changed = true
    }

    if (config.rootNodes !== undefined) {
      this.state.rootNodes = [...new Set(config.rootNodes)]
      changed = true
    }

    if (changed) {
      // 发布各类事件
      if (
        config.highlightNodes !== undefined ||
        config.highlightLinks !== undefined
      ) {
        this.events.publish("highlightChange", {
          nodeIds: this.state.highlightNodes,
          linkIds: this.state.highlightLinks,
        })
      }

      if (
        config.selectedNodes !== undefined ||
        config.selectedLinks !== undefined
      ) {
        this.events.publish("selectionChange", {
          nodeIds: this.state.selectedNodes,
          linkIds: this.state.selectedLinks,
        })
      }

      if (
        config.hiddenNodes !== undefined ||
        config.hiddenLinks !== undefined
      ) {
        this.events.publish("hiddenChange", {
          nodeIds: this.state.hiddenNodes,
          linkIds: this.state.hiddenLinks,
        })
      }

      if (config.rootNodes !== undefined) {
        this.events.publish("rootNodesChange", {
          nodeIds: this.state.rootNodes,
        })
      }

      this.publishMetaDataChange()
    }
  }

  /**
   * 重置所有状态
   */
  reset(): void {
    this.state = {
      highlightNodes: [],
      highlightLinks: [],
      selectedNodes: [],
      selectedLinks: [],
      hiddenNodes: [],
      hiddenLinks: [],
      rootNodes: [],
      hoveredNodes: [],
      hoveredLinks: [],
    }

    this.events.publish("highlightChange", { nodeIds: [], linkIds: [] })
    this.events.publish("selectionChange", { nodeIds: [], linkIds: [] })
    this.events.publish("hiddenChange", { nodeIds: [], linkIds: [] })
    this.events.publish("rootNodesChange", { nodeIds: [] })
    this.publishMetaDataChange()
  }

  /**
   * 发布元数据变化事件
   */
  private publishMetaDataChange(): void {
    this.events.publish("metaDataChange", {
      metaData: this.getState(),
    })
  }
}
