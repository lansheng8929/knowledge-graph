/**
 * GraphView — main graph view using Canvas 2D rendering + d3-force physics.
 *
 * This replaces the old force-graph + cosmograph based implementation.
 */

import { GraphModel } from "../model.js"
import { Canvas2DRenderer } from "../renderer/canvas2d-renderer.js"
import {
  ForceSimulation,
  type SimNode,
  type SimLink,
  type ForceConfig,
} from "../physics/simulation.js"
import type {
  DefaultGraphDataGenerics,
  GraphDataGenerics,
  GraphNode,
  GraphLink,
  GraphViewModel,
} from "../client/type.js"
import type { GraphEvents } from "../events.js"
import type { NodeId, LinkId } from "../type.js"
import type { StyleManager } from "../style-manager.js"
import type { RenderNode, RenderLink } from "../renderer/types.js"

export interface GraphViewOptions<
  G extends GraphDataGenerics = DefaultGraphDataGenerics,
> {
  container: HTMLElement
  graphModel: GraphModel<G>
  width?: number
  height?: number
  backgroundColor?: string
  debug?: boolean
  arrowDisplay?: boolean

  /** d3-force configuration */
  forceConfig?: ForceConfig

  /** Custom node-to-render mapping */
  mapNode?: (
    node: GraphNode<G["NO"], G["NT"], G["NS"]>,
    index: number,
  ) => RenderNode | null
  /** Custom link-to-render mapping */
  mapLink?: (link: GraphLink<G>, index: number) => RenderLink | null
}

export class GraphView<G extends GraphDataGenerics = DefaultGraphDataGenerics> {
  private options: GraphViewOptions<G>
  private container: HTMLElement
  model: GraphModel<G>
  private renderer: Canvas2DRenderer
  private physics: ForceSimulation

  // Node/link lookup
  private nodeMap = new Map<string, GraphNode<G["NO"], G["NT"], G["NS"]>>()
  private linkMap = new Map<string, GraphLink<G>>()

  events: GraphEvents<G>
  styleManager: StyleManager<G>

  constructor(opts: GraphViewOptions<G>) {
    this.options = opts
    this.container = opts.container
    this.model = opts.graphModel
    this.events = this.model.events
    this.styleManager = this.model.styleManager

    // Initialize style (must be called before defaultMapNode/defaultMapLink)
    this.styleManager.init({
      container: this.container,
    })

    // Initialize Canvas2D renderer
    this.renderer = new Canvas2DRenderer({
      container: this.container,
      width: opts.width,
      height: opts.height,
      backgroundColor: opts.backgroundColor,
      showArrows: opts.arrowDisplay,
    })

    // Initialize physics
    this.physics = new ForceSimulation(opts.forceConfig)
    this.physics.onTick = (simNodes) => {
      this.onPhysicsTick(simNodes)
    }

    // Wire renderer callbacks
    this.setupRendererCallbacks()

    // Initialize with current data
    this.rebuildFromModel()
  }

  // ========== Renderer callbacks ==========

  private setupRendererCallbacks(): void {
    this.renderer.onNodeClick = (nodeId, event) => {
      if (nodeId) {
        const node = this.nodeMap.get(nodeId) ?? null
        this.events.publish("nodeClick", node)
      } else {
        this.events.publish("nodeClick", null)
      }
    }

    this.renderer.onNodeHover = (nodeId) => {
      if (nodeId) {
        this.model.stateManager.setHoveredNodes([nodeId])
        const node = this.nodeMap.get(nodeId) ?? null
        this.events.publish("nodeHover", node)
      } else {
        this.model.stateManager.clearHoveredNodes()
        this.events.publish("nodeHover", null)
      }
    }

    this.renderer.onNodeDrag = (nodeId, x, y) => {
      this.physics.fixNode(nodeId, x, y)
      // Update render node
      const simNodes = this.physics["nodes"] as SimNode[]
      const simNode = simNodes.find((n) => n.id === nodeId)
      if (simNode) {
        simNode.x = x
        simNode.y = y
      }
    }

    this.renderer.onNodeDragEnd = (nodeId) => {
      this.physics.releaseNode(nodeId)
      const node = this.nodeMap.get(nodeId) ?? null
      this.events.publish("nodeDragEnd", node)
    }

    this.renderer.onLinkClick = (linkId, event) => {
      const link = linkId ? (this.linkMap.get(linkId) ?? null) : null
      this.events.publish("linkClick", link)
    }

    this.renderer.onBackgroundClick = (_event) => {
      this.events.publish("backgroundClick", undefined)
    }

    this.renderer.onZoom = (transform) => {
      this.events.publish("zoom", transform)
    }

    // Listen to model data changes
    this.events.subscribe("dataChange", ({ graphData }) => {
      this.rebuildFromModel()
    })
  }

  // ========== Data rebuilding ==========

  private rebuildFromModel(): void {
    const { graphData } = this.model.getGraphModelData()

    // Build lookup maps
    this.nodeMap.clear()
    this.linkMap.clear()

    // Convert to render nodes
    const renderNodes: RenderNode[] = []
    const simNodes: SimNode[] = []

    for (let i = 0; i < graphData.nodes.length; i++) {
      const gn = graphData.nodes[i]
      this.nodeMap.set(gn.id, gn)

      let rn: RenderNode | null = null
      if (this.options.mapNode) {
        rn = this.options.mapNode(gn, i)
      } else {
        rn = this.defaultMapNode(gn, i)
      }

      if (rn) {
        renderNodes.push(rn)
        simNodes.push({
          id: gn.id,
          x: gn.x ?? (Math.random() - 0.5) * 100,
          y: gn.y ?? (Math.random() - 0.5) * 100,
          radius: rn.radius,
          fx: gn.fx ?? null,
          fy: gn.fy ?? null,
          vx: gn.vx ?? 0,
          vy: gn.vy ?? 0,
        })
      }
    }

    // Convert to render links
    const renderLinks: RenderLink[] = []
    const simLinks: SimLink[] = []

    for (let i = 0; i < graphData.links.length; i++) {
      const gl = graphData.links[i]
      this.linkMap.set(gl.id, gl)

      const sourceId = typeof gl.source === "object" ? gl.source.id : gl.source
      const targetId = typeof gl.target === "object" ? gl.target.id : gl.target

      let rl: RenderLink | null = null
      if (this.options.mapLink) {
        rl = this.options.mapLink(gl, i)
      } else {
        rl = this.defaultMapLink(gl, i)
      }

      if (rl) {
        renderLinks.push(rl)
        simLinks.push({
          id: gl.id,
          source: sourceId,
          target: targetId,
        })
      }
    }

    // Update renderer & physics
    this.renderer.updateData(renderNodes, renderLinks)
    this.physics.setData(simNodes, simLinks)
    this.physics.start()

    // Fit view initially
    requestAnimationFrame(() => {
      this.renderer.fitView()
    })
  }

  // ========== Default mappers ==========

  private defaultMapNode(
    gn: GraphNode<G["NO"], G["NT"], G["NS"]>,
    _index: number,
  ): RenderNode {
    // Simplified: use hardcoded colors for initial test
    return {
      x: gn.x ?? 0,
      y: gn.y ?? 0,
      radius: 8,
      color: [0.357, 0.608, 0.835, 1.0], // #5b9bd5 blue
      strokeColor: [1.0, 1.0, 1.0, 1.0], // white stroke
      strokeWidth: 2,
      id: gn.id,
      label: gn.data?.label,
    }
  }

  private defaultMapLink(gl: GraphLink<G>, _index: number): RenderLink {
    const sourceId = typeof gl.source === "object" ? gl.source.id : gl.source
    const targetId = typeof gl.target === "object" ? gl.target.id : gl.target

    const sourceNode = this.nodeMap.get(String(sourceId))
    const targetNode = this.nodeMap.get(String(targetId))

    // Simplified: use hardcoded colors
    return {
      sourceX: sourceNode?.x ?? 0,
      sourceY: sourceNode?.y ?? 0,
      targetX: targetNode?.x ?? 0,
      targetY: targetNode?.y ?? 0,
      color: [0.6, 0.6, 0.6, 0.7], // gray with some alpha
      width: 1.5,
      id: gl.id,
      label: gl.data?.label,
    }
  }

  // ========== Physics sync ==========

  private onPhysicsTick(simNodes: SimNode[]): void {
    const posMap = new Map<string, { x: number; y: number }>()
    for (const sn of simNodes) {
      posMap.set(sn.id, { x: sn.x ?? 0, y: sn.y ?? 0 })

      // Sync back to model nodes
      const gn = this.nodeMap.get(sn.id)
      if (gn) {
        gn.x = sn.x ?? 0
        gn.y = sn.y ?? 0
        gn.vx = sn.vx ?? 0
        gn.vy = sn.vy ?? 0
      }
    }

    this.renderer.updateNodePositions(posMap)

    // Update link positions
    const renderNodes = (this.renderer as any).nodes as RenderNode[]
    const renderLinks = (this.renderer as any).links as RenderLink[]
    for (const rl of renderLinks) {
      const srcNode = renderNodes.find((n) => n.id === rl.id)
      // Actually need to find by source/target. We store link data differently.
      // Let's access the internal link data through the model.
    }

    // Simplified: update link endpoints from model
    const { graphData } = this.model.getGraphModelData()
    for (const rl of renderLinks) {
      const link = graphData.links.find((l) => l.id === rl.id)
      if (!link) continue
      const sid = typeof link.source === "object" ? link.source.id : link.source
      const tid = typeof link.target === "object" ? link.target.id : link.target
      const sn = graphData.nodes.find((n) => n.id === sid)
      const tn = graphData.nodes.find((n) => n.id === tid)
      if (sn) {
        rl.sourceX = sn.x ?? 0
        rl.sourceY = sn.y ?? 0
      }
      if (tn) {
        rl.targetX = tn.x ?? 0
        rl.targetY = tn.y ?? 0
      }
    }
  }

  // ========== Public API ==========

  /** Update graph data */
  updateView(graphViewModel: Partial<GraphViewModel<G>>): void {
    if (graphViewModel.graphData) {
      this.model.updateGraphData({ graphData: graphViewModel.graphData })
    }
  }

  /** Focus on a node */
  focusNodeById(nodeId: NodeId): void {
    this.renderer.focusNode(nodeId)
  }

  /** Fit all nodes in view */
  fitView(padding?: number): void {
    this.renderer.fitView(padding)
  }

  /** Get the canvas renderer */
  getRenderer(): Canvas2DRenderer {
    return this.renderer
  }

  /** Get the physics simulation */
  getPhysics(): ForceSimulation {
    return this.physics
  }

  /** Update physics config */
  updatePhysics(config: Partial<ForceConfig>): void {
    this.physics.updateConfig(config)
  }

  /** Reheat the simulation */
  reheat(alpha?: number): void {
    this.physics.reheat(alpha)
  }

  /** Get underlying canvas */
  getCanvas(): HTMLCanvasElement {
    return this.renderer.canvas
  }

  /** Destroy and clean up */
  destroy(): void {
    this.physics.destroy()
    this.renderer.destroy()
  }
}
