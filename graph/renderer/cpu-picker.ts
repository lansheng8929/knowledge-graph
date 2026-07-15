/**
 * CpuPicker — CPU 端 SDF 拾取器。
 *
 * 直接在 CPU 上计算 SDF 距离做命中检测，无需离屏 FBO。
 * 适合节点数 < 10000 的场景，零 GPU 开销，零延迟。
 *
 * 与 WebGLPicker 实现相同的 Picker 接口，可互换使用。
 */

import type { Picker, PickHit } from "./picker.js"
import type { RenderNode, RenderLink } from "./types.js"
import { shapeToType } from "./node-batch.js"

/** 形状 SDF（仅圆形） */
function sdf(
  x: number,
  y: number,
  radius: number,
  _type: number,
  _param: number,
): number {
  return Math.sqrt(x * x + y * y) - radius
}

export class CpuPicker implements Picker {
  /** 相机变换（由 WebGLRenderer 每帧同步） */
  tx = 0
  ty = 0
  k = 1

  private nodes: RenderNode[] = []
  private links: RenderLink[] = []

  /** 数据同步 */
  syncData(nodes: RenderNode[], links: RenderLink[]): void {
    this.nodes = nodes
    this.links = links
  }

  /** 调整尺寸（CPU 版无需操作，仅为满足接口一致） */
  resize(_width: number, _height: number): void {
    // no-op
  }

  /** 销毁（CPU 版无需操作，仅为满足接口一致） */
  destroy(): void {
    this.nodes = []
    this.links = []
  }

  /** 命中检测 */
  pick(screenX: number, screenY: number): PickHit | null {
    if (this.nodes.length === 0 && this.links.length === 0) return null

    // 屏幕坐标 → 世界坐标
    const wx = screenX / this.k - this.tx
    const wy = screenY / this.k - this.ty

    // 从后往前遍历（上层节点优先）
    for (let i = this.nodes.length - 1; i >= 0; i--) {
      const n = this.nodes[i]
      const lx = wx - n.x
      const ly = wy - n.y
      const shapeType = shapeToType(n.shape)
      const shapeParam = n.shapeParam ?? 0.25
      const d = sdf(lx, ly, n.radius + n.strokeWidth, shapeType, shapeParam)
      if (d <= 2.0) {
        return { type: "node", id: n.id }
      }
    }

    // 检测边（点到线段距离）
    for (let i = this.links.length - 1; i >= 0; i--) {
      const l = this.links[i]
      const ax = l.sourceX
      const ay = l.sourceY
      const bx = l.targetX
      const by = l.targetY

      // 点到线段距离
      const abx = bx - ax
      const aby = by - ay
      const len2 = abx * abx + aby * aby
      if (len2 < 0.0001) continue

      let t = ((wx - ax) * abx + (wy - ay) * aby) / len2
      t = Math.max(0, Math.min(1, t))

      const px = ax + t * abx
      const py = ay + t * aby
      const dist = Math.sqrt((wx - px) ** 2 + (wy - py) ** 2)

      if (dist <= (l.width + 4) / this.k) {
        return { type: "link", id: l.id }
      }
    }

    return null
  }
}
