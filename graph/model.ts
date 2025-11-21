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
import ColorTracker from "canvas-color-tracker"
import type {
  DefaultGraphDataGenerics,
  GraphDataGenerics,
  GraphViewModel,
  GraphViewModelGraphData,
  GraphViewModelMetaData,
} from "./client/type"

export interface Options<
  G extends GraphDataGenerics = DefaultGraphDataGenerics
> {
  initData: GraphViewModel<G>
}

type ModelComputedCache<
  G extends GraphDataGenerics = DefaultGraphDataGenerics
> = GraphViewModel<G>

export class ConnGraphModel<
  G extends GraphDataGenerics = DefaultGraphDataGenerics
> {
  protected cache!: ModelComputedCache<G>
  public events = new ConnGraphEvents<G>()
  public tagManager = new TagManager(this.events)
  public loadingManager = new LoadingManager(this.events)
  public colorTracker: ColorTracker

  constructor({ initData }: Options<G>) {
    this.cache = {
      graphData: { nodes: [], links: [] },
    }
    this.colorTracker = new ColorTracker()

    this.updateGraphData({
      graphData: initData.graphData,
    })

    this.updateMetaData({
      focusNodes: initData.focusNodes,
      focusLinks: initData.focusLinks,
      selectedNodes: initData.selectedNodes,
      selectedLinks: initData.selectedLinks,
      hiddenNodes: initData.hiddenNodes,
      hiddenLinks: initData.hiddenLinks,
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

  updateMetaData({
    focusNodes,
    focusLinks,
    selectedNodes,
    selectedLinks,
    hiddenNodes,
    hiddenLinks,
  }: GraphViewModelMetaData) {
    if (focusNodes) {
      this.updeteFoucsNodes(focusNodes || [])
    }

    if (selectedNodes) {
      this.updateSelectedNodes(selectedNodes || [], selectedLinks || [])
    }

    if (hiddenNodes) {
      this.updateHiddenNodes(hiddenNodes || [])
    }

    this.events.publish("metaDataChange", {
      metaData: {
        focusNodes: this.cache.focusNodes,
        focusLinks: this.cache.focusLinks,
        selectedNodes: this.cache.selectedNodes,
        selectedLinks: this.cache.selectedLinks,
        hiddenNodes: this.cache.hiddenNodes,
        hiddenLinks: this.cache.hiddenLinks,
      },
    })
  }

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

    this.cache.focusNodes = [...new Set(nodes)]
    this.cache.focusLinks = [...new Set(links)]

    // 发布焦点变化事件
    this.events.publish("focusChange", { nodeIds: nodes, linkIds: links })
  }

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

    this.cache.selectedNodes = [...new Set(nodes)]
    this.cache.selectedLinks = [...new Set(links)]

    // 发布选择变化事件
    this.events.publish("selectionChange", { nodeIds: nodes, linkIds: links })
  }

  updateHiddenNodes(nodeIds: NodeId[]) {
    const nodes: NodeId[] = [...nodeIds]
    const links: LinkId[] = []

    this.cache.hiddenNodes = [...new Set(nodes)]
    this.cache.hiddenLinks = [...new Set(links)]

    // 发布隐藏状态变化事件
    this.events.publish("hiddenChange", { nodeIds: nodes, linkIds: links })
  }

  getGraphModelData() {
    return this.cache
  }

  getLinkById(id: LinkId) {
    return this.cache.graphData.links.find((link) => link.id === id)
  }

  getNodeById(id: NodeId) {
    return this.cache.graphData.nodes.find((node) => node.id === id)
  }
}
