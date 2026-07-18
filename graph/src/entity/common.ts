import type { DefaultGraphDataGenerics } from "../client"
import {
  DEFAULT_FONT_SIZE,
  DEFAULT_RADIUS,
  DEFAULT_TEXT_COLOR,
} from "../client/constants"
import { makeDrawWrapper } from "../client/utils"
import type { EntityCreator, EntityRenderer } from "../client/entity-types"

export const createEntity = (
  entityCreator: EntityCreator<DefaultGraphDataGenerics>,
): EntityRenderer<DefaultGraphDataGenerics> => {
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
  }: Parameters<
    EntityRenderer<DefaultGraphDataGenerics>["renderNodeCanvasObject"]
  >[0]) => {
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
  }: Parameters<
    EntityRenderer<DefaultGraphDataGenerics>["renderNodeCanvasObject"]
  >[0]) => {
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
    const tags = tagManager.getVisibleTags(node.id, "node")

    if (tags) {
      makeDrawWrapper(ctx).textWrap(
        tags.map((tag) => tag.label).join(", "),
        x,
        y + radius + 10,
        fontSize,
        tagColor || "#000",
        opacity,
        30,
      )
    }
  },
  renderNodeTools: ({
    node,
    ctx,
    style,
    globalScale,
  }: Parameters<
    EntityRenderer<DefaultGraphDataGenerics>["renderNodeCanvasObject"]
  >[0]) => {
    const { x = 0, y = 0 } = node
    const { total, count } = node.data || {}
    const { radius = DEFAULT_RADIUS, textColor = DEFAULT_TEXT_COLOR } = style

    const canLoadMore =
      total !== undefined && count !== undefined && count < total

    if (canLoadMore) {
      makeDrawWrapper(ctx).drawPlusTool(textColor, x, y, radius, globalScale)
    }
  },
  renderNodePointerArea: ({}: Parameters<
    EntityRenderer<DefaultGraphDataGenerics>["renderNodePointerArea"]
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
    NonNullable<
      EntityRenderer<DefaultGraphDataGenerics>["renderNodeToolsPointerArea"]
    >
  >[0]) => {
    const { x = 0, y = 0 } = node
    const { total, count } = node.data || {}
    const { radius = DEFAULT_RADIUS } = style

    const canLoadMore =
      total !== undefined && count !== undefined && count < total

    if (indexColor && canLoadMore) {
      makeDrawWrapper(shadowCtx!).drawPlusToolArea(
        indexColor,
        x,
        y,
        radius,
        globalScale,
      )
    }
  },
}
