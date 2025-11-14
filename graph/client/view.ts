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
  nodeRenderProcessorMap,
} from "./constants"
import { ConnGraphModel, type Options } from "../model"
import {
  getDefaultColorOf,
  getLinkStyleByType,
  getNodeStyleByStateType,
  getNodeStyleByType,
  type GraphViewStyle,
  type Style,
  type LinkStyle,
  getLinkStyleByStateType,
  type LStyle,
} from "../theme"
import { linkLabel, nodeLabel } from "./tooltip"
import { mergeObjects, type RecursivePartial } from "./utils"
import type {
  GraphLink,
  GraphNode,
  GraphViewModel,
  LinkId,
  LinkState,
  NodeId,
  NodeState,
} from "../type"
import type { EntityConfig, NodeRenderProcessorMap } from "../entity"

import ColorTracker from "canvas-color-tracker"

interface GraphModelActions {
  highlightNode(id: NodeId | undefined): void
  selectNode(id: NodeId | undefined): void
}

export type CustomLinkCanvasObjectType = Parameters<
  ForceGraph["linkCanvasObject"]
>[0]

export type CustomGraphViewStyle = RecursivePartial<GraphViewStyle>
export type CustomNodeStyle = RecursivePartial<Style>

interface GraphViewOptions {
  container: HTMLElement
  graphModel: ConnGraphModel
  width?: number
  height?: number
  backgroundColor?: string
  style?: CustomGraphViewStyle
  debug?: boolean
  arrowDisplay?: boolean
  customLinkCanvasObject?: CustomLinkCanvasObjectType
  customEntityConfig?: EntityConfig
  defaultNodeStyle?: Partial<Style>
}

export class ConnGraphView {
  declare options: GraphViewOptions
  declare container: HTMLElement
  declare forceGraph: ForceGraph
  declare model: ConnGraphModel
  declare style: GraphViewStyle
  declare imageCache: Map<string, HTMLImageElement>
  declare nodeRenderProcessorMap: NodeRenderProcessorMap
  declare colorTracker: ColorTracker

  actions: GraphModelActions = {
    highlightNode: (nodeId: NodeId) => {
      this.model.updeteFoucsNodes(nodeId ? [nodeId] : [])
    },
    selectNode: (nodeId: NodeId) => {
      this.model.updateSelectedNodes(nodeId ? [nodeId] : [])
    },
  }

  constructor(opts: GraphViewOptions) {
    this.options = opts
    this.container = opts.container
    this.model = opts.graphModel
    this.imageCache = new Map()
    this.nodeRenderProcessorMap = nodeRenderProcessorMap()
    this.colorTracker = new ColorTracker()

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
    link: GraphLink,
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
   * 更新模型数据
   */
  updateModel(graphViewModel: GraphViewModel) {
    this.updateView(graphViewModel)
  }

  /**
   * 更新视图
   */
  updateView(graphViewModel: GraphViewModel) {
    if (!this.forceGraph) return

    this.forceGraph.graphData(graphViewModel.graphData)
    const newGraphData =
      this.forceGraph.graphData() as GraphViewModel["graphData"]

    this.model.updateCache({
      ...graphViewModel,
      graphData: newGraphData,
    })
  }

  /**
   * 更新样式
   */
  updateStyle(options: Pick<GraphViewOptions, "style" | "defaultNodeStyle">) {
    this.options.style = options.style
    this.options.defaultNodeStyle = options.defaultNodeStyle

    this.refreshByStyle()
  }

  // ==================== 初始化方法 ====================

  /**
   * 初始化样式
   */
  protected initStyle() {
    this.style = mergeObjects(this.style, this.options.style || {})
    this.style = getDefaultColorOf({
      container: this.container,
      defaultNodeStyle: this.options.defaultNodeStyle,
    })

    this.refreshByStyle()
  }

  /**
   * 初始化视图
   */
  protected initView() {
    if (!this.container) return

    const forceGraph = this.forceGraph || new ForceGraph(this.container)

    this.setupForceGraph(forceGraph)
    this.setupEventHandlers(forceGraph)

    this.forceGraph = forceGraph

    this.refreshByStyle()
  }

  /**
   * 设置力导图配置
   */
  private setupForceGraph(forceGraph: ForceGraph) {
    const { options } = this
    const { graphData } = this.model.getGraphModelData()

    forceGraph
      .graphData(graphData)
      .d3Force("x", null)
      .d3Force("y", null)
      .d3Force("center", null)
      .d3Force("radial", d3.forceRadial(100, 0, 0).strength(0.1))
      .d3Force("collision", this.createCollisionForce())
      .d3Force("charge", d3.forceManyBody().strength(-20))
      .d3Force("link", d3.forceLink().distance(50).strength(0.5))

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
      .onNodeClick((_node) => {
        const node = this.model.getNodeById(String(_node.id))
        this.handleNodeClick(node)
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
      .onZoom((zoom) => {
        this.model.events.publish("zoom", zoom)
      })
      .onRenderFramePost((ctx, globalScale) => {
        this.handleRenderFramePost({ ctx, globalScale })
      })
      .showPointerCursor((_node) => !!_node)
  }

  // ==================== 事件处理方法 ====================

  /**
   * 处理节点点击
   */
  private handleNodeClick(node: GraphNode | undefined) {
    if (!node?.data?.nodeType) return

    const { nodeType } = node.data

    switch (nodeType) {
      case "paginator":
        this.model.events.publish("loadMore", node)
        break
      default:
        this.actions.selectNode(String(node.id))
        this.model.events.publish("nodeClick", node)
        break
    }
  }

  /**
   * 处理节点右键点击
   */
  private handleNodeRightClick(
    _node: NodeObject,
    node: GraphNode | undefined,
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
    this.model.events.publish("framePost", {
      ctx,
      globalScale,
      cache: this.model.getGraphModelData(),
    })
  }

  // ==================== 力学相关方法 ====================

  /**
   * 创建碰撞力
   */
  private createCollisionForce() {
    const getCollisionRadius = (node: GraphNode) => {
      const { nodeType } = node?.data || {}
      if (!nodeType) return 0

      const nodeStyle = getNodeStyleByType(this.style, nodeType)
      const state = this.getNodeState(node)
      const style = getNodeStyleByStateType(nodeStyle, state)

      const processor = this.nodeRenderProcessorMap[nodeType]
      return processor?.getCollisionRadius?.({ node, style }) ?? 0
    }

    return d3
      .forceCollide()
      .radius((_node) => {
        const nodeObject = _node as NodeObject
        const nodeId = nodeObject?.id
        if (!nodeId) return 0

        const node = this.model.getNodeById(String(nodeId))
        if (!node) return 0

        return getCollisionRadius(node) * 2
      })
      .strength(0.8)
  }

  // ==================== 状态查询方法 ====================

  /**
   * 获取节点状态
   */
  protected getNodeState(node?: GraphNode): NodeState {
    if (!node) return "regular"

    const nodeId = node.id
    const { stateType } = node.data || {}

    const { focusNodes, selectedNodes, hiddenNodes } =
      this.model.getGraphModelData()

    if (focusNodes?.some((id) => id === nodeId)) return "highlighted"
    if (selectedNodes?.some((id) => id === nodeId)) return "selected"
    if (hiddenNodes?.some((id) => id === nodeId)) return "hidden"

    return stateType || "regular"
  }

  /**
   * 获取连线状态
   */
  protected getLinkState(link?: GraphLink): LinkState {
    if (!link) return "regular"

    const linkId = link.id
    const { stateType } = link.data || {}

    const { focusLinks, selectedLinks, hiddenLinks } =
      this.model.getGraphModelData()

    if (focusLinks?.some((id) => id === linkId)) return "highlighted"
    if (selectedLinks?.some((id) => id === linkId)) return "selected"
    if (hiddenLinks?.some((id) => id === linkId)) return "hidden"

    return stateType || "regular"
  }

  // ==================== 样式相关方法 ====================

  /**
   * 获取节点颜色配置
   */
  private getNodeColor = (nodeId: NodeId, globalScale: number): Style => {
    const node = this.model.getNodeById(nodeId)
    const { nodeType } = node?.data || {}

    const nodeStyle = getNodeStyleByType(this.style, nodeType)
    const state = this.getNodeState(node)
    const style = getNodeStyleByStateType(nodeStyle, state)

    const scale = globalScale + 5

    return {
      ...style,
      strokeWidth: (style.strokeWidth ?? DEFAULT_BORDER_WIDTH) / scale,
    }
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

    if (this.options.defaultNodeStyle) {
      this.style = getDefaultColorOf({
        container: this.container,
        defaultNodeStyle: this.options.defaultNodeStyle,
      })
    }

    if (this.options.style) {
      this.style = mergeObjects(this.style, this.options.style)
    }

    this.forceGraph
      .backgroundColor(this.style.background)
      .nodeCanvasObjectMode(() => "replace")
      .nodeCanvasObject(this.renderNode)
      .nodePointerAreaPaint(this.renderNodePointerArea)
      .linkCanvasObject(this.renderLink)
      .linkPointerAreaPaint(this.renderLinkPointerArea)
      .nodeLabel((node) => nodeLabel(node, this.options.debug))
      .linkLabel((link) => linkLabel(link, this.options.debug))
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
    if (!node?.data) return

    const style = this.getNodeColor(String(node.id), globalScale)

    // 获取渲染器
    const processor =
      this.nodeRenderProcessorMap[node.data.nodeType || "default"] ||
      this.nodeRenderProcessorMap["default"]

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

    const processor =
      this.nodeRenderProcessorMap[nodeType || "default"] ||
      this.nodeRenderProcessorMap["default"]

    processor?.renderNodePointerArea?.({
      node,
      indexColor: color,
      ctx,
      style,
      globalScale,
      colorTracker: this.colorTracker,
      tagManager: this.model.tagManager,
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
    const link = _link as GraphLink

    const start = link.source as NodeObject
    const end = link.target as NodeObject

    if (typeof start !== "object" || typeof end !== "object") return

    // 计算曲线偏移
    const linkCountMap = this.calculateLinkCurveInfo()
    const curveOffset = this.getLinkCurveOffset(link, linkCountMap)

    const targetNode = end as GraphNode
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
    const link = _link as GraphLink

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
    link: GraphLink,
    ctx: CanvasRenderingContext2D,
    globalScale: number,
    stroke: string,
    opacity?: number,
    curveOffset: number = 0
  ) {
    const { focusLinks } = this.model.getGraphModelData()

    const lineWidth = link.data?.lineWidth ?? DEFAULT_LINE_WIDTH
    const focusMultiplier = focusLinks?.some((id) => id === link.id)
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
    link: GraphLink,
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
    link: GraphLink,
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
    link: GraphLink,
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
  private getNodeRadius(node: GraphNode): number {
    if (!node?.data?.nodeType) {
      return this.forceGraph.nodeRelSize()
    }

    const style = this.getNodeColor(String(node.id), 1)

    const processor = this.nodeRenderProcessorMap[node.data.nodeType]
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
