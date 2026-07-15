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
  /** 相机变换（由渲染器每帧同步） */
  tx: number
  ty: number
  k: number

  /** 节点/边数据同步 */
  syncData(nodes: unknown[], links: unknown[]): void

  /** 调整拾取缓冲区尺寸（GPU 版重建 FBO，CPU 版无操作） */
  resize(width: number, height: number): void

  /** 销毁释放资源 */
  destroy(): void

  /**
   * 在屏幕坐标 (screenX, screenY) 处检测命中对象。
   * 坐标原点为 canvas 左上角 CSS 像素。
   * 返回命中的对象信息，或 null。
   */
  pick(screenX: number, screenY: number): PickHit | null
}
