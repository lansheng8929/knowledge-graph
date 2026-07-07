import React, {
  useRef,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useState,
} from "react"
import type { GraphModel } from "../model"
import type { DefaultGraphDataGenerics, GraphDataGenerics } from "./type"

interface MinimapProps<G extends GraphDataGenerics> {
  className?: string
  style?: React.CSSProperties
  graphModel: GraphModel<G>
  transform: {
    k: number
    x: number
    y: number
  }
  mainCanvasWidth: number
  mainCanvasHeight: number
  miniWidth?: number
  miniHeight?: number
  showViewport?: boolean
  onMinimapClick?: (worldX: number, worldY: number) => void
  // 新增：视口拖拽回调
  onViewportDrag?: (worldX: number, worldY: number) => void
}

interface BBox {
  minX: number
  minY: number
  maxX: number
  maxY: number
}

export interface MinimapRef {
  exportPreviewImage: () => string | null
}

const MinimapInner = <G extends GraphDataGenerics>(
  {
    className,
    style,
    graphModel,
    transform,
    mainCanvasWidth,
    mainCanvasHeight,
    miniWidth = 200,
    miniHeight = 150,
    showViewport = true,
    onMinimapClick,
    onViewportDrag,
  }: MinimapProps<G>,
  ref: React.ForwardedRef<MinimapRef>,
) => {
  const miniRef = useRef<HTMLCanvasElement>(null)
  const bboxRef = useRef<BBox>({ minX: 0, minY: 0, maxX: 0, maxY: 0 })
  const scaleRef = useRef<number>(1)
  const paddingRef = useRef<number>(10)
  const [isDragging, setIsDragging] = useState(false)

  useImperativeHandle(ref, () => ({
    exportPreviewImage: () => {
      const canvas = miniRef.current
      if (!canvas) return null
      return canvas.toDataURL("image/png")
    },
  }))

  // world坐标 -> minimap像素坐标
  const worldToMini = (wx: number, wy: number): [number, number] => {
    const bbox = bboxRef.current
    const scale = scaleRef.current
    const padding = paddingRef.current
    const mx = padding + (wx - bbox.minX) * scale
    const my = padding + (wy - bbox.minY) * scale
    return [mx, my]
  }

  // minimap像素坐标 -> world坐标
  const miniToWorld = (mx: number, my: number): [number, number] => {
    const bbox = bboxRef.current
    const scale = scaleRef.current
    const padding = paddingRef.current
    const wx = bbox.minX + (mx - padding) / scale
    const wy = bbox.minY + (my - padding) / scale
    return [wx, wy]
  }

  const handleDataChange = () => {
    const graphData = graphModel.getGraphModelData().graphData

    const bbox = (() => {
      const nodes = graphData?.nodes || []

      if (!nodes.length) {
        return { minX: 0, minY: 0, maxX: 0, maxY: 0 }
      }

      let minX = Infinity,
        minY = Infinity,
        maxX = -Infinity,
        maxY = -Infinity

      nodes.forEach((n) => {
        const x = n.x !== undefined ? n.x : 0
        const y = n.y !== undefined ? n.y : 0
        if (x < minX) minX = x
        if (y < minY) minY = y
        if (x > maxX) maxX = x
        if (y > maxY) maxY = y
      })

      if (minX === maxX) {
        minX -= 1
        maxX += 1
      }
      if (minY === maxY) {
        minY -= 1
        maxY += 1
      }

      return { minX, minY, maxX, maxY }
    })()

    bboxRef.current = bbox

    const mini = miniRef.current
    if (!mini || !graphData) return

    const ctx = mini.getContext("2d")
    if (!ctx) return

    const mw = mini.width
    const mh = mini.height

    ctx.clearRect(0, 0, mw, mh)

    const padding = 10
    paddingRef.current = padding
    const worldW = bbox.maxX - bbox.minX
    const worldH = bbox.maxY - bbox.minY
    const scale = Math.min(
      (mw - 2 * padding) / worldW,
      (mh - 2 * padding) / worldH,
    )
    scaleRef.current = scale

    // 绘制连线
    ctx.lineWidth = 1
    ctx.globalAlpha = 0.6
    ctx.beginPath()
    ;(graphData.links || []).forEach((l) => {
      const s =
        typeof l.source === "object"
          ? l.source
          : graphData.nodes.find((n) => n.id === l.source)
      const t =
        typeof l.target === "object"
          ? l.target
          : graphData.nodes.find((n) => n.id === l.target)
      if (!s || !t) return
      const [sx, sy] = worldToMini(s.x || 0, s.y || 0)
      const [tx, ty] = worldToMini(t.x || 0, t.y || 0)
      ctx.moveTo(sx, sy)
      ctx.lineTo(tx, ty)
    })
    ctx.strokeStyle = "rgba(120,120,120,0.5)"
    ctx.stroke()

    // 绘制节点
    ctx.globalAlpha = 1
    ;(graphData.nodes || []).forEach((n) => {
      const [x, y] = worldToMini(n.x || 0, n.y || 0)
      ctx.beginPath()
      ctx.arc(x, y, 2, 0, 2 * Math.PI)
      ctx.fillStyle =
        n.data?.stateType === "root"
          ? "rgba(255, 165, 0, 0.5)"
          : "rgba(51, 153, 255, 0.5)"
      ctx.fill()
    })

    // 绘制视口矩形
    if (showViewport) {
      const leftWorld = -transform.x / transform.k
      const topWorld = -transform.y / transform.k
      const viewWWorld = mainCanvasWidth / transform.k
      const viewHWorld = mainCanvasHeight / transform.k

      const [vx, vy] = worldToMini(leftWorld, topWorld)
      const [vx2, vy2] = worldToMini(
        leftWorld + viewWWorld,
        topWorld + viewHWorld,
      )
      const vw = vx2 - vx
      const vh = vy2 - vy

      ctx.lineWidth = 2
      ctx.strokeStyle = "rgba(255,80,30,0.9)"
      ctx.fillStyle = "rgba(255,80,30,0.08)"
      ctx.strokeRect(vx, vy, vw, vh)
      ctx.fillRect(vx, vy, vw, vh)
    }
  }

  graphModel.events.subscribe("framePost", handleDataChange)

  return (
    <canvas
      ref={miniRef}
      width={miniWidth}
      height={miniHeight}
      // onClick={handleMinimapClick}
      className={className}
      style={{
        position: "absolute",
        right: 12,
        bottom: 12,
        ...style,
      }}
    />
  )
}

export const Minimap = forwardRef(MinimapInner) as <
  G extends GraphDataGenerics = DefaultGraphDataGenerics,
>(
  props: MinimapProps<G> & {
    ref?: React.ForwardedRef<MinimapRef>
  },
) => React.ReactElement
