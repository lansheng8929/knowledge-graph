import { imageCache } from "../image-cache"

export const makeDrawWrapper = (ctx: CanvasRenderingContext2D) => ({
  circle: function (
    x: number,
    y: number,
    radius: number,
    color: string,
    opacity = 1,
  ) {
    ctx.save()
    // ctx.globalAlpha = opacity;
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false)
    ctx.fillStyle = color
    ctx.fill()
    ctx.closePath()
    ctx.restore()
    return this
  },
  text: function (
    text = "",
    x: number,
    y: number,
    size: number,
    color: string,
    opacity = 1,
  ) {
    ctx.save()
    ctx.globalAlpha = opacity
    ctx.font = `${size}px Sans-Serif`
    ctx.textAlign = "center"
    ctx.textBaseline = "top"
    ctx.fillStyle = color
    ctx.fillText(text, x, y)
    ctx.restore()
    return this
  },
  textWrap: function (
    text = "",
    x: number,
    y: number,
    size: number,
    color: string,
    opacity = 1,
    maxWidth: number,
  ) {
    ctx.save()
    ctx.globalAlpha = opacity
    ctx.font = `${size}px Sans-Serif`
    ctx.textAlign = "center"
    ctx.textBaseline = "top"
    ctx.fillStyle = color

    let line = ""
    let lineHeight = size * 1.2 // 行高
    let currentY = y
    for (let i = 0; i < text.length; i++) {
      const testLine = line + text[i]
      const metrics = ctx.measureText(testLine)
      if (metrics.width > maxWidth) {
        if (line.length > 0) {
          ctx.fillText(line, x, currentY)
          currentY += lineHeight
          line = text[i]
        } else {
          // 如果单个字符都超出，强制绘制
          ctx.fillText(text[i], x, currentY)
          currentY += lineHeight
          line = ""
        }
      } else {
        line = testLine
      }
    }
    if (line.length > 0) {
      ctx.fillText(line, x, currentY)
    }

    ctx.restore()
    return this
  },
  // 简化版：只支持颜色和字体大小
  multiColorText: function (
    segments: Array<{
      text: string
      color: string
      fontSize?: number
      disabled?: boolean
    }>,
    x: number,
    y: number,
    opacity = 1,
    align: "left" | "center" | "right" = "center",
  ) {
    const _segments = segments.filter((segment) => !segment.disabled)

    ctx.save()
    ctx.globalAlpha = opacity
    ctx.textBaseline = "top"
    ctx.font = "12px Sans-Serif" // 默认字体

    // 计算总宽度
    let totalWidth = 0
    for (const segment of _segments) {
      const fontSize = segment.fontSize || 12
      ctx.font = `${fontSize}px Sans-Serif`
      totalWidth += ctx.measureText(segment.text).width
    }

    // 计算起始位置
    let currentX = x
    if (align === "center") {
      currentX = x - totalWidth / 2
    } else if (align === "right") {
      currentX = x - totalWidth
    }

    // 绘制
    for (const segment of _segments) {
      const fontSize = segment.fontSize || 12
      ctx.font = `${fontSize}px Sans-Serif`
      ctx.fillStyle = segment.color
      ctx.fillText(segment.text, currentX, y)
      currentX += ctx.measureText(segment.text).width
    }

    ctx.restore()
    return this
  },
  stroke: function (
    x: number,
    y: number,
    radius: number,
    color: string,
    lineWidth: number,
    opacity = 1,
  ) {
    ctx.save()
    ctx.globalAlpha = opacity
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false)
    ctx.strokeStyle = color
    ctx.lineWidth = lineWidth
    ctx.stroke()
    ctx.closePath()
    ctx.restore()
    return this
  },
  drawImg: function (
    _imageCache: Map<string, HTMLImageElement>,
    src: string,
    x: number,
    y: number,
    width: number,
    height: number,
    opacity = 1,
  ) {
    let img: HTMLImageElement

    if (imageCache.has(src)) {
      img = imageCache.get(src)!
    } else {
      // 如果没有，创建新图像并缓存
      img = new Image()
      img.src = src
      img.crossOrigin = "anonymous"
      imageCache.set(src, img)
    }

    // 仅当图像已加载时才绘制
    if (img.complete && img.naturalWidth > 0 && img.naturalHeight > 0) {
      // // 计算 contain 效果的尺寸和位置
      const imgAspect = img.naturalWidth / img.naturalHeight
      const targetAspect = width / height

      let drawWidth, drawHeight, drawX, drawY

      if (imgAspect > targetAspect) {
        // 图片更宽，以宽度为准
        drawWidth = width
        drawHeight = width / imgAspect
        drawX = x - drawWidth / 2
        drawY = y - drawHeight / 2
      } else {
        // 图片更高，以高度为准
        drawHeight = height
        drawWidth = height * imgAspect
        drawX = x - drawWidth / 2
        drawY = y - drawHeight / 2
      }

      ctx.save()
      ctx.globalAlpha = opacity

      // if (opacity < 1) {
      //   ctx.filter = "grayscale(1) contrast(0.5)";
      // }

      ctx.globalCompositeOperation = "source-over"

      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight)
      ctx.restore()
    }
    return this
  },
  innerText: function (
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    maxHeight: number,
    fontSize: number,
    color: string,
    opacity = 1,
  ) {
    const words = text.split(" ")
    let line = ""
    let lineHeight = fontSize * 1.2 // 行高
    let currentY = y - maxHeight / 2 + (maxHeight - lineHeight) / 2 // 垂直居中起点
    ctx.save()
    ctx.globalAlpha = opacity
    ctx.font = `${fontSize}px Sans-Serif`
    ctx.textAlign = "center"
    ctx.textBaseline = "top"
    ctx.fillStyle = color
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + " "
      const metrics = ctx.measureText(testLine)
      const testWidth = metrics.width
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, currentY)
        line = words[n] + " "
        currentY += lineHeight
        if (currentY + lineHeight > y + maxHeight / 2) {
          break // 超出最大高度，停止绘制
        }
      } else {
        line = testLine
      }
    }
    if (currentY + lineHeight <= y + maxHeight / 2) {
      ctx.fillText(line, x, currentY)
    }
    ctx.restore()
    return this
  },
  spinner: function (x: number, y: number, radius: number, opacity?: number) {
    // 绘制右上角转圈动画
    const spinnerRadius = 1.5
    const spinnerX = x + radius * 0.7
    const spinnerY = y - radius * 0.7
    const time = Date.now() * 0.005 // 控制动画速度
    const segments = 8

    ctx.save()
    ctx.globalAlpha = opacity || 1

    // 添加白色背景圆圈
    ctx.beginPath()
    ctx.arc(spinnerX, spinnerY, spinnerRadius + 0.2, 0, 2 * Math.PI, false)
    ctx.fillStyle = "white"
    ctx.fill()
    ctx.closePath()

    for (let i = 0; i < segments; i++) {
      const angle = (i / segments) * Math.PI * 2 + time
      const alpha = Math.max(0.1, (i + 1) / segments)
      const startX = spinnerX + Math.cos(angle) * spinnerRadius * 0.5
      const startY = spinnerY + Math.sin(angle) * spinnerRadius * 0.5
      const endX = spinnerX + Math.cos(angle) * spinnerRadius
      const endY = spinnerY + Math.sin(angle) * spinnerRadius

      ctx.strokeStyle = `rgba(108, 117, 125, ${alpha})`
      ctx.lineWidth = 0.3
      ctx.beginPath()
      ctx.moveTo(startX, startY)
      ctx.lineTo(endX, endY)
      ctx.stroke()
    }
    ctx.restore()

    return this
  },
  drawPlusTool: function (
    color: string,
    x: number,
    y: number,
    radius: number,
    globalScale: number,
  ) {
    const nodeRadius = radius
    // 基于节点半径计算加号大小，约为节点半径的 1/3
    const plusSize = nodeRadius / 3
    const plusX = x + nodeRadius
    const plusY = y - nodeRadius

    // 圆形背景，稍大于加号
    const bgRadius = plusSize * 0.8 // 稍微增大背景
    ctx.save()

    // 绘制白色背景圆
    ctx.beginPath()
    ctx.arc(plusX, plusY, bgRadius, 0, 2 * Math.PI)
    ctx.fillStyle = "#ffffff"
    ctx.fill()
    ctx.closePath()

    // 绘制边框
    ctx.beginPath()
    ctx.arc(plusX, plusY, bgRadius, 0, 2 * Math.PI)
    ctx.strokeStyle = color
    ctx.lineWidth = plusSize * 0.15 // 稍微加粗边框
    ctx.stroke()
    ctx.closePath()

    // 绘制加号
    const lineWidth = plusSize * 0.25 // 加粗加号线条
    const lineLength = plusSize * 0.9 // 稍微加长加号

    ctx.fillStyle = color

    // 横向线条 - 使用圆角矩形
    const roundRect = (
      x: number,
      y: number,
      w: number,
      h: number,
      r: number,
    ) => {
      ctx.beginPath()
      ctx.moveTo(x + r, y)
      ctx.lineTo(x + w - r, y)
      ctx.quadraticCurveTo(x + w, y, x + w, y + r)
      ctx.lineTo(x + w, y + h - r)
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
      ctx.lineTo(x + r, y + h)
      ctx.quadraticCurveTo(x, y + h, x, y + h - r)
      ctx.lineTo(x, y + r)
      ctx.quadraticCurveTo(x, y, x + r, y)
      ctx.closePath()
      ctx.fill()
    }

    const cornerRadius = lineWidth * 0.5

    // 横向线条
    roundRect(
      plusX - lineLength / 2,
      plusY - lineWidth / 2,
      lineLength,
      lineWidth,
      cornerRadius,
    )

    // 纵向线条
    roundRect(
      plusX - lineWidth / 2,
      plusY - lineLength / 2,
      lineWidth,
      lineLength,
      cornerRadius,
    )

    ctx.restore()
    return this
  },
  drawPlusToolArea: function (
    color: string,
    x: number,
    y: number,
    radius: number,
    globalScale: number,
  ) {
    const plusSize = Math.max(1, Math.min(1.5, globalScale * 0.15))
    const nodeRadius = radius
    const plusX = x + nodeRadius
    const plusY = y - nodeRadius

    const areaSize = plusSize * 2

    ctx.save()
    ctx.fillStyle = color
    ctx.fillRect(plusX - areaSize / 2, plusY - areaSize / 2, areaSize, areaSize)
    ctx.restore()

    return this
  },
})
