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
} from "d3-force"
import type { Layout } from "./layout.js"

export interface SimNode extends SimulationNodeDatum {
  id: string
  radius?: number
  fx?: number | null
  fy?: number | null
}

export interface SimLink extends SimulationLinkDatum<SimNode> {
  id?: string
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
  /** Collision iterations. Default: 1 */
  collisionIterations?: number
  /** Velocity decay. Default: 0.3 */
  velocityDecay?: number
  /** Alpha min (simulation stops when alpha < this). Default: 0.001 */
  alphaMin?: number
  /** Max iterations for force link. Default: 1 */
  linkIterations?: number
}

const DEFAULT_CONFIG: Required<ForceConfig> = {
  repulsion: -300,
  linkDistance: 80,
  linkStrength: 0.3,
  centerStrength: 0.05,
  collisionRadius: 1.2,
  collisionIterations: 1,
  velocityDecay: 0.3,
  alphaMin: 0.001,
  linkIterations: 1,
}

export class ForceSimulation implements Layout {
  private simulation: Simulation<SimNode, SimLink> | null = null
  private nodes: SimNode[] = []
  private links: SimLink[] = []
  private config: Required<ForceConfig>
  private centerX = 0
  private centerY = 0

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

  /** Start or restart the simulation */
  start(): void {
    if (this.simulation) {
      this.simulation.stop()
    }

    this.simulation = forceSimulation<SimNode>(this.nodes)
      .force(
        "link",
        forceLink<SimNode, SimLink>(this.links)
          .id((d) => d.id)
          .distance(this.config.linkDistance)
          .strength(this.config.linkStrength)
          .iterations(this.config.linkIterations),
      )
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
      .velocityDecay(this.config.velocityDecay)
      .alphaMin(this.config.alphaMin)
      .on("tick", () => {
        this.onTick?.(this.nodes)
      })
      .on("end", () => {
        this.onEnd?.()
      })
  }

  /** Stop the simulation */
  stop(): void {
    this.simulation?.stop()
  }

  /** Reheat the simulation */
  reheat(alpha = 0.1): void {
    this.simulation?.alpha(alpha).restart()
  }

  /** Update config and restart */
  updateConfig(config: Partial<ForceConfig>): void {
    Object.assign(this.config, config)
    if (this.simulation) {
      const sim = this.simulation
      sim.force("charge", forceManyBody().strength(this.config.repulsion))
      sim.force(
        "link",
        forceLink<SimNode, SimLink>(this.links)
          .id((d) => d.id)
          .distance(this.config.linkDistance)
          .strength(this.config.linkStrength),
      )
      sim.force(
        "center",
        forceCenter(this.centerX, this.centerY).strength(
          this.config.centerStrength,
        ),
      )
      sim.velocityDecay(this.config.velocityDecay)
      sim.alphaMin(this.config.alphaMin)
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
