import type ForceGraph from "force-graph"
import type { EntityConfig, GraphLink, GraphNode } from ".."
import imageCache from "./image-cache"

export const makeDrawWrapper = (ctx: CanvasRenderingContext2D) => ({
  circle: function (
    x: number,
    y: number,
    radius: number,
    color: string,
    opacity = 1
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
    opacity = 1
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
  stroke: function (
    x: number,
    y: number,
    radius: number,
    color = "#000",
    lineWidth = 0.3,
    opacity = 1
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
    opacity = 1
  ) {
    let img: HTMLImageElement

    if (imageCache.has(src)) {
      img = imageCache.get(src)!
    } else {
      // 如果没有，创建新图像并缓存
      img = new Image()
      img.src = src
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
      if (opacity < 1) {
        ctx.filter = "grayscale(1) contrast(0.5)"
      }
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
    opacity = 1
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
  spinner: function (x: number, y: number, opacity?: number) {
    // 绘制右上角转圈动画
    const spinnerRadius = 1.5
    const spinnerX = x + 3
    const spinnerY = y - 3
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
})

// 封装为独立的函数
export const getDynamicRadius = (count = 0, baseRadius = 4): number => {
  const minRadius = 4
  const maxRadius = 12

  if (count <= 1) return baseRadius

  // 使用对数函数平滑增长，避免过大
  const logCount = Math.log10(count + 1)
  const scaleFactor = 1 + logCount * 0.5
  const dynamicRadius = baseRadius * scaleFactor

  return Math.min(Math.max(dynamicRadius, minRadius), maxRadius)
}

// 封装碰撞半径计算函数
export const getRelationshipCollisionRadius = (count = 0): number => {
  const dynamicRadius = getDynamicRadius(count)
  return dynamicRadius + 3 // 添加3px的安全间距
}

// 用于创建一个对象的深度可选版本
export type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends object ? RecursivePartial<T[P]> : T[P]
}

// 深度合并对象属性
export function mergeObjects<T extends Record<string, any>>(
  source?: T,
  target?: RecursivePartial<T>
): T {
  const result = { ...source }

  for (const key in target) {
    if (Object.prototype.hasOwnProperty.call(target, key)) {
      const targetValue = target[key]
      const sourceValue = result[key]

      if (
        targetValue !== null &&
        targetValue !== undefined &&
        typeof targetValue === "object" &&
        !Array.isArray(targetValue) &&
        sourceValue !== null &&
        sourceValue !== undefined &&
        typeof sourceValue === "object" &&
        !Array.isArray(sourceValue)
      ) {
        result[key] = mergeObjects(sourceValue, targetValue)
      } else if (targetValue !== undefined) {
        result[key] = targetValue as T[Extract<keyof T, string>]
      }
    }
  }

  return result as T
}

const getGroups = (nodes: GraphNode[]) => {
  return nodes.reduce((acc, curr) => {
    const group = curr.group
    if (!group) return acc
    if (!acc[group]) acc[group] = []
    acc[group].push(curr)
    return acc
  }, {} as Record<string, typeof nodes>)
}

const makeGroupForce = (
  forceGraph: ForceGraph<GraphNode, GraphLink>,
  groups: Record<string, GraphNode[]>
) => {
  // const clusterForce = () => {
  //   function force(alpha: number) {
  //     Object.keys(groups).forEach((group) => {
  //       const nodes = groups[group];
  //       if (nodes.length === 0) return;
  //       let sumX = 0,
  //         sumY = 0;
  //       nodes.forEach((n) => {
  //         sumX += n.x || 0;
  //         sumY += n.y || 0;
  //       });
  //       const cx = sumX / nodes.length;
  //       const cy = sumY / nodes.length;
  //       nodes.forEach((node: GraphNode) => {
  //         node.vx = (node.vx ?? 0) + (cx - (node.x ?? 0)) * alpha * 0.1;
  //         node.vy = (node.vy ?? 0) + (cy - (node.y ?? 0)) * alpha * 0.1;
  //       });
  //     });
  //   }
  //   force.initialize = (nodes: GraphNode[]) => {};
  //   return force;
  // };
  // forceGraph.d3Force("cluster", clusterForce());
}
