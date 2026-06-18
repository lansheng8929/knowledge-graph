import type { DefaultGraphDataGenerics } from "../../../client"
import type { LinkCreator } from "../../../client/link-types"
import {
  DEFAULT_LINE_WIDTH,
  DEFAULT_STROKE_COLOR,
} from "../../../client/constants"

/**
 * 默认边渲染器
 *
 * 绘制一条直线，无箭头、无曲线。作为所有自定义 LinkCreator 的默认 fallback。
 */
export const createDefaultLinkEntity: LinkCreator<
  DefaultGraphDataGenerics
> = () => ({
  renderLinkCanvasObject: ({ ctx, style, startX, startY, endX, endY }) => {
    const color = style.color ?? DEFAULT_STROKE_COLOR
    const opacity = style.opacity ?? 0.8

    ctx.save()
    ctx.globalAlpha = opacity
    ctx.strokeStyle = color
    ctx.lineWidth = DEFAULT_LINE_WIDTH
    ctx.beginPath()
    ctx.moveTo(startX, startY)
    ctx.lineTo(endX, endY)
    ctx.stroke()
    ctx.restore()
  },

  renderLinkPointerArea: ({ ctx, indexColor, startX, startY, endX, endY }) => {
    const pointerWidth = 8 // 点击区域宽度

    ctx.save()
    ctx.fillStyle = indexColor
    ctx.beginPath()

    const dx = endX - startX
    const dy = endY - startY
    const len = Math.sqrt(dx * dx + dy * dy) || 1
    const perpX = ((-dy / len) * pointerWidth) / 2
    const perpY = ((dx / len) * pointerWidth) / 2

    ctx.moveTo(startX + perpX, startY + perpY)
    ctx.lineTo(startX - perpX, startY - perpY)
    ctx.lineTo(endX - perpX, endY - perpY)
    ctx.lineTo(endX + perpX, endY + perpY)
    ctx.closePath()
    ctx.fill()
    ctx.restore()
  },

  getLinkWidth: () => DEFAULT_LINE_WIDTH,
})
