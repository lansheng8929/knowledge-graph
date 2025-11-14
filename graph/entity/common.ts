import type {
  EntityCommonRenderer,
  EntityCreator,
  EntityRenderer,
  GraphNode,
  Style,
} from ".."
import { DEFAULT_FONT_SIZE, DEFAULT_RADIUS } from "../client"
import { makeDrawWrapper } from "../client/utils"
import type { LoadingManager } from "../loading-manager"
import type { TagManager } from "../tag-manager"

export const createEntity = (entityCreator: EntityCreator): EntityRenderer => {
  const entityInstance = entityCreator()

  return {
    renderNodeCanvasObject(props) {
      entityCommonRenderer.beforeRenderNodeCanvasObject?.(props)
      entityInstance.renderNodeCanvasObject(props)
      entityCommonRenderer.afterRenderNodeCanvasObject?.(props)
    },
    renderNodePointerArea(props) {
      entityInstance.renderNodePointerArea(props)
    },
    renderNodeTools(props) {
      entityInstance.renderNodeTools?.(props)
    },
    registerNodeToolsEvents(props) {
      entityInstance.registerNodeToolsEvents?.(props)
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
  }: {
    node: GraphNode
    ctx: CanvasRenderingContext2D
    globalScale: number
    style: Style
  }) => {
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
    tagManager,
    loadingManager,
  }: {
    node: GraphNode
    ctx: CanvasRenderingContext2D
    globalScale: number
    style: Style
    tagManager: TagManager
    loadingManager: LoadingManager
  }) => {
    const { x = 0, y = 0 } = node
    const {} = node.data || {}
    const {
      radius = DEFAULT_RADIUS,
      fontSize = DEFAULT_FONT_SIZE,
      opacity,
      tagColor,
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
}
