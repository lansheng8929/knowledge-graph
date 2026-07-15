#version 300 es
precision highp float;

in vec2 v_texCoord;
in vec4 v_color;

uniform sampler2D u_texture;

out vec4 fragColor;

void main() {
  float alpha = texture(u_texture, v_texCoord).a;
  fragColor = vec4(v_color.rgb, v_color.a * alpha);
  if (fragColor.a < 0.01) discard;
}
