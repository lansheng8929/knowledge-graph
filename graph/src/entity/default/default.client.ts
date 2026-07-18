import {
  makeDrawWrapper,
  DEFAULT_FONT_SIZE,
  DEFAULT_RADIUS,
  DEFAULT_BG_COLOR,
  DEFAULT_TEXT_COLOR,
  DEFAULT_NODE_LABEL_SCALE_THRESHOLD,
  type DefaultGraphDataGenerics,
} from "../../client/"
import { getPaginator } from "../../utils"
import type { EntityCreator } from "../../client/entity-types"

import type { DefaultNodeType } from "./default.type"

export const createDefaultEntity: EntityCreator<
  DefaultGraphDataGenerics
> = () => {
  const imageCache = new Map<string, HTMLImageElement>()

  return {
    renderNodeCanvasObject: ({ node, ctx, globalScale, style }) => {
      const { x = 0, y = 0 } = node
      const { label, count, total, icon } =
        (node.data as DefaultNodeType["data"]) ?? {}

      const {
        radius = DEFAULT_RADIUS,
        fontSize = DEFAULT_FONT_SIZE,
        bgColor = DEFAULT_BG_COLOR,
        textColor = DEFAULT_TEXT_COLOR,
        opacity = 1,
        strokeColor,
        strokeWidth,
        light,
      } = style

      makeDrawWrapper(ctx)
        .circle(x, y, radius, bgColor, opacity)
        .stroke(x, y, radius, strokeColor, strokeWidth, opacity)

      if (icon) {
        const iconPath = icon

        makeDrawWrapper(ctx).drawImg(
          imageCache,
          iconPath,
          x,
          y,
          radius,
          radius,
          opacity,
        )
      }

      if (globalScale > DEFAULT_NODE_LABEL_SCALE_THRESHOLD) {
        const paginator = getPaginator(count, total)

        makeDrawWrapper(ctx).text(
          `${label}${paginator}`,
          x,
          y + radius + fontSize,
          fontSize,
          textColor,
          opacity,
        )
      }
    },

    renderNodePointerArea: ({ node, indexColor, ctx, style }) => {
      const { x = 0, y = 0 } = node
      const { strokeColor, strokeWidth, radius = DEFAULT_RADIUS } = style
      makeDrawWrapper(ctx)
        .stroke(x, y, radius, strokeColor, strokeWidth)
        .circle(x, y, radius, indexColor)
    },

    getCollisionRadius: ({ node, style }) => {
      const { radius = DEFAULT_RADIUS } = style
      return radius
    },
  }
}
