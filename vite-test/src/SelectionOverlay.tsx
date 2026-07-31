import { useRef, useCallback } from "react"
import { useAppCtx } from "./AppContext"

const OVERLAY_STYLE: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  zIndex: 100,
}

/**
 * SelectionOverlay — 框选视觉覆盖层。
 *
 * - 默认 pointerEvents: "none"，不阻挡 canvas 交互
 * - 按下 Shift 时切换为 pointerEvents: "auto"，拦截事件启动矩形框选
 * - 多边形模式下一直拦截事件
 */
export default function SelectionOverlay() {
  const {
    selectionMode,
    rect,
    polygon,
    isShiftDown,
    isNearFirstVertex,
    getCanvasPos,
    startRect,
    updateRect,
    finishRect,
    addPolygonVertex,
    updatePolygonCursor,
    finishPolygon,
  } = useAppCtx()
  const overlayRef = useRef<HTMLDivElement>(null)
  const isPointerDownRef = useRef(false)
  const preventNextUpRef = useRef(false)

  // Shift 按下 + 有选中的模式 → 拦截事件
  const shouldCapture = isShiftDown && selectionMode !== null

  // ─── Pointer handlers ───

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      const { x: sx, y: sy } = getCanvasPos(e.clientX, e.clientY)

      // 矩形框选模式：点击开始拖拽
      if (selectionMode === "rect") {
        isPointerDownRef.current = true
        startRect(sx, sy)
        e.preventDefault()
        e.stopPropagation()
        return
      }

      // 多边形模式：点击添加顶点
      if (selectionMode === "polygon") {
        // 如果点击靠近首顶点 → 闭合多边形
        if (
          polygon &&
          polygon.vertices.length >= 2 &&
          isNearFirstVertex(sx, sy)
        ) {
          preventNextUpRef.current = true
          finishPolygon()
          e.preventDefault()
          e.stopPropagation()
          return
        }
        addPolygonVertex(sx, sy)
        e.preventDefault()
        e.stopPropagation()
        return
      }
    },
    [
      getCanvasPos,
      selectionMode,
      startRect,
      polygon,
      isNearFirstVertex,
      finishPolygon,
      addPolygonVertex,
    ],
  )

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      const { x: sx, y: sy } = getCanvasPos(e.clientX, e.clientY)

      if (selectionMode === "rect" && isPointerDownRef.current) {
        updateRect(sx, sy)
        e.preventDefault()
        e.stopPropagation()
        return
      }

      if (selectionMode === "polygon") {
        updatePolygonCursor(sx, sy)
        e.preventDefault()
        e.stopPropagation()
        return
      }
    },
    [getCanvasPos, selectionMode, updateRect, updatePolygonCursor],
  )

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (preventNextUpRef.current) {
        preventNextUpRef.current = false
        e.preventDefault()
        e.stopPropagation()
        return
      }

      if (isPointerDownRef.current) {
        isPointerDownRef.current = false
        finishRect()
        e.preventDefault()
        e.stopPropagation()
        return
      }
    },
    [finishRect],
  )

  const onDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      // 多边形模式双击闭合
      if (
        selectionMode === "polygon" &&
        polygon &&
        polygon.vertices.length >= 2
      ) {
        finishPolygon()
        e.preventDefault()
        e.stopPropagation()
      }
    },
    [selectionMode, polygon, finishPolygon],
  )

  // ─── SVG 尺寸 ───

  const width = rect ? Math.abs(rect.x2 - rect.x1) : 0
  const height = rect ? Math.abs(rect.y2 - rect.y1) : 0
  const rectLeft = rect ? Math.min(rect.x1, rect.x2) : 0
  const rectTop = rect ? Math.min(rect.y1, rect.y2) : 0

  // 多边形折线路径
  const polyPoints =
    polygon && polygon.vertices.length > 0
      ? polygon.vertices.map((v) => `${v.x},${v.y}`).join(" ")
      : ""

  return (
    <div
      ref={overlayRef}
      style={{
        ...OVERLAY_STYLE,
        pointerEvents: shouldCapture ? "auto" : "none",
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onDoubleClick={onDoubleClick}
    >
      <svg
        width="100%"
        height="100%"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          pointerEvents: "none",
        }}
      >
        {/* ── 矩形选择框 ── */}
        {rect && (
          <>
            <rect
              x={rectLeft}
              y={rectTop}
              width={width}
              height={height}
              fill="rgba(0, 102, 255, 0.08)"
              stroke="#0066ff"
              strokeWidth={1.5}
              strokeDasharray="6 3"
            />
          </>
        )}

        {/* ── 多边形选择 ── */}
        {polygon && polygon.vertices.length > 0 && (
          <>
            {/* 多边形填充（半透明）—— 当有 ≥3 个顶点时 */}
            {polygon.vertices.length >= 3 && (
              <polygon
                points={polyPoints}
                fill="rgba(0, 102, 255, 0.06)"
                stroke="none"
              />
            )}

            {/* 折线（已确定的边） */}
            <polyline
              points={polyPoints}
              fill="none"
              stroke="#0066ff"
              strokeWidth={1.5}
              strokeLinejoin="round"
              strokeLinecap="round"
            />

            {/* 橡皮筋线（最后一个顶点 → 鼠标位置） */}
            <line
              x1={polygon.vertices[polygon.vertices.length - 1].x}
              y1={polygon.vertices[polygon.vertices.length - 1].y}
              x2={polygon.cursorPos.x}
              y2={polygon.cursorPos.y}
              stroke="#0066ff"
              strokeWidth={1}
              strokeDasharray="4 3"
            />

            {/* 顶点小圆 */}
            {polygon.vertices.map((v, i) => (
              <circle
                key={i}
                cx={v.x}
                cy={v.y}
                r={4}
                fill={i === 0 ? "#0066ff" : "#fff"}
                stroke="#0066ff"
                strokeWidth={1.5}
              />
            ))}
          </>
        )}
      </svg>
    </div>
  )
}
