#version 300 es
precision highp float;

// a_position: (t, side) — t∈[0,1] 沿曲线参数, side=±1 为带的两侧
layout(location = 0) in vec2 a_position;
layout(location = 1) in vec2 a_start;       // P0
layout(location = 2) in vec2 a_mid;         // P1 — 二次 Bézier 控制点
layout(location = 3) in vec2 a_end;         // P2
layout(location = 4) in vec4 a_color;
layout(location = 5) in float a_width;

uniform vec2 u_resolution;
uniform vec2 u_translation;
uniform float u_scale;
uniform float u_zOffset;

out vec4 v_color;

void main() {
  vec2 p0 = (a_start + u_translation) * u_scale;
  vec2 p1 = (a_mid + u_translation) * u_scale;
  vec2 p2 = (a_end + u_translation) * u_scale;

  float t = a_position.x;
  float side = a_position.y;

  // ── 二次 Bézier: B(t) = (1-t)²P0 + 2(1-t)t·P1 + t²P2 ──
  float mt = 1.0f - t;
  float mt2 = mt * mt;
  float t2 = t * t;

  vec2 pos = mt2 * p0 + 2.0f * mt * t * p1 + t2 * p2;

  // ── 导数 B'(t) = 2(1-t)(P1-P0) + 2t(P2-P1) ──
  vec2 tangent = 2.0f * mt * (p1 - p0) + 2.0f * t * (p2 - p1);

  float tlen = length(tangent);
  vec2 dir = tlen > 0.001f ? tangent / tlen : normalize(p2 - p0);
  vec2 norm = vec2(-dir.y, dir.x);

  float halfW = a_width * u_scale * 0.5f + 0.4f;
  pos += norm * side * halfW;

  vec2 clipSpace = (pos / u_resolution) * 2.0f - 1.0f;
  clipSpace.y = -clipSpace.y;
  gl_Position = vec4(clipSpace, 0.0f, 1.0f);
  gl_Position.z += u_zOffset;
  v_color = a_color;
}
