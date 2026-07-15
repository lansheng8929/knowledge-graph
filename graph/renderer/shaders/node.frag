#version 300 es
precision highp float;

in vec4 v_color;
in vec4 v_strokeColor;
in float v_radius;
in float v_strokeWidth;
in vec2 v_localPos;
in float v_shapeType;
in float v_shapeParam;

out vec4 fragColor;

// ---- SDF primitives ----
float sdCircle(vec2 p, float r) { return length(p) - r; }

float shapeSDF(vec2 p, float radius, float type, float param) {
  return sdCircle(p, radius);
}

// ---- Main ----
void main() {
  float outerRadius = v_radius + v_strokeWidth;
  float d = shapeSDF(v_localPos, outerRadius, v_shapeType, v_shapeParam);
  float innerD = shapeSDF(v_localPos, v_radius, v_shapeType, v_shapeParam);

  float aa = 1.5;
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

  if (fragColor.a < 0.01) discard;
}
