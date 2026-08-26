import { Fragment, useCallback, useEffect, useMemo, useState } from "react"
import {
  EDGE_TYPE_LABELS,
  FILTER_TYPE_LABELS,
  KIND_LABELS,
  NODE_TYPE_LABELS,
  typeNameLabel,
} from "@lansheng/filter-builder"
import type { FilterType } from "@lansheng/filter-builder"
import {
  createSchema,
  deleteSchema,
  listSchemas,
  updateSchema,
  type SchemaInput,
  type SchemaRow,
} from "./api"

const FILTER_TYPES: FilterType[] = ["text", "select", "number_range", "date_range", "bool", "region"]

const EMPTY_FORM: SchemaInput = {
  typeKind: "node",
  typeName: "",
  attrKey: "",
  filterType: "text",
  label: "",
  unit: "",
  options: [],
  sortOrder: 0,
  enabled: true,
}

/** 类型驱动的筛选配置管理（融入 shell 的子应用，CRUD filter_schema）。 */
export default function App() {
  const [rows, setRows] = useState<SchemaRow[]>([])
  const [kind, setKind] = useState("")
  const [name, setName] = useState("")
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null)
  const [editing, setEditing] = useState<SchemaRow | null>(null)
  const [form, setForm] = useState<SchemaInput>(EMPTY_FORM)
  // 已知类型名（下拉查询用；来自已加载行去重）
  const typeNames = useMemo(
    () => Array.from(new Set(rows.map((r) => r.typeName))).sort(),
    [rows],
  )
  // 已展开的类型组（空 = 默认全部收缩）；按类型分组，保持首次出现顺序
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const groups = useMemo(() => {
    const map = new Map<string, { typeKind: "node" | "edge"; typeName: string; items: SchemaRow[] }>()
    for (const r of rows) {
      const k = `${r.typeKind}:${r.typeName}`
      let g = map.get(k)
      if (!g) { g = { typeKind: r.typeKind, typeName: r.typeName, items: [] }; map.set(k, g) }
      g.items.push(r)
    }
    return Array.from(map.values())
  }, [rows])
  const toggleGroup = (k: string): void => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(k)) next.delete(k)
      else next.add(k)
      return next
    })
  }

  const load = useCallback(async (): Promise<void> => {
    try {
      const rows = await listSchemas(
        (kind || undefined) as "node" | "edge" | undefined,
        name.trim() || undefined,
      )
      setRows(rows)
    } catch (e) {
      setMsg({ text: e instanceof Error ? e.message : String(e), ok: false })
    }
  }, [kind, name])

  useEffect(() => {
    void load()
  }, [load])

  const openNew = (): void => {
    setEditing(null)
    setForm(EMPTY_FORM)
  }
  const openEdit = (r: SchemaRow): void => {
    setEditing(r)
    setForm({
      typeKind: r.typeKind,
      typeName: r.typeName,
      attrKey: r.attrKey,
      filterType: r.filterType,
      label: r.label,
      unit: r.unit ?? "",
      options: r.options ?? [],
      sortOrder: r.sortOrder,
      enabled: r.enabled,
    })
  }

  const save = async (): Promise<void> => {
    try {
      if (editing) {
        await updateSchema(editing.id, form)
        setMsg({ text: "已更新", ok: true })
      } else {
        await createSchema(form)
        setMsg({ text: "已新增", ok: true })
      }
      setEditing(null)
      void load()
    } catch (e) {
      setMsg({ text: e instanceof Error ? e.message : String(e), ok: false })
    }
  }

  const del = async (id: number): Promise<void> => {
    if (!window.confirm(`确定删除配置 #${id}？`)) return
    try {
      await deleteSchema(id)
      setMsg({ text: "已删除", ok: true })
      void load()
    } catch (e) {
      setMsg({ text: e instanceof Error ? e.message : String(e), ok: false })
    }
  }

  const patch = (p: Partial<SchemaInput>): void => setForm((f) => ({ ...f, ...p }))

  return (
    <div className="fca">
      <header className="fca-head">
        <h1>筛选配置管理</h1>
        <p>类型驱动的动态筛选：按 nodeType / linkType 定义可筛属性（写操作需 admin 角色）</p>
      </header>
      {msg && (
        <div className={`fca-msg ${msg.ok ? "ok" : "err"}`}>{msg.text}</div>
      )}
      <div className="fca-bar">
        <select
          value={kind}
          onChange={(e) => setKind(e.target.value)}
        >
          <option value="">全部种类</option>
          <option value="node">实体</option>
          <option value="edge">边</option>
        </select>
        <select
          value={name}
          onChange={(e) => setName(e.target.value)}
        >
          <option value="">全部类型</option>
          {typeNames.map((t) => (
            <option key={t} value={t}>
              {NODE_TYPE_LABELS[t] ?? EDGE_TYPE_LABELS[t] ?? t}
            </option>
          ))}
        </select>
        <button className="fca-btn" onClick={() => void load()}>查询</button>
        <button className="fca-btn fca-primary" onClick={openNew}>+ 新增</button>
      </div>

      {editing !== null || form.typeName !== "" ? (
        <div className="fca-form">
          <h3>{editing ? `编辑 #${editing.id}` : "新增配置"}</h3>
          <div className="fca-row">
            <label>种类
              <select
                value={form.typeKind}
                onChange={(e) => patch({ typeKind: e.target.value as "node" | "edge" })}
              >
                <option value="node">实体</option>
                <option value="edge">边</option>
              </select>
            </label>
            <label>类型名
              <select
                value={form.typeName}
                onChange={(e) => patch({ typeName: e.target.value })}
              >
                <option value="">请选择类型</option>
                {form.typeName !== "" && !typeNames.includes(form.typeName) ? (
                  <option value={form.typeName}>
                    {NODE_TYPE_LABELS[form.typeName] ?? EDGE_TYPE_LABELS[form.typeName] ?? form.typeName}
                  </option>
                ) : null}
                {typeNames.map((t) => (
                  <option key={t} value={t}>
                    {NODE_TYPE_LABELS[t] ?? EDGE_TYPE_LABELS[t] ?? t}
                  </option>
                ))}
              </select>
            </label>
            <label>属性键
              <input value={form.attrKey} onChange={(e) => patch({ attrKey: e.target.value })} placeholder="ipLocation" />
            </label>
            <label>筛选器
              <select
                value={form.filterType}
                onChange={(e) => patch({ filterType: e.target.value as FilterType })}
              >
                {FILTER_TYPES.map((t) => (
                  <option key={t} value={t}>{FILTER_TYPE_LABELS[t]}</option>
                ))}
              </select>
            </label>
            <label>显示名
              <input value={form.label} onChange={(e) => patch({ label: e.target.value })} placeholder="IP归属地" />
            </label>
            <label>单位
              <input value={form.unit} onChange={(e) => patch({ unit: e.target.value })} placeholder="kg / 秒（可选）" />
            </label>
            <label>选项（select 用，逗号分隔）
              <input
                value={form.options.join(",")}
                onChange={(e) => patch({ options: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
                placeholder="电信,联通,移动"
              />
            </label>
            <label>排序
              <input type="number" value={form.sortOrder} onChange={(e) => patch({ sortOrder: Number(e.target.value) || 0 })} />
            </label>
            <label className="fca-check">
              <input type="checkbox" checked={form.enabled} onChange={(e) => patch({ enabled: e.target.checked })} />
              启用
            </label>
          </div>
          <div className="fca-row">
            <button className="fca-btn fca-primary" onClick={() => void save()}>保存</button>
            <button className="fca-btn" onClick={() => { setEditing(null); setForm(EMPTY_FORM) }}>取消</button>
          </div>
        </div>
      ) : null}

      <div className="fca-table-wrap">
        <table className="fca-table">
          <thead><tr>
            <th className="fca-th-toggle" aria-label="展开/收缩"></th>
            <th>显示名</th><th>id</th><th>属性</th><th>筛选器</th><th>单位</th><th>选项</th><th>排序</th><th>启用</th><th>操作</th>
          </tr></thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={10} className="fca-empty">暂无配置</td></tr>
            ) : (
              groups.map((g) => {
                const k = `${g.typeKind}:${g.typeName}`
                const open = expanded.has(k)
                return (
                  <Fragment key={k}>
                    <tr className="fca-group" onClick={() => toggleGroup(k)}>
                      <td className="fca-toggle-cell">
                        <span className="fca-toggle" aria-hidden="true">{open ? "▾" : "▸"}</span>
                      </td>
                      <td colSpan={9}>
                        <span className={`fca-pill ${g.typeKind}`}>{KIND_LABELS[g.typeKind]}</span>{" "}
                        {typeNameLabel(g.typeKind, g.typeName)}
                        <span className="fca-count">{g.items.length} 条配置</span>
                      </td>
                    </tr>
                    {open &&
                      g.items.map((r) => (
                        <tr key={r.id} className="fca-subrow">
                          <td></td>
                          <td className="fca-name">{r.label}</td>
                          <td>{r.id}</td>
                          <td>{r.attrKey}</td>
                          <td>{FILTER_TYPE_LABELS[r.filterType]}</td>
                          <td>{r.unit || "—"}</td>
                          <td>{(r.options ?? []).join(", ")}</td>
                          <td>{r.sortOrder}</td>
                          <td><span className={`fca-pill ${r.enabled ? "on" : "off"}`}>{r.enabled ? "启用" : "停用"}</span></td>
                          <td>
                            <button className="fca-btn" onClick={() => openEdit(r)}>编辑</button>
                            <button className="fca-btn fca-danger" onClick={() => void del(r.id)}>删除</button>
                          </td>
                        </tr>
                      ))}
                  </Fragment>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
