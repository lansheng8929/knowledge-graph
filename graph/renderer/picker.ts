/**
 * Picker — 拾取策略接口。
 *
 * 不同的渲染后端（Canvas2D / WebGL）各自实现此接口，
 * 提供给 InteractionManager 做命中检测。
 */

export interface PickHit {
  type: "node" | "link"
  id: string
}

export interface Picker {
  /**
   * 在屏幕坐标 (screenX, screenY) 处检测命中对象。
   * 坐标原点为 canvas 左上角 CSS 像素。
   * 返回命中的对象信息，或 null。
   */
  pick(screenX: number, screenY: number): PickHit | null
}
