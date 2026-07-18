#version 300 es
precision highp float;

layout(location = 0) in vec2 a_position;       // quad corner [-1,1]
layout(location = 1) in vec2 a_center;         // instance: badge center (world)
layout(location = 2) in float a_radius;        // instance: badge radius (world)
layout(location = 3) in float a_nodeId;        // instance: node id index

uniform vec2 u_resolution;
uniform vec2 u_translation;
uniform float u_scale;
uniform float u_zOffset;
uniform float u_borderWidth;

out vec2 v_localPos;
out float v_radius;
flat out int v_instanceId;

void main() {
  float halfSize = a_radius + u_borderWidth;
  vec2 screenPos = (a_center + u_translation) * u_scale + a_position * halfSize * u_scale;
  vec2 clipSpace = (screenPos / u_resolution) * 2.0 - 1.0;
  clipSpace.y = -clipSpace.y;
  gl_Position = vec4(clipSpace, 0.0, 1.0);
  gl_Position.z += u_zOffset;

  v_localPos = a_position * halfSize;
  v_radius = a_radius;
  v_instanceId = gl_InstanceID;
}
