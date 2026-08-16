import { useEffect, useMemo, useRef, useState } from "react"
import { Table } from "lucide-react"
import type { GraphModel } from "@lansheng/knowledge-graph"
import type { MyGraphView } from "./graph-types"
import { PanelContainer, PanelLayer } from "./panel"
import { useAppCtx } from "./AppContext"
import { linkEndpoints } from "./link-utils"

interface Row {
  id: string
  label: string
  nodeType: string
  clusterId: string
  gender: string
  age: number
  caseWeight: number
  edgeCount: number
  intimacy: number
}

const panelStyle: React.CSSProperties = {
  background: "rgb(var(--background))",
  border: "1px solid rgb(var(--border))",
  borderRadius: 8,
  boxShadow: "var(--shadow)",
  fontFamily: "monospace",
  fontSize: 12,
  color: "rgb(var(--foreground))",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
}

/**
 * TablePanel — 表格视图联动（P2）。
 * 关闭按钮使用 PanelContainer 原版红色圆点（panel-grip）；
 * 头部为内容区自绘（标题 + 全部/选中切换）。
 */
export default function TablePanel({
  modelRef,
  viewRef,
  onClose,
}: {
  modelRef: { current: GraphModel }
  viewRef: { current: MyGraphView | null }
  onClose: () => void
}) {
  const { hoveredNode, selectedNodeIds } = useAppCtx()
  const [version, setVersion] = useState(0)
  const [scope, setScope] = useState<"all" | "selected">("all")
  const rowRefs = useRef(new Map<string, HTMLTableRowElement>())

  useEffect(() => {
    const model = modelRef.current
    if (!model) return
    return model.events.subscribe("dataChange", () => setVersion((v) => v + 1))
  }, [modelRef])

  const rows = useMemo<Row[]>(() => {
    const model = modelRef.current
    if (!model) return []
    const gd = model.getGraphModelData().graphData
    const linkDeg = new Map<string, { count: number; intimacy: number }>()
    for (const l of gd.links) {
      const [s, t] = linkEndpoints(l)
      const d = (l.data as any) ?? {}
      const int = typeof d.intimacy === "number" ? d.intimacy : 0
      for (const id of [s, t]) {
        const cur = linkDeg.get(id) ?? { count: 0, intimacy: 0 }
        cur.count += 1
        cur.intimacy += int
        linkDeg.set(id, cur)
      }
    }
    const nodes = gd.nodes.filter((n) =>
      scope === "selected" ? selectedNodeIds.has(n.id) : true,
    )
    return nodes.map((n) => {
      const d = (n.data as any) ?? {}
      const deg = linkDeg.get(n.id) ?? { count: 0, intimacy: 0 }
      return {
        id: n.id,
        label: d.label ?? n.id,
        nodeType: d.nodeType ?? "default",
        clusterId: d.clusterId ?? "",
        gender: d.gender ?? "",
        age: d.age ?? 0,
        caseWeight: d.caseWeight ?? 0,
        edgeCount: deg.count,
        intimacy: deg.count
          ? Math.round((deg.intimacy / deg.count) * 100) / 100
          : 0,
      }
    })
  }, [modelRef, version, scope, selectedNodeIds])

  // 图节点悬停/选中 → 表格滚动到对应行
  useEffect(() => {
    const id = hoveredNode?.id
    if (!id) return
    const row = rowRefs.current.get(id)
    row?.scrollIntoView({ block: "nearest" })
  }, [hoveredNode])

  const focusRow = (row: Row) => {
    const view = viewRef.current
    const model = modelRef.current
    if (!view || !model) return
    view.focusNodeById(row.id)
    model.stateManager.setSelectedNodes([row.id])
  }

  return (
    <PanelContainer
      id="table-panel"
      layer={PanelLayer.Panel}
      draggable
      resizable
      defaultSize={{ w: 620, h: 400 }}
      position={{ x: 60, y: 60 }}
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
        <Table size={14} />
        <span style={{ fontWeight: "bold" }}>表格视图</span>
        <span style={{ flex: 1 }} />
        <button
          onClick={() => setScope("all")}
          style={{
            ...segBtn,
            background: scope === "all" ? "#0066ff40" : "transparent",
          }}
        >
          全部 ({rows.length})
        </button>
        <button
          onClick={() => setScope("selected")}
          style={{
            ...segBtn,
            background: scope === "selected" ? "#0066ff40" : "transparent",
          }}
        >
          选中 ({selectedNodeIds.size})
        </button>
      </div>

      {/* 内容：表格 */}
      <div style={{ flex: 1, overflow: "auto" }}>
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr style={{ color: "rgb(var(--muted))", textAlign: "left" }}>
              {[
                "标签",
                "类型",
                "簇",
                "性别",
                "年龄",
                "案值",
                "边数",
                "亲密度",
              ].map((h) => (
                <th key={h} style={thStyle}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const hovered = hoveredNode?.id === r.id
              const selected = selectedNodeIds.has(r.id)
              return (
                <tr
                  key={r.id}
                  ref={(el) => {
                    if (el) rowRefs.current.set(r.id, el)
                    else rowRefs.current.delete(r.id)
                  }}
                  onClick={() => focusRow(r)}
                  style={{
                    borderTop: "1px solid rgb(var(--border))",
                    cursor: "pointer",
                    background: selected
                      ? "#0066ff30"
                      : hovered
                        ? "rgba(233,69,96,0.12)"
                        : "transparent",
                  }}
                >
                  <td style={tdStyle}>{r.label}</td>
                  <td style={tdStyle}>{r.nodeType}</td>
                  <td style={tdStyle}>{r.clusterId}</td>
                  <td style={tdStyle}>{r.gender}</td>
                  <td style={tdStyle}>{r.age || ""}</td>
                  <td style={tdStyle}>{r.caseWeight || ""}</td>
                  <td style={tdStyle}>{r.edgeCount}</td>
                  <td style={tdStyle}>
                    <div
                      style={{
                        width: 60,
                        height: 6,
                        borderRadius: 3,
                        background: "rgba(128,128,128,0.2)",
                      }}
                    >
                      <div
                        style={{
                          width: `${Math.round(r.intimacy * 100)}%`,
                          height: 6,
                          borderRadius: 3,
                          background: "#e94560",
                        }}
                      />
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </PanelContainer>
  )
}

const thStyle: React.CSSProperties = {
  padding: "6px 10px",
  fontSize: 11,
  fontWeight: "normal",
  position: "sticky",
  top: 0,
  background: "rgb(var(--background))",
}

const tdStyle: React.CSSProperties = {
  padding: "5px 10px",
  maxWidth: 140,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
}

const segBtn: React.CSSProperties = {
  fontSize: 11,
  fontFamily: "monospace",
  padding: "2px 8px",
  border: "1px solid #555",
  borderRadius: 4,
  cursor: "pointer",
  color: "rgb(var(--foreground))",
}
