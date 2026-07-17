#version 300 es
precision highp float;

in vec2 v_localPos;
in float v_radius;
flat in float v_nodeId;

out vec4 fragColor;

// SDF primitives
float sdCircle(vec2 p, float r) { return length(p) - r; }

float boxSDF(vec2 p, vec2 halfSize) {
  vec2 d = abs(p) - halfSize;
  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}

float sdPlus(vec2 p, float radius) {
  float w = radius * 0.30;
  float l = radius * 0.60;
  float hBar = boxSDF(p, vec2(l, w));
  float vBar = boxSDF(p, vec2(w, l));
  return min(hBar, vBar);
}

void main() {
  float aa = 1.5;

  // 1. White circle background
  float bgD = sdCircle(v_localPos, v_radius);
  float bgAlpha = 1.0 - smoothstep(-aa, aa, bgD);
  if (bgAlpha < 0.01) discard;

  vec3 bgColor = vec3(1.0, 1.0, 1.0);

  // 2. Red plus symbol inside
  float plusD = sdPlus(v_localPos, v_radius * 0.85);
  float plusAlpha = 1.0 - smoothstep(-1.0, 1.0, plusD);

  // Compose: white bg + red plus
  vec3 color = bgColor;
  color = mix(color, vec3(0.913, 0.271, 0.376), plusAlpha);

  float alpha = max(bgAlpha, plusAlpha);
  fragColor = vec4(color, alpha);
}
