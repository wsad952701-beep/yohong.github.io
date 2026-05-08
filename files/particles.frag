// =====================================================================
// Quantum Particle Field — Fragment Shader
// ---------------------------------------------------------------------
// 將每個粒子繪製為帶高光核心的軟邊光點。
// 加入細微的色差，模擬透鏡焦散。
// =====================================================================

precision highp float;

varying vec3  vColor;
varying float vAlpha;
varying float vDistanceFromCenter;

void main() {
  // gl_PointCoord 從 (0,0) 至 (1,1)
  vec2 uv = gl_PointCoord - 0.5;
  float dist = length(uv);

  // 兩層發光：硬核 + 軟暈
  float core = 1.0 - smoothstep(0.0, 0.18, dist);
  float halo = 1.0 - smoothstep(0.18, 0.5, dist);

  // 微妙色散：把暈光的 R 與 B 通道偏移，模擬透鏡 chromatic
  vec3 colorWithChroma = vColor;
  colorWithChroma.r *= 1.0 + halo * 0.1;
  colorWithChroma.b *= 1.0 + halo * 0.06;

  vec3 finalColor = colorWithChroma * (core * 1.6 + halo * 0.55);

  // 整體 alpha
  float alpha = (core + halo * 0.7) * vAlpha;

  // 丟棄完全透明的片元
  if (alpha < 0.005) discard;

  gl_FragColor = vec4(finalColor, alpha);
}
