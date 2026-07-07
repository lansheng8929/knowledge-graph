import { useRef, useEffect, useState, useCallback } from "react"
import {
  GraphModel,
  GraphView,
  type GraphViewModel,
  type DefaultGraphDataGenerics,
} from "@ra-sdk/knowledge-graph"

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
  const [view, setView] = useState<GraphView | null>(null)
  const [nodeCount, setNodeCount] = useState(50)
  const [selectedNode, setSelectedNode] = useState<string | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const initData = generateSampleData(nodeCount)
    const model = new GraphModel({ initData })

    const graphView = new GraphView({
      container: containerRef.current,
      graphModel: model,
      backgroundColor: "#1a1a2e",
      arrowDisplay: false,
      forceConfig: {
        repulsion: -200,
        linkDistance: 100,
        linkStrength: 0.2,
        centerStrength: 0.1,
        velocityDecay: 0.4,
      },
    })

    // Listen to events
    model.events.subscribe("nodeClick", (node) => {
      setSelectedNode(node?.id ?? null)
      console.log("Node clicked:", node?.id)
    })

    model.events.subscribe("nodeHover", (node) => {
      console.log("Node hovered:", node?.id)
    })

    setView(graphView)

    return () => {
      graphView.destroy()
    }
  }, [nodeCount])

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
      <div ref={containerRef} style={{ flex: 1, background: "#1a1a2e" }} />
    </div>
  )
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
