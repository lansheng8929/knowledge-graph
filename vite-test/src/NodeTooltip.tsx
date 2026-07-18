import type { GraphNode } from "@ra-sdk/knowledge-graph/client/type"

interface NodeTooltipProps {
  node: GraphNode
  getRulesCount: (nodeId: string) => number
  pos: { x: number; y: number }
}

export function NodeTooltip({ node, getRulesCount, pos }: NodeTooltipProps) {
  return (
    <div
      style={{
        position: "fixed",
        left: pos.x + 16,
        top: pos.y - 10,
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
      <div style={{ color: "#e94560", fontWeight: "bold", marginBottom: 4 }}>
        {node.id}
      </div>
      <div>
        <span style={{ color: "#8899aa" }}>label: </span>
        {node.data?.label ?? "-"}
      </div>
      <div>
        <span style={{ color: "#8899aa" }}>type: </span>
        {node.data?.nodeType ?? "-"}
      </div>
      <div>
        <span style={{ color: "#8899aa" }}>count: </span>
        {node.data?.count ?? 0}
        <span style={{ color: "#8899aa" }}> / total: </span>
        {node.data?.total ?? 0}
      </div>
      <div>
        <span style={{ color: "#8899aa" }}>rules: </span>
        {getRulesCount(node.id)}
      </div>
    </div>
  )
}
