import type { EntityCommonRenderer, EntityCreator, EntityRenderer } from ".."
import { makeDrawWrapper } from "../client/utils"

export const createEntity = (entityCreator: EntityCreator): EntityRenderer => {
  return {
    renderNodeCanvasObject(node, ctx, globalScale, style) {
      entityCommonRenderer.beforeRenderNodeCanvasObject?.(
        node,
        ctx,
        globalScale,
        style
      )
      entityCreator().renderNodeCanvasObject(node, ctx, globalScale, style)
      entityCommonRenderer.afterRenderNodeCanvasObject?.(
        node,
        ctx,
        globalScale,
        style
      )
    },
    renderNodePointerArea(node, color, ctx, style) {
      entityCreator().renderNodePointerArea(node, color, ctx, style)
    },
    renderNodeTools(node, ctx, globalScale) {
      entityCreator().renderNodeTools?.(node, ctx, globalScale)
    },
    registerNodeToolsEvents(events, node, mousePosition) {
      entityCreator().registerNodeToolsEvents?.(events, node, mousePosition)
    },
    getCollisionRadius(node, style) {
      return entityCreator().getCollisionRadius(node, style)
    },
  }
}

export const entityCommonRenderer = {
  beforeRenderNodeCanvasObject: (node, ctx, globalScale, style) => {
    const { x = 0, y = 0 } = node
    const { loading } = node.data || {}
    const { light, opacity } = style

    // 渲染光晕
    if (light) {
      makeDrawWrapper(ctx).circle(x, y, 5, light)
    }
  },
  afterRenderNodeCanvasObject: (node, ctx, globalScale, style) => {
    const { x = 0, y = 0 } = node
    const { loading } = node.data || {}
    const { light, opacity } = style

    // 渲染加载状态
    if (loading) {
      makeDrawWrapper(ctx).spinner(x, y, opacity)
    }
  },
}
