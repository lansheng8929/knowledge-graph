#version 300 es
precision highp float;

flat in int v_instanceId;
out vec4 fragColor;

void main() {
  int idx = v_instanceId;
  fragColor = vec4(
    float((idx >> 16) & 0xFF) / 255.0,
    float((idx >> 8) & 0xFF) / 255.0,
    float(idx & 0xFF) / 255.0,
    1.0
  );
}
