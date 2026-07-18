import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"
import fs from "fs"

// ─── Mock API Server ─────────────────────────────────

function parseCSV(filePath: string): Record<string, string>[] {
  const text = fs.readFileSync(filePath, "utf-8").trim()
  const lines = text.split("\n")
  if (lines.length < 2) return []
  const headers = lines[0].split(",").map((h) => h.trim())
  return lines.slice(1).map((line) => {
    const values = line.split(",").map((v) => v.trim())
    const record: Record<string, string> = {}
    headers.forEach((h, i) => {
      record[h] = values[i] ?? ""
    })
    return record
  })
}

const DATA_DIR = path.resolve(__dirname, "mock-data")

interface RawNode {
  id: string
  nodeType: string
  label: string
  icon: string
  extra: string
}
interface RawLink {
  id: string
  source: string
  target: string
  linkType: string
  label: string
}
interface RawRule {
  nodeType: string
  ruleId: string
  ruleName: string
  targetNodeType: string
  relationType: string
  direction: string
  limit: string
  autoExpand: string
}

let _nodes: RawNode[] | null = null
let _links: RawLink[] | null = null
let _rules: RawRule[] | null = null

function getNodes(): RawNode[] {
  if (!_nodes) _nodes = parseCSV(path.join(DATA_DIR, "nodes.csv")) as RawNode[]
  return _nodes
}
function getLinks(): RawLink[] {
  if (!_links) _links = parseCSV(path.join(DATA_DIR, "links.csv")) as RawLink[]
  return _links
}
function getRules(): RawRule[] {
  if (!_rules) _rules = parseCSV(path.join(DATA_DIR, "rules.csv")) as RawRule[]
  return _rules
}

function getRulesForNodeType(nodeType: string): RawRule[] {
  return getRules().filter((r) => r.nodeType === nodeType)
}

function toGraphNode(raw: RawNode) {
  const extraObj: Record<string, string> = {}
  if (raw.extra) {
    raw.extra.split(";").forEach((kv) => {
      const [k, v] = kv.split(":")
      if (k && v) extraObj[k] = v
    })
  }
  return {
    id: raw.id,
    data: {
      nodeType: raw.nodeType,
      label: raw.label,
      icon: raw.icon,
      count: 0,
      total: 0,
      ...extraObj,
    },
  }
}

function toGraphLink(raw: RawLink) {
  return {
    id: raw.id,
    source: raw.source,
    target: raw.target,
    data: { linkType: raw.linkType, label: raw.label },
  }
}

function executeExpand(req: {
  sourceNodeId: string
  ruleId: string
  pageIndex: number
  pageSize: number
  existingNodeIds: string[]
  existingLinkIds: string[]
}) {
  const rule = getRules().find((r) => r.ruleId === req.ruleId)
  if (!rule)
    return {
      nodes: [],
      links: [],
      total: 0,
      pageIndex: req.pageIndex,
      hasMore: false,
    }

  const allLinks = getLinks()
  const existNodeSet = new Set(req.existingNodeIds)
  const existLinkSet = new Set(req.existingLinkIds)
  const matchedLinks: RawLink[] = []

  if (rule.direction === "out") {
    for (const link of allLinks) {
      if (
        link.source === req.sourceNodeId &&
        link.linkType === rule.relationType &&
        !existLinkSet.has(link.id)
      ) {
        const targetNode = getNodes().find((n) => n.id === link.target)
        if (targetNode && targetNode.nodeType === rule.targetNodeType)
          matchedLinks.push(link)
      }
    }
  } else if (rule.direction === "in") {
    for (const link of allLinks) {
      if (
        link.target === req.sourceNodeId &&
        link.linkType === rule.relationType &&
        !existLinkSet.has(link.id)
      ) {
        const sourceNode = getNodes().find((n) => n.id === link.source)
        if (sourceNode && sourceNode.nodeType === rule.targetNodeType)
          matchedLinks.push(link)
      }
    }
  } else if (rule.direction === "both") {
    for (const link of allLinks) {
      if (
        (link.source === req.sourceNodeId ||
          link.target === req.sourceNodeId) &&
        link.linkType === rule.relationType &&
        !existLinkSet.has(link.id)
      ) {
        const otherId =
          link.source === req.sourceNodeId ? link.target : link.source
        const otherNode = getNodes().find((n) => n.id === otherId)
        if (otherNode && otherNode.nodeType === rule.targetNodeType)
          matchedLinks.push(link)
      }
    }
  }

  const targetNodeIds = new Set<string>()
  for (const link of matchedLinks) {
    const targetId = rule.direction === "in" ? link.source : link.target
    if (!existNodeSet.has(targetId)) targetNodeIds.add(targetId)
  }
  const total = targetNodeIds.size
  const skip = req.pageIndex * req.pageSize
  const pagedTargetIds = Array.from(targetNodeIds).slice(
    skip,
    skip + req.pageSize,
  )

  const resultNodes: ReturnType<typeof toGraphNode>[] = []
  const resultLinks: ReturnType<typeof toGraphLink>[] = []

  for (const link of matchedLinks) {
    const targetId = rule.direction === "in" ? link.source : link.target
    if (pagedTargetIds.includes(targetId) && !existLinkSet.has(link.id)) {
      resultLinks.push(toGraphLink(link))
      const targetRaw = getNodes().find((n) => n.id === targetId)
      if (targetRaw && !existNodeSet.has(targetId)) {
        const targetRules = getRulesForNodeType(targetRaw.nodeType)
        resultNodes.push({
          ...toGraphNode(targetRaw),
          data: {
            ...toGraphNode(targetRaw).data,
            count: 0,
            total: targetRules.length > 0 ? 100 : 0,
          },
        })
        existNodeSet.add(targetId)
      }
    }
  }

  return {
    nodes: resultNodes,
    links: resultLinks,
    total,
    pageIndex: req.pageIndex,
    hasMore: skip + req.pageSize < total,
  }
}

export default defineConfig({
  plugins: [
    react(),
    {
      name: "mock-api",
      configureServer(server) {
        // GET /api/graph/init — 返回初始种子数据
        server.middlewares.use("/api/graph/init", (_req, res) => {
          const seedIds = ["person-1", "person-2", "person-6"]
          const seedNodes = seedIds
            .map((id) => getNodes().find((n) => n.id === id)!)
            .filter(Boolean)
          const nodes = seedNodes.map((raw) => {
            const rules = getRulesForNodeType(raw.nodeType)
            return {
              ...toGraphNode(raw),
              data: {
                ...toGraphNode(raw).data,
                count: 0,
                total: rules.length > 0 ? 100 : 0,
              },
            }
          })
          const nodeIdSet = new Set(seedIds)
          const links = getLinks()
            .filter((l) => nodeIdSet.has(l.source) && nodeIdSet.has(l.target))
            .map(toGraphLink)

          const rulesMap: Record<string, unknown[]> = {}
          for (const node of nodes) {
            rulesMap[node.id] = getRulesForNodeType(node.data.nodeType).map(
              (r) => ({
                id: r.ruleId,
                name: r.ruleName,
                targetNodeType: r.targetNodeType,
                relationType: r.relationType,
                direction: r.direction,
                limit: parseInt(r.limit, 10),
                autoExpand: r.autoExpand === "true",
              }),
            )
          }

          res.setHeader("Content-Type", "application/json")
          res.end(
            JSON.stringify({
              success: true,
              data: { graphData: { nodes, links }, rulesMap },
            }),
          )
        })

        // GET /api/graph/rules?nodeId=xxx — 获取节点规则
        server.middlewares.use("/api/graph/rules", (req, res) => {
          const url = new URL(req.url!, `http://${req.headers.host}`)
          const nodeId = url.searchParams.get("nodeId") ?? ""
          const node = getNodes().find((n) => n.id === nodeId)
          const rules = node ? getRulesForNodeType(node.nodeType) : []
          const data = rules.map((r) => ({
            id: r.ruleId,
            name: r.ruleName,
            targetNodeType: r.targetNodeType,
            relationType: r.relationType,
            direction: r.direction,
            limit: parseInt(r.limit, 10),
            autoExpand: r.autoExpand === "true",
          }))
          res.setHeader("Content-Type", "application/json")
          res.end(JSON.stringify({ success: true, data }))
        })

        // POST /api/graph/expand — 执行拓出
        server.middlewares.use("/api/graph/expand", (req, res) => {
          let body = ""
          req.on("data", (chunk: string) => {
            body += chunk
          })
          req.on("end", () => {
            const json = JSON.parse(body)
            const result = executeExpand(json)
            const enrichedNodes = result.nodes.map((node) => {
              const rules = getRulesForNodeType(node.data.nodeType)
              return {
                ...node,
                data: {
                  ...node.data,
                  total: rules.length > 0 ? 100 : 0,
                  count: 0,
                },
              }
            })
            res.setHeader("Content-Type", "application/json")
            res.end(
              JSON.stringify({
                success: true,
                data: {
                  nodes: enrichedNodes,
                  links: result.links,
                  total: result.total,
                  pageIndex: result.pageIndex,
                  hasMore: result.hasMore,
                },
              }),
            )
          })
        })
      },
    },
  ],
  server: {
    port: 3000,
  },
})
