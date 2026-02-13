import { ConnGraphEvents } from "./events"
import type {
  LinkId,
  LinkState,
  LinkType,
  NodeId,
  NodeState,
  NodeType,
} from "./type"
import { TagManager } from "./tag-manager"
import { LoadingManager } from "./loading-manager"
import { StateManager } from "./state-manager"
import ColorTracker from "canvas-color-tracker"
import type {
  DefaultGraphDataGenerics,
  GraphDataGenerics,
  GraphViewModel,
  GraphViewModelGraphData,
  StateConfig,
} from "./client/type"
import { StyleManager } from "./style-manager"

export interface Options<
  G extends GraphDataGenerics = DefaultGraphDataGenerics,
> {
  initData: GraphViewModel<G>
}

type ModelComputedCache<
  G extends GraphDataGenerics = DefaultGraphDataGenerics,
> = GraphViewModel<G>

export class ConnGraphModel<
  G extends GraphDataGenerics = DefaultGraphDataGenerics,
> {
  protected cache!: ModelComputedCache<G>
  public events = new ConnGraphEvents<G>()
  public tagManager = new TagManager(this.events)
  public loadingManager = new LoadingManager(this.events)
  public stateManager = new StateManager<G>(this.events)
  public styleManager = new StyleManager<G>()
  public colorTracker = new ColorTracker()

  constructor({ initData }: Options<G>) {
    this.cache = {
      graphData: { nodes: [], links: [] },
    }

    this.updateGraphData({
      graphData: initData.graphData,
    })
  }

  updateGraphData({ graphData }: GraphViewModelGraphData<G>) {
    graphData.nodes.forEach((node) => {
      const indexColor = this.colorTracker.register({
        type: "PlusTool",
        d: node,
      })
      if (!indexColor) return

      node.__toolIndexColor = indexColor
    })

    this.cache.graphData = graphData

    this.events.publish("dataChange", {
      graphData: this.cache.graphData,
    })
  }

  /**
   * 更新元数据（焦点、选中、隐藏状态）
   * @deprecated 请使用 stateManager 代替
   */
  updateMetaData(config: StateConfig) {
    this.stateManager.updateState(config)
  }

  /**
   * 更新焦点节点，自动关联相关连线和目标节点
   * @deprecated 请使用 stateManager.setFocusNodes 代替
   */
  updeteFoucsNodes(nodeIds: NodeId[]) {
    const nodes: NodeId[] = [...nodeIds]
    const links: LinkId[] = []

    nodeIds.forEach((nodeId) => {
      const node = this.getNodeById(nodeId)
      if (!node) return

      this.cache.graphData.links.forEach((link) => {
        const source =
          typeof link.source === "object" ? link.source.id : link.source
        const target =
          typeof link.target === "object" ? link.target.id : link.target

        if (source === node.id || target === node.id) {
          links.push(link.id)
        }
        if (source === node.id && target) {
          nodes.push(String(target))
        }
      })
    })

    this.stateManager.setFocusNodes([...new Set(nodes)], [...new Set(links)])
  }

  /**
   * 更新选中节点，自动关联相关连线和目标节点
   * @deprecated 请使用 stateManager.setSelectedNodes 代替
   */
  updateSelectedNodes(nodeIds: NodeId[], linkIds?: LinkId[]) {
    const nodes: NodeId[] = [...nodeIds]
    const links: LinkId[] = []

    if (!linkIds) {
      nodeIds.forEach((nodeId) => {
        const node = this.getNodeById(nodeId)
        if (!node) return

        this.cache.graphData.links.forEach((link) => {
          const source =
            typeof link.source === "object" ? link.source.id : link.source
          const target =
            typeof link.target === "object" ? link.target.id : link.target

          if (source === node.id || target === node.id) {
            links.push(link.id)
          }
          if (source === node.id && target) {
            nodes.push(String(target))
          }
        })
      })
    } else {
      links.push(...linkIds)
    }

    this.stateManager.setSelectedNodes([...new Set(nodes)], [...new Set(links)])
  }

  /**
   * 更新隐藏节点
   * @deprecated 请使用 stateManager.setHiddenNodes 代替
   */
  /**
   * 更新隐藏节点
   * @deprecated 请使用 stateManager.setHiddenNodes 代替
   */
  updateHiddenNodes(nodeIds: NodeId[]) {
    this.stateManager.setHiddenNodes(nodeIds)
  }

  getGraphModelData() {
    return {
      ...this.cache,
      ...this.stateManager.getState(),
    }
  }

  getLinkById(id: LinkId | null | undefined) {
    if (!id) return null
    return this.cache.graphData.links.find((link) => link.id === id) || null
  }

  getNodeById(id: NodeId | null | undefined) {
    if (!id) return null
    return this.cache.graphData.nodes.find((node) => node.id === id) || null
  }
}
