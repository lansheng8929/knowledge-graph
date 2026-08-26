import type { FilterType } from "@lansheng/filter-builder"

let authToken = ""

export function setAuthToken(token: string): void {
  authToken = token
}

function headers(): Record<string, string> {
  const h: Record<string, string> = { "Content-Type": "application/json" }
  if (authToken) h["Authorization"] = `Bearer ${authToken}`
  return h
}

export interface SchemaRow {
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

export interface SchemaInput {
  typeKind: "node" | "edge"
  typeName: string
  attrKey: string
  filterType: FilterType
  label: string
  unit: string
  options: string[]
  sortOrder: number
  enabled: boolean
}

async function request<T>(method: string, url: string, body?: unknown): Promise<T> {
  const res = await fetch(url, {
    method,
    headers: headers(),
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  const data = await res.json().catch(() => null)
  if (!res.ok) {
    const detail = (data as { detail?: string } | null)?.detail
    throw new Error(detail || `HTTP ${res.status}`)
  }
  return (data as { data: T }).data
}

export function listSchemas(
  typeKind?: "node" | "edge",
  typeName?: string,
): Promise<SchemaRow[]> {
  const params = new URLSearchParams()
  if (typeKind) params.set("type_kind", typeKind)
  if (typeName) params.set("type_name", typeName)
  const qs = params.toString()
  return request<SchemaRow[]>("GET", `/api/v1/filter-schema${qs ? `?${qs}` : ""}`)
}

export function createSchema(input: SchemaInput): Promise<SchemaRow> {
  return request<SchemaRow>("POST", "/api/v1/filter-schema", input)
}

export function updateSchema(id: number, input: SchemaInput): Promise<SchemaRow> {
  return request<SchemaRow>("PUT", `/api/v1/filter-schema/${id}`, input)
}

export function deleteSchema(id: number): Promise<{ deleted: number }> {
  return request<{ deleted: number }>("DELETE", `/api/v1/filter-schema/${id}`)
}
