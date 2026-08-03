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
        background: "rgba(15,23,42,0.92)",
        border: "1px solid #334155",
        borderRadius: 999,
        color: "#e2e8f0",
        fontFamily: "monospace",
        fontSize: 12,
        boxShadow: "0 6px 24px rgba(0,0,0,0.35)",
        zIndex: 500,
      }}
    >
      <span>已选 {selectedNodeIds.size} 个节点</span>
      <span style={{ width: 1, height: 16, background: "#334155" }} />
      <button onClick={onAnalyze} style={barBtn} title="分析选中（通话圈等）">
        <BarChart3 size={13} /> 分析
      </button>
      <button onClick={fitSelected} style={barBtn} title="聚焦选中节点">
        <ScanSearch size={13} /> 聚焦
      </button>
      <span style={{ width: 1, height: 16, background: "#334155" }} />
      <button onClick={clear} style={barBtn} title="关闭（清空选择）">
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
  border: "1px solid #475569",
  borderRadius: 6,
  cursor: "pointer",
  color: "#e2e8f0",
}
