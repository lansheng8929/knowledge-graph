import { PanelContainer, PanelLayer } from "./panel"
import { useTheme } from "./hooks/useTheme"
import { getPalette } from "./theme"

// ─── 中文标签映射 ─────────────────────────────────

const NODE_TYPE_LABELS: Record<string, string> = {
  person: "人员",
  phone: "手机号",
  address: "地址",
  account: "账户",
  company: "公司",
  ip: "IP地址",
  device: "设备",
  default: "默认",
}

interface LegendPanelProps {
  onClose: () => void
}

export default function LegendPanel({ onClose }: LegendPanelProps) {
  // 图例颜色随主题（与画布节点色一致）
  const { theme } = useTheme()
  const nodeColors = Object.fromEntries(
    Object.entries(getPalette(theme).node).map(([t, c]) => [t, c.bg]),
  )

  return (
    <PanelContainer
      id="legend-panel"
      layer={PanelLayer.Panel}
      draggable
      onClose={onClose}
      position={{ x: 10, y: 50 }}
      style={{
        width: 180,
        background: "rgb(var(--background))",
        border: "1px solid rgb(var(--border))",
        borderRadius: 8,
        boxShadow: "var(--shadow)",
        fontFamily: "monospace",
        fontSize: "12px",
        color: "rgb(var(--foreground))",
        overflow: "hidden",
      }}
    >
      {/* ── 节点图例 ── */}
      <div
        style={{
          padding: "10px 12px",
          borderBottom: "1px solid rgb(var(--border))",
        }}
      >
        <div
          style={{
            fontWeight: "bold",
            fontSize: "13px",
            marginBottom: 8,
            color: "rgb(var(--foreground))",
          }}
        >
          ● 节点类型
        </div>
        {Object.entries(nodeColors).map(([type, color]) => (
          <div
            key={type}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "3px 0",
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: color,
                border: "1px solid rgba(0,0,0,0.15)",
                flexShrink: 0,
              }}
            />
            <span>{NODE_TYPE_LABELS[type] ?? type}</span>
          </div>
        ))}
      </div>

      {/* ── 边图例 ── */}
      <div style={{ padding: "10px 12px" }}>
        <div
          style={{
            fontWeight: "bold",
            fontSize: "13px",
            marginBottom: 8,
            color: "rgb(var(--foreground))",
          }}
        >
          ─ 关系
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "3px 0",
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: 20,
              height: 2,
              background: "#9ca3af",
              borderRadius: 1,
              flexShrink: 0,
            }}
          />
          <span>默认关系</span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "3px 0",
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: 20,
              height: 2,
              background: "#00ccff",
              borderRadius: 1,
              flexShrink: 0,
            }}
          />
          <span>悬停高亮</span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "3px 0",
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: 20,
              height: 2,
              background: "#ffff00",
              borderRadius: 1,
              flexShrink: 0,
            }}
          />
          <span>关联高亮</span>
        </div>
      </div>
    </PanelContainer>
  )
}
