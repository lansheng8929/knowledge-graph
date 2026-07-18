#version 300 es
precision highp float;

in vec2 v_localPos;
in float v_radius;
in float v_strokeWidth;
in float v_shapeType;
in float v_shapeParam;
flat in int v_instanceId;

out vec4 fragColor;

float sdCircle(vec2 p, float r) { return length(p) - r; }

float shapeSDF(vec2 p, float radius, float type, float param) {
  return sdCircle(p, radius);
}

void main() {
  float outerRadius = v_radius + v_strokeWidth;
  float d = shapeSDF(v_localPos, outerRadius, v_shapeType, v_shapeParam);
  if (d > 1.5) { discard; return; }

  int idx = v_instanceId;
  fragColor = vec4(
    float((idx >> 16) & 0xFF) / 255.0,
    float((idx >> 8) & 0xFF) / 255.0,
    float(idx & 0xFF) / 255.0,
    1.0
  );
}
