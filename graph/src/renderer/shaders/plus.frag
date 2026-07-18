#version 300 es
precision highp float;

in vec2 v_localPos;
in float v_radius;
flat in float v_nodeId;

uniform float u_borderWidth;
uniform vec4 u_borderColor;

out vec4 fragColor;

// SDF primitives
float sdCircle(vec2 p, float r) {
  return length(p) - r;
}

float boxSDF(vec2 p, vec2 halfSize) {
  vec2 d = abs(p) - halfSize;
  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}

float sdPlus(vec2 p, float radius) {
  float w = radius * 0.20;
  float l = radius * 0.60;
  float hBar = boxSDF(p, vec2(l, w));
  float vBar = boxSDF(p, vec2(w, l));
  return min(hBar, vBar);
}

void main() {
  // Screen-space anti-aliasing
  vec2 deriv = dFdx(v_localPos) + dFdy(v_localPos);
  float aa = length(deriv) * 1.5;

  // Outer circle (includes border)
  float outerD = sdCircle(v_localPos, v_radius + u_borderWidth);
  // Inner circle (white fill area)
  float innerD = sdCircle(v_localPos, v_radius);

  // Border ring: between outer and inner circle
  float outerAlpha = 1.0 - smoothstep(-aa, aa, outerD);
  float fillAlpha = 1.0 - smoothstep(-aa, aa, innerD);
  float borderAlpha = smoothstep(-aa, aa, innerD) * (1.0 - smoothstep(-aa, aa, outerD));

  if (outerAlpha < 0.01) discard;

  // Start with border color ring
  vec3 color = u_borderColor.rgb;
  float alpha = borderAlpha * u_borderColor.a;

  // White fill on top
  color = mix(color, vec3(1.0), fillAlpha);
  alpha = max(alpha, fillAlpha);

  // Red plus symbol inside
  float plusD = sdPlus(v_localPos, v_radius * 0.85);
  float plusAA = length(deriv) * 0.8;
  float plusAlpha = 1.0 - smoothstep(-plusAA, plusAA, plusD);
  color = mix(color, vec3(0.913, 0.271, 0.376), plusAlpha);
  alpha = max(alpha, plusAlpha);

  fragColor = vec4(color, alpha);
}
