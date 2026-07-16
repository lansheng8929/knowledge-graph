#version 300 es
precision highp float;

in vec2 v_localPos;
in float v_radius;
flat in int v_instanceId;

out vec4 fragColor;

float sdCircle(vec2 p, float r) { return length(p) - r; }

void main() {
  float d = sdCircle(v_localPos, v_radius);
  if (d > 1.5) { discard; return; }

  int idx = v_instanceId;
  fragColor = vec4(
    float((idx >> 16) & 0xFF) / 255.0,
    float((idx >> 8) & 0xFF) / 255.0,
    float(idx & 0xFF) / 255.0,
    1.0
  );
}
