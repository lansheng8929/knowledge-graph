import { useRef, useEffect } from "react"
import type { HistoryManager } from "@lansheng/knowledge-graph/history-manager"
import { PanelContainer, PanelLayer } from "./panel"

// ─── 内联 SVG 图标 ───────────────────────────

function CameraSvg() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  )
}

function UndoSvg() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
    </svg>
  )
}

function TrashSvg() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  )
}

// ─── 类型 ────────────────────────────────────

interface SnapshotPanelProps {
  historyManager: HistoryManager
  currentIndex: number
  onTakeSnapshot: () => void
  onJumpTo: (index: number) => void
  onDeleteEntry: (index: number) => void
  onClose: () => void
}

// ─── 样式 ────────────────────────────────────

const panelStyle: React.CSSProperties = {
  width: 260,
  maxHeight: "calc(100% - 60px)",
  background: "rgb(var(--background))",
  border: "1px solid rgb(var(--border))",
  borderRadius: 8,
  color: "rgb(var(--foreground))",
  fontFamily: "monospace",
  fontSize: "12px",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  boxShadow: "var(--shadow)",
}

const headerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "10px 12px",
  borderBottom: "1px solid rgb(var(--border))",
  fontWeight: 600,
  fontSize: "13px",
}

const headerActions: React.CSSProperties = {
  display: "flex",
  gap: "6px",
}

const iconBtnStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 28,
  height: 28,
  border: "1px solid rgb(var(--border))",
  borderRadius: 4,
  background: "transparent",
  color: "rgb(var(--muted))",
  cursor: "pointer",
}

const listStyle: React.CSSProperties = {
  flex: 1,
  overflowY: "auto",
  padding: "4px 0",
}

const entryStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  padding: "8px 12px",
  cursor: "pointer",
  borderLeft: "3px solid transparent",
  transition: "background 0.15s",
}

const activeEntryStyle: React.CSSProperties = {
  ...entryStyle,
  borderLeft: "3px solid #e94560",
  background: "rgba(233,69,96,0.06)",
}

const entryInfoStyle: React.CSSProperties = {
  flex: 1,
  overflow: "hidden",
}

const entryNameStyle: React.CSSProperties = {
  fontSize: "12px",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
}

const entryTimeStyle: React.CSSProperties = {
  fontSize: "10px",
  color: "rgb(var(--muted))",
  marginTop: 2,
}

const deleteBtnStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 22,
  height: 22,
  border: "none",
  borderRadius: 3,
  background: "transparent",
  color: "rgb(var(--muted))",
  cursor: "pointer",
  opacity: 0,
  transition: "opacity 0.15s",
}

const emptyStyle: React.CSSProperties = {
  padding: "20px",
  textAlign: "center",
  color: "rgb(var(--muted))",
  fontSize: "11px",
}

// ─── 辅助 ────────────────────────────────────

function formatTime(ts: number): string {
  const d = new Date(ts)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`
}

// ─── 组件 ────────────────────────────────────

export default function SnapshotPanel({
  historyManager,
  currentIndex,
  onTakeSnapshot,
  onJumpTo,
  onDeleteEntry,
  onClose,
}: SnapshotPanelProps) {
  const listRef = useRef<HTMLDivElement>(null)
  const history = historyManager.getHistory()

  // 自动滚动到当前条目
  useEffect(() => {
    if (!listRef.current) return
    const el = listRef.current.children[currentIndex] as HTMLElement
    if (el) el.scrollIntoView({ block: "nearest", behavior: "smooth" })
  }, [currentIndex])

  return (
    <PanelContainer
      id="snapshot-panel"
      layer={PanelLayer.Panel}
      draggable
      onClose={onClose}
      resizable
      defaultSize={{ w: 260, h: 300 }}
      position={{ x: window.innerWidth - 280, y: 40 }}
      style={panelStyle}
    >
      {/* Header */}
      <div style={headerStyle}>
        <span>📸 快照</span>
        <div style={headerActions}>
          <button
            style={iconBtnStyle}
            onClick={onTakeSnapshot}
            title="拍摄快照"
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(233,69,96,0.2)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent"
            }}
          >
            <CameraSvg />
          </button>
        </div>
      </div>

      {/* List */}
      <div ref={listRef} style={listStyle}>
        {history.length === 0 ? (
          <div style={emptyStyle}>
            暂无快照
            <br />
            <span style={{ fontSize: 10 }}>点击 📷 拍摄当前图谱</span>
          </div>
        ) : (
          history.map((entry, idx) => {
            const isActive = idx === currentIndex
            return (
              <div
                key={idx}
                style={isActive ? activeEntryStyle : entryStyle}
                onClick={() => onJumpTo(idx)}
                onMouseEnter={(e) => {
                  if (!isActive)
                    e.currentTarget.style.background = "rgb(var(--hover))"
                  const del = e.currentTarget.querySelector(
                    ".del-btn",
                  ) as HTMLElement
                  if (del) del.style.opacity = "1"
                }}
                onMouseLeave={(e) => {
                  if (!isActive)
                    e.currentTarget.style.background = "transparent"
                  const del = e.currentTarget.querySelector(
                    ".del-btn",
                  ) as HTMLElement
                  if (del) del.style.opacity = "0"
                }}
              >
                {/* Icon */}
                <span
                  style={{
                    fontSize: 14,
                    opacity: isActive ? 1 : 0.4,
                    flexShrink: 0,
                  }}
                >
                  {isActive ? "●" : "○"}
                </span>

                {/* Info */}
                <div style={entryInfoStyle}>
                  <div style={entryNameStyle}>
                    {entry.description || entry.type}
                  </div>
                  <div style={entryTimeStyle}>
                    {formatTime(entry.timestamp)}
                  </div>
                </div>

                {/* Delete */}
                <button
                  className="del-btn"
                  style={deleteBtnStyle}
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeleteEntry(idx)
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "rgb(var(--primary))"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "rgb(var(--muted))"
                  }}
                >
                  <TrashSvg />
                </button>
              </div>
            )
          })
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          padding: "6px 12px",
          borderTop: "1px solid rgb(var(--border))",
          fontSize: "10px",
          color: "rgb(var(--muted))",
          textAlign: "center",
        }}
      >
        {history.length}/{historyManager.maxSize} · 当前 #{currentIndex + 1}
      </div>
    </PanelContainer>
  )
}
