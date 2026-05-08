import type { Config } from "tailwindcss";

/**
 * Tailwind CSS v4 設定
 * --------------------------------------------
 * 注意：v4 主要的 token / theme 定義已遷移至 globals.css 的 @theme 區塊。
 * 此檔保留作為「擴充點」與 IDE 智能提示來源，並在此宣告自定義 keyframes
 * 與 backdrop-filter 進階模糊組合。
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-noto-serif-tc)", "Noto Serif TC", "serif"],
        sans: ["var(--font-noto-sans-tc)", "Noto Sans TC", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      colors: {
        // 量子境界調色盤 — 深沉午夜底，三色光譜點綴
        void: {
          950: "#03050B",
          900: "#070A14",
          800: "#0C1124",
          700: "#141A33",
        },
        aurora: {
          cyan: "#7FE8FF",
          azure: "#5CA8FF",
          plasma: "#C77DFF",
          ember: "#FFB76B",
          gold: "#F5D497",
        },
      },
      backdropBlur: {
        xs: "2px",
        "3xl": "64px",
        "4xl": "96px",
      },
      backgroundImage: {
        "noise": "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.18 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
      },
      animation: {
        "drift-slow": "drift 28s ease-in-out infinite",
        "shimmer": "shimmer 6s linear infinite",
        "breath": "breath 7s ease-in-out infinite",
        "scanline": "scanline 4s linear infinite",
        "marquee": "marquee 40s linear infinite",
        "glow-pulse": "glowPulse 3.5s ease-in-out infinite",
      },
      keyframes: {
        drift: {
          "0%, 100%": { transform: "translate3d(0,0,0) rotate(0deg)" },
          "50%": { transform: "translate3d(2%,-3%,0) rotate(0.6deg)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        breath: {
          "0%, 100%": { opacity: "0.55", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.015)" },
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        glowPulse: {
          "0%, 100%": { filter: "drop-shadow(0 0 12px rgba(127,232,255,0.4))" },
          "50%": { filter: "drop-shadow(0 0 28px rgba(199,125,255,0.7))" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
