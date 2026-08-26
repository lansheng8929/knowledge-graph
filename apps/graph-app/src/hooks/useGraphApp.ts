import {
  useRef,
  useEffect,
  useState,
  useCallback,
  type MouseEvent,
} from "react"
import {
  GraphModel,
  GraphView,
  DefaultRenderPlugin,
  type GraphViewOptions,
} from "@lansheng/knowledge-graph"
import type { AppGraphDataGenerics, MyGraphView } from "../graph-types"
import {
  createDefaultNodeStyle,
  createPhoneStyle,
  createAddressStyle,
  createAccountStyle,
  createCompanyStyle,
  createIpStyle,
  createDeviceStyle,
  createPersonStyle,
} from "../nodes"
import { createDefaultLinkStyle } from "../links/default/style"
import { MetadataManager } from "@lansheng/knowledge-graph/meta-manager"
import { HistoryManager } from "@lansheng/knowledge-graph/history-manager"

/** 阻塞直到模拟停止：velocity 稳定判定或 alphaMin 触发 onEnd 才结束；timeoutMs 仅作安全兜底（正常不会走到） */
function settleOnce(view: MyGraphView, timeoutMs = 15000): Promise<void> {
  return new Promise<void>((resolve) => {
    let settled = false
    let timer: ReturnType<typeof setTimeout> | undefined
    const finish = (): void => {
      if (settled) return
      settled = true
      if (timer) clearTimeout(timer)
      if (view.layout.onEnd === onSettled) view.layout.onEnd = undefined
      resolve()
    }
    const onSettled = (): void => finish()
    view.layout.onEnd = onSettled
    timer = setTimeout(finish, timeoutMs)
  })
}
import type {
  GraphViewModel,
  GraphNode,
  GraphLink,
  DefaultGraphDataGenerics,
} from "@lansheng/knowledge-graph/client/type"
import {
  type ExpansionFetcher,
  type ExpansionResponse,
  ExpansionService,
} from "../expansion-service"
import { useTheme } from "./useTheme"
import { getPalette, type Theme } from "../theme"
import { applyIcons, applyIcon } from "../icon-map"
import { linkEndpoints } from "../link-utils"
import { graphApi } from "../api/client"
import { RenderTaskQueue } from "./render-task-queue"
import {
  BASE_FORCE_CONFIG,
  INTIMACY_INFLUENCE_DEFAULT,
  buildIntimacyFns,
} from "../physics-config"

interface InitResponse {
  graphData: GraphViewModel<DefaultGraphDataGenerics>["graphData"]
}

/** 一个渲染任务：待入图的节点 + 边（边端点是否就绪由 worker 裁决） */
interface RenderTask {
  nodes: GraphNode[]
  links: GraphLink[]
}

export function useGraphApp(ids?: string[]) {
  // 画布内直接通过 useTheme 读取当前主题
  const { theme } = useTheme()

  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const modelRef = useRef<GraphModel>(
    new GraphModel({ initData: { graphData: { nodes: [], links: [] } } }),
  )
  const viewRef = useRef<MyGraphView | null>(null)
  /** 加载纪元：每次开始加载/组件卸载时递增，旧渲染循环据此退出（任务队列取消） */
  const loadEpochRef = useRef(0)
  const historyManagerRef = useRef<HistoryManager>(new HistoryManager())
  const expansionRef = useRef<ExpansionService | null>(null)

  const [loading, setLoading] = useState(true)
  const [initError, setInitError] = useState<string | null>(null)
  const [snapshotPanelOpen, setSnapshotPanelOpen] = useState(false)
  const [legendPanelOpen, setLegendPanelOpen] = useState(false)
  const [miniMapOpen, setMiniMapOpen] = useState(false)
  const [analysisPanelOpen, setAnalysisPanelOpen] = useState(false)
  const [analysisTarget, setAnalysisTarget] = useState<{
    ids: string[]
    labels: string[]
  } | null>(null)

  // 亲密度→吸引力影响系数（引力面板调节）
  const [intimacyInfluence, setIntimacyInfluence] = useState(
    INTIMACY_INFLUENCE_DEFAULT,
  )
  const [physicsPanelOpen, setPhysicsPanelOpen] = useState(false)
  // init 流式加载进度（loading overlay 显示）
  const [loadProgress, setLoadProgress] = useState<{
    nodes: number
    links: number
    total?: number
  } | null>(null)

  // 流式图数据加载
  const streamInitData = useCallback(
    async (
      ids: string[],
      onProgress?: (p: {
        nodes: number
        links: number
        total?: number
      }) => void,
    ) => {
      const model = modelRef.current
      const nodes: GraphNode[] = [] // 全量节点（历史记录用）
      const links: GraphLink[] = [] // 全量边（历史记录用）
      // ── 任务队列参数 ──
      const BATCH = 500 // 任务粒度：攒够多少个节点/边算一个渲染任务
      const FAST_SETTLE_MS = 8000 // 中间任务：等模拟停止的安全兜底（正常由 onEnd 结束）
      const FINAL_SETTLE_MS = 15000 // 最终任务：等模拟停止的安全兜底（更大余量）
      let total: number | undefined
      const report = () =>
        onProgress?.({ nodes: nodes.length, links: links.length, total })

      const view = viewRef.current
      // 本次加载的纪元：新加载/组件卸载会使 epoch 递增，旧队列据此停止（取消）
      const epoch = ++loadEpochRef.current
      const isCancelled = (): boolean =>
        epoch !== loadEpochRef.current || !viewRef.current

      // ── 渲染累积状态（跨任务共享；队列串行消费，无并发写） ──
      const cur = model.getGraphModelData().graphData
      let inModel: GraphNode[] = cur.nodes
      let inLinks: GraphLink[] = cur.links
      const modelIds = new Set(inModel.map((n) => n.id))
      let pendingLinks: GraphLink[] = []

      // ── 任务队列：worker 定义单个渲染任务，队列负责调度/串行/取消 ──
      const queue = new RenderTaskQueue<RenderTask>(
        // 单个渲染任务：入图 → 立即取景 → 快速模拟 → 限时稳定 → 精修取景
        async (task, isFinal) => {
          if (isCancelled()) return
          task.nodes.forEach((n) => modelIds.add(n.id))
          // 端点已入图的边随本任务渲染，其余延后（避免 forceLink 找不到节点）
          const ready: GraphLink[] = []
          const rest: GraphLink[] = []
          for (const l of pendingLinks) {
            const [s, t] = linkEndpoints(l)
            if (modelIds.has(s) && modelIds.has(t)) ready.push(l)
            else rest.push(l)
          }
          pendingLinks = [...rest, ...task.links]
          inModel = [...inModel, ...task.nodes]
          inLinks = [...inLinks, ...ready]
          model.updateGraphData({
            graphData: { nodes: inModel, links: inLinks },
          })
          if (view && !isCancelled()) {
            view.layout.reheat(0.15)
            // 阻塞：直到模拟完全停止（onEnd）才继续
            await settleOnce(view, isFinal ? FINAL_SETTLE_MS : FAST_SETTLE_MS)
            // 阻塞：直到取景（含过渡动画）完成才继续
            await view.fitView(40)
          }
          // 渲染阶段进度 = 已入图的计数
          onProgress?.({ nodes: inModel.length, links: inLinks.length, total })
        },
        isCancelled, // 停止谓词：纪元变化/视图销毁时队列自行退出
      )

      // ── 生产者：接收流，攒批入队（不阻塞流接收） ──
      onProgress?.({ nodes: 0, links: 0, total })
      let pendingBatch: RenderTask = { nodes: [], links: [] }
      await graphApi.initStream(ids, (chunk) => {
        if (chunk.type === "meta") {
          total = chunk.total
          onProgress?.({ nodes: 0, links: 0, total })
        } else if (chunk.type === "node") {
          const n = chunk.data as unknown as GraphNode
          applyIcon(n)
          nodes.push(n)
          pendingBatch.nodes.push(n)
        } else if (chunk.type === "link") {
          const l = chunk.data as unknown as GraphLink
          links.push(l)
          pendingBatch.links.push(l)
        }
        if (pendingBatch.nodes.length + pendingBatch.links.length >= BATCH) {
          queue.enqueue(pendingBatch)
          pendingBatch = { nodes: [], links: [] }
        }
      })

      // ── 流结束：flush 残余批 → 声明完成 → 等队列收尾 ──
      if (pendingBatch.nodes.length > 0 || pendingBatch.links.length > 0) {
        queue.enqueue(pendingBatch)
      }
      queue.close()
      await queue.waitDone()

      // 残余边（端点全部已入图）：最终充分稳定后取景
      if (!isCancelled() && pendingLinks.length > 0) {
        const ready = pendingLinks.filter((l) => {
          const [s, t] = linkEndpoints(l)
          return modelIds.has(s) && modelIds.has(t)
        })
        if (ready.length > 0) {
          inLinks = [...inLinks, ...ready]
          model.updateGraphData({
            graphData: { nodes: inModel, links: inLinks },
          })
          if (view && !isCancelled()) {
            view.layout.reheat(0.15)
            await settleOnce(view, FINAL_SETTLE_MS)
            await view.fitView(40)
          }
        }
      }

      report()
      return { graphData: { nodes, links } } as InitResponse
    },
    [],
  )

  // 流式 expand
  const expansionFetcher: ExpansionFetcher = useCallback(async (request) => {
    const model = modelRef.current
    const view = viewRef.current
    const nodes: ExpansionResponse["nodes"] = []
    const links: ExpansionResponse["links"] = []
    // 画布已有节点 + 本次流式收集的新节点（只增不减）
    const knownIds = new Set<string>(
      model.getGraphModelData().graphData.nodes.map((n) => n.id),
    )
    const pendingLinks: ExpansionResponse["links"] = []
    const BATCH = 50
    let batchNodes: ExpansionResponse["nodes"] = []
    let batchLinks: ExpansionResponse["links"] = []
    let acc = 0

    const linkReady = (l: ExpansionResponse["links"][number]): boolean => {
      const [s, t] = linkEndpoints(l)
      return knownIds.has(s) && knownIds.has(t)
    }
    const drainPending = () => {
      let i = pendingLinks.length
      while (i--) {
        const l = pendingLinks[i]
        if (linkReady(l)) {
          pendingLinks.splice(i, 1)
          links.push(l)
          batchLinks.push(l)
        }
      }
    }
    const flush = () => {
      drainPending()
      if (!batchNodes.length && !batchLinks.length) return
      const cur = model.getGraphModelData().graphData
      const existNodeIds = new Set(cur.nodes.map((n) => n.id))
      const existLinkIds = new Set(cur.links.map((l) => l.id))
      const newNodes = batchNodes.filter((n) => !existNodeIds.has(n.id))
      const newLinks = batchLinks.filter((l) => !existLinkIds.has(l.id))
      if (newNodes.length || newLinks.length) {
        model.updateGraphData({
          graphData: {
            nodes: [...cur.nodes, ...newNodes],
            links: [...cur.links, ...newLinks],
          },
        })
      }
      batchNodes = []
      batchLinks = []
    }
    await graphApi.expandStream(request, (chunk) => {
      if (chunk.type === "node") {
        const n = chunk.data as unknown as ExpansionResponse["nodes"][number]
        applyIcon(n)
        nodes.push(n)
        knownIds.add(n.id)
        batchNodes.push(n)
        drainPending()
      } else if (chunk.type === "link") {
        const l = chunk.data as unknown as ExpansionResponse["links"][number]
        if (linkReady(l)) {
          links.push(l)
          batchLinks.push(l)
        } else {
          pendingLinks.push(l)
        }
      }
      if (++acc >= BATCH) {
        acc = 0
        flush()
      }
    })
    flush()
    view?.reheat(0.5)
    return { nodes, links, total: nodes.length }
  }, [])

  // 初始化
  useEffect(() => {
    if (!containerRef.current) return
    const model = modelRef.current

    const graphView = new GraphView<AppGraphDataGenerics>({
      container: containerRef.current,
      graphModel: model,
      arrowDisplay: true,
      runtimeTheme: theme,
      backgroundColor: getPalette(theme).canvas,
      // 缩放配置（库不内置默认，全部外部传入；以下为原硬编码行为：5%/格，0.03~10，fit 上限 2）
      zoom: { step: 0.05, min: 0.03, max: 10, fitMax: 2 },
      forceConfig: {
        ...BASE_FORCE_CONFIG,
        ...buildIntimacyFns(INTIMACY_INFLUENCE_DEFAULT),
      },
      theme: {
        node: {
          default: (node, t) => createDefaultNodeStyle(node, t as Theme),
          person: (node, t) => createPersonStyle(node, t as Theme),
          phone: (node, t) => createPhoneStyle(node, t as Theme),
          address: (node, t) => createAddressStyle(node, t as Theme),
          account: (node, t) => createAccountStyle(node, t as Theme),
          company: (node, t) => createCompanyStyle(node, t as Theme),
          ip: (node, t) => createIpStyle(node, t as Theme),
          device: (node, t) => createDeviceStyle(node, t as Theme),
        },
        link: new Proxy(
          {
            default: (_link: unknown, t: unknown) =>
              createDefaultLinkStyle(t as Theme),
          },
          {
            get: (target, key) =>
              (target as Record<PropertyKey, unknown>)[key] ??
              (target as Record<PropertyKey, unknown>).default,
          },
        ) as unknown as NonNullable<
          GraphViewOptions<AppGraphDataGenerics>["theme"]
        >["link"],
      },
      renderPlugin: (gl, canvas) =>
        new DefaultRenderPlugin<AppGraphDataGenerics>({
          gl,
          canvas,
          width: containerRef.current!.clientWidth,
          height: containerRef.current!.clientHeight,
          pickerMode: "gpu",
          onPlusClick: (nodeId) => {
            const node = model.getNodeById(nodeId)
            if (node) model.events.publish("plusToolClick", node)
          },
        }),
    })
    viewRef.current = graphView

    expansionRef.current = new ExpansionService({
      model,
      metadataManager: new MetadataManager(),
      loadingManager: model.loadingManager,
      historyManager: historyManagerRef.current,
      fetcher: expansionFetcher,
      getContext: () => {
        const t = graphView.renderer?.interaction?.transform
        return {
          camera: t ? { x: t.x, y: t.y, k: t.k } : undefined,
          state: model.stateManager.getState(),
        }
      },
    })

    setLoading(false)

    return () => {
      graphView.destroy()
      viewRef.current = null
      loadEpochRef.current += 1 // 终止仍在运行的旧渲染循环
    }
  }, [])

  // 主题切换
  useEffect(() => {
    const view = viewRef.current
    if (!view) return
    view.setRuntimeTheme(theme)
    view.renderer.setBackgroundColor?.(getPalette(theme).canvas)
  }, [theme])

  // ids 变化
  useEffect(() => {
    const model = modelRef.current
    ;(async () => {
      if (!ids?.length) return

      try {
        setLoadProgress({ nodes: 0, links: 0 })
        const initData = await streamInitData(ids ?? [], (p) =>
          setLoadProgress(p),
        )
        setLoadProgress(null)
        historyManagerRef.current.pushState({
          type: "init",
          description: "初始图谱",
          state: {
            graphData: structuredClone(initData.graphData),
            customData: { state: model.stateManager.getState() },
          },
        })
      } catch (err) {
        setLoadProgress(null)
        setInitError(err instanceof Error ? err.message : String(err))
      }
    })()
  }, [ids, streamInitData])

  // 快照操作
  const handleTakeSnapshot = useCallback(() => {
    const model = modelRef.current
    const view = viewRef.current
    const hm = historyManagerRef.current
    const graphData = structuredClone(model.getGraphModelData().graphData)
    let camera: { x: number; y: number; k: number } | undefined
    if (view) {
      const t = (view as any).renderer?.interaction?.transform
      if (t) camera = { x: t.x, y: t.y, k: t.k }
    }
    hm.pushState({
      type: "snapshot",
      description: `快照 ${new Date().toLocaleTimeString()}`,
      state: {
        graphData,
        customData: { camera, state: model.stateManager.getState() },
      },
    })
  }, [])

  const handleJumpToSnapshot = useCallback((index: number) => {
    const model = modelRef.current
    const view = viewRef.current
    const hm = historyManagerRef.current
    const action = hm.getAction(index)
    if (!action) return

    model.updateGraphData({
      graphData: structuredClone(action.state.graphData as any),
    })
    const customData = action.state.customData as
      | { camera?: { x: number; y: number; k: number }; state?: any }
      | undefined
    if (customData?.state) {
      const s = customData.state
      if (s.highlightNodes?.length)
        model.stateManager.setHighlightNodes(s.highlightNodes, s.highlightLinks)
      else model.stateManager.clearHighlightNodes()
      if (s.selectedNodes?.length)
        model.stateManager.setSelectedNodes(s.selectedNodes, s.selectedLinks)
      else model.stateManager.clearSelection()
      if (s.hiddenNodes?.length)
        model.stateManager.setHiddenNodes(s.hiddenNodes, s.hiddenLinks)
      else model.stateManager.showAll()
      if (s.rootNodes?.length) model.stateManager.setRootNodes(s.rootNodes)
      else model.stateManager.clearRootNodes()
    }
    if (customData?.camera && view) {
      const t = (view as any).renderer?.interaction?.transform
      if (t) {
        t.x = customData.camera.x
        t.y = customData.camera.y
        t.k = customData.camera.k
      }
    }
    hm.jumpTo(index)
    view?.reheat(0.3)
  }, [])

  const handleDeleteSnapshot = useCallback((index: number) => {
    historyManagerRef.current.deleteEntry(index)
  }, [])

  const handleToggleSnapshotPanel = useCallback(() => {
    setSnapshotPanelOpen((v) => !v)
  }, [])

  // 调节亲密度→吸引力影响系数并重排（引力面板滑块）
  const applyIntimacyInfluence = useCallback((influence: number) => {
    setIntimacyInfluence(influence)
    viewRef.current?.updatePhysics(buildIntimacyFns(influence))
    viewRef.current?.reheat(0.5)
  }, [])

  const restoreFromHistory = useCallback(
    (action: ReturnType<HistoryManager["goBackSkipType"]>) => {
      const model = modelRef.current
      const view = viewRef.current
      if (!action) return
      model.updateGraphData({
        graphData: structuredClone(action.graphData as any),
      })
      const cd = action.customData as any
      if (cd?.state) {
        const s = cd.state
        if (s.highlightNodes?.length)
          model.stateManager.setHighlightNodes(
            s.highlightNodes,
            s.highlightLinks,
          )
        else model.stateManager.clearHighlightNodes()
        if (s.selectedNodes?.length)
          model.stateManager.setSelectedNodes(s.selectedNodes, s.selectedLinks)
        else model.stateManager.clearSelection()
        if (s.hiddenNodes?.length)
          model.stateManager.setHiddenNodes(s.hiddenNodes, s.hiddenLinks)
        else model.stateManager.showAll()
        if (s.rootNodes?.length) model.stateManager.setRootNodes(s.rootNodes)
        else model.stateManager.clearRootNodes()
      }
      if (cd?.camera && view) {
        const t = (view as any).renderer?.interaction?.transform
        if (t) {
          t.x = cd.camera.x
          t.y = cd.camera.y
          t.k = cd.camera.k
        }
      }
      view?.reheat(0.3)
    },
    [],
  )

  const handleUndo = useCallback(() => {
    const hm = historyManagerRef.current
    const state = hm.goBackSkipType("snapshot")
    restoreFromHistory(state)
  }, [restoreFromHistory])

  const handleRedo = useCallback(() => {
    const hm = historyManagerRef.current
    const state = hm.goForwardSkipType("snapshot")
    restoreFromHistory(state)
  }, [restoreFromHistory])

  // 当前影响系数对应的亲密度力函数（树形切换重建力导向时复用）
  const intimacyForceFns = buildIntimacyFns(intimacyInfluence)

  return {
    containerRef,
    modelRef,
    viewRef,
    historyManagerRef,
    expansionRef,
    ctx: {
      mousePos,
      setMousePos,
      loading,
      initError,
      snapshotPanelOpen,
      setSnapshotPanelOpen,
      legendPanelOpen,
      setLegendPanelOpen,
      miniMapOpen,
      setMiniMapOpen,
      analysisPanelOpen,
      setAnalysisPanelOpen,
      analysisTarget,
      setAnalysisTarget,
      handleTakeSnapshot,
      handleJumpToSnapshot,
      handleDeleteSnapshot,
      handleToggleSnapshotPanel,
      handleUndo,
      handleRedo,
      // 亲密度→吸引力调节
      physicsPanelOpen,
      setPhysicsPanelOpen,
      intimacyInfluence,
      applyIntimacyInfluence,
      intimacyForceFns,
      // init 流式进度
      loadProgress,
    },
  }
}
