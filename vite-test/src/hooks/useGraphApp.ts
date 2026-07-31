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
  DefaultGraphDataGenerics,
} from "@lansheng/knowledge-graph/client/type"
import { type ExpansionFetcher, ExpansionService } from "../expansion-service"
import { useTheme } from "./useTheme"
import { getPalette, type Theme } from "../theme"
import { applyIcons } from "../icon-map"

interface InitResponse {
  graphData: GraphViewModel<DefaultGraphDataGenerics>["graphData"]
}

async function fetchInitData(ids: string[]): Promise<InitResponse> {
  const res = await fetch("/api/graph/init", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids }),
  })
  const json = await res.json()
  if (!json.success) throw new Error("Failed to fetch init data")
  const data = json.data as InitResponse
  applyIcons(data.graphData)
  return data
}

const expansionFetcher: ExpansionFetcher = async (request) => {
  const res = await fetch("/api/graph/expand", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  })
  if (!res.ok) {
    const errBody = await res.text()
    throw new Error(`拓出失败 (${res.status}): ${errBody}`)
  }
  const json = await res.json()
  if (!json.success) throw new Error("Expand failed")
  return applyIcons(json.data)
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
        repulsion: -200,
        linkDistance: 100,
        linkStrength: 0.2,
        centerStrength: 0.1,
        velocityDecay: 0.4,
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
        link: { default: (_link, t) => createDefaultLinkStyle(t as Theme) },
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
      try {
        const initData = await fetchInitData(ids ?? [])
        model.updateGraphData({ graphData: initData.graphData })
        viewRef.current?.reheat(1)
        viewRef.current?.fitView(50)
        historyManagerRef.current.pushState({
          type: "init",
          description: "初始图谱",
          state: {
            graphData: structuredClone(initData.graphData),
            customData: { state: model.stateManager.getState() },
          },
        })
      } catch (err) {
        setInitError(err instanceof Error ? err.message : String(err))
      }
    })()
  }, [ids])

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
      if (s.focusNodes?.length)
        model.stateManager.setFocusNodes(s.focusNodes, s.focusLinks)
      else model.stateManager.clearFocus()
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
        if (s.focusNodes?.length)
          model.stateManager.setFocusNodes(s.focusNodes, s.focusLinks)
        else model.stateManager.clearFocus()
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
    },
  }
}
