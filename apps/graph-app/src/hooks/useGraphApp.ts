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
import {
  BASE_FORCE_CONFIG,
  INTIMACY_INFLUENCE_DEFAULT,
  buildIntimacyFns,
} from "../physics-config"

interface InitResponse {
  graphData: GraphViewModel<DefaultGraphDataGenerics>["graphData"]
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

  // ── 亲密度→吸引力影响系数（引力面板调节）────────
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

  // ── 流式图数据加载（方案 A：边查边收边渲染）──────

  /** 流式 init：逐节点/边到达时增量 merge 进 model，最后返回完整数据。
   *  边可能先于其端点节点到达（节点/边并行交错）——未就绪的边暂存 pending，
   *  待端点节点到齐后再合并，避免 d3 forceLink 找不到节点抛错导致模拟中断。 */
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
      const nodes: GraphNode[] = []
      const links: GraphLink[] = []
      const nodeIds = new Set<string>()
      const pendingLinks: GraphLink[] = []
      const BATCH = 300
      let batchNodes: GraphNode[] = []
      let batchLinks: GraphLink[] = []
      let acc = 0
      let total: number | undefined
      const report = () =>
        onProgress?.({ nodes: nodes.length, links: links.length, total })

      const linkReady = (l: GraphLink): boolean => {
        const [s, t] = linkEndpoints(l)
        return nodeIds.has(s) && nodeIds.has(t)
      }
      // 把端点已到齐的暂存边移入当前批次
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
        model.updateGraphData({
          graphData: {
            nodes: [...cur.nodes, ...batchNodes],
            links: [...cur.links, ...batchLinks],
          },
        })
        batchNodes = []
        batchLinks = []
      }

      await graphApi.initStream(ids, (chunk) => {
        if (chunk.type === "meta") {
          total = chunk.total
        } else if (chunk.type === "node") {
          const n = chunk.data as unknown as GraphNode
          applyIcon(n)
          nodes.push(n)
          nodeIds.add(n.id)
          batchNodes.push(n)
          drainPending()
          viewRef.current?.fitView(50)
        } else if (chunk.type === "link") {
          const l = chunk.data as unknown as GraphLink
          if (linkReady(l)) {
            links.push(l)
            batchLinks.push(l)
          } else {
            pendingLinks.push(l)
          }
          viewRef.current?.fitView(50)
        }
        if (++acc >= BATCH) {
          acc = 0
          flush()
          report()
        }
      })
      flush()
      report()
      return { graphData: { nodes, links } } as InitResponse
    },
    [],
  )

  /** 流式 expand：边收边 merge 进 model，最后返回完整拓出结果（供历史记录）。
   *  同样延迟处理端点未到齐的边，避免 forceLink 找不到节点抛错。 */
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

  // ─── 初始化 GraphView / ExpansionService ──────
  useEffect(() => {
    if (!containerRef.current) return
    const model = modelRef.current

    const graphView = new GraphView<AppGraphDataGenerics>({
      container: containerRef.current,
      graphModel: model,
      arrowDisplay: true,
      // 主题从外部传入（useTheme），注册 view 时手动配置
      runtimeTheme: theme,
      backgroundColor: getPalette(theme).canvas,
      forceConfig: {
        ...BASE_FORCE_CONFIG,
        // 亲密度→物理拉扯力（影响系数默认 1.2，可经引力面板调节）
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
        // 边的关系类型是后端动态值（USE_DEVICE / CALLED 等），无法静态枚举；
        // 用 Proxy 让任意 linkType 都解析到默认边样式（插件的兜底声明），
        // 未来如需按关系类型定制，给具体 key 覆盖即可。
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
    }
  }, [])

  // ─── 主题切换 → 把主题传入 view 并重新解析样式 ──────
  useEffect(() => {
    const view = viewRef.current
    if (!view) return
    view.setRuntimeTheme(theme)
    view.renderer.setBackgroundColor?.(getPalette(theme).canvas)
  }, [theme])

  // ─── ids 变化 → 加载图数据 ───────────────────
  useEffect(() => {
    const model = modelRef.current
    ;(async () => {
      if (ids?.length === 0) return

      try {
        // 流式 init：边收边增量渲染（数据已写入 model），全部到达后一次性布局
        setLoadProgress({ nodes: 0, links: 0 })
        const initData = await streamInitData(ids ?? [], (p) =>
          setLoadProgress(p),
        )
        setLoadProgress(null)
        // init：一次性算法排布并 fitView，不再等待物理引擎冷却
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

  // ─── 快照操作 ─────────────────────────────────
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

  /** 调节亲密度→吸引力影响系数并重排（引力面板滑块） */
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
