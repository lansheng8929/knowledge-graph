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

import type { UserCaseNodeType } from "./user-case.type"

const renderPlusIcon = (
  ctx: CanvasRenderingContext2D,
  color: string,
  x: number,
  y: number,
  radius: number,
  globalScale: number
) => {
  const plusSize = Math.max(0.5, Math.min(1, globalScale * 0.1))
  if (plusSize > 0.5 && x !== undefined && y !== undefined) {
    const nodeRadius = radius

    // 加号在节点右上角
    const plusX = x + nodeRadius
    const plusY = y - nodeRadius

    ctx.save()
    ctx.fillStyle = color
    ctx.fillRect(
      plusX - plusSize,
      plusY - plusSize * 0.5,
      2 * plusSize,
      plusSize
    )
    ctx.fillRect(
      plusX - plusSize * 0.5,
      plusY - plusSize,
      plusSize,
      2 * plusSize
    )
    ctx.restore()
  }
}

export const createUserCaseEntity: EntityCreator = () => {
  const imageCache = new Map<string, HTMLImageElement>()

  return {
    renderNodeCanvasObject: ({ node, ctx, globalScale, style }) => {
      const { x = 0, y = 0 } = node
      const { caseName, caseNumber, pageIndex, pageSize, count } =
        (node.data as UserCaseNodeType["data"]) ?? {}

      const iconPath = `/api/v1/connValueType-icon?key=case`

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
            `${caseNumber}${paginator}`,
            x,
            y + radius + fontSize,
            fontSize,
            textColor,
            opacity
          )
          .text(
            caseName,
            x,
            y + radius + (fontSize + 0.5) * 2,
            fontSize,
            textColor,
            opacity
          )
      }

      // renderPlusIcon(ctx, "#000", x, y, radius, globalScale)
    },

    renderNodePointerArea: ({
      node,
      indexColor,
      ctx,
      style,
      globalScale,
      colorTracker,
    }) => {
      const { x = 0, y = 0 } = node
      const {
        strokeColor,
        strokeWidth,
        radius = DEFAULT_RADIUS,
        bgColor = DEFAULT_BG_COLOR,
        opacity = 1,
      } = style

      makeDrawWrapper(ctx)
        .stroke(x, y, radius, strokeColor, strokeWidth)
        .circle(x, y, radius, indexColor)

      const shadowColor = colorTracker.register({ type: "Plus", d: node })
      if (!shadowColor) return

      renderPlusIcon(ctx, shadowColor, x, y, radius, globalScale)
    },

    getCollisionRadius: ({ node, style }) => {
      const { radius = DEFAULT_RADIUS } = style
      return radius
    },
  }
}
