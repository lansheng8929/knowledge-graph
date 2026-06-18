import type { GraphDataGenerics } from "./type"
import type { LinkCreator, LinkRenderer, LinkRendererMap } from "./link-types"

/**
 * 边注册表（LinkRegistry）
 *
 * 镜像 EntityRegistry 的模式，用于注册和管理所有边类型的渲染器。
 * 每种 LinkType 可以注册自己的 LinkRenderer（渲染、指针区域、宽度计算等）。
 *
 * @example
 * ```ts
 * const registry = new LinkRegistry<MyGenerics>()
 * registry.register("default", () => ({
 *   renderLinkCanvasObject: ({ ctx, style, startX, startY, endX, endY }) => {
 *     ctx.strokeStyle = style.color ?? '#999'
 *     ctx.beginPath()
 *     ctx.moveTo(startX, startY)
 *     ctx.lineTo(endX, endY)
 *     ctx.stroke()
 *   }
 * }))
 * ```
 */
export class LinkRegistry<G extends GraphDataGenerics = any> {
  private registry: LinkRendererMap<G> = {}

  /** 注册单条边类型 */
  register(linkType: G["LT"], creator: LinkCreator<G>): void {
    this.registry[linkType] = creator()
  }

  /** 批量注册边类型 */
  registerBatch(creators: Record<string, LinkCreator<G>>): void {
    for (const [type, creator] of Object.entries(creators)) {
      this.registry[type as G["LT"]] = creator()
    }
  }

  /** 获取指定类型的边渲染器 */
  get(linkType: G["LT"]): LinkRenderer<G> | undefined {
    return this.registry[linkType]
  }

  /** 获取所有已注册的边渲染器 */
  getAll(): LinkRendererMap<G> {
    return { ...this.registry }
  }

  /** 是否存在 */
  has(linkType: G["LT"]): boolean {
    return linkType in this.registry
  }

  /** 注销 */
  unregister(linkType: G["LT"]): void {
    delete this.registry[linkType]
  }

  /** 清空 */
  clear(): void {
    this.registry = {}
  }
}
