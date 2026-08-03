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
import type { GraphViewStyle, NodeStyle, LinkStyle, LStyle } from "../theme.js"
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

  /** 渲染插件工厂（必填，外部传入，内部创建实例） */
  renderPlugin: (
    gl: WebGL2RenderingContext,
    canvas: HTMLCanvasElement,
  ) => RenderPlugin<G>

  /**
   * 运行时主题值（应用层自定义，如 "light" | "dark"）。
   * 会作为第 2 个参数传给主题样式回调函数，实现动态换肤。
   * 主题切换后调用 setRuntimeTheme() 重新应用。
   */
  runtimeTheme?: unknown

  /**
   * 自定义主题，会与插件的默认样式合并。
   * 可用于覆盖默认颜色、尺寸、新增节点类型等。
   *
   * 每个节点/边类型的值可以是静态样式对象，也可以是回调函数。
   * 回调函数接收节点/边数据（及运行时主题值），返回动态样式。
   */
  theme?: {
    background?: string
    node?: Partial<
      Record<
        G["NT"],
        | NodeStyle<G>
        | ((
            node: GraphNode<G["NO"], G["NT"], G["NS"]>,
            runtimeTheme?: unknown,
          ) => NodeStyle<G>)
      >
    >
    link?: Partial<
      Record<
        G["LT"],
        LStyle | ((link: GraphLink<G>, runtimeTheme?: unknown) => LStyle)
      >
    >
  }
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

/** 浅合并 GraphViewStyle（只合并顶层 node/link 下各类型的条目） */
function deepMergeStyles(
  base: Record<string, any>,
  override: Record<string, any>,
): Record<string, any> {
  const result: Record<string, any> = { ...base }
  for (const key of Object.keys(override)) {
    if (
      key === "background" ||
      typeof override[key] !== "object" ||
      override[key] === null
    ) {
      result[key] = override[key]
    } else {
      result[key] = { ...(base[key] || {}), ...override[key] }
    }
  }
  return result
}

export class GraphView<G extends GraphDataGenerics = DefaultGraphDataGenerics> {
  private options: GraphViewOptions<G>
  private container: HTMLElement
  model: GraphModel<G>
  /** 渲染器代理门面 */
  renderer: GraphRenderer<G>
  /** 当前布局引擎 */
  layout: Layout

  /** 原始 theme 配置（含静态样式和动态回调） */
  private rawTheme?: GraphViewOptions<G>["theme"]

  /** 运行时主题值（传给样式回调函数） */
  private runtimeTheme: unknown

  // Node/link lookup
  private nodeMap = new Map<string, GraphNode<G["NO"], G["NT"], G["NS"]>>()
  private linkMap = new Map<string, GraphLink<G>>()
  // 首次布局稳定后是否已自动 fitView（避免 init 后布局演化导致节点超出视野）
  private _autoFitOnEndDone = false

  events: GraphEvents<G>
  styleManager: StyleManager<G>

  constructor(opts: GraphViewOptions<G>) {
    this.options = opts
    this.container = opts.container
    this.model = opts.graphModel
    this.events = this.model.events
    this.styleManager = this.model.styleManager
    this.runtimeTheme = opts.runtimeTheme

    // Initialize renderer proxy (must be before style init, plugin provides default styles)
    this.renderer = new GraphRenderer({
      container: this.container,
      width: opts.width,
      height: opts.height,
      backgroundColor: opts.backgroundColor,
      showArrows: opts.arrowDisplay,
      renderPlugin: opts.renderPlugin,
    })

    // Initialize style from plugin defaults + optional theme merge
    this.rawTheme = opts.theme
    const defaultStyle = this.renderer.plugin.getDefaultStyle() as any
    // 只将静态样式合并到 styleManager，回调在 defaultMapNode 中按需解析
    let staticTheme: Record<string, any> | undefined
    if (opts.theme) {
      staticTheme = { background: (opts.theme as any).background }
      for (const section of ["node", "link"] as const) {
        const entries = (opts.theme as any)[section]
        if (entries) {
          const statics: Record<string, any> = {}
          for (const key of Object.keys(entries)) {
            if (typeof entries[key] !== "function") statics[key] = entries[key]
          }
          if (Object.keys(statics).length > 0) staticTheme![section] = statics
        }
      }
    }
    const mergedStyle = staticTheme
      ? deepMergeStyles(defaultStyle, staticTheme)
      : defaultStyle
    this.styleManager.init(mergedStyle)

    // Initialize layout: use custom layout or default to d3-force
    this.layout = opts.layout ?? new ForceSimulation(opts.forceConfig)
    this.layout.onTick = (simNodes) => {
      this.onPhysicsTick(simNodes)
    }
    // 布局首次稳定后自动 fitView 一次：
    // init 后 RAF 的 fitView 用的是布局初始位置（边界不准），布局演化后节点会超出视野；
    // 在模拟稳定（onEnd）后按最终边界再 fit 一次，保证所有节点入画。
    this.layout.onEnd = () => {
      if (!this._autoFitOnEndDone) {
        this._autoFitOnEndDone = true
        this.renderer.fitView(40)
      }
    }

    // Wire renderer callbacks
    this.setupRendererCallbacks()

    // Initialize with current data
    this.rebuildFromModel()
  }

  // ========== Renderer callbacks ==========

  private setupRendererCallbacks(): void {
    this.renderer.onNodeContextMenu = (
      nodeId: string,
      clientX: number,
      clientY: number,
    ) => {
      const node = this.nodeMap.get(nodeId) ?? null
      if (node) {
        this.events.publish("nodeRightClick", {
          node,
          screenPos: { x: clientX, y: clientY },
          event: new MouseEvent("contextmenu"),
        })
      }
    }

    this.renderer.onNodeClick = (nodeId, event) => {
      const node = nodeId ? (this.nodeMap.get(nodeId) ?? null) : null
      this.events.publish("nodeClick", {
        node,
        ctrlKey: event?.ctrlKey ?? false,
      })
    }

    // PlusBadgeLayer 独立处理徽标点击
    this.renderer.onPlusClick = (nodeId) => {
      const node = this.nodeMap.get(nodeId) ?? null
      node && this.events.publish("plusToolClick", node)
    }

    this.renderer.onNodeHover = (nodeId) => {
      // 先更新 stateManager，再更新视觉，确保 resolveNodeState 读到正确状态
      if (nodeId) {
        this.model.stateManager.setHoveredNodes([nodeId])
        const node = this.nodeMap.get(nodeId) ?? null
        this.events.publish("nodeHover", node)
      } else {
        this.model.stateManager.clearHoveredNodes()
        this.events.publish("nodeHover", null)
      }
      this.syncAllNodeStyles()
    }

    this.renderer.onLinkHover = (linkId) => {
      // 边 hover 也同步节点样式——因为边 hover 时相关节点的状态可能变化
      if (linkId) {
        this.model.stateManager.setHoveredLinks([linkId])
        const link = this.linkMap.get(linkId) ?? null
        this.events.publish("linkHover", { link, previousLink: null })
      } else {
        this.model.stateManager.clearHoveredLinks()
        this.events.publish("linkHover", { link: null, previousLink: null })
      }
      this.syncAllLinkStyles()
      this.syncAllNodeStyles()
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
      this.rebuildFromModel(false)
    })

    this.events.subscribe("selectionChange", ({ nodeIds }) => {
      // 选中/隐藏等状态变化只影响视觉，无需重建数据与重启物理模拟
      this.syncAllNodeStyles()
      this.syncAllLinkStyles()
    })
  }

  // ========== 状态驱动的视觉同步 ==========

  /** 遍历所有节点，根据 stateManager 当前状态刷新视觉样式 */
  private syncAllNodeStyles(): void {
    for (const rn of this.renderer.nodes) {
      const stateType =
        (this.renderer.plugin.resolveNodeState?.(
          rn.id,
          this.model.stateManager,
        ) as G["NS"]) ?? ("regular" as G["NS"])
      const style = this.styleManager.getNodeStyle(rn.id)
      const s = getNodeStyleByStateType(style, stateType)
      const c = parseHexColor(s.bgColor!)
      rn.color = [c[0], c[1], c[2], s.opacity!]
      rn.strokeColor = parseHexColor(s.strokeColor!)
      rn.strokeWidth = s.strokeWidth!
    }
  }

  /** 遍历所有边，根据 stateManager 当前状态刷新视觉样式 */
  private syncAllLinkStyles(): void {
    for (const rl of this.renderer.links) {
      const stateType =
        (this.renderer.plugin.resolveLinkState?.(
          rl.id,
          this.model.stateManager,
        ) as G["LS"]) ?? ("regular" as G["LS"])
      const s = getLinkStyleByStateType(
        this.styleManager.getLinkStyle(rl.id),
        stateType,
      )
      const c = parseHexColor(s.color ?? "#9ca3af")
      rl.color = [c[0], c[1], c[2], s.opacity ?? 0.7]
      rl.width = s.strokeWidth ?? 0.8
    }
  }

  // ========== Data rebuilding ==========

  private rebuildFromModel(fitView: boolean = true): void {
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

      const rn = this.defaultMapNode(gn, i)

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

      const rl = this.defaultMapLink(gl, i)

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

    // Fit view (skipped when triggered by data changes like expansion)
    if (fitView) {
      requestAnimationFrame(() => {
        this.renderer.fitView()
      })
    }
  }

  private defaultMapNode(
    gn: GraphNode<G["NO"], G["NT"], G["NS"]>,
    _index: number,
  ): RenderNode {
    const nodeType = gn.data?.nodeType as G["NT"] | undefined
    // 从 rawTheme 解析（支持静态对象和回调函数）
    const themeEntry = nodeType ? this.rawTheme?.node?.[nodeType] : undefined
    const nodeStyle: NodeStyle<G> =
      typeof themeEntry === "function"
        ? (
            themeEntry as (n: typeof gn, runtimeTheme?: unknown) => NodeStyle<G>
          )(gn, this.runtimeTheme)
        : ((themeEntry as NodeStyle<G> | undefined) ??
          this.styleManager.getNodeStyle(gn.id))
    // 将最终样式写回 styleManager，便于 hover 等后续查找使用
    this.styleManager.setNodeStyle(gn.id, nodeStyle)

    const stateType =
      (this.renderer.plugin.resolveNodeState?.(
        gn.id,
        this.model.stateManager,
      ) as G["NS"]) ?? ("regular" as G["NS"])
    const s = getNodeStyleByStateType(nodeStyle, stateType)
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
      // 图标：node.data.icon（URL 或 emoji，见 IconAtlas）
      iconUrl: (gn.data as any)?.icon,
    }
  }

  private defaultMapLink(gl: GraphLink<G>, _index: number): RenderLink {
    const sourceId = typeof gl.source === "object" ? gl.source.id : gl.source
    const targetId = typeof gl.target === "object" ? gl.target.id : gl.target

    const sourceNode = this.nodeMap.get(String(sourceId))
    const targetNode = this.nodeMap.get(String(targetId))

    // 从 rawTheme 解析边样式（支持静态对象和回调函数）
    const linkType = gl.data?.linkType as G["LT"] | undefined
    const linkThemeEntry = linkType
      ? this.rawTheme?.link?.[linkType]
      : undefined
    const linkStyle: LinkStyle<G> =
      typeof linkThemeEntry === "function"
        ? (
            linkThemeEntry as (
              l: typeof gl,
              runtimeTheme?: unknown,
            ) => LinkStyle<G>
          )(gl, this.runtimeTheme)
        : ((linkThemeEntry as LinkStyle<G> | undefined) ??
          this.styleManager.getLinkStyle(gl.id))
    // 将最终样式写回 styleManager
    this.styleManager.setLinkStyle(gl.id, linkStyle)
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
      label: gl.data?.label ?? gl.data?.linkType,
      arrowSize: s.arrowSize,
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
  fitView(padding: number): void {
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

  /**
   * 一次性算法排布并 fitView（不等待物理引擎冷却）。
   * 供 init 使用：数据载入后直接按算法铺开节点并收进视野。
   */
  settleLayout(iterations?: number): void {
    if (this.layout.settle) {
      this.layout.settle(iterations ?? 300)
    } else {
      this.layout.start()
    }
    // 容器尺寸可能尚未就绪（single-spa 挂载初期 height=0），下一帧再 fitView
    requestAnimationFrame(() => this.renderer.fitView(40))
  }

  /** Get underlying canvas */
  getCanvas(): HTMLCanvasElement {
    return this.renderer.canvas
  }

  /** Clear hover state (visual + state) */
  clearHover(): void {
    this.syncAllNodeStyles()
    this.model.stateManager.clearHoveredNodes()
    this.events.publish("nodeHover", null)

    this.syncAllLinkStyles()
    this.events.publish("linkHover", { link: null, previousLink: null })
  }

  /**
   * 主题切换后重新解析所有节点/边的视觉样式。
   * 重新运行 defaultMapNode/defaultMapLink（会读取新的主题调色板），
   * 仅更新颜色/粗细等视觉字段，保持节点位置与布局不变。
   */
  refreshTheme(): void {
    const { graphData } = this.model.getGraphModelData()

    // 节点：按 id 找到已存在的 render node，仅替换视觉字段
    const nodeById = new Map(this.renderer.nodes.map((n) => [n.id, n]))
    for (let i = 0; i < graphData.nodes.length; i++) {
      const gn = graphData.nodes[i]
      const rn = this.defaultMapNode(gn, i)
      const existing = nodeById.get(gn.id)
      if (rn && existing) {
        existing.color = rn.color
        existing.strokeColor = rn.strokeColor
        existing.strokeWidth = rn.strokeWidth
        existing.radius = rn.radius
        existing.textColor = rn.textColor
        existing.fontSize = rn.fontSize
      }
    }

    // 边：同理
    const linkById = new Map(this.renderer.links.map((l) => [l.id, l]))
    for (let i = 0; i < graphData.links.length; i++) {
      const gl = graphData.links[i]
      const rl = this.defaultMapLink(gl, i)
      const existing = linkById.get(gl.id)
      if (rl && existing) {
        existing.color = rl.color
        existing.width = rl.width
        existing.arrowSize = rl.arrowSize
      }
    }

    // 按当前状态重算最终视觉
    this.syncAllNodeStyles()
    this.syncAllLinkStyles()
  }

  /**
   * 设置运行时主题值并重新应用节点/边样式（主题切换用）。
   * 样式回调函数会收到该值作为第 2 个参数。
   */
  setRuntimeTheme(theme: unknown): void {
    this.runtimeTheme = theme
    this.refreshTheme()
  }

  /**
   * 设置高亮节点并刷新视觉。
   * 供分析面板等外部调用，把已在画布上的节点标记为 highlighted。
   */
  setHighlightNodes(nodeIds: string[], linkIds: string[] = []): void {
    if (nodeIds.length > 0) {
      this.model.stateManager.setHighlightNodes(nodeIds, linkIds)
    } else {
      this.model.stateManager.clearHighlightNodes()
    }
    this.syncAllNodeStyles()
    this.syncAllLinkStyles()
  }

  /**
   * 设置/清除悬停节点并刷新视觉。
   * 供分析面板悬浮联动：对画布上对应节点实时应用 hover 效果。
   */
  setHoveredNodes(nodeIds: string[]): void {
    if (nodeIds.length > 0) {
      this.model.stateManager.setHoveredNodes(nodeIds)
    } else {
      this.model.stateManager.clearHoveredNodes()
    }
    this.syncAllNodeStyles()
  }

  /** Destroy and clean up */
  destroy(): void {
    this.layout.destroy()
    this.renderer.destroy()
  }
}
