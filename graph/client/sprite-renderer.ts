import type { Cosmograph } from "@cosmograph/cosmograph"
import type { GraphNode } from "./type"

/**
 * 精灵渲染器 — 预渲染节点精灵图，推送到 Cosmograph WebGL 纹理
 *
 * 支持多状态精灵切换，实现 hover / selected / highlighted 等交互效果。
 *
 * @example
 * ```ts
 * const sprites = new SpriteRenderer({ spriteSize: 64 })
 *
 * // 1. 分别渲染 "regular" 和 "hovered" 两套精灵
 * sprites.renderState("regular", nodes, (node, ctx, cx, cy, r) => {
 *   ctx.fillStyle = "#999"
 *   ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill()
 * })
 * sprites.renderState("hovered", nodes, (node, ctx, cx, cy, r) => {
 *   ctx.fillStyle = "#ff6b6b"
 *   ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill()
 *   ctx.strokeStyle = "#fff"; ctx.lineWidth = 3; ctx.stroke()
 * })
 *
 * // 2. 推送到 GPU
 * await sprites.flush(renderer.instance!)
 *
 * // 3. 切换 hover 状态
 * //    在事件回调中调用
 * sprites.applyState(renderer.instance!, "hovered", hoveredNodeIds)
 * ```
 */
export class SpriteRenderer {
  private spriteSize: number
  /** stateName -> nodeId -> 纹理索引 */
  private stateMap = new Map<string, Map<string, number>>()
  /** stateName -> ImageData[] */
  private dataMap = new Map<string, ImageData[]>()
  /** 所有 state 的总纹理数 */
  private totalTextures = 0

  private pendingImages: HTMLImageElement[] = []

  constructor(options?: { spriteSize?: number }) {
    this.spriteSize = options?.spriteSize ?? 64
  }

  // ==================== 多状态渲染 ====================

  /**
   * 为一个状态渲染所有节点精灵
   * @param stateName 状态名（"regular" / "hovered" / "selected" / 任意自定义）
   * @param nodes     节点列表
   * @param drawFn    绘制回调
   */
  renderState(
    stateName: string,
    nodes: GraphNode[],
    drawFn: (
      ctx: CanvasRenderingContext2D,
      centerX: number,
      centerY: number,
      radius: number,
      node: GraphNode,
    ) => void,
  ): this {
    const indexMap = new Map<string, number>()
    const list: ImageData[] = []

    for (const node of nodes) {
      const canvas = document.createElement("canvas")
      canvas.width = this.spriteSize
      canvas.height = this.spriteSize
      const ctx = canvas.getContext("2d")!
      const cx = this.spriteSize / 2
      const cy = this.spriteSize / 2
      const radius = this.spriteSize / 2 - 1

      drawFn(ctx, cx, cy, radius, node)

      list.push(ctx.getImageData(0, 0, this.spriteSize, this.spriteSize))
      indexMap.set(node.id, list.length - 1)
    }

    this.dataMap.set(stateName, list)
    this.stateMap.set(stateName, indexMap)
    return this
  }

  // ==================== 状态切换 ====================

  /**
   * 应用某个状态到 Cosmograph GPU
   *
   * @param cosmograph  Cosmograph 实例
   * @param stateName   状态名（必须是 renderState 注册过的）
   * @param activeIds   当前处于该状态的节点 ID 列表
   *                    - 传全部节点 → 所有节点显示该状态
   *                    - 只传部分 → 非 active 节点回退到 "regular"
   *                    - 不传 → 全部切换
   */
  applyState(
    cosmograph: Cosmograph,
    stateName: string,
    activeIds?: string[],
  ): void {
    const indexMap = this.stateMap.get(stateName)
    const data = this.dataMap.get(stateName)
    if (!indexMap || !data) {
      console.warn(`[SpriteRenderer] State "${stateName}" not found`)
      return
    }

    // 如果只切换部分节点，构建混合纹理列表
    if (activeIds) {
      const regularMap = this.stateMap.get("regular")
      const regularData = this.dataMap.get("regular")

      if (regularMap && regularData) {
        // 逐节点选择纹理：active 的用 stateName，其余用 "regular"
        const mixedData: ImageData[] = []
        const mixedIndices: number[] = []

        for (const [nodeId, _] of regularMap) {
          const isActive = activeIds.includes(nodeId)
          const srcMap = isActive ? indexMap : regularMap
          const srcData = isActive ? data : regularData
          const idx = srcMap.get(nodeId)
          if (idx !== undefined) {
            mixedData.push(srcData[idx])
            mixedIndices.push(mixedData.length - 1)
          }
        }

        cosmograph.setImageData(mixedData)
        cosmograph.setPointImageIndices(mixedIndices)
        return
      }
    }

    // 全部切换
    const indices = Array.from({ length: indexMap.size }, (_, i) => i)
    cosmograph.setImageData(data)
    cosmograph.setPointImageIndices(indices)
  }

  // ==================== 单状态（向后兼容） ====================

  /**
   * @deprecated 改用 renderState("regular", ...)
   */
  renderAll(
    nodes: GraphNode[],
    drawFn: (
      ctx: CanvasRenderingContext2D,
      centerX: number,
      centerY: number,
      radius: number,
      node: GraphNode,
    ) => void,
  ): this {
    return this.renderState("regular", nodes, drawFn)
  }

  /**
   * @deprecated 改用 applyState(cosmograph, "regular")
   */
  async flush(cosmograph: Cosmograph): Promise<void> {
    await this.waitImages()
    this.applyState(cosmograph, "regular")
  }

  // ==================== 图片加载 ====================

  loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        this.pendingImages.push(img)
        resolve(img)
      }
      img.onerror = reject
      img.src = src
    })
  }

  /** 等待所有图片加载完成 */
  async waitImages(): Promise<void> {
    await Promise.allSettled(
      this.pendingImages.map(
        (img) =>
          new Promise<void>((resolve) => {
            if (img.complete) resolve()
            else {
              img.onload = () => resolve()
              img.onerror = () => resolve()
            }
          }),
      ),
    )
  }

  // ==================== 工具 ====================

  getIndex(stateName: string, nodeId: string): number | undefined {
    return this.stateMap.get(stateName)?.get(nodeId)
  }

  clear(): void {
    this.stateMap.clear()
    this.dataMap.clear()
    this.totalTextures = 0
    this.pendingImages = []
  }
}

/**
 * 快捷方式：一步完成单状态精灵图渲染（无交互，同旧版行为）
 *
 * @example
 * ```ts
 * await renderSprites(renderer.instance!, nodes, (node, ctx, cx, cy, r) => {
 *   ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2)
 *   ctx.fillStyle = node.data?.color ?? "#999"
 *   ctx.fill()
 * })
 * ```
 */
export async function renderSprites(
  cosmograph: Cosmograph,
  nodes: GraphNode[],
  drawFn: (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    radius: number,
    node: GraphNode,
  ) => void,
  options?: { spriteSize?: number },
): Promise<void> {
  const renderer = new SpriteRenderer(options)
  renderer.renderState("regular", nodes, drawFn)
  await renderer.waitImages()
  renderer.applyState(cosmograph, "regular")
}
