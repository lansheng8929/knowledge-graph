import { ConnGraphEvents } from "./client/events"
import type { GraphViewModel, LinkId, NodeId } from "./type"
import { TagManager } from "./tag-manager"
import { LoadingManager } from "./loading-manager"

export interface Options {
  initData: GraphViewModel
}

type ModelComputedCache = GraphViewModel

export class ConnGraphModel {
  protected cache!: ModelComputedCache
  public events = new ConnGraphEvents()
  public tagManager = new TagManager(this.events)
  public loadingManager = new LoadingManager(this.events)

  constructor({ initData }: Options) {
    this.cache = initData
  }

  updateCache({
    graphData,
    focusNodes,
    focusLinks,
    selectedNodes,
    selectedLinks,
    hiddenNodes,
    hiddenLinks,
  }: GraphViewModel) {
    this.cache.graphData = graphData

    if (focusNodes) {
      this.updeteFoucsNodes(focusNodes || [])
    }

    if (selectedNodes) {
      this.updateSelectedNodes(selectedNodes || [], selectedLinks || [])
    }

    if (hiddenNodes) {
      this.updateHiddenNodes(hiddenNodes || [])
    }

    this.events.publish("dataChange", {
      cache: this.cache,
    })
  }

  updeteFoucsNodes(nodeIds: NodeId[]) {
    const nodes: NodeId[] = [...nodeIds]
    const links: LinkId[] = []

    nodeIds.forEach((nodeId) => {
      const node = this.getNodeById(nodeId)
      if (!node) return

      this.cache.graphData.links.forEach((link) => {
        const source = link.source.id || link.source
        const target = link.target.id || link.target

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
          const source = link.source.id || link.source
          const target = link.target.id || link.target

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
