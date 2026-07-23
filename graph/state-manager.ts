import type { ConnGraphEvents } from "./events"
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
  public state: StateInfo
  public events: ConnGraphEvents<G>
  public customDimensionNames = new Set<string>()
  public statePriority: string[] = [
    "hovered",
    "highlighted",
    "selected",
    "hidden",
    "root",
  ]

  constructor(events: ConnGraphEvents<G>) {
    this.events = events
    this.state = {
      focusNodes: [],
      focusLinks: [],
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
   * 设置焦点节点
   */
  setFocusNodes(nodeIds: NodeId[], linkIds?: LinkId[]): void {
    this.state.focusNodes = [...new Set(nodeIds)]
    this.state.focusLinks = linkIds ? [...new Set(linkIds)] : []

    this.events.publish("focusChange", {
      nodeIds: this.state.focusNodes,
      linkIds: this.state.focusLinks,
    })

    this.publishMetaDataChange()
  }

  /**
   * 添加焦点节点
   */
  addFocusNodes(nodeIds: NodeId[], linkIds?: LinkId[]): void {
    this.state.focusNodes = [...new Set([...this.state.focusNodes, ...nodeIds])]
    if (linkIds) {
      this.state.focusLinks = [
        ...new Set([...this.state.focusLinks, ...linkIds]),
      ]
    }

    this.events.publish("focusChange", {
      nodeIds: this.state.focusNodes,
      linkIds: this.state.focusLinks,
    })

    this.publishMetaDataChange()
  }

  /**
   * 移除焦点节点
   */
  removeFocusNodes(nodeIds: NodeId[]): void {
    const nodeIdSet = new Set(nodeIds)
    this.state.focusNodes = this.state.focusNodes.filter(
      (id) => !nodeIdSet.has(id),
    )

    this.events.publish("focusChange", {
      nodeIds: this.state.focusNodes,
      linkIds: this.state.focusLinks,
    })

    this.publishMetaDataChange()
  }

  /**
   * 清空焦点
   */
  clearFocus(): void {
    this.state.focusNodes = []
    this.state.focusLinks = []

    this.events.publish("focusChange", {
      nodeIds: [],
      linkIds: [],
    })

    this.publishMetaDataChange()
  }

  /**
   * 获取焦点节点
   */
  getFocusNodes(): NodeId[] {
    return [...this.state.focusNodes]
  }

  /**
   * 获取焦点连线
   */
  getFocusLinks(): LinkId[] {
    return [...this.state.focusLinks]
  }

  /**
   * 判断节点是否在焦点中
   */
  isFocused(nodeId: NodeId): boolean {
    return this.state.focusNodes.includes(nodeId)
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
    focused: boolean
    selected: boolean
    hidden: boolean
    hovered: boolean
    root: boolean
  } {
    return {
      focused: this.isFocused(nodeId),
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
    focused: boolean
    selected: boolean
    hidden: boolean
    hovered: boolean
  } {
    return {
      focused: this.state.focusLinks.includes(linkId),
      selected: this.state.selectedLinks.includes(linkId),
      hidden: this.state.hiddenLinks.includes(linkId),
      hovered: this.isHoveredLink(linkId),
    }
  }

  // ============ 自定义维度 ============

  /**
   * 注册一个新的状态维度（如 "boxSelected"），直接融合到 this.state 中
   */
  registerDimension(name: string): void {
    this.state[`${name}Nodes`] = []
    this.state[`${name}Links`] = []
    this.customDimensionNames.add(name)
    if (!this.statePriority.includes(name)) {
      this.statePriority.push(name)
    }
  }

  /**
   * 设置状态渲染优先级顺序
   */
  setStatePriority(priority: string[]): void {
    this.statePriority = priority
  }

  setDimensionNodes(name: string, nodeIds: NodeId[], linkIds?: LinkId[]): void {
    this.state[`${name}Nodes`] = [...new Set(nodeIds)]
    this.state[`${name}Links`] = linkIds ? [...new Set(linkIds)] : []
    this.publishDimensionChange(name)
    this.publishMetaDataChange()
  }

  addDimensionNodes(name: string, nodeIds: NodeId[], linkIds?: LinkId[]): void {
    const key = `${name}Nodes`
    const linkKey = `${name}Links`
    const curNodes = (this.state[key] ?? []) as NodeId[]
    const curLinks = (this.state[linkKey] ?? []) as LinkId[]
    this.state[key] = [...new Set([...curNodes, ...nodeIds])]
    if (linkIds) {
      this.state[linkKey] = [...new Set([...curLinks, ...linkIds])]
    }
    this.publishDimensionChange(name)
    this.publishMetaDataChange()
  }

  removeDimensionNodes(name: string, nodeIds: NodeId[]): void {
    const set = new Set(nodeIds)
    const curNodes = (this.state[`${name}Nodes`] ?? []) as NodeId[]
    this.state[`${name}Nodes`] = curNodes.filter((id) => !set.has(id))
    this.publishDimensionChange(name)
    this.publishMetaDataChange()
  }

  clearDimension(name: string): void {
    this.state[`${name}Nodes`] = []
    this.state[`${name}Links`] = []
    this.publishDimensionChange(name)
    this.publishMetaDataChange()
  }

  getDimensionNodes(name: string): NodeId[] {
    return [...(this.state[`${name}Nodes`] ?? [])]
  }

  getDimensionLinks(name: string): LinkId[] {
    return [...(this.state[`${name}Links`] ?? [])]
  }

  isInDimension(nodeId: NodeId, name: string): boolean {
    return (this.state[`${name}Nodes`] ?? []).includes(nodeId)
  }

  private publishDimensionChange(name: string): void {
    this.events.publish("customStateChange", {
      dimension: name,
      nodeIds: [...(this.state[`${name}Nodes`] ?? [])],
      linkIds: [...(this.state[`${name}Links`] ?? [])],
    })
  }

  // ============ 通用方法 ============

  /**
   * 获取所有状态
   */
  getState(): StateInfo {
    const base: StateInfo = {
      focusNodes: [...this.state.focusNodes],
      focusLinks: [...this.state.focusLinks],
      selectedNodes: [...this.state.selectedNodes],
      selectedLinks: [...this.state.selectedLinks],
      hiddenNodes: [...this.state.hiddenNodes],
      hiddenLinks: [...this.state.hiddenLinks],
      rootNodes: [...this.state.rootNodes],
      hoveredNodes: [...this.state.hoveredNodes],
      hoveredLinks: [...this.state.hoveredLinks],
    }
    // 合并自定义维度
    for (const name of this.customDimensionNames) {
      base[`${name}Nodes`] = [...(this.state[`${name}Nodes`] ?? [])]
      base[`${name}Links`] = [...(this.state[`${name}Links`] ?? [])]
    }
    return base
  }

  /**
   * 批量更新状态
   */
  updateState(
    config: StateConfig & Record<string, NodeId[] | undefined>,
  ): void {
    let changed = false

    if (config.focusNodes !== undefined) {
      this.state.focusNodes = [...new Set(config.focusNodes)]
      changed = true
    }

    if (config.focusLinks !== undefined) {
      this.state.focusLinks = [...new Set(config.focusLinks)]
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
      if (config.focusNodes !== undefined || config.focusLinks !== undefined) {
        this.events.publish("focusChange", {
          nodeIds: this.state.focusNodes,
          linkIds: this.state.focusLinks,
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
      focusNodes: [],
      focusLinks: [],
      selectedNodes: [],
      selectedLinks: [],
      hiddenNodes: [],
      hiddenLinks: [],
      rootNodes: [],
      hoveredNodes: [],
      hoveredLinks: [],
    }
    // 重置自定义维度
    for (const name of this.customDimensionNames) {
      this.state[`${name}Nodes`] = []
      this.state[`${name}Links`] = []
    }

    this.events.publish("focusChange", { nodeIds: [], linkIds: [] })
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
