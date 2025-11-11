import {
  makeDrawWrapper,
  DEFAULT_FONT_SIZE,
  DEFAULT_RADIUS,
  DEFAULT_BG_COLOR,
  DEFAULT_TEXT_COLOR,
  DEFAULT_NODE_LABEL_SCALE_THRESHOLD,
} from "../../client/"
import { getPaginator } from "../../utils"
import type { EntityCreator } from "../entity-types"

import type { EmailNodeType } from "./email.type"

export const createEmailEntity: EntityCreator = () => {
  const imageCache = new Map<string, HTMLImageElement>()

  return {
    renderNodeCanvasObject: (node, ctx, globalScale, style) => {
      const { x = 0, y = 0 } = node
      const { email, pageIndex, pageSize, count } =
        (node.data as EmailNodeType["data"]) ?? {}

      const iconPath = `/api/v1/connValueType-icon?key=email`

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
        makeDrawWrapper(ctx).circle(x, y, 5, light)
      }

      makeDrawWrapper(ctx)
        .circle(x, y, radius, bgColor, opacity)
        .stroke(x, y, radius, strokeColor, strokeWidth, opacity)
        .drawImg(imageCache, iconPath, x, y, radius, radius, opacity)

      if (globalScale > DEFAULT_NODE_LABEL_SCALE_THRESHOLD) {
        const paginator = getPaginator(pageIndex, pageSize, count)

        makeDrawWrapper(ctx)
          .text(
            `${email}${paginator}`,
            x,
            y + radius + fontSize,
            fontSize,
            textColor,
            opacity
          )
          .text(
            "邮箱",
            x,
            y + radius + (fontSize + 0.5) * 2,
            fontSize,
            textColor,
            opacity
          )
      }
    },

    renderNodePointerArea: (node, color, ctx, style) => {
      const { x = 0, y = 0 } = node
      const { strokeColor, strokeWidth, radius = DEFAULT_RADIUS } = style
      makeDrawWrapper(ctx)
        .stroke(x, y, radius, strokeColor, strokeWidth)
        .circle(x, y, radius, color)
    },

    getCollisionRadius: (node, style) => {
      const { radius = DEFAULT_RADIUS } = style
      return radius
    },
  }
}
