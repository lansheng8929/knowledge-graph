#version 300 es
precision highp float;

layout(location = 0) in vec2 a_position;
layout(location = 1) in vec2 a_source;
layout(location = 2) in vec2 a_target;
layout(location = 3) in vec4 a_color;
layout(location = 4) in float a_width;

uniform vec2 u_resolution;
uniform vec2 u_translation;
uniform float u_scale;
uniform float u_zOffset;
uniform uint u_idOffset;

flat out uint v_instanceId;

void main() {
  vec2 s = (a_source + u_translation) * u_scale;
  vec2 t = (a_target + u_translation) * u_scale;
  vec2 dir = normalize(t - s);
  vec2 norm = vec2(-dir.y, dir.x);
  float halfW = a_width * u_scale * 0.5 + 1.0;
  vec2 pos = mix(s, t, a_position.x) + norm * a_position.y * halfW;
  vec2 clipSpace = (pos / u_resolution) * 2.0 - 1.0;
  clipSpace.y = -clipSpace.y;
  gl_Position = vec4(clipSpace, 0.0, 1.0);
  gl_Position.z += u_zOffset;
  v_instanceId = uint(gl_InstanceID) + u_idOffset;
}
