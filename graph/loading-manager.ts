import type { NodeId } from "./type"
import { ConnGraphEvents } from "./client/events"

export interface NodeLoadingState {
  nodeId: NodeId
  loading: boolean
  progress?: number // 0-100
  message?: string
  metadata?: Record<string, any>
}

/**
 * LoadingManager 模型层 - 负责加载状态数据存储和管理
 */
export class LoadingManagerModel {
  private loadingStates: Map<NodeId, NodeLoadingState>
  private events: ConnGraphEvents

  constructor(events: ConnGraphEvents) {
    this.loadingStates = new Map()
    this.events = events
  }

  /**
   * 设置节点加载状态
   */
  setLoading(
    nodeId: NodeId,
    loading: boolean,
    options?: {
      progress?: number
      message?: string
      metadata?: Record<string, any>
    }
  ): NodeLoadingState {
    const loadingState: NodeLoadingState = {
      nodeId,
      loading,
      progress: options?.progress,
      message: options?.message,
      metadata: options?.metadata,
    }

    this.loadingStates.set(nodeId, loadingState)

    // 发布加载状态变化事件
    this.events.publish("loadingChange" as any, {
      nodeId,
      loading,
      state: loadingState,
    })

    return loadingState
  }

  /**
   * 开始加载
   */
  startLoading(
    nodeId: NodeId,
    options?: {
      progress?: number
      message?: string
      metadata?: Record<string, any>
    }
  ): NodeLoadingState {
    return this.setLoading(nodeId, true, options)
  }

  /**
   * 停止加载
   */
  stopLoading(nodeId: NodeId): boolean {
    const state = this.loadingStates.get(nodeId)
    if (!state) return false

    this.setLoading(nodeId, false)
    return true
  }

  /**
   * 更新加载进度
   */
  updateProgress(
    nodeId: NodeId,
    progress: number,
    message?: string
  ): NodeLoadingState | undefined {
    const state = this.loadingStates.get(nodeId)
    if (!state) return undefined

    return this.setLoading(nodeId, state.loading, {
      progress,
      message: message ?? state.message,
      metadata: state.metadata,
    })
  }

  /**
   * 获取节点加载状态
   */
  getLoadingState(nodeId: NodeId): NodeLoadingState | undefined {
    return this.loadingStates.get(nodeId)
  }

  /**
   * 检查节点是否正在加载
   */
  isLoading(nodeId: NodeId): boolean {
    const state = this.loadingStates.get(nodeId)
    return state?.loading ?? false
  }

  /**
   * 获取所有加载状态
   */
  getAllLoadingStates(): NodeLoadingState[] {
    return Array.from(this.loadingStates.values())
  }

  /**
   * 获取所有正在加载的节点ID
   */
  getLoadingNodeIds(): NodeId[] {
    const loadingIds: NodeId[] = []
    for (const [nodeId, state] of this.loadingStates.entries()) {
      if (state.loading) {
        loadingIds.push(nodeId)
      }
    }
    return loadingIds
  }

  /**
   * 批量设置加载状态
   */
  setLoadingForNodes(
    nodeIds: NodeId[],
    loading: boolean,
    options?: {
      progress?: number
      message?: string
      metadata?: Record<string, any>
    }
  ): NodeLoadingState[] {
    const states: NodeLoadingState[] = []

    nodeIds.forEach((nodeId) => {
      const state = this.setLoading(nodeId, loading, options)
      states.push(state)
    })

    return states
  }

  /**
   * 批量开始加载
   */
  startLoadingForNodes(
    nodeIds: NodeId[],
    options?: {
      progress?: number
      message?: string
      metadata?: Record<string, any>
    }
  ): NodeLoadingState[] {
    return this.setLoadingForNodes(nodeIds, true, options)
  }

  /**
   * 批量停止加载
   */
  stopLoadingForNodes(nodeIds: NodeId[]): number {
    let stoppedCount = 0

    nodeIds.forEach((nodeId) => {
      if (this.stopLoading(nodeId)) {
        stoppedCount++
      }
    })

    return stoppedCount
  }

  /**
   * 清除节点加载状态
   */
  clearLoadingState(nodeId: NodeId): boolean {
    return this.loadingStates.delete(nodeId)
  }

  /**
   * 清除所有加载状态
   */
  clearAll(): void {
    const nodeIds = Array.from(this.loadingStates.keys())
    this.loadingStates.clear()

    // 发布清空事件
    this.events.publish("loadingChange" as any, {
      action: "clearAll",
      nodeIds,
    })
  }

  /**
   * 获取正在加载的节点数量
   */
  getLoadingCount(): number {
    let count = 0
    for (const state of this.loadingStates.values()) {
      if (state.loading) {
        count++
      }
    }
    return count
  }

  /**
   * 根据条件筛选加载状态
   */
  filterLoadingStates(
    predicate: (state: NodeLoadingState) => boolean
  ): NodeLoadingState[] {
    return Array.from(this.loadingStates.values()).filter(predicate)
  }

  /**
   * 导出加载状态数据
   */
  export(): NodeLoadingState[] {
    return this.getAllLoadingStates()
  }

  /**
   * 导入加载状态数据
   */
  import(states: NodeLoadingState[]): void {
    this.clearAll()
    states.forEach((state) => {
      this.loadingStates.set(state.nodeId, state)
    })
  }
}

/**
 * LoadingManager - 整合模型层和视图层
 */
export class LoadingManager {
  public readonly model: LoadingManagerModel
  private globalVisible: boolean

  constructor(events: ConnGraphEvents) {
    this.model = new LoadingManagerModel(events)
    this.globalVisible = true // 默认显示所有加载状态
  }

  /**
   * 设置全局加载状态可见性
   */
  setGlobalVisible(visible: boolean): void {
    this.globalVisible = visible
  }

  /**
   * 获取全局加载状态可见性
   */
  getGlobalVisible(): boolean {
    return this.globalVisible
  }

  /**
   * 切换全局加载状态可见性
   */
  toggleGlobalVisible(): boolean {
    this.globalVisible = !this.globalVisible
    return this.globalVisible
  }

  /**
   * 判断节点加载状态是否应该显示
   */
  isLoadingVisible(nodeId: NodeId): boolean {
    if (!this.globalVisible) return false
    return this.model.isLoading(nodeId)
  }

  /**
   * 获取应该显示的加载状态
   */
  getVisibleLoadingStates(): NodeLoadingState[] {
    if (!this.globalVisible) return []
    return this.model.filterLoadingStates((state) => state.loading)
  }

  /**
   * 获取节点的可见加载状态
   */
  getVisibleLoadingState(nodeId: NodeId): NodeLoadingState | undefined {
    if (!this.globalVisible) return undefined
    const state = this.model.getLoadingState(nodeId)
    return state?.loading ? state : undefined
  }
}
