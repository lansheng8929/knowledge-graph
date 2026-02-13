import type {
  DefaultGraphDataGenerics,
  GraphDataGenerics,
  GraphLink,
  GraphNode,
} from "./client"
import {
  type GraphViewStyle,
  type NodeStyle,
  type LinkStyle,
  getDefaultColorOf,
  getNodeStyleByType,
  getLinkStyleByType,
} from "./theme"
import { mergeObjects, type RecursivePartial } from "./client/utils"

/**
 * 动态样式管理器，优先级最高
 */
export class StyleManager<
  G extends GraphDataGenerics = DefaultGraphDataGenerics,
> {
  declare style: GraphViewStyle<G>
  private nodeInstanceStyles = new Map<string, Partial<NodeStyle<G>>>()
  private linkInstanceStyles = new Map<string, Partial<LinkStyle<G>>>()

  init({
    style,
    container,
  }: {
    style?: RecursivePartial<GraphViewStyle<G>>
    container: HTMLElement
  }) {
    if (style) {
      this.style = mergeObjects(this.style, style || {})
    } else {
      this.style = getDefaultColorOf<G>(container)
    }
  }

  update(style: RecursivePartial<GraphViewStyle<G>>) {
    this.style = mergeObjects(this.style, style)
  }

  setNodeStyle(nodeId: string, style: Partial<NodeStyle<G>>) {
    this.nodeInstanceStyles.set(nodeId, style)
  }

  setLinkStyle(linkId: string, style: Partial<LinkStyle<G>>) {
    this.linkInstanceStyles.set(linkId, style)
  }

  hasNodeStyle(nodeId: string): boolean {
    return this.nodeInstanceStyles.has(nodeId)
  }

  hasLinkStyle(linkId: string): boolean {
    return this.linkInstanceStyles.has(linkId)
  }

  getNodeStyle(
    node: GraphNode<G["NO"], G["NT"], G["NS"]> | undefined,
  ): NodeStyle<G> {
    if (!node) return {} as NodeStyle<G>

    const base = getNodeStyleByType(this.style, node.data?.nodeType)

    if (!this.hasNodeStyle(node.id)) return base

    const instanceStyle = this.nodeInstanceStyles.get(node.id)
    if (!instanceStyle) return base
    const merged = mergeObjects({}, base) as NodeStyle<G>
    return mergeObjects(merged, instanceStyle as RecursivePartial<NodeStyle<G>>)
  }

  getLinkStyle(link: GraphLink<G> | undefined): LinkStyle<G> {
    if (!link) return {} as LinkStyle<G>

    const base = getLinkStyleByType(this.style, link.data?.linkType)

    if (!this.hasLinkStyle(link.id)) return base

    const instanceStyle = this.linkInstanceStyles.get(link.id)
    if (!instanceStyle) return base
    const merged = mergeObjects({}, base) as LinkStyle<G>
    return mergeObjects(merged, instanceStyle as RecursivePartial<LinkStyle<G>>)
  }

  cleanNodeStyle(nodeId: string) {
    this.nodeInstanceStyles.delete(nodeId)
  }

  cleanLinkStyle(linkId: string) {
    this.linkInstanceStyles.delete(linkId)
  }

  getStyle(): GraphViewStyle<G> {
    return this.style
  }

  clear() {
    this.nodeInstanceStyles.clear()
    this.linkInstanceStyles.clear()
  }
}
