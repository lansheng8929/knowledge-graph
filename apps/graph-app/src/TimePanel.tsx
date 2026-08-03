import { Play, Pause, RotateCcw, Clock } from "lucide-react"
import { PanelContainer, PanelLayer } from "./panel"
import { useAppCtx } from "./AppContext"

const labelStyle: React.CSSProperties = {
  fontSize: 11,
  color: "rgb(var(--muted))",
  fontFamily: "monospace",
}

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
 * TimePanel — 时间线回放（P2）。
 * 关闭按钮使用 PanelContainer 原版红色圆点（panel-grip）；
 * 头部为内容区自绘（标题 + 启用/重置）。
 */
export default function TimePanel({ onClose }: { onClose: () => void }) {
  const {
    timeRange,
    timeValue,
    timeActive,
    playing,
    setPlaying,
    onTimeChange,
    toggleTime,
    resetFilters,
  } = useAppCtx()

  const fmt = (ts: number) => new Date(ts).toISOString().slice(0, 10)

  return (
    <PanelContainer
      id="time-panel"
      layer={PanelLayer.Panel}
      draggable
      resizable
      defaultSize={{ w: 340, h: 170 }}
      position={{ x: window.innerWidth - 380, y: 300 }}
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
        <Clock size={14} />
        <span style={{ fontWeight: "bold" }}>时间线回放</span>
        <span style={{ flex: 1 }} />
        <button
          onClick={toggleTime}
          disabled={!timeRange.hasTime}
          style={{
            ...btn,
            background: timeActive ? "#0066ff40" : "transparent",
            border: timeActive ? "1px solid #0066ff" : "1px solid #555",
          }}
          title={timeActive ? "关闭时间过滤" : "启用时间过滤"}
        >
          {timeActive ? "过滤中" : "启用"}
        </button>
        <button onClick={() => resetFilters()} style={btn} title="重置时间线">
          <RotateCcw size={13} />
        </button>
      </div>

      {/* 内容 */}
      <div
        style={{
          padding: "10px 14px",
          display: "flex",
          flexDirection: "column",
          gap: 8,
          flex: 1,
          justifyContent: "center",
        }}
      >
        {!timeRange.hasTime && (
          <span style={labelStyle}>（当前画布无边的时间信息）</span>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            onClick={() => {
              if (!timeActive) toggleTime()
              setPlaying((p) => !p)
            }}
            disabled={!timeRange.hasTime}
            style={{ ...btn, padding: "3px 10px" }}
            title={playing ? "暂停" : "播放"}
          >
            {playing ? <Pause size={13} /> : <Play size={13} />}
          </button>
          <input
            type="range"
            min={timeRange.min}
            max={timeRange.max}
            value={timeValue}
            disabled={!timeRange.hasTime}
            onChange={(e) => onTimeChange(Number(e.target.value))}
            style={{ flex: 1, cursor: "pointer" }}
          />
          <span style={labelStyle}>{fmt(timeValue)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={labelStyle}>
            {timeRange.hasTime ? fmt(timeRange.min) : "--"}
          </span>
          <span style={labelStyle}>
            {timeRange.hasTime ? fmt(timeRange.max) : "--"}
          </span>
        </div>
      </div>
    </PanelContainer>
  )
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
