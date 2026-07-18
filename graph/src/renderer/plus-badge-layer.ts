/**
 * PlusBadgeLayer — 独立的工具交互层
 *
 * 职责：
 * - 在画布上渲染 "+" 徽标（白底圆 + 红色加号）
 * - 独立处理点击事件（capture phase 拦截）
 * - 与主画布交互层完全分离
 */

import { PLUS_VS, PLUS_FS, PICK_PLUS_VS, PICK_PLUS_FS } from "./shaders.js"

/** 单个徽标数据 */
export interface BadgeData {
  /** 徽标中心 X（世界坐标） */
  x: number
  /** 徽标中心 Y（世界坐标） */
  y: number
  /** 徽标半径（世界坐标） */
  radius: number
  /** 关联的节点 ID */
  nodeId: string
}

export interface PlusBadgeLayerOptions {
  canvas: HTMLCanvasElement
  gl: WebGL2RenderingContext
  /** 点击徽标的回调 */
  onPlusClick?: (nodeId: string) => void
  /** 边框宽度（世界坐标单位，默认 0 = 无边框） */
  borderWidth?: number
  /** 边框颜色（默认红色） */
  borderColor?: [number, number, number, number]
}

export class PlusBadgeLayer {
  private gl: WebGL2RenderingContext
  private canvas: HTMLCanvasElement
  private program: WebGLProgram
  private pickProgram: WebGLProgram
  private quadVao: WebGLVertexArrayObject | null = null

  // Border config
  borderWidth: number
  borderColor: [number, number, number, number]

  // Uniforms (render)
  private uResolution: WebGLUniformLocation | null = null
  private uTranslation: WebGLUniformLocation | null = null
  private uScale: WebGLUniformLocation | null = null
  private uZOffset: WebGLUniformLocation | null = null
  private uBorderWidth: WebGLUniformLocation | null = null
  private uBorderColor: WebGLUniformLocation | null = null

  // Uniforms (pick)
  private uPickResolution: WebGLUniformLocation | null = null
  private uPickTranslation: WebGLUniformLocation | null = null
  private uPickScale: WebGLUniformLocation | null = null
  private uPickZOffset: WebGLUniformLocation | null = null
  private uPickBorderWidth: WebGLUniformLocation | null = null

  /** 当前徽标数据 */
  badges: BadgeData[] = []
  /** 节点 ID → 索引映射（用于拾取） */
  private nodeIndexMap = new Map<string, number>()

  /** 拾取 FBO */
  private pickFbo: WebGLFramebuffer | null = null
  private pickTexture: WebGLTexture | null = null
  private pickWidth = 0
  private pickHeight = 0

  onPlusClick?: (nodeId: string) => void

  // 已绑定的指针事件处理
  private boundPointerDown: (e: PointerEvent) => void

  constructor(opts: PlusBadgeLayerOptions) {
    this.gl = opts.gl
    this.canvas = opts.canvas
    this.onPlusClick = opts.onPlusClick
    this.borderWidth = opts.borderWidth ?? 0
    this.borderColor = opts.borderColor ?? [0.913, 0.271, 0.376, 1.0]

    this.program = this.compileProgram(PLUS_VS, PLUS_FS)
    this.pickProgram = this.compileProgram(PICK_PLUS_VS, PICK_PLUS_FS)
    this.initQuadGeometry()
    this.cacheUniforms()

    // 在 capture phase 拦截指针事件（优先级高于主交互层）
    this.boundPointerDown = this.onPointerDown.bind(this)
    this.canvas.addEventListener("pointerdown", this.boundPointerDown, {
      capture: true,
    })
  }

  // ─── 编译工具 ───────────────────────────────────

  private compileShader(type: number, source: string): WebGLShader {
    const gl = this.gl
    const shader = gl.createShader(type)!
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error(
        "Plus shader compile failed: " + gl.getShaderInfoLog(shader),
      )
    }
    return shader
  }

  private compileProgram(vs: string, fs: string): WebGLProgram {
    const gl = this.gl
    const vShader = this.compileShader(gl.VERTEX_SHADER, vs)
    const fShader = this.compileShader(gl.FRAGMENT_SHADER, fs)
    const prog = gl.createProgram()!
    gl.attachShader(prog, vShader)
    gl.attachShader(prog, fShader)
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      throw new Error("Plus shader link failed: " + gl.getProgramInfoLog(prog))
    }
    return prog
  }

  private cacheUniforms(): void {
    const gl = this.gl
    this.uResolution = gl.getUniformLocation(this.program, "u_resolution")
    this.uTranslation = gl.getUniformLocation(this.program, "u_translation")
    this.uScale = gl.getUniformLocation(this.program, "u_scale")
    this.uZOffset = gl.getUniformLocation(this.program, "u_zOffset")
    this.uBorderWidth = gl.getUniformLocation(this.program, "u_borderWidth")
    this.uBorderColor = gl.getUniformLocation(this.program, "u_borderColor")

    this.uPickResolution = gl.getUniformLocation(
      this.pickProgram,
      "u_resolution",
    )
    this.uPickTranslation = gl.getUniformLocation(
      this.pickProgram,
      "u_translation",
    )
    this.uPickScale = gl.getUniformLocation(this.pickProgram, "u_scale")
    this.uPickZOffset = gl.getUniformLocation(this.pickProgram, "u_zOffset")
    this.uPickBorderWidth = gl.getUniformLocation(
      this.pickProgram,
      "u_borderWidth",
    )
  }

  private initQuadGeometry(): void {
    const gl = this.gl
    const positions = new Float32Array([
      -1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1,
    ])
    const vao = gl.createVertexArray()!
    gl.bindVertexArray(vao)
    const posBuf = gl.createBuffer()!
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf)
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW)
    gl.enableVertexAttribArray(0)
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)
    gl.bindVertexArray(null)
    this.quadVao = vao
  }

  private setupInstanceBuffer(
    loc: number,
    data: Float32Array,
    components: number,
  ): void {
    const gl = this.gl
    const buf = gl.createBuffer()!
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW)
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, components, gl.FLOAT, false, 0, 0)
    gl.vertexAttribDivisor(loc, 1)
  }

  // ─── 更新徽标数据 ──────────────────────────────

  updateBadges(badges: BadgeData[]): void {
    this.badges = badges
    this.nodeIndexMap.clear()
    for (let i = 0; i < badges.length; i++) {
      this.nodeIndexMap.set(badges[i].nodeId, i)
    }
  }

  // ─── 渲染 ───────────────────────────────────────

  render(
    width: number,
    height: number,
    tx: number,
    ty: number,
    scale: number,
    zOffset = 0,
  ): void {
    const N = this.badges.length
    if (N === 0) return
    const gl = this.gl

    gl.useProgram(this.program)
    gl.uniform2f(this.uResolution, width, height)
    gl.uniform2f(this.uTranslation, tx, ty)
    gl.uniform1f(this.uScale, scale)
    gl.uniform1f(this.uZOffset, zOffset)
    gl.uniform1f(this.uBorderWidth, this.borderWidth)
    gl.uniform4f(
      this.uBorderColor,
      this.borderColor[0],
      this.borderColor[1],
      this.borderColor[2],
      this.borderColor[3],
    )
    gl.bindVertexArray(this.quadVao)

    const center = new Float32Array(N * 2)
    const radius = new Float32Array(N)
    const nodeId = new Float32Array(N)

    for (let i = 0; i < N; i++) {
      const b = this.badges[i]
      center[i * 2] = b.x
      center[i * 2 + 1] = b.y
      radius[i] = b.radius
      nodeId[i] = this.nodeIndexMap.get(b.nodeId) ?? i
    }

    this.setupInstanceBuffer(1, center, 2)
    this.setupInstanceBuffer(2, radius, 1)
    this.setupInstanceBuffer(3, nodeId, 1)

    gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, N)

    for (let loc = 1; loc <= 3; loc++) {
      gl.vertexAttribDivisor(loc, 0)
    }
    gl.bindVertexArray(null)
  }

  // ─── 拾取 ───────────────────────────────────────

  /** 初始化/调整拾取 FBO 尺寸 */
  ensurePickFbo(width: number, height: number): void {
    if (this.pickWidth === width && this.pickHeight === height) return
    const gl = this.gl

    if (this.pickFbo) gl.deleteFramebuffer(this.pickFbo)
    if (this.pickTexture) gl.deleteTexture(this.pickTexture)

    this.pickWidth = width
    this.pickHeight = height

    this.pickTexture = gl.createTexture()!
    gl.bindTexture(gl.TEXTURE_2D, this.pickTexture)
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      width,
      height,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      null,
    )
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)

    this.pickFbo = gl.createFramebuffer()!
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.pickFbo)
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      this.pickTexture,
      0,
    )
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  }

  /** 渲染拾取缓冲（FBO） */
  renderPickBuffer(
    width: number,
    height: number,
    tx: number,
    ty: number,
    scale: number,
  ): void {
    const N = this.badges.length
    if (N === 0) return
    const gl = this.gl

    this.ensurePickFbo(width, height)
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.pickFbo)
    gl.viewport(0, 0, width, height)
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    gl.useProgram(this.pickProgram)
    gl.uniform2f(this.uPickResolution, width, height)
    gl.uniform2f(this.uPickTranslation, tx, ty)
    gl.uniform1f(this.uPickScale, scale)
    gl.uniform1f(this.uPickZOffset, 0)
    gl.uniform1f(this.uPickBorderWidth, this.borderWidth)
    gl.bindVertexArray(this.quadVao)

    const center = new Float32Array(N * 2)
    const radius = new Float32Array(N)
    const dummy = new Float32Array(N)

    for (let i = 0; i < N; i++) {
      const b = this.badges[i]
      center[i * 2] = b.x
      center[i * 2 + 1] = b.y
      radius[i] = b.radius
      dummy[i] = 0
    }

    this.setupInstanceBuffer(1, center, 2)
    this.setupInstanceBuffer(2, radius, 1)
    this.setupInstanceBuffer(3, dummy, 1)

    gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, N)

    for (let loc = 1; loc <= 3; loc++) {
      gl.vertexAttribDivisor(loc, 0)
    }
    gl.bindVertexArray(null)
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  }

  /** 在屏幕坐标处拾取徽标，返回 nodeId */
  pick(screenX: number, screenY: number): string | null {
    const gl = this.gl
    if (!this.pickFbo) return null

    const dpr = window.devicePixelRatio || 1
    const px = Math.round(screenX * dpr)
    const py = Math.round(screenY * dpr)

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.pickFbo)
    const pixel = new Uint8Array(4)
    gl.readPixels(
      px,
      this.pickHeight - py,
      1,
      1,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      pixel,
    )
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)

    const idx = (pixel[0] << 16) | (pixel[1] << 8) | pixel[2]
    if (idx === 0 || idx > this.badges.length) return null

    return this.badges[idx]?.nodeId ?? null
  }

  // ─── 交互（capture phase 拦截） ────────────────

  private onPointerDown(e: PointerEvent): void {
    const rect = this.canvas.getBoundingClientRect()
    const sx = e.clientX - rect.left
    const sy = e.clientY - rect.top

    const hitNodeId = this.pick(sx, sy)
    if (hitNodeId) {
      // 徽标被点击 → 触发回调并阻止事件冒泡
      this.onPlusClick?.(hitNodeId)
      e.stopPropagation()
      e.preventDefault()
    }
  }

  // ─── 销毁 ───────────────────────────────────────

  destroy(): void {
    const gl = this.gl
    this.canvas.removeEventListener("pointerdown", this.boundPointerDown, {
      capture: true,
    } as any)
    gl.deleteProgram(this.program)
    gl.deleteProgram(this.pickProgram)
    if (this.pickFbo) gl.deleteFramebuffer(this.pickFbo)
    if (this.pickTexture) gl.deleteTexture(this.pickTexture)
  }
}
