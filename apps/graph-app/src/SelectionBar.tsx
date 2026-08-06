import { useState } from "react"
import { BarChart3, ScanSearch, X } from "lucide-react"
import type { GraphModel } from "@lansheng/knowledge-graph"
import type { MyGraphView } from "./graph-types"
import { useAppCtx } from "./AppContext"

/** 平滑平移相机（easeOutCubic 缓动），duration 毫秒 */
function animatePan(
  transform: { x: number; y: number },
  targetX: number,
  targetY: number,
  duration = 350,
): void {
  const startX = transform.x
  const startY = transform.y
  const startTime = performance.now()
  const ease = (p: number) => 1 - Math.pow(1 - p, 3)
  const step = (now: number) => {
    const p = Math.min(1, (now - startTime) / duration)
    const e = ease(p)
    transform.x = startX + (targetX - startX) * e
    transform.y = startY + (targetY - startY) * e
    if (p < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

/**
 * SelectionBar — 框选拓展操作条（P2 / 需求4）。
 * 选中节点后出现：分析选中、聚焦选中、清空（导出已移至菜单栏）。
 * 底部居中固定定位（不用 useDrag，避免挂载时机导致位置停在左上角不可见）。
 */
export default function SelectionBar({
  modelRef,
  viewRef,
  onAnalyze,
}: {
  modelRef: { current: GraphModel }
  viewRef: { current: MyGraphView | null }
  onAnalyze?: () => void
}) {
  const { selectedNodeIds } = useAppCtx()
  // 毛玻璃按钮 hover 状态（hooks 需在条件 return 前无条件调用）
  const [hoverBtn, setHoverBtn] = useState<string | null>(null)

  if (selectedNodeIds.size === 0) return null

  const fitSelected = () => {
    const view = viewRef.current
    if (!view) return
    const r = view.renderer.backend
    const rns = r.nodes.filter((n) => selectedNodeIds.has(n.id))
    if (!rns.length) return
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity
    for (const n of rns) {
      minX = Math.min(minX, n.x - n.radius)
      minY = Math.min(minY, n.y - n.radius)
      maxX = Math.max(maxX, n.x + n.radius)
      maxY = Math.max(maxY, n.y + n.radius)
    }
    const w = r.canvas.clientWidth
    const h = r.canvas.clientHeight
    if (w <= 0 || h <= 0) return
    const t = r.interaction.transform
    const cx = (minX + maxX) / 2
    const cy = (minY + maxY) / 2
    // 聚焦：不缩放（保持 k），平滑平移选中节点中心到画布中心
    animatePan(t, w / (2 * t.k) - cx, h / (2 * t.k) - cy, 350)
  }

  const clear = () => {
    const model = modelRef.current
    if (!model) return
    model.stateManager.setSelectedNodes([])
  }

  // 毛玻璃 hover：与工具栏按钮一致的反馈（前景色 9% + 主题悬停色边框）
  const hoverProps = (key: string) => ({
    onMouseEnter: () => setHoverBtn(key),
    onMouseLeave: () => setHoverBtn(null),
  })
  const btnStyle = (key: string): React.CSSProperties => ({
    ...barBtn,
    background:
      hoverBtn === key ? "rgb(var(--foreground) / 0.09)" : barBtn.background,
    border:
      hoverBtn === key
        ? "1px solid rgb(var(--border-hover) / 0.7)"
        : barBtn.border,
  })

  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 14px",
        // 毛玻璃：半透明渐变 + 模糊 + 细边框 + 内高光
        background:
          "linear-gradient(135deg, rgb(var(--surface) / 0.82), rgb(var(--background) / 0.72))",
        backdropFilter: "blur(16px) saturate(160%)",
        WebkitBackdropFilter: "blur(16px) saturate(160%)",
        border: "1px solid rgb(var(--border) / 0.5)",
        borderRadius: 999,
        color: "rgb(var(--foreground))",
        fontFamily: "monospace",
        fontSize: 12,
        boxShadow:
          "inset 0 1px 0 rgb(255 255 255 / 0.08), 0 12px 40px rgb(0 0 0 / 0.22)",
        zIndex: 500,
      }}
    >
      <span>已选 {selectedNodeIds.size} 个节点</span>
      <span
        style={{
          width: 1,
          height: 16,
          background: "rgb(var(--border) / 0.6)",
        }}
      />
      <button
        onClick={onAnalyze}
        style={btnStyle("analyze")}
        {...hoverProps("analyze")}
        title="分析选中（通话圈等）"
      >
        <BarChart3 size={13} /> 分析
      </button>
      <button
        onClick={fitSelected}
        style={btnStyle("focus")}
        {...hoverProps("focus")}
        title="聚焦选中节点"
      >
        <ScanSearch size={13} /> 聚焦
      </button>
      <span
        style={{
          width: 1,
          height: 16,
          background: "rgb(var(--border) / 0.6)",
        }}
      />
      <button
        onClick={clear}
        style={btnStyle("clear")}
        {...hoverProps("clear")}
        title="关闭（清空选择）"
      >
        <X size={13} />
      </button>
    </div>
  )
}

const barBtn: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 5,
  fontSize: 12,
  fontFamily: "monospace",
  padding: "4px 10px",
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgb(var(--border))",
  borderRadius: 6,
  cursor: "pointer",
  color: "rgb(var(--foreground))",
}
