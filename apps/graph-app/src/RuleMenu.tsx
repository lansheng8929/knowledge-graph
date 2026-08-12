/**
 * RuleMenu — 规则组装工作流
 *
 * 支持：
 * - 选择目标节点类型
 * - 选择关系类型
 * - 添加属性过滤器（等于/包含/大于/小于/布尔等）
 */

import { useState, useMemo } from "react"
import { PanelContainer, PanelLayer } from "./panel"
import type { GraphNode } from "@lansheng/knowledge-graph/client/type"
import { nodeTypeLabel, relationLabel, propertyLabel } from "./i18n"

// ─── 属性过滤器类型 ──────────────────────────────────

interface PropertyFilter {
  property: string
  operator: string
  value: string
}

interface RuleCondition {
  targetType: string
  relationType: string
  direction: string
  filters: PropertyFilter[]
}

// ─── 每种节点类型的可过滤属性 ────────────────────────

const NODE_PROPERTIES: Record<
  string,
  { name: string; type: "string" | "number" | "boolean" }[]
> = {
  person: [
    { name: "label", type: "string" },
    { name: "gender", type: "string" },
    { name: "age", type: "number" },
    { name: "caseWeight", type: "number" },
  ],
  phone: [{ name: "label", type: "string" }],
  address: [{ name: "label", type: "string" }],
  account: [{ name: "label", type: "string" }],
}

const OPERATORS: Record<string, { label: string; types: string[] }> = {
  eq: { label: "=", types: ["string", "number"] },
  neq: { label: "≠", types: ["string", "number"] },
  contains: { label: "包含", types: ["string"] },
  starts: { label: "开头是", types: ["string"] },
  gt: { label: ">", types: ["number"] },
  gte: { label: "≥", types: ["number"] },
  lt: { label: "<", types: ["number"] },
  lte: { label: "≤", types: ["number"] },
}

interface RuleMenuProps {
  node: GraphNode
  loadedNeighbors: Record<string, { out: number; in: number }>
  x: number
  y: number
  onExpand: (
    nodeId: string,
    ruleIds: string[],
    conditions?: RuleCondition[],
  ) => void
  onClose: () => void
}

export function RuleMenu({
  node,
  loadedNeighbors,
  x,
  y,
  onExpand,
  onClose,
}: RuleMenuProps) {
  // 从节点邻居摘要中提取有数据的类型和关系
  const neighbors = (node.data as any)?.neighbors ?? {}
  const neighborTypes = Object.keys(neighbors)

  // 只显示邻居中存在且未拓完的目标类型
  const targetTypeOptions = useMemo(
    () =>
      neighborTypes.filter((t) => {
        const total = Object.values(neighbors[t] ?? {}).reduce(
          (a: number, b: any) => a + (b.total ?? 0),
          0,
        )
        const loaded = loadedNeighbors[t] ?? { out: 0, in: 0 }
        return total - (loaded.out + loaded.in) > 0
      }),
    [neighborTypes, neighbors, loadedNeighbors],
  )

  // 获取指定目标类型下实际存在的关系
  const getAvailableRelations = (targetType: string): string[] =>
    neighbors[targetType] ? Object.keys(neighbors[targetType]) : []

  // 获取指定目标+关系的首个可用方向
  const getDefaultDirection = (
    targetType: string,
    relationType: string,
  ): string => {
    const info = neighbors[targetType]?.[relationType]
    if (info?.out && info.out > 0) return "out"
    if (info?.in && info.in > 0) return "in"
    return ""
  }

  // 剩余可拓方向列表（与方向下拉的选项逻辑一致：减去已加载数）
  const getRemainDirections = (
    targetType: string,
    relationType: string,
  ): string[] => {
    const info = neighbors[targetType]?.[relationType]
    const loaded = loadedNeighbors[targetType] ?? { out: 0, in: 0 }
    const opts: string[] = []
    if ((info?.out ?? 0) - loaded.out > 0) opts.push("out")
    if ((info?.in ?? 0) - loaded.in > 0) opts.push("in")
    return opts
  }

  // 当前组装的规则条件列表
  const defaultTarget = targetTypeOptions[0] ?? ""
  const defaultRel = defaultTarget
    ? (getAvailableRelations(defaultTarget)[0] ?? "")
    : ""
  const [conditions, setConditions] = useState<RuleCondition[]>([
    {
      targetType: defaultTarget,
      relationType: defaultRel,
      direction: getDefaultDirection(defaultTarget, defaultRel),
      filters: [],
    },
  ])
  // 表单校验：记录具体字段的校验错误，如 "0.targetType"
  const [invalidFields, setInvalidFields] = useState<Set<string>>(new Set())
  const fieldKey = (ci: number, field: string) => `${ci}.${field}`

  const validate = (): boolean => {
    const inv = new Set<string>()

    conditions.forEach((c, i) => {
      if (!c.targetType) inv.add(fieldKey(i, "targetType"))
      if (!c.relationType) inv.add(fieldKey(i, "relationType"))
      if (!c.direction) inv.add(fieldKey(i, "direction"))
    })
    setInvalidFields(inv)
    return inv.size === 0
  }

  const clearFieldError = (ci: number, field: string) => {
    setInvalidFields((prev) => {
      const next = new Set(prev)
      next.delete(fieldKey(ci, field))
      return next
    })
  }

  const updateCondition = (idx: number, patch: Partial<RuleCondition>) => {
    setConditions((prev) => {
      const updated = prev.map((c, i) => (i === idx ? { ...c, ...patch } : c))

      if ("targetType" in patch || "relationType" in patch) {
        const c = updated[idx]
        const avail = getAvailableRelations(c.targetType)
        if (c.relationType && !avail.includes(c.relationType)) {
          updated[idx] = { ...c, relationType: avail[0], filters: [] }
        }
        // 筛选后：方向自动选中第一个可用方向（与下拉选项一致）
        const remainDirs = getRemainDirections(
          updated[idx].targetType,
          updated[idx].relationType,
        )
        updated[idx] = {
          ...updated[idx],
          direction: remainDirs[0] ?? "",
        }
      }
      return updated
    })
    // 修改后清除该字段的校验错误
    Object.keys(patch).forEach((key) => clearFieldError(idx, key))
  }

  const addCondition = () => {
    const t = targetTypeOptions[0] ?? ""
    const rel = t ? (getAvailableRelations(t)[0] ?? "") : ""
    setConditions((prev) => [
      ...prev,
      {
        targetType: t,
        relationType: rel,
        direction: getDefaultDirection(t, rel),
        filters: [],
      },
    ])
  }

  const removeCondition = (idx: number) => {
    setConditions((prev) => prev.filter((_, i) => i !== idx))
  }

  // 过滤器操作
  const addFilter = (condIdx: number) => {
    setConditions((prev) =>
      prev.map((c, i) =>
        i === condIdx
          ? {
              ...c,
              filters: [
                ...c.filters,
                { property: "", operator: "eq", value: "" },
              ],
            }
          : c,
      ),
    )
  }

  const updateFilter = (
    condIdx: number,
    filterIdx: number,
    patch: Partial<PropertyFilter>,
  ) => {
    setConditions((prev) =>
      prev.map((c, i) =>
        i === condIdx
          ? {
              ...c,
              filters: c.filters.map((f, j) =>
                j === filterIdx ? { ...f, ...patch } : f,
              ),
            }
          : c,
      ),
    )
  }

  const removeFilter = (condIdx: number, filterIdx: number) => {
    setConditions((prev) =>
      prev.map((c, i) =>
        i === condIdx
          ? { ...c, filters: c.filters.filter((_, j) => j !== filterIdx) }
          : c,
      ),
    )
  }

  // 根据目标类型获取可用属性
  const getProperties = (targetType: string) =>
    NODE_PROPERTIES[targetType] ?? [{ name: "label", type: "string" }]

  // 根据属性类型获取可用操作符
  const getOperators = (propType: string) =>
    Object.entries(OPERATORS)
      .filter(([, v]) => v.types.includes(propType))
      .map(([k, v]) => ({ key: k, label: v.label }))

  const fieldStyle = (
    ci: number,
    field: string,
    base: React.CSSProperties,
  ): React.CSSProperties =>
    invalidFields.has(fieldKey(ci, field))
      ? { ...base, borderColor: "#d32f2f", outline: "1px solid #d32f2f" }
      : base

  const getPropType = (targetType: string, propName: string): string => {
    const props = NODE_PROPERTIES[targetType]
    return props?.find((p) => p.name === propName)?.type ?? "string"
  }

  // 以 canvas 画布为边界
  const canvas = document.querySelector("canvas")
  const canvasRect = canvas?.getBoundingClientRect() ?? {
    left: 0,
    top: 0,
    width: window.innerWidth,
    height: window.innerHeight,
  }
  const canvasBottom = canvasRect.top + canvasRect.height
  const canvasRight = canvasRect.left + canvasRect.width

  const winW = 420
  const winH = Math.max(250, Math.round(window.innerHeight * 0.2))
  let posX = x
  let posY = y

  // 防止超出右边界
  if (posX + winW > canvasRight - 10) posX = canvasRight - winW - 10
  // 防止超出下边界
  if (posY + winH > canvasBottom - 10) posY = canvasBottom - winH - 10
  // 防止超出上边界（以 canvas 顶部为准）
  if (posY < canvasRect.top + 10) posY = canvasRect.top + 10

  return (
    <PanelContainer
      id="rule-menu"
      layer={PanelLayer.Panel}
      draggable
      onClose={onClose}
      position={{ x: posX, y: posY }}
      style={{
        width: winW,
        maxHeight: winH,
        background: "rgb(var(--background))",
        color: "rgb(var(--foreground))",
        border: "1px solid rgb(var(--border))",
        borderRadius: "8px",
        boxShadow: "var(--shadow)",
        fontFamily: "monospace",
        fontSize: "13px",
        display: "flex",
        flexDirection: "column",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* ─── 头部 ─── */}
      <div
        style={{
          padding: "10px 14px",
          borderBottom: "1px solid rgb(var(--border))",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <span
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "#4a90d9",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            fontSize: "12px",
            flexShrink: 0,
          }}
        >
          {node.data?.label?.[0] ?? "?"}
        </span>
        <span
          style={{
            fontWeight: "bold",
            fontSize: "13px",
            color: "rgb(var(--foreground))",
          }}
        >
          {node.data?.label ?? node.id}
        </span>
      </div>

      {/* ─── 条件列表 ─── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "6px 0" }}>
        {conditions.map((cond, ci) => {
          const props = getProperties(cond.targetType)
          return (
            <div
              key={ci}
              style={{
                margin: "4px 10px",
                background: "rgb(var(--hover))",
                borderRadius: 6,
                border: "1px solid rgb(var(--border))",
              }}
            >
              {/* 条件头 — 语义：从本节点 → [关系] → [目标类型] */}
              <div
                style={{
                  padding: "8px 10px",
                  display: "flex",
                  gap: "4px",
                  alignItems: "center",
                  borderBottom: "1px solid rgb(var(--border))",
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    color: "rgb(var(--muted))",
                    fontSize: "11px",
                    whiteSpace: "nowrap",
                  }}
                >
                  查找 当前节点
                </span>

                <span
                  style={{
                    color: cond.direction === "out" ? "#1976d2" : "#e67e22",
                    fontSize: "13px",
                  }}
                >
                  {cond.direction === "out" ? "→" : "←"}
                </span>

                <select
                  value={cond.relationType}
                  onChange={(e) =>
                    updateCondition(ci, { relationType: e.target.value })
                  }
                  style={fieldStyle(ci, "relationType", {
                    ...selectStyle,
                    width: 65,
                  })}
                >
                  <option value="">关系</option>
                  {getAvailableRelations(cond.targetType).map((rel) => (
                    <option key={rel} value={rel}>
                      {relationLabel(rel)}
                    </option>
                  ))}
                </select>

                <span
                  style={{
                    color: cond.direction === "out" ? "#1976d2" : "#e67e22",
                    fontSize: "13px",
                  }}
                >
                  {cond.direction === "out" ? "→" : "←"}
                </span>

                <select
                  value={cond.targetType}
                  onChange={(e) =>
                    updateCondition(ci, { targetType: e.target.value })
                  }
                  style={fieldStyle(ci, "targetType", {
                    ...selectStyle,
                    width: 85,
                  })}
                >
                  <option value="">类型</option>
                  {targetTypeOptions.map((t) => {
                    const total = Object.values(neighbors[t] ?? {}).reduce(
                      (a: number, b: any) => a + (b.total ?? 0),
                      0,
                    )
                    const loaded = loadedNeighbors[t] ?? { out: 0, in: 0 }
                    const remain = total - (loaded.out + loaded.in)
                    return (
                      <option key={t} value={t}>
                        {nodeTypeLabel(t)} ({remain})
                      </option>
                    )
                  })}
                </select>

                <select
                  value={cond.direction}
                  onChange={(e) =>
                    updateCondition(ci, { direction: e.target.value })
                  }
                  style={fieldStyle(ci, "direction", {
                    ...selectStyle,
                    width: 100,
                  })}
                >
                  <option value="">方向</option>
                  {(() => {
                    const info = neighbors[cond.targetType]?.[cond.relationType]
                    const loaded = loadedNeighbors[cond.targetType] ?? {
                      out: 0,
                      in: 0,
                    }
                    const remainOut = (info?.out ?? 0) - loaded.out
                    const remainIn = (info?.in ?? 0) - loaded.in
                    const opts: { value: string; label: string }[] = []
                    if (remainOut > 0)
                      opts.push({
                        value: "out",
                        label: `从本节点 (${remainOut})`,
                      })
                    if (remainIn > 0)
                      opts.push({
                        value: "in",
                        label: `指向本节点 (${remainIn})`,
                      })
                    return (
                      opts.length > 0 &&
                      opts.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))
                    )
                  })()}
                </select>

                {conditions.length > 1 && (
                  <span
                    style={{
                      color: "#d32f2f",
                      cursor: "pointer",
                      fontSize: "14px",
                    }}
                    onClick={() => removeCondition(ci)}
                  >
                    ✕
                  </span>
                )}
              </div>

              {/* 过滤器列表 */}
              {cond.filters.map((f, fi) => {
                const propType = f.property
                  ? getPropType(cond.targetType, f.property)
                  : "string"
                const ops = getOperators(propType)
                return (
                  <div
                    key={fi}
                    style={{
                      padding: "6px 10px 6px 14px",
                      display: "flex",
                      gap: "4px",
                      alignItems: "center",
                      borderBottom: "1px solid rgb(var(--border))",
                      flexWrap: "wrap",
                    }}
                  >
                    <select
                      value={f.property}
                      onChange={(e) =>
                        updateFilter(ci, fi, {
                          property: e.target.value,
                          operator: "eq",
                          value: "",
                        })
                      }
                      style={{ ...selectStyle, width: 80 }}
                    >
                      <option value="">属性</option>
                      {props.map((p) => (
                        <option key={p.name} value={p.name}>
                          {propertyLabel(p.name)}
                        </option>
                      ))}
                    </select>

                    {f.property && (
                      <>
                        <select
                          value={f.operator}
                          onChange={(e) =>
                            updateFilter(ci, fi, { operator: e.target.value })
                          }
                          style={{ ...selectStyle, width: 80 }}
                        >
                          {ops.map((o) => (
                            <option key={o.key} value={o.key}>
                              {o.label}
                            </option>
                          ))}
                        </select>

                        <input
                          placeholder="值"
                          value={f.value}
                          onChange={(e) =>
                            updateFilter(ci, fi, { value: e.target.value })
                          }
                          style={{ ...inputStyle, width: 60 }}
                        />
                      </>
                    )}

                    <span
                      style={{
                        color: "#d32f2f",
                        cursor: "pointer",
                        fontSize: "12px",
                      }}
                      onClick={() => removeFilter(ci, fi)}
                    >
                      ✕
                    </span>
                  </div>
                )
              })}

              {/* 添加过滤器 */}
              <div
                style={{
                  padding: "6px 10px",
                  textAlign: "center",
                }}
              >
                <span
                  style={{
                    color: "#1976d2",
                    cursor: "pointer",
                    fontSize: "11px",
                  }}
                  onClick={() => addFilter(ci)}
                >
                  + 添加过滤条件
                </span>
              </div>
            </div>
          )
        })}

        {/* 添加条件 */}
        <div style={{ textAlign: "center", padding: "6px 0" }}>
          <span
            style={{ color: "#1976d2", cursor: "pointer", fontSize: "12px" }}
            onClick={addCondition}
          >
            + 添加拓出条件
          </span>
        </div>
      </div>

      {/* ─── 底部 ─── */}
      <div
        style={{
          padding: "8px 14px",
          borderTop: "1px solid rgb(var(--border))",
          display: "flex",
          gap: "8px",
          justifyContent: "flex-end",
        }}
      >
        <button
          style={{
            ...btnStyle,
            border: "1px solid rgb(var(--border-strong))",
            background: "transparent",
            color: "rgb(var(--muted))",
          }}
          onClick={onClose}
        >
          取消
        </button>
        <button
          style={{
            ...btnStyle,
            border: "none",
            background: "#1976d2",
            color: "#fff",
            fontWeight: "bold",
          }}
          onClick={() => {
            if (!validate()) return
            onExpand(node.id, ["__custom__"], conditions)
            onClose()
          }}
        >
          执行
        </button>
      </div>
    </PanelContainer>
  )
}

// ─── 共享样式 ────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  background: "rgb(var(--background))",
  border: "1px solid rgb(var(--border))",
  borderRadius: 3,
  color: "rgb(var(--foreground))",
  padding: "3px 6px",
  fontSize: "11px",
  outline: "none",
  fontFamily: "monospace",
}

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  cursor: "pointer",
}

const btnStyle: React.CSSProperties = {
  padding: "5px 12px",
  borderRadius: 4,
  cursor: "pointer",
  fontSize: "11px",
}
