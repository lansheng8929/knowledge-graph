/**
 * NodeBatchRenderer — instanced circle rendering with WebGL2
 * Simplified version for debugging
 */

// Ultra-simple shaders for testing
const SIMPLE_VS = `#version 300 es
precision highp float;
layout(location = 0) in vec2 a_position;
layout(location = 1) in vec2 a_center;
layout(location = 2) in float a_radius;
layout(location = 3) in vec4 a_color;
uniform vec2 u_resolution;
uniform vec2 u_translation;
uniform float u_scale;
out vec4 v_color;
out vec2 v_center;
out float v_radius;
out vec2 v_pos;

void main() {
  vec2 p = a_position;
  vec2 screenPos = (a_center + u_translation) * u_scale + p * a_radius * u_scale;
  vec2 clip = (screenPos / u_resolution) * 2.0 - 1.0;
  clip.y = -clip.y;
  gl_Position = vec4(clip, 0.0, 1.0);
  v_color = a_color;
  v_center = a_center;
  v_radius = a_radius;
  v_pos = p * a_radius;
}
`

const SIMPLE_FS = `#version 300 es
precision highp float;
in vec4 v_color;
in vec2 v_center;
in float v_radius;
in vec2 v_pos;
out vec4 fragColor;

void main() {
  // Debug: render entire quad as solid color (no SDF discard)
  fragColor = v_color;
}
`

/** Per-instance attribute data */
interface NodeInstanceData {
  buffers: {
    center: Float32Array
    radius: Float32Array
    color: Float32Array
    strokeColor: Float32Array
    strokeWidth: Float32Array
  }
  count: number
}

export class NodeBatchRenderer {
  private gl: WebGL2RenderingContext
  private program: WebGLProgram
  private pickProgram: WebGLProgram

  // Shared quad geometry (unit square centered at origin)
  private quadVao: WebGLVertexArrayObject | null = null

  // Uniform locations (render)
  private uResolution: WebGLUniformLocation | null = null
  private uTranslation: WebGLUniformLocation | null = null
  private uScale: WebGLUniformLocation | null = null

  // Uniform locations (pick)
  private uPickResolution: WebGLUniformLocation | null = null
  private uPickTranslation: WebGLUniformLocation | null = null
  private uPickScale: WebGLUniformLocation | null = null
  private uPickColor: WebGLUniformLocation | null = null

  constructor(gl: WebGL2RenderingContext) {
    this.gl = gl
    this.program = this.compileProgram(SIMPLE_VS, SIMPLE_FS)
    this.pickProgram = this.compileProgram(
      SIMPLE_VS,
      `#version 300 es
precision highp float;
in vec4 v_color;
in float v_radius;
in vec2 v_pos;
uniform vec4 u_pickColor;
out vec4 fragColor;
void main() {
  float dist = length(v_pos);
  if (dist > v_radius) discard;
  fragColor = u_pickColor;
}
`,
    )
    this.initQuadGeometry()
    this.cacheUniforms()
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
      throw new Error("Shader link failed: " + gl.getProgramInfoLog(prog))
    }
    return prog
  }

  private compileShader(type: number, source: string): WebGLShader {
    const gl = this.gl
    const shader = gl.createShader(type)!
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error("Shader compile failed: " + gl.getShaderInfoLog(shader))
    }
    return shader
  }

  private cacheUniforms(): void {
    const gl = this.gl
    this.uResolution = gl.getUniformLocation(this.program, "u_resolution")
    this.uTranslation = gl.getUniformLocation(this.program, "u_translation")
    this.uScale = gl.getUniformLocation(this.program, "u_scale")

    this.uPickResolution = gl.getUniformLocation(
      this.pickProgram,
      "u_resolution",
    )
    this.uPickTranslation = gl.getUniformLocation(
      this.pickProgram,
      "u_translation",
    )
    this.uPickScale = gl.getUniformLocation(this.pickProgram, "u_scale")
    this.uPickColor = gl.getUniformLocation(this.pickProgram, "u_pickColor")
  }

  private initQuadGeometry(): void {
    const gl = this.gl
    // Quad covering [-1, -1] to [1, 1] for circle SDF
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
    // instanced (divisor 0)

    gl.bindVertexArray(null)
    this.quadVao = vao
  }

  /** Render all nodes (simplified: no stroke) */
  render(
    nodes: {
      x: number
      y: number
      radius: number
      color: [number, number, number, number]
    }[],
    width: number,
    height: number,
    tx: number,
    ty: number,
    scale: number,
  ): void {
    if (nodes.length === 0) return
    const gl = this.gl
    gl.useProgram(this.program)
    gl.uniform2f(this.uResolution, width, height)
    gl.uniform2f(this.uTranslation, tx, ty)
    gl.uniform1f(this.uScale, scale)
    gl.bindVertexArray(this.quadVao)
    const N = nodes.length
    const c = new Float32Array(N * 2)
    const r = new Float32Array(N)
    const col = new Float32Array(N * 4)
    for (let i = 0; i < N; i++) {
      c[i * 2] = nodes[i].x
      c[i * 2 + 1] = nodes[i].y
      r[i] = nodes[i].radius
      col[i * 4] = nodes[i].color[0]
      col[i * 4 + 1] = nodes[i].color[1]
      col[i * 4 + 2] = nodes[i].color[2]
      col[i * 4 + 3] = nodes[i].color[3]
    }
    this.setupInstanceBuffer(1, c, 2)
    this.setupInstanceBuffer(2, r, 1)
    this.setupInstanceBuffer(3, col, 4)
    gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, N)
    gl.vertexAttribDivisor(1, 0)
    gl.vertexAttribDivisor(2, 0)
    gl.vertexAttribDivisor(3, 0)
    gl.bindVertexArray(null)
  }

  /** Render nodes for picking (simplified) */
  renderPicking(
    nodes: { x: number; y: number; radius: number }[],
    width: number,
    height: number,
    tx: number,
    ty: number,
    scale: number,
    pickColor: [number, number, number, number],
  ): void {
    if (nodes.length === 0) return
    const gl = this.gl
    gl.useProgram(this.pickProgram)
    gl.uniform2f(this.uPickResolution, width, height)
    gl.uniform2f(this.uPickTranslation, tx, ty)
    gl.uniform1f(this.uPickScale, scale)
    gl.uniform4f(this.uPickColor, ...pickColor)
    gl.bindVertexArray(this.quadVao)
    const N = nodes.length
    const c = new Float32Array(N * 2)
    const r = new Float32Array(N)
    const dummy = new Float32Array(N * 4)
    for (let i = 0; i < N; i++) {
      c[i * 2] = nodes[i].x
      c[i * 2 + 1] = nodes[i].y
      r[i] = nodes[i].radius
    }
    this.setupInstanceBuffer(1, c, 2)
    this.setupInstanceBuffer(2, r, 1)
    this.setupInstanceBuffer(3, dummy, 4)
    gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, N)
    gl.vertexAttribDivisor(1, 0)
    gl.vertexAttribDivisor(2, 0)
    gl.vertexAttribDivisor(3, 0)
    gl.bindVertexArray(null)
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

  destroy(): void {
    const gl = this.gl
    gl.deleteProgram(this.program)
    gl.deleteProgram(this.pickProgram)
  }
}
