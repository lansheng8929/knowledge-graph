#version 300 es
precision highp float;

in vec4 v_color;
in vec4 v_strokeColor;
in float v_radius;
in float v_strokeWidth;
in vec2 v_localPos;
in float v_shapeType;
in float v_shapeParam;
in float v_showPlus;
in float v_plusOffsetX;
in float v_plusOffsetY;
in float v_plusScale;

out vec4 fragColor;

// ---- SDF primitives ----
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

float shapeSDF(vec2 p, float radius, float type, float param) {
  return sdCircle(p, radius);
}

// ---- Main ----
void main() {
  float outerRadius = v_radius + v_strokeWidth;
  float d = shapeSDF(v_localPos, outerRadius, v_shapeType, v_shapeParam);
  float innerD = shapeSDF(v_localPos, v_radius, v_shapeType, v_shapeParam);

  // 屏幕空间抗锯齿：使用 fwidth 让过渡宽度约为 1 像素
  float aa = fwidth(d) * 0.8;
  float outerAlpha = 1.0 - smoothstep(-aa, aa, d);
  float fillAlpha = 1.0 - smoothstep(-aa, aa, innerD);
  float strokeAlpha = smoothstep(-aa, aa, innerD) * (1.0 - smoothstep(-aa, aa, d));

  vec4 color = v_color;
  color.a *= fillAlpha;

  vec4 stroke = v_strokeColor;
  stroke.a *= strokeAlpha;

  fragColor = stroke + color * (1.0 - stroke.a);
  fragColor.a = max(fillAlpha * v_color.a, strokeAlpha * v_strokeColor.a);
  fragColor.a *= outerAlpha;

  // Draw plus badge at configurable position (inside a white circle)
  if (v_showPlus > 0.5) {
    vec2 plusOffset = vec2(v_radius * v_plusOffsetX, v_radius * v_plusOffsetY);
    vec2 plusPos = v_localPos - plusOffset;
    float plusRadius = v_radius * v_plusScale;

    // 1. White circle background (使用屏幕空间 aa)
    float badgeD = sdCircle(plusPos, plusRadius);
    float badgeAA = fwidth(badgeD) * 0.8;
    float badgeAlpha = 1.0 - smoothstep(-badgeAA, badgeAA, badgeD);
    if (badgeAlpha > 0.01) {
      fragColor.rgb = mix(fragColor.rgb, vec3(1.0, 1.0, 1.0), badgeAlpha);
      fragColor.a = max(fragColor.a, badgeAlpha);
    }

    // 2. Red plus symbol inside the badge
    float plusD = sdPlus(plusPos, plusRadius * 0.85);
    float plusAA = fwidth(plusD) * 0.8;
    float plusAlpha = 1.0 - smoothstep(-plusAA, plusAA, plusD);
    if (badgeAlpha > 0.01 && plusAlpha > 0.01) {
      vec4 plusColor = vec4(0.913, 0.271, 0.376, 1.0);
      fragColor.rgb = mix(fragColor.rgb, plusColor.rgb, plusAlpha);
      fragColor.a = max(fragColor.a, plusAlpha);
    }
  }

  if (fragColor.a < 0.01) discard;
}
