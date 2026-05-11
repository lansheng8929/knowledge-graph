/**
 * ShadowLayer — 隐藏的离屏 canvas 层，用于颜色追踪和命中检测。
 *
 * 支持:
 * - 通过 zIndex 控制层的叠放顺序（数值越大越靠上，优先被检测）
 * - 通过 capturesEvents 控制点击事件是否穿透到下层
 * - enabled 开关控制层是否参与渲染和命中检测
 */
export interface ShadowLayerOptions {
  /** 叠放顺序，数值越大越靠上。默认 0 */
  zIndex?: number
  /** 命中后是否阻止事件向下层传播。默认 true */
  capturesEvents?: boolean
  /** 是否启用该层。默认 true */
  enabled?: boolean
  /** 每帧渲染回调，用于在该层上绘制命中检测区域 */
  onRender?: (ctx: CanvasRenderingContext2D, globalScale: number) => void
}

export class ShadowLayer {
  readonly name: string
  readonly canvas: HTMLCanvasElement
  readonly ctx: CanvasRenderingContext2D
  readonly capturesEvents: boolean
  zIndex: number
  enabled: boolean
  onRender?: (ctx: CanvasRenderingContext2D, globalScale: number) => void

  constructor(
    name: string,
    width: number,
    height: number,
    options?: ShadowLayerOptions,
  ) {
    this.name = name
    this.canvas = document.createElement("canvas")
    this.canvas.width = width
    this.canvas.height = height
    this.ctx = this.canvas.getContext("2d")!
    this.capturesEvents = options?.capturesEvents ?? true
    this.zIndex = options?.zIndex ?? 0
    this.enabled = options?.enabled ?? true
    this.onRender = options?.onRender
  }

  resize(width: number, height: number): void {
    this.canvas.width = width
    this.canvas.height = height
  }

  /** 清空整个画布 */
  clear(): void {
    this.ctx.save()
    this.ctx.setTransform(1, 0, 0, 1, 0, 0)
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.ctx.restore()
  }

  /** 同步 force-graph 的 zoom/pan 变换 */
  setTransform(transform: { k: number; x: number; y: number }): void {
    this.ctx.setTransform(
      transform.k,
      0,
      0,
      transform.k,
      transform.x,
      transform.y,
    )
  }

  /** 读取指定坐标的像素颜色 */
  getPixel(x: number, y: number): Uint8ClampedArray {
    return this.ctx.getImageData(x, y, 1, 1).data
  }
}

/** 命中检测结果 */
export interface ShadowLayerHit {
  layer: ShadowLayer
  pixel: Uint8ClampedArray
}

/**
 * ShadowLayerManager — 管理多个 ShadowLayer，提供:
 * - 按 zIndex 排序的层叠顺序
 * - 从上到下的命中检测（支持事件穿透）
 * - 统一的 transform 同步和 resize
 */
export class ShadowLayerManager {
  private layers: ShadowLayer[] = []
  private layerMap: Map<string, ShadowLayer> = new Map()

  /**
   * 新增一个隐藏互动层。
   * @param name 唯一名称，用于后续查找/删除
   * @param width 画布宽度
   * @param height 画布高度
   * @param options 配置（zIndex, capturesEvents, enabled）
   */
  addLayer(
    name: string,
    width: number,
    height: number,
    options?: ShadowLayerOptions,
  ): ShadowLayer {
    if (this.layerMap.has(name)) {
      throw new Error(`ShadowLayer "${name}" already exists`)
    }
    const layer = new ShadowLayer(name, width, height, options)
    this.layers.push(layer)
    this.layerMap.set(name, layer)
    this.sort()
    return layer
  }

  /** 移除指定层 */
  removeLayer(name: string): void {
    const layer = this.layerMap.get(name)
    if (!layer) return
    this.layers = this.layers.filter((l) => l !== layer)
    this.layerMap.delete(name)
  }

  /** 获取指定层 */
  getLayer(name: string): ShadowLayer | undefined {
    return this.layerMap.get(name)
  }

  /** 按 zIndex 降序排列（高 zIndex = 优先命中检测） */
  private sort(): void {
    this.layers.sort((a, b) => b.zIndex - a.zIndex)
  }

  /** 更新层顺序（重新按 zIndex 排序） */
  reorder(): void {
    this.sort()
  }

  /** 遍历所有启用的层（从高 zIndex 到低 zIndex） */
  forEach(fn: (layer: ShadowLayer) => void): void {
    for (const layer of this.layers) {
      if (layer.enabled) fn(layer)
    }
  }

  /**
   * 命中检测：从上到下遍历所有启用的层。
   *
   * 行为规则:
   * - 如果某层命中 且 capturesEvents=true  → 立即返回该命中，不再检查下层
   * - 如果某层命中 且 capturesEvents=false → 记录命中但继续检查下层，最终返回最上层命中
   * - 如果某层未命中且 capturesEvents=true  → 继续检查下层
   * - 如果某层未命中且 capturesEvents=false → 继续检查下层
   *
   * @returns 第一个有效命中，或 null
   */
  hitTest(x: number, y: number): ShadowLayerHit | null {
    let firstHit: ShadowLayerHit | null = null

    for (const layer of this.layers) {
      if (!layer.enabled) continue

      const pixel = layer.getPixel(x, y)
      if (pixel[3] > 0) {
        // 该层有命中
        if (layer.capturesEvents) {
          return { layer, pixel }
        }
        // capturesEvents=false，记录第一个命中但继续检查
        if (!firstHit) {
          firstHit = { layer, pixel }
        }
      }
      // 无命中则继续检查下层
    }

    return firstHit
  }

  /** 同步所有层的 zoom/pan 变换 */
  syncZoom(transform: { k: number; x: number; y: number }): void {
    for (const layer of this.layers) {
      if (layer.enabled) {
        layer.setTransform(transform)
      }
    }
  }

  /** 调整所有层尺寸 */
  resizeAll(width: number, height: number): void {
    for (const layer of this.layers) {
      layer.resize(width, height)
    }
  }
}
