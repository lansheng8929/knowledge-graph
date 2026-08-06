import { useEffect, useState } from "react"
import {
  getImportOptions,
  getTemplates,
  getTask,
  listTasks,
  preview,
  submitImport,
} from "./api"
import type {
  ImportConfig,
  ImportOptions,
  ImportTask,
  ImportTemplate,
  ParsedEdge,
  ParsedEntity,
  PreviewData,
  View,
} from "./types"

// 后端返回的英文状态 → 前端中文显示
const STATUS_TEXT: Record<string, string> = {
  pending: "排队中",
  running: "进行中",
  success: "成功",
  failed: "失败",
}
const STAGE_TEXT: Record<string, string> = {
  parsing: "解析",
  validating: "校验",
  writing: "写入",
  done: "完成",
}
const VISIBILITY_LABELS: Record<string, string> = {
  public: "公开",
  internal: "内部",
  private: "仅本人",
}
const CLASSIFICATION_OPTIONS = [
  { value: 0, label: "公开" },
  { value: 1, label: "内部" },
  { value: 2, label: "秘密" },
  { value: 3, label: "机密" },
]

/** 待上传的单个文件及其独立配置与预览状态。 */
interface ImportItem {
  id: string
  file: File
  templateId: string
  classification: number
  visibility: string
  businessKey: string
  previewData: PreviewData | null
  previewError: string | null
  previewing: boolean
  /** 上次已按该输入签名完成解析；签名不变则不再重复解析 */
  previewSig?: string
}

/** 文件解析的输入签名（仅输入变化才重新解析，结果变化不触发）。 */
function itemSig(it: ImportItem): string {
  return [
    it.file.name,
    it.file.lastModified,
    it.file.size,
    it.templateId,
    it.classification,
    it.visibility,
    it.businessKey,
  ].join("|")
}

/** 从 URL ?mode= 读取当前 tab（import | report），缺省 import。 */
function viewFromUrl(): View {
  const m = new URLSearchParams(window.location.search).get("mode")
  return m === "report" ? "report" : "import"
}

export default function App() {
  const [view, setView] = useState<View>(viewFromUrl)
  const [items, setItems] = useState<ImportItem[]>([])
  const [taskIds, setTaskIds] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [options, setOptions] = useState<ImportOptions | null>(null)
  const [templates, setTemplates] = useState<ImportTemplate[]>([])

  // 切 tab：同步 URL ?mode= 并压入历史，支持后退/前进
  const goTab = (v: View): void => {
    setView(v)
    const url = new URL(window.location.href)
    url.searchParams.set("mode", v)
    window.history.pushState({}, "", url)
  }

  // 后退/前进 → 按 URL 恢复 tab
  useEffect(() => {
    const onPop = (): void => setView(viewFromUrl())
    window.addEventListener("popstate", onPop)
    return () => window.removeEventListener("popstate", onPop)
  }, [])

  // 拉取权限可配置项 + 解析模板列表
  useEffect(() => {
    let alive = true
    Promise.all([
      getImportOptions().catch(() => null),
      getTemplates().catch(() => [] as ImportTemplate[]),
    ]).then(([opts, tpls]) => {
      if (!alive) return
      setOptions(opts)
      setTemplates(tpls)
    })
    return () => {
      alive = false
    }
  }, [])

  const firstTemplate = templates[0] ?? null

  // 各文件输入的签名串：作为自动解析 effect 的依赖（输入变化才重跑）
  const previewKey = items.map(itemSig).join("\n")

  // 组装单个文件的导入配置：权限默认打标 + 模板结构默认 + 该文件独立设置
  const buildConfig = (it: ImportItem): ImportConfig => {
    const tpl = templates.find((t) => t.id === it.templateId)
    const tc = tpl?.config ?? {}
    return {
      tags: {
        tenantId: options?.defaults.tenantId ?? "default",
        owner: options?.defaults.owner ?? it.file.name,
        classification: it.classification,
        visibility: it.visibility,
      },
      edge: {
        businessKey: it.businessKey
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
          .map((col) => ({ col })),
        insertMode: "update",
      },
      sheetMapping: { ...(tc.sheetMapping ?? {}) },
      nodeTypeDefault: tc.nodeTypeDefault,
      strictNodeTypes: tc.strictNodeTypes,
      dangling: tc.dangling as ImportConfig["dangling"] | undefined,
      danglingNodeType: tc.danglingNodeType,
    }
  }

  const addFiles = (files: FileList | null): void => {
    if (!files || files.length === 0) return
    const tpl = firstTemplate
    const bkDefault =
      tpl?.config?.edge?.businessKey?.map((b) => b.col).join(",") ?? ""
    const arr = Array.from(files)
    setItems((prev) => [
      ...prev,
      ...arr.map((file) => ({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        file,
        templateId: tpl?.id ?? "",
        classification: options?.defaults.classification ?? 0,
        visibility: options?.defaults.visibility ?? "internal",
        businessKey: bkDefault,
        previewData: null,
        previewError: null,
        previewing: false,
      })),
    ])
  }

  const removeItem = (id: string): void =>
    setItems((prev) => prev.filter((it) => it.id !== id))

  const updateItem = (id: string, patch: Partial<ImportItem>): void =>
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, ...patch } : it)),
    )

  // 每个文件自动解析（防抖）：仅输入签名变化时重跑；结果状态变化不触发循环。
  useEffect(() => {
    if (items.length === 0) return
    const timers = new Map<string, number>()
    items.forEach((it) => {
      const currentSig = itemSig(it)
      // 已按当前输入解析过 → 跳过，避免「解析中 / 结果」反复横跳
      if (it.previewSig === currentSig) return
      const cfg = buildConfig(it)
      const timer = window.setTimeout(async () => {
        updateItem(it.id, { previewing: true, previewError: null })
        try {
          const data = await preview(it.file, cfg, it.templateId)
          updateItem(it.id, {
            previewData: data,
            previewing: false,
            previewSig: currentSig,
          })
        } catch (e) {
          updateItem(it.id, {
            previewData: null,
            previewError: e instanceof Error ? e.message : String(e),
            previewing: false,
            previewSig: currentSig,
          })
        }
      }, 350)
      timers.set(it.id, timer)
    })
    return () => {
      timers.forEach((t) => window.clearTimeout(t))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewKey])

  // 每个文件一个任务：逐个提交
  const confirmAll = async (): Promise<void> => {
    if (items.length === 0) return
    setSubmitting(true)
    setError(null)
    const ids: string[] = []
    const errs: string[] = []
    for (const it of items) {
      try {
        const { taskId } = await submitImport(
          it.file,
          buildConfig(it),
          it.templateId,
        )
        ids.push(taskId)
      } catch (e) {
        errs.push(
          `${it.file.name}: ${e instanceof Error ? e.message : String(e)}`,
        )
      }
    }
    setSubmitting(false)
    if (errs.length) setError(errs.join("；"))
    if (ids.length) {
      setTaskIds(ids)
      goTab("report")
    }
  }

  return (
    <div className="kg-import">
      <header className="kg-import-head">
        <div>
          <h1>数据导入</h1>
          <p>添加多个文件，各自独立解析（每个文件一个任务），确认后一次导入</p>
        </div>
        <ol className="kg-import-steps">
          <li
            className={`kg-step-tab${view === "import" ? " on" : ""}`}
            onClick={() => goTab("import")}
          >
            选择与配置
          </li>
          <li
            className={`kg-step-tab${view === "report" ? " on" : ""}`}
            onClick={() => goTab("report")}
          >
            结果
          </li>
        </ol>
      </header>

      {error && (
        <div className="kg-import-error" role="alert">
          {error}
        </div>
      )}

      {view === "import" && (
        <MultiFileView
          items={items}
          addFiles={addFiles}
          removeItem={removeItem}
          updateItem={updateItem}
          templates={templates}
          options={options}
          submitting={submitting}
          onConfirm={confirmAll}
        />
      )}

      {view === "report" && <TasksView taskIds={taskIds} />}
    </div>
  )
}

/* ── 多文件导入：待上传文件框 + 每文件独立配置 ────── */

function MultiFileView(props: {
  items: ImportItem[]
  addFiles: (files: FileList | null) => void
  removeItem: (id: string) => void
  updateItem: (id: string, patch: Partial<ImportItem>) => void
  templates: ImportTemplate[]
  options: ImportOptions | null
  submitting: boolean
  onConfirm: () => void
}) {
  return (
    <div className="kg-import-body">
      <section className="kg-import-card space-y-2">
        <h2>待上传文件</h2>
        <MainFileDrop
          hasFile={props.items.length > 0}
          onFiles={props.addFiles}
        />
      </section>

      {props.items.map((it) => (
        <FileBox
          key={it.id}
          item={it}
          templates={props.templates}
          options={props.options}
          onRemove={() => props.removeItem(it.id)}
          onChange={(patch) => props.updateItem(it.id, patch)}
        />
      ))}

      <div className="kg-import-actions">
        <button
          className="kg-btn kg-btn-primary"
          disabled={props.items.length === 0 || props.submitting}
          onClick={props.onConfirm}
        >
          {props.submitting
            ? "提交中…"
            : `确认导入（${props.items.length} 个文件）`}
        </button>
      </div>
    </div>
  )
}

function MainFileDrop(props: {
  hasFile: boolean
  onFiles: (files: FileList | null) => void
}) {
  return (
    <label
      className={`kg-file-drop kg-file-drop-main${props.hasFile ? " has" : ""}`}
    >
      <input
        type="file"
        multiple
        accept=".xlsx,.xlsm,.csv"
        className="kg-file-input"
        onChange={(e) => {
          props.onFiles(e.target.files)
          e.target.value = ""
        }}
      />
      <div className="kg-file-icon">{props.hasFile ? "➕" : "📁"}</div>
      <div className="kg-file-name">
        {props.hasFile ? "继续添加文件" : "选择或拖入文件"}
      </div>
      <div className="kg-file-hint">
        支持多选 / 多次添加；每个文件独立导入为一个任务
      </div>
    </label>
  )
}

function FileBox(props: {
  item: ImportItem
  templates: ImportTemplate[]
  options: ImportOptions | null
  onRemove: () => void
  onChange: (patch: Partial<ImportItem>) => void
}) {
  const { item } = props
  const opts = props.options
  const classificationMax = opts?.constraints.classificationMax ?? 3
  const allowedVis = opts?.constraints.visibilityAllowed?.length
    ? opts.constraints.visibilityAllowed
    : Object.keys(VISIBILITY_LABELS)
  const tpl = props.templates.find((t) => t.id === item.templateId)
  return (
    <section className="kg-import-card space-y-2">
      <div className="kg-file-box-head">
        <span className="kg-file-box-name">📄 {item.file.name}</span>
        <span className="dim">{(item.file.size / 1024).toFixed(1)} KB</span>
        <button
          className="kg-btn kg-btn-ghost kg-btn-sm"
          onClick={props.onRemove}
        >
          移除
        </button>
      </div>

      <div className="kg-file-box-fields">
        <label className="kg-field">
          <span className="kg-field-label">解析模板</span>
          <select
            value={item.templateId}
            onChange={(e) => {
              // 切换模板：自动带出该模板配置的业务键（仍可逐文件微调）
              const t = props.templates.find((x) => x.id === e.target.value)
              props.onChange({
                templateId: e.target.value,
                businessKey:
                  t?.config?.edge?.businessKey?.map((b) => b.col).join(",") ??
                  "",
                previewData: null,
              })
            }}
          >
            {props.templates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </label>
        <label className="kg-field">
          <span className="kg-field-label">密级</span>
          <select
            value={item.classification}
            onChange={(e) =>
              props.onChange({ classification: Number(e.target.value) })
            }
          >
            {CLASSIFICATION_OPTIONS.filter(
              (o) => o.value <= classificationMax,
            ).map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <label className="kg-field">
          <span className="kg-field-label">可见性</span>
          <select
            value={item.visibility}
            onChange={(e) => props.onChange({ visibility: e.target.value })}
          >
            {allowedVis.map((v) => (
              <option key={v} value={v}>
                {VISIBILITY_LABELS[v] ?? v}
              </option>
            ))}
          </select>
        </label>
        <label className="kg-field">
          <span className="kg-field-label">业务键</span>
          <input
            value={item.businessKey}
            placeholder="如：通话时间"
            onChange={(e) => props.onChange({ businessKey: e.target.value })}
          />
        </label>
      </div>

      {tpl?.description && (
        <p className="kg-template-desc">{tpl.description}</p>
      )}

      <FilePreview item={item} />
    </section>
  )
}

function FilePreview(props: { item: ImportItem }) {
  const { item } = props
  if (item.previewing) {
    return (
      <div className="kg-preview-loading">
        <div className="kg-spinner" />
        <span>解析中…</span>
      </div>
    )
  }
  if (item.previewError) {
    return <div className="kg-msg kg-msg-err">{item.previewError}</div>
  }
  const d = item.previewData
  if (!d) return null
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
      <details className="kg-file-detail">
        <summary>
          预览详情（实体 {d.entities.length} · 关系 {d.edges.length}）
        </summary>
        <div className="kg-file-detail-body">
          <EntityTable entities={d.entities} />
          <EdgeTable edges={d.edges} />
        </div>
      </details>
    </>
  )
}

function EntityTable(props: { entities: ParsedEntity[] }) {
  if (props.entities.length === 0)
    return <div className="kg-empty">无实体数据</div>
  return (
    <div className="kg-table-wrap">
      <table className="kg-table">
        <thead>
          <tr>
            <th>编号</th>
            <th>类型</th>
            <th>名称</th>
            <th>属性</th>
          </tr>
        </thead>
        <tbody>
          {props.entities.map((e) => (
            <tr key={e.id}>
              <td className="mono">{e.id}</td>
              <td>
                <span className="kg-tag">{e.nodeType}</span>
              </td>
              <td>{e.label || "—"}</td>
              <td className="dim">{formatProps(e.props)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function EdgeTable(props: { edges: ParsedEdge[] }) {
  if (props.edges.length === 0)
    return <div className="kg-empty">无关系数据</div>
  return (
    <div className="kg-table-wrap">
      <table className="kg-table">
        <thead>
          <tr>
            <th>源</th>
            <th>关系</th>
            <th>目标</th>
            <th>序号</th>
            <th>更新时间</th>
            <th>属性</th>
          </tr>
        </thead>
        <tbody>
          {props.edges.map((e) => (
            <tr key={e.id}>
              <td className="mono">{e.source}</td>
              <td>
                <span className="kg-tag kg-tag-blue">{e.linkType}</span>
              </td>
              <td className="mono">{e.target}</td>
              <td className="mono">{String(e.rank ?? e.props.rank ?? "—")}</td>
              <td className="dim">{e.time}</td>
              <td className="dim">{formatProps(e.props)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ── 结果 tab：本次任务 + 历史任务 ─────────────────── */

/** 跳转到图谱并定位到导入的实体（single-spa 路由切换，不整页刷新）。 */
function openGraph(entityIds: string[]): void {
  const ids = entityIds.filter(Boolean)
  if (ids.length === 0) return
  const url = `/graph?ids=${encodeURIComponent(ids.join(","))}`
  window.history.pushState({}, "", url)
  window.dispatchEvent(new PopStateEvent("popstate"))
}

function TasksView(props: { taskIds: string[] }) {
  const [current, setCurrent] = useState<Record<string, ImportTask | null>>({})
  const [history, setHistory] = useState<ImportTask[]>([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const [detailId, setDetailId] = useState<string | null>(null)
  const [detail, setDetail] = useState<ImportTask | null>(null)

  // 本次提交的任务轮询
  useEffect(() => {
    if (props.taskIds.length === 0) return
    let alive = true
    const load = async (): Promise<void> => {
      const entries = await Promise.all(
        props.taskIds.map(async (id) => {
          try {
            return [id, await getTask(id)] as const
          } catch {
            return [id, null] as const
          }
        }),
      )
      if (alive) setCurrent(Object.fromEntries(entries))
    }
    load()
    const timer = setInterval(load, 1500)
    return () => {
      alive = false
      clearInterval(timer)
    }
  }, [props.taskIds])

  // 历史任务列表（每 3s 刷新，反映进行中任务状态）
  useEffect(() => {
    let alive = true
    const load = async (): Promise<void> => {
      try {
        const list = await listTasks()
        if (alive) setHistory(list)
      } catch {
        /* 瞬时错误忽略 */
      }
    }
    setHistoryLoading(true)
    load().finally(() => {
      if (alive) setHistoryLoading(false)
    })
    const timer = setInterval(load, 3000)
    return () => {
      alive = false
      clearInterval(timer)
    }
  }, [props.taskIds])

  // 任务详情
  useEffect(() => {
    if (!detailId) {
      setDetail(null)
      return
    }
    let alive = true
    getTask(detailId)
      .then((t) => {
        if (alive) setDetail(t)
      })
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [detailId])

  const currentFinished = props.taskIds.every((id) => {
    const t = current[id]
    return !!t && (t.status === "success" || t.status === "failed")
  })

  return (
    <div className="kg-import-body space-y-2">
      {props.taskIds.length > 0 && (
        <div className="kg-import-card space-y-2">
          <h2>本次导入（{props.taskIds.length} 个任务）</h2>
          {props.taskIds.map((id) => {
            const t = current[id]
            return (
              <div key={id} className="kg-task-row">
                <span className={`kg-pill ${t?.status ?? "pending"}`}>
                  {t ? (STATUS_TEXT[t.status] ?? t.status) : "加载中"}
                </span>
                <span className="kg-task-file">{t?.filename ?? "…"}</span>
                <span className="mono dim">{id.slice(0, 8)}</span>
                <span className="dim">
                  已导入 {t?.imported ?? "—"} · 跳过 {t?.skipped ?? "—"} · 错误{" "}
                  {t?.error_count ?? "—"}
                </span>
                {t && t.entity_ids?.length ? (
                  <button
                    className="kg-btn kg-btn-ghost kg-btn-sm"
                    onClick={() => openGraph(t.entity_ids)}
                  >
                    查看
                  </button>
                ) : null}
              </div>
            )
          })}
          {!currentFinished && (
            <div className="kg-preview-loading">
              <div className="kg-spinner" />
              <span>任务进行中…</span>
            </div>
          )}
        </div>
      )}

      {/* 历史任务 */}
      <div className="kg-import-card space-y-2">
        <div className="kg-result-head">
          <h2>历史任务（{history.length}）</h2>
          <button
            className="kg-btn kg-btn-ghost kg-btn-sm"
            onClick={() => {
              setHistoryLoading(true)
              listTasks()
                .then(setHistory)
                .finally(() => setHistoryLoading(false))
            }}
          >
            刷新
          </button>
        </div>
        {history.length === 0 ? (
          <div className="kg-empty">
            {historyLoading ? "加载中…" : "暂无历史任务"}
          </div>
        ) : (
          <div className="kg-table-wrap">
            <table className="kg-table">
              <thead>
                <tr>
                  <th>状态</th>
                  <th>文件</th>
                  <th>创建人</th>
                  <th>已导入</th>
                  <th>跳过</th>
                  <th>错误</th>
                  <th>创建时间</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {history.map((t) => (
                  <tr key={t.id} className="kg-task-row-tr">
                    <td>
                      <span className={`kg-pill ${t.status}`}>
                        {STATUS_TEXT[t.status] ?? t.status}
                      </span>
                    </td>
                    <td className="kg-task-file">{t.filename || "—"}</td>
                    <td>{t.owner || "—"}</td>
                    <td>{t.imported}</td>
                    <td>{t.skipped}</td>
                    <td>{t.error_count}</td>
                    <td className="dim">{t.created_at}</td>
                    <td>
                      <span className="kg-task-ops">
                        <button
                          className="kg-btn kg-btn-ghost kg-btn-sm"
                          disabled={!t.entity_ids?.length}
                          onClick={() => openGraph(t.entity_ids)}
                        >
                          查看
                        </button>
                        <button
                          className="kg-btn kg-btn-ghost kg-btn-sm"
                          onClick={() => setDetailId(t.id)}
                        >
                          详情
                        </button>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 任务详情 */}
      {detail && (
        <div className="kg-import-card space-y-2">
          <div className="kg-result-head">
            <h2>任务详情 · {detail.id}</h2>
            <button
              className="kg-btn kg-btn-ghost kg-btn-sm"
              onClick={() => setDetailId(null)}
            >
              关闭
            </button>
          </div>
          <div className="kg-task-row">
            <span className={`kg-pill ${detail.status}`}>
              {STATUS_TEXT[detail.status] ?? detail.status}
            </span>
            <span className="kg-task-file">{detail.filename || "—"}</span>
            <span className="dim">
              阶段：{STAGE_TEXT[detail.stage] ?? detail.stage}
            </span>
          </div>
          <div className="kg-stat-row">
            <Stat label="已导入" value={detail.imported} />
            <Stat label="跳过" value={detail.skipped} tone="warn" />
            <Stat
              label="错误"
              value={detail.error_count}
              tone={detail.error_count ? "bad" : "ok"}
            />
          </div>
          {detail.warnings.length > 0 && (
            <div className="kg-msg kg-msg-warn">
              <ul>
                {detail.warnings.slice(0, 20).map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
          )}
          {detail.errors.length > 0 && (
            <div className="kg-msg kg-msg-err">
              <ul>
                {detail.errors.slice(0, 20).map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ── 小组件 ─────────────────────────────────────────── */

function Stat(props: { label: string; value: number; tone?: string }) {
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
