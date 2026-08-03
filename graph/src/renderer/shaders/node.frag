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
float sdCircle(vec2 p, float r) {
  return length(p) - r;
}

float boxSDF(vec2 p, vec2 halfSize) {
  vec2 d = abs(p) - halfSize;
  return length(max(d, 0.0f)) + min(max(d.x, d.y), 0.0f);
}

float sdPlus(vec2 p, float radius) {
  float w = radius * 0.30f;
  float l = radius * 0.60f;
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

  float aa = fwidth(strokeD) * 0.8f;

  // Alpha for the entire node (fill + stroke)
  float strokeAlpha = 1.0f - smoothstep(-aa, aa, strokeD);
  // Alpha for the fill area (inside stroke ring)
  float fillAlpha = 1.0f - smoothstep(-aa, aa, fillD);

  // Stroke color in the ring, fill color inside
  fragColor = mix(v_strokeColor, v_color, fillAlpha);
  fragColor.a *= strokeAlpha;

  // 图标：仅在节点内缩小的圆形区域内绘制（外部露出填充色，形成 padding 环）
  if(v_hasIcon > 0.5f && fillAlpha > 0.01f) {
    float iconR = v_radius * ICON_INSET;
    float iconD = sdCircle(v_localPos, iconR);
    float iconAA = fwidth(iconD) * 0.8f;
    float iconArea = 1.0f - smoothstep(-iconAA, iconAA, iconD);
    if(iconArea > 0.01f) {
      // 图标区域半径 → [0,1] UV
      vec2 uv = (v_localPos / (2.0f * iconR)) + 0.5f;
      uv = clamp(uv, 0.0f, 1.0f);
      vec2 texUv = mix(v_iconUv.xy, v_iconUv.zw, uv);
      vec4 icon = texture(u_iconAtlas, texUv);
      vec3 mixed = mix(v_color.rgb, icon.rgb, icon.a);
      fragColor.rgb = mix(fragColor.rgb, mixed, fillAlpha * iconArea);
      // 图标区域保持节点整体透明度（hidden 等低透明状态时随 v_color.a 淡出，
      // 不再强制置 1，否则隐藏节点只剩 18% 填充环变淡、视觉几乎无变化）
      fragColor.a = mix(fragColor.a, v_color.a, fillAlpha * iconArea);
    }
  }

  // Draw plus badge at configurable position (inside a white circle)
  if(v_showPlus > 0.5f) {
    vec2 plusOffset = vec2(v_radius * v_plusOffsetX, v_radius * v_plusOffsetY);
    vec2 plusPos = v_localPos - plusOffset;
    float plusRadius = v_radius * v_plusScale;

    // 1. White circle background (使用屏幕空间 aa)
    float badgeD = sdCircle(plusPos, plusRadius);
    float badgeAA = fwidth(badgeD) * 0.8f;
    float badgeAlpha = 1.0f - smoothstep(-badgeAA, badgeAA, badgeD);
    if(badgeAlpha > 0.01f) {
      fragColor.rgb = mix(fragColor.rgb, vec3(1.0f, 1.0f, 1.0f), badgeAlpha);
      fragColor.a = max(fragColor.a, badgeAlpha);
    }

    // 2. Red plus symbol inside the badge
    float plusD = sdPlus(plusPos, plusRadius * 0.85f);
    float plusAA = fwidth(plusD) * 0.8f;
    float plusAlpha = 1.0f - smoothstep(-plusAA, plusAA, plusD);
    if(badgeAlpha > 0.01f && plusAlpha > 0.01f) {
      vec4 plusColor = vec4(0.913f, 0.271f, 0.376f, 1.0f);
      fragColor.rgb = mix(fragColor.rgb, plusColor.rgb, plusAlpha);
      fragColor.a = max(fragColor.a, plusAlpha);
    }
  }

  if(fragColor.a < 0.01f)
    discard;
}
