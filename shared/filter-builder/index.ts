/**
 * 类型驱动的动态筛选：schema / 条件 DSL / 表单（任何子应用可复用）。
 *
 * 数据流：filter_schema（配置服务）→ FilterSchema 列表 → TypeFilterForm 渲染 →
 *       FilterFormValues → conditionsFromValues → FilterGroup（DSL JSON）→ 后端查询。
 */

import { regionMatchValue } from "./region-data"

export type FilterType = "text" | "select" | "number_range" | "date_range" | "bool" | "region"
export type TypeKind = "node" | "edge"

/** 类型种类中文标签 */
export const KIND_LABELS: Record<TypeKind, string> = {
  node: "实体",
  edge: "边",
}

/** 筛选器类型中文标签 */
export const FILTER_TYPE_LABELS: Record<FilterType, string> = {
  text: "文本",
  select: "枚举",
  number_range: "数值范围",
  date_range: "日期范围",
  bool: "布尔",
  region: "地区",
}

/** 已知实体类型中文标签（未命中回退原值） */
export const NODE_TYPE_LABELS: Record<string, string> = {
  person: "人员",
  phone: "手机号",
  address: "地址",
  account: "账户",
  company: "公司",
  ip: "IP地址",
  device: "设备",
  default: "默认",
}

/** 已知边类型中文标签（未命中回退原值） */
export const EDGE_TYPE_LABELS: Record<string, string> = {
  OWNS: "名下",
  RESIDES_AT: "居住",
  WORKS_AT: "工作",
  HAS_ACCOUNT: "开户",
  LOGIN_IP: "登录",
  USE_DEVICE: "使用设备",
  CALLED: "通话",
  CALL: "通话",
  TRANSACTED: "转账",
  TRANSFER: "转账",
}

/** 类型名 → 中文显示标签（管理平台/表单共用） */
export function typeNameLabel(typeKind: TypeKind, typeName: string): string {
  const map = typeKind === "node" ? NODE_TYPE_LABELS : EDGE_TYPE_LABELS
  return map[typeName] ?? typeName
}

export interface FilterSchema {
  id: number
  typeKind: "node" | "edge"
  typeName: string
  attrKey: string
  filterType: FilterType
  label: string
  unit?: string
  options?: string[]
  sortOrder: number
  enabled: boolean
}

/** 条件 DSL 的操作符 */
export type FilterOp =
  | "contains"
  | "eq"
  | "neq"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "in"
  | "between"

export interface FilterCondition {
  attr: string
  op: FilterOp
  value:
    | string
    | number
    | boolean
    | [number, number]
    | [string, string]
    | string[]
}

/** 条件组：AND 组合（v1；后续可扩展 or/edge 约束） */
export interface FilterGroup {
  and: FilterCondition[]
}

/** 表单值：attrKey → 值（null/空 = 未设置） */
export type FilterValue =
  | string
  | number
  | boolean
  | [number | null, number | null]
  | [string, string]
  | string[]
  | null

export type FilterFormValues = Record<string, FilterValue>

/** 按 schema 生成空表单值（number_range=[null,null]、date_range=["",""]、select=[]、bool=false） */
export function emptyValues(schemas: FilterSchema[]): FilterFormValues {
  const v: FilterFormValues = {}
  for (const s of schemas) {
    if (s.filterType === "number_range") v[s.attrKey] = [null, null]
    else if (s.filterType === "date_range") v[s.attrKey] = ["", ""]
    else if (s.filterType === "select") v[s.attrKey] = []
    else if (s.filterType === "bool") v[s.attrKey] = false
    else v[s.attrKey] = ""
  }
  return v
}

/** 表单值 → 条件 DSL（空值跳过；number_range/date_range 支持单边 gte/lte） */
export function conditionsFromValues(
  schemas: FilterSchema[],
  values: FilterFormValues,
): FilterCondition[] {
  const conds: FilterCondition[] = []
  for (const s of schemas) {
    if (!s.enabled) continue
    const v = values[s.attrKey]
    if (v === null || v === undefined || v === "") continue
    switch (s.filterType) {
      case "text":
        conds.push({ attr: s.attrKey, op: "contains", value: String(v) })
        break
      case "select": {
        const arr = Array.isArray(v) ? (v as string[]) : [String(v)]
        if (arr.length > 0) conds.push({ attr: s.attrKey, op: "in", value: arr })
        break
      }
      case "number_range": {
        const r = v as [number | null, number | null]
        if (r[0] !== null && r[1] !== null)
          conds.push({ attr: s.attrKey, op: "between", value: [r[0], r[1]] })
        else if (r[0] !== null) conds.push({ attr: s.attrKey, op: "gte", value: r[0] })
        else if (r[1] !== null) conds.push({ attr: s.attrKey, op: "lte", value: r[1] })
        break
      }
      case "date_range": {
        const r = v as [string, string]
        if (r[0] && r[1]) conds.push({ attr: s.attrKey, op: "between", value: r })
        else if (r[0]) conds.push({ attr: s.attrKey, op: "gte", value: r[0] })
        else if (r[1]) conds.push({ attr: s.attrKey, op: "lte", value: r[1] })
        break
      }
      case "bool":
        conds.push({ attr: s.attrKey, op: "eq", value: Boolean(v) })
        break
      case "region":
        conds.push({ attr: s.attrKey, op: "contains", value: regionMatchValue(String(v)) })
        break
    }
  }
  return conds
}

export { RegionSelect } from "./RegionSelect"
export type { RegionSelectProps } from "./RegionSelect"
export { REGION_DATA, regionMatchValue, stripSuffix } from "./region-data"
export type { RegionNode } from "./region-data"
export { TypeFilterForm } from "./TypeFilterForm"
export type { TypeFilterFormProps } from "./TypeFilterForm"
