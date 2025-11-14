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

import type { FactorNodeType } from "./factor.type"

export const createFactorEntity: EntityCreator = () => {
  const imageCache = new Map<string, HTMLImageElement>()

  return {
    renderNodeCanvasObject: ({ node, ctx, globalScale, style }) => {
      const { x = 0, y = 0 } = node
      const {
        label,
        value,
        docType,
        valueTypeName,
        valueType,
        location,
        total,
      } = (node.data as FactorNodeType["data"]) ?? {}

      let iconPath = `/api/v1/connValueType-icon?key=${valueType}`

      if (valueType === "ip") {
        iconPath = `/api/v1/flag-icon?national=${location}`
      }
      if (valueType === "account") {
        iconPath = `/api/v1/document-icon?docType=${docType}`
      }
      if (valueType === "id") {
        if (!new RegExp(/id/).test((valueTypeName || "").toLowerCase())) {
          iconPath = `/api/v1/document-icon?docType=${docType}`
        }
      }
      if (valueType === "idcard") {
        iconPath = `/api/v1/document-icon?docType=${docType}`
      }
      if (valueType === "phone") {
        iconPath = `/api/v1/document-icon?docType=${docType}`
      }
      if (valueType === "email") {
        iconPath = `/api/v1/document-icon?docType=${docType}`
      }
      if (valueType === "case_factor") {
        iconPath = `/api/v1/document-icon?docType=${docType}`
      }

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
        const nameText = valueTypeName || label
        const valuesText = `${value} ${total ? `(${total})` : ""}`
        makeDrawWrapper(ctx)
          .text(
            nameText,
            x,
            y + radius + fontSize,
            fontSize,
            textColor,
            opacity
          )
          .text(
            valuesText,
            x,
            y + radius + (fontSize + 0.5) * 2,
            fontSize,
            textColor,
            opacity
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
