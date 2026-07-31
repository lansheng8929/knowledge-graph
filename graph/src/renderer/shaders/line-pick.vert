#version 300 es
precision highp float;

layout(location = 0) in vec2 a_position;      // (t, side)
layout(location = 1) in vec2 a_start;         // P0
layout(location = 2) in vec2 a_mid;           // P1
layout(location = 3) in vec2 a_end;           // P2
layout(location = 4) in vec4 a_color;         // unused in pick
layout(location = 5) in float a_width;

uniform vec2 u_resolution;
uniform vec2 u_translation;
uniform float u_scale;
uniform float u_zOffset;
uniform uint u_idOffset;

flat out uint v_instanceId;

void main() {
  vec2 p0 = (a_start + u_translation) * u_scale;
  vec2 p1 = (a_mid   + u_translation) * u_scale;
  vec2 p2 = (a_end   + u_translation) * u_scale;

  float t = a_position.x;
  float side = a_position.y;

  float mt  = 1.0 - t;
  float mt2 = mt * mt;
  float t2  = t * t;

  vec2 pos = mt2 * p0 + 2.0 * mt * t * p1 + t2 * p2;

  vec2 tangent = 2.0 * mt * (p1 - p0) + 2.0 * t * (p2 - p1);

  float tlen = length(tangent);
  vec2 dir = tlen > 0.001 ? tangent / tlen : normalize(p2 - p0);
  vec2 norm = vec2(-dir.y, dir.x);

  float halfW = a_width * u_scale * 0.5 + 1.0;
  pos += norm * side * halfW;

  vec2 clipSpace = (pos / u_resolution) * 2.0 - 1.0;
  clipSpace.y = -clipSpace.y;
  gl_Position = vec4(clipSpace, 0.0, 1.0);
  gl_Position.z += u_zOffset;
  v_instanceId = uint(gl_InstanceID) + u_idOffset;
}
