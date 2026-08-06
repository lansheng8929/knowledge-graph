/** file-import-service API 客户端（相对路径，经 shell 代理 / 网关到达后端）。 */

import type {
  ImportConfig,
  ImportOptions,
  ImportTask,
  ImportTemplate,
  PreviewData,
} from "./types"

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

/** 单个文件：解析 + 校验（不写库）。 */
export async function preview(
  file: File,
  config: ImportConfig,
  templateId: string | null = null,
): Promise<PreviewData> {
  const res = await fetch("/api/v1/import/preview", {
    method: "POST",
    headers: headers(),
    body: formData(file, config, templateId),
  })
  return parseData<PreviewData>(res)
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
