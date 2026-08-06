import { useState, useEffect, useRef } from "react"
import type { GraphModel } from "@lansheng/knowledge-graph"
import type {
  GraphNode,
  GraphLink,
} from "@lansheng/knowledge-graph/client/type"

export interface UseGraphHoverCallbacks {
  onPlusToolClick?: (node: GraphNode) => void
  onNodeContextMenu?: (node: GraphNode, x: number, y: number) => void
}

/**
 * 图交互状态（hover / 选中）与业务事件订阅。
 * 通过 model.events.subscribe 注册 nodeHover / linkHover / nodeClick /
 * selectionChange / plusToolClick / nodeRightClick，驱动 React 状态。
 */
export function useGraphHover(
  modelRef: React.RefObject<GraphModel | null>,
  callbacks: UseGraphHoverCallbacks = {},
) {
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null)
  const [hoveredLink, setHoveredLink] = useState<GraphLink | null>(null)
  const [selectedNodeIds, setSelectedNodeIds] = useState<Set<string>>(new Set())

  // callbacks 用 ref 缓存，避免重复订阅
  const callbacksRef = useRef(callbacks)
  callbacksRef.current = callbacks

  useEffect(() => {
    const model = modelRef.current
    if (!model) return

    // hover 事件
    const unsub1 = model.events.subscribe("nodeHover", (node) => {
      setHoveredNode(node)
      if (node) setHoveredLink(null)
    })
    const unsub2 = model.events.subscribe("linkHover", ({ link }) => {
      setHoveredLink(link)
      if (link) setHoveredNode(null)
    })
    // 业务事件
    const unsub3 = model.events.subscribe("plusToolClick", (node) => {
      if (node) callbacksRef.current.onPlusToolClick?.(node)
    })
    const unsub4 = model.events.subscribe("nodeRightClick", (data) => {
      if (data)
        callbacksRef.current.onNodeContextMenu?.(
          data.node,
          data.screenPos.x,
          data.screenPos.y,
        )
    })
    // 点击选中
    const unsub5 = model.events.subscribe("nodeClick", ({ node, ctrlKey }) => {
      if (!node) return
      setSelectedNodeIds((prev) => {
        const next = new Set(prev)
        if (ctrlKey) {
          if (next.has(node.id)) next.delete(node.id)
          else next.add(node.id)
        } else {
          next.clear()
          next.add(node.id)
        }
        return next
      })
    })
    // 框选等外部操作同步到 React state（引用比较避免循环）
    const unsub6 = model.events.subscribe("selectionChange", ({ nodeIds }) => {
      setSelectedNodeIds((prev) => {
        const incoming = new Set(nodeIds)
        if (
          prev.size === incoming.size &&
          [...prev].every((id) => incoming.has(id))
        ) {
          return prev
        }
        return incoming
      })
    })
    return () => {
      unsub1()
      unsub2()
      unsub3()
      unsub4()
      unsub5()
      unsub6()
    }
  }, [modelRef.current])

  // 同步选中状态到 model.stateManager
  const selectedArr = [...selectedNodeIds]
  useEffect(() => {
    const model = modelRef.current
    if (!model) return
    model.stateManager.setSelectedNodes(selectedArr, [])
  }, [modelRef.current, selectedArr.join(",")])

  return {
    ctx: {
      hoveredNode,
      setHoveredNode,
      hoveredLink,
      setHoveredLink,
      selectedNodeIds,
      setSelectedNodeIds,
    },
  }
}
