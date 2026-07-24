/**
 * NodeRenderPipeline — 节点渲染管线接口。
 *
 * @deprecated 使用 RenderPlugin 替代。保留此接口以兼容旧代码。
 */
import type { RenderNode } from "./types.js"

export interface NodeRenderPipeline {
  render(
    nodes: RenderNode[],
    width: number,
    height: number,
    tx: number,
    ty: number,
    scale: number,
    zOffset?: number,
  ): void
  renderPicking(
    nodes: RenderNode[],
    width: number,
    height: number,
    tx: number,
    ty: number,
    scale: number,
    zOffset?: number,
  ): void
  destroy(): void
}
