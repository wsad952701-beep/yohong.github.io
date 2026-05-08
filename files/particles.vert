// =====================================================================
// Quantum Particle Field — Vertex Shader
// ---------------------------------------------------------------------
// 每個粒子都有一個「種子」位置 (aSeed)，
// 我們用 curl noise 在 GPU 上即時計算偏移，產生流體般的湧動。
// 並依據攝影機距離調整大小，避免遠處粒子過小消失。
// =====================================================================

uniform float uTime;
uniform float uScroll;        // 0..1 滾動進度
uniform float uSize;          // 粒子基準尺寸
uniform float uSpread;        // 整體空間半徑
uniform float uTurbulence;    // 紊流強度
uniform vec3  uPointer;       // 滑鼠在世界座標的位置（含 z）
uniform float uPointerStrength;
uniform float uPixelRatio;

attribute vec3  aSeed;        // 初始位置種子（決定形狀）
attribute float aRandom;      // 0..1 個體隨機數
attribute float aLayer;       // 0..3 屬於哪一章節

varying vec3  vColor;
varying float vAlpha;
varying float vDistanceFromCenter;

// ---------- Simplex / Curl noise (Ashima Arts, MIT) -------------------
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

vec3 curlNoise(vec3 p) {
  const float e = 0.1;
  vec3 dx = vec3(e, 0.0, 0.0);
  vec3 dy = vec3(0.0, e, 0.0);
  vec3 dz = vec3(0.0, 0.0, e);

  vec3 p_x0 = vec3(snoise(p - dx), snoise(p - dy), snoise(p - dz));
  vec3 p_x1 = vec3(snoise(p + dx), snoise(p + dy), snoise(p + dz));
  vec3 p_y0 = vec3(snoise(p + 31.416 - dx), snoise(p + 31.416 - dy), snoise(p + 31.416 - dz));
  vec3 p_y1 = vec3(snoise(p + 31.416 + dx), snoise(p + 31.416 + dy), snoise(p + 31.416 + dz));

  float x = p_y1.z - p_y0.z - p_x1.y + p_x0.y;
  float y = p_x1.x - p_x0.x - p_y1.z + p_y0.z;
  float z = p_y1.y - p_y0.y - p_x1.x + p_x0.x;
  return normalize(vec3(x, y, z) / (2.0 * e));
}

void main() {
  vec3 seed = aSeed;

  // ----- 形變：依滾動進度在四種形狀之間插值 -----
  // 0: 球體 (chapter 0) → 1: 旋臂 (chapter 1) → 2: 立方網格 (chapter 2) → 3: 散逸 (chapter 3)
  float chapterFloat = uScroll * 3.0;
  float idxBase = floor(chapterFloat);
  float idxLerp = fract(chapterFloat);

  // 簡化：我們用三角函數合成出四種空間分布
  vec3 shapeA = seed; // 球
  vec3 shapeB = vec3(                                 // 雙螺旋
    cos(seed.y * 2.0 + uTime * 0.1) * length(seed.xz),
    seed.y,
    sin(seed.y * 2.0 + uTime * 0.1) * length(seed.xz)
  );
  vec3 shapeC = vec3(                                 // 立方晶格
    sign(seed.x) * pow(abs(seed.x), 0.7) * 1.4,
    sign(seed.y) * pow(abs(seed.y), 0.7) * 1.4,
    sign(seed.z) * pow(abs(seed.z), 0.7) * 1.4
  );
  vec3 shapeD = seed * (2.5 + aRandom * 1.5);         // 散逸

  vec3 from, to;
  if (idxBase < 1.0)      { from = shapeA; to = shapeB; }
  else if (idxBase < 2.0) { from = shapeB; to = shapeC; }
  else                    { from = shapeC; to = shapeD; }

  // 以 smoothstep 平滑章節銜接
  float t = smoothstep(0.0, 1.0, idxLerp);
  vec3 pos = mix(from, to, t) * uSpread;

  // ----- Curl noise 紊流（時間驅動） -----
  vec3 noisePos = pos * 0.3 + vec3(uTime * 0.05, 0.0, uTime * 0.04);
  vec3 turb = curlNoise(noisePos) * uTurbulence * (0.8 + aRandom * 0.6);
  pos += turb;

  // ----- 滑鼠互動：粒子被推離游標 -----
  vec3 toPointer = pos - uPointer;
  float pointerDist = length(toPointer);
  float pushFactor = uPointerStrength * exp(-pointerDist * pointerDist * 0.05);
  pos += normalize(toPointer + 0.0001) * pushFactor;

  vDistanceFromCenter = length(pos) / (uSpread * 1.5);

  // ----- 顏色：依章節 + 距離調色 -----
  vec3 cyan   = vec3(0.498, 0.910, 1.000);
  vec3 azure  = vec3(0.361, 0.659, 1.000);
  vec3 plasma = vec3(0.780, 0.490, 1.000);
  vec3 ember  = vec3(1.000, 0.718, 0.420);

  float chapterColor = uScroll;
  vec3 colA = mix(cyan, azure, smoothstep(0.0, 0.33, chapterColor));
  vec3 colB = mix(colA, plasma, smoothstep(0.33, 0.66, chapterColor));
  vec3 colFinal = mix(colB, ember, smoothstep(0.66, 1.0, chapterColor));

  // 微調：邊緣粒子偏暖、核心粒子偏冷
  vColor = mix(colFinal, ember, smoothstep(0.5, 1.4, vDistanceFromCenter) * 0.35);

  // 透明度依距離 fade
  vAlpha = smoothstep(2.0, 0.4, vDistanceFromCenter) * (0.55 + aRandom * 0.45);

  // ----- 投影 -----
  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  // 點大小依距攝影機距離
  float distToCam = -mvPosition.z;
  gl_PointSize = uSize * uPixelRatio * (1.0 + aRandom * 0.8) * (300.0 / max(distToCam, 1.0));
}
