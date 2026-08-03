/**
 * TreeLayout — 树形布局引擎（可插拔 Layout）。
 *
 * 逻辑：以 rootId（缺省取画布首个节点）为根做 BFS 分层，
 * 层 = 跳数（hop），同层节点水平居中排布（y=层×间距）；
 * visited 去环去重（每个节点只以最早到达的层出现一次）；
 * 未连通/超深度的节点平铺在最底部一层。
 * 纯算法布局：start/settle 同步计算并派发 onTick/onEnd（fitView 用），无冷却动画。
 */
import type { Layout } from "./layout.js"

export interface TreeLayoutOptions {
  /** 树根节点 id；缺省用画布第一个节点 */
  rootId?: string
  /** 层间距（垂直方向，像素） */
  levelGap?: number
  /** 层内节点间距（水平方向，像素） */
  siblingGap?: number
  /** 最大层数（超出 BFS 的节点并入最底层） */
  maxDepth?: number
}

interface SimNodeLite {
  id: string
  x?: number
  y?: number
  vx?: number
  vy?: number
}

type LinkLite = {
  source: string | number | { id: string }
  target: string | number | { id: string }
}

export class TreeLayout implements Layout {
  private nodes: SimNodeLite[] = []
  private links: LinkLite[] = []
  private rootId?: string
  private levelGap: number
  private siblingGap: number
  private maxDepth: number

  onTick?: (nodes: SimNodeLite[]) => void
  onEnd?: () => void

  constructor(opts?: TreeLayoutOptions) {
    this.rootId = opts?.rootId
    this.levelGap = opts?.levelGap ?? 180
    this.siblingGap = opts?.siblingGap ?? 70
    this.maxDepth = opts?.maxDepth ?? 6
  }

  setData(
    nodes: SimNodeLite[],
    links: Array<{
      id?: string
      source: string | number | { id: string }
      target: string | number | { id: string }
    }>,
  ): void {
    this.nodes = nodes
    this.links = links as LinkLite[]
  }

  start(): void {
    this.compute()
  }

  /** 算法布局：同步计算并派发 onTick/onEnd */
  settle(): void {
    this.compute()
  }

  stop(): void {
    /* 无冷却动画，忽略 */
  }

  reheat(): void {
    /* 树形为静态布局，忽略 */
  }

  fixNode(): void {
    /* 忽略 */
  }

  releaseNode(): void {
    /* 忽略 */
  }

  destroy(): void {
    this.nodes = []
    this.links = []
  }

  private compute(): void {
    const byId = new Map<string, SimNodeLite>()
    for (const n of this.nodes) byId.set(n.id, n)

    // 无向邻接表（去重）
    const adj = new Map<string, Set<string>>()
    const ensure = (id: string) => {
      let s = adj.get(id)
      if (!s) {
        s = new Set()
        adj.set(id, s)
      }
      return s
    }
    for (const l of this.links) {
      const s = String(typeof l.source === "object" ? l.source.id : l.source)
      const t = String(typeof l.target === "object" ? l.target.id : l.target)
      ensure(s).add(t)
      ensure(t).add(s)
    }

    // BFS 分层（hop）
    const root =
      this.rootId && byId.has(this.rootId) ? this.rootId : this.nodes[0]?.id
    const levels: string[][] = []
    const visited = new Set<string>()
    if (root !== undefined && byId.has(root)) {
      let frontier = [root]
      let depth = 0
      visited.add(root)
      levels[0] = [root]
      while (frontier.length > 0 && depth < this.maxDepth) {
        const next: string[] = []
        for (const id of frontier) {
          for (const nb of adj.get(id) ?? []) {
            if (visited.has(nb)) continue
            visited.add(nb)
            if (!levels[depth + 1]) levels[depth + 1] = []
            levels[depth + 1].push(nb)
            next.push(nb)
          }
        }
        frontier = next
        depth += 1
      }
    }

    // 未连通/超深度的节点平铺最底
    const rest = this.nodes.filter((n) => !visited.has(n.id)).map((n) => n.id)
    if (rest.length > 0) {
      const d = levels.length
      levels[d] = rest
      for (const id of rest) visited.add(id)
    }

    // 分配坐标：y = 层×间距；x = 层内水平居中
    for (let d = 0; d < levels.length; d++) {
      const ids = levels[d]
      const n = ids.length
      for (let i = 0; i < n; i++) {
        const node = byId.get(ids[i])
        if (!node) continue
        node.x = (i - (n - 1) / 2) * this.siblingGap
        node.y = d * this.levelGap
        node.vx = 0
        node.vy = 0
      }
    }

    this.onTick?.(this.nodes)
    this.onEnd?.()
  }
}
