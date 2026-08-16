import { SlidersHorizontal, RotateCcw } from "lucide-react"
import { PanelContainer, PanelLayer } from "./panel"
import { useAppCtx } from "./AppContext"
import { NODE_TYPE_LABELS } from "./labels"

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

/**
 * FilterPanel — 属性过滤面板（P2）。
 * 关闭按钮使用 PanelContainer 原版红色圆点（panel-grip）；
 * 头部为内容区自绘（标题 + 重置）。
 */
export default function FilterPanel({ onClose }: { onClose: () => void }) {
  const {
    typeStats,
    attrFilter,
    toggleNodeType,
    updateAttrFilter,
    resetFilters,
  } = useAppCtx()

  const setGender = (v: string) =>
    updateAttrFilter({ gender: v === "" ? null : v })
  const setMin = (v: string) =>
    updateAttrFilter({ minWeight: v === "" ? null : Number(v) })
  const setMax = (v: string) =>
    updateAttrFilter({ maxWeight: v === "" ? null : Number(v) })

  return (
    <PanelContainer
      id="filter-panel"
      layer={PanelLayer.Panel}
      draggable
      resizable
      defaultSize={{ w: 340, h: 320 }}
      position={{ x: window.innerWidth - 380, y: 150 }}
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
        <SlidersHorizontal size={14} />
        <span style={{ fontWeight: "bold" }}>属性过滤</span>
        <span style={{ flex: 1 }} />
        <button onClick={() => resetFilters()} style={btn} title="重置全部过滤">
          <RotateCcw size={13} /> 重置
        </button>
      </div>

      {/* 内容 */}
      <div
        style={{
          padding: "10px 14px",
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        {/* 节点类型 */}
        <div style={sectionTitle}>节点类型</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {[...typeStats.entries()].map(([t, count]) => {
            const checked = attrFilter.nodeTypes.has(t)
            return (
              <label
                key={t}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: 12,
                  padding: "2px 8px",
                  border: `1px solid ${checked ? "#0066ff" : "#444"}`,
                  borderRadius: 12,
                  background: checked ? "#0066ff25" : "transparent",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => toggleNodeType(t, e.target.checked)}
                  style={{ margin: 0 }}
                />
                {NODE_TYPE_LABELS[t] ?? t}
                <span style={{ color: "rgb(var(--muted))" }}>{count}</span>
              </label>
            )
          })}
        </div>

        {/* 性别 */}
        <div style={{ ...sectionTitle, marginTop: 12 }}>性别</div>
        <select
          value={attrFilter.gender ?? ""}
          onChange={(e) => setGender(e.target.value)}
          style={select}
        >
          <option value="">全部</option>
          <option value="男">男</option>
          <option value="女">女</option>
        </select>

        {/* 案值权重范围 */}
        <div style={{ ...sectionTitle, marginTop: 12 }}>案值权重</div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            type="number"
            placeholder="min"
            value={attrFilter.minWeight ?? ""}
            onChange={(e) => setMin(e.target.value)}
            style={input}
          />
          <span>~</span>
          <input
            type="number"
            placeholder="max"
            value={attrFilter.maxWeight ?? ""}
            onChange={(e) => setMax(e.target.value)}
            style={input}
          />
        </div>
      </div>
    </PanelContainer>
  )
}

const sectionTitle: React.CSSProperties = {
  fontSize: 11,
  color: "rgb(var(--muted))",
  marginBottom: 6,
}

const btn: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  fontSize: 11,
  fontFamily: "monospace",
  padding: "2px 6px",
  background: "transparent",
  border: "1px solid #555",
  borderRadius: 4,
  cursor: "pointer",
  color: "rgb(var(--foreground))",
}

const select: React.CSSProperties = {
  fontSize: 12,
  fontFamily: "monospace",
  padding: "3px 6px",
  border: "1px solid rgb(var(--border))",
  borderRadius: 3,
  background: "rgb(var(--background))",
  color: "rgb(var(--foreground))",
}

const input: React.CSSProperties = {
  ...select,
  width: 90,
}
