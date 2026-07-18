#version 300 es
precision highp float;

layout(location = 0) in vec2 a_position;       // quad corner (0..1)
layout(location = 1) in vec2 a_center;          // instance: world position
layout(location = 2) in vec2 a_size;            // instance: world size
layout(location = 3) in vec4 a_color;           // instance: color
layout(location = 4) in vec2 a_uvOrigin;        // instance: UV origin (u0,v0)
layout(location = 5) in vec2 a_uvSize;          // instance: UV size (du,dv)

uniform vec2 u_resolution;
uniform vec2 u_translation;
uniform float u_scale;
uniform float u_zOffset;

out vec2 v_texCoord;
out vec4 v_color;

void main() {
  vec2 screenPos = (a_center + u_translation) * u_scale
                 + (a_position - 0.5) * a_size * u_scale;
  vec2 clipSpace = (screenPos / u_resolution) * 2.0 - 1.0;
  clipSpace.y = -clipSpace.y;
  gl_Position = vec4(clipSpace, 0.0, 1.0);
  gl_Position.z += u_zOffset;
  v_texCoord = a_uvOrigin + a_position * a_uvSize;
  v_color = a_color;
}
