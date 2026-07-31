import { useState } from "react"
import { PanelContainer, PanelLayer } from "./panel"
import { useAppCtx } from "./AppContext"

// ─── 分析类型配置 ─────────────────────────────────

interface AnalysisParam {
  key: string
  label: string
  placeholder?: string
  type?: "text" | "select"
  options?: { value: string; label: string }[]
}

interface AnalysisTypeConfig {
  value: string
  label: string
  params: AnalysisParam[]
  resultLabel: (item: any) => string
  resultDetail: (item: any) => string
}

const RELATION_LABELS: Record<string, string> = {
  OWNS: "名下",
  RESIDES_AT: "居住",
  WORKS_AT: "工作",
  HAS_ACCOUNT: "开户",
  LOGIN_IP: "登录",
  USE_DEVICE: "使用",
  CALLED: "通话",
  TRANSACTED: "转账",
}

const TIME_WINDOW_OPTIONS = [
  { value: "1d", label: "1 天" },
  { value: "7d", label: "1 周" },
  { value: "30d", label: "1 个月" },
  { value: "90d", label: "3 个月" },
  { value: "365d", label: "1 年" },
]

const ANALYSIS_TYPES: AnalysisTypeConfig[] = [
  {
    value: "call_circle",
    label: "通话圈分析",
    params: [
      {
        key: "timeWindow",
        label: "时间范围",
        type: "select",
        options: TIME_WINDOW_OPTIONS,
      },
    ],
    resultLabel: (item) => item.label ?? item.id,
    resultDetail: (item) =>
      `${RELATION_LABELS[item.relation] ?? item.relation} · ${item.count ?? 0} 次${item.time ? ` · ${item.time}` : ""}`,
  },
]

// ─── 通用类型 ─────────────────────────────────────

interface AnalysisGraphData {
  nodes: any[]
  links: any[]
}

interface AnalysisPanelProps {
  onClose: () => void
  onExpand: (graphData: AnalysisGraphData) => void
}

const inputStyle: React.CSSProperties = {
  padding: "3px 6px",
  fontSize: "11px",
  fontFamily: "monospace",
  border: "1px solid rgb(var(--border))",
  borderRadius: 3,
  outline: "none",
  background: "rgb(var(--background))",
  color: "rgb(var(--foreground))",
  width: 80,
}

export default function AnalysisPanel({
  onClose,
  onExpand,
}: AnalysisPanelProps) {
  const { analysisTarget } = useAppCtx()

  if (!analysisTarget) return null
  const nodeIds = analysisTarget.ids
  const nodeLabels = analysisTarget.labels
  const [analysisType, setAnalysisType] = useState(ANALYSIS_TYPES[0].value)
  const [items, setItems] = useState<any[]>([])
  const [graphData, setGraphData] = useState<AnalysisGraphData | null>(null)
  const [loading, setLoading] = useState(false)
  const [params, setParams] = useState<Record<string, string>>({
    timeWindow: "1d",
  })

  const config = ANALYSIS_TYPES.find((t) => t.value === analysisType)!

  const runAnalysis = async () => {
    setLoading(true)
    try {
      const body: Record<string, any> = { nodeIds, type: analysisType }
      for (const p of config.params) {
        const val = params[p.key]?.trim()
        if (val) body[p.key] = val
      }
      const res = await fetch("/api/graph/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      if (!res.ok) return
      const json = await res.json()
      if (json.success) {
        setItems(json.data.items ?? [])
        setGraphData(json.data.graphData ?? null)
      }
    } catch {}
    setLoading(false)
  }

  const renderParams = () => {
    if (config.params.length === 0) return null
    return (
      <>
        {config.params.map((p) =>
          p.type === "select" && p.options ? (
            <select
              key={p.key}
              value={params[p.key] ?? ""}
              onChange={(e) =>
                setParams((prev) => ({ ...prev, [p.key]: e.target.value }))
              }
              style={{
                ...inputStyle,
                width: "auto",
                minWidth: 80,
                cursor: "pointer",
              }}
            >
              {p.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              key={p.key}
              placeholder={p.placeholder ?? p.label}
              value={params[p.key] ?? ""}
              onChange={(e) =>
                setParams((prev) => ({ ...prev, [p.key]: e.target.value }))
              }
              style={inputStyle}
            />
          ),
        )}
        <button
          onClick={runAnalysis}
          disabled={loading}
          style={{
            padding: "4px 10px",
            fontSize: "12px",
            fontFamily: "monospace",
            border: "none",
            borderRadius: 4,
            background: "#1976d2",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          {loading ? "..." : "查询"}
        </button>
      </>
    )
  }

  return (
    <PanelContainer
      id="analysis-panel"
      layer={PanelLayer.Panel}
      draggable
      onClose={onClose}
      resizable
      defaultSize={{
        w: 340,
        h: Math.max(300, Math.round(window.innerHeight * 0.5)),
      }}
      position={{ x: window.innerWidth - 360, y: 50 }}
      style={{
        background: "rgb(var(--background))",
        border: "1px solid rgb(var(--border))",
        borderRadius: 8,
        boxShadow: "var(--shadow)",
        fontFamily: "monospace",
        fontSize: "13px",
        color: "rgb(var(--foreground))",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* 头部 */}
      <div
        style={{
          padding: "10px 14px 10px 4px",
          borderBottom: "1px solid rgb(var(--border))",
          display: "flex",
          alignItems: "center",
          gap: 8,
          flexShrink: 0,
        }}
      >
        <span style={{ fontWeight: "bold", fontSize: "13px" }}>分析</span>
        <span
          style={{
            color: "rgb(var(--muted))",
            fontSize: "11px",
            flex: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {nodeLabels.join(", ")}
        </span>
      </div>

      {/* 分析类型 + 参数 */}
      <div
        style={{
          padding: "8px 14px",
          display: "flex",
          gap: 6,
          alignItems: "center",
          borderBottom: "1px solid rgb(var(--border))",
          flexWrap: "wrap",
        }}
      >
        <select
          value={analysisType}
          onChange={(e) => {
            setAnalysisType(e.target.value)
            setItems([])
            setGraphData(null)
            setParams({})
          }}
          style={{
            fontSize: "12px",
            fontFamily: "monospace",
            padding: "3px 6px",
            border: "1px solid rgb(var(--border))",
            borderRadius: 3,
            background: "rgb(var(--background))",
            color: "rgb(var(--foreground))",
            cursor: "pointer",
          }}
        >
          {ANALYSIS_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
        {renderParams()}
      </div>

      {/* 结果列表 */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {items.length === 0 && !loading && (
          <div
            style={{
              color: "rgb(var(--muted))",
              textAlign: "center",
              padding: 20,
            }}
          >
            设置条件后点击"查询"
          </div>
        )}
        {items.map((item, i) => (
          <div
            key={`${item.id}-${i}`}
            style={{
              padding: "8px 14px",
              borderBottom: "1px solid rgb(var(--border))",
              fontSize: "12px",
              cursor: "pointer",
            }}
            onClick={() => {
              if (!graphData) return
              const sid = item.sourceId
              const tid = item.id
              const relatedLinks = graphData.links.filter(
                (l) =>
                  (l.source === sid && l.target === tid) ||
                  (l.source === tid && l.target === sid),
              )
              const relatedNodeIds = new Set<string>()
              relatedLinks.forEach((l) => {
                relatedNodeIds.add(l.source)
                relatedNodeIds.add(l.target)
              })
              let relatedNodes = graphData.nodes.filter((n) =>
                relatedNodeIds.has(n.id),
              )
              // 补齐缺失的源节点（graphData 只包含目标节点）
              const existNodeIds = new Set(relatedNodes.map((n) => n.id))
              if (sid && !existNodeIds.has(sid)) {
                relatedNodes = [
                  ...relatedNodes,
                  { id: sid, data: { nodeType: "phone", label: sid } },
                ]
              }
              onExpand({ nodes: relatedNodes, links: relatedLinks })
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgb(var(--hover))"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgb(var(--background))"
            }}
          >
            <div style={{ fontWeight: "bold", color: "rgb(var(--primary))" }}>
              {config.resultLabel(item)}
            </div>
            <div style={{ color: "rgb(var(--muted))", fontSize: "11px" }}>
              {config.resultDetail(item)}
            </div>
          </div>
        ))}
      </div>
    </PanelContainer>
  )
}
