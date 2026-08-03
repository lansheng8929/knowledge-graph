import { useState, useEffect } from "react"
import type { GraphModel } from "@lansheng/knowledge-graph"
import type {
  GraphNode,
  GraphLink,
} from "@lansheng/knowledge-graph/client/type"

export interface UseGraphHoverCallbacks {
  onPlusToolClick?: (node: GraphNode) => void
  onNodeContextMenu?: (node: GraphNode, x: number, y: number) => void
}

export function useGraphHover(
  modelRef: React.RefObject<GraphModel | null>,
  callbacks: UseGraphHoverCallbacks = {},
) {
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null)
  const [hoveredLink, setHoveredLink] = useState<GraphLink | null>(null)
  const [selectedNodeIds, setSelectedNodeIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    const model = modelRef.current
    if (!model) return

    const unsub1 = model.events.subscribe("nodeHover", (node) => {
      setHoveredNode(node)
      if (node) setHoveredLink(null)
    })
    const unsub2 = model.events.subscribe("linkHover", ({ link }) => {
      setHoveredLink(link)
      if (link) setHoveredNode(null)
    })
    const unsub3 = model.events.subscribe("plusToolClick", (node) => {
      if (node) callbacks.onPlusToolClick?.(node)
    })
    const unsub4 = model.events.subscribe("nodeRightClick", (data) => {
      if (data)
        callbacks.onNodeContextMenu?.(
          data.node,
          data.screenPos.x,
          data.screenPos.y,
        )
    })
    const unsub5 = model.events.subscribe("nodeClick", ({ node, ctrlKey }) => {
      if (!node) return
      console.log("[nodeClick]", node.id)
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
    // 订阅 selectionChange —— 框选等外部操作同步到 React state
    // 通过引用比较避免循环：内容相同返回旧引用，Effect 不会重复执行
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
