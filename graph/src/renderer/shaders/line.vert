#version 300 es
precision highp float;

layout(location = 0) in vec2 a_position;     // x:[0,1]线 / x:[-1,0]箭头
layout(location = 1) in vec2 a_source;
layout(location = 2) in vec2 a_target;
layout(location = 3) in vec4 a_color;
layout(location = 4) in float a_width;
layout(location = 5) in vec2 a_mid;
layout(location = 6) in float a_arrowSize;

uniform vec2 u_resolution;
uniform vec2 u_translation;
uniform float u_scale;
uniform float u_zOffset;
uniform bool u_showArrows;

out vec4 v_color;

void main() {
  vec2 s = (a_source + u_translation) * u_scale;
  vec2 t = (a_target + u_translation) * u_scale;

  if (u_showArrows && a_position.x < -0.001) {
    // ── 箭头三角形 ──
    // 方向：曲线用 mid→target，直线用 source→target
    vec2 adir;
    if (a_mid.x != 0.0 || a_mid.y != 0.0) {
      vec2 m = (a_mid + u_translation) * u_scale;
      adir = normalize(t - m);
    } else {
      adir = normalize(t - s);
    }
    vec2 norm = vec2(-adir.y, adir.x);
    float sz = a_arrowSize * u_scale;
    vec2 offset = a_position.x * (adir * sz) + a_position.y * (norm * sz * 0.4);
    vec2 pos = t + offset;
    vec2 clipSpace = (pos / u_resolution) * 2.0 - 1.0;
    clipSpace.y = -clipSpace.y;
    gl_Position = vec4(clipSpace, 0.0, 1.0);
    gl_Position.z += u_zOffset;
    v_color = a_color;
    return;
  }

  // ── 线 ──
  float tParam = a_position.x;
  vec2 pos;
  if (a_mid.x != 0.0 || a_mid.y != 0.0) {
    vec2 m = (a_mid + u_translation) * u_scale;
    float mt = 1.0 - tParam;
    pos = mt * mt * s + 2.0 * mt * tParam * m + tParam * tParam * t;
    vec2 tangent = 2.0 * mt * (m - s) + 2.0 * tParam * (t - m);
    vec2 dir = normalize(tangent);
    vec2 norm = vec2(-dir.y, dir.x);
    float halfW = a_width * u_scale * 0.5 + 1.0;
    pos += norm * a_position.y * halfW;
  } else {
    vec2 dir = normalize(t - s);
    vec2 norm = vec2(-dir.y, dir.x);
    float halfW = a_width * u_scale * 0.5 + 1.0;
    pos = mix(s, t, tParam) + norm * a_position.y * halfW;
  }
  vec2 clipSpace = (pos / u_resolution) * 2.0 - 1.0;
  clipSpace.y = -clipSpace.y;
  gl_Position = vec4(clipSpace, 0.0, 1.0);
  gl_Position.z += u_zOffset;
  v_color = a_color;
}
