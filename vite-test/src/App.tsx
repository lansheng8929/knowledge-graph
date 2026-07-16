import { useRef, useEffect, useState, useCallback } from "react"
import {
  GraphModel,
  GraphView,
  type Layout,
  ExpansionService,
} from "@ra-sdk/knowledge-graph"
import { MetadataManager } from "@ra-sdk/knowledge-graph/meta-manager"
import { HistoryManager } from "@ra-sdk/knowledge-graph/history-manager"
import type {
  GraphNode,
  GraphViewModel,
  DefaultGraphDataGenerics,
} from "@ra-sdk/knowledge-graph/client/type"
import type {
  ExpansionRule,
  ExpansionFetcher,
} from "@ra-sdk/knowledge-graph/expansion/expansion-service"
import { RuleMenu } from "./RuleMenu"

// ─── 从 init API 获取规则并注册 ──────────────────────

interface InitResponse {
  graphData: GraphViewModel<DefaultGraphDataGenerics>["graphData"]
  rulesMap: Record<string, ExpansionRule[]>
}

async function fetchInitData(): Promise<InitResponse> {
  const res = await fetch("/api/graph/init")
  const json = await res.json()
  if (!json.success) throw new Error("Failed to fetch init data")
  return json.data as InitResponse
}

// ─── 拓出 API fetcher ────────────────────────────────

const expansionFetcher: ExpansionFetcher = async (request) => {
  const res = await fetch("/api/graph/expand", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  })
  const json = await res.json()
  if (!json.success) throw new Error("Expand failed")
  return json.data
}

// ─── 自定义布局 ─────────────────────────────────────
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

// ─── 样式 ────────────────────────────────────────────

const btnStyle: React.CSSProperties = {
  padding: "4px 12px",
  background: "#0f3460",
  color: "#fff",
  border: "1px solid #e94560",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "13px",
  fontFamily: "monospace",
}
const menuItemStyle: React.CSSProperties = {
  padding: "8px 14px",
  cursor: "pointer",
  userSelect: "none",
}

// ──────────────────────────────────────────────────────

export default function App() {
  console.log("[App] Component rendered")
  const containerRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<GraphView | null>(null)
  const [view, setView] = useState<GraphView | null>(null)
  const [loading, setLoading] = useState(true)
  const [initError, setInitError] = useState<string | null>(null)
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null)
  const hoveredNodeRef = useRef<GraphNode | null>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [contextMenu, setContextMenu] = useState<{
    node: GraphNode
    x: number
    y: number
  } | null>(null)
  const [ruleMenu, setRuleMenu] = useState<{
    node: GraphNode
    rules: ExpansionRule[]
    x: number
    y: number
  } | null>(null)
  const expansionRef = useRef<ExpansionService | null>(null)
  const [nodeCount, setNodeCount] = useState(0)

  hoveredNodeRef.current = hoveredNode

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY })
  }, [])

  // Close menus on outside click
  useEffect(() => {
    const handleClick = () => {
      setContextMenu(null)
      setRuleMenu(null)
    }
    document.addEventListener("click", handleClick)
    return () => document.removeEventListener("click", handleClick)
  }, [])

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setContextMenu(null)
        setRuleMenu(null)
      }
    }
    document.addEventListener("keydown", handleKey)
    return () => document.removeEventListener("keydown", handleKey)
  }, [])

  // ─── 主初始化：从 API 获取数据 ─────────────────────

  useEffect(() => {
    if (!containerRef.current) return
    const container = containerRef.current
    let cancelled = false

    ;(async () => {
      try {
        // 1. 从 API 获取初始数据和规则
        const initData = await fetchInitData()
        if (cancelled) return

        // 2. 创建数据模型
        const model = new GraphModel({
          initData: { graphData: initData.graphData },
        })

        // 3. 创建 ExpansionService
        const metadataManager = new MetadataManager()
        const historyManager = new HistoryManager()

        const expansionService = new ExpansionService({
          model,
          metadataManager,
          loadingManager: model.loadingManager,
          historyManager,
          fetcher: expansionFetcher,
        })

        // 注册服务端下发的规则
        expansionService.setRulesMap(initData.rulesMap)
        expansionRef.current = expansionService

        setNodeCount(initData.graphData.nodes.length)

        const graphView = new GraphView({
          container,
          graphModel: model,
          backgroundColor: "#1a1a2e",
          arrowDisplay: false,
          pickerMode: "gpu",
          mapNode: (node) => {
            const nd = node.data as Record<string, unknown> | undefined
            const count = typeof nd?.count === "number" ? nd.count : 0
            const total = typeof nd?.total === "number" ? nd.total : 0
            const canExpand = count < total
            return {
              x: node.x ?? 0,
              y: node.y ?? 0,
              radius: 8,
              color: [1.0, 1.0, 1.0, 1.0],
              strokeColor: canExpand
                ? ([0.913, 0.271, 0.376, 1.0] as const)
                : ([1.0, 1.0, 1.0, 1.0] as const),
              strokeWidth: canExpand ? 1.5 : 0,
              id: node.id,
              label: node.data?.label,
              showPlus: canExpand,
              // Plus 按钮位置：相对于节点半径的比例
              // 右上角: (0.5, -0.5), 右下角: (0.5, 0.5),
              // 左上角: (-0.5, -0.5), 左下角: (-0.5, 0.5),
              // 正上方: (0, -0.6), 正右方: (0.6, 0)
              plusOffsetX: 0.55,
              plusOffsetY: -0.55,
              plusScale: 0.3,
            }
          },
          forceConfig: {
            repulsion: -200,
            linkDistance: 100,
            linkStrength: 0.2,
            centerStrength: 0.1,
            velocityDecay: 0.4,
          },
        })

        viewRef.current = graphView

        // 4. 订阅事件
        model.events.subscribe("nodeHover", (node) => {
          setHoveredNode(node)
        })
        model.events.subscribe("dataChange", ({ graphData }) => {
          setNodeCount(graphData.nodes.length)
        })
        // "+" 徽标点击 → 执行拓出
        model.events.subscribe("plusToolClick", (node) => {
          if (node) handlePlusClick(node.id)
        })

        container.addEventListener("mousemove", handleMouseMove)

        const handleContextMenu = (e: MouseEvent) => {
          e.preventDefault()
          const node = hoveredNodeRef.current
          if (node) {
            const rules = expansionService.getRules(node.id)
            if (rules.length > 0) {
              setRuleMenu({ node, rules, x: e.clientX, y: e.clientY })
            } else {
              setContextMenu({ node, x: e.clientX, y: e.clientY })
            }
          }
        }
        container.addEventListener("contextmenu", handleContextMenu)

        // 节点计数已在前面设置

        setView(graphView)
        setLoading(false)

        return () => {
          container.removeEventListener("mousemove", handleMouseMove)
          container.removeEventListener("contextmenu", handleContextMenu)
          graphView.destroy()
          viewRef.current = null
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        console.error("Init failed:", err)
        setInitError(msg)
        setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ─── 处理 + 按钮点击 ──────────────────────────────

  const handlePlusClick = useCallback((nodeId: string) => {
    const expansion = expansionRef.current
    if (!expansion) return
    const rules = expansion.getRules(nodeId)
    if (rules.length === 0) return
    // 单条规则直接拓出，多条规则使用第一条（或用户可通过右键菜单选择）
    expansion.expand(nodeId, rules[0].id).catch(console.error)
  }, [])

  // ─── 处理规则菜单选择 ──────────────────────────────

  const handleRuleSelect = useCallback((nodeId: string, ruleId: string) => {
    setRuleMenu(null)
    expansionRef.current?.expand(nodeId, ruleId).catch(console.error)
  }, [])

  // ─── 工具按钮 ─────────────────────────────────────

  const handleReset = useCallback(() => {
    window.location.reload()
  }, [])

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
          zIndex: 2000,
        }}
      >
        <span
          style={{ color: "#e94560", fontWeight: "bold", marginRight: "16px" }}
        >
          Knowledge Graph + 规则拓出
        </span>
        <span style={{ color: "#8899aa", fontSize: "13px" }}>
          节点: {nodeCount}
        </span>
        <button onClick={handleReset} style={btnStyle}>
          🔄 Reset
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

      {/* Loading overlay (shown on top of the graph container) */}
      {loading && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#1a1a2e",
            color: "#e94560",
            fontFamily: "monospace",
            fontSize: "18px",
            zIndex: 3000,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "32px", marginBottom: "12px" }}>⟳</div>
            <div>Loading graph data...</div>
            <div style={{ fontSize: "12px", color: "#667", marginTop: "8px" }}>
              Fetching from mock API ...
            </div>
            <div
              id="runtime-error"
              style={{
                display: "none",
                marginTop: "20px",
                color: "#ff6b6b",
                fontSize: "13px",
                maxWidth: "500px",
                wordBreak: "break-all",
              }}
            ></div>
            {initError && (
              <div
                style={{
                  marginTop: "20px",
                  color: "#ff6b6b",
                  fontSize: "13px",
                  maxWidth: "500px",
                  wordBreak: "break-all",
                }}
              >
                Error: {initError}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Graph container (always rendered, so ref is always available) */}
      <div
        ref={containerRef}
        style={{
          flex: 1,
          background: "#1a1a2e",
          position: "relative",
          overflow: "hidden",
        }}
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
              <span style={{ color: "#8899aa" }}>type: </span>
              {hoveredNode.data?.nodeType ?? "-"}
            </div>
            <div>
              <span style={{ color: "#8899aa" }}>count: </span>
              {hoveredNode.data?.count ?? 0}
              <span style={{ color: "#8899aa" }}> / total: </span>
              {hoveredNode.data?.total ?? 0}
            </div>
            <div>
              <span style={{ color: "#8899aa" }}>rules: </span>
              {expansionRef.current?.getRules(hoveredNode.id).length ?? 0}
            </div>
          </div>
        )}

        {/* 规则选择菜单 */}
        {ruleMenu && (
          <RuleMenu
            node={ruleMenu.node}
            rules={ruleMenu.rules}
            x={ruleMenu.x}
            y={ruleMenu.y}
            onSelect={handleRuleSelect}
            onClose={() => setRuleMenu(null)}
          />
        )}

        {/* 普通右键菜单 */}
        {contextMenu && (
          <div
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
