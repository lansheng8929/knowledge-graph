/**
 * RuleMenu — 右键菜单，展示节点的可用拓出规则
 */

import type { GraphNode } from "@ra-sdk/knowledge-graph/client/type"
import type { ExpansionRule } from "@ra-sdk/knowledge-graph/expansion/expansion-service"

interface RuleMenuProps {
  node: GraphNode
  rules: ExpansionRule[]
  x: number
  y: number
  onSelect: (nodeId: string, ruleId: string) => void
  onClose: () => void
}

const directionLabels: Record<string, string> = {
  out: "→",
  in: "←",
  both: "↔",
}

export function RuleMenu({ node, rules, x, y, onSelect, onClose }: RuleMenuProps) {
  return (
    <div
      style={{
        position: "fixed",
        left: x,
        top: y,
        background: "#16213e",
        color: "#fff",
        border: "1px solid #e94560",
        borderRadius: "6px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
        zIndex: 1100,
        minWidth: "200px",
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
          fontSize: "11px",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        }}
      >
        {node.data?.label ?? node.id} — 选择拓出规则
      </div>

      {rules.map((rule) => (
        <div
          key={rule.id}
          style={{
            padding: "10px 14px",
            cursor: "pointer",
            userSelect: "none",
            borderBottom: "1px solid #0f3460",
            transition: "background 0.15s",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
          onClick={(e) => {
            e.stopPropagation()
            onSelect(node.id, rule.id)
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#1a3a6a"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent"
          }}
        >
          <span style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 24,
            height: 24,
            borderRadius: "50%",
            background: "#0f3460",
            color: "#e94560",
            fontSize: "12px",
            fontWeight: "bold",
            flexShrink: 0,
          }}>
            {directionLabels[rule.direction] ?? "•"}
          </span>
          <div style={{ flex: 1 }}>
            <div style={{ color: "#fff", fontWeight: "bold" }}>
              {rule.name}
            </div>
            <div style={{ color: "#667", fontSize: "11px", marginTop: 2 }}>
              {rule.relationType} → {rule.targetNodeType}
              {rule.limit ? ` (limit: ${rule.limit})` : ""}
            </div>
          </div>
        </div>
      ))}

      <div
        style={{
          padding: "8px 14px",
          cursor: "pointer",
          userSelect: "none",
          color: "#e94560",
          textAlign: "center",
          fontSize: "12px",
        }}
        onClick={(e) => {
          e.stopPropagation()
          onClose()
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#1a3a6a"
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent"
        }}
      >
        ✕ 取消
      </div>
    </div>
  )
}
