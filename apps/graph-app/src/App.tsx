import { useRef, useState, useCallback } from "react"
import type {
  GraphViewModel,
  DefaultGraphDataGenerics,
} from "@lansheng/knowledge-graph/client/type"
import LegendPanel from "./LegendPanel"
import MiniMap from "./MiniMap"
import { NodeTooltip } from "./NodeTooltip"
import { LinkTooltip } from "./LinkTooltip"
import { RuleMenu } from "./RuleMenu"
import SnapshotPanel from "./SnapshotPanel"
import AnalysisPanel from "./AnalysisPanel"
import { ForceSimulation, TreeLayout } from "@lansheng/knowledge-graph"
import { exportSelection } from "./export-utils"
import Toolbar from "./Toolbar"
import SelectionOverlay from "./SelectionOverlay"
import SelectionBar from "./SelectionBar"
import { AppProvider } from "./AppContext"
import { useGraphFilters } from "./hooks/useGraphFilters"
import { PanelProvider } from "./panel"
import { useGraphHover } from "./hooks/useGraphHover"
import { useRuleMenu } from "./hooks/useRuleMenu"
import { useGraphApp } from "./hooks/useGraphApp"
import { useGraphSelection } from "./hooks/useGraphSelection"
import { applyIcons } from "./icon-map"
import { graphApi } from "./api/client"
import TimePanel from "./TimePanel"
import FilterPanel from "./FilterPanel"
import TablePanel from "./TablePanel"

// 计算节点各方向已加载的邻居数量（纯函数）
function getLoadedNeighbors(
  graphData: GraphViewModel<DefaultGraphDataGenerics>["graphData"],
  nodeId: string,
) {
  const loaded: Record<string, { out: number; in: number }> = {}
  for (const link of graphData.links) {
    const sid = typeof link.source === "object" ? link.source.id : link.source
    const tid = typeof link.target === "object" ? link.target.id : link.target
    if (String(sid) === nodeId) {
      const targetNode = graphData.nodes.find((n: any) => n.id === tid)
      if (targetNode) {
        const t = (targetNode as any).data?.nodeType ?? "unknown"
        if (!loaded[t]) loaded[t] = { out: 0, in: 0 }
        loaded[t].out += 1
      }
    }
    if (String(tid) === nodeId) {
      const sourceNode = graphData.nodes.find((n: any) => n.id === sid)
      if (sourceNode) {
        const t = (sourceNode as any).data?.nodeType ?? "unknown"
        if (!loaded[t]) loaded[t] = { out: 0, in: 0 }
        loaded[t].in += 1
      }
    }
  }
  return loaded
}

// 从 URL 读取初始 ids
const initialIds: string[] | undefined = (() => {
  const params = new URLSearchParams(window.location.search)
  const ids = params.get("ids")
  return ids ? ids.split(",").filter(Boolean) : undefined
})()

export default function App() {
  const graphApp = useGraphApp(initialIds)
  const {
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
      setAnalysisTarget,
      handleTakeSnapshot,
      handleJumpToSnapshot,
      handleDeleteSnapshot,
      handleToggleSnapshotPanel,
      handleUndo,
      handleRedo,
    },
  } = graphApp

  const [timePanelOpen, setTimePanelOpen] = useState(false)
  const [filterPanelOpen, setFilterPanelOpen] = useState(false)
  const [tablePanelOpen, setTablePanelOpen] = useState(false)
  const [treeMode, setTreeMode] = useState(false)
  const graphFilters = useGraphFilters(modelRef)

  const graphHover = useGraphHover(modelRef, {
    onPlusToolClick: (node) => {
      handleTakeSnapshot()
      setRuleMenu({
        node,
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      })
    },
    onNodeContextMenu: (node, x, y) => {
      setRuleMenu({ node, x, y })
    },
  })
  const {
    ctx: {
      hoveredNode,
      setHoveredNode,
      hoveredLink,
      setHoveredLink,
      selectedNodeIds,
    },
  } = graphHover

  const ruleMenuHook = useRuleMenu(containerRef, expansionRef)
  const { ruleMenu, setRuleMenu, expanding, runtimeError } = ruleMenuHook.ctx
  const { handleRuleExpand } = ruleMenuHook

  const selCtx = useGraphSelection({ viewRef, modelRef })

  // 搜索结果选中：不跳转，把该节点直接加入当前画布（放到视口中心）
  const handleSearchSelect = useCallback(async (nodeId: string) => {
    const model = modelRef.current
    const view = viewRef.current
    if (!model || !view) return

    // 请求该节点的图数据
    const data = await graphApi.init([nodeId])
    const incoming = applyIcons(data).graphData

    const current = model.getGraphModelData().graphData
    const existNodeIds = new Set(current.nodes.map((n) => n.id))
    const existLinkIds = new Set(current.links.map((l) => l.id))
    const newNodes = incoming.nodes.filter((n: any) => !existNodeIds.has(n.id))
    if (newNodes.length === 0) return

    // 统一策略（兼容空/非空画布）：新节点放到“当前视口中心的世界坐标”，并把物理
    // 引擎中心同步锚定到该点，使中心力 forceCenter 拉向视口中心而非固定原点 (0,0)：
    //  - 空画布：相机从未 fitView（默认态 k=1,x=0,y=0），视口中心世界坐标=(W/2,H/2)，
    //    节点聚在屏幕中央，不会被中心力拉回世界原点 → 左上角；
    //  - 非空画布：视口中心世界坐标≈当前视野中央，增量节点出现在视野中央、不跳视角。
    const t = view.renderer.interaction.transform
    const canvas = view.renderer.canvas
    const worldCX = canvas.clientWidth / 2 / t.k - t.x
    const worldCY = canvas.clientHeight / 2 / t.k - t.y
    view.setPhysicsCenter(worldCX, worldCY)
    for (const n of newNodes) {
      n.x = worldCX + (Math.random() - 0.5) * 20
      n.y = worldCY + (Math.random() - 0.5) * 20
    }

    model.updateGraphData({
      graphData: {
        nodes: [...current.nodes, ...newNodes],
        links: [
          ...current.links,
          ...incoming.links.filter((l: any) => !existLinkIds.has(l.id)),
        ],
      },
    })
    view.reheat(1)

    // 记录到历史，便于撤销
    historyManagerRef.current.pushState({
      type: "search-add",
      description: `新增节点 ${nodeId}`,
      state: {
        graphData: structuredClone(model.getGraphModelData().graphData),
        customData: { state: model.stateManager.getState() },
      },
    })
  }, [])

  const handleAnalyze = useCallback(() => {
    if (analysisPanelOpen) return setAnalysisPanelOpen(false)
    const targets = [...selectedNodeIds]
    if (targets.length === 0) return
    setAnalysisTarget({
      ids: targets,
      labels: targets.map((id) => {
        const gn = modelRef.current
          ?.getGraphModelData()
          .graphData.nodes.find((n) => n.id === id)
        return (gn?.data as any)?.label ?? id
      }),
    })
    setAnalysisPanelOpen(true)
  }, [selectedNodeIds, analysisPanelOpen, setAnalysisPanelOpen])

  const handleToggleLegend = useCallback(() => {
    setLegendPanelOpen((prev) => !prev)
  }, [])

  const handleToggleMiniMap = useCallback(() => {
    setMiniMapOpen((prev) => !prev)
  }, [])

  const handleFitView = useCallback(() => {
    viewRef.current?.fitView(50)
  }, [])

  // 导出选中子图（JSON 全量 / CSV 表格）
  const handleExportSelection = useCallback(
    (fmt: "json" | "csv") => {
      const model = modelRef.current
      if (!model || selectedNodeIds.size === 0) return
      exportSelection(model, selectedNodeIds, fmt)
    },
    [selectedNodeIds],
  )

  // 布局切换：力导向 ⇄ 树形（根=选中节点，无选中取画布首节点）
  const forceConfig = {
    repulsion: -200,
    linkDistance: 100,
    linkStrength: 0.2,
    centerStrength: 0.1,
    velocityDecay: 0.4,
  }
  const toggleTreeLayout = useCallback(() => {
    const view = viewRef.current
    if (!view) return
    if (treeMode) {
      view.setLayout(new ForceSimulation(forceConfig))
      setTreeMode(false)
    } else {
      const rootId =
        selectedNodeIds.size > 0 ? [...selectedNodeIds][0] : undefined
      view.setLayout(new TreeLayout({ rootId, levelGap: 170, siblingGap: 64 }))
      setTreeMode(true)
    }
  }, [treeMode, selectedNodeIds])

  const appCtx = {
    ...graphApp.ctx,
    ...graphHover.ctx,
    ...ruleMenuHook.ctx,
    ...selCtx,
    ...graphFilters,
  }

  return (
    <AppProvider value={appCtx}>
      <PanelProvider>
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            background: "rgb(var(--background))",
            color: "rgb(var(--foreground))",
          }}
        >
          <Toolbar
            historyManagerRef={historyManagerRef}
            onFitView={handleFitView}
            onToggleSnapshotPanel={handleToggleSnapshotPanel}
            onToggleLegend={handleToggleLegend}
            onToggleMiniMap={handleToggleMiniMap}
            onUndo={handleUndo}
            onRedo={handleRedo}
            onSearchSelect={handleSearchSelect}
            onAnalyze={handleAnalyze}
            timePanelOpen={timePanelOpen}
            filterPanelOpen={filterPanelOpen}
            tablePanelOpen={tablePanelOpen}
            onToggleTimePanel={() => setTimePanelOpen((v) => !v)}
            onToggleFilterPanel={() => setFilterPanelOpen((v) => !v)}
            onToggleTablePanel={() => setTablePanelOpen((v) => !v)}
            onExportJSON={() => handleExportSelection("json")}
            onExportCSV={() => handleExportSelection("csv")}
            treeMode={treeMode}
            onToggleTreeLayout={toggleTreeLayout}
          />

          {/* Loading overlay (shown on top of the graph container) */}
          {loading && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#e94560",
                fontFamily: "monospace",
                fontSize: "18px",
                zIndex: 3000,
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "32px", marginBottom: "12px" }}>⟳</div>
                <div>Loading graph data...</div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "rgb(var(--muted))",
                    marginTop: "8px",
                  }}
                >
                  Fetching from mock API ...
                </div>
                <div
                  id="runtime-error"
                  style={{
                    display: "none",
                    marginTop: "20px",
                    color: "#ff6b6b",
                    fontSize: "13px",
                    maxWidth: "500px",
                    wordBreak: "break-all",
                  }}
                ></div>
                {initError && (
                  <div
                    style={{
                      marginTop: "20px",
                      color: "#ff6b6b",
                      fontSize: "13px",
                      maxWidth: "500px",
                      wordBreak: "break-all",
                    }}
                  >
                    Error: {initError}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Graph container (always rendered, so ref is always available) */}
          <div
            ref={containerRef}
            style={{
              flex: 1,
              position: "relative",
              overflow: "hidden",
            }}
            onMouseMove={(e) => {
              setMousePos({ x: e.clientX, y: e.clientY })
            }}
            onMouseLeave={() => {
              setHoveredNode(null)
              setHoveredLink(null)
            }}
          >
            {/* DOM tooltip - node */}
            {hoveredNode && (
              <NodeTooltip
                loadedNeighbors={getLoadedNeighbors(
                  modelRef.current!.getGraphModelData().graphData,
                  hoveredNode.id,
                )}
              />
            )}

            {/* DOM tooltip - link */}
            {hoveredLink && <LinkTooltip />}

            {/* ─── 快照面板 ─── */}
            {snapshotPanelOpen && historyManagerRef.current && (
              <SnapshotPanel
                historyManager={historyManagerRef.current}
                currentIndex={historyManagerRef.current.cursor}
                onTakeSnapshot={handleTakeSnapshot}
                onJumpTo={handleJumpToSnapshot}
                onDeleteEntry={handleDeleteSnapshot}
                onClose={() => setSnapshotPanelOpen(false)}
              />
            )}

            {/* 分析面板 */}
            {analysisPanelOpen && (
              <AnalysisPanel
                modelRef={modelRef}
                viewRef={viewRef}
                onClose={() => {
                  setAnalysisTarget(null)
                  setAnalysisPanelOpen(false)
                }}
                onExpand={(graphData) => {
                  const model = modelRef.current
                  if (!model) return
                  const current = model.getGraphModelData().graphData
                  const existNodeIds = new Set(current.nodes.map((n) => n.id))
                  const existLinkIds = new Set(current.links.map((l) => l.id))
                  model.updateGraphData({
                    graphData: {
                      nodes: [
                        ...current.nodes,
                        ...graphData.nodes.filter(
                          (n) => !existNodeIds.has(n.id),
                        ),
                      ],
                      links: [
                        ...current.links,
                        ...graphData.links.filter(
                          (l) => !existLinkIds.has(l.id),
                        ),
                      ],
                    },
                  })
                  viewRef.current?.reheat(1)
                  viewRef.current?.fitView(50)
                }}
              />
            )}

            {/* ─── 图例面板 ─── */}
            {legendPanelOpen && !loading && (
              <LegendPanel onClose={() => setLegendPanelOpen(false)} />
            )}

            {/* ─── 小地图 ─── */}
            {miniMapOpen && !loading && <MiniMap viewRef={viewRef} />}

            {/* ─── 时间线回放 / 属性过滤 / 表格视图（P2） ─── */}
            {timePanelOpen && (
              <TimePanel onClose={() => setTimePanelOpen(false)} />
            )}
            {filterPanelOpen && (
              <FilterPanel onClose={() => setFilterPanelOpen(false)} />
            )}
            {tablePanelOpen && (
              <TablePanel
                modelRef={modelRef}
                viewRef={viewRef}
                onClose={() => setTablePanelOpen(false)}
              />
            )}
            <SelectionBar
              modelRef={modelRef}
              viewRef={viewRef}
              onAnalyze={handleAnalyze}
            />

            {/* 规则选择菜单 */}
            {ruleMenu && (
              <RuleMenu
                node={ruleMenu.node}
                loadedNeighbors={getLoadedNeighbors(
                  modelRef.current!.getGraphModelData().graphData,
                  ruleMenu.node.id,
                )}
                x={ruleMenu.x}
                y={ruleMenu.y}
                onExpand={handleRuleExpand}
                onClose={() => setRuleMenu(null)}
              />
            )}

            {/* ─── 拓出加载动画 ─── */}
            {expanding && (
              <div
                style={{
                  position: "fixed",
                  bottom: 70,
                  right: 20,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "rgb(var(--tooltip-bg) / 0.95)",
                  border: "1px solid #1976d2",
                  borderRadius: 8,
                  padding: "8px 14px",
                  boxShadow: "var(--shadow)",
                  zIndex: 9999,
                  fontFamily: "monospace",
                  fontSize: "13px",
                  color: "#1976d2",
                }}
              >
                <span
                  style={{
                    fontSize: "18px",
                    animation: "spin 1s linear infinite",
                  }}
                >
                  ⟳
                </span>
                <span>正在拓出...</span>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
            )}

            {/* ─── 框选覆盖层 ─── */}
            <SelectionOverlay />

            {/* ─── 错误提示 ─── */}
            {runtimeError && (
              <div
                style={{
                  position: "fixed",
                  bottom: 20,
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "#d32f2f",
                  color: "#fff",
                  padding: "10px 20px",
                  borderRadius: 6,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                  zIndex: 9999,
                  fontSize: "13px",
                  fontFamily: "monospace",
                  maxWidth: "80%",
                  wordBreak: "break-all",
                }}
              >
                ❌ {runtimeError}
              </div>
            )}
          </div>
        </div>
      </PanelProvider>
    </AppProvider>
  )
}
