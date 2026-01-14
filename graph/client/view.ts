import * as d3 from "d3-force"
import ForceGraph, { type LinkObject, type NodeObject } from "force-graph"

import {
  ARROW_SIZE,
  DEFAULT_BORDER_WIDTH,
  DEFAULT_FOUCS_LINE_WIDTH,
  DEFAULT_LINE_WIDTH,
  DEFAULT_LINK_LABEL_SCALE_THRESHOLD,
  DEFAULT_STROKE_COLOR,
  MAX_FONT_SIZE,
} from "./constants"
import { ConnGraphModel } from "../model"
import {
  getDefaultColorOf,
  getLinkStyleByType,
  getNodeStyleByStateType,
  getNodeStyleByType,
  type GraphViewStyle,
  type Style,
  getLinkStyleByStateType,
  type LStyle,
} from "../theme"
import { linkLabel, nodeLabel } from "./tooltip"
import { mergeObjects, type RecursivePartial } from "./utils"
import type { LinkId, LinkState, NodeId, NodeState } from "../type"
import { EntityRegistry } from "./entity-registry"

import ColorTracker from "canvas-color-tracker"
import type { NodeRenderProcessorMap } from "./entity-types"
import type {
  DefaultGraphDataGenerics,
  GraphDataGenerics,
  GraphLink,
  GraphNode,
  GraphViewModel,
} from "./type"

interface GraphModelActions {
  highlightNode(id: NodeId | undefined): void
  selectNode(id: NodeId | undefined): void
}

export type CustomLinkCanvasObjectType = Parameters<
  ForceGraph["linkCanvasObject"]
>[0]

export type CustomGraphViewStyle<G extends GraphDataGenerics> =
  RecursivePartial<GraphViewStyle<G>>
export type CustomNodeStyle = RecursivePartial<Style>

interface GraphViewOptions<
  G extends GraphDataGenerics = DefaultGraphDataGenerics
> {
  container: HTMLElement
  graphModel: ConnGraphModel<G>
  width?: number
  height?: number
  backgroundColor?: string
  // 全局自定义style
  style?: CustomGraphViewStyle<G>
  debug?: boolean
  arrowDisplay?: boolean
  customLinkCanvasObject?: CustomLinkCanvasObjectType
  entityRegistry?: EntityRegistry<G>
  // d3力配置函数
  setupD3Force?: (
    this: ConnGraphView<G>,
    forceGraph: ForceGraph,
    d3: typeof import("d3-force")
  ) => void
}

export class ConnGraphView<
  G extends GraphDataGenerics = DefaultGraphDataGenerics
> {
  declare options: GraphViewOptions<G>
  declare container: HTMLElement
  declare forceGraph: ForceGraph
  declare model: ConnGraphModel<G>
  declare style: GraphViewStyle<G>
  declare nodeRenderProcessorMap: NodeRenderProcessorMap<G>
  declare colorTracker: ColorTracker
  declare canvas: HTMLCanvasElement | null
  declare forceGraphShadowCtx: CanvasRenderingContext2D | null
  declare toolShadowCanvas: HTMLCanvasElement | null
  declare toolShadowCtx: CanvasRenderingContext2D | null
  declare entityRegistry: EntityRegistry<G>

  actions: GraphModelActions = {
    highlightNode: (nodeId: NodeId) => {
      this.model.stateManager.setFocusNodes(nodeId ? [nodeId] : [])
    },
    selectNode: (nodeId: NodeId) => {
      this.model.stateManager.setSelectedNodes(nodeId ? [nodeId] : [])
    },
  }

  constructor(opts: GraphViewOptions<G>) {
    this.options = opts
    this.container = opts.container
    this.model = opts.graphModel
    this.colorTracker = this.model.colorTracker
    this.canvas = null
    this.forceGraphShadowCtx = null
    this.toolShadowCanvas = null
    this.toolShadowCtx = null

    this.entityRegistry = opts.entityRegistry || new EntityRegistry()
    this.nodeRenderProcessorMap = this.entityRegistry.getAll()

    this.initStyle()
    this.initView()
  }

  /**
   * 计算每对节点之间的连线数量和索引
   */
  private calculateLinkCurveInfo() {
    const { graphData } = this.model.getGraphModelData()
    const linkCountMap = new Map<
      string,
      { total: number; links: Map<string, number> }
    >()

    // 统计每对节点之间的连线数量
    graphData.links.forEach((link) => {
      const sourceId =
        typeof link.source === "object" ? link.source.id : link.source
      const targetId =
        typeof link.target === "object" ? link.target.id : link.target

      // 创建唯一的节点对key（双向）
      const pairKey1 = `${sourceId}-${targetId}`
      const pairKey2 = `${targetId}-${sourceId}`

      // 使用字典序较小的key作为统一key
      const pairKey = pairKey1 < pairKey2 ? pairKey1 : pairKey2

      if (!linkCountMap.has(pairKey)) {
        linkCountMap.set(pairKey, { total: 0, links: new Map() })
      }

      const info = linkCountMap.get(pairKey)!
      info.links.set(String(link.id), info.total)
      info.total++
    })

    return linkCountMap
  }

  /**
   * 获取连线的曲线信息
   */
  private getLinkCurveOffset(
    link: GraphLink<G>,
    linkCountMap: Map<string, { total: number; links: Map<string, number> }>
  ): number {
    const sourceId =
      typeof link.source === "object" ? link.source.id : link.source
    const targetId =
      typeof link.target === "object" ? link.target.id : link.target

    const pairKey1 = `${sourceId}-${targetId}`
    const pairKey2 = `${targetId}-${sourceId}`
    const pairKey = pairKey1 < pairKey2 ? pairKey1 : pairKey2

    const info = linkCountMap.get(pairKey)
    if (!info || info.total <= 1) {
      return 0 // 单条连线，不需要偏移
    }

    const linkIndex = info.links.get(String(link.id)) ?? 0
    const totalLinks = info.total

    // 计算曲线偏移量，使多条线平均分布在两侧
    // 公式：offset = (linkIndex - (totalLinks - 1) / 2) * spacing
    // 例如：3条线 -> [-1, 0, +1]；4条线 -> [-1.5, -0.5, +0.5, +1.5]
    const spacing = 5 // 每条线之间的间距（单位：像素）
    const offset = (linkIndex - (totalLinks - 1) / 2) * spacing

    return offset
  }

  // ==================== 公共方法 ====================

  /**
   * 更新 d3 力配置
   */
  updateD3Force(setupFn: (d3: typeof import("d3-force")) => void) {
    setupFn(d3)
  }

  /**
   * 更新模型数据
   */
  updateModel(graphViewModel: Partial<GraphViewModel<G>>) {
    this.updateView(graphViewModel)
  }

  /**
   * 更新视图
   */
  updateView(graphViewModel: Partial<GraphViewModel<G>>) {
    if (!this.forceGraph) return

    if (graphViewModel.graphData) {
      this.forceGraph.graphData(graphViewModel.graphData)
      const newGraphData =
        this.forceGraph.graphData() as GraphViewModel<G>["graphData"]

      this.model.updateGraphData({
        graphData: newGraphData,
      })
    }
  }

  /**
   * 更新样式
   */
  updateStyle(options: Pick<GraphViewOptions<G>, "style">) {
    this.options.style = options.style

    this.refreshByStyle()
  }

  // ==================== 初始化方法 ====================

  /**
   * 初始化样式
   */
  protected initStyle() {
    if (this.options.style) {
      this.style = mergeObjects(this.style, this.options.style || {})
    } else {
      this.style = getDefaultColorOf<G>(this.container)
    }

    this.refreshByStyle()
  }

  /**
   * 初始化视图
   */
  protected initView() {
    if (!this.container) return

    const forceGraph = this.forceGraph || new ForceGraph(this.container)

    const { graphData } = this.model.getGraphModelData()
    forceGraph.graphData(graphData)

    this.setupOptions(forceGraph)
    this.setupForceGraph(forceGraph, d3)
    this.setupEventHandlers(forceGraph)
    this.setupCanvasClickListener()

    this.forceGraph = forceGraph

    this.refreshByStyle()
  }

  /**
   * 设置力导图配置
   */
  private setupForceGraph(
    forceGraph: ForceGraph,
    d3: typeof import("d3-force")
  ) {
    // 如果外部提供了自定义配置函数，优先使用
    if (this.options.setupD3Force) {
      this.options.setupD3Force.call(this, forceGraph, d3)
      return
    }

    // 默认配置
    // forceGraph
    // .d3Force("radial", d3.forceRadial(100, 0, 0).strength(0.1))
    // .d3Force("collision", this.createCollisionForce())
    // .d3Force("charge", d3.forceManyBody().strength(-20))
    // .d3Force("link", d3.forceLink().distance(50).strength(0.5))
  }

  private setupOptions(forceGraph: ForceGraph) {
    const { options } = this

    forceGraph
      .zoom(5)
      .width(options.width ?? this.container.clientWidth)
      .height(options.height ?? this.container.clientHeight)
      .backgroundColor(options.backgroundColor || "#f6f6f6")
      .autoPauseRedraw(false)
  }

  /**
   * 设置事件监听
   */
  private setupEventHandlers(forceGraph: ForceGraph) {
    const { actions } = this

    forceGraph
      .onNodeHover((_node) => {
        if (!_node) return
        const node = this.model.getNodeById(String(_node.id))
        if (node) {
          this.model.events.publish("nodeHover", node)
        }
      })
      .onNodeClick((_node, event) => {
        const node = this.model.getNodeById(String(_node.id))

        // if (node) {
        //   const style = this.getNodeColor(node.id)
        //   console.log("节点样式：", style)
        // }

        this.handleNodeClick(node, event)
      })
      .onNodeRightClick((_node, event) => {
        const node = this.model.getNodeById(String(_node.id))
        this.handleNodeRightClick(_node, node, event)
      })
      .onNodeDrag(() => {
        // forceGraph.d3ReheatSimulation()
      })
      .onNodeDragEnd((node) => {
        this.handleNodeDragEnd(node)
      })
      .onLinkClick((link) => {
        this.handleLinkClick(link)
      })
      .onBackgroundClick(() => {
        actions.selectNode(undefined)
        this.model.events.publish("backgroundClick", undefined)
      })
      .onZoom((transform) => {
        this.handleCanvasZoom(transform)
      })
      .onRenderFramePost((ctx, globalScale) => {
        this.handleRenderFramePost({ ctx, globalScale })
      })
      .showPointerCursor((_node) => {
        return Boolean(_node)
      })
  }

  /**
   * 设置画布点击监听
   */
  private setupCanvasClickListener() {
    this.canvas = this.container.querySelector("canvas")
    if (!this.canvas) {
      console.error("❌ 未找到主 canvas 元素")
      return
    }

    // 创建独立的 shadowCanvas 用于工具颜色追踪
    this.toolShadowCanvas = document.createElement("canvas")
    this.toolShadowCanvas.width = this.canvas.width
    this.toolShadowCanvas.height = this.canvas.height
    this.toolShadowCanvas.style.position = "absolute"
    this.toolShadowCanvas.style.top = "0"
    this.toolShadowCanvas.style.left = "0"
    // this.toolShadowCanvas.style.pointerEvents = "none"
    // this.toolShadowCanvas.style.opacity = "0.5"
    // this.toolShadowCanvas.style.zIndex = "999"
    // this.container.appendChild(this.toolShadowCanvas)

    this.toolShadowCtx = this.toolShadowCanvas.getContext("2d")

    this.container.addEventListener("pointerup", (event) => {
      this.handleCanvasClick(event)
    })
    this.container.addEventListener("pointermove", (event) => {
      this.handleCanvasPointermove(event)
    })
  }

  /**
   * 更新鼠标位置缓存
   */
  private handleCanvasPointermove(event: MouseEvent) {
    if (!this.canvas || !this.toolShadowCtx) return

    const rect = this.canvas.getBoundingClientRect()
    const scaleX = this.canvas.width / rect.width
    const scaleY = this.canvas.height / rect.height
    const x = (event.clientX - rect.left) * scaleX
    const y = (event.clientY - rect.top) * scaleY

    const pxColor = this.toolShadowCtx.getImageData(x, y, 1, 1).data
    const obj = this.colorTracker.lookup([pxColor[0], pxColor[1], pxColor[2]])

    if (!obj) return (this.canvas.style.cursor = "")

    switch (obj.type) {
      case "PlusTool":
        this.canvas.style.cursor = "pointer"
        break
    }
  }

  /**
   * 处理画布点击
   */
  private handleCanvasClick(event: MouseEvent) {
    if (!this.canvas || !this.toolShadowCtx) return

    const rect = this.canvas.getBoundingClientRect()

    const scaleX = this.canvas.width / rect.width
    const scaleY = this.canvas.height / rect.height
    const x = (event.clientX - rect.left) * scaleX
    const y = (event.clientY - rect.top) * scaleY

    const pxColor = this.toolShadowCtx.getImageData(x, y, 1, 1).data
    const obj = this.colorTracker.lookup([pxColor[0], pxColor[1], pxColor[2]])

    if (!obj) return

    switch (obj.type) {
      case "PlusTool":
        this.model.events.publish(
          "plusToolClick",
          obj.d as GraphNode<G["NO"], G["NT"], G["NS"]>
        )
        event.stopPropagation()
        break
    }
  }

  // ==================== 事件处理方法 ====================

  /**
   * 处理节点点击
   */
  private handleNodeClick(
    node: GraphNode<G["NO"], G["NT"], G["NS"]> | undefined,
    event?: MouseEvent
  ) {
    if (!node) return
    this.actions.selectNode(String(node.id))
    this.model.events.publish("nodeClick", node)
  }

  /**
   * 处理节点右键点击
   */
  private handleNodeRightClick(
    _node: NodeObject,
    node: GraphNode<G["NO"], G["NT"], G["NS"]> | undefined,
    event: MouseEvent
  ) {
    if (!node?.data?.nodeType) return

    const screenPos = this.forceGraph.graph2ScreenCoords(
      _node.x ?? 0,
      _node.y ?? 0
    )
    this.model.events.publish("menuOpen", { node, screenPos, event })
  }

  /**
   * 处理节点拖拽结束
   */
  private handleNodeDragEnd(node: NodeObject) {
    node.fx = node.x
    node.fy = node.y

    const graphNode = this.model.getNodeById(String(node.id))
    if (graphNode) {
      this.model.events.publish("nodeDragEnd", graphNode)
    }
  }

  /**
   * 处理连线点击
   */
  private handleLinkClick(link: LinkObject) {
    const linkWithId = link as { id?: string }
    if (!linkWithId.id) return

    const graphLink = this.model.getLinkById(linkWithId.id)
    if (graphLink) {
      this.model.events.publish("linkClick", graphLink)
    }
  }

  private handleRenderFramePost({
    ctx,
    globalScale,
  }: {
    ctx: CanvasRenderingContext2D
    globalScale: number
  }) {
    // 清空 toolShadowCanvas
    if (this.toolShadowCtx && this.toolShadowCanvas) {
      const transform = ctx.getTransform()
      this.toolShadowCtx.save()
      this.toolShadowCtx.setTransform(1, 0, 0, 1, 0, 0)
      this.toolShadowCtx.clearRect(
        0,
        0,
        this.toolShadowCanvas.width,
        this.toolShadowCanvas.height
      )
      this.toolShadowCtx.restore()
      this.toolShadowCtx.setTransform(transform)

      // 重新绘制所有节点工具
      const { graphData } = this.model.getGraphModelData()
      graphData.nodes.forEach((_node) => {
        const node = this.model.getNodeById(String(_node.id))
        if (!node) return

        const { __toolIndexColor } = node
        const { nodeType } = node.data || {}
        const style = this.getNodeColor(node.id, globalScale)

        const processor = nodeType
          ? this.nodeRenderProcessorMap[nodeType]
          : undefined

        processor?.renderNodeToolsPointerArea?.({
          node: node,
          indexColor: __toolIndexColor,
          ctx: this.toolShadowCtx!,
          style: style,
          globalScale: globalScale,
          colorTracker: this.colorTracker,
          shadowCtx: this.toolShadowCtx!,
          tagManager: this.model.tagManager,
          loadingManager: this.model.loadingManager,
        })
      })
    }

    this.model.events.publish("framePost", {
      ctx,
      globalScale,
      cache: this.model.getGraphModelData(),
    })
  }

  private handleCanvasZoom(transform: { k: number; x: number; y: number }) {
    this.model.events.publish("zoom", transform)

    // 同步 toolShadowCanvas 的变换
    if (this.toolShadowCtx) {
      this.toolShadowCtx.setTransform(
        transform.k,
        0,
        0,
        transform.k,
        transform.x,
        transform.y
      )
    }
  }

  // ==================== 工具相关方法 ====================

  public getCollisionRadius = <G extends GraphDataGenerics>(
    node: GraphNode<G["NO"], G["NT"], G["NS"]>,
    gobalScale?: number
  ) => {
    const { nodeType } = node?.data || {}
    if (!nodeType) return 0

    const style = this.getNodeColor(node.id, gobalScale)

    const processor = this.nodeRenderProcessorMap[nodeType]
    return processor?.getCollisionRadius?.({ node, style }) ?? 0
  }

  // ==================== 状态查询方法 ====================

  /**
   * 获取节点状态
   */
  protected getNodeState(
    node?: GraphNode<G["NO"], G["NT"], G["NS"]>
  ): G["NS"] | undefined {
    if (!node) return undefined

    const nodeId = node.id
    const { stateType } = node.data || {}

    if (this.model.stateManager.isFocused(nodeId)) return "highlighted"
    if (this.model.stateManager.isSelected(nodeId)) return "selected"
    if (this.model.stateManager.isHidden(nodeId)) return "hidden"
    if (this.model.stateManager.isRootNode(nodeId)) return "root"

    return stateType
  }

  /**
   * 获取连线状态
   */
  protected getLinkState(link?: GraphLink<G>): G["LS"] | undefined {
    if (!link) return undefined

    const linkId = link.id
    const { stateType } = link.data || {}

    const focusLinks = this.model.stateManager.getFocusLinks()
    const selectedLinks = this.model.stateManager.getSelectedLinks()
    const hiddenLinks = this.model.stateManager.getHiddenLinks()

    if (focusLinks.some((id) => id === linkId)) return "highlighted"
    if (selectedLinks.some((id) => id === linkId)) return "selected"
    if (hiddenLinks.some((id) => id === linkId)) return "hidden"

    return stateType
  }

  // ==================== 样式相关方法 ====================

  /**
   * 获取节点颜色配置
   */
  private getNodeColor = (nodeId: NodeId, globalScale?: number): Style => {
    const node = this.model.getNodeById(nodeId)
    const { nodeType } = node?.data || {}

    const nodeStyle = getNodeStyleByType(this.style, nodeType)
    const state = this.getNodeState(node)
    const style = getNodeStyleByStateType(nodeStyle, state)

    return style
  }

  /**
   * 获取连线颜色配置
   */
  private getLinkColor = (linkId: LinkId): LStyle => {
    const link = this.model.getLinkById(linkId)
    const { linkType, color } = link?.data || {}

    const linkStyle = getLinkStyleByType(this.style, linkType)
    const state = this.getLinkState(link)
    const style = getLinkStyleByStateType(linkStyle, state)

    return {
      ...style,
      color: color || style.color,
    } as LStyle
  }

  // ==================== 渲染方法 ====================

  /**
   * 刷新样式和渲染
   */
  refreshByStyle() {
    if (!this.forceGraph) return

    if (this.options.style) {
      this.style = mergeObjects(this.style, this.options.style || {})
    } else {
      this.style = getDefaultColorOf<G>(this.container)
    }

    this.forceGraph
      .backgroundColor(this.style.background)
      .nodeCanvasObjectMode(() => "replace")
      .nodeCanvasObject(this.renderNode)
      .nodePointerAreaPaint(this.renderNodePointerArea)
      .linkCanvasObject(this.renderLink)
      .linkPointerAreaPaint(this.renderLinkPointerArea)
      .nodeLabel((node) => {
        const graphNode = this.model.getNodeById(String(node.id))
        return nodeLabel(graphNode, this.options.debug)
      })
      .linkLabel((_link) => {
        const link = _link as GraphLink<G>
        const graphLink = this.model.getLinkById(String(link.id))
        return linkLabel(graphLink, this.options.debug)
      })
  }

  /**
   * 渲染节点
   */
  private renderNode = (
    _node: NodeObject,
    ctx: CanvasRenderingContext2D,
    globalScale: number
  ) => {
    if (!_node.id) return
    const node = this.model.getNodeById(String(_node.id))
    if (!node) return

    const { nodeType } = node?.data || {}
    const style = this.getNodeColor(node.id, globalScale)

    // 获取渲染器
    const processor = nodeType
      ? this.nodeRenderProcessorMap[nodeType]
      : undefined

    // 渲染节点
    processor?.renderNodeCanvasObject?.({
      node,
      ctx,
      globalScale,
      style,
      colorTracker: this.colorTracker,
      tagManager: this.model.tagManager,
      loadingManager: this.model.loadingManager,
    })
  }

  /**
   * 渲染节点指针区域
   */
  private renderNodePointerArea = (
    _node: NodeObject,
    color: string,
    ctx: CanvasRenderingContext2D,
    globalScale: number
  ) => {
    if (!_node.id) return

    const node = this.model.getNodeById(String(_node.id))
    if (!node) return
    const { nodeType } = node?.data || {}

    const nodeStyle = getNodeStyleByType(this.style, nodeType)
    const state = this.getNodeState(node)
    const style = getNodeStyleByStateType(nodeStyle, state)

    const processor = nodeType
      ? this.nodeRenderProcessorMap[nodeType]
      : undefined

    processor?.renderNodePointerArea?.({
      node: node,
      indexColor: color,
      ctx: ctx,
      style: style,
      globalScale: globalScale,
      colorTracker: this.colorTracker,
      shadowCtx: ctx,
      tagManager: this.model.tagManager,
      loadingManager: this.model.loadingManager,
    })

    processor?.renderNodeToolsPointerArea?.({
      node: node,
      indexColor: color,
      ctx: ctx,
      style: style,
      globalScale: globalScale,
      colorTracker: this.colorTracker,
      shadowCtx: this.toolShadowCtx!,
      tagManager: this.model.tagManager,
      loadingManager: this.model.loadingManager,
    })
  }

  /**
   * 渲染连线指针区域（用于连线的点击交互）
   */
  private renderLinkPointerArea = (
    _link: LinkObject,
    color: string,
    ctx: CanvasRenderingContext2D,
    globalScale: number
  ) => {
    const link = _link as GraphLink<G>
    if (typeof link.source !== "object" || typeof link.target !== "object")
      return

    const start = link.source as GraphNode<G["NO"], G["NT"], G["NS"]>
    const end = link.target as GraphNode<G["NO"], G["NT"], G["NS"]>

    // 计算曲线偏移
    const linkCountMap = this.calculateLinkCurveInfo()
    const curveOffset = this.getLinkCurveOffset(link, linkCountMap)

    const targetNode = end
    const targetRadius = this.getNodeRadius(targetNode)

    // 设置点击区域的宽度（比实际线条宽一些，方便点击）
    const pointerAreaWidth = 8 / globalScale

    ctx.save()
    ctx.fillStyle = color
    ctx.beginPath()

    if (curveOffset === 0) {
      // 直线点击区域
      const { x: arrowStartX, y: arrowStartY } = this.calculateArrowStart(
        start,
        end,
        targetRadius
      )

      // 绘制矩形点击区域（线条两侧扩展）
      const dx = arrowStartX - start.x!
      const dy = arrowStartY - start.y!
      const len = Math.sqrt(dx * dx + dy * dy)
      const perpX = ((-dy / len) * pointerAreaWidth) / 2
      const perpY = ((dx / len) * pointerAreaWidth) / 2

      ctx.moveTo(start.x! + perpX, start.y! + perpY)
      ctx.lineTo(start.x! - perpX, start.y! - perpY)
      ctx.lineTo(arrowStartX - perpX, arrowStartY - perpY)
      ctx.lineTo(arrowStartX + perpX, arrowStartY + perpY)
      ctx.closePath()
    }

    if (curveOffset !== 0) {
      // 曲线点击区域（使用路径描边）
      const dx = end.x! - start.x!
      const dy = end.y! - start.y!
      const distance = Math.sqrt(dx * dx + dy * dy)

      const controlX = (start.x! + end.x!) / 2 + (-dy / distance) * curveOffset
      const controlY = (start.y! + end.y!) / 2 + (dx / distance) * curveOffset

      const t = 1 - targetRadius / distance
      const endX = start.x! + dx * t
      const endY = start.y! + dy * t

      ctx.moveTo(start.x!, start.y!)
      ctx.quadraticCurveTo(controlX, controlY, endX, endY)
      ctx.lineWidth = pointerAreaWidth
      ctx.lineCap = "round"
      ctx.strokeStyle = color
      ctx.stroke()
    }

    ctx.fill()
    ctx.restore()
  }

  /**
   * 渲染连线
   */
  private renderLink = (
    _link: LinkObject,
    ctx: CanvasRenderingContext2D,
    globalScale: number
  ) => {
    const link = _link as GraphLink<G>

    const start = link.source as NodeObject
    const end = link.target as NodeObject

    if (typeof start !== "object" || typeof end !== "object") return

    const {
      color = DEFAULT_STROKE_COLOR,
      opacity,
      light,
    } = this.getLinkColor(String(link.id))

    // 计算曲线偏移
    const linkCountMap = this.calculateLinkCurveInfo()
    const curveOffset = this.getLinkCurveOffset(link, linkCountMap)

    // 渲染连线主体
    this.renderLinkLine(
      start,
      end,
      link,
      ctx,
      globalScale,
      color,
      opacity,
      curveOffset
    )

    // 渲染箭头
    if (this.options.arrowDisplay) {
      this.renderArrow(start, end, link, ctx, globalScale, color, curveOffset)
    }

    // 渲染光晕效果
    if (light) {
      this.renderLinkLight(
        start,
        end,
        link,
        ctx,
        globalScale,
        light,
        opacity,
        curveOffset
      )
    }

    // 渲染文字标签
    if (globalScale > DEFAULT_LINK_LABEL_SCALE_THRESHOLD) {
      this.renderLinkLabel(
        start,
        end,
        link,
        ctx,
        globalScale,
        opacity,
        curveOffset
      )
    }

    // 自定义渲染
    this.options.customLinkCanvasObject?.(_link, ctx, globalScale)
  }

  /**
   * 渲染连线主体
   */
  private renderLinkLine(
    start: NodeObject,
    end: NodeObject,
    link: GraphLink<G>,
    ctx: CanvasRenderingContext2D,
    globalScale: number,
    stroke: string,
    opacity?: number,
    curveOffset: number = 0
  ) {
    const focusLinks = this.model.stateManager.getFocusLinks()

    const lineWidth = link.data?.lineWidth ?? DEFAULT_LINE_WIDTH
    const focusMultiplier = focusLinks.some((id) => id === link.id)
      ? DEFAULT_FOUCS_LINE_WIDTH
      : 1

    ctx.save()
    ctx.globalAlpha = opacity ?? 1
    ctx.beginPath()

    if (curveOffset === 0) {
      // 直线 - 终点为节点中心
      ctx.moveTo(start.x!, start.y!)
      ctx.lineTo(end.x!, end.y!)
    } else {
      // 曲线（二次贝塞尔曲线）- 终点为节点中心
      const dx = end.x! - start.x!
      const dy = end.y! - start.y!
      const distance = Math.sqrt(dx * dx + dy * dy)

      // 计算控制点（垂直于连线方向）
      const controlX = (start.x! + end.x!) / 2 + (-dy / distance) * curveOffset
      const controlY = (start.y! + end.y!) / 2 + (dx / distance) * curveOffset

      ctx.moveTo(start.x!, start.y!)
      ctx.quadraticCurveTo(controlX, controlY, end.x!, end.y!)
    }

    ctx.strokeStyle = stroke
    ctx.lineWidth = (lineWidth * focusMultiplier) / globalScale
    ctx.stroke()
    ctx.closePath()
    ctx.restore()
  }

  /**
   * 渲染箭头
   */
  private renderArrow(
    start: NodeObject,
    end: NodeObject,
    link: GraphLink<G>,
    ctx: CanvasRenderingContext2D,
    globalScale: number,
    stroke: string,
    curveOffset: number = 0
  ) {
    let angle: number

    if (curveOffset === 0) {
      // 直线箭头 - 箭头位置在节点中心
      angle = Math.atan2(end.y! - start.y!, end.x! - start.x!)
    } else {
      // 曲线箭头 - 计算曲线终点（节点中心）的切线方向
      const dx = end.x! - start.x!
      const dy = end.y! - start.y!
      const distance = Math.sqrt(dx * dx + dy * dy)

      // 控制点
      const controlX = (start.x! + end.x!) / 2 + (-dy / distance) * curveOffset
      const controlY = (start.y! + end.y!) / 2 + (dx / distance) * curveOffset

      // 在 t = 1（终点）处计算切线方向
      const tangentX = 2 * (end.x! - controlX)
      const tangentY = 2 * (end.y! - controlY)
      angle = Math.atan2(tangentY, tangentX)
    }

    const arrowLength = ARROW_SIZE / globalScale
    const arrowWidth = arrowLength * 0.8

    // 箭头绘制在节点中心
    const arrowPoints = this.calculateArrowPoints(
      end.x!,
      end.y!,
      arrowLength,
      arrowWidth,
      angle
    )

    ctx.beginPath()
    ctx.moveTo(arrowPoints.tip.x, arrowPoints.tip.y)
    ctx.lineTo(arrowPoints.left.x, arrowPoints.left.y)
    ctx.lineTo(arrowPoints.right.x, arrowPoints.right.y)
    ctx.closePath()
    ctx.fillStyle = stroke
    ctx.fill()
  }

  /**
   * 渲染连线光晕
   */
  private renderLinkLight(
    start: NodeObject,
    end: NodeObject,
    link: GraphLink<G>,
    ctx: CanvasRenderingContext2D,
    globalScale: number,
    light: string,
    opacity?: number,
    curveOffset: number = 0
  ) {
    ctx.save()
    ctx.globalAlpha = opacity ?? 1

    // 光晕线条
    ctx.beginPath()

    if (curveOffset === 0) {
      // 直线光晕 - 终点为节点中心
      ctx.moveTo(start.x!, start.y!)
      ctx.lineTo(end.x!, end.y!)
    } else {
      // 曲线光晕 - 终点为节点中心
      const dx = end.x! - start.x!
      const dy = end.y! - start.y!
      const distance = Math.sqrt(dx * dx + dy * dy)

      const controlX = (start.x! + end.x!) / 2 + (-dy / distance) * curveOffset
      const controlY = (start.y! + end.y!) / 2 + (dx / distance) * curveOffset

      ctx.moveTo(start.x!, start.y!)
      ctx.quadraticCurveTo(controlX, controlY, end.x!, end.y!)
    }

    ctx.lineWidth = 0.5 / globalScale
    ctx.strokeStyle = light
    ctx.stroke()
    ctx.closePath()

    // 光晕箭头
    if (this.options.arrowDisplay) {
      let angle: number

      if (curveOffset === 0) {
        angle = Math.atan2(end.y! - start.y!, end.x! - start.x!)
      } else {
        const dx = end.x! - start.x!
        const dy = end.y! - start.y!
        const distance = Math.sqrt(dx * dx + dy * dy)

        const controlX =
          (start.x! + end.x!) / 2 + (-dy / distance) * curveOffset
        const controlY = (start.y! + end.y!) / 2 + (dx / distance) * curveOffset

        // 在终点处计算切线方向
        const tangentX = 2 * (end.x! - controlX)
        const tangentY = 2 * (end.y! - controlY)
        angle = Math.atan2(tangentY, tangentX)
      }

      const arrowLength = ARROW_SIZE / globalScale
      const arrowWidth = arrowLength * 0.8

      const arrowPoints = this.calculateArrowPoints(
        end.x!,
        end.y!,
        arrowLength,
        arrowWidth,
        angle
      )

      ctx.beginPath()
      ctx.moveTo(arrowPoints.tip.x, arrowPoints.tip.y)
      ctx.lineTo(arrowPoints.left.x, arrowPoints.left.y)
      ctx.lineTo(arrowPoints.right.x, arrowPoints.right.y)
      ctx.closePath()
      ctx.fillStyle = light
      ctx.fill()
    }

    ctx.restore()
  }

  /**
   * 渲染连线标签
   */
  private renderLinkLabel(
    start: NodeObject,
    end: NodeObject,
    link: GraphLink<G>,
    ctx: CanvasRenderingContext2D,
    globalScale: number,
    opacity?: number,
    curveOffset: number = 0
  ) {
    const label = link.data?.label
    if (!label || label.length === 0) return

    const LABEL_NODE_MARGIN = this.forceGraph.nodeRelSize() * 1.5

    let textPos: { x: number; y: number }
    let textAngle: number

    if (curveOffset === 0) {
      // 直线标签位置
      textPos = {
        x: start.x! + (end.x! - start.x!) / 2,
        y: start.y! + (end.y! - start.y!) / 2,
      }

      const relLink = { x: end.x! - start.x!, y: end.y! - start.y! }
      textAngle = Math.atan2(relLink.y, relLink.x)
    } else {
      // 曲线标签位置（贝塞尔曲线中点 t=0.5）
      const dx = end.x! - start.x!
      const dy = end.y! - start.y!
      const distance = Math.sqrt(dx * dx + dy * dy)

      const controlX = (start.x! + end.x!) / 2 + (-dy / distance) * curveOffset
      const controlY = (start.y! + end.y!) / 2 + (dx / distance) * curveOffset

      const t = 0.5
      textPos = {
        x:
          (1 - t) * (1 - t) * start.x! +
          2 * (1 - t) * t * controlX +
          t * t * end.x!,
        y:
          (1 - t) * (1 - t) * start.y! +
          2 * (1 - t) * t * controlY +
          t * t * end.y!,
      }

      // 计算切线方向
      const tangentX =
        2 * (1 - t) * (controlX - start.x!) + 2 * t * (end.x! - controlX)
      const tangentY =
        2 * (1 - t) * (controlY - start.y!) + 2 * t * (end.y! - controlY)
      textAngle = Math.atan2(tangentY, tangentX)
    }

    const relLink = { x: end.x! - start.x!, y: end.y! - start.y! }
    const maxTextLength =
      Math.sqrt(relLink.x ** 2 + relLink.y ** 2) - LABEL_NODE_MARGIN * 2

    if (textAngle > Math.PI / 2) textAngle = -(Math.PI - textAngle)
    if (textAngle < -Math.PI / 2) textAngle = -(-Math.PI - textAngle)

    // 计算字体大小
    ctx.font = `${MAX_FONT_SIZE}px Sans-Serif`
    const baseTextWidth = ctx.measureText(label).width
    const fontSize = Math.min(MAX_FONT_SIZE, maxTextLength / baseTextWidth)

    ctx.font = `${fontSize}px Sans-Serif`
    const textWidth = ctx.measureText(label).width
    const bckgDimensions = [textWidth, fontSize].map((n) => n + fontSize * 0.2)

    ctx.save()
    ctx.globalAlpha = opacity ?? 1
    ctx.translate(textPos.x, textPos.y)
    ctx.rotate(textAngle)

    // 背景
    ctx.fillStyle = this.options.backgroundColor || "#f6f6f6"
    ctx.fillRect(
      -bckgDimensions[0] / 2,
      -bckgDimensions[1] / 2,
      bckgDimensions[0],
      bckgDimensions[1]
    )

    // 文字
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillStyle = "darkgrey"
    ctx.fillText(label, 0, 0)

    ctx.restore()
  }

  // ==================== 工具方法 ====================

  /**
   * 获取节点半径
   */
  private getNodeRadius(node: GraphNode<G["NO"], G["NT"], G["NS"]>): number {
    const nodeType = node?.data?.nodeType
    const style = this.getNodeColor(String(node.id), 1)
    const processor = nodeType
      ? this.nodeRenderProcessorMap[nodeType]
      : undefined

    // 优先使用节点类型的碰撞半径，否则使用默认半径
    return (
      processor?.getCollisionRadius?.({ node, style }) ??
      this.forceGraph.nodeRelSize()
    )
  }

  /**
   * 计算箭头起点（考虑节点半径）
   */
  private calculateArrowStart(
    start: NodeObject,
    end: NodeObject,
    targetRadius: number
  ) {
    const dx = end.x! - start.x!
    const dy = end.y! - start.y!
    const linkLength = Math.sqrt(dx * dx + dy * dy)

    return {
      x: end.x! - (dx / linkLength) * targetRadius,
      y: end.y! - (dy / linkLength) * targetRadius,
    }
  }

  /**
   * 计算箭头三个顶点坐标
   */
  private calculateArrowPoints(
    tipX: number,
    tipY: number,
    arrowLength: number,
    arrowWidth: number,
    angle: number
  ) {
    return {
      tip: { x: tipX, y: tipY },
      left: {
        x:
          tipX -
          arrowLength * Math.cos(angle) +
          (arrowWidth * Math.sin(angle)) / 2,
        y:
          tipY -
          arrowLength * Math.sin(angle) -
          (arrowWidth * Math.cos(angle)) / 2,
      },
      right: {
        x:
          tipX -
          arrowLength * Math.cos(angle) -
          (arrowWidth * Math.sin(angle)) / 2,
        y:
          tipY -
          arrowLength * Math.sin(angle) +
          (arrowWidth * Math.cos(angle)) / 2,
      },
    }
  }
}
