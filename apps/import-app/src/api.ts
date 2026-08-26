/** file-import-service API 客户端（相对路径，经 shell 代理 / 网关到达后端）。 */

import type {
  ImportConfig,
  ImportOptions,
  ImportTask,
  ImportTemplate,
  PreviewData,
  PreviewQuery,
} from "./types"
import type { FilterSchema as FbSchema } from "@lansheng/filter-builder"

let authToken = ""

export function setAuthToken(token: string): void {
  authToken = token
}

function headers(): Record<string, string> {
  const h: Record<string, string> = {}
  if (authToken) h["Authorization"] = `Bearer ${authToken}`
  return h
}

async function parseData<T>(res: Response): Promise<T> {
  const body = await res.json().catch(() => null)
  if (!res.ok) {
    const detail = (body as { detail?: string } | null)?.detail
    throw new Error(detail || `HTTP ${res.status}`)
  }
  const data = (body as { data?: T }).data
  if (data === undefined) throw new Error("响应格式异常")
  return data
}

function formData(
  file: File,
  config: ImportConfig,
  templateId: string | null,
): FormData {
  const fd = new FormData()
  fd.append("file", file, file.name)
  fd.append("config", JSON.stringify(config))
  fd.append("template_id", templateId ?? "")
  return fd
}

/** 单个文件：解析 + 校验（不写库）；支持表格后端分页/筛选（page/pageSize/ent_q/edge_q 等） */
export async function preview(
  file: File,
  config: ImportConfig,
  templateId: string | null = null,
  query: PreviewQuery = {},
): Promise<PreviewData> {
  const fd = formData(file, config, templateId)
  fd.append("page", String(query.page ?? 1))
  fd.append("page_size", String(query.pageSize ?? 10))
  fd.append("ent_q", query.entQ ?? "")
  fd.append("ent_type", query.entType ?? "")
  fd.append("ent_only_sel", query.entOnlySel ? "true" : "false")
  fd.append("edge_q", query.edgeQ ?? "")
  fd.append("edge_type", query.edgeType ?? "")
  fd.append("edge_status", query.edgeStatus ?? "all")
  fd.append("entity_conditions", query.entityConditions ?? "")
  fd.append("edge_conditions", query.edgeConditions ?? "")
  fd.append("excluded_ids", JSON.stringify(query.excludedIds ?? []))
  fd.append("include_graph", query.includeGraph ? "true" : "false")
  fd.append("include_ids", query.includeIds ? "true" : "false")
  const res = await fetch("/api/v1/import/preview", {
    method: "POST",
    headers: headers(),
    body: fd,
  })
  return parseData<PreviewData>(res)
}

/** 类型驱动的筛选配置（filter-config-service 经网关提供）。 */
export async function filterSchema(
  typeKind?: "node" | "edge",
  typeName?: string,
): Promise<FbSchema[]> {
  const params = new URLSearchParams()
  if (typeKind) params.set("type_kind", typeKind)
  if (typeName) params.set("type_name", typeName)
  const qs = params.toString()
  const res = await fetch(`/api/v1/filter-schema${qs ? `?${qs}` : ""}`, {
    method: "GET",
    headers: headers(),
  })
  return parseData<FbSchema[]>(res)
}

/** 单个文件：提交导入任务（一个文件 = 一个任务），返回 taskId。 */
export async function submitImport(
  file: File,
  config: ImportConfig,
  templateId: string | null = null,
): Promise<{ taskId: string }> {
  const res = await fetch("/api/v1/import/files", {
    method: "POST",
    headers: headers(),
    body: formData(file, config, templateId),
  })
  return parseData<{ taskId: string }>(res)
}

/** 查询导入任务状态/报告。 */
export async function getTask(taskId: string): Promise<ImportTask> {
  const res = await fetch(`/api/v1/import/tasks/${taskId}`, {
    headers: headers(),
  })
  return parseData<ImportTask>(res)
}

/** 历史任务列表（摘要，按创建时间倒序）。 */
export async function listTasks(): Promise<ImportTask[]> {
  const res = await fetch("/api/v1/import/tasks", {
    headers: headers(),
  })
  return parseData<ImportTask[]>(res)
}

/** 按当前登录用户权限拉取可配置项（默认值 + 约束）。 */
export async function getImportOptions(): Promise<ImportOptions> {
  const res = await fetch("/api/v1/import/options", {
    headers: headers(),
  })
  return parseData<ImportOptions>(res)
}

/** 拉取解析模板列表（默认第一个为当前解析规则）。 */
export async function getTemplates(): Promise<ImportTemplate[]> {
  const res = await fetch("/api/v1/import/templates", {
    headers: headers(),
  })
  return parseData<ImportTemplate[]>(res)
}
