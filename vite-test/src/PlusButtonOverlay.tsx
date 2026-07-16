/**
 * PlusButtonOverlay — 在 Canvas 上方叠加 "+" 按钮的 DOM 层
 *
 * 对满足 count < total 的节点，在屏幕对应位置渲染一个可点击的 "+" 按钮。
 * 按钮位置随相机变换自动更新。
 */

import { useEffect, useRef, useState, useCallback } from "react"
import type { GraphNode } from "@ra-sdk/knowledge-graph/client/type"

interface PlusButtonOverlayProps {
  containerRef: React.RefObject<HTMLDivElement | null>
  expandableNodes: Set<string>
  graphData: { nodes: GraphNode[]; links: any[] }
  cameraTransform: { x: number; y: number; k: number }
  onPlusClick: (nodeId: string) => void
}

export function PlusButtonOverlay({
  containerRef,
  expandableNodes,
  graphData,
  cameraTransform,
  onPlusClick,
}: PlusButtonOverlayProps) {
  const [buttons, setButtons] = useState<
    Array<{ id: string; left: number; top: number; label: string }>
  >([])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const rect = container.getBoundingClientRect()
    const { x: tx, y: ty, k } = cameraTransform
    const result: Array<{ id: string; left: number; top: number; label: string }> = []

    for (const node of graphData.nodes) {
      if (!expandableNodes.has(node.id)) continue

      const wx = node.x ?? 0
      const wy = node.y ?? 0

      // world → screen
      const sx = (wx + tx) * k
      const sy = (wy + ty) * k

      // 只显示在可视区域内
      if (sx < -30 || sx > rect.width + 30 || sy < -30 || sy > rect.height + 30) continue

      // 按钮显示在节点右上方偏移
      result.push({
        id: node.id,
        left: sx + 6,
        top: sy - 16,
        label: node.data?.label ?? node.id,
      })
    }

    setButtons(result)
  }, [expandableNodes, graphData, cameraTransform, containerRef])

  const handleClick = useCallback(
    (e: React.MouseEvent, nodeId: string) => {
      e.stopPropagation()
      onPlusClick(nodeId)
    },
    [onPlusClick],
  )

  if (buttons.length === 0) return null

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 500,
      }}
    >
      {buttons.map((btn) => (
        <div
          key={btn.id}
          data-node-id={btn.id}
          title={`Expand ${btn.label}`}
          style={{
            position: "absolute",
            left: btn.left,
            top: btn.top,
            width: 20,
            height: 20,
            borderRadius: "50%",
            background: "#e94560",
            color: "#fff",
            border: "2px solid #fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "14px",
            fontWeight: "bold",
            cursor: "pointer",
            pointerEvents: "auto",
            boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
            transition: "transform 0.15s ease, background 0.15s ease",
            userSelect: "none",
          }}
          onClick={(e) => handleClick(e, btn.id)}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.3)"
            e.currentTarget.style.background = "#ff6b81"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)"
            e.currentTarget.style.background = "#e94560"
          }}
        >
          +
        </div>
      ))}
    </div>
  )
}
