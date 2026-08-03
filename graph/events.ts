import type { NodeId, LinkId } from "./type"
import type { Tag, TagTargetType } from "./tag-manager"
import type { StateInfo } from "./state-manager"
import type {
  GraphNode,
  GraphLink,
  GraphViewModel,
  GraphDataGenerics,
  DefaultGraphDataGenerics,
} from "./client/type"
// 定义事件类型
export interface GraphEventMap<
  G extends GraphDataGenerics = DefaultGraphDataGenerics,
> {
  nodeHover: GraphNode<G["NO"], G["NT"], G["NS"]> | null
  nodeClick: GraphNode<G["NO"], G["NT"], G["NS"]> | null
  nodeDragEnd: GraphNode<G["NO"], G["NT"], G["NS"]> | null
  nodeRightClick: {
    node: GraphNode<G["NO"], G["NT"], G["NS"]>
    screenPos: { x: number; y: number }
    event: MouseEvent
  }
  nodeContextStart: {
    node: GraphNode<G["NO"], G["NT"], G["NS"]>
    /** 节点中心屏幕坐标（canvas 本地） */
    screenPos: { x: number; y: number }
    /** 节点屏幕半径（= 碰撞半径 × 缩放，单位像素） */
    radius: number
    /** 当前缩放比例（每 1 图谱单位对应的屏幕像素） */
    zoomScale: number
    event: MouseEvent
  }
  nodeContextMove: {
    node: GraphNode<G["NO"], G["NT"], G["NS"]>
    /** 当前指针位置（canvas 本地） */
    position: { x: number; y: number }
    event: MouseEvent
  }
  nodeContextEnd: {
    node: GraphNode<G["NO"], G["NT"], G["NS"]>
    /** 结束位置（canvas 本地） */
    position: { x: number; y: number }
    /** 是否被中断（丢失指针/失焦/取消） */
    canceled: boolean
    event: MouseEvent
  }
  linkHover: {
    link: GraphLink<G> | null
    previousLink: GraphLink<G> | null
  }
  linkClick: GraphLink<G> | null
  linkRightClick: {
    link: GraphLink<G>
    screenPos: { x: number; y: number }
    event: MouseEvent
  }
  backgroundClick: MouseEvent
  backgroundRightClick: MouseEvent
  zoom: { k: number; x: number; y: number }

  focusChange: { nodeIds: NodeId[]; linkIds: LinkId[] }
  selectionChange: { nodeIds: NodeId[]; linkIds: LinkId[] }
  hiddenChange: { nodeIds: NodeId[]; linkIds: LinkId[] }
  rootNodesChange: { nodeIds: NodeId[] }
  nodesHoverChange: { nodeIds: NodeId[] }
  linksHoverChange: { linkIds: LinkId[] }
  customStateChange: { dimension: string; nodeIds: NodeId[]; linkIds: LinkId[] }

  loadMore: GraphNode<G["NO"], G["NT"], G["NS"]>
  plusToolClick: GraphNode<G["NO"], G["NT"], G["NS"]>
  menuOpen: {
    node: GraphNode<G["NO"], G["NT"], G["NS"]>
    screenPos: { x: number; y: number }
    event: MouseEvent
  }
  dataChange: { graphData: GraphViewModel<G>["graphData"] }
  metaDataChange: {
    metaData: StateInfo
  }
  framePost: {
    ctx: CanvasRenderingContext2D
    globalScale: number
    cache: GraphViewModel<G>
  }
  tagChange:
    | {
        action: "add" | "update"
        targetId: string
        targetType: TagTargetType
        tag: Tag
      }
    | {
        action: "remove"
        targetId: string
        targetType: TagTargetType
        tag?: Tag
      }
    | {
        action: "clear"
        targetIds?: string[]
        nodeIds?: NodeId[]
        linkIds?: LinkId[]
      }
}

// 事件订阅器类型
type EventSubscriber<T = unknown> = (data: T) => void

// 取消订阅函数类型
type UnsubscribeFunction = () => void

export class ConnGraphEvents<
  G extends GraphDataGenerics = DefaultGraphDataGenerics,
> {
  private subscribers = new Map<string, Set<EventSubscriber>>()

  /**
   * 订阅事件
   * @param eventType 事件类型
   * @param subscriber 事件处理函数
   * @returns 取消订阅的函数
   */
  subscribe<K extends keyof GraphEventMap<G>>(
    eventType: K,
    subscriber: EventSubscriber<GraphEventMap<G>[K]>,
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
  publish<K extends keyof GraphEventMap<G>>(
    eventType: K,
    data: GraphEventMap<G>[K],
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
          error,
        )
      }
    })
  }

  /**
   * 取消订阅指定事件类型的所有订阅者
   * @param eventType 事件类型
   */
  unsubscribeAll<K extends keyof GraphEventMap<G>>(eventType: K): void {
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
  getSubscriberCount<K extends keyof GraphEventMap<G>>(eventType: K): number {
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
  hasSubscribers<K extends keyof GraphEventMap<G>>(eventType: K): boolean {
    return this.getSubscriberCount(eventType as K) > 0
  }
}
