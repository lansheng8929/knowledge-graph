import { PanelContainer, PanelLayer } from "./panel"
import { useAppCtx } from "./AppContext"
import { RELATION_LABELS } from "./labels"
import { linkEndpoints } from "./link-utils"

interface LinkTooltipProps {}

export function LinkTooltip(_props: LinkTooltipProps) {
  const { hoveredLink, mousePos } = useAppCtx()
  const link = hoveredLink!
  const pos = mousePos
  const linkData = link.data ?? {}
  const linkType = (linkData as any).linkType ?? ""
  const label = (linkData as any).label ?? ""
  const time = (linkData as any).time ?? ""
  const intimacy = (linkData as any).intimacy
  const [sourceId, targetId] = linkEndpoints(link)

  return (
    <PanelContainer
      id="link-tooltip"
      layer={PanelLayer.Tooltip}
      position={{ x: pos.x + 16, y: pos.y - 12 }}
      style={{
        padding: "10px 14px",
        borderRadius: "8px",
        fontSize: "13px",
        lineHeight: 1.6,
        border: "1px solid #4fc3f7",
        boxShadow: "var(--shadow-lg)",
        pointerEvents: "none",
        whiteSpace: "nowrap",
        fontFamily: "monospace",
        background: "rgb(var(--tooltip-bg))",
        color: "rgb(var(--foreground))",
      }}
    >
      {/* 关系类型 */}
      <div
        style={{
          color: "#0288d1",
          fontWeight: "bold",
          marginBottom: 4,
          fontSize: "14px",
        }}
      >
        {RELATION_LABELS[linkType] ?? linkType}
      </div>

      {/* 边 ID */}
      <div
        style={{
          color: "rgb(var(--muted))",
          fontSize: "11px",
          marginBottom: 6,
        }}
      >
        {link.id}
      </div>

      <div
        style={{
          borderTop: "1px solid rgb(var(--border))",
          margin: "4px 0",
          paddingTop: 4,
        }}
      >
        {/* 边标签 */}
        {label && (
          <div style={{ fontSize: "12px", lineHeight: 1.8, color: "#333" }}>
            <span style={{ color: "#8899aa" }}>描述: </span>
            <span style={{ fontWeight: "bold" }}>{label}</span>
          </div>
        )}

        {time && (
          <div style={{ fontSize: "12px", lineHeight: 1.8, color: "#333" }}>
            <span style={{ color: "#8899aa" }}>时间: </span>
            <span style={{ fontWeight: "bold" }}>{time}</span>
          </div>
        )}

        {/* 亲密度 */}
        {intimacy !== undefined && intimacy !== null && (
          <div style={{ fontSize: "12px", lineHeight: 1.8, color: "#333" }}>
            <span style={{ color: "#8899aa" }}>亲密度: </span>
            <span style={{ fontWeight: "bold" }}>
              {typeof intimacy === "number"
                ? `${(intimacy * 100).toFixed(0)}%`
                : intimacy}
            </span>
          </div>
        )}

        {/* 源节点 */}
        <div style={{ fontSize: "12px", lineHeight: 1.8, color: "#333" }}>
          <span style={{ color: "#8899aa" }}>源节点: </span>
          {sourceId}
        </div>

        {/* 目标节点 */}
        <div style={{ fontSize: "12px", lineHeight: 1.8, color: "#333" }}>
          <span style={{ color: "#8899aa" }}>目标节点: </span>
          {targetId}
        </div>
      </div>
    </PanelContainer>
  )
}
