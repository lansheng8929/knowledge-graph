import { useRef, useState, useCallback, useEffect } from "react"
import type { GraphModel } from "@lansheng/knowledge-graph"
import type { MyGraphView } from "../graph-types"

export type SelectionMode = "rect" | "polygon" | null

/** 屏幕坐标上的矩形 */
export interface SelectionRect {
  x1: number
  y1: number
  x2: number
  y2: number
}

/** 多边形绘制状态（屏幕坐标） */
export interface SelectionPolygonState {
  vertices: { x: number; y: number }[]
  cursorPos: { x: number; y: number }
}

interface UseGraphSelectionOptions {
  viewRef: React.RefObject<MyGraphView | null>
  modelRef: React.RefObject<GraphModel | null>
}

export function useGraphSelection({
  viewRef,
  modelRef,
}: UseGraphSelectionOptions) {
  const [selectedSelectionMode, setSelectedSelectionMode] =
    useState<SelectionMode>("rect")
  const [selectionMode, setSelectionMode] = useState<SelectionMode>(null)
  const [rect, setRect] = useState<SelectionRect | null>(null)
  const [polygon, setPolygon] = useState<SelectionPolygonState | null>(null)
  const [isShiftDown, setIsShiftDown] = useState(false)

  const rectStartRef = useRef<{ x: number; y: number } | null>(null)

  // ─── 工具函数 ───

  /** 获取 canvas 相对坐标 */
  const getCanvasPos = useCallback(
    (clientX: number, clientY: number) => {
      const view = viewRef.current
      if (!view) return { x: clientX, y: clientY }
      const canvas = (view as any).renderer?.canvas as
        | HTMLCanvasElement
        | undefined
      if (!canvas) return { x: clientX, y: clientY }
      const r = canvas.getBoundingClientRect()
      return { x: clientX - r.left, y: clientY - r.top }
    },
    [viewRef],
  )

  /** 获取相机变换 */
  const getTransform = useCallback(() => {
    const view = viewRef.current
    if (!view) return null
    return (
      ((view as any).renderer?.interaction?.transform as
        | { x: number; y: number; k: number }
        | undefined) ?? null
    )
  }, [viewRef])

  // ─── 矩形框选：命中检测 ───

  const getNodesInRect = useCallback(
    (r: SelectionRect) => {
      const model = modelRef.current
      const t = getTransform()
      if (!model || !t) return []

      const { nodes } = model.getGraphModelData().graphData

      // 屏幕矩形 → 世界坐标
      const wx1 = r.x1 / t.k - t.x
      const wy1 = r.y1 / t.k - t.y
      const wx2 = r.x2 / t.k - t.x
      const wy2 = r.y2 / t.k - t.y

      const minX = Math.min(wx1, wx2)
      const maxX = Math.max(wx1, wx2)
      const minY = Math.min(wy1, wy2)
      const maxY = Math.max(wy1, wy2)

      return nodes
        .filter((n: any) => {
          const x = n.x ?? 0
          const y = n.y ?? 0
          return x >= minX && x <= maxX && y >= minY && y <= maxY
        })
        .map((n: any) => n.id) as string[]
    },
    [modelRef, getTransform],
  )

  // ─── 多边形框选：命中检测 ───

  const getNodesInPolygon = useCallback(
    (vertices: { x: number; y: number }[]) => {
      if (vertices.length < 3) return []

      const model = modelRef.current
      const t = getTransform()
      if (!model || !t) return []

      const { nodes } = model.getGraphModelData().graphData

      // 屏幕顶点 → 世界坐标
      const worldVerts = vertices.map(
        (v) => [v.x / t.k - t.x, v.y / t.k - t.y] as [number, number],
      )

      return nodes
        .filter((n: any) => {
          const x = n.x ?? 0
          const y = n.y ?? 0
          return pointInPolygon(x, y, worldVerts)
        })
        .map((n: any) => n.id) as string[]
    },
    [modelRef, getTransform],
  )

  // ─── 用 ref 保持最新值，避免闭包过期 ───

  const selectedSelectionModeRef = useRef(selectedSelectionMode)
  selectedSelectionModeRef.current = selectedSelectionMode
  const rectRef = useRef(rect)
  rectRef.current = rect
  const polygonRef = useRef(polygon)
  polygonRef.current = polygon

  // ─── 键盘监听：Shift 激活框选，Escape 取消 ───

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Shift") {
        setIsShiftDown(true)
        // 从工具栏选中的模式读取
        setSelectionMode(selectedSelectionModeRef.current)
      }
      if (e.key === "Escape" && polygonRef.current) {
        setPolygon(null)
      }
    }
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Shift") {
        setIsShiftDown(false)
        // 进行中的框选不受影响，等 release 后再清除模式
        if (
          !rectRef.current &&
          (!polygonRef.current || polygonRef.current.vertices.length === 0)
        ) {
          setSelectionMode(null)
        }
      }
    }
    window.addEventListener("keydown", onKeyDown)
    window.addEventListener("keyup", onKeyUp)
    return () => {
      window.removeEventListener("keydown", onKeyDown)
      window.removeEventListener("keyup", onKeyUp)
    }
  }, [])

  // ─── 判断是否靠近多边形首顶点（用于闭合检测） ───

  const isNearFirstVertex = useCallback(
    (sx: number, sy: number) => {
      if (!polygon || polygon.vertices.length < 2) return false
      const first = polygon.vertices[0]
      const dx = sx - first.x
      const dy = sy - first.y
      return Math.sqrt(dx * dx + dy * dy) < 10
    },
    [polygon],
  )

  // ─── 公开方法 ───

  /** 执行框选并返回选中节点 ID */
  const applyRectSelection = useCallback(
    (r: SelectionRect) => {
      const ids = getNodesInRect(r)
      const model = modelRef.current
      if (!model) return ids
      if (ids.length > 0) {
        model.stateManager.setSelectedNodes(ids)
      } else {
        model.stateManager.clearSelection()
      }
      return ids
    },
    [getNodesInRect, modelRef],
  )

  /** 执行多边形框选并返回选中节点 ID */
  const applyPolygonSelection = useCallback(
    (vertices: { x: number; y: number }[]) => {
      const ids = getNodesInPolygon(vertices)
      const model = modelRef.current
      if (!model) return ids
      if (ids.length > 0) {
        model.stateManager.setSelectedNodes(ids)
      } else {
        model.stateManager.clearSelection()
      }
      return ids
    },
    [getNodesInPolygon, modelRef],
  )

  /** 开始矩形框选（由 overlay 在 pointerdown 时调用） */
  const startRect = useCallback((sx: number, sy: number) => {
    rectStartRef.current = { x: sx, y: sy }
    setRect({ x1: sx, y1: sy, x2: sx, y2: sy })
  }, [])

  /** 更新矩形（由 overlay 在 pointermove 时调用） */
  const updateRect = useCallback((sx: number, sy: number) => {
    if (!rectStartRef.current) return
    setRect({
      x1: rectStartRef.current.x,
      y1: rectStartRef.current.y,
      x2: sx,
      y2: sy,
    })
  }, [])

  /** 完成矩形框选 */
  const finishRect = useCallback(() => {
    if (rect) {
      applyRectSelection(rect)
    }
    setRect(null)
    rectStartRef.current = null
    // 保持 selectionMode 不变（工具栏选中的模式持久）
  }, [rect, applyRectSelection])

  /** 多边形：添加顶点 */
  const addPolygonVertex = useCallback((sx: number, sy: number) => {
    setPolygon((prev) => {
      const vertices = prev?.vertices
        ? [...prev.vertices, { x: sx, y: sy }]
        : [{ x: sx, y: sy }]
      return { vertices, cursorPos: { x: sx, y: sy } }
    })
  }, [])

  /** 多边形：更新鼠标位置（橡皮筋线） */
  const updatePolygonCursor = useCallback((sx: number, sy: number) => {
    setPolygon((prev) =>
      prev ? { ...prev, cursorPos: { x: sx, y: sy } } : null,
    )
  }, [])

  /** 完成多边形框选 */
  const finishPolygon = useCallback(() => {
    if (polygon && polygon.vertices.length >= 3) {
      applyPolygonSelection(polygon.vertices)
    }
    setPolygon(null)
    // 保持 selectionMode 不变
  }, [polygon, applyPolygonSelection])

  /** 取消进行中的框选（不改变工具栏选中的模式） */
  const cancelSelection = useCallback(() => {
    setRect(null)
    setPolygon(null)
    rectStartRef.current = null
  }, [])

  /** 工具栏：切换到矩形框选（仅修改 selectedSelectionMode） */
  const activateRectMode = useCallback(() => {
    cancelSelection()
    setSelectedSelectionMode("rect")
    setSelectionMode(null)
  }, [cancelSelection])

  /** 工具栏：切换到多边形框选（仅修改 selectedSelectionMode） */
  const activatePolygonMode = useCallback(() => {
    cancelSelection()
    setSelectedSelectionMode("polygon")
    setSelectionMode(null)
  }, [cancelSelection])

  /** 工具栏：禁用框选（箭头按钮） */
  const deactivateSelectionMode = useCallback(() => {
    cancelSelection()
    setSelectedSelectionMode(null)
    setSelectionMode(null)
  }, [cancelSelection])

  return {
    /** 工具栏选中的模式（持久） */
    selectedSelectionMode,
    /** 当前激活的框选模式（Shift 按下时非 null） */
    selectionMode,
    /** 矩形状态（供 overlay 渲染） */
    rect,
    /** 多边形状态（供 overlay 渲染） */
    polygon,
    /** Shift 是否按下 */
    isShiftDown,
    /** 判断是否靠近首顶点 */
    isNearFirstVertex,
    /** 坐标工具 */
    getCanvasPos,
    getTransform,
    /** 矩形操作 */
    startRect,
    updateRect,
    finishRect,
    /** 多边形操作 */
    addPolygonVertex,
    updatePolygonCursor,
    finishPolygon,
    /** 通用 */
    cancelSelection,
    /** 工具栏方法 */
    activateRectMode,
    activatePolygonMode,
    deactivateSelectionMode,
  }
}

// ─── 射线法 point-in-polygon ───

function pointInPolygon(
  px: number,
  py: number,
  vertices: [number, number][],
): boolean {
  let inside = false
  for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
    const [xi, yi] = vertices[i]
    const [xj, yj] = vertices[j]
    if (yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) {
      inside = !inside
    }
  }
  return inside
}
