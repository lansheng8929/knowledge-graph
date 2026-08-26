/**
 * ForceSimulation — d3-force wrapper for graph physics.
 *
 * Manages:
 * - forceManyBody (repulsion/attraction)
 * - forceLink (spring-like edges)
 * - forceCenter (pull toward center)
 * - forceCollide (node overlap prevention)
 */

import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
  forceCollide,
  forceX,
  forceY,
  type Simulation,
  type SimulationNodeDatum,
  type SimulationLinkDatum,
} from "../vendor/d3-force/src/index.js"
import type { Layout } from "./layout.js"

export interface SimNode extends SimulationNodeDatum {
  id: string
  radius?: number
  fx?: number | null
  fy?: number | null
}

export interface SimLink extends SimulationLinkDatum<SimNode> {
  id?: string
  /** 亲密度（0~1）：影响边拉扯力——越高距离越近、强度越大 */
  intimacy?: number
}

export interface ForceConfig {
  /** Many-body repulsion strength. Negative = repulsion. Default: -300 */
  repulsion?: number
  /** Link distance (rest length). Default: 80 */
  linkDistance?: number
  /** Link strength (stiffness). Default: 0.3 */
  linkStrength?: number
  /** Center gravity strength. Default: 0.05 */
  centerStrength?: number
  /** Collision radius multiplier. Default: 1.2 */
  collisionRadius?: number
  /**
   * 初始位置预设：节点无 x/y 时，围绕 (centerX, centerY) 按索引环形散布，
   * 实际半径 = seedRadius * sqrt(n)（n=1 时在中心）。未设置则不预设（d3 默认随机初始位置）。
   */
  seedRadius?: number
  /** Collision iterations. Default: 1 */
  collisionIterations?: number
  /** Velocity decay. Default: 0.3 */
  velocityDecay?: number
  /** Alpha min (simulation stops when alpha < this). Default: 0.001 */
  alphaMin?: number
  /** Max iterations for force link. Default: 1 */
  linkIterations?: number
  /** 稳定判定速度阈值（px/tick）：全部节点速度低于该值并持续 stableTicks 次 → 模拟停止。Default: 0.01 */
  stableVelocity?: number
  /** 连续满足稳定速度的 tick 数。Default: 5 */
  stableTicks?: number
  /**
   * 自定义每条边 rest distance（可据 link.intimacy 等属性返回不同值）；
   * 返回 undefined 时回退到 linkDistance。由调用方外部定义亲密度→拉扯力策略。
   */
  linkDistanceFn?: (link: SimLink) => number | undefined
  /** 自定义每条边 strength（同上）；返回 undefined 时回退到 linkStrength */
  linkStrengthFn?: (link: SimLink) => number | undefined
}

/** 可选函数字段保持可选；模拟时间类字段（velocityDecay/alphaMin/stableVelocity/stableTicks）也保持可选——库不内置默认，由外部传入 */
type RequiredForceConfig = Required<
  Omit<
    ForceConfig,
    | "linkDistanceFn"
    | "linkStrengthFn"
    | "velocityDecay"
    | "alphaMin"
    | "stableVelocity"
    | "stableTicks"
    | "seedRadius"
  >
> &
  Partial<
    Pick<
      ForceConfig,
      | "linkDistanceFn"
      | "linkStrengthFn"
      | "velocityDecay"
      | "alphaMin"
      | "stableVelocity"
      | "stableTicks"
      | "seedRadius"
    >
  >

const DEFAULT_CONFIG: RequiredForceConfig = {
  repulsion: -300,
  linkDistance: 55,
  linkStrength: 0.7,
  centerStrength: 0.05,
  collisionRadius: 1.2,
  collisionIterations: 1,
  linkIterations: 1,
  // 模拟时间类（velocityDecay/alphaMin/stableVelocity/stableTicks）不在此内置，由外部传入；
  // linkDistanceFn / linkStrengthFn 缺省不设置（由调用方外部定义亲密度→拉扯力）
}

export class ForceSimulation implements Layout {
  private simulation: Simulation<SimNode, SimLink> | null = null
  private nodes: SimNode[] = []
  private links: SimLink[] = []
  private config: RequiredForceConfig
  private centerX = 0
  private centerY = 0
  private stableCount = 0

  // Callbacks
  onTick?: (nodes: SimNode[]) => void
  onEnd?: () => void

  constructor(config?: ForceConfig) {
    this.config = { ...DEFAULT_CONFIG, ...config }
  }

  /** Set nodes and links */
  setData(nodes: SimNode[], links: SimLink[]): void {
    this.nodes = nodes
    this.links = links
  }

  /** 构建力导向边：distance/strength 由外部 linkDistanceFn/linkStrengthFn 定义（未提供则用常量） */
  private buildLinkForce() {
    return forceLink<SimNode, SimLink>(this.links)
      .id((d) => d.id)
      .distance(
        (d) => this.config.linkDistanceFn?.(d) ?? this.config.linkDistance,
      )
      .strength(
        (d) => this.config.linkStrengthFn?.(d) ?? this.config.linkStrength,
      )
      .iterations(this.config.linkIterations)
  }

  /** 初始位置预设：节点无 x/y 时围绕中心环形散布（确定性，替代 d3 随机初始位置）。
   *  孤立节点（无任何边）直接钉在计算位置（fx/fy），避免被斥力推远；
   *  有边节点交给力导向正常布局。 */
  private seedPositions(): void {
    const base = this.config.seedRadius
    if (typeof base !== "number" || this.nodes.length === 0) return
    const n = this.nodes.length
    const radius = n === 1 ? 0 : base * Math.sqrt(n)
    const linked = new Set<string>()
    for (const l of this.links) {
      const src = typeof l.source === "object" ? (l.source as SimNode).id : String(l.source)
      const tgt = typeof l.target === "object" ? (l.target as SimNode).id : String(l.target)
      linked.add(src)
      linked.add(tgt)
    }
    this.nodes.forEach((node, i) => {
      if (node.x === undefined || node.y === undefined) {
        const angle = (2 * Math.PI * i) / n
        node.x = this.centerX + radius * Math.cos(angle)
        node.y = this.centerY + radius * Math.sin(angle)
      }
      // 孤立节点无论是否已有位置都钉住（重建后 fx/fy 丢失需恢复），
      // 避免被斥力推远；有边节点交给力导向正常布局。
      if (!linked.has(node.id)) {
        node.fx = node.x ?? this.centerX
        node.fy = node.y ?? this.centerY
      }
    })
  }

  /** Start or restart the simulation */
  start(): void {
    if (this.simulation) {
      this.simulation.stop()
    }
    this.stableCount = 0
    this.seedPositions()

    this.simulation = forceSimulation<SimNode>(this.nodes)
      .force("link", this.buildLinkForce())
      .force("charge", forceManyBody().strength(this.config.repulsion))
      .force(
        "center",
        forceCenter(this.centerX, this.centerY).strength(
          this.config.centerStrength,
        ),
      )
      .force(
        "collide",
        forceCollide<SimNode>(
          (d) => (d.radius || 5) * this.config.collisionRadius,
        ).iterations(this.config.collisionIterations),
      )
    // 模拟时间配置由外部传入；未提供则不设置（沿用 d3 引擎自身默认）
    if (typeof this.config.velocityDecay === "number") {
      this.simulation.velocityDecay(this.config.velocityDecay)
    }
    if (typeof this.config.alphaMin === "number") {
      this.simulation.alphaMin(this.config.alphaMin)
    }
    this.simulation
      .on("tick", () => {
        this.onTick?.(this.nodes)
        this.tickStableCheck()
      })
      .on("end", () => {
        this.onEnd?.()
      })
  }

  /** Stop the simulation */
  stop(): void {
    this.simulation?.stop()
  }

  /**
   * 稳定检测：全部节点速度低于阈值并持续 N tick → 停止（模拟到完全稳定）。
   * alphaMin 仍是兜底（病态震荡时不会无限跑）。
   */
  private tickStableCheck(): void {
    const threshold = this.config.stableVelocity
    const ticks = this.config.stableTicks
    // 外部未配置稳定判定 → 不做速度稳定检测（由 d3 alphaMin 决定停止）
    if (typeof threshold !== "number" || typeof ticks !== "number") return
    let maxV = 0
    for (const n of this.nodes) {
      const v = Math.hypot(n.vx ?? 0, n.vy ?? 0)
      if (v > maxV) maxV = v
    }
    if (maxV < threshold) {
      this.stableCount += 1
      if (this.stableCount >= ticks) {
        this.stop()
        this.onEnd?.()
      }
    } else {
      this.stableCount = 0
    }
  }

  /** Reheat the simulation */
  reheat(alpha = 0.1): void {
    this.simulation?.alpha(alpha).restart()
  }

  /**
   * 一次性同步排布（算法布局）：构建力模型后同步迭代指定次数即停止，
   * 不启动冷却动画——init 后直接按算法铺开节点，无需等待引擎冷却。
   * 注意：d3 的 simulation.tick() 只更新坐标、不派发 tick 事件（tick 事件
   * 由定时器 step() 派发），故手动 tick 后需显式调用 onTick 把最终位置推给
   * 渲染器，再触发 onEnd（fitView 等）。
   */
  settle(iterations = 300): void {
    this.start()
    const sim = this.simulation
    if (!sim) return
    // 停掉定时器，改由手动同步推进
    sim.stop()
    sim.tick(iterations)
    this.onTick?.(this.nodes)
    this.onEnd?.()
  }

  /** Update config and restart */
  updateConfig(config: Partial<ForceConfig>): void {
    Object.assign(this.config, config)
    if (this.simulation) {
      const sim = this.simulation
      sim.force("charge", forceManyBody().strength(this.config.repulsion))
      sim.force("link", this.buildLinkForce())
      sim.force(
        "center",
        forceCenter(this.centerX, this.centerY).strength(
          this.config.centerStrength,
        ),
      )
      if (typeof this.config.velocityDecay === "number") {
        sim.velocityDecay(this.config.velocityDecay)
      }
      if (typeof this.config.alphaMin === "number") {
        sim.alphaMin(this.config.alphaMin)
      }
      sim.alpha(0.3).restart()
    }
  }

  /** Set center position */
  setCenter(x: number, y: number): void {
    this.centerX = x
    this.centerY = y
    this.simulation?.force(
      "center",
      forceCenter(x, y).strength(this.config.centerStrength),
    )
  }

  /** Fix a node in place */
  fixNode(nodeId: string, x?: number, y?: number): void {
    const node = this.nodes.find((n) => n.id === nodeId)
    if (!node) return
    if (x !== undefined) node.fx = x
    if (y !== undefined) node.fy = y
  }

  /** Release a fixed node */
  releaseNode(nodeId: string): void {
    const node = this.nodes.find((n) => n.id === nodeId)
    if (!node) return
    node.fx = null
    node.fy = null
  }

  /** Get current alpha */
  get alpha(): number {
    return this.simulation?.alpha() ?? 0
  }

  /** Get all node positions as a map */
  getNodePositions(): Map<
    string,
    { x: number; y: number; vx: number; vy: number }
  > {
    const map = new Map<
      string,
      { x: number; y: number; vx: number; vy: number }
    >()
    for (const n of this.nodes) {
      map.set(n.id, { x: n.x ?? 0, y: n.y ?? 0, vx: n.vx ?? 0, vy: n.vy ?? 0 })
    }
    return map
  }

  destroy(): void {
    this.simulation?.stop()
    this.simulation = null
  }
}
