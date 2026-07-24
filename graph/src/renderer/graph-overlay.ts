/**
 * GraphOverlay — 图覆盖层接口。
 *
 * 在节点/边之上渲染额外内容，并独立处理点击事件。
 * 每个覆盖层管理自己的 shader、FBO 拾取、事件监听。
 *
 * 内置实现：PlusBadgeLayer
 * 外部可自定义：例如缩放控件、迷你地图、数据标签等。
 */
export interface GraphOverlay {
  /** 层名（调试用） */
  readonly name: string

  /**
   * 渲染拾取缓冲到内部的 FBO。
   * 每个拾取对象用唯一颜色编码，用于后续 pick() 检测。
   * 如果覆盖层不需要点击交互，可以实现为空方法。
   */
  renderPickBuffer(
    width: number,
    height: number,
    tx: number,
    ty: number,
    scale: number,
  ): void

  /** 渲染视觉效果到默认帧缓冲 */
  render(
    width: number,
    height: number,
    tx: number,
    ty: number,
    scale: number,
    zOffset: number,
  ): void

  /**
   * 拾取检测：屏幕坐标 → 被点击的对象 ID 或 null。
   * 如果返回非 null，主交互层将停止事件传播（不继续到节点/边拾取）。
   * 如果覆盖层不需要点击交互，可以返回 null。
   */
  pick?(screenX: number, screenY: number): string | null

  /** Canvas 尺寸变化时通知 */
  resize?(width: number, height: number): void

  /** 销毁，释放 GPU 资源 */
  destroy(): void
}
