/**
 * 图谱状态历史管理器（HistoryManager）
 *
 * 提供撤销/重做功能，保存每次操作时的图谱快照。
 * 不依赖 React，纯 TypeScript 实现。
 */

export interface HistoryState<TGraphData = unknown> {
  /** 图数据快照 */
  graphData: TGraphData
  /** 可选的自定义数据 */
  customData?: unknown
}

export interface HistoryAction {
  /** 操作类型标识 */
  type: string
  /** 时间戳 */
  timestamp: number
  /** 可读描述 */
  description: string
  /** 状态快照 */
  state: HistoryState
}

export class HistoryManager {
  private history: HistoryAction[] = []
  private currentIndex = -1
  readonly maxSize: number

  constructor(options?: {
    initialHistory?: HistoryAction[]
    maxSize?: number
  }) {
    this.maxSize = options?.maxSize ?? 50
    if (options?.initialHistory && options.initialHistory.length > 0) {
      this.history = options.initialHistory.map((h) => ({ ...h }))
      this.currentIndex = this.history.length - 1
    }
  }

  /** 添加新的历史记录（截断后续记录） */
  pushState(action: Omit<HistoryAction, "timestamp">): HistoryAction {
    const entry: HistoryAction = { ...action, timestamp: Date.now() }

    // 截断：当前位置之后的所有记录被覆盖
    this.history = this.history.slice(0, this.currentIndex + 1)
    this.history.push(entry)

    // 超出上限时移除最旧的
    if (this.history.length > this.maxSize) {
      this.history.shift()
    } else {
      this.currentIndex++
    }

    return entry
  }

  /** 是否可以撤销 */
  get canGoBack(): boolean {
    return this.currentIndex > 0
  }

  /** 是否可以重做 */
  get canGoForward(): boolean {
    return this.currentIndex < this.history.length - 1
  }

  /** 获取当前状态 */
  get currentState(): HistoryState | undefined {
    if (this.currentIndex < 0 || this.currentIndex >= this.history.length) {
      return undefined
    }
    return this.history[this.currentIndex].state
  }

  /** 获取当前索引 */
  get cursor(): number {
    return this.currentIndex
  }

  /** 获取历史记录总数 */
  get length(): number {
    return this.history.length
  }

  /**
   * 撤销（向后一步），返回新的当前状态
   * @returns 新的 HistoryState，若无历史则返回 undefined
   */
  goBack(): HistoryState | undefined {
    if (!this.canGoBack) return undefined
    this.currentIndex--
    return this.currentState
  }

  /**
   * 重做（向前一步），返回新的当前状态
   * @returns 新的 HistoryState，若已在最新则返回 undefined
   */
  goForward(): HistoryState | undefined {
    if (!this.canGoForward) return undefined
    this.currentIndex++
    return this.currentState
  }

  /** 清空所有历史 */
  clear(): void {
    this.history = []
    this.currentIndex = -1
  }
}
