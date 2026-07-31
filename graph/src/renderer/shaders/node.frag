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
in float v_hasIcon;
in vec4 v_iconUv;

uniform sampler2D u_iconAtlas;

out vec4 fragColor;

// 图标占节点直径的比例（剩余为节点填充色的 padding 环）
#define ICON_INSET 0.82

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
  // SDF for fill circle (inner edge)
  float fillD = shapeSDF(v_localPos, v_radius, v_shapeType, v_shapeParam);
  // SDF for stroke circle (outer edge)
  float strokeD = shapeSDF(v_localPos, v_radius + v_strokeWidth, v_shapeType, v_shapeParam);

  float aa = fwidth(strokeD) * 0.8;

  // Alpha for the entire node (fill + stroke)
  float strokeAlpha = 1.0 - smoothstep(-aa, aa, strokeD);
  // Alpha for the fill area (inside stroke ring)
  float fillAlpha = 1.0 - smoothstep(-aa, aa, fillD);

  // Stroke color in the ring, fill color inside
  fragColor = mix(v_strokeColor, v_color, fillAlpha);
  fragColor.a *= strokeAlpha;

  // 图标：仅在节点内缩小的圆形区域内绘制（外部露出填充色，形成 padding 环）
  if (v_hasIcon > 0.5 && fillAlpha > 0.01) {
    float iconR = v_radius * ICON_INSET;
    float iconD = sdCircle(v_localPos, iconR);
    float iconAA = fwidth(iconD) * 0.8;
    float iconArea = 1.0 - smoothstep(-iconAA, iconAA, iconD);
    if (iconArea > 0.01) {
      // 图标区域半径 → [0,1] UV
      vec2 uv = (v_localPos / (2.0 * iconR)) + 0.5;
      uv = clamp(uv, 0.0, 1.0);
      vec2 texUv = mix(v_iconUv.xy, v_iconUv.zw, uv);
      vec4 icon = texture(u_iconAtlas, texUv);
      vec3 mixed = mix(v_color.rgb, icon.rgb, icon.a);
      fragColor.rgb = mix(fragColor.rgb, mixed, fillAlpha * iconArea);
      fragColor.a = mix(fragColor.a, 1.0, fillAlpha * iconArea);
    }
  }

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
