import { Magnet, RotateCcw } from "lucide-react"
import { PanelContainer, PanelLayer } from "./panel"
import { useAppCtx } from "./AppContext"
import {
  INFLUENCE_MIN,
  INFLUENCE_MAX,
  INFLUENCE_STEP,
  INTIMACY_INFLUENCE_DEFAULT,
} from "./physics-config"

const panelStyle: React.CSSProperties = {
  background: "rgb(var(--background))",
  border: "1px solid rgb(var(--border))",
  borderRadius: 8,
  boxShadow: "var(--shadow)",
  fontFamily: "monospace",
  fontSize: 13,
  color: "rgb(var(--foreground))",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
}

const btn: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  background: "transparent",
  border: "1px solid rgb(var(--border) / 0.5)",
  borderRadius: 5,
  padding: "2px 6px",
  cursor: "pointer",
  fontSize: 12,
  color: "rgb(var(--foreground))",
}

/**
 * PhysicsPanel — 引力调节面板：调节「亲密度→吸引力」的影响强度。
 * 影响系数越大，亲密边 rest distance 越小、弹簧强度越大（节点拉得越紧）。
 */
export default function PhysicsPanel({ onClose }: { onClose: () => void }) {
  const { intimacyInfluence, applyIntimacyInfluence } = useAppCtx()

  const current = Math.min(
    INFLUENCE_MAX,
    Math.max(
      INFLUENCE_MIN,
      intimacyInfluence ?? INTIMACY_INFLUENCE_DEFAULT,
    ),
  )

  return (
    <PanelContainer
      id="physics-panel"
      layer={PanelLayer.Panel}
      draggable
      resizable
      defaultSize={{ w: 300, h: 190 }}
      position={{ x: window.innerWidth - 360, y: 150 }}
      style={panelStyle}
      onClose={onClose}
    >
      {/* 头部（内容区自绘） */}
      <div
        style={{
          padding: "8px 10px",
          borderBottom: "1px solid rgb(var(--border))",
          display: "flex",
          alignItems: "center",
          gap: 8,
          flexShrink: 0,
        }}
      >
        <Magnet size={14} />
        <span style={{ fontWeight: "bold" }}>引力调节</span>
        <span style={{ flex: 1 }} />
        <button
          onClick={() => applyIntimacyInfluence(INTIMACY_INFLUENCE_DEFAULT)}
          style={btn}
          title="恢复默认"
        >
          <RotateCcw size={13} /> 默认
        </button>
      </div>

      {/* 内容 */}
      <div
        style={{
          padding: "10px 12px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 64, flexShrink: 0 }}>亲密→引力</span>
          <input
            type="range"
            min={INFLUENCE_MIN}
            max={INFLUENCE_MAX}
            step={INFLUENCE_STEP}
            value={current}
            onChange={(e) => applyIntimacyInfluence(Number(e.target.value))}
            style={{ flex: 1 }}
          />
          <span
            style={{
              width: 34,
              textAlign: "right",
              color: "rgb(var(--accent, 233, 69, 96))",
              fontWeight: "bold",
            }}
          >
            {current.toFixed(1)}
          </span>
        </div>

        <div
          style={{
            fontSize: 11,
            color: "rgb(var(--muted))",
            lineHeight: 1.5,
          }}
        >
          影响系数越大，亲密度对节点引力的作用越强：
          <br />· 亲密越高 → 节点拉得越近、弹簧越硬
          <br />· 0 = 关闭亲密度影响（纯力导向）
        </div>
      </div>
    </PanelContainer>
  )
}
