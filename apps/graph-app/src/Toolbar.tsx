import { usePanel, PanelLayer } from "./panel"
import {
  Maximize2,
  Camera,
  Undo2,
  Redo2,
  Search,
  BarChart3,
  Square,
  Pentagon,
  MousePointer2,
  BookOpen,
  Map,
  Sun,
  Moon,
  Clock,
  Filter,
  Table,
  Download,
  GitBranch,
} from "lucide-react"
import SearchBox from "./SearchBox"
import type { HistoryManager } from "@lansheng/knowledge-graph/history-manager"
import { useAppCtx } from "./AppContext"
import { useTheme } from "./hooks/useTheme"

const toolbarStyle: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  padding: "5px",
  display: "flex",
  gap: "8px",
  alignItems: "center",
  borderBottom: "1px solid rgb(var(--border-strong))",
  flexWrap: "wrap",
  background: "rgb(var(--background))",
  color: "rgb(var(--foreground))",
}

const btnStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "4px 4px",
  fontSize: "13px",
  fontFamily: "monospace",
  background: "transparent",
  border: "1px solid transparent",
  borderRadius: 4,
  cursor: "pointer",
  color: "rgb(var(--foreground))",
}

interface ToolbarProps {
  historyManagerRef: React.RefObject<HistoryManager | null>
  onFitView: () => void
  onToggleSnapshotPanel: () => void
  onToggleLegend: () => void
  onToggleMiniMap: () => void
  onUndo: () => void
  onRedo: () => void
  onSearchSelect: (nodeId: string) => void
  onAnalyze?: () => void
  timePanelOpen: boolean
  filterPanelOpen: boolean
  tablePanelOpen: boolean
  onToggleTimePanel: () => void
  onToggleFilterPanel: () => void
  onToggleTablePanel: () => void
  onExportJSON: () => void
  onExportCSV: () => void
  treeMode: boolean
  onToggleTreeLayout: () => void
}

export default function Toolbar({
  historyManagerRef,
  onFitView,
  onToggleSnapshotPanel,
  onToggleLegend,
  onToggleMiniMap,
  onUndo,
  onRedo,
  onSearchSelect,
  onAnalyze,
  timePanelOpen,
  filterPanelOpen,
  tablePanelOpen,
  onToggleTimePanel,
  onToggleFilterPanel,
  onToggleTablePanel,
  onExportJSON,
  onExportCSV,
  treeMode,
  onToggleTreeLayout,
}: ToolbarProps) {
  const { zIndex } = usePanel({ id: "toolbar", layer: PanelLayer.Toolbar })
  const {
    snapshotPanelOpen,
    legendPanelOpen,
    miniMapOpen,
    analysisPanelOpen,
    selectedNodeIds,
    selectionMode, // 当前选取模式
    selectedSelectionMode, // 当前候选的框选类型
    activateRectMode,
    activatePolygonMode,
    deactivateSelectionMode,
  } = useAppCtx()
  const canUndo =
    historyManagerRef.current?.canGoBackSkipType("snapshot") ?? false
  const canRedo =
    historyManagerRef.current?.canGoForwardSkipType("snapshot") ?? false
  const { theme, toggle } = useTheme()
  return (
    <div style={{ ...toolbarStyle, zIndex }}>
      <button
        onClick={onUndo}
        style={btnStyle}
        title="回退"
        disabled={!canUndo}
      >
        <Undo2 size={14} />
      </button>
      <button
        onClick={onRedo}
        style={btnStyle}
        title="恢复"
        disabled={!canRedo}
      >
        <Redo2 size={14} />
      </button>
      <button onClick={onFitView} style={btnStyle} title="Fit View">
        <Maximize2 size={14} />
      </button>
      <button
        onClick={onToggleSnapshotPanel}
        style={{
          ...btnStyle,
          background: snapshotPanelOpen
            ? "rgba(233,69,96,0.25)"
            : "transparent",
          border: snapshotPanelOpen ? "1px solid #e94560" : "1px solid #0f3460",
        }}
        title="快照管理"
      >
        <Camera size={14} />
      </button>

      <button
        onClick={onToggleLegend}
        style={{
          ...btnStyle,
          background: legendPanelOpen ? "rgba(233,69,96,0.25)" : "transparent",
          border: legendPanelOpen ? "1px solid #e94560" : "1px solid #0f3460",
        }}
        title="图例"
      >
        <BookOpen size={14} />
      </button>
      <button
        onClick={onToggleMiniMap}
        style={{
          ...btnStyle,
          background: miniMapOpen ? "rgba(233,69,96,0.25)" : "transparent",
          border: miniMapOpen ? "1px solid #e94560" : "1px solid #0f3460",
        }}
        title="小地图"
      >
        <Map size={14} />
      </button>

      <span style={{ fontSize: "11px", color: "#999", margin: "0 2px" }}>
        |
      </span>

      <button
        onClick={onToggleTimePanel}
        style={{
          ...btnStyle,
          background: timePanelOpen ? "rgba(233,69,96,0.25)" : "transparent",
          border: timePanelOpen ? "1px solid #e94560" : "1px solid #0f3460",
        }}
        title="时间线回放"
      >
        <Clock size={14} />
      </button>
      <button
        onClick={onToggleFilterPanel}
        style={{
          ...btnStyle,
          background: filterPanelOpen ? "rgba(233,69,96,0.25)" : "transparent",
          border: filterPanelOpen ? "1px solid #e94560" : "1px solid #0f3460",
        }}
        title="属性过滤"
      >
        <Filter size={14} />
      </button>
      <button
        onClick={onToggleTablePanel}
        style={{
          ...btnStyle,
          background: tablePanelOpen ? "rgba(233,69,96,0.25)" : "transparent",
          border: tablePanelOpen ? "1px solid #e94560" : "1px solid #0f3460",
        }}
        title="表格视图"
      >
        <Table size={14} />
      </button>

      <span style={{ fontSize: "11px", color: "#999", margin: "0 2px" }}>
        |
      </span>

      <button
        onClick={deactivateSelectionMode}
        style={{
          ...btnStyle,
          background: !selectionMode ? "#0066ff50" : "transparent",
          border: !selectionMode ? "1px solid #0066ff" : "1px solid #ccc",
        }}
        title="默认模式"
      >
        <MousePointer2 size={14} />
      </button>
      <button
        onClick={activateRectMode}
        style={{
          ...btnStyle,
          background:
            selectedSelectionMode === "rect"
              ? "rgba(230,126,0,0.15)"
              : "transparent",
          border:
            selectedSelectionMode === "rect"
              ? "1px solid #e67e00"
              : "1px solid #ccc",
        }}
        title="矩形框选 (默认，按下 Shift 激活)"
      >
        <Square size={14} />
      </button>
      <button
        onClick={activatePolygonMode}
        style={{
          ...btnStyle,
          background:
            selectedSelectionMode === "polygon"
              ? "rgba(230,126,0,0.15)"
              : "transparent",
          border:
            selectedSelectionMode === "polygon"
              ? "1px solid #e67e00"
              : "1px solid #ccc",
        }}
        title="多边形框选 (按下 Shift 激活)"
      >
        <Pentagon size={14} />
      </button>

      <div style={{ flex: 1 }} />
      <button
        onClick={onAnalyze}
        disabled={selectedNodeIds.size === 0}
        style={{
          ...btnStyle,
          background: analysisPanelOpen
            ? "rgba(233,69,96,0.25)"
            : "transparent",
          border: analysisPanelOpen ? "1px solid #e94560" : "1px solid #0f3460",
        }}
        title="分析"
      >
        <BarChart3 size={14} />
      </button>
      <button
        onClick={onExportJSON}
        disabled={selectedNodeIds.size === 0}
        style={btnStyle}
        title="导出选中子图 JSON"
      >
        <Download size={13} />
        <span style={{ fontSize: "10px" }}>JSON</span>
      </button>
      <button
        onClick={onExportCSV}
        disabled={selectedNodeIds.size === 0}
        style={btnStyle}
        title="导出选中节点 CSV"
      >
        <Download size={13} />
        <span style={{ fontSize: "10px" }}>CSV</span>
      </button>
      <button
        onClick={onToggleTreeLayout}
        style={{
          ...btnStyle,
          background: treeMode ? "rgba(230,126,0,0.15)" : "transparent",
          border: treeMode ? "1px solid #e67e00" : "1px solid #ccc",
        }}
        title={treeMode ? "切回力导向布局" : "树形布局（以选中节点为根）"}
      >
        <GitBranch size={14} />
      </button>
      <Search size={14} style={{ color: "rgb(var(--muted))" }} />
      <SearchBox onSelect={onSearchSelect} />

      <button
        onClick={toggle}
        style={btnStyle}
        title={theme === "dark" ? "切换到亮色主题" : "切换到暗色主题"}
      >
        {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
      </button>
    </div>
  )
}
