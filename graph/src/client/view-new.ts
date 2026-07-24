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
} from "./type.js"
import type { GraphEvents } from "../events.js"
import type { NodeId, LinkId } from "../type.js"
import type { StyleManager } from "../style-manager.js"
import type { RenderPlugin } from "../renderer/render-plugin.js"
import { getNodeStyleByStateType, getLinkStyleByStateType } from "../theme.js"
import type { NodeRenderPipeline } from "../renderer/node-pipeline.js"
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

  /** Plus 徽标边框宽度（世界坐标单位，默认 0 = 无边框） */
  plusBadgeBorderWidth?: number
  /** Plus 徽标边框颜色（默认红色） */
  plusBadgeBorderColor?: [number, number, number, number]

  /**
   * 自定义渲染插件。
   * 完全替换默认的节点/边/文字/覆盖层渲染。
   * 不传则使用 DefaultRenderPlugin。
   */
  renderPlugin?: (
    gl: WebGL2RenderingContext,
    canvas: HTMLCanvasElement,
  ) => RenderPlugin

  /** Custom node-to-render mapping */
  mapNode?: (
    node: GraphNode<G["NO"], G["NT"], G["NS"]>,
    index: number,
  ) => RenderNode | null
  /** Custom link-to-render mapping */
  mapLink?: (link: GraphLink<G>, index: number) => RenderLink | null
}

/** Parse a hex color string (#RGB, #RRGGBB, #RGBA, #RRGGBBAA) to [r, g, b, a] floats */
function parseHexColor(hex: string): [number, number, number, number] {
  let h = hex.replace("#", "")
  if (h.length === 3) h = h.replace(/(.)/g, "$1$1")
  if (h.length === 4) h = h.replace(/(.)/g, "$1$1")
  const r = parseInt(h.slice(0, 2), 16) / 255
  const g = parseInt(h.slice(2, 4), 16) / 255
  const b = parseInt(h.slice(4, 6), 16) / 255
  const a = h.length >= 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1
  return [r, g, b, a]
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

    // Initialize renderer proxy (must be before style init, plugin provides default styles)
    this.renderer = new GraphRenderer({
      container: this.container,
      width: opts.width,
      height: opts.height,
      backgroundColor: opts.backgroundColor,
      showArrows: opts.arrowDisplay,
      pickerMode: opts.pickerMode,
      labelFontSize: opts.labelFontSize,
      renderPlugin: opts.renderPlugin,
      plusBadgeBorderWidth: opts.plusBadgeBorderWidth,
      plusBadgeBorderColor: opts.plusBadgeBorderColor,
    })

    // Initialize style from plugin defaults
    this.styleManager.init(this.renderer.plugin.getDefaultStyle() as any)

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
    this.renderer.onNodeClick = (nodeId, _event) => {
      // Plus 徽标点击已由 PlusBadgeLayer 独立处理（capture phase 拦截）
      // 此处仅处理节点本体点击
      const node = nodeId ? (this.nodeMap.get(nodeId) ?? null) : null
      this.events.publish("nodeClick", node)
    }

    // PlusBadgeLayer 独立处理徽标点击
    this.renderer.onPlusClick = (nodeId) => {
      const node = this.nodeMap.get(nodeId) ?? null
      this.events.publish("plusToolClick", node)
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
        const nodeStyle = this.styleManager.getNodeStyle(this.hoveredNodeId)
        const s = getNodeStyleByStateType(nodeStyle, "regular" as G["NS"])
        const c = parseHexColor(s.bgColor!)
        prev.color = [c[0], c[1], c[2], s.opacity!]
        prev.strokeColor = parseHexColor(s.strokeColor!)
        prev.strokeWidth = s.strokeWidth!
      }
    }

    if (!nodeId) {
      // 恢复所有关联边到默认样式
      for (const rl of renderLinks) {
        const ls = this.styleManager.getLinkStyle(rl.id)
        const lr = getLinkStyleByStateType(ls, "regular" as G["LS"])
        const lc = parseHexColor(lr.color ?? "#9ca3af")
        rl.color = [lc[0], lc[1], lc[2], lr.opacity ?? 0.7]
        rl.width = lr.strokeWidth ?? 0.8
      }
      this.hoveredNodeId = null
      return
    }

    // 高亮当前悬浮节点（边缘发光效果）
    const curr = renderNodes.find((n) => n.id === nodeId)
    if (curr) {
      const ns = this.styleManager.getNodeStyle(nodeId)
      const nh = getNodeStyleByStateType(ns, "hovered" as G["NS"])
      const nc = parseHexColor(nh.bgColor ?? "#fff")
      curr.color = [nc[0], nc[1], nc[2], nh.opacity ?? 1]
      curr.strokeColor = parseHexColor(nh.strokeColor ?? "#00ccff")
      curr.strokeWidth = nh.strokeWidth ?? 2
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
        const ls = this.styleManager.getLinkStyle(rl.id)
        const lh = getLinkStyleByStateType(ls, "hovered" as G["LS"])
        const lhc = parseHexColor(lh.color ?? "#00ccff")
        rl.color = [lhc[0], lhc[1], lhc[2], lh.opacity ?? 1]
        rl.width = lh.strokeWidth ?? 1.5
      } else {
        const ls = this.styleManager.getLinkStyle(rl.id)
        const lr = getLinkStyleByStateType(ls, "regular" as G["LS"])
        const lrc = parseHexColor(lr.color ?? "#9ca3af")
        rl.color = [lrc[0], lrc[1], lrc[2], lr.opacity ?? 0.7]
        rl.width = lr.strokeWidth ?? 0.8
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

  private defaultMapNode(
    gn: GraphNode<G["NO"], G["NT"], G["NS"]>,
    _index: number,
  ): RenderNode {
    const nodeStyle = this.styleManager.getNodeStyle(gn.id)
    const s = getNodeStyleByStateType(nodeStyle, "regular" as G["NS"])
    const _c = parseHexColor(s.bgColor!)
    const bgR = _c[0],
      bgG = _c[1],
      bgB = _c[2]

    const _tc = parseHexColor(s.textColor!)
    return {
      x: gn.x ?? 0,
      y: gn.y ?? 0,
      radius: s.radius!,
      color: [bgR, bgG, bgB, s.opacity!],
      strokeColor: parseHexColor(s.strokeColor!),
      strokeWidth: s.strokeWidth!,
      id: gn.id,
      label: gn.data?.label,
      textColor: [_tc[0], _tc[1], _tc[2], 1.0],
      fontSize: s.fontSize,
    }
  }

  private defaultMapLink(gl: GraphLink<G>, _index: number): RenderLink {
    const sourceId = typeof gl.source === "object" ? gl.source.id : gl.source
    const targetId = typeof gl.target === "object" ? gl.target.id : gl.target

    const sourceNode = this.nodeMap.get(String(sourceId))
    const targetNode = this.nodeMap.get(String(targetId))

    const linkStyle = this.styleManager.getLinkStyle(gl.id)
    const s = getLinkStyleByStateType(linkStyle, "regular" as G["LS"])
    const _c = parseHexColor(s.color ?? "#9ca3af")

    const snStyle = this.styleManager.getNodeStyle(sourceId as any)
    const tnStyle = this.styleManager.getNodeStyle(targetId as any)
    const sn = getNodeStyleByStateType(snStyle, "regular" as G["NS"])
    const tn = getNodeStyleByStateType(tnStyle, "regular" as G["NS"])

    return {
      sourceX: sourceNode?.x ?? 0,
      sourceY: sourceNode?.y ?? 0,
      targetX: targetNode?.x ?? 0,
      targetY: targetNode?.y ?? 0,
      color: [_c[0], _c[1], _c[2], s.opacity ?? 0.7],
      width: s.strokeWidth ?? 0.8,
      sourceRadius: sn.radius ?? 4,
      targetRadius: tn.radius ?? 4,
      sourceId: String(sourceId),
      targetId: String(targetId),
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
