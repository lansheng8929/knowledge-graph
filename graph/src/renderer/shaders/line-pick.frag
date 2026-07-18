#version 300 es
precision highp float;

flat in uint v_instanceId;
out vec4 fragColor;

void main() {
  uint idx = v_instanceId;
  fragColor = vec4(
    float((idx >> 16u) & 0xFFu) / 255.0,
    float((idx >> 8u) & 0xFFu) / 255.0,
    float(idx & 0xFFu) / 255.0,
    1.0
  );
}
