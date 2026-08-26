import React from "react"
import type { CSSProperties } from "react"
import { RegionSelect } from "./RegionSelect"
import type { FilterFormValues, FilterSchema, FilterValue } from "./index"

export interface TypeFilterFormProps {
  /** 该类型的可筛属性配置（已按 sortOrder 排序） */
  schemas: FilterSchema[]
  values: FilterFormValues
  onChange: (values: FilterFormValues) => void
}

/**
 * 类型驱动的动态筛选表单：按 schema.filterType 渲染控件（text/select/number_range/date_range/bool）。
 * 纯受控组件，样式内联自包含，任何子应用可直接复用。
 */
export function TypeFilterForm(props: TypeFilterFormProps) {
  const schemas = props.schemas.filter((s) => s.enabled)
  if (schemas.length === 0) return null

  const set = (attrKey: string, v: FilterValue): void =>
    props.onChange({ ...props.values, [attrKey]: v })

  const labelStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 12,
    color: "rgb(var(--muted-foreground))",
    whiteSpace: "nowrap",
  }
  const inputStyle: CSSProperties = {
    minWidth: 90,
    padding: "4px 8px",
    border: "1px solid rgb(var(--border) / 0.6)",
    borderRadius: 6,
    background: "rgb(var(--background))",
    color: "rgb(var(--foreground))",
    fontSize: 12,
  }

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "8px 14px",
        alignItems: "center",
      }}
    >
      {schemas.map((s) => {
        const v = props.values[s.attrKey]
        return (
          <label key={s.attrKey} style={labelStyle}>
            <span>{s.label}</span>
            {s.filterType === "text" && (
              <input
                type="text"
                style={inputStyle}
                value={(v as string) ?? ""}
                placeholder={s.unit ? `单位：${s.unit}` : ""}
                onChange={(e) => set(s.attrKey, e.target.value)}
              />
            )}
            {s.filterType === "select" && (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 4,
                }}
              >
                {(s.options ?? []).map((opt) => {
                  const sel = (v as string[] ?? []).includes(opt)
                  return (
                    <label
                      key={opt}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 3,
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={sel}
                        onChange={() =>
                          set(
                            s.attrKey,
                            sel
                              ? (v as string[]).filter((x) => x !== opt)
                              : [...(v as string[] ?? []), opt],
                          )
                        }
                      />
                      <span>{opt}</span>
                    </label>
                  )
                })}
              </div>
            )}
            {s.filterType === "number_range" && (
              <span style={{ display: "inline-flex", gap: 4, alignItems: "center" }}>
                <input
                  type="number"
                  style={{ ...inputStyle, minWidth: 70 }}
                  value={((v as [number | null, number | null])?.[0] ?? "") as string | number}
                  placeholder="最小"
                  onChange={(e) =>
                    set(s.attrKey, [
                      e.target.value === "" ? null : Number(e.target.value),
                      (v as [number | null, number | null])?.[1] ?? null,
                    ])
                  }
                />
                <span style={{ color: "rgb(var(--muted))" }}>~</span>
                <input
                  type="number"
                  style={{ ...inputStyle, minWidth: 70 }}
                  value={((v as [number | null, number | null])?.[1] ?? "") as string | number}
                  placeholder="最大"
                  onChange={(e) =>
                    set(s.attrKey, [
                      (v as [number | null, number | null])?.[0] ?? null,
                      e.target.value === "" ? null : Number(e.target.value),
                    ])
                  }
                />
                {s.unit && <span style={{ color: "rgb(var(--muted))" }}>{s.unit}</span>}
              </span>
            )}
            {s.filterType === "date_range" && (
              <span style={{ display: "inline-flex", gap: 4, alignItems: "center" }}>
                <input
                  type="date"
                  style={{ ...inputStyle, minWidth: 120 }}
                  value={(v as [string, string])?.[0] ?? ""}
                  onChange={(e) =>
                    set(s.attrKey, [
                      e.target.value,
                      (v as [string, string])?.[1] ?? "",
                    ])
                  }
                />
                <span style={{ color: "rgb(var(--muted))" }}>~</span>
                <input
                  type="date"
                  style={{ ...inputStyle, minWidth: 120 }}
                  value={(v as [string, string])?.[1] ?? ""}
                  onChange={(e) =>
                    set(s.attrKey, [
                      (v as [string, string])?.[0] ?? "",
                      e.target.value,
                    ])
                  }
                />
              </span>
            )}
            {s.filterType === "bool" && (
              <input
                type="checkbox"
                checked={Boolean(v)}
                onChange={(e) => set(s.attrKey, e.target.checked)}
              />
            )}
            {s.filterType === "region" && (
              <RegionSelect
                value={(v as string) ?? ""}
                onChange={(val) => set(s.attrKey, val)}
              />
            )}
          </label>
        )
      })}
    </div>
  )
}
