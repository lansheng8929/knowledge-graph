import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { GraphModel, type Options } from "../model"
import { MetadataManager } from "../meta-manager"
import {
  HistoryManager,
  type HistoryAction,
  type HistoryState,
} from "../history-manager"
import { StyleRegistry } from "../style-registry"
import { LinkRegistry } from "./link-registry"
import { EntityRegistry } from "./entity-registry"
import type {
  DefaultGraphDataGenerics,
  GraphDataGenerics,
  GraphNode,
  GraphLink,
  GraphViewModel,
} from "./type"
import type { GraphEventMap } from "../events"

// ==================== 事件处理器类型 ====================

export interface GraphEventHandlers<
  G extends GraphDataGenerics = DefaultGraphDataGenerics,
> {
  onNodeClick?: (event: GraphEventMap<G>["nodeClick"]) => void
  onNodeRightClick?: (event: GraphEventMap<G>["nodeRightClick"]) => void
  onNodeHover?: (event: GraphEventMap<G>["nodeHover"]) => void
  onNodeDragEnd?: (event: GraphEventMap<G>["nodeDragEnd"]) => void
  onLinkClick?: (event: GraphEventMap<G>["linkClick"]) => void
  onLinkRightClick?: (event: GraphEventMap<G>["linkRightClick"]) => void
  onLinkHover?: (event: GraphEventMap<G>["linkHover"]) => void
  onBackgroundClick?: (event: GraphEventMap<G>["backgroundClick"]) => void
  onDataChange?: (event: GraphEventMap<G>["dataChange"]) => void
  onZoom?: (event: GraphEventMap<G>["zoom"]) => void
  onPlusClick?: (event: GraphEventMap<G>["plusToolClick"]) => void
  onTagChange?: (event: GraphEventMap<G>["tagChange"]) => void
}

// ==================== Context 值类型 ====================

export interface GraphContextValue<
  G extends GraphDataGenerics = DefaultGraphDataGenerics,
> {
  /** 数据模型 */
  model: GraphModel<G>
  /** 图数据引用（实时） */
  graphDataRef: React.MutableRefObject<GraphViewModel<G>["graphData"]>
  /** 当前图数据 */
  graphData: GraphViewModel<G>["graphData"]

  // --- 管理器 ---
  /** 状态管理器（focus/select/hide/hover） */
  stateManager: GraphModel<G>["stateManager"]
  /** 标签管理器 */
  tagManager: GraphModel<G>["tagManager"]
  /** 加载状态管理器 */
  loadingManager: GraphModel<G>["loadingManager"]
  /** 样式管理器 */
  styleManager: GraphModel<G>["styleManager"]
  /** 元数据管理器 */
  metadataManager: MetadataManager
  /** 历史管理器 */
  historyManager: HistoryManager

  // --- 注册器 ---
  /** 节点注册器 */
  entityRegistry: EntityRegistry<G>
  /** 边注册器 */
  linkRegistry: LinkRegistry<G>
  /** 样式注册器 */
  styleRegistry: StyleRegistry<G>

  // --- 事件 ---
  /** 设置外部事件处理器 */
  setEventHandlers: (handlers: GraphEventHandlers<G>) => void
}

// ==================== Context ====================

const GraphContext = createContext<GraphContextValue | null>(null)

// ==================== Provider Props ====================

export interface GraphProviderProps<
  G extends GraphDataGenerics = DefaultGraphDataGenerics,
> {
  children: ReactNode
  /** 模型选项（至少需要 initData） */
  options: Options<G>
  /** 可选：外部传入已有模型实例 */
  model?: GraphModel<G>
  /** 事件处理器 */
  eventHandlers?: GraphEventHandlers<G>
  /** 历史管理器选项 */
  historyOptions?: {
    initialHistory?: HistoryAction[]
    maxSize?: number
  }
}

// ==================== Provider ====================

export function GraphProvider<
  G extends GraphDataGenerics = DefaultGraphDataGenerics,
>({
  children,
  options,
  model: externalModel,
  eventHandlers: initialHandlers,
  historyOptions,
}: GraphProviderProps<G>) {
  const [eventHandlers, setEventHandlers] = useState(initialHandlers)

  // --- 懒初始化模型（只创建一次） ---
  const modelRef = useRef<GraphModel<G> | null>(null)
  if (!modelRef.current) {
    modelRef.current = externalModel ?? new GraphModel<G>(options)
  }
  const model = modelRef.current

  // --- 懒初始化管理器 ---
  const managersRef = useRef<{
    metadata: MetadataManager
    history: HistoryManager
    styleRegistry: StyleRegistry<G>
    entityRegistry: EntityRegistry<G>
    linkRegistry: LinkRegistry<G>
  } | null>(null)
  if (!managersRef.current) {
    managersRef.current = {
      metadata: new MetadataManager(),
      history: new HistoryManager(historyOptions),
      styleRegistry: new StyleRegistry<G>(),
      entityRegistry: new EntityRegistry<G>(),
      linkRegistry: new LinkRegistry<G>(),
    }
  }
  const {
    metadata: metadataManager,
    history: historyManager,
    styleRegistry,
    entityRegistry,
    linkRegistry,
  } = managersRef.current

  // --- 派生数据 ---
  const graphModelData = useMemo(() => model.getGraphModelData(), [model])
  const graphData = useMemo(() => graphModelData.graphData, [graphModelData])
  const graphDataRef = useRef(graphData)
  graphDataRef.current = graphData

  // --- 事件订阅 ---
  useEffect(() => {
    const handlers = eventHandlers
    if (!handlers) return
    const unsubs: (() => void)[] = []

    const sub = <K extends keyof GraphEventMap<G>>(
      event: K,
      fn?: (data: GraphEventMap<G>[K]) => void,
    ) => {
      if (fn) unsubs.push(model.events.subscribe(event, fn))
    }

    sub("nodeClick", handlers.onNodeClick)
    sub("nodeRightClick", handlers.onNodeRightClick)
    sub("nodeHover", handlers.onNodeHover)
    sub("nodeDragEnd", handlers.onNodeDragEnd)
    sub("linkClick", handlers.onLinkClick)
    sub("linkRightClick", handlers.onLinkRightClick)
    sub("linkHover", handlers.onLinkHover)
    sub("backgroundClick", handlers.onBackgroundClick)
    sub("dataChange", handlers.onDataChange)
    sub("zoom", handlers.onZoom)
    sub("plusToolClick", handlers.onPlusClick)
    sub("tagChange", handlers.onTagChange)

    return () => unsubs.forEach((fn) => fn())
  }, [model, eventHandlers])

  // --- Context value ---
  const value = useMemo<GraphContextValue<G>>(
    () => ({
      model,
      graphDataRef,
      graphData,

      stateManager: model.stateManager,
      tagManager: model.tagManager,
      loadingManager: model.loadingManager,
      styleManager: model.styleManager,

      metadataManager,
      historyManager,
      styleRegistry,
      entityRegistry,
      linkRegistry,

      setEventHandlers: (h) => setEventHandlers(h),
    }),
    [
      model,
      graphData,
      metadataManager,
      historyManager,
      styleRegistry,
      entityRegistry,
      linkRegistry,
    ],
  )

  return (
    <GraphContext.Provider value={value as unknown as GraphContextValue}>
      {children}
    </GraphContext.Provider>
  )
}

// ==================== Hook ====================

/**
 * 获取图谱上下文（模型 + 所有管理器 + 事件）
 *
 * 必须在 <GraphProvider> 内部使用。
 */
export function useGraph<
  G extends GraphDataGenerics = DefaultGraphDataGenerics,
>(): GraphContextValue<G> {
  const ctx = useContext(GraphContext)
  if (!ctx) {
    throw new Error("useGraph must be used within a <GraphProvider>")
  }
  return ctx as unknown as GraphContextValue<G>
}
