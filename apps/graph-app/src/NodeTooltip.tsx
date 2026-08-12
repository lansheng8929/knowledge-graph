import { PanelContainer, PanelLayer } from "./panel"
import { useAppCtx } from "./AppContext"
import { nodeTypeLabel } from "./i18n"

interface NodeTooltipProps {
  loadedNeighbors: Record<string, { out: number; in: number }>
}

export function NodeTooltip({ loadedNeighbors }: NodeTooltipProps) {
  const { hoveredNode, mousePos } = useAppCtx()
  const node = hoveredNode!
  const pos = mousePos
  const neighbors = (node.data as any)?.neighbors ?? {}
  const neighborCount = Object.keys(neighbors).length
  const totalConnected = Object.values(neighbors).reduce(
    (sum: number, rels: any) =>
      sum +
      Object.values(rels).reduce((a: number, b: any) => a + (b.total ?? 0), 0),
    0,
  )

  return (
    <PanelContainer
      id="node-tooltip"
      layer={PanelLayer.Tooltip}
      position={{ x: pos.x + 16, y: pos.y - 12 }}
      style={{
        width: "100%",
        padding: "10px 14px",
        borderRadius: "8px",
        fontSize: "13px",
        lineHeight: 1.6,
        border: "1px solid rgb(var(--primary))",
        boxShadow: "var(--shadow-lg)",
        pointerEvents: "none",
        whiteSpace: "nowrap",
        fontFamily: "monospace",
        background: "rgb(var(--tooltip-bg))",
        color: "rgb(var(--foreground))",
      }}
    >
      <div
        style={{
          color: "#e94560",
          fontWeight: "bold",
          marginBottom: 4,
          fontSize: "14px",
        }}
      >
        {node.data?.label ?? node.id}
      </div>
      <div
        style={{
          color: "rgb(var(--muted))",
          fontSize: "11px",
          marginBottom: 6,
        }}
      >
        {nodeTypeLabel(node.data?.nodeType)}
        {" · "}
        {neighborCount} 类关联 · 共 {totalConnected} 条
      </div>
      <div
        style={{
          borderTop: "1px solid rgb(var(--border))",
          margin: "4px 0",
          paddingTop: 4,
        }}
      >
        {Object.entries(neighbors).map(([type, rels]: [string, any]) => {
          const entries = Object.entries(rels) as [
            string,
            { out: number; in: number; total: number },
          ][]
          const loaded = loadedNeighbors[type] ?? { out: 0, in: 0 }
          const totalLoaded = loaded.out + loaded.in
          const remaining =
            entries.reduce((a, [, info]) => a + info.total, 0) - totalLoaded
          return (
            <div key={type} style={{ fontSize: "12px", lineHeight: 1.8 }}>
              <span
                style={{ color: "rgb(var(--foreground))", fontWeight: "bold" }}
              >
                {nodeTypeLabel(type)}
              </span>
              <span
                style={{
                  color: "rgb(var(--muted))",
                  marginLeft: 4,
                  fontSize: "11px",
                }}
              >
                {remaining > 0 ? `可拓 ${remaining}` : "已拓完"}
              </span>
            </div>
          )
        })}
      </div>
    </PanelContainer>
  )
}
