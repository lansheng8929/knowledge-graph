#version 300 es
precision highp float;

layout(location = 0) in vec2 a_position;
layout(location = 1) in vec2 a_tip;
layout(location = 2) in vec2 a_dir;
layout(location = 3) in vec4 a_color;
layout(location = 4) in float a_size;

uniform vec2 u_resolution;
uniform vec2 u_translation;
uniform float u_scale;

flat out int v_instanceId;

void main() {
  vec2 tip = (a_tip + u_translation) * u_scale;
  float size = a_size * u_scale;
  vec2 dir = normalize(a_dir);
  vec2 norm = vec2(-dir.y, dir.x);
  vec2 offset = a_position.x * (-dir * size) + a_position.y * (norm * size * 0.5f);
  vec2 pos = tip + offset;
  vec2 clipSpace = (pos / u_resolution) * 2.0f - 1.0f;
  clipSpace.y = -clipSpace.y;
  gl_Position = vec4(clipSpace, 0.0f, 1.0f);
  v_instanceId = gl_InstanceID;
}
