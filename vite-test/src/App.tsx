import { useRef, useEffect, useState, useCallback } from "react"
import { GraphModel, GraphView, type Layout } from "@ra-sdk/knowledge-graph"
import type {
  GraphNode,
  GraphViewModel,
  DefaultGraphDataGenerics,
} from "@ra-sdk/knowledge-graph/client/type"

// ─── 自定义布局演示：辐射布局 ──────────────────────────
class RadialLayout implements Layout {
  private nodes: Array<{ id: string; x?: number; y?: number }> = []
  private links: Array<{ source: string; target: string }> = []
  private timer: ReturnType<typeof setTimeout> | null = null
  private step = 0
  private centerX = 0
  private centerY = 0

  onTick?: (nodes: Array<{ id: string; x: number; y: number }>) => void
  onEnd?: () => void

  setData(nodes: any[], links: any[]): void {
    this.nodes = nodes.map((n) => ({ id: n.id, x: n.x, y: n.y }))
    this.links = links.map((l) => ({
      source: typeof l.source === "object" ? l.source.id : l.source,
      target: typeof l.target === "object" ? l.target.id : l.target,
    }))
  }

  start(): void {
    this.stop()
    this.step = 0
    this.centerX = 0
    this.centerY = 0

    // Compute degree for each node to place high-degree nodes near center
    const degree = new Map<string, number>()
    for (const n of this.nodes) degree.set(n.id, 0)
    for (const l of this.links) {
      degree.set(l.source, (degree.get(l.source) || 0) + 1)
      degree.set(l.target, (degree.get(l.target) || 0) + 1)
    }

    const sorted = [...this.nodes].sort(
      (a, b) => (degree.get(b.id) || 0) - (degree.get(a.id) || 0),
    )
    const total = this.nodes.length
    if (total === 0) return

    // Animate: assign radial positions over multiple ticks
    const tick = () => {
      const count = Math.min(this.step + 5, total)
      const placed = new Set<string>()

      for (let i = 0; i < count; i++) {
        const n = sorted[i]
        if (!n || placed.has(n.id)) continue
        placed.add(n.id)

        const angle = (i / count) * Math.PI * 2
        const radius = 60 + (degree.get(n.id) || 0) * 8
        n.x = this.centerX + Math.cos(angle) * radius
        n.y = this.centerY + Math.sin(angle) * radius
      }

      this.step = count

      if (this.onTick) {
        this.onTick(
          this.nodes.map((n) => ({ id: n.id, x: n.x ?? 0, y: n.y ?? 0 })),
        )
      }

      if (count < total) {
        this.timer = setTimeout(tick, 50)
      } else {
        this.onEnd?.()
      }
    }

    this.timer = setTimeout(tick, 16)
  }

  stop(): void {
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
  }
  reheat(): void {
    this.start()
  }
  fixNode(_id: string, _x?: number, _y?: number): void {}
  releaseNode(_id: string): void {}
  destroy(): void {
    this.stop()
  }
}

/** Generate sample graph data */
function generateSampleData(
  nodeCount = 50,
): GraphViewModel<DefaultGraphDataGenerics> {
  const nodes: any[] = []
  const links: any[] = []

  for (let i = 0; i < nodeCount; i++) {
    nodes.push({
      id: `node-${i}`,
      x: (Math.random() - 0.5) * 400,
      y: (Math.random() - 0.5) * 400,
      data: {
        nodeType: "default",
        stateType: "regular",
        label: `Node ${i}`,
        count: Math.floor(Math.random() * 100),
        total: 100,
      },
    })
  }

  // Create random links
  for (let i = 0; i < nodeCount * 1.5; i++) {
    const source = Math.floor(Math.random() * nodeCount)
    let target = Math.floor(Math.random() * nodeCount)
    if (target === source) target = (target + 1) % nodeCount

    links.push({
      id: `link-${i}`,
      source: `node-${source}`,
      target: `node-${target}`,
      data: {
        linkType: "default",
        stateType: "regular",
        label: `Link ${i}`,
        color: "#999999",
      },
    })
  }

  return { graphData: { nodes, links } }
}

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<GraphView | null>(null)
  const [view, setView] = useState<GraphView | null>(null)
  const [nodeCount, setNodeCount] = useState(50)
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null)
  const hoveredNodeRef = useRef<GraphNode | null>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [contextMenu, setContextMenu] = useState<{
    node: GraphNode
    x: number
    y: number
  } | null>(null)
  const [useRadialLayout, setUseRadialLayout] = useState(false)
  const [useCpuPicker, setUseCpuPicker] = useState(false)
  // Keep ref in sync for use inside event listeners
  hoveredNodeRef.current = hoveredNode

  // Track mouse position for tooltip positioning
  const handleMouseMove = useCallback((e: MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY })
  }, [])

  // Close context menu on click outside
  useEffect(() => {
    const handleClick = () => setContextMenu(null)
    document.addEventListener("click", handleClick)
    return () => document.removeEventListener("click", handleClick)
  }, [])

  // Close context menu on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setContextMenu(null)
    }
    document.addEventListener("keydown", handleKey)
    return () => document.removeEventListener("keydown", handleKey)
  }, [])

  useEffect(() => {
    if (!containerRef.current) return

    const initData = generateSampleData(nodeCount)
    const model = new GraphModel({ initData })

    // Use custom layout when toggled
    const layout = useRadialLayout ? new RadialLayout() : undefined

    const graphView = new GraphView({
      container: containerRef.current,
      graphModel: model,
      backgroundColor: "#1a1a2e",
      arrowDisplay: false,
      layout,
      pickerMode: useCpuPicker ? "cpu" : "gpu",
      mapNode: (node) => ({
        x: node.x ?? 0,
        y: node.y ?? 0,
        radius: 8,
        color: [1.0, 1.0, 1.0, 1.0],
        strokeColor: [1.0, 1.0, 1.0, 1.0],
        strokeWidth: 0,
        id: node.id,
        label: node.data?.label,
      }),
      forceConfig: {
        repulsion: -200,
        linkDistance: 100,
        linkStrength: 0.2,
        centerStrength: 0.1,
        velocityDecay: 0.4,
      },
    })

    viewRef.current = graphView

    // Listen to events
    model.events.subscribe("nodeClick", (node) => {
      setSelectedNode(node?.id ?? null)
      console.log("Node clicked:", node?.id)
    })

    model.events.subscribe("nodeHover", (node) => {
      setHoveredNode(node)
      console.log("Node hovered:", node?.id)
    })

    // Track mouse for tooltip positioning
    const container = containerRef.current
    container.addEventListener("mousemove", handleMouseMove)

    // Right-click context menu (uses ref to avoid stale closure)
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
      const node = hoveredNodeRef.current
      if (node) {
        setContextMenu({ node, x: e.clientX, y: e.clientY })
      }
    }
    container.addEventListener("contextmenu", handleContextMenu)

    setView(graphView)

    return () => {
      container.removeEventListener("mousemove", handleMouseMove)
      container.removeEventListener("contextmenu", handleContextMenu)
      graphView.destroy()
      viewRef.current = null
    }
  }, [nodeCount, useRadialLayout, useCpuPicker])

  const handleReset = useCallback(() => {
    if (!view) return
    const newData = generateSampleData(nodeCount)
    view.updateView(newData)
    setSelectedNode(null)
  }, [view, nodeCount])

  const handleFitView = useCallback(() => {
    view?.fitView(50)
  }, [view])

  const handleReheat = useCallback(() => {
    view?.reheat(0.3)
  }, [view])

  const handleFocusSelected = useCallback(() => {
    if (selectedNode && view) {
      view.focusNodeById(selectedNode)
    }
  }, [selectedNode, view])

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Toolbar */}
      <div
        style={{
          padding: "8px 16px",
          background: "#16213e",
          display: "flex",
          gap: "8px",
          alignItems: "center",
          borderBottom: "1px solid #0f3460",
          flexWrap: "wrap",
        }}
      >
        <span
          style={{ color: "#e94560", fontWeight: "bold", marginRight: "16px" }}
        >
          Knowledge Graph (Canvas 2D + d3-force)
        </span>
        <label style={{ color: "#ccc", fontSize: "14px" }}>
          Nodes:
          <input
            type="number"
            value={nodeCount}
            onChange={(e) => setNodeCount(Number(e.target.value))}
            min={5}
            max={500}
            style={{
              marginLeft: "6px",
              width: "60px",
              padding: "2px 6px",
              background: "#0f3460",
              color: "#fff",
              border: "1px solid #e94560",
              borderRadius: "4px",
            }}
          />
        </label>
        <button onClick={handleReset} style={btnStyle}>
          Reset Data
        </button>
        <button onClick={handleFitView} style={btnStyle}>
          Fit View
        </button>
        <button onClick={handleReheat} style={btnStyle}>
          Reheat
        </button>
        <button
          onClick={handleFocusSelected}
          style={btnStyle}
          disabled={!selectedNode}
        >
          Focus Selected
        </button>{" "}
        <button
          onClick={() => setUseRadialLayout((v) => !v)}
          style={{
            ...btnStyle,
            background: useRadialLayout ? "#e94560" : "#0f3460",
          }}
        >
          {useRadialLayout ? "🔴 Radial Layout" : "⚫ d3-force"}
        </button>
        <button
          onClick={() => setUseCpuPicker((v) => !v)}
          style={{
            ...btnStyle,
            background: useCpuPicker ? "#e94560" : "#0f3460",
          }}
        >
          {useCpuPicker ? "🟡 CPU Pick" : "🔵 GPU Pick"}
        </button>
        {selectedNode && (
          <span
            style={{ color: "#e94560", fontSize: "13px", marginLeft: "auto" }}
          >
            Selected: {selectedNode}
          </span>
        )}
      </div>

      {/* Graph container */}
      <div
        ref={containerRef}
        style={{ flex: 1, background: "#1a1a2e", position: "relative" }}
      >
        {/* DOM tooltip */}
        {hoveredNode && (
          <div
            ref={tooltipRef}
            style={{
              position: "fixed",
              left: mousePos.x + 16,
              top: mousePos.y - 10,
              background: "#0f3460",
              color: "#fff",
              padding: "10px 14px",
              borderRadius: "8px",
              fontSize: "13px",
              lineHeight: 1.6,
              border: "1px solid #e94560",
              boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
              pointerEvents: "none",
              zIndex: 1000,
              whiteSpace: "nowrap",
              fontFamily: "monospace",
            }}
          >
            <div
              style={{ color: "#e94560", fontWeight: "bold", marginBottom: 4 }}
            >
              {hoveredNode.id}
            </div>
            <div>
              <span style={{ color: "#8899aa" }}>label: </span>
              {hoveredNode.data?.label ?? "-"}
            </div>
            <div>
              <span style={{ color: "#8899aa" }}>count: </span>
              {hoveredNode.data?.count ?? 0}
              <span style={{ color: "#8899aa" }}> / total: </span>
              {hoveredNode.data?.total ?? 0}
            </div>
            <div>
              <span style={{ color: "#8899aa" }}>position: </span>(
              {hoveredNode.x?.toFixed(1) ?? "?"},{" "}
              {hoveredNode.y?.toFixed(1) ?? "?"})
            </div>
            {hoveredNode.data?.nodeType && (
              <div>
                <span style={{ color: "#8899aa" }}>type: </span>
                {hoveredNode.data.nodeType}
              </div>
            )}
          </div>
        )}

        {/* Context menu */}
        {contextMenu && (
          <div
            ref={menuRef}
            style={{
              position: "fixed",
              left: contextMenu.x,
              top: contextMenu.y,
              background: "#16213e",
              color: "#fff",
              border: "1px solid #e94560",
              borderRadius: "6px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
              zIndex: 1100,
              minWidth: "160px",
              padding: "4px 0",
              fontFamily: "monospace",
              fontSize: "13px",
            }}
          >
            <div
              style={{
                padding: "8px 14px",
                borderBottom: "1px solid #0f3460",
                color: "#8899aa",
              }}
            >
              {contextMenu.node.id}
            </div>
            <div
              style={menuItemStyle}
              onClick={() => {
                setSelectedNode(contextMenu.node.id)
                view?.focusNodeById(contextMenu.node.id)
                setContextMenu(null)
              }}
            >
              🔍 Focus
            </div>
            <div
              style={menuItemStyle}
              onClick={() => {
                view?.fitView(50)
                setContextMenu(null)
              }}
            >
              📐 Fit View
            </div>
            <div
              style={menuItemStyle}
              onClick={() => {
                view?.reheat(0.3)
                setContextMenu(null)
              }}
            >
              🔄 Reheat
            </div>
            <div
              style={{
                ...menuItemStyle,
                borderTop: "1px solid #0f3460",
                color: "#e94560",
              }}
              onClick={() => setContextMenu(null)}
            >
              ✕ Close
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const menuItemStyle: React.CSSProperties = {
  padding: "8px 14px",
  cursor: "pointer",
  userSelect: "none",
}

const btnStyle: React.CSSProperties = {
  padding: "4px 12px",
  background: "#0f3460",
  color: "#fff",
  border: "1px solid #e94560",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "13px",
}
