/**
 * Layout — 可插拔布局引擎接口。
 *
 * 框架默认使用 ForceSimulation（d3-force），
 * 外部可以通过实现此接口来自定义布局算法（辐射布局、树形布局、网格布局等）。
 *
 * @example 自定义布局
 * ```ts
 * class RadialLayout implements Layout {
 *   setData(nodes, links) { ... }
 *   start() { ... }
 *   stop() { ... }
 *   destroy() { ... }
 *   fixNode(id, x?, y?) { ... }
 *   releaseNode(id) { ... }
 * }
 *
 * const view = new GraphView({
 *   container,
 *   graphModel: model,
 *   layout: new RadialLayout(),
 * })
 * ```
 */
export interface Layout {
  /** 设置节点和边数据 */
  setData(
    nodes: Array<{
      id: string
      x?: number
      y?: number
      radius?: number
      fx?: number | null
      fy?: number | null
    }>,
    links: Array<{
      id?: string
      source: string | number | { id: string }
      target: string | number | { id: string }
    }>,
  ): void

  /** 启动布局计算 */
  start(): void

  /** 停止布局计算 */
  stop(): void

  /** 重新加热（对基于力的布局有效，其他布局可忽略） */
  reheat(alpha?: number): void

  /** 一次性同步排布（不进入冷却动画）；基于力的布局建议实现，未实现可忽略 */
  settle?(iterations?: number): void

  /** 固定节点位置 */
  fixNode(nodeId: string, x?: number, y?: number): void

  /** 释放固定节点 */
  releaseNode(nodeId: string): void

  /** tick 回调：每次位置更新时调用 */
  onTick?: (
    nodes: Array<{
      id: string
      x: number
      y: number
      vx?: number
      vy?: number
    }>,
  ) => void

  /** 布局稳定后的回调 */
  onEnd?: () => void

  /** 销毁清理 */
  destroy(): void
}
