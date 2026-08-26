import { useEffect, useMemo, useRef, useState } from "react"
import GraphPreview from "./GraphPreview"
import {
  TypeFilterForm,
  conditionsFromValues,
  emptyValues,
} from "@lansheng/filter-builder"
import type { FilterFormValues, FilterSchema } from "@lansheng/filter-builder"
import { filterSchema } from "./api"
import type {
  ParsedEdge,
  ParsedEntity,
  PreviewData,
  PreviewQuery,
} from "./types"
import { nodeTypeLabel, relationLabel } from "./graph-i18n"

const PAGE_SIZE = 10
/** 可见节点数超过该阈值 → 暂停勾选↔图谱实时联动，改手动刷新。 */
const GRAPH_LIVE_LIMIT = 2000

/**
 * 解析预览的入库选择工作台：左表格（实体可勾选，边自动跟随端点），右图谱实时反映选中子图。
 * 表格为后端分页/筛选：页与筛选变化时经 onFetchPage 拉取；图谱用全量数据（props.data.graph）。
 */
export default function ImportPreviewDetail(props: {
  data: PreviewData
  onFetchPage: (q: PreviewQuery) => Promise<PreviewData>
  onSelectionChange?: (excludeEntityIds: string[]) => void
}) {
  const { data: d } = props
  // ── 选择状态（跨页累积；提交时随配置携带） ──
  const [excluded, setExcluded] = useState<ReadonlySet<string>>(new Set())
  // ── 表格分页/筛选（后端） ──
  const [entPage, setEntPage] = useState(1)
  const [edgePage, setEdgePage] = useState(1)
  const [entQ, setEntQ] = useState("")
  const [entType, setEntType] = useState("")
  const [entOnlySel, setEntOnlySel] = useState(false)
  const [edgeQ, setEdgeQ] = useState("")
  const [edgeType, setEdgeType] = useState("")
  const [edgeStatus, setEdgeStatus] = useState<"all" | "in" | "out">("all")
  const [tableData, setTableData] = useState<PreviewData>(d)
  const [loading, setLoading] = useState(false)
  // 类型驱动的筛选配置（filter-config-service）与表单值
  const [entSchemas, setEntSchemas] = useState<FilterSchema[]>([])
  const [edgeSchemas, setEdgeSchemas] = useState<FilterSchema[]>([])
  const [entFormValues, setEntFormValues] = useState<FilterFormValues>({})
  const [edgeFormValues, setEdgeFormValues] = useState<FilterFormValues>({})
  const skipFetchRef = useRef(true)

  // 拉取类型驱动的筛选配置（全局配置，挂载一次）
  useEffect(() => {
    let alive = true
    Promise.all([filterSchema("node"), filterSchema("edge")])
      .then(([n, e]) => {
        if (!alive) return
        setEntSchemas(n)
        setEdgeSchemas(e)
      })
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [])

  // 关键字防抖（输入 300ms 后再请求）
  const [debEntQ, setDebEntQ] = useState("")
  useEffect(() => {
    const t = window.setTimeout(() => setDebEntQ(entQ), 300)
    return () => window.clearTimeout(t)
  }, [entQ])
  const [debEdgeQ, setDebEdgeQ] = useState("")
  useEffect(() => {
    const t = window.setTimeout(() => setDebEdgeQ(edgeQ), 300)
    return () => window.clearTimeout(t)
  }, [edgeQ])

  // ── 图谱数据（全量） + 选中子图（两端都未被排除的边） ──
  const graphData = d.graph
  // 实体 → 关联边统计（全量图谱的边数 + 去重边类型；供实体表格展示）
  const entityEdgeStats = useMemo(() => {
    const stats = new Map<string, { count: number; types: Set<string> }>()
    for (const ed of graphData?.edges ?? []) {
      for (const id of [ed.source, ed.target]) {
        let s = stats.get(id)
        if (!s) {
          s = { count: 0, types: new Set() }
          stats.set(id, s)
        }
        s.count += 1
        s.types.add(ed.linkType)
      }
    }
    return stats
  }, [graphData])
  const selected = useMemo(() => {
    if (!graphData) return { entities: [], edges: [], ids: new Set<string>() }
    const entities = graphData.entities.filter((e) => !excluded.has(e.id))
    const ids = new Set(entities.map((e) => e.id))
    const edges = graphData.edges.filter(
      (ed) => ids.has(ed.source) && ids.has(ed.target),
    )
    return { entities, edges, ids }
  }, [graphData, excluded])

  // 上报排除清单（提交时随配置携带）
  useEffect(() => {
    props.onSelectionChange?.(Array.from(excluded))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [excluded])

  // 新解析结果 → 重置选择、分页、筛选与图谱
  useEffect(() => {
    setExcluded(new Set())
    setEntPage(1)
    setEdgePage(1)
    setEntQ("")
    setEntType("")
    setEntOnlySel(false)
    setEdgeQ("")
    setEdgeType("")
    setEdgeStatus("all")
    setTableData(d)
    setPaused(false)
    setApplied(null)
    skipFetchRef.current = true
  }, [d])

  // 当前类型的可筛属性配置 + 条件 DSL（类型驱动筛选）
  const entTypeSchemas = entSchemas.filter((s) => s.typeName === entType)
  const edgeTypeSchemas = edgeSchemas.filter((s) => s.typeName === edgeType)
  const entityConditions = (() => {
    if (!entType || entTypeSchemas.length === 0) return ""
    const conds = conditionsFromValues(entTypeSchemas, entFormValues)
    return conds.length ? JSON.stringify({ and: conds }) : ""
  })()
  const edgeConditions = (() => {
    if (!edgeType || edgeTypeSchemas.length === 0) return ""
    const conds = conditionsFromValues(edgeTypeSchemas, edgeFormValues)
    return conds.length ? JSON.stringify({ and: conds }) : ""
  })()

  // 拉取表格页（后端分页 + 筛选）
  const needsExclusion = entOnlySel || edgeStatus !== "all"
  const loadPage = async (): Promise<void> => {
    setLoading(true)
    try {
      const res = await props.onFetchPage({
        page: entPage,
        pageSize: PAGE_SIZE,
        entQ: entQ || undefined,
        entType: entType || undefined,
        entOnlySel,
        edgeQ: edgeQ || undefined,
        edgeType: edgeType || undefined,
        edgeStatus,
        entityConditions: entityConditions || undefined,
        edgeConditions: edgeConditions || undefined,
        excludedIds: needsExclusion ? Array.from(excluded) : [],
      })
      setTableData(res)
    } catch {
      /* 瞬时错误忽略 */
    } finally {
      setLoading(false)
    }
  }

  // 分页/筛选变化 → 拉取（初始页来自 props.data，跳过首次）
  useEffect(() => {
    if (skipFetchRef.current) {
      skipFetchRef.current = false
      return
    }
    void loadPage()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    entPage,
    debEntQ,
    entType,
    entOnlySel,
    edgePage,
    debEdgeQ,
    edgeType,
    edgeStatus,
    entFormValues,
    edgeFormValues,
  ])

  // 选择变化且开了「仅已选/已排除」筛选 → 重拉（服务端按排除清单过滤）
  useEffect(() => {
    if (!needsExclusion) return
    if (skipFetchRef.current) return
    void loadPage()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [excluded])

  // ── 图谱联动：首次全量应用；此后防抖应用；超阈值暂停自动联动 ──
  const [applied, setApplied] = useState<{
    entities: ParsedEntity[]
    edges: ParsedEdge[]
  } | null>(null)
  const [paused, setPaused] = useState(false)
  const [fitKey, setFitKey] = useState(0)

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

  // 「全选已筛」：请求筛选后的实体 id 全集（ids-only，轻量）
  const selectAllFiltered = async (): Promise<void> => {
    try {
      const res = await props.onFetchPage({
        page: 1,
        pageSize: 1,
        entQ: entQ || undefined,
        entType: entType || undefined,
        entOnlySel,
        edgeQ: edgeQ || undefined,
        edgeType: edgeType || undefined,
        edgeStatus,
        excludedIds: Array.from(excluded),
        includeIds: true,
      })
      const ids = res.entityIds ?? []
      setExcluded((prev) => {
        const next = new Set(prev)
        ids.forEach((id) => next.delete(id))
        return next
      })
    } catch {
      /* 忽略 */
    }
  }

  const entFilterActive = entQ !== "" || entType !== "" || entOnlySel

  return (
    <>
      <div className="kg-stat-row">
        <Stat label="实体" value={tableData.entityCount} />
        <Stat label="关系" value={tableData.edgeCount} />
        <Stat label="跳过" value={tableData.skipped} tone="warn" />
        <Stat
          label="错误"
          value={tableData.errors.length}
          tone={tableData.errors.length ? "bad" : "ok"}
        />
      </div>
      {(tableData.errors.length > 0 || tableData.warnings.length > 0) && (
        <div
          className={
            tableData.errors.length ? "kg-msg kg-msg-err" : "kg-msg kg-msg-warn"
          }
        >
          <ul>
            {(tableData.errors.length ? tableData.errors : tableData.warnings)
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
              已选 <b>{selected.entities.length}</b>/{tableData.entityCount}{" "}
              实体 · 将入库 <b>{selected.edges.length}</b>/{tableData.edgeCount}{" "}
              边
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
                setExcluded(
                  new Set((graphData?.entities ?? []).map((e) => e.id)),
                )
              }
            >
              清空
            </button>
            {entFilterActive && (
              <button
                className="kg-btn kg-btn-ghost kg-btn-sm"
                onClick={() => void selectAllFiltered()}
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
                onChange={(e) => {
                  setEntQ(e.target.value)
                  setEntPage(1)
                }}
              />
              <select
                value={entType}
                onChange={(e) => {
                  setEntType(e.target.value)
                  setEntPage(1)
                  setEntFormValues(
                    emptyValues(
                      entSchemas.filter((s) => s.typeName === e.target.value),
                    ),
                  )
                }}
              >
                <option value="">全部类型</option>
                {(graphData
                  ? [
                      ...new Set(graphData.entities.map((e) => e.nodeType)),
                    ].sort()
                  : []
                ).map((t) => (
                  <option key={t} value={t}>
                    {nodeTypeLabel(t)}
                  </option>
                ))}
              </select>
              <label className="kg-filter-check">
                <input
                  type="checkbox"
                  checked={entOnlySel}
                  onChange={(e) => {
                    setEntOnlySel(e.target.checked)
                    setEntPage(1)
                  }}
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
                    setEntPage(1)
                  }}
                >
                  重置
                </button>
              )}
              <span className="kg-filter-count">
                {tableData.entityTotal} 条{loading ? "…" : ""}
              </span>
            </div>
            {entTypeSchemas.length > 0 ? (
              <TypeFilterForm
                schemas={entTypeSchemas}
                values={entFormValues}
                onChange={(v) => {
                  setEntFormValues(v)
                  setEntPage(1)
                }}
              />
            ) : (
              <span className="kg-filter-hint">
                {entType
                  ? "该类型暂无筛选配置"
                  : "选择类型后按筛选配置显示筛选项"}
              </span>
            )}
            {tableData.entityTotal === 0 ? (
              <div className="kg-empty">
                {tableData.entityCount === 0 ? "无实体数据" : "无匹配数据"}
              </div>
            ) : (
              <EntitySelectTable
                entities={tableData.entities}
                excluded={excluded}
                onToggle={toggleEntity}
                page={entPage}
                total={tableData.entityTotal}
                onPage={setEntPage}
                edgeStats={entityEdgeStats}
              />
            )}
            <div className="kg-filter-bar">
              <input
                className="kg-filter-input"
                type="search"
                placeholder="搜索源/目标/关系"
                value={edgeQ}
                onChange={(e) => {
                  setEdgeQ(e.target.value)
                  setEdgePage(1)
                }}
              />
              <select
                value={edgeType}
                onChange={(e) => {
                  setEdgeType(e.target.value)
                  setEdgePage(1)
                  setEdgeFormValues(
                    emptyValues(
                      edgeSchemas.filter((s) => s.typeName === e.target.value),
                    ),
                  )
                }}
              >
                <option value="">全部关系</option>
                {(graphData
                  ? [...new Set(graphData.edges.map((e) => e.linkType))].sort()
                  : []
                ).map((t) => (
                  <option key={t} value={t}>
                    {relationLabel(t)}
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
                    setEdgePage(1)
                  }}
                >
                  重置
                </button>
              )}
              <span className="kg-filter-count">
                {tableData.edgeTotal} 条{loading ? "…" : ""}
              </span>
            </div>
            {edgeTypeSchemas.length > 0 ? (
              <TypeFilterForm
                schemas={edgeTypeSchemas}
                values={edgeFormValues}
                onChange={(v) => {
                  setEdgeFormValues(v)
                  setEdgePage(1)
                }}
              />
            ) : (
              <span className="kg-filter-hint">
                {edgeType
                  ? "该类型暂无筛选配置"
                  : "选择类型后按筛选配置显示筛选项"}
              </span>
            )}
            {tableData.edgeTotal === 0 ? (
              <div className="kg-empty">
                {tableData.edgeCount === 0 ? "无关系数据" : "无匹配数据"}
              </div>
            ) : (
              <EdgeStatusTable
                edges={tableData.edges}
                selectedIds={selected.ids}
                page={edgePage}
                total={tableData.edgeTotal}
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
              节点较多（{selected.entities.length} &gt; {GRAPH_LIVE_LIMIT}
              ），实时联动已暂停；调整选择后点击「刷新图谱」应用。
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
  total: number
  onPage: (p: number) => void
  edgeStats: Map<string, { count: number; types: Set<string> }>
}) {
  const pages = Math.max(1, Math.ceil(props.total / PAGE_SIZE))
  return (
    <div className="kg-table-wrap">
      <table className="kg-table">
        <thead>
          <tr>
            <th>入库</th>
            <th>编号</th>
            <th>类型</th>
            <th>关联边</th>
            <th>名称</th>
            <th>属性</th>
          </tr>
        </thead>
        <tbody>
          {props.entities.map((e) => {
            const s = props.edgeStats.get(e.id)
            const types = s ? [...s.types].map(relationLabel).join("、") : ""
            return (
              <tr
                key={e.id}
                className={props.excluded.has(e.id) ? "kg-row-off" : ""}
              >
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
                <td>
                  {s && s.count > 0 ? (
                    <div
                      className="kg-edge-stats"
                      title={s.count + " 条边：" + types}
                    >
                      <b>{s.count}</b> 条<p>{types ? "(" + types + ")" : ""}</p>
                    </div>
                  ) : (
                    <span className="dim">—</span>
                  )}
                </td>
                <td>{e.label || "—"}</td>
                <td className="dim">{formatProps(e.props)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <Pager
        page={props.page}
        pages={pages}
        total={props.total}
        onPage={props.onPage}
      />
    </div>
  )
}

function EdgeStatusTable(props: {
  edges: ParsedEdge[]
  selectedIds: ReadonlySet<string>
  page: number
  total: number
  onPage: (p: number) => void
}) {
  const pages = Math.max(1, Math.ceil(props.total / PAGE_SIZE))
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
          {props.edges.map((e) => {
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
                  <span className="kg-tag kg-tag-blue">
                    {relationLabel(e.linkType)}
                  </span>
                </td>
                <td className="mono">{e.target}</td>
                <td className="mono">
                  {String(e.rank ?? e.props.rank ?? "—")}
                </td>
                <td className="dim">{e.time}</td>
                <td className="dim">{formatProps(e.props)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <Pager
        page={props.page}
        pages={pages}
        total={props.total}
        onPage={props.onPage}
      />
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
        disabled={props.page === 1}
        onClick={() => props.onPage(props.page - 1)}
      >
        上一页
      </button>
      <span>
        每页 {PAGE_SIZE} 条 · 第 {props.page}/{props.pages} 页（共 {props.total}{" "}
        条）
      </span>
      <button
        className="kg-btn kg-btn-ghost kg-btn-sm"
        disabled={props.page >= props.pages}
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
