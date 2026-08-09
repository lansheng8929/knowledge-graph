import { useState } from "react"
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
  ArrowBigLeft,
  Magnet,
} from "lucide-react"
import SearchBox from "./SearchBox"
import type { HistoryManager } from "@lansheng/knowledge-graph/history-manager"
import { useAppCtx } from "./AppContext"
import { useTheme } from "./hooks/useTheme"

const toolbarStyle: React.CSSProperties = {
  position: "absolute",
  top: 8,
  left: 8,
  right: 8,
  padding: "5px",
  display: "flex",
  gap: "8px",
  alignItems: "center",
  flexWrap: "wrap",
  // 毛玻璃：更强的模糊/饱和 + 半透明渐变 + 细边框 + 内高光（inset）
  background:
    "linear-gradient(135deg, rgb(var(--background) / 0.62), rgb(var(--background) / 0.38))",
  backdropFilter: "blur(16px) saturate(180%)",
  WebkitBackdropFilter: "blur(16px) saturate(180%)",
  borderRadius: 12,
  border: "1px solid rgb(var(--border) / 0.45)",
  boxShadow:
    "inset 0 1px 0 rgb(255 255 255 / 0.08), 0 8px 32px rgb(0 0 0 / 0.18)",
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
  // 毛玻璃细边框（默认半透明主题边框，hover/active 在 ToolbarButton 里覆盖）
  border: "1px solid rgb(var(--border) / 0.35)",
  borderRadius: 6,
  cursor: "pointer",
  color: "rgb(var(--foreground))",
  transition:
    "background 0.15s ease, border-color 0.15s ease, opacity 0.15s ease",
}

/** 毛玻璃风格工具栏按钮：统一 hover / active / disabled 反馈（与主题 token 适配）。 */
function ToolbarButton({
  title,
  onClick,
  disabled = false,
  active = false,
  activeColor = "#e94560",
  children,
}: {
  title: string
  onClick?: () => void
  disabled?: boolean
  active?: boolean
  activeColor?: string
  children: React.ReactNode
}) {
  const [hover, setHover] = useState(false)
  const style: React.CSSProperties = {
    ...btnStyle,
    opacity: disabled ? 0.45 : 1,
    cursor: disabled ? "not-allowed" : "pointer",
    // active：功能色半透明底 + 实色边框；hover：前景色 9% 半透明 + 主题悬停色边框
    background: active
      ? `${activeColor}33`
      : hover
        ? "rgb(var(--foreground) / 0.09)"
        : "transparent",
    border: active
      ? `1px solid ${activeColor}`
      : hover
        ? "1px solid rgb(var(--border-hover) / 0.7)"
        : "1px solid rgb(var(--border) / 0.35)",
  }
  return (
    <button
      title={title}
      onClick={onClick}
      disabled={disabled}
      style={style}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {children}
    </button>
  )
}

interface ToolbarProps {
  historyManagerRef: React.RefObject<HistoryManager | null>
  onBack: () => void
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
  physicsPanelOpen: boolean
  onToggleTimePanel: () => void
  onToggleFilterPanel: () => void
  onToggleTablePanel: () => void
  onTogglePhysicsPanel: () => void
  onExportJSON: () => void
  onExportCSV: () => void
  treeMode: boolean
  onToggleTreeLayout: () => void
}

export default function Toolbar({
  historyManagerRef,
  onBack,
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
  physicsPanelOpen,
  onToggleTimePanel,
  onToggleFilterPanel,
  onToggleTablePanel,
  onTogglePhysicsPanel,
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
      <ToolbarButton title="返回" onClick={onBack}>
        <ArrowBigLeft size={14} />
      </ToolbarButton>

      <ToolbarButton title="回退" onClick={onUndo} disabled={!canUndo}>
        <Undo2 size={14} />
      </ToolbarButton>
      <ToolbarButton title="恢复" onClick={onRedo} disabled={!canRedo}>
        <Redo2 size={14} />
      </ToolbarButton>
      <ToolbarButton title="Fit View" onClick={onFitView}>
        <Maximize2 size={14} />
      </ToolbarButton>
      <ToolbarButton
        title="快照管理"
        onClick={onToggleSnapshotPanel}
        active={snapshotPanelOpen}
        activeColor="#e94560"
      >
        <Camera size={14} />
      </ToolbarButton>

      <ToolbarButton
        title="图例"
        onClick={onToggleLegend}
        active={legendPanelOpen}
        activeColor="#e94560"
      >
        <BookOpen size={14} />
      </ToolbarButton>
      <ToolbarButton
        title="小地图"
        onClick={onToggleMiniMap}
        active={miniMapOpen}
        activeColor="#e94560"
      >
        <Map size={14} />
      </ToolbarButton>

      <span
        style={{
          fontSize: "11px",
          color: "rgb(var(--muted))",
          margin: "0 2px",
        }}
      >
        |
      </span>

      <ToolbarButton
        title="时间线回放"
        onClick={onToggleTimePanel}
        active={timePanelOpen}
        activeColor="#e94560"
      >
        <Clock size={14} />
      </ToolbarButton>
      <ToolbarButton
        title="属性过滤"
        onClick={onToggleFilterPanel}
        active={filterPanelOpen}
        activeColor="#e94560"
      >
        <Filter size={14} />
      </ToolbarButton>
      <ToolbarButton
        title="表格视图"
        onClick={onToggleTablePanel}
        active={tablePanelOpen}
        activeColor="#e94560"
      >
        <Table size={14} />
      </ToolbarButton>
      <ToolbarButton
        title="引力调节（亲密度→吸引力）"
        onClick={onTogglePhysicsPanel}
        active={physicsPanelOpen}
        activeColor="#e94560"
      >
        <Magnet size={14} />
      </ToolbarButton>

      <span
        style={{
          fontSize: "11px",
          color: "rgb(var(--muted))",
          margin: "0 2px",
        }}
      >
        |
      </span>

      <ToolbarButton
        title="默认模式"
        onClick={deactivateSelectionMode}
        active={!selectionMode}
        activeColor="#0066ff"
      >
        <MousePointer2 size={14} />
      </ToolbarButton>
      <ToolbarButton
        title="矩形框选 (默认，按下 Shift 激活)"
        onClick={activateRectMode}
        active={selectedSelectionMode === "rect"}
        activeColor="#e67e00"
      >
        <Square size={14} />
      </ToolbarButton>
      <ToolbarButton
        title="多边形框选 (按下 Shift 激活)"
        onClick={activatePolygonMode}
        active={selectedSelectionMode === "polygon"}
        activeColor="#e67e00"
      >
        <Pentagon size={14} />
      </ToolbarButton>

      <div style={{ flex: 1 }} />
      <ToolbarButton
        title="分析"
        onClick={onAnalyze}
        disabled={selectedNodeIds.size === 0}
        active={analysisPanelOpen}
        activeColor="#e94560"
      >
        <BarChart3 size={14} />
      </ToolbarButton>
      <ToolbarButton
        title="导出选中子图 JSON"
        onClick={onExportJSON}
        disabled={selectedNodeIds.size === 0}
      >
        <Download size={13} />
        <span style={{ fontSize: "10px" }}>JSON</span>
      </ToolbarButton>
      <ToolbarButton
        title="导出选中节点 CSV"
        onClick={onExportCSV}
        disabled={selectedNodeIds.size === 0}
      >
        <Download size={13} />
        <span style={{ fontSize: "10px" }}>CSV</span>
      </ToolbarButton>
      <ToolbarButton
        title={treeMode ? "切回力导向布局" : "树形布局（以选中节点为根）"}
        onClick={onToggleTreeLayout}
        active={treeMode}
        activeColor="#e67e00"
      >
        <GitBranch size={14} />
      </ToolbarButton>
      <Search size={14} style={{ color: "rgb(var(--muted))" }} />
      <SearchBox onSelect={onSearchSelect} />

      <ToolbarButton
        title={theme === "dark" ? "切换到亮色主题" : "切换到暗色主题"}
        onClick={toggle}
      >
        {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
      </ToolbarButton>
    </div>
  )
}
