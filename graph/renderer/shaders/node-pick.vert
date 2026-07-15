#version 300 es
precision highp float;

layout(location = 0) in vec2 a_position;       // quad corner [-1,1]
layout(location = 1) in vec2 a_center;         // instance: center
layout(location = 2) in float a_radius;        // instance: radius
layout(location = 3) in vec4 a_color;          // (unused in pick)
layout(location = 4) in vec4 a_strokeColor;    // (unused in pick)
layout(location = 5) in float a_strokeWidth;   // instance: stroke width
layout(location = 6) in float a_shapeType;     // instance: shape enum
layout(location = 7) in float a_shapeParam;    // instance: shape parameter

uniform vec2 u_resolution;
uniform vec2 u_translation;
uniform float u_scale;
uniform float u_zOffset;

out vec2 v_localPos;
out float v_radius;
out float v_strokeWidth;
out float v_shapeType;
out float v_shapeParam;
flat out int v_instanceId;

void main() {
  float halfSize = a_radius + a_strokeWidth;
  vec2 screenPos = (a_center + u_translation) * u_scale + a_position * halfSize * u_scale;
  vec2 clipSpace = (screenPos / u_resolution) * 2.0 - 1.0;
  clipSpace.y = -clipSpace.y;
  gl_Position = vec4(clipSpace, 0.0, 1.0);
  gl_Position.z += u_zOffset;

  v_localPos = a_position * halfSize;
  v_radius = a_radius;
  v_strokeWidth = a_strokeWidth;
  v_shapeType = a_shapeType;
  v_shapeParam = a_shapeParam;
  v_instanceId = gl_InstanceID;
}
