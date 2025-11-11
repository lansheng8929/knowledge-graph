import type {
  GraphNode,
  GraphLink,
  NodeId,
  LinkId,
  GraphViewModel,
} from "../type"

// 定义事件类型
export interface GraphEventMap {
  nodeHover: GraphNode | undefined
  nodeClick: GraphNode | undefined
  nodeDragEnd: GraphNode | undefined
  linkClick: GraphLink | undefined
  backgroundClick: void
  zoom: { k: number; x: number; y: number }
  focusChange: { nodeIds: NodeId[]; linkIds: LinkId[] }
  selectionChange: { nodeIds: NodeId[]; linkIds: LinkId[] }
  hiddenChange: { nodeIds: NodeId[]; linkIds: LinkId[] }
  loadMore: GraphNode
  menuOpen: {
    node: GraphNode
    screenPos: { x: number; y: number }
    event: MouseEvent
  }
  dataChange: { cache: GraphViewModel }
  framePost: {
    ctx: CanvasRenderingContext2D
    globalScale: number
    cache: GraphViewModel
  }
}

// 事件订阅器类型
type EventSubscriber<T = unknown> = (data: T) => void

// 取消订阅函数类型
type UnsubscribeFunction = () => void

export class ConnGraphEvents {
  private subscribers = new Map<string, Set<EventSubscriber>>()

  /**
   * 订阅事件
   * @param eventType 事件类型
   * @param subscriber 事件处理函数
   * @returns 取消订阅的函数
   */
  subscribe<K extends keyof GraphEventMap>(
    eventType: K,
    subscriber: EventSubscriber<GraphEventMap[K]>
  ): UnsubscribeFunction {
    const eventKey = String(eventType)
    if (!this.subscribers.has(eventKey)) {
      this.subscribers.set(eventKey, new Set())
    }

    const subscriberSet = this.subscribers.get(eventKey)!
    subscriberSet.add(subscriber as EventSubscriber)

    // 返回取消订阅的函数
    return () => {
      subscriberSet.delete(subscriber as EventSubscriber)
      if (subscriberSet.size === 0) {
        this.subscribers.delete(eventKey)
      }
    }
  }

  /**
   * 发布事件
   * @param eventType 事件类型
   * @param data 事件数据
   */
  publish<K extends keyof GraphEventMap>(
    eventType: K,
    data: GraphEventMap[K]
  ): void {
    const eventKey = String(eventType)
    const subscriberSet = this.subscribers.get(eventKey)
    if (!subscriberSet) return

    subscriberSet.forEach((subscriber) => {
      try {
        subscriber(data)
      } catch (error) {
        console.error(
          `Error in event subscriber for ${String(eventType)}:`,
          error
        )
      }
    })
  }

  /**
   * 取消订阅指定事件类型的所有订阅者
   * @param eventType 事件类型
   */
  unsubscribeAll<K extends keyof GraphEventMap>(eventType: K): void {
    const eventKey = String(eventType)
    this.subscribers.delete(eventKey)
  }

  /**
   * 清除所有事件订阅
   */
  clear(): void {
    this.subscribers.clear()
  }

  /**
   * 获取指定事件类型的订阅者数量
   * @param eventType 事件类型
   * @returns 订阅者数量
   */
  getSubscriberCount<K extends keyof GraphEventMap>(eventType: K): number {
    const eventKey = String(eventType)
    const subscriberSet = this.subscribers.get(eventKey)
    return subscriberSet ? subscriberSet.size : 0
  }

  /**
   * 获取所有已订阅的事件类型
   * @returns 事件类型数组
   */
  getSubscribedEvents(): string[] {
    return Array.from(this.subscribers.keys())
  }

  /**
   * 检查是否有订阅者订阅了指定事件
   * @param eventType 事件类型
   * @returns 是否有订阅者
   */
  hasSubscribers<K extends keyof GraphEventMap>(eventType: K): boolean {
    return this.getSubscriberCount(eventType) > 0
  }
}
