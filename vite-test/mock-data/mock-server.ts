/**
 * Mock Server — 模拟后端 API
 *
 * 使用 CSV 文件作为"图数据库"，提供：
 * - GET  /api/graph/init       → 返回初始种子节点
 * - GET  /api/graph/rules?nodeId=xxx → 返回节点可用规则
 * - POST /api/graph/expand     → 执行拓出
 */

import fs from "node:fs"
import path from "node:path"

// ─── CSV 解析工具 ────────────────────────────────────

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

// ─── CSV 数据目录 ────────────────────────────────────

const DATA_DIR = path.resolve(import.meta.dirname, ".")

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

// ─── 数据加载（懒加载 + 缓存） ───────────────────────

let _nodes: RawNode[] | null = null
let _links: RawLink[] | null = null
let _rules: RawRule[] | null = null

function getNodes(): RawNode[] {
  if (!_nodes) {
    _nodes = parseCSV(path.join(DATA_DIR, "nodes.csv")) as RawNode[]
  }
  return _nodes
}

function getLinks(): RawLink[] {
  if (!_links) {
    _links = parseCSV(path.join(DATA_DIR, "links.csv")) as RawLink[]
  }
  return _links
}

function getRules(): RawRule[] {
  if (!_rules) {
    _rules = parseCSV(path.join(DATA_DIR, "rules.csv")) as RawRule[]
  }
  return _rules
}

// ─── 节点/边数据转换 ────────────────────────────────

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
    data: {
      linkType: raw.linkType,
      label: raw.label,
    },
  }
}

// ─── 规则查询 ────────────────────────────────────────

function getRulesForNodeType(nodeType: string): RawRule[] {
  return getRules().filter((r) => r.nodeType === nodeType)
}

function getRulesForNode(nodeId: string): RawRule[] {
  const node = getNodes().find((n) => n.id === nodeId)
  if (!node) return []
  return getRulesForNodeType(node.nodeType)
}

// ─── 拓出逻辑 ────────────────────────────────────────

interface ExpandRequest {
  sourceNodeId: string
  ruleId: string
  pageIndex: number
  pageSize: number
  existingNodeIds: string[]
  existingLinkIds: string[]
}

interface ExpandResponse {
  nodes: ReturnType<typeof toGraphNode>[]
  links: ReturnType<typeof toGraphLink>[]
  total: number
  pageIndex: number
  hasMore: boolean
}

function executeExpand(req: ExpandRequest): ExpandResponse {
  const rule = getRules().find((r) => r.ruleId === req.ruleId)
  if (!rule) {
    return {
      nodes: [],
      links: [],
      total: 0,
      pageIndex: req.pageIndex,
      hasMore: false,
    }
  }

  const allLinks = getLinks()
  const existNodeSet = new Set(req.existingNodeIds)
  const existLinkSet = new Set(req.existingLinkIds)

  // 根据规则方向找到关联的边
  const matchedLinks: RawLink[] = []

  if (rule.direction === "out") {
    for (const link of allLinks) {
      if (
        link.source === req.sourceNodeId &&
        link.linkType === rule.relationType &&
        !existLinkSet.has(link.id)
      ) {
        // 检查目标节点类型
        const targetNode = getNodes().find((n) => n.id === link.target)
        if (targetNode && targetNode.nodeType === rule.targetNodeType) {
          matchedLinks.push(link)
        }
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
        if (sourceNode && sourceNode.nodeType === rule.targetNodeType) {
          matchedLinks.push(link)
        }
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
        if (otherNode && otherNode.nodeType === rule.targetNodeType) {
          matchedLinks.push(link)
        }
      }
    }
  }

  // 计算总数（去重后的目标节点数）
  const targetNodeIds = new Set<string>()
  for (const link of matchedLinks) {
    const targetId = rule.direction === "in" ? link.source : link.target
    if (!existNodeSet.has(targetId)) {
      targetNodeIds.add(targetId)
    }
  }
  const total = targetNodeIds.size

  // 分页
  const skip = req.pageIndex * req.pageSize
  const pagedTargetIds = Array.from(targetNodeIds).slice(
    skip,
    skip + req.pageSize,
  )

  // 收集结果
  const resultNodes: ReturnType<typeof toGraphNode>[] = []
  const resultLinks: ReturnType<typeof toGraphLink>[] = []
  const resultLinkIds = new Set<string>()

  for (const link of matchedLinks) {
    const targetId = rule.direction === "in" ? link.source : link.target
    if (pagedTargetIds.includes(targetId) && !existLinkSet.has(link.id)) {
      resultLinkIds.add(link.id)
      resultLinks.push(toGraphLink(link))

      // 添加目标节点（如果尚未存在）
      const targetRaw = getNodes().find((n) => n.id === targetId)
      if (targetRaw && !existNodeSet.has(targetId)) {
        // 为目标节点也附上规则
        resultNodes.push({
          ...toGraphNode(targetRaw),
          data: {
            ...toGraphNode(targetRaw).data,
            count: 0,
            total: getRulesForNodeType(targetRaw.nodeType).length > 0 ? 100 : 0,
          },
        })
        existNodeSet.add(targetId) // 防止重复添加
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

// ─── 初始种子数据 ────────────────────────────────────

function getInitData() {
  // 选择前 3 个人作为初始种子节点
  const seedNodeIds = ["person-1", "person-2", "person-6"]
  const seedNodes = seedNodeIds
    .map((id) => getNodes().find((n) => n.id === id)!)
    .filter(Boolean)

  const nodes = seedNodes.map((raw) => {
    const rules = getRulesForNodeType(raw.nodeType)
    return {
      ...toGraphNode(raw),
      data: {
        ...toGraphNode(raw).data,
        count: 0,
        total: rules.length > 0 ? 100 : 0, // total>0 表示可拓出
      },
    }
  })

  // 种子节点之间的边
  const nodeIdSet = new Set(seedNodeIds)
  const links = getLinks()
    .filter((l) => nodeIdSet.has(l.source) && nodeIdSet.has(l.target))
    .map(toGraphLink)

  // 附带规则信息
  const rulesMap: Record<string, ReturnType<typeof getRulesForNode>> = {}
  for (const node of nodes) {
    rulesMap[node.id] = getRulesForNodeType(node.data.nodeType)
  }

  return { nodes, links, rulesMap }
}

// ─── 导出 API 处理器 ─────────────────────────────────

export function handleInit() {
  const data = getInitData()
  return {
    success: true,
    data: {
      graphData: {
        nodes: data.nodes,
        links: data.links,
      },
      rulesMap: data.rulesMap,
    },
  }
}

export function handleGetRules(nodeId: string) {
  const rules = getRulesForNode(nodeId)
  return {
    success: true,
    data: rules.map((r) => ({
      id: r.ruleId,
      name: r.ruleName,
      targetNodeType: r.targetNodeType,
      relationType: r.relationType,
      direction: r.direction,
      limit: parseInt(r.limit, 10),
      autoExpand: r.autoExpand === "true",
    })),
  }
}

export function handleExpand(body: ExpandRequest) {
  const result = executeExpand(body)

  // 为每个新节点附加规则信息
  const enrichedNodes = result.nodes.map((node) => {
    const rules = getRulesForNodeType(node.data.nodeType)
    return {
      ...node,
      data: {
        ...node.data,
        // 如果有规则，total 设为 100（表示可继续拓出），否则为 0
        total: rules.length > 0 ? 100 : 0,
        count: 0,
      },
    }
  })

  return {
    success: true,
    data: {
      nodes: enrichedNodes,
      links: result.links,
      total: result.total,
      pageIndex: result.pageIndex,
      hasMore: result.hasMore,
    },
  }
}
