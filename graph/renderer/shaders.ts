/**
 * WebGL 2.0 Shader Programs
 */

// ---- Vertex shader: instanced circles ----
export const CIRCLE_VS = `#version 300 es
precision highp float;

layout(location = 0) in vec2 a_position;      // quad corner
layout(location = 1) in vec2 a_center;        // instance: circle center
layout(location = 2) in float a_radius;       // instance: circle radius
layout(location = 3) in vec4 a_color;          // instance: fill color
layout(location = 4) in vec4 a_strokeColor;    // instance: stroke color
layout(location = 5) in float a_strokeWidth;   // instance: stroke width

uniform vec2 u_resolution;
uniform vec2 u_translation;
uniform float u_scale;

out vec4 v_color;
out vec4 v_strokeColor;
out float v_radius;
out float v_strokeWidth;
out vec2 v_center;
out vec2 v_localPos;

void main() {
  vec2 screenPos = (a_center + u_translation) * u_scale + a_position * (a_radius + a_strokeWidth) * u_scale;
  vec2 clipSpace = (screenPos / u_resolution) * 2.0 - 1.0;
  clipSpace.y = -clipSpace.y;
  gl_Position = vec4(clipSpace, 0.0, 1.0);

  v_color = a_color;
  v_strokeColor = a_strokeColor;
  v_radius = a_radius;
  v_strokeWidth = a_strokeWidth;
  v_center = a_center * u_scale;
  v_localPos = a_position * (a_radius + a_strokeWidth);
}
`

// ---- Fragment shader: anti-aliased circles ----
export const CIRCLE_FS = `#version 300 es
precision highp float;

in vec4 v_color;
in vec4 v_strokeColor;
in float v_radius;
in float v_strokeWidth;
in vec2 v_center;
in vec2 v_localPos;

out vec4 fragColor;

void main() {
  float dist = length(v_localPos);
  float outerRadius = v_radius + v_strokeWidth;

  // Smooth anti-aliased edge for stroke outer
  float outerAlpha = 1.0 - smoothstep(outerRadius - 1.5, outerRadius + 0.5, dist);

  // Inner fill
  float fillAlpha = 1.0 - smoothstep(v_radius - 1.0, v_radius + 0.5, dist);

  // Stroke ring
  float strokeStart = max(0.0, v_radius - 0.5);
  float strokeAlpha = smoothstep(strokeStart - 0.5, strokeStart + 0.5, dist)
                    * (1.0 - smoothstep(outerRadius - 1.5, outerRadius + 0.5, dist));

  // Blend: fill first, then stroke on top
  vec4 color = v_color;
  color.a *= fillAlpha;

  vec4 stroke = v_strokeColor;
  stroke.a *= strokeAlpha;

  // Pre-multiplied alpha blending: stroke over fill
  fragColor = stroke + color * (1.0 - stroke.a);

  // Ensure outer edge fades
  fragColor.a = max(fillAlpha * v_color.a, strokeAlpha * v_strokeColor.a);
  fragColor.a *= outerAlpha;

  if (fragColor.a < 0.01) discard;
}
`

// ---- Vertex shader: lines (links) ----
export const LINE_VS = `#version 300 es
precision highp float;

layout(location = 0) in vec2 a_position;       // (0,0) -> (1,1) for line segment
layout(location = 1) in vec2 a_source;          // instance: start point
layout(location = 2) in vec2 a_target;          // instance: end point
layout(location = 3) in vec4 a_color;           // instance: line color
layout(location = 4) in float a_width;          // instance: line width

uniform vec2 u_resolution;
uniform vec2 u_translation;
uniform float u_scale;

out vec4 v_color;

void main() {
  // Transform to screen space
  vec2 s = (a_source + u_translation) * u_scale;
  vec2 t = (a_target + u_translation) * u_scale;

  vec2 dir = normalize(t - s);
  vec2 norm = vec2(-dir.y, dir.x);
  float halfW = a_width * u_scale * 0.5 + 1.0;

  // Extend the line segment: a_position.x=0 means start, 1 means end
  // a_position.y=-1 means left offset, +1 means right offset
  vec2 pos = mix(s, t, a_position.x) + norm * a_position.y * halfW;

  vec2 clipSpace = (pos / u_resolution) * 2.0 - 1.0;
  clipSpace.y = -clipSpace.y;
  gl_Position = vec4(clipSpace, 0.0, 1.0);

  v_color = a_color;
}
`

// ---- Fragment shader: lines with anti-aliasing ----
export const LINE_FS = `#version 300 es
precision highp float;

in vec4 v_color;
out vec4 fragColor;

void main() {
  // Simple: already anti-aliased by width padding
  fragColor = v_color;
  if (fragColor.a < 0.01) discard;
}
`

// ---- Vertex shader: arrow heads (triangles) ----
export const ARROW_VS = `#version 300 es
precision highp float;

layout(location = 0) in vec2 a_position;       // triangle vertex in unit space
layout(location = 1) in vec2 a_tip;            // instance: arrow tip (target point)
layout(location = 2) in vec2 a_dir;            // instance: direction to arrow
layout(location = 3) in vec4 a_color;          // instance: arrow color
layout(location = 4) in float a_size;          // instance: arrow size

uniform vec2 u_resolution;
uniform vec2 u_translation;
uniform float u_scale;

out vec4 v_color;

void main() {
  vec2 tip = (a_tip + u_translation) * u_scale;
  float size = a_size * u_scale;

  // Arrow points backwards from tip
  vec2 dir = normalize(a_dir);
  vec2 norm = vec2(-dir.y, dir.x);

  // a_position: (0,0) = base center, (-1,1)/(-1,-1)/(0,0) for triangle
  vec2 offset = a_position.x * (-dir * size) + a_position.y * (norm * size * 0.5);

  vec2 pos = tip + offset;
  vec2 clipSpace = (pos / u_resolution) * 2.0 - 1.0;
  clipSpace.y = -clipSpace.y;
  gl_Position = vec4(clipSpace, 0.0, 1.0);

  v_color = a_color;
}
`

// ---- Fragment shader: arrows ----
export const ARROW_FS = `#version 300 es
precision highp float;

in vec4 v_color;
out vec4 fragColor;

void main() {
  fragColor = v_color;
  if (fragColor.a < 0.01) discard;
}
`

// ---- Picking shaders (simpler, no anti-aliasing needed) ----
export const PICK_CIRCLE_VS = CIRCLE_VS
export const PICK_LINE_VS = LINE_VS
export const PICK_ARROW_VS = ARROW_VS

export const PICK_CIRCLE_FS = `#version 300 es
precision highp float;

in vec4 v_color;
in vec4 v_strokeColor;
in float v_radius;
in float v_strokeWidth;
in vec2 v_center;
in vec2 v_localPos;

uniform vec4 u_pickColor;

out vec4 fragColor;

void main() {
  float dist = length(v_localPos);
  float outerRadius = v_radius + v_strokeWidth;
  if (dist <= outerRadius + 1.0) {
    fragColor = u_pickColor;
  } else {
    discard;
  }
}
`

export const PICK_LINE_FS = `#version 300 es
precision highp float;

in vec4 v_color;
uniform vec4 u_pickColor;
out vec4 fragColor;

void main() {
  fragColor = u_pickColor;
}
`

export const PICK_ARROW_FS = `#version 300 es
precision highp float;

in vec4 v_color;
uniform vec4 u_pickColor;
out vec4 fragColor;

void main() {
  fragColor = u_pickColor;
}
`

// ---- Text rendering: vertex shader for textured quads ----
export const TEXT_VS = `#version 300 es
precision highp float;

layout(location = 0) in vec2 a_position;       // quad corner (0-1)
layout(location = 1) in vec2 a_texCoord;       // texture coordinate
layout(location = 2) in vec2 a_center;         // instance: text position
layout(location = 3) in vec2 a_size;           // instance: text quad size
layout(location = 4) in vec4 a_color;          // instance: text color

uniform vec2 u_resolution;
uniform vec2 u_translation;
uniform float u_scale;

out vec2 v_texCoord;
out vec4 v_color;

void main() {
  vec2 screenPos = (a_center + u_translation) * u_scale
                 + (a_position - 0.5) * a_size * u_scale;
  vec2 clipSpace = (screenPos / u_resolution) * 2.0 - 1.0;
  clipSpace.y = -clipSpace.y;
  gl_Position = vec4(clipSpace, 0.0, 1.0);
  v_texCoord = a_texCoord;
  v_color = a_color;
}
`

export const TEXT_FS = `#version 300 es
precision highp float;

in vec2 v_texCoord;
in vec4 v_color;

uniform sampler2D u_texture;

out vec4 fragColor;

void main() {
  float alpha = texture(u_texture, v_texCoord).a;
  fragColor = vec4(v_color.rgb, v_color.a * alpha);
  if (fragColor.a < 0.01) discard;
}
`
