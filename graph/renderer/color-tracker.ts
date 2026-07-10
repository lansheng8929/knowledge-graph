/**
 * ColorTracker — 为 Canvas 对象分配唯一颜色，实现 O(1) 拾取检测。
 *
 * 原理：
 * - 每个对象分配一个 24-bit RGB 颜色（`#000001` 开始递增）
 * - 颜色低 18 位 = 索引，高 6 位 = checksum（防边界反走样误判）
 * - 最大支持 2^18 - 1 ≈ 262k 个对象
 *
 * 使用方式：
 * ```ts
 * const tracker = new ColorTracker()
 * const color = tracker.register(obj) // "#000001"
 * const obj = tracker.lookup([r, g, b]) // O(1)
 * ```
 */

const ENTROPY = 123
const MAX_INDEX = 0x3ffff // 2^18 - 1

/** 24-bit 整数转 hex 颜色字符串 */
const int2Hex = (n: number): string =>
  `#${Math.min(n, 0xffffff).toString(16).padStart(6, "0")}`

/** [r, g, b] 数组转 24-bit 整数 */
const rgb2Int = (r: number, g: number, b: number): number =>
  (r << 16) + (g << 8) + b

/** checksum：简单哈希防边界伪影 */
const checksum = (index: number): number => (index * ENTROPY) & 0x3f // 6 bits

export class ColorTracker {
  private registry: unknown[] = ["__reserved_background__"]
  private idToColor = new Map<string, string>()

  /** 重置注册表 */
  reset(): void {
    this.registry = ["__reserved_background__"]
    this.idToColor.clear()
  }

  /**
   * 注册一个对象，返回唯一颜色。
   * 如果对象已注册（通过其 id），返回之前的颜色。
   */
  register<T extends { id: string }>(obj: T): string | null {
    // 如果对象已注册，复用颜色
    const existing = this.idToColor.get(obj.id)
    if (existing) return existing

    if (this.registry.length > MAX_INDEX) return null // 注册表已满

    const idx = this.registry.length
    const cs = checksum(idx)
    const colorInt = idx + (cs << 18)
    const color = int2Hex(colorInt)

    this.registry.push(obj)
    this.idToColor.set(obj.id, color)
    return color
  }

  /**
   * 移除对象的注册（数据更新时调用）
   */
  unregister(id: string): void {
    this.idToColor.delete(id)
    // 注意：registry 不删除，避免后续对象颜色变化（仅标记为空洞）
    // 实际使用中 updateData 时会 reset 全部重新注册
  }

  /**
   * 根据像素颜色查找对象。
   * @param color - [r, g, b] 数组（getImageData 格式）
   * @returns 注册的对象，或 null
   */
  lookup(color: [number, number, number] | Uint8ClampedArray): unknown | null {
    if (!color || color[3] === 0) return null // 透明 = 背景

    const n = rgb2Int(color[0], color[1], color[2])
    if (!n) return null // 0 是背景色

    const idx = n & MAX_INDEX
    const cs = (n >> 18) & 0x3f

    if (checksum(idx) !== cs) return null // checksum 不匹配 → 边界像素
    if (idx >= this.registry.length) return null // 越界

    const obj = this.registry[idx]
    // 跳过背景（index 0）和空洞
    if (obj === "__reserved_background__") return null

    return obj
  }

  /** 当前已注册对象数量 */
  get size(): number {
    return this.registry.length - 1
  }
}
