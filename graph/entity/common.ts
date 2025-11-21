import {
  DEFAULT_FONT_SIZE,
  DEFAULT_RADIUS,
  DEFAULT_TEXT_COLOR,
} from "../client/constants"
import { makeDrawWrapper } from "../client/utils"
import type { EntityCreator, EntityRenderer } from "./entity-types"

export const createEntity = (entityCreator: EntityCreator): EntityRenderer => {
  const entityInstance = entityCreator()

  return {
    renderNodeCanvasObject(props) {
      entityCommonRenderer.beforeRenderNodeCanvasObject?.(props)
      entityInstance.renderNodeCanvasObject(props)
      entityCommonRenderer.afterRenderNodeCanvasObject?.(props)
      entityCommonRenderer.renderNodeTools?.(props)
    },
    renderNodePointerArea(props) {
      entityInstance.renderNodePointerArea(props)
      entityCommonRenderer.renderNodePointerArea?.(props)
    },
    renderNodeToolsPointerArea(props) {
      entityInstance.renderNodeToolsPointerArea?.(props)
      entityCommonRenderer.renderNodeToolsPointerArea?.(props)
    },
    getCollisionRadius(props) {
      return entityInstance.getCollisionRadius(props)
    },
  }
}

export const entityCommonRenderer = {
  beforeRenderNodeCanvasObject: ({
    node,
    style,
    ctx,
  }: Parameters<EntityRenderer["renderNodeCanvasObject"]>[0]) => {
    const { x = 0, y = 0 } = node
    const {} = node.data || {}
    const { light, opacity } = style

    // 渲染光晕
    if (light) {
      makeDrawWrapper(ctx).circle(x, y, 5, light)
    }
  },
  afterRenderNodeCanvasObject: ({
    node,
    style,
    ctx,
    globalScale,
    tagManager,
    loadingManager,
  }: Parameters<EntityRenderer["renderNodeCanvasObject"]>[0]) => {
    const { x = 0, y = 0 } = node
    const { count = 0 } = node.data || {}
    const {
      radius = DEFAULT_RADIUS,
      fontSize = DEFAULT_FONT_SIZE,
      opacity,
      tagColor,
      textColor = DEFAULT_TEXT_COLOR,
    } = style

    const loading = loadingManager.getVisibleLoadingState(node.id)

    // 渲染加载状态
    if (loading) {
      makeDrawWrapper(ctx).spinner(x, y, opacity)
    }

    // 渲染标签
    const tags = tagManager.getVisibleTags(node.id)

    if (tags) {
      makeDrawWrapper(ctx).textWrap(
        tags.map((tag) => tag.label).join(", "),
        x,
        y + radius + 10,
        fontSize,
        tagColor || "#000",
        opacity,
        30
      )
    }
  },
  renderNodeTools: ({
    node,
    ctx,
    style,
    globalScale,
  }: Parameters<EntityRenderer["renderNodeCanvasObject"]>[0]) => {
    const { x = 0, y = 0 } = node
    const { count = 0 } = node.data || {}
    const { radius = DEFAULT_RADIUS, textColor = DEFAULT_TEXT_COLOR } = style

    if (count > 1) {
      makeDrawWrapper(ctx).drawPlusTool(textColor, x, y, radius, globalScale)
    }
  },
  renderNodePointerArea: ({}: Parameters<
    EntityRenderer["renderNodePointerArea"]
  >[0]) => {
    // 节点自身的指针区域由各实体的 renderNodePointerArea 处理
  },
  renderNodeToolsPointerArea: ({
    node,
    indexColor,
    ctx,
    style,
    globalScale,
    colorTracker,
    shadowCtx,
  }: Parameters<
    NonNullable<EntityRenderer["renderNodeToolsPointerArea"]>
  >[0]) => {
    const { x = 0, y = 0 } = node
    const { count = 0, pageIndex, pageSize } = node.data || {}
    const { radius = DEFAULT_RADIUS } = style
    console.log("(pageIndex + 1) * pageSize ", (pageIndex + 1) * pageSize)

    const canLoadMore =
      pageSize !== undefined && pageIndex !== undefined && pageIndex !== -1
        ? (pageIndex + 1) * pageSize < count
        : true

    if (indexColor && shadowCtx && count > 1 && canLoadMore) {
      makeDrawWrapper(shadowCtx!).drawPlusToolArea(
        indexColor,
        x,
        y,
        radius,
        globalScale
      )
    }
  },
}
