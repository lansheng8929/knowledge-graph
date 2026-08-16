import { useRef, useEffect, useCallback } from "react"
import type { MyGraphView } from "./graph-types"
import { getPalette, hexToRgba } from "./theme"
import { useTheme } from "./hooks/useTheme"
import { linkEndpoints } from "./link-utils"

interface MiniMapProps {
  viewRef: React.RefObject<MyGraphView | null>
}

const MINIMAP_W = 200
const MINIMAP_H = 150
/** 世界画布最小尺寸（小图时兜底，保证蓝框比例稳定） */
const WORLD_CANVAS_MIN_W = 800
const WORLD_CANVAS_MIN_H = 600
/** 节点包围盒外扩 padding 最小值（px，世界坐标） */
const WORLD_PADDING = 60
/** 节点包围盒外扩 padding 比例（相对较长边） */
const WORLD_PADDING_RATIO = 0.1
const NODE_DOT_RADIUS = 2
const VIEWPORT_RECT_COLOR = "rgba(0, 102, 255, 0.25)"
const VIEWPORT_RECT_STROKE = "#0066ff"

export default function MiniMap({ viewRef }: MiniMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)
  const isPointerDown = useRef(false)

  // 主题从外部传入（useTheme）
  const { theme } = useTheme()

  // 从 model 获取节点/边数据（位置由物理引擎回写，始终最新）
  const getGraphData = useCallback(() => {
    const view = viewRef.current
    if (!view) return null
    return view.model.getGraphModelData().graphData
  }, [viewRef])

  /**
   * 世界画布：由所有节点位置 + padding 计算，最小 800×600。
   * 节点包围盒居中放置在世界画布内。
   */
  const getWorldCanvas = useCallback(() => {
    const graphData = getGraphData()
    if (!graphData || graphData.nodes.length === 0) return null

    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity
    for (const n of graphData.nodes) {
      const nx = n.x ?? 0
      const ny = n.y ?? 0
      if (nx < minX) minX = nx
      if (ny < minY) minY = ny
      if (nx > maxX) maxX = nx
      if (ny > maxY) maxY = ny
    }

    const nodeW = Math.max(maxX - minX, 1)
    const nodeH = Math.max(maxY - minY, 1)
    // padding 按图大小比例（至少 WORLD_PADDING），避免大图节点贴边
    const pad = Math.max(
      WORLD_PADDING,
      Math.max(nodeW, nodeH) * WORLD_PADDING_RATIO,
    )
    const cw = Math.max(WORLD_CANVAS_MIN_W, nodeW + pad * 2)
    const ch = Math.max(WORLD_CANVAS_MIN_H, nodeH + pad * 2)
    const cx = (minX + maxX) / 2
    const cy = (minY + maxY) / 2

    return { x: cx - cw / 2, y: cy - ch / 2, width: cw, height: ch }
  }, [getGraphData])

  /**
   * 主画布视口（世界坐标）。
   * 约定：screen = (world + t) * k → world = screen / k - t
   */
  const getViewport = useCallback(() => {
    const view = viewRef.current
    if (!view) return null
    const t = view.renderer.interaction.transform
    const canvasEl = view.renderer.canvas
    const vw = canvasEl.clientWidth
    const vh = canvasEl.clientHeight
    if (!vw || !vh) return null
    return {
      left: -t.x,
      top: -t.y,
      right: vw / t.k - t.x,
      bottom: vh / t.k - t.y,
    }
  }, [viewRef])

  // ── click to navigate ──
  const panToPointer = useCallback(
    (e: React.PointerEvent) => {
      const view = viewRef.current
      if (!view) return
      const wc = getWorldCanvas()
      if (!wc) return

      const canvas = canvasRef.current
      const rect = canvas?.getBoundingClientRect()
      if (!canvas || !rect) return

      const cssW = canvas.clientWidth || 1
      const cssH = canvas.clientHeight || 1
      const mx = e.clientX - rect.left
      const my = e.clientY - rect.top

      // 小地图坐标 → 世界坐标（与世界画布映射一致）
      const worldX = wc.x + (mx / cssW) * wc.width
      const worldY = wc.y + (my / cssH) * wc.height

      // Pan camera so this world point is at canvas center
      const t = view.renderer.interaction.transform
      const canvasEl = view.renderer.canvas
      t.x = canvasEl.clientWidth / (2 * t.k) - worldX
      t.y = canvasEl.clientHeight / (2 * t.k) - worldY
    },
    [viewRef, getWorldCanvas],
  )

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      // 捕获指针：拖拽移出小地图后仍持续收到 pointermove / pointerup
      e.currentTarget.setPointerCapture?.(e.pointerId)
      isPointerDown.current = true
      panToPointer(e)
    },
    [panToPointer],
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isPointerDown.current) return
      panToPointer(e)
    },
    [panToPointer],
  )

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    isPointerDown.current = false
    try {
      e.currentTarget.releasePointerCapture?.(e.pointerId)
    } catch {
      // 未捕获指针时忽略
    }
  }, [])

  // ── render loop ──
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")!

    const render = () => {
      const cssW = canvas.clientWidth
      const cssH = canvas.clientHeight
      if (cssW === 0 || cssH === 0) {
        rafRef.current = requestAnimationFrame(render)
        return
      }
      const dpr = window.devicePixelRatio || 1
      const pxW = Math.round(cssW * dpr)
      const pxH = Math.round(cssH * dpr)
      if (canvas.width !== pxW || canvas.height !== pxH) {
        canvas.width = pxW
        canvas.height = pxH
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const view = viewRef.current
      const graphData = getGraphData()
      const wc = getWorldCanvas()
      const vp = getViewport()
      if (!view || !graphData || !wc || !vp) {
        rafRef.current = requestAnimationFrame(render)
        return
      }

      // 颜色随主题（与 styles/tokens.css 同源）
      const p = getPalette(theme)

      // 世界画布 → 小地图（按固定宽高成比例映射）
      const toMini = (wx: number, wy: number): [number, number] => [
        ((wx - wc.x) / wc.width) * cssW,
        ((wy - wc.y) / wc.height) * cssH,
      ]

      ctx.clearRect(0, 0, cssW, cssH)

      // background
      ctx.fillStyle = p.canvas
      ctx.beginPath()
      ctx.roundRect(0, 0, cssW, cssH, 6)
      ctx.fill()

      // clip
      ctx.save()
      ctx.beginPath()
      ctx.roundRect(0, 0, cssW, cssH, 6)
      ctx.clip()

      // 节点 → 位置索引
      const posMap = new Map<string, { x: number; y: number }>()
      for (const n of graphData.nodes) {
        posMap.set(String(n.id), { x: n.x ?? 0, y: n.y ?? 0 })
      }

      // ── draw links ──
      ctx.strokeStyle = hexToRgba(p.link.default, 0.5)
      ctx.lineWidth = 0.5
      for (const link of graphData.links) {
        const [sid, tid] = linkEndpoints(link)
        const sp = posMap.get(sid)
        const tp = posMap.get(tid)
        if (!sp || !tp) continue
        const [sx, sy] = toMini(sp.x, sp.y)
        const [tx, ty] = toMini(tp.x, tp.y)
        ctx.beginPath()
        ctx.moveTo(sx, sy)
        ctx.lineTo(tx, ty)
        ctx.stroke()
      }

      // ── draw nodes ──
      ctx.fillStyle = hexToRgba(p.text, 0.6)
      for (const n of graphData.nodes) {
        const [nx, ny] = toMini(n.x ?? 0, n.y ?? 0)
        ctx.beginPath()
        ctx.arc(nx, ny, NODE_DOT_RADIUS, 0, Math.PI * 2)
        ctx.fill()
      }

      // ── draw viewport rect（蓝框）──
      // 宽高比例 = 视口大小 / 世界画布大小
      const ratioW = (vp.right - vp.left) / wc.width
      const ratioH = (vp.bottom - vp.top) / wc.height
      // 蓝框大小 = 小地图固定宽高 × 比例
      const boxW = cssW * ratioW
      const boxH = cssH * ratioH
      // 蓝框位置 = 视口左上角 → 小地图坐标（左上角锚点）
      const boxX = ((vp.left - wc.x) / wc.width) * cssW
      const boxY = ((vp.top - wc.y) / wc.height) * cssH

      ctx.fillStyle = VIEWPORT_RECT_COLOR
      ctx.fillRect(boxX, boxY, boxW, boxH)
      ctx.strokeStyle = VIEWPORT_RECT_STROKE
      ctx.lineWidth = 1
      ctx.strokeRect(boxX, boxY, boxW, boxH)

      ctx.restore()

      // border
      ctx.strokeStyle = hexToRgba(p.muted, 0.6)
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.roundRect(0, 0, cssW, cssH, 6)
      ctx.stroke()

      rafRef.current = requestAnimationFrame(render)
    }

    rafRef.current = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(rafRef.current)
    }
  }, [viewRef, getGraphData, getWorldCanvas, getViewport, theme])

  return (
    <div
      style={{
        position: "absolute",
        bottom: 12,
        right: 12,
        width: MINIMAP_W,
        height: MINIMAP_H,
        borderRadius: 6,
        boxShadow: "var(--shadow)",
        cursor: "pointer",
        zIndex: 100,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%", display: "block" }}
      />
    </div>
  )
}
