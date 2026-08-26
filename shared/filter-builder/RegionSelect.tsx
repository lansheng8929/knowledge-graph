import React, { useMemo } from "react"
import type { CSSProperties } from "react"
import { REGION_DATA } from "./region-data"

export interface RegionSelectProps {
  /** 已选地区完整值（如 "浙江省杭州市西湖区"） */
  value: string
  onChange: (v: string) => void
}

const selectStyle: CSSProperties = {
  padding: "4px 8px",
  border: "1px solid rgb(var(--border) / 0.6)",
  borderRadius: 6,
  background: "rgb(var(--background))",
  color: "rgb(var(--foreground))",
  fontSize: 12,
}

/** 地区选择：省→市→区 三级联动（只选省/市也允许；值 = 已选各级拼接）。 */
export function RegionSelect(props: RegionSelectProps) {
  const { value, onChange } = props

  const parts = useMemo(() => {
    const p = REGION_DATA.find((r) => value.startsWith(r.name)) ?? null
    const c = p?.children?.find((x) => value.includes(x.name)) ?? null
    const d = c?.children?.find((x) => value.includes(x.name)) ?? null
    return { p, c, d }
  }, [value])

  const setP = (name: string): void => onChange(name)
  const setC = (name: string): void => onChange(parts.p!.name + name)
  const setD = (name: string): void => onChange(parts.p!.name + parts.c!.name + name)

  return (
    <span style={{ display: "inline-flex", gap: 4, alignItems: "center" }}>
      <select style={selectStyle} value={parts.p?.name ?? ""} onChange={(e) => setP(e.target.value)}>
        <option value="">请选择省</option>
        {REGION_DATA.map((r) => (
          <option key={r.name} value={r.name}>{r.name}</option>
        ))}
      </select>
      {parts.p?.children ? (
        <select style={selectStyle} value={parts.c?.name ?? ""} onChange={(e) => setC(e.target.value)}>
          <option value="">请选择市</option>
          {parts.p.children.map((c) => (
            <option key={c.name} value={c.name}>{c.name}</option>
          ))}
        </select>
      ) : null}
      {parts.c?.children ? (
        <select style={selectStyle} value={parts.d?.name ?? ""} onChange={(e) => setD(e.target.value)}>
          <option value="">请选择区</option>
          {parts.c.children.map((d) => (
            <option key={d.name} value={d.name}>{d.name}</option>
          ))}
        </select>
      ) : null}
    </span>
  )
}
