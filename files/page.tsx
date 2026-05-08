"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { PerformanceGuardProvider } from "@/components/PerformanceGuard";
import Navigation from "@/components/Navigation";
import Loader from "@/components/Loader";
import SmoothScroll from "@/components/SmoothScroll";
import GlassCard from "@/components/GlassCard";

// 3D 場景僅在客戶端載入，避免 SSR 觸發 WebGL
const Scene = dynamic(() => import("@/components/Scene"), { ssr: false });
const Cursor = dynamic(() => import("@/components/Cursor"), { ssr: false });

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* =====================================================================
   量子境界 / Quantum Horizon
   ---------------------------------------------------------------------
   四章節滾動敘事：
     I.  入境  Entry      — 從外緣進入量子場
     II. 晶核  The Core   — 環繞中央折射晶體
     III.網絡  Network    — 穿越節點圖譜
     IV. 未來  Future     — 散逸成星塵，CTA
   ===================================================================== */

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);

  /* ----- 進場時標題逐字浮現 + 滾動章節文字反向視差 ----- */
  useEffect(() => {
    const ctx = gsap.context(() => {
      // 章節文字隨滾動緩慢上升（反向視差）
      gsap.utils.toArray<HTMLElement>(".chapter-content").forEach((el) => {
        gsap.fromTo(
          el,
          { y: 80, opacity: 0, filter: "blur(8px)" },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      // 章節之間的指示器
      gsap.utils.toArray<HTMLElement>(".chapter-marker").forEach((el) => {
        gsap.fromTo(
          el,
          { scaleX: 0, opacity: 0 },
          {
            scaleX: 1,
            opacity: 1,
            duration: 1.4,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
            },
          }
        );
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <PerformanceGuardProvider>
      <Loader />
      <SmoothScroll />
      <Cursor />

      {/* 3D 舞台：永遠固定於背景 */}
      <Scene />

      {/* 頂部導覽 */}
      <Navigation />

      {/* 章節指示器（左下） */}
      <div className="fixed left-6 bottom-6 z-40 hidden md:flex items-center gap-3 font-mono tabular text-[10px] tracking-[0.3em] text-white/40 uppercase">
        <span className="h-px w-8 bg-white/30" />
        <span>Scroll&nbsp;to&nbsp;Travel</span>
        <span className="relative inline-flex h-1.5 w-1.5">
          <span className="absolute inset-0 rounded-full bg-aurora-cyan animate-breath" />
        </span>
      </div>

      {/* 右下浮水印 */}
      <div className="fixed right-6 bottom-6 z-40 hidden md:block font-mono tabular text-[10px] tracking-[0.25em] text-white/35 uppercase text-right">
        <div>VER&nbsp;0.26.5</div>
        <div className="text-white/20">Anthropic&nbsp;/&nbsp;Quantum&nbsp;Horizon</div>
      </div>

      {/* ============================================================
           SCROLL STAGE — ScrollTrigger 在此被釘住，總高 480vh
         ============================================================ */}
      <main id="scroll-stage" className="content-stage relative">

        {/* ────────────  CHAPTER I — 入境  ──────────── */}
        <section
          id="chapter-0"
          ref={heroRef}
          className="relative min-h-[120vh] flex items-center"
        >
          <div className="chapter-content w-full max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-12 gap-6">
              {/* 章節編號 */}
              <div className="col-span-12 md:col-span-3 flex md:flex-col items-center md:items-start gap-4 mb-6">
                <span className="font-mono tabular text-[11px] uppercase tracking-[0.4em] text-aurora-cyan/80">
                  Chapter&nbsp;I
                </span>
                <span className="chapter-marker block h-px w-16 md:w-24 bg-gradient-to-r from-aurora-cyan via-aurora-cyan to-transparent origin-left" />
                <span className="font-display text-[13px] tracking-[0.5em] text-white/50">
                  入境
                </span>
              </div>

              {/* 主標 */}
              <div className="col-span-12 md:col-span-9">
                <h1 className="title-major text-[14vw] md:text-[10vw] lg:text-[140px] mb-8 leading-[0.88]">
                  <span className="block text-white">
                    跨入
                    <span className="text-aurora">空間</span>
                  </span>
                  <span className="block text-white/60 italic font-light">
                    的下一個維度
                  </span>
                </h1>

                <div className="flex flex-col md:flex-row md:items-end gap-8 md:gap-16 mt-10 md:mt-16">
                  <p className="font-display text-[18px] md:text-[20px] leading-[1.7] text-white/75 max-w-xl">
                    當像素自平面解放，當光線開始尊重物質的折射律——我們站在一個轉捩點上。
                    <span className="text-white">
                      量子境界
                    </span>
                    ，是一場以瀏覽器為畫布的空間實驗。
                  </p>

                  <div className="flex items-center gap-4">
                    <a
                      href="#chapter-1"
                      className="cursor-target group relative inline-flex items-center gap-3 rounded-full bg-white text-void-950 px-7 py-3.5 font-display text-[14px] tracking-[0.2em] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                    >
                      <span>啟程</span>
                      <span className="block h-1.5 w-1.5 rounded-full bg-void-950 group-hover:translate-x-1 transition-transform" />
                    </a>
                    <a
                      href="#chapter-3"
                      className="cursor-target inline-flex items-center gap-2 font-display text-[13px] tracking-[0.25em] text-white/60 hover:text-white transition-colors"
                    >
                      <span>觀其全貌</span>
                      <span aria-hidden>↓</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* 底部技術指標 */}
            <div className="mt-24 md:mt-32 grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 border-y border-white/5">
              {[
                { label: "渲染管線", value: "WebGPU / WebGL2" },
                { label: "粒子上限", value: "80,000 顆" },
                { label: "鏡頭關鍵點", value: "4 段空間路徑" },
                { label: "響應曲線", value: "Cubic Spatial" },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-2 py-6 px-5 bg-void-950/40 backdrop-blur-sm"
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
                    {stat.label}
                  </span>
                  <span className="font-display text-[18px] text-white">
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 滾動提示 */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
            <span className="font-mono text-[10px] tracking-[0.4em] text-white/40 uppercase">
              繼續向下
            </span>
            <span className="block h-10 w-px bg-gradient-to-b from-white/40 to-transparent" />
          </div>
        </section>

        {/* ────────────  CHAPTER II — 晶核  ──────────── */}
        <section
          id="chapter-1"
          className="relative min-h-[120vh] flex items-center"
        >
          <div className="chapter-content w-full max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-12 gap-6 mb-16">
              <div className="col-span-12 md:col-span-3 flex md:flex-col items-center md:items-start gap-4 mb-6">
                <span className="font-mono tabular text-[11px] uppercase tracking-[0.4em] text-aurora-plasma/80">
                  Chapter&nbsp;II
                </span>
                <span className="chapter-marker block h-px w-16 md:w-24 bg-gradient-to-r from-aurora-plasma via-aurora-plasma to-transparent origin-left" />
                <span className="font-display text-[13px] tracking-[0.5em] text-white/50">
                  晶核
                </span>
              </div>

              <div className="col-span-12 md:col-span-9">
                <h2 className="title-major text-[10vw] md:text-[7vw] lg:text-[96px] text-white mb-8">
                  <span className="block">折射之中，</span>
                  <span className="block text-white/55">蘊藏著秩序。</span>
                </h2>
                <p className="font-display text-[17px] md:text-[19px] leading-[1.75] text-white/70 max-w-2xl">
                  我們從<span className="text-aurora-cyan">光在介質之間的彎折</span>裡，
                  看見了一種運算的優雅——介面不再是平面的擺設，
                  而是承載資訊重量、會彎折時間、會回應你呼吸的<span className="text-white">物質</span>。
                </p>
              </div>
            </div>

            {/* 三張玻璃卡 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
              <GlassCard
                index="01 / 折射律"
                meta="OPTICS"
                title="光線尊重材質的厚度"
                description="基於 Mesh Transmission，介面玻璃會依據觀看角度產生真實的折射、色散與背景虛化。每一次微小的視角變動，都是一次新的光學運算。"
              />
              <GlassCard
                index="02 / 物理感"
                meta="HAPTIC"
                title="所有元件都有重量"
                description="按鈕的彈性曲線、卡片的傾斜慣性、滾動的尾流，皆由統一的彈簧物理驅動。介面像實體，會因為你的力道而回應，不只是動畫，而是觸感。"
              />
              <GlassCard
                index="03 / 空間音"
                meta="SPATIAL AUDIO"
                title="深度，由聽覺先行抵達"
                description="當鏡頭穿越層次時，環境音的混響也跟著漸變。深度感知是視覺與聽覺合謀的結果——我們把聲音也視為一條空間軸。"
              />
            </div>

            {/* 規格列 */}
            <div className="mt-20 flex flex-wrap items-center gap-x-10 gap-y-3 font-mono text-[10px] tracking-[0.25em] uppercase text-white/45">
              <span>Mesh&nbsp;Transmission&nbsp;Material</span>
              <span className="text-white/15">·</span>
              <span>Curl&nbsp;Noise&nbsp;Particles</span>
              <span className="text-white/15">·</span>
              <span>Bloom&nbsp;+&nbsp;Chromatic&nbsp;Aberration</span>
              <span className="text-white/15">·</span>
              <span>120 FPS&nbsp;Target</span>
            </div>
          </div>
        </section>

        {/* ────────────  CHAPTER III — 網絡  ──────────── */}
        <section
          id="chapter-2"
          className="relative min-h-[120vh] flex items-center"
        >
          <div className="chapter-content w-full max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-12 gap-6 mb-16">
              <div className="col-span-12 md:col-span-3 flex md:flex-col items-center md:items-start gap-4 mb-6">
                <span className="font-mono tabular text-[11px] uppercase tracking-[0.4em] text-aurora-azure/80">
                  Chapter&nbsp;III
                </span>
                <span className="chapter-marker block h-px w-16 md:w-24 bg-gradient-to-r from-aurora-azure via-aurora-azure to-transparent origin-left" />
                <span className="font-display text-[13px] tracking-[0.5em] text-white/50">
                  網絡
                </span>
              </div>

              <div className="col-span-12 md:col-span-9">
                <h2 className="title-major text-[10vw] md:text-[7vw] lg:text-[96px] text-white mb-8">
                  <span className="block">節點之間，</span>
                  <span className="block italic font-light text-white/55">
                    流動著意義。
                  </span>
                </h2>
                <p className="font-display text-[17px] md:text-[19px] leading-[1.75] text-white/70 max-w-2xl">
                  我們不再思考<span className="text-aurora-azure">頁面</span>。
                  我們思考的是場域中漂浮的每一個節點，與節點之間最短的詩意。
                  這是後頁面（post-page）時代的介面設計。
                </p>
              </div>
            </div>

            {/* 對比式 row */}
            <div className="grid grid-cols-12 gap-6 md:gap-10">
              {/* 左側：陳述 */}
              <div className="col-span-12 md:col-span-5 space-y-6">
                {[
                  {
                    n: "I",
                    title: "從層級到圖譜",
                    text: "資訊不是樹，是星座。我們以重要性為亮度，以關聯為線。",
                  },
                  {
                    n: "II",
                    title: "從點擊到注視",
                    text: "在空間介面中，注意力的方向就是輸入。眼睛先到，手隨後抵達。",
                  },
                  {
                    n: "III",
                    title: "從容器到場域",
                    text: "視窗融解。內容懸浮於空中，依你的位置、情境、節奏而組合。",
                  },
                ].map((b, i) => (
                  <div
                    key={i}
                    className="cursor-target group flex gap-5 p-5 -mx-5 rounded-2xl hover:bg-white/[0.025] transition-colors duration-500"
                  >
                    <span className="font-display text-[28px] leading-none text-white/30 group-hover:text-aurora-azure transition-colors">
                      {b.n}
                    </span>
                    <div>
                      <h3 className="font-display text-[20px] text-white mb-2">
                        {b.title}
                      </h3>
                      <p className="font-sans text-[14px] leading-[1.7] text-white/55">
                        {b.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* 右側：技術細節玻璃面板 */}
              <div className="col-span-12 md:col-span-7">
                <div className="glass-pane-strong glass-rim p-8 md:p-10 h-full">
                  <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/8">
                    <div>
                      <div className="font-mono tabular text-[10px] uppercase tracking-[0.3em] text-white/40 mb-2">
                        Technical&nbsp;Brief
                      </div>
                      <h3 className="font-display text-[26px] text-white">
                        構築這場敘事的工程
                      </h3>
                    </div>
                    <span className="block h-2 w-2 rounded-full bg-aurora-cyan animate-glow-pulse" />
                  </div>

                  <ul className="space-y-5 font-sans text-[14px] leading-[1.7] text-white/70">
                    <li className="flex gap-4">
                      <span className="font-mono text-aurora-cyan/80 text-[11px] tracking-[0.2em] mt-1 shrink-0">
                        01
                      </span>
                      <span>
                        <span className="text-white">Next.js 15 / App Router</span>
                        　以 React 19 編譯器加速並行渲染，將 3D 場景視為純 client island，
                        讓 SSR 內容仍能被搜尋引擎索引。
                      </span>
                    </li>
                    <li className="flex gap-4">
                      <span className="font-mono text-aurora-cyan/80 text-[11px] tracking-[0.2em] mt-1 shrink-0">
                        02
                      </span>
                      <span>
                        <span className="text-white">React Three Fiber 9 + Drei 10</span>
                        　以聲明式 JSX 操控 Three.js v0.171，搭配 Mesh Transmission Material 達成 Vision Pro 級的折射玻璃。
                      </span>
                    </li>
                    <li className="flex gap-4">
                      <span className="font-mono text-aurora-cyan/80 text-[11px] tracking-[0.2em] mt-1 shrink-0">
                        03
                      </span>
                      <span>
                        <span className="text-white">客製 GLSL Shader</span>
                        　Curl Noise 在 GPU 上即時計算粒子湧動，FBM 噪聲生成深空雲氣，每秒 60 億次浮點運算盡在掌握。
                      </span>
                    </li>
                    <li className="flex gap-4">
                      <span className="font-mono text-aurora-cyan/80 text-[11px] tracking-[0.2em] mt-1 shrink-0">
                        04
                      </span>
                      <span>
                        <span className="text-white">GSAP ScrollTrigger</span>
                        　將頁面滾動進度精確映射至攝影機的四段空間路徑，配合 Lenis 慣性滾動，每一次滑動都像在駕駛太空船。
                      </span>
                    </li>
                    <li className="flex gap-4">
                      <span className="font-mono text-aurora-cyan/80 text-[11px] tracking-[0.2em] mt-1 shrink-0">
                        05
                      </span>
                      <span>
                        <span className="text-white">效能哨兵</span>
                        　依裝置記憶體、CPU、GPU 字串自動分為四個渲染等級，行動裝置粒子數降至 6 千、關閉後製，仍維持流暢。
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ────────────  CHAPTER IV — 未來  ──────────── */}
        <section
          id="chapter-3"
          className="relative min-h-[140vh] flex items-center"
        >
          <div className="chapter-content w-full max-w-6xl mx-auto px-6 md:px-12 text-center">
            <div className="flex flex-col items-center gap-6 mb-10">
              <span className="font-mono tabular text-[11px] uppercase tracking-[0.4em] text-aurora-ember/80">
                Chapter&nbsp;IV
              </span>
              <span className="chapter-marker block h-px w-24 bg-gradient-to-r from-transparent via-aurora-ember to-transparent origin-center" />
              <span className="font-display text-[13px] tracking-[0.5em] text-white/50">
                未來
              </span>
            </div>

            <h2 className="title-major text-[12vw] md:text-[9vw] lg:text-[120px] mb-12">
              <span className="block text-white">介面的盡頭，</span>
              <span className="block italic font-light text-aurora-static">
                是它本身的消失。
              </span>
            </h2>

            <p className="font-display text-[18px] md:text-[22px] leading-[1.7] text-white/65 max-w-2xl mx-auto mb-16">
              當光、聲音、與動作都成為一種共通的語言，
              我們將不再「使用」一個網頁——
              我們將<span className="text-white">居住</span>於它之中。
            </p>

            {/* CTA 群組 */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-5 mb-24">
              <a
                href="#"
                className="cursor-target group relative inline-flex items-center gap-3 rounded-full bg-white text-void-950 px-9 py-4 font-display text-[15px] tracking-[0.2em] hover:scale-[1.03] active:scale-[0.97] transition-all duration-500 shadow-[0_18px_40px_-12px_rgba(127,232,255,0.4)]"
              >
                <span>共構這個未來</span>
                <span className="block h-1.5 w-1.5 rounded-full bg-void-950 group-hover:translate-x-1.5 transition-transform" />
              </a>
              <a
                href="#"
                className="cursor-target inline-flex items-center gap-3 rounded-full border border-white/20 hover:border-white/40 hover:bg-white/[0.04] px-9 py-4 font-display text-[15px] tracking-[0.2em] text-white/85 transition-all duration-500"
              >
                <span>查閱技術文件</span>
                <span aria-hidden>↗</span>
              </a>
            </div>

            {/* 訊息收件條 */}
            <div className="glass-pane glass-rim mx-auto max-w-2xl p-2 flex items-center gap-2">
              <input
                type="email"
                placeholder="輸入電子郵件，獲取下一個 build"
                className="flex-1 bg-transparent border-0 outline-none px-5 py-3 font-sans text-[14px] text-white placeholder:text-white/35"
              />
              <button
                type="button"
                className="cursor-target rounded-full bg-white/10 hover:bg-white/20 transition-colors px-6 py-3 font-display text-[13px] tracking-[0.2em] text-white"
              >
                訂閱
              </button>
            </div>

            {/* 底部資訊 */}
            <footer className="mt-32 pt-10 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-8 text-left">
              <div>
                <div className="font-display text-[12px] tracking-[0.4em] text-white/40 uppercase mb-3">
                  Studio
                </div>
                <p className="font-sans text-[13px] text-white/65 leading-[1.7]">
                  Quantum Horizon 由一支跨域的創意工程團隊在 Brussels 與 Tokyo 共同打造。
                </p>
              </div>
              <div>
                <div className="font-display text-[12px] tracking-[0.4em] text-white/40 uppercase mb-3">
                  Contact
                </div>
                <ul className="space-y-1.5 font-sans text-[13px] text-white/65">
                  <li><a className="cursor-target hover:text-white transition-colors" href="#">承接專案 →</a></li>
                  <li><a className="cursor-target hover:text-white transition-colors" href="#">媒體洽詢 →</a></li>
                  <li><a className="cursor-target hover:text-white transition-colors" href="#">加入我們 →</a></li>
                </ul>
              </div>
              <div>
                <div className="font-display text-[12px] tracking-[0.4em] text-white/40 uppercase mb-3">
                  Awards
                </div>
                <ul className="space-y-1.5 font-sans text-[13px] text-white/65">
                  <li>Awwwards SOTD ─ 2026</li>
                  <li>FWA Site of the Day</li>
                  <li>CSS Design Awards</li>
                </ul>
              </div>
              <div>
                <div className="font-display text-[12px] tracking-[0.4em] text-white/40 uppercase mb-3">
                  Build
                </div>
                <ul className="font-mono text-[11px] text-white/50 space-y-1 tabular">
                  <li>v 0.26.5 — 2026.05.09</li>
                  <li>commit&nbsp;#a7c2f1</li>
                  <li>region&nbsp;eu-west-1</li>
                </ul>
              </div>
            </footer>

            <div className="mt-16 flex items-center justify-center gap-3 font-mono text-[10px] tracking-[0.3em] text-white/30 uppercase">
              <span className="block h-px w-12 bg-white/15" />
              <span>End&nbsp;of&nbsp;Transmission</span>
              <span className="block h-px w-12 bg-white/15" />
            </div>
          </div>
        </section>
      </main>
    </PerformanceGuardProvider>
  );
}
