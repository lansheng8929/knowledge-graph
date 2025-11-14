import {
  makeDrawWrapper,
  DEFAULT_FONT_SIZE,
  DEFAULT_RADIUS,
  DEFAULT_BG_COLOR,
  DEFAULT_TEXT_COLOR,
  DEFAULT_NODE_LABEL_SCALE_THRESHOLD,
} from "../../client/"
import type { EntityCreator } from "../entity-types"

import type { PaginatorNodeType } from "./paginator.type"

export const createPaginatorEntity: EntityCreator = () => {
  const imageCache = new Map<string, HTMLImageElement>()

  return {
    renderNodeCanvasObject: ({ node, ctx, globalScale, style }) => {
      const { x = 0, y = 0 } = node
      const {
        pageIndex = 0,
        pageSize = 10,
        total = 0,
      } = (node.data as PaginatorNodeType["data"]) ?? {}

      const iconPath = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNpcmNsZS1wbHVzLWljb24gbHVjaWRlLWNpcmNsZS1wbHVzIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIvPjxwYXRoIGQ9Ik04IDEyaDgiLz48cGF0aCBkPSJNMTIgOHY4Ii8+PC9zdmc+`

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

      if (light) {
        makeDrawWrapper(ctx).circle(x, y, radius + 1, light)
      }

      const finalOpacity = (pageIndex + 1) * pageSize > total ? 0.3 : opacity

      makeDrawWrapper(ctx)
        .circle(x, y, radius, bgColor, finalOpacity)
        .stroke(x, y, radius, strokeColor, strokeWidth, finalOpacity)
        .drawImg(imageCache, iconPath, x, y, radius, radius, finalOpacity)

      if (globalScale > DEFAULT_NODE_LABEL_SCALE_THRESHOLD) {
        makeDrawWrapper(ctx).text(
          `Page: ${pageIndex} Size: ${pageSize} Total: ${total}`,
          x,
          y + radius + fontSize,
          fontSize,
          textColor,
          finalOpacity
        )
      }
    },

    renderNodePointerArea: ({ node, indexColor, ctx, style }) => {
      const { x = 0, y = 0 } = node
      const {
        pageIndex = 0,
        pageSize = 10,
        total = 0,
      } = (node.data as PaginatorNodeType["data"]) ?? {}

      const { strokeColor, strokeWidth, radius = DEFAULT_RADIUS } = style

      const disabled = (pageIndex + 1) * pageSize > total

      if (!disabled) {
        makeDrawWrapper(ctx)
          .stroke(x, y, radius, strokeColor, strokeWidth)
          .circle(x, y, radius, indexColor)
      }
    },

    getCollisionRadius: ({ node, style }) => {
      const { radius = DEFAULT_RADIUS } = style
      return radius
    },
  }
}
