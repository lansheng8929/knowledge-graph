import { PanelContainer, PanelLayer } from "./panel"
import {
  ANALYSIS_MODE_LABELS,
  type AnalysisMode,
} from "./analysis/useAnalysisMode"

interface AnalysisSettingsPanelProps {
  mode: AnalysisMode
  onApplyMode: (m: AnalysisMode) => void
  edgeWeight: boolean
  onToggleEdgeWeight: () => void
  nodeWeight: boolean
  onToggleNodeWeight: () => void
  onClose: () => void
}

const panelStyle: React.CSSProperties = {
  background: "rgb(var(--background))",
  border: "1px solid rgb(var(--border))",
  borderRadius: 8,
  boxShadow: "var(--shadow)",
  fontFamily: "monospace",
  fontSize: "13px",
  color: "rgb(var(--foreground))",
  width: 240,
}

const sectionStyle: React.CSSProperties = {
  padding: "10px 14px",
  borderBottom: "1px solid rgb(var(--border))",
}

const labelStyle: React.CSSProperties = {
  fontSize: 11,
  color: "rgb(var(--muted))",
  marginBottom: 6,
}

/** 分析设置面板：画布分析模式（度数/连通分量）+ 边/节点权重显示开关，集中管理 */
export default function AnalysisSettingsPanel(props: AnalysisSettingsPanelProps) {
  return (
    <PanelContainer
      id="analysis-settings-panel"
      layer={PanelLayer.Panel}
      draggable
      onClose={props.onClose}
      position={{ x: window.innerWidth - 300, y: 56 }}
      style={panelStyle}
    >
      {/* 头部 */}
      <div
        style={{
          padding: "10px 14px 10px 14px",
          borderBottom: "1px solid rgb(var(--border))",
          display: "flex",
          alignItems: "center",
        }}
      >
        <span style={{ fontWeight: "bold", fontSize: "13px" }}>分析设置</span>
      </div>

      {/* 画布分析模式 */}
      <div style={sectionStyle}>
        <div style={labelStyle}>画布分析模式（图内视角）</div>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {(["none", "degree", "component"] as AnalysisMode[]).map((m) => (
            <button
              key={m}
              onClick={() => props.onApplyMode(m)}
              style={{
                padding: "4px 10px",
                fontSize: 12,
                fontFamily: "monospace",
                border:
                  props.mode === m
                    ? "1px solid #e94560"
                    : "1px solid rgb(var(--border))",
                borderRadius: 4,
                background:
                  props.mode === m ? "rgb(233 69 96 / 0.12)" : "transparent",
                color: "rgb(var(--foreground))",
                cursor: "pointer",
              }}
            >
              {ANALYSIS_MODE_LABELS[m]}
            </button>
          ))}
        </div>
      </div>

      {/* 权重显示开关 */}
      <div style={{ ...sectionStyle, borderBottom: "none" }}>
        <div style={labelStyle}>显示选项</div>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 6,
            fontSize: 12,
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={props.edgeWeight}
            onChange={props.onToggleEdgeWeight}
          />
          显示边权重（按亲密度粗细）
        </label>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 12,
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={props.nodeWeight}
            onChange={props.onToggleNodeWeight}
          />
          显示节点权重（按 data.weight 大小）
        </label>
      </div>
    </PanelContainer>
  )
}
