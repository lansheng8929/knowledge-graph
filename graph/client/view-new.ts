/**
 * GraphView — main graph view with WebGL2 + d3-force physics.
 *
 * Uses WebGLRenderer for high-performance multi-shape SDF rendering.
 *
 * Supports pluggable layout via `layout` option:
 * - default: ForceSimulation (d3-force)
 * - custom: implement Layout interface
 */

import { GraphModel } from "../model.js"
import { GraphRenderer } from "../renderer/graph-renderer.js"
import {
  ForceSimulation,
  type SimNode,
  type SimLink,
  type ForceConfig,
} from "../physics/simulation.js"
import type { Layout } from "../physics/layout.js"
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

  /** d3-force configuration (used when layout is not provided) */
  forceConfig?: ForceConfig

  /** 自定义布局引擎（默认使用 d3-force ForceSimulation） */
  layout?: Layout

  /** 拾取模式: "gpu" = FBO (默认), "cpu" = CPU SDF 计算 */
  pickerMode?: "gpu" | "cpu"

  /** 标签字号 (默认 32) */
  labelFontSize?: number

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
  /** 渲染器代理门面 */
  renderer: GraphRenderer
  /** 当前布局引擎 */
  layout: Layout

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

    // Initialize renderer proxy
    this.renderer = new GraphRenderer({
      container: this.container,
      width: opts.width,
      height: opts.height,
      backgroundColor: opts.backgroundColor,
      showArrows: opts.arrowDisplay,
      pickerMode: opts.pickerMode,
      labelFontSize: opts.labelFontSize,
    })

    // Initialize layout: use custom layout or default to d3-force
    this.layout = opts.layout ?? new ForceSimulation(opts.forceConfig)
    this.layout.onTick = (simNodes) => {
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
        // 检测点击是否在 "+" 徽标区域内（坐标检测）
        const renderNode = this.renderer.nodes.find((n) => n.id === nodeId)
        if (renderNode?.showPlus) {
          const rect = this.renderer.canvas.getBoundingClientRect()
          const mouseX = event.clientX - rect.left
          const mouseY = event.clientY - rect.top
          const t = this.renderer.interaction.transform

          const offX = renderNode.radius * (renderNode.plusOffsetX ?? 0.5)
          const offY = renderNode.radius * (renderNode.plusOffsetY ?? -0.5)
          const badgeWorldRadius =
            renderNode.radius * (renderNode.plusScale ?? 0.35)

          // 徽标中心屏幕坐标（与 shader 计算一致）
          const badgeSX = (renderNode.x + offX + t.x) * t.k
          const badgeSY = (renderNode.y + offY + t.y) * t.k
          const badgeSR = badgeWorldRadius * t.k

          const dx = mouseX - badgeSX
          const dy = mouseY - badgeSY
          if (dx * dx + dy * dy <= badgeSR * badgeSR) {
            // 点击在 "+" 徽标上
            const node = this.nodeMap.get(nodeId) ?? null
            this.events.publish("plusToolClick", node)
            return
          }
        }
        // 点击在节点本体上
        const node = this.nodeMap.get(nodeId) ?? null
        this.events.publish("nodeClick", node)
      } else {
        this.events.publish("nodeClick", null)
      }
    }

    this.renderer.onNodeHover = (nodeId) => {
      // 直接更新渲染器中的节点样式，无需全量重建
      this.updateHoverVisuals(nodeId)

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
      this.layout.fixNode(nodeId, x, y)
      // 重新加热物理引擎，让其他节点被力牵引
      this.layout.reheat(0.3)
      // Update render node
      const simNodes = (this.layout as any).nodes as SimNode[]
      const simNode = simNodes.find((n) => n.id === nodeId)
      if (simNode) {
        simNode.x = x
        simNode.y = y
      }
    }

    this.renderer.onNodeDragEnd = (nodeId) => {
      this.layout.releaseNode(nodeId)
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

  // ========== Hover 视觉更新（直接操作渲染器，不触发重建） ==========

  private hoveredNodeId: string | null = null

  private updateHoverVisuals(nodeId: string | null): void {
    const renderNodes = this.renderer.nodes
    const renderLinks = this.renderer.links

    // 恢复上一个悬浮节点到默认样式
    if (this.hoveredNodeId && this.hoveredNodeId !== nodeId) {
      const prev = renderNodes.find((n) => n.id === this.hoveredNodeId)
      if (prev) {
        // 恢复默认外观（保持半径不变，清除发光描边）
        prev.color = [1.0, 1.0, 1.0, 1.0]
        prev.strokeColor = [1.0, 1.0, 1.0, 1.0]
        prev.strokeWidth = 0
      }
    }

    if (!nodeId) {
      // 恢复所有关联边
      for (const rl of renderLinks) {
        rl.color = [0.6, 0.6, 0.6, 0.7]
        rl.width = 1.5
      }
      this.hoveredNodeId = null
      return
    }

    // 高亮当前悬浮节点（边缘发光效果）
    const curr = renderNodes.find((n) => n.id === nodeId)
    if (curr) {
      // 保持原有大小，添加发光描边
      curr.strokeColor = [1.0, 0.6, 0.2, 1.0] // 橙色发光
      curr.strokeWidth = 3
      // 略微提高节点亮度
      curr.color = [1.0, 0.85, 0.7, 1.0]
    }

    // 通过 model 数据找到关联边的 ID
    const { graphData } = this.model.getGraphModelData()
    const relatedLinkIds = new Set<string>()
    for (const link of graphData.links) {
      const sid = typeof link.source === "object" ? link.source.id : link.source
      const tid = typeof link.target === "object" ? link.target.id : link.target
      if (String(sid) === nodeId || String(tid) === nodeId) {
        relatedLinkIds.add(link.id)
      }
    }

    for (const rl of renderLinks) {
      if (relatedLinkIds.has(rl.id)) {
        rl.color = [1.0, 0.6, 0.2, 0.9]
        rl.width = 2.5
      } else {
        rl.color = [0.6, 0.6, 0.6, 0.7]
        rl.width = 1.5
      }
    }

    this.hoveredNodeId = nodeId
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
    this.layout.setData(simNodes, simLinks)
    this.layout.start()

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
    return {
      x: gn.x ?? 0,
      y: gn.y ?? 0,
      radius: 8,
      color: [1.0, 1.0, 1.0, 1.0],
      strokeColor: [1.0, 1.0, 1.0, 1.0],
      strokeWidth: 0,
      id: gn.id,
      label: gn.data?.label,
    }
  }

  private defaultMapLink(gl: GraphLink<G>, _index: number): RenderLink {
    const sourceId = typeof gl.source === "object" ? gl.source.id : gl.source
    const targetId = typeof gl.target === "object" ? gl.target.id : gl.target

    const sourceNode = this.nodeMap.get(String(sourceId))
    const targetNode = this.nodeMap.get(String(targetId))

    return {
      sourceX: sourceNode?.x ?? 0,
      sourceY: sourceNode?.y ?? 0,
      targetX: targetNode?.x ?? 0,
      targetY: targetNode?.y ?? 0,
      color: [0.6, 0.6, 0.6, 0.7],
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
    const renderNodes = this.renderer.nodes
    const renderLinks = this.renderer.links
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

  /** Get the renderer proxy */
  getRenderer(): GraphRenderer {
    return this.renderer
  }

  /** Get the current layout engine */
  getLayout(): Layout {
    return this.layout
  }

  /** Update force config (only works with ForceSimulation) */
  updatePhysics(config: Partial<ForceConfig>): void {
    if (this.layout instanceof ForceSimulation) {
      this.layout.updateConfig(config)
    }
  }

  /** Reheat the layout */
  reheat(alpha?: number): void {
    this.layout.reheat(alpha)
  }

  /** Get underlying canvas */
  getCanvas(): HTMLCanvasElement {
    return this.renderer.canvas
  }

  /** Clear hover state (visual + state) */
  clearHover(): void {
    this.updateHoverVisuals(null)
    this.hoveredNodeId = null
    this.model.stateManager.clearHoveredNodes()
    this.events.publish("nodeHover", null)
  }

  /** Destroy and clean up */
  destroy(): void {
    this.layout.destroy()
    this.renderer.destroy()
  }
}
