# 量子境界 / Quantum Horizon

> 一個世界級、全 3D 互動、滾動驅動的 Web 沉浸式作品。
> 以 Next.js 15 + React Three Fiber + GSAP ScrollTrigger 打造，
> 視覺語言參照 2026 年 Awwwards / FWA 得獎作品與 Apple Vision Pro 的空間介面。

```
   ╭─────────────────────────────────────────────────────────╮
   │                                                         │
   │      Q U A N T U M   H O R I Z O N    ●   v 0.26.5      │
   │      跨入空間運算的下一個維度                             │
   │                                                         │
   ╰─────────────────────────────────────────────────────────╯
```

---

## ✨ 核心特色

| 維度          | 技術                                                           |
| ------------- | -------------------------------------------------------------- |
| **框架**      | Next.js 15 App Router · React 19 · TypeScript 5.7              |
| **3D 引擎**   | React Three Fiber 9 · Drei 10 · Three.js 0.171                 |
| **著色器**    | 自定義 GLSL — Curl Noise 粒子 / FBM 噪聲星雲                   |
| **動畫**      | GSAP 3.12 + ScrollTrigger（攝影機四段空間路徑）                |
| **滾動**      | Lenis 慣性滾動，與 GSAP ticker 同步                            |
| **後製**      | Bloom / Chromatic Aberration / Vignette / Film Grain           |
| **樣式**      | Tailwind CSS 4.0（CSS-first 設定）+ 自定義玻璃材質             |
| **字型**      | Noto Serif TC（標題）/ Noto Sans TC（內文）                    |
| **效能**      | 四級裝置分級（ultra / high / balanced / lite），自動降階       |
| **無障礙**    | 尊重 `prefers-reduced-motion`，行動裝置自動降低粒子數          |

---

## 🚀 一鍵啟動

> **環境需求**：Node.js ≥ 18.18，建議使用 20 LTS。

```bash
# 1. 複製或下載專案後，進入目錄
cd quantum-horizon

# 2. 安裝依賴（任選一個套件管理器）
npm install
# 或
pnpm install
# 或
bun install

# 3. 啟動開發伺服器
npm run dev

# 4. 在瀏覽器打開
# → http://localhost:3000
```

開發伺服器啟動後會看到讀取動畫，
**請靜置 1.5 秒**讓粒子場初始化，然後開始滾動體驗四章節敘事。

---

## 📦 專案結構

```
quantum-horizon/
├── app/
│   ├── globals.css           ← Tailwind 4 @theme + 玻璃工具類 + 動畫
│   ├── layout.tsx            ← 字型載入 + Metadata
│   └── page.tsx              ← 主頁面（4 章節滾動敘事）
├── components/
│   ├── shaders/
│   │   ├── particles.vert    ← 粒子頂點（Curl Noise 形變）
│   │   ├── particles.frag    ← 粒子片元（軟邊發光）
│   │   ├── nebula.vert       ← 星雲頂點（全屏 quad）
│   │   └── nebula.frag       ← 星雲片元（FBM 雲氣）
│   ├── Scene.tsx             ← R3F Canvas 主容器 + EffectComposer
│   ├── CameraRig.tsx         ← ★ GSAP 攝影機路徑動畫
│   ├── ParticleField.tsx     ← 量子粒子（最多 80,000 顆）
│   ├── NebulaBackground.tsx  ← 動態深空背景
│   ├── CrystalCore.tsx       ← 中央折射晶體（章節 II 主視覺）
│   ├── NetworkLattice.tsx    ← 網絡節點（章節 III 主視覺）
│   ├── Navigation.tsx        ← 玻璃浮動導覽
│   ├── GlassCard.tsx         ← 物理感玻璃卡片
│   ├── Loader.tsx            ← 進場讀取動畫
│   ├── Cursor.tsx            ← 自定義雙環游標
│   ├── SmoothScroll.tsx      ← Lenis 平滑滾動整合
│   └── PerformanceGuard.tsx  ← 裝置分級降階哨兵
├── tailwind.config.ts        ← Tailwind 擴充
├── postcss.config.mjs
├── next.config.mjs           ← 含 GLSL loader 設定
└── tsconfig.json
```

---

## 🎬 滾動敘事的四個章節

| #   | 中文名 | 英文名      | 鏡頭位置          | 主視覺         |
| --- | ------ | ----------- | ----------------- | -------------- |
| I   | 入境   | Entry       | `[0, 0.4, 9.5]`   | 粒子球體       |
| II  | 晶核   | The Core    | `[2.5, 1, 4.5]`   | 折射晶體       |
| III | 網絡   | Network     | `[-3.5, 0.6, 2]`  | 節點圖譜       |
| IV  | 未來   | Future      | `[0, 2, -2.5]`    | 散逸星塵 + CTA |

`CameraRig.tsx` 中可調整 `CAMERA_KEYFRAMES` 改變整段路徑。

---

## ⚡ 效能調校

`PerformanceGuard.tsx` 會在第一次掛載時偵測：

- `navigator.deviceMemory`
- `navigator.hardwareConcurrency`
- `WEBGL_debug_renderer_info` 的 GPU 字串
- 是否為觸控裝置

依此分為四級：

| Tier        | 粒子數 | DPR        | 後製                                 |
| ----------- | ------ | ---------- | ------------------------------------ |
| `ultra`     | 80,000 | 1 ~ 2      | Bloom + Chromatic + Vignette + Noise |
| `high`      | 40,000 | 1 ~ 1.75   | Bloom + Chromatic + Vignette + Noise |
| `balanced`  | 18,000 | 1 ~ 1.5    | Bloom + Vignette                     |
| `lite`      | 6,000  | 0.75 ~ 1   | 無後製，frameloop 改 demand          |

> 若你想強制使用某一等級，可在 `PerformanceGuard` 的 `detectTier()` 直接回傳該值。

---

## 🌐 部署到 Netlify

```bash
# 1. 推到 GitHub
git init && git add . && git commit -m "init: quantum horizon"
git remote add origin <YOUR_REPO_URL>
git push -u origin main

# 2. 進入 Netlify → Add new site → Import an existing project
#    Build command:    next build
#    Publish directory: .next
#    Functions directory: 留空

# 3. 安裝 Netlify Next.js Runtime（自動偵測，不需手動操作）
```

或使用 CLI：

```bash
npm install -g netlify-cli
netlify init
netlify deploy --prod
```

> 若你偏好 Vercel，本專案是其原生平台，直接 `vercel --prod` 即可。

---

## 🪄 進階：替換 Spline 場景

若想把 Drei 的 `<MeshTransmissionMaterial>` 晶核換成你在 [Spline](https://spline.design/) 設計的 3D 場景：

```tsx
// 1. 安裝 spline 套件
//    npm install @splinetool/react-spline @splinetool/runtime

// 2. 在 components/CrystalCore.tsx 內：
import Spline from '@splinetool/react-spline/next';

export default function CrystalCore() {
  return (
    <Spline
      scene="https://prod.spline.design/你的場景URL/scene.splinecode"
    />
  );
}
```

注意 Spline 場景會獨立於 R3F Canvas 渲染，需自行調整定位。

---

## 🧪 開發備忘

- **熱替換（HMR）**：修改 `.tsx` / `.css` 立即生效；修改 `.glsl` 也會 HMR。
- **檢視效能**：開啟瀏覽器 DevTools → Performance / Frame Rate 面板。
- **除錯 Shader**：在 Console 觀察 `[Perf] tier:` 與 React DevTools 中 `<Canvas>` 的 frameloop。
- **Lenis 與 ScrollTrigger 不同步**：確認 `SmoothScroll.tsx` 已掛載，且 `gsap.registerPlugin` 已執行。

---

## 📜 授權

MIT License — 自由使用、修改、商用。
若你重用了大量原始碼，**邀請你（非強制）**在頁尾加上 “Inspired by Quantum Horizon”。

---

> **🎨 設計理念**
> 我們相信介面應該如同物質、如同光線——
> 它們有重量、會折射、會回應呼吸。
> 量子境界，是這個信念的一次完整宣言。
