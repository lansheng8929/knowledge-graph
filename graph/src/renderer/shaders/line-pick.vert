#version 300 es
precision highp float;

layout(location = 0) in vec2 a_position;
layout(location = 1) in vec2 a_source;
layout(location = 2) in vec2 a_target;
layout(location = 3) in vec4 a_color;
layout(location = 4) in float a_width;
layout(location = 5) in vec2 a_mid;

uniform vec2 u_resolution;
uniform vec2 u_translation;
uniform float u_scale;
uniform float u_zOffset;
uniform uint u_idOffset;

flat out uint v_instanceId;

void main() {
  vec2 s = (a_source + u_translation) * u_scale;
  vec2 t = (a_target + u_translation) * u_scale;
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
  v_instanceId = uint(gl_InstanceID) + u_idOffset;
}
