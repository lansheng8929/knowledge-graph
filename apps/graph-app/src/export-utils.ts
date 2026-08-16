import type { GraphModel } from "@lansheng/knowledge-graph"
import { linkEndpoints } from "./link-utils"

/** 触发浏览器下载 */
export function download(
  filename: string,
  content: string,
  type: string,
): void {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

/** 导出选中子图：JSON=节点+关联边全量数据；CSV=节点扁平表（Excel 可开） */
export function exportSelection(
  model: GraphModel,
  selectedIds: Set<string>,
  fmt: "json" | "csv",
): void {
  const gd = model.getGraphModelData().graphData
  const nodes = gd.nodes.filter((n) => selectedIds.has(n.id))
  const idSet = new Set(nodes.map((n) => n.id))
  const links = gd.links.filter((l) => {
    const [s, t] = linkEndpoints(l)
    return idSet.has(s) && idSet.has(t)
  })

  if (fmt === "json") {
    download(
      "selection.json",
      JSON.stringify({ nodes, links }, null, 2),
      "application/json",
    )
    return
  }

  const header = [
    "id",
    "label",
    "nodeType",
    "clusterId",
    "gender",
    "age",
    "caseWeight",
  ]
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`
  const rows = nodes.map((n) => {
    const d = (n.data as any) ?? {}
    return [
      n.id,
      d.label,
      d.nodeType,
      d.clusterId,
      d.gender,
      d.age,
      d.caseWeight,
    ]
      .map(esc)
      .join(",")
  })
  download("selection.csv", [header.join(","), ...rows].join("\n"), "text/csv")
}
