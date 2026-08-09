/**
 * Camera — manages pan and zoom transforms
 */

export interface CameraState {
  x: number
  y: number
  k: number
}

export class Camera {
  private _state: CameraState = { x: 0, y: 0, k: 1 }

  get x() {
    return this._state.x
  }
  get y() {
    return this._state.y
  }
  get k() {
    return this._state.k
  }
  get state(): Readonly<CameraState> {
    return this._state
  }

  /** Reset to identity */
  reset(): void {
    this._state = { x: 0, y: 0, k: 1 }
  }

  /** Pan by delta in screen pixels */
  pan(dx: number, dy: number): void {
    this._state.x += dx / this._state.k
    this._state.y += dy / this._state.k
  }

  /** Zoom toward a screen point */
  zoomTo(ratio: number, screenX: number, screenY: number): void {
    // 最小缩放 0.03（可缩得很远看全局；放大上限 10）
    const newK = Math.max(0.03, Math.min(10, this._state.k * ratio))
    // Adjust translation so the screen point stays fixed
    const worldX = (screenX - this._state.x * this._state.k) / this._state.k
    const worldY = (screenY - this._state.y * this._state.k) / this._state.k
    this._state.x = screenX / newK - worldX
    this._state.y = screenY / newK - worldY
    this._state.k = newK
  }

  /** Set absolute zoom */
  setZoom(k: number, screenX?: number, screenY?: number): void {
    if (screenX !== undefined && screenY !== undefined) {
      this.zoomTo(k / this._state.k, screenX, screenY)
    } else {
      this._state.k = Math.max(0.03, Math.min(10, k))
    }
  }

  /** Screen -> world coordinates */
  screenToWorld(sx: number, sy: number): [number, number] {
    return [
      (sx - this._state.x * this._state.k) / this._state.k,
      (sy - this._state.y * this._state.k) / this._state.k,
    ]
  }

  /** World -> screen coordinates */
  worldToScreen(wx: number, wy: number): [number, number] {
    return [
      (wx + this._state.x) * this._state.k,
      (wy + this._state.y) * this._state.k,
    ]
  }
}
