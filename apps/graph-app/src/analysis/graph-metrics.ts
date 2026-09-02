import type { GraphLink } from "@lansheng/knowledge-graph/client/type"
import { linkEndpoints } from "../link-utils"

/** 分析用图数据最小结构 */
export interface MetricsNode {
  id: string
}
export type MetricsLink = Pick<GraphLink, "id" | "source" | "target" | "data">

/** 度中心性：节点 → 关联边数（无向：出+入合计） */
export function degreeMap(
  nodes: MetricsNode[],
  links: MetricsLink[],
): Map<string, number> {
  const m = new Map<string, number>()
  for (const n of nodes) m.set(n.id, 0)
  for (const l of links) {
    const [s, t] = linkEndpoints(l)
    if (m.has(s)) m.set(s, m.get(s)! + 1)
    if (m.has(t)) m.set(t, m.get(t)! + 1)
  }
  return m
}

/** 连通分量：节点 id → 分量编号（按节点数降序；孤立节点各占一分量） */
export function connectedComponents(
  nodes: MetricsNode[],
  links: MetricsLink[],
): Map<string, number> {
  const parent = new Map<string, string>()
  const find = (x: string): string => {
    let r = x
    while (parent.get(r) !== r) r = parent.get(r)!
    let c = x
    while (parent.get(c) !== r) {
      const n = parent.get(c)!
      parent.set(c, r)
      c = n
    }
    return r
  }
  const union = (a: string, b: string): void => {
    const ra = find(a)
    const rb = find(b)
    if (ra !== rb) parent.set(rb, ra)
  }
  for (const n of nodes) parent.set(n.id, n.id)
  for (const l of links) {
    const [s, t] = linkEndpoints(l)
    if (parent.has(s) && parent.has(t)) union(s, t)
  }
  const comps = new Map<string, string[]>()
  for (const n of nodes) {
    const r = find(n.id)
    let arr = comps.get(r)
    if (!arr) {
      arr = []
      comps.set(r, arr)
    }
    arr.push(n.id)
  }
  const sorted = [...comps.values()].sort((a, b) => b.length - a.length)
  const out = new Map<string, number>()
  sorted.forEach((ids, i) => ids.forEach((id) => out.set(id, i)))
  return out
}

export type PathWeight = "hops" | "intimacy"

/** 最短路径（Dijkstra；hops=无权即 BFS 语义）。返回路径节点/边 id；不连通返回 null */
export function shortestPath(
  nodes: MetricsNode[],
  links: MetricsLink[],
  from: string,
  to: string,
  weight: PathWeight = "hops",
): { nodeIds: string[]; linkIds: string[] } | null {
  const adj = new Map<string, { id: string; w: number }[]>()
  const linkOf = new Map<string, string>()
  for (const n of nodes) adj.set(n.id, [])
  const wOf = (l: MetricsLink): number => {
    if (weight === "intimacy") {
      const i = (l.data as { intimacy?: number } | undefined)?.intimacy
      return typeof i === "number" && i > 0 ? 1 - i : 1
    }
    return 1
  }
  for (const l of links) {
    const [s, t] = linkEndpoints(l)
    if (!adj.has(s) || !adj.has(t)) continue
    const w = wOf(l)
    adj.get(s)!.push({ id: t, w })
    adj.get(t)!.push({ id: s, w })
    linkOf.set(s + "|" + t, l.id)
    linkOf.set(t + "|" + s, l.id)
  }
  if (!adj.has(from) || !adj.has(to)) return null
  const dist = new Map<string, number>()
  const prev = new Map<string, string>()
  const done = new Set<string>()
  for (const n of nodes) dist.set(n.id, Number.POSITIVE_INFINITY)
  dist.set(from, 0)
  for (;;) {
    let u: string | null = null
    let best = Number.POSITIVE_INFINITY
    for (const [id, d] of dist) {
      if (!done.has(id) && d < best) {
        best = d
        u = id
      }
    }
    if (u === null || u === to) break
    done.add(u)
    for (const nb of adj.get(u)!) {
      if (done.has(nb.id)) continue
      const nd = dist.get(u)! + nb.w
      if (nd < dist.get(nb.id)!) {
        dist.set(nb.id, nd)
        prev.set(nb.id, u)
      }
    }
  }
  if (dist.get(to) === Number.POSITIVE_INFINITY) return null
  const nodeIds: string[] = []
  let cur: string | null = to
  while (cur !== null) {
    nodeIds.unshift(cur)
    cur = prev.get(cur) ?? null
  }
  const linkIds: string[] = []
  for (let i = 0; i < nodeIds.length - 1; i++) {
    const lid = linkOf.get(nodeIds[i] + "|" + nodeIds[i + 1])
    if (lid) linkIds.push(lid)
  }
  return { nodeIds, linkIds }
}
