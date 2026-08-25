import { useEffect, useMemo, useState } from "react"
import GraphPreview from "./GraphPreview"
import type { ParsedEdge, ParsedEntity, PreviewData } from "./types"
import { nodeTypeLabel, relationLabel } from "./graph-i18n"

const PAGE_SIZE = 10
/** 可见节点数超过该阈值 → 暂停勾选↔图谱实时联动，改手动刷新。 */
const GRAPH_LIVE_LIMIT = 2000

/**
 * 解析预览的入库选择工作台：左表格（实体可勾选，边自动跟随端点），
 * 右图谱实时反映选中子图。默认全选。
 */
export default function ImportPreviewDetail(props: {
  data: PreviewData
  onSelectionChange?: (excludeEntityIds: string[]) => void
}) {
  const { data: d } = props
  const [excluded, setExcluded] = useState<ReadonlySet<string>>(new Set())
  const [entPage, setEntPage] = useState(0)
  const [edgePage, setEdgePage] = useState(0)
  const [fitKey, setFitKey] = useState(0)
  // 表格筛选（仅影响展示与查找，不影响选择与图谱）
  const [entQ, setEntQ] = useState("")
  const [entType, setEntType] = useState("")
  const [entOnlySel, setEntOnlySel] = useState(false)
  const [edgeQ, setEdgeQ] = useState("")
  const [edgeType, setEdgeType] = useState("")
  const [edgeStatus, setEdgeStatus] = useState<"all" | "in" | "out">("all")

  // 已选实体 + 将入库边（两端都未被排除）
  const selected = useMemo(() => {
    const entities = d.entities.filter((e) => !excluded.has(e.id))
    const ids = new Set(entities.map((e) => e.id))
    const edges = d.edges.filter(
      (ed) => ids.has(ed.source) && ids.has(ed.target),
    )
    return { entities, edges, ids }
  }, [d, excluded])

  // 类型/关系类型候选 + 筛选结果
  const entTypes = useMemo(
    () => [...new Set(d.entities.map((e) => e.nodeType))].sort(),
    [d],
  )
  const edgeTypes = useMemo(
    () => [...new Set(d.edges.map((e) => e.linkType))].sort(),
    [d],
  )
  const entFilterActive = entQ !== "" || entType !== "" || entOnlySel
  const filteredEntities = useMemo(() => {
    const q = entQ.trim().toLowerCase()
    return d.entities.filter((e) => {
      if (entType && e.nodeType !== entType) return false
      if (entOnlySel && excluded.has(e.id)) return false
      if (!q) return true
      return (
        e.id.toLowerCase().includes(q) ||
        e.label.toLowerCase().includes(q) ||
        formatProps(e.props).toLowerCase().includes(q)
      )
    })
  }, [d, entQ, entType, entOnlySel, excluded])
  const filteredEdges = useMemo(() => {
    const q = edgeQ.trim().toLowerCase()
    return d.edges.filter((e) => {
      if (edgeType && e.linkType !== edgeType) return false
      const on = selected.ids.has(e.source) && selected.ids.has(e.target)
      if (edgeStatus === "in" && !on) return false
      if (edgeStatus === "out" && on) return false
      if (!q) return true
      return (
        e.source.toLowerCase().includes(q) ||
        e.target.toLowerCase().includes(q) ||
        e.linkType.toLowerCase().includes(q)
      )
    })
  }, [d, edgeQ, edgeType, edgeStatus, selected.ids])

  // 新解析结果 → 重置选择、分页与图谱
  useEffect(() => {
    setExcluded(new Set())
    setEntPage(0)
    setEdgePage(0)
    setPaused(false)
    setApplied(null)
    setEntQ("")
    setEntType("")
    setEntOnlySel(false)
    setEdgeQ("")
    setEdgeType("")
    setEdgeStatus("all")
  }, [d])

  useEffect(() => {
    setEntPage(0)
  }, [entQ, entType, entOnlySel])
  useEffect(() => {
    setEdgePage(0)
  }, [edgeQ, edgeType, edgeStatus])

  // 上报排除清单（提交时随配置携带）
  useEffect(() => {
    props.onSelectionChange?.(Array.from(excluded))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [excluded])

  // ── 图谱联动：首次全量应用；此后防抖应用；超阈值暂停自动联动 ──
  const [applied, setApplied] = useState<{
    entities: ParsedEntity[]
    edges: ParsedEdge[]
  } | null>(null)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    setApplied(selected)
    setPaused(selected.entities.length > GRAPH_LIVE_LIMIT)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (paused) return
    const t = window.setTimeout(() => {
      setApplied(selected)
      setPaused(selected.entities.length > GRAPH_LIVE_LIMIT)
    }, 300)
    return () => window.clearTimeout(t)
  }, [selected, paused])

  const refreshGraph = (): void => setApplied(selected)

  const toggleEntity = (id: string): void =>
    setExcluded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  return (
    <>
      <div className="kg-stat-row">
        <Stat label="实体" value={d.entityCount} />
        <Stat label="关系" value={d.edgeCount} />
        <Stat label="跳过" value={d.skipped} tone="warn" />
        <Stat
          label="错误"
          value={d.errors.length}
          tone={d.errors.length ? "bad" : "ok"}
        />
      </div>
      {(d.errors.length > 0 || d.warnings.length > 0) && (
        <div
          className={
            d.errors.length ? "kg-msg kg-msg-err" : "kg-msg kg-msg-warn"
          }
        >
          <ul>
            {(d.errors.length ? d.errors : d.warnings)
              .slice(0, 10)
              .map((m, i) => (
                <li key={i}>{m}</li>
              ))}
          </ul>
        </div>
      )}
      <div className="kg-preview-workspace">
        <div className="kg-preview-panel">
          <div className="kg-select-bar">
            <span>
              已选 <b>{selected.entities.length}</b>/{d.entities.length} 实体 ·
              将入库 <b>{selected.edges.length}</b>/{d.edges.length} 边
            </span>
            <button
              className="kg-btn kg-btn-ghost kg-btn-sm"
              onClick={() => setExcluded(new Set())}
            >
              全选
            </button>
            <button
              className="kg-btn kg-btn-ghost kg-btn-sm"
              onClick={() =>
                setExcluded(new Set(d.entities.map((e) => e.id)))
              }
            >
              清空
            </button>
            {entFilterActive && (
              <button
                className="kg-btn kg-btn-ghost kg-btn-sm"
                onClick={() =>
                  setExcluded((prev) => {
                    const next = new Set(prev)
                    filteredEntities.forEach((e) => next.delete(e.id))
                    return next
                  })
                }
              >
                全选已筛
              </button>
            )}
          </div>
          <div className="kg-select-tables">
            <div className="kg-filter-bar">
              <input
                className="kg-filter-input"
                type="search"
                placeholder="搜索编号/名称/属性"
                value={entQ}
                onChange={(e) => setEntQ(e.target.value)}
              />
              <select
                value={entType}
                onChange={(e) => setEntType(e.target.value)}
              >
                <option value="">全部类型</option>
                {entTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <label className="kg-filter-check">
                <input
                  type="checkbox"
                  checked={entOnlySel}
                  onChange={(e) => setEntOnlySel(e.target.checked)}
                />
                仅已选
              </label>
              {(entQ || entType || entOnlySel) && (
                <button
                  className="kg-btn kg-btn-ghost kg-btn-sm"
                  onClick={() => {
                    setEntQ("")
                    setEntType("")
                    setEntOnlySel(false)
                  }}
                >
                  重置
                </button>
              )}
              <span className="kg-filter-count">
                {filteredEntities.length}/{d.entities.length} 条
              </span>
            </div>
            {filteredEntities.length === 0 ? (
              <div className="kg-empty">
                {d.entities.length === 0 ? "无实体数据" : "无匹配数据"}
              </div>
            ) : (
              <EntitySelectTable
                entities={filteredEntities}
                excluded={excluded}
                onToggle={toggleEntity}
                page={entPage}
                onPage={setEntPage}
              />
            )}
            <div className="kg-filter-bar">
              <input
                className="kg-filter-input"
                type="search"
                placeholder="搜索源/目标/关系"
                value={edgeQ}
                onChange={(e) => setEdgeQ(e.target.value)}
              />
              <select
                value={edgeType}
                onChange={(e) => setEdgeType(e.target.value)}
              >
                <option value="">全部关系</option>
                {edgeTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <select
                value={edgeStatus}
                onChange={(e) =>
                  setEdgeStatus(e.target.value as "all" | "in" | "out")
                }
              >
                <option value="all">全部状态</option>
                <option value="in">将入库</option>
                <option value="out">已排除</option>
              </select>
              {(edgeQ || edgeType || edgeStatus !== "all") && (
                <button
                  className="kg-btn kg-btn-ghost kg-btn-sm"
                  onClick={() => {
                    setEdgeQ("")
                    setEdgeType("")
                    setEdgeStatus("all")
                  }}
                >
                  重置
                </button>
              )}
              <span className="kg-filter-count">
                {filteredEdges.length}/{d.edges.length} 条
              </span>
            </div>
            {filteredEdges.length === 0 ? (
              <div className="kg-empty">
                {d.edges.length === 0 ? "无关系数据" : "无匹配数据"}
              </div>
            ) : (
              <EdgeStatusTable
                edges={filteredEdges}
                selectedIds={selected.ids}
                page={edgePage}
                onPage={setEdgePage}
              />
            )}
          </div>
        </div>
        <div className="kg-preview-panel">
          <div className="kg-graph-head">
            <span>图谱预览 · {applied?.entities.length ?? 0} 节点</span>
            <span className="kg-graph-ops">
              <button
                className="kg-btn kg-btn-ghost kg-btn-sm"
                onClick={() => setFitKey((k) => k + 1)}
              >
                适应视图
              </button>
              {paused && (
                <button
                  className="kg-btn kg-btn-ghost kg-btn-sm"
                  onClick={refreshGraph}
                >
                  刷新图谱
                </button>
              )}
            </span>
          </div>
          {paused && (
            <div className="kg-graph-paused-hint">
              节点较多（{selected.entities.length} &gt; {GRAPH_LIVE_LIMIT}），实时联动已暂停；调整选择后点击「刷新图谱」应用。
            </div>
          )}
          <GraphPreview
            entities={applied?.entities ?? []}
            edges={applied?.edges ?? []}
            fitKey={fitKey}
          />
        </div>
      </div>
    </>
  )
}

function EntitySelectTable(props: {
  entities: ParsedEntity[]
  excluded: ReadonlySet<string>
  onToggle: (id: string) => void
  page: number
  onPage: (p: number) => void
}) {
  const { entities, page } = props
  if (entities.length === 0) return <div className="kg-empty">无实体数据</div>
  const pages = Math.max(1, Math.ceil(entities.length / PAGE_SIZE))
  const slice = entities.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
  return (
    <div className="kg-table-wrap">
      <table className="kg-table">
        <thead>
          <tr>
            <th>入库</th>
            <th>编号</th>
            <th>类型</th>
            <th>名称</th>
            <th>属性</th>
          </tr>
        </thead>
        <tbody>
          {slice.map((e) => (
            <tr key={e.id} className={props.excluded.has(e.id) ? "kg-row-off" : ""}>
              <td>
                <input
                  type="checkbox"
                  checked={!props.excluded.has(e.id)}
                  onChange={() => props.onToggle(e.id)}
                />
              </td>
              <td className="mono">{e.id}</td>
              <td>
                <span className="kg-tag">{nodeTypeLabel(e.nodeType)}</span>
              </td>
              <td>{e.label || "—"}</td>
              <td className="dim">{formatProps(e.props)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pager page={page} pages={pages} total={entities.length} onPage={props.onPage} />
    </div>
  )
}

function EdgeStatusTable(props: {
  edges: ParsedEdge[]
  selectedIds: ReadonlySet<string>
  page: number
  onPage: (p: number) => void
}) {
  const { edges, page } = props
  if (edges.length === 0) return <div className="kg-empty">无关系数据</div>
  const pages = Math.max(1, Math.ceil(edges.length / PAGE_SIZE))
  const slice = edges.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
  return (
    <div className="kg-table-wrap">
      <table className="kg-table">
        <thead>
          <tr>
            <th>入库</th>
            <th>源</th>
            <th>关系</th>
            <th>目标</th>
            <th>序号</th>
            <th>更新时间</th>
            <th>属性</th>
          </tr>
        </thead>
        <tbody>
          {slice.map((e) => {
            const on =
              props.selectedIds.has(e.source) && props.selectedIds.has(e.target)
            return (
              <tr key={e.id} className={on ? "" : "kg-row-off"}>
                <td>
                  <span className={`kg-pill ${on ? "ok" : "off"}`}>
                    {on ? "将入库" : "已排除"}
                  </span>
                </td>
                <td className="mono">{e.source}</td>
                <td>
                  <span className="kg-tag kg-tag-blue">{relationLabel(e.linkType)}</span>
                </td>
                <td className="mono">{e.target}</td>
                <td className="mono">{String(e.rank ?? e.props.rank ?? "—")}</td>
                <td className="dim">{e.time}</td>
                <td className="dim">{formatProps(e.props)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <Pager page={page} pages={pages} total={edges.length} onPage={props.onPage} />
    </div>
  )
}

function Pager(props: {
  page: number
  pages: number
  total: number
  onPage: (p: number) => void
}) {
  if (props.pages <= 1) return null
  return (
    <div className="kg-pager">
      <button
        className="kg-btn kg-btn-ghost kg-btn-sm"
        disabled={props.page === 0}
        onClick={() => props.onPage(props.page - 1)}
      >
        上一页
      </button>
      <span>
        每页 {PAGE_SIZE} 条 · 第 {props.page + 1}/{props.pages} 页（共 {props.total} 条）
      </span>
      <button
        className="kg-btn kg-btn-ghost kg-btn-sm"
        disabled={props.page >= props.pages - 1}
        onClick={() => props.onPage(props.page + 1)}
      >
        下一页
      </button>
    </div>
  )
}

export function Stat(props: { label: string; value: number; tone?: string }) {
  return (
    <div className={`kg-stat ${props.tone ?? ""}`}>
      <b>{props.value}</b>
      <span>{props.label}</span>
    </div>
  )
}

function formatProps(p: Record<string, unknown>): string {
  const entries = Object.entries(p).filter(
    ([, v]) => v !== undefined && v !== null && v !== "",
  )
  if (entries.length === 0) return "—"
  return entries.map(([k, v]) => `${k}=${String(v)}`).join("  ")
}
