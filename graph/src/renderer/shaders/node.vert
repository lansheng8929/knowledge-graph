#version 300 es
precision highp float;

layout(location = 0) in vec2 a_position;       // quad corner [-1,1]
layout(location = 1) in vec2 a_center;         // instance: center
layout(location = 2) in float a_radius;        // instance: radius
layout(location = 3) in vec4 a_color;          // instance: fill color
layout(location = 4) in vec4 a_strokeColor;    // instance: stroke color
layout(location = 5) in float a_strokeWidth;   // instance: stroke width
layout(location = 6) in float a_shapeType;     // instance: shape enum
layout(location = 7) in float a_shapeParam;    // instance: shape parameter
layout(location = 8) in float a_showPlus;      // instance: show plus button
layout(location = 9) in float a_plusOffsetX;   // instance: plus offset X
layout(location = 10) in float a_plusOffsetY;  // instance: plus offset Y
layout(location = 11) in float a_plusScale;    // instance: plus size scale
layout(location = 12) in float a_hasIcon;      // instance: has icon (0/1)
layout(location = 13) in vec4 a_iconUv;        // instance: icon UV [u0,v0,u1,v1]
uniform vec2 u_resolution;
uniform vec2 u_translation;
uniform float u_scale;
uniform float u_zOffset;

out vec4 v_color;
out vec4 v_strokeColor;
out float v_radius;
out float v_strokeWidth;
out vec2 v_localPos;
out float v_shapeType;
out float v_shapeParam;
out float v_showPlus;
out float v_plusOffsetX;
out float v_plusOffsetY;
out float v_plusScale;
out float v_hasIcon;
out vec4 v_iconUv;

void main() {
  float halfSize = a_radius + a_strokeWidth;
  vec2 screenPos = (a_center + u_translation) * u_scale + a_position * halfSize * u_scale;
  vec2 clipSpace = (screenPos / u_resolution) * 2.0 - 1.0;
  clipSpace.y = -clipSpace.y;
  gl_Position = vec4(clipSpace, 0.0, 1.0);
  gl_Position.z += u_zOffset;

  v_color = a_color;
  v_strokeColor = a_strokeColor;
  v_radius = a_radius;
  v_strokeWidth = a_strokeWidth;
  v_localPos = a_position * halfSize;
  v_shapeType = a_shapeType;
  v_shapeParam = a_shapeParam;
  v_showPlus = a_showPlus;
  v_plusOffsetX = a_plusOffsetX;
  v_plusOffsetY = a_plusOffsetY;
  v_plusScale = a_plusScale;
  v_hasIcon = a_hasIcon;
  v_iconUv = a_iconUv;
}
