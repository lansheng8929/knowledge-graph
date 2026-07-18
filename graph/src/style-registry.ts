/**
 * 样式注册器（StyleRegistry）
 *
 * 用于注册和管理节点样式 + 边样式，并生成最终的 GraphViewStyle。
 * 是对现有 StyleManager 的增强版，支持边样式注册。
 */
import type { DefaultGraphDataGenerics, GraphDataGenerics } from "./client/type"
import type {
  GraphViewStyle as LibGraphViewStyle,
  NodeStyle,
  LinkStyle,
} from "./theme"

export type { NodeStyle, LinkStyle }
export type StyleRegistryStyle<
  G extends GraphDataGenerics = DefaultGraphDataGenerics,
> = Partial<LibGraphViewStyle<G>>

/**
 * 样式注册器类
 */
export class StyleRegistry<
  G extends GraphDataGenerics = DefaultGraphDataGenerics,
> {
  private nodeStyles: Partial<Record<G["NT"], NodeStyle<G>>> = {}
  private linkStyles: Partial<Record<G["LT"], LinkStyle<G>>> = {}
  private otherStyles: Omit<StyleRegistryStyle<G>, "node" | "link"> = {}

  /** 注册其他全局样式 */
  registerOtherStyle(style: StyleRegistryStyle<G>): this {
    Object.assign(this.otherStyles, style)
    return this
  }

  /** 注册单个节点样式 */
  registerNodeStyle(type: G["NT"], style: NodeStyle<G>): this {
    this.nodeStyles[type] = { ...style }
    return this
  }

  /** 批量注册节点样式 */
  registerNodeStyles(styles: Partial<Record<G["NT"], NodeStyle<G>>>): this {
    Object.assign(this.nodeStyles, styles)
    return this
  }

  /** 注册单个边样式 */
  registerLinkStyle(type: G["LT"], style: LinkStyle<G>): this {
    this.linkStyles[type] = { ...style }
    return this
  }

  /** 批量注册边样式 */
  registerLinkStyles(styles: Partial<Record<G["LT"], LinkStyle<G>>>): this {
    Object.assign(this.linkStyles, styles)
    return this
  }

  /** 获取节点样式 */
  getNodeStyle(type: G["NT"]): NodeStyle<G> | undefined {
    return this.nodeStyles[type]
  }

  /** 获取边样式 */
  getLinkStyle(type: G["LT"]): LinkStyle<G> | undefined {
    return this.linkStyles[type]
  }

  /** 构建最终的样式 */
  build(): StyleRegistryStyle<G> {
    return {
      ...this.otherStyles,
      node: { ...this.nodeStyles } as unknown as Partial<
        Record<G["NT"], NodeStyle<G>>
      >,
      link: { ...this.linkStyles } as unknown as Partial<
        Record<G["LT"], LinkStyle<G>>
      >,
    }
  }

  /** 清空所有注册 */
  clear(): this {
    this.nodeStyles = {}
    this.linkStyles = {}
    this.otherStyles = {}
    return this
  }
}
