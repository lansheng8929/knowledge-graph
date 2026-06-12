import { Cosmograph, type CosmographConfig } from "@cosmograph/cosmograph"
import { ConnGraphModel } from "../model"
import type {
  DefaultGraphDataGenerics,
  GraphDataGenerics,
  GraphNode,
  GraphLink,
  GraphViewModel,
} from "./type"
import type { ConnGraphEvents } from "../events"

/**
 * Cosmograph GPU 渲染器选项
 */
export interface GpuRendererOptions<
  G extends GraphDataGenerics = DefaultGraphDataGenerics,
> {
  container: HTMLElement
  graphModel: ConnGraphModel<G>
  width?: number
  height?: number
  backgroundColor?: string
  arrowDisplay?: boolean
  debug?: boolean
  /** 额外的 Cosmograph 配置（会与自动生成的配置合并） */
  extraCosmographConfig?: Partial<CosmographConfig>
}

/**
 * 使用 @cosmograph/cosmograph (WebGL/GPU) 的图渲染器
 *
 * 替代默认的 Canvas 2D (force-graph) 渲染器，利用 GPU 加速渲染大量节点和边。
 */
export class CosmographRenderer<
  G extends GraphDataGenerics = DefaultGraphDataGenerics,
> {
  private cosmograph: Cosmograph | null = null
  private container: HTMLElement
  private model: ConnGraphModel<G>
  private events: ConnGraphEvents<G>
  private options: GpuRendererOptions<G>
  private pointsMap = new Map<string, number>() // nodeId -> cosmograph index
  private _initialized = false

  // === 连线标签 ===
  private linkLabels: Map<number, { text: string }> = new Map() // linkIndex -> label
  private _labelUpdateTimer: ReturnType<typeof setTimeout> | null = null
  private _pendingLabelUpdate = false

  constructor(opts: GpuRendererOptions<G>) {
    this.container = opts.container
    this.model = opts.graphModel
    this.events = this.model.events
    this.options = opts
  }

  get initialized() {
    return this._initialized
  }

  get instance() {
    return this.cosmograph
  }

  /**
   * 初始化 Cosmograph GPU 渲染器
   *
   * 注意：不使用 prepareCosmographData（需要 DuckDB WASM，首次加载慢且可能卡住），
   * 直接将原始数据传给 Cosmograph 构造函数。
   *
   * 数据清洗：Cosmograph 内部用 DuckDB 做统计（STDDEV_SAMP 等），
   * 只支持 string/number/boolean，需要过滤掉 object/array/undefined/null 等复杂值。
   */
  async init() {
    const { graphData } = this.model.getGraphModelData()

    if (graphData.nodes.length === 0) {
      console.warn("[CosmographRenderer] No nodes to render")
      return
    }

    console.log(
      `[CosmographRenderer] Starting GPU init with ${graphData.nodes.length} nodes, ${graphData.links.length} links`,
    )

    try {
      // 1. 提取节点 ID 并构建映射
      this.pointsMap.clear()
      graphData.nodes.forEach((node, i) => {
        this.pointsMap.set(node.id, i)
      })

      // 2. 转换并清洗数据：去掉所有非标量字段（object/array/null/undefined）
      const rawPoints: Record<string, unknown>[] = graphData.nodes.map(
        (node, i) => {
          const raw: Record<string, unknown> = {
            id: node.id,
            __index: i, // Cosmograph 需要数值索引做高效查找
          }
          if (node.data) {
            for (const [k, v] of Object.entries(node.data)) {
              if (isScalar(v)) raw[k] = v
            }
          }
          return raw
        },
      )

      const rawLinks: Record<string, unknown>[] = graphData.links
        .filter((link) => {
          const sid =
            typeof link.source === "object" ? link.source.id : link.source
          const tid =
            typeof link.target === "object" ? link.target.id : link.target
          return Boolean(sid) && Boolean(tid)
        })
        .map((link, li) => {
          const sid =
            typeof link.source === "object" ? link.source.id : link.source
          const tid =
            typeof link.target === "object" ? link.target.id : link.target
          const raw: Record<string, unknown> = {
            source: sid,
            target: tid,
            __sourceIdx: this.pointsMap.get(String(sid)),
            __targetIdx: this.pointsMap.get(String(tid)),
          }
          if (link.data) {
            for (const [k, v] of Object.entries(link.data)) {
              if (isScalar(v)) raw[k] = v
            }
          }
          // 收集连线标签
          const linkLabelText = link.data?.label || link.__rawLabel
          if (linkLabelText) {
            this.linkLabels.set(li, { text: String(linkLabelText) })
          }
          return raw
        })

      console.log(
        `[CosmographRenderer] Prepared ${rawPoints.length} points, ${rawLinks.length} links (filtered)`,
      )

      // 3. 直接构建配置（不经过 prepareCosmographData）
      const config: CosmographConfig = {
        // 核心数据
        points: rawPoints,
        links: rawLinks.length > 0 ? rawLinks : undefined,
        pointIdBy: "id",
        pointIndexBy: "__index",
        linkSourceBy: "source",
        linkTargetBy: "target",
        linkSourceIndexBy: "__sourceIdx",
        linkTargetIndexBy: "__targetIdx",
        pointIncludeColumns: ["*"],
        linkIncludeColumns: ["*"],

        // ============ 外观 ============
        backgroundColor: this.options.backgroundColor || "#f6f6f6",
        pointDefaultSize: 4,
        pointDefaultColor: "#b3b3b3",
        linkDefaultColor: "#999999",
        linkDefaultWidth: 1,
        linkDefaultArrows: this.options.arrowDisplay ?? false,

        // === 节点颜色策略（从数据的 "color" 字段取值） ===
        pointColorBy: "color",
        pointColorStrategy: "direct",

        // === 节点大小策略（从数据的 "size" 字段取值） ===
        pointSizeBy: "size",
        pointSizeStrategy: "direct",
        pointSizeRange: [2, 20],

        // === 节点标签 ===
        pointLabelBy: "label",
        showLabels: true,
        showHoveredPointLabel: true,
        showDynamicLabels: true,
        showTopLabels: false,
        pointLabelColor: "#333333",
        pointLabelFontSize: 13,
        labelMargin: 5,

        // === Hover 效果 ===
        renderHoveredPointRing: true,
        hoveredPointRingColor: "#ffffff",
        hoveredLinkColor: "#ff6b6b",
        hoveredLinkWidthIncrease: 3,
        hoveredPointCursor: "pointer",

        // === 缩放行为 ===
        scalePointsOnZoom: false,
        scaleLinksOnZoom: false,
        curvedLinks: false,

        // === 交互 ===
        enableDrag: true,
        enableZoom: true,
        fitViewOnInit: true,
        showFPSMonitor: this.options.debug ?? false,
        disableLogging: !this.options.debug,

        // ============ 事件映射 ============

        onPointClick: (index) => {
          const node = this.findNodeByIndex(index)
          if (!node) return
          this.model.stateManager.setSelectedNodes([node.id])
          this.events.publish("nodeClick", node)
        },

        onBackgroundClick: () => {
          this.model.stateManager.clearSelection()
          this.events.publish("backgroundClick", undefined)
        },

        onPointContextMenu: (index, pointPosition, event) => {
          const node = this.findNodeByIndex(index)
          if (!node?.data?.nodeType) return
          this.events.publish("nodeRightClick", {
            node,
            screenPos: { x: pointPosition[0], y: pointPosition[1] },
            event,
          })
        },

        onLinkClick: (linkIndex) => {
          const link = this.findLinkByIndex(linkIndex)
          if (!link) return
          this.events.publish("linkClick", link)
        },

        onPointMouseOver: (index) => {
          const node = this.findNodeByIndex(index)
          if (!node) return
          this.model.stateManager.setHoveredNodes([node.id])
          this.events.publish("nodeHover", node)
        },

        onPointMouseOut: () => {
          this.model.stateManager.clearHoveredNodes()
          this.events.publish("nodeHover", null)
        },

        onLinkMouseOver: (linkIndex) => {
          const link = this.findLinkByIndex(linkIndex)
          if (!link) return
          this.model.stateManager.setHoveredLinks([link.id])
          this.events.publish("linkHover", { link, previousLink: null })
        },

        onLinkMouseOut: () => {
          this.model.stateManager.clearHoveredLinks()
          this.events.publish("linkHover", {
            link: null,
            previousLink: null,
          })
        },

        onZoom: (e) => {
          this.events.publish("zoom", {
            k: e.transform.k,
            x: e.transform.x,
            y: e.transform.y,
          })
        },

        // 每帧更新连线标签位置
        onSimulationTick: () => {
          this._updateLinkLabelPositions()
        },
      }

      // 合并用户额外配置
      if (this.options.extraCosmographConfig) {
        Object.assign(config, this.options.extraCosmographConfig)
      }

      // 4. 创建 Cosmograph 实例
      console.log("[CosmographRenderer] Creating Cosmograph instance...")
      this.cosmograph = new Cosmograph(this.container, config)
      this._initialized = true

      // 5. 如果有连线标签，首次刷新位置
      if (this.linkLabels.size > 0) {
        setTimeout(() => this._flushLinkLabels(), 500)
      }

      console.log("[CosmographRenderer] ✅ GPU renderer initialized")
    } catch (err) {
      console.error("[CosmographRenderer] ❌ Init failed:", err)
      this._initialized = false
      throw err
    }
  }

  /**
   * 更新数据
   */
  async updateData(graphViewModel: Partial<GraphViewModel<G>>) {
    if (!this.cosmograph || !this._initialized) return

    if (graphViewModel.graphData) {
      // 对于全量更新，重新初始化
      await this.destroy()
      await this.init()
    }
  }

  /**
   * 更新节点位置
   */
  updateNodePositions() {
    if (!this.cosmograph) return
    const { graphData } = this.model.getGraphModelData()

    graphData.nodes.forEach((node) => {
      const idx = this.pointsMap.get(node.id)
      if (idx !== undefined && node.x !== undefined && node.y !== undefined) {
        // Cosmograph 目前不直接支持设置单个点位置，这里通过 pinned 实现
        this.cosmograph?.setPinnedPoints([idx])
      }
    })
  }

  /**
   * 聚焦到某个节点
   */
  focusNode(nodeId: string) {
    if (!this.cosmograph) return
    const idx = this.pointsMap.get(nodeId)
    if (idx !== undefined) {
      this.cosmograph.setFocusedPoint(idx)
      this.cosmograph.zoomToPoint(idx, 500)
    }
  }

  /**
   * 自适应视图
   */
  fitView(duration?: number, padding?: number) {
    this.cosmograph?.fitView(duration, padding)
  }

  // ==================== 连线标签 ====================

  /**
   * 设置/更新连线标签
   * @param labels linkIndex -> 标签文字的映射
   */
  setLinkLabels(labels: Map<number, string>) {
    this.linkLabels.clear()
    for (const [idx, text] of labels) {
      this.linkLabels.set(idx, { text })
    }
    this._scheduleLabelFlush()
  }

  /**
   * 清除所有连线标签
   */
  clearLinkLabels() {
    this.linkLabels.clear()
    this.cosmograph?.setConfig({ customLabels: [] })
  }

  /**
   * 定时刷新连线标签位置（节流到 ~200ms）
   */
  private _scheduleLabelFlush() {
    if (this._labelUpdateTimer) return
    this._labelUpdateTimer = setTimeout(() => {
      this._labelUpdateTimer = null
      this._flushLinkLabels()
    }, 200)
  }

  /**
   * 将 linkLabels 刷新到 Cosmograph customLabels
   */
  private _flushLinkLabels() {
    if (!this.cosmograph || this.linkLabels.size === 0) return

    const positions = this.cosmograph.getPointPositions()
    if (!positions) return

    const customLabels: Array<{
      text: string
      x: number
      y: number
      weight: number
      className?: string
    }> = []

    const { graphData } = this.model.getGraphModelData()

    for (const [li, label] of this.linkLabels) {
      const link = graphData.links[li]
      if (!link) continue

      const sid = typeof link.source === "object" ? link.source.id : link.source
      const tid = typeof link.target === "object" ? link.target.id : link.target

      const si = this.pointsMap.get(String(sid))
      const ti = this.pointsMap.get(String(tid))
      if (si === undefined || ti === undefined) continue

      const sx = positions[si * 2]
      const sy = positions[si * 2 + 1]
      const tx = positions[ti * 2]
      const ty = positions[ti * 2 + 1]
      if (
        sx === undefined ||
        sy === undefined ||
        tx === undefined ||
        ty === undefined
      )
        continue

      customLabels.push({
        text: label.text,
        x: (sx + tx) / 2,
        y: (sy + ty) / 2,
        weight: 0.5,
        className:
          "background: rgba(255,255,255,0.85); padding: 2px 6px; border-radius: 3px; font-size: 11px; color: #666;",
      })
    }

    if (customLabels.length > 0) {
      this.cosmograph.setConfig({ customLabels })
    }
  }

  /**
   * 每帧由 onSimulationTick 调用，标记需要刷新标签
   */
  private _updateLinkLabelPositions() {
    if (this.linkLabels.size === 0) return
    // 节流：标记待刷新，由定时器批量处理
    if (!this._pendingLabelUpdate) {
      this._pendingLabelUpdate = true
      queueMicrotask(() => {
        this._pendingLabelUpdate = false
        this._scheduleLabelFlush()
      })
    }
  }

  /**
   * 销毁
   */
  async destroy() {
    if (this.cosmograph) {
      await this.cosmograph.destroy()
      this.cosmograph = null
    }
    this._initialized = false
    this.pointsMap.clear()
  }

  // ==================== 工具方法 ====================

  private findNodeByIndex(
    index: number,
  ): GraphNode<G["NO"], G["NT"], G["NS"]> | null {
    const { graphData } = this.model.getGraphModelData()
    // 通过 pointsMap 反向查找
    for (const [id, idx] of this.pointsMap) {
      if (idx === index) {
        return this.model.getNodeById(id)
      }
    }
    return null
  }

  private findLinkByIndex(index: number): GraphLink<G> | null {
    const { graphData } = this.model.getGraphModelData()
    return graphData.links[index] || null
  }
}

// ==================== 数据清洗工具 ====================

/**
 * 判断一个值是否为 DuckDB 兼容的标量类型
 * Cosmograph 内部用 DuckDB 做聚合统计（STDDEV_SAMP 等），
 * 只支持 string / number / boolean，复杂对象会导致 "Out of Range" 错误。
 */
function isScalar(v: unknown): v is string | number | boolean {
  const t = typeof v
  if (t === "string" || t === "number" || t === "boolean") return true
  return false
}
