import type { Metadata, Viewport } from "next";
import { Noto_Serif_TC, Noto_Sans_TC } from "next/font/google";
import "./globals.css";

/* -----------------------------------------------------------------------
   字型載入 — Noto Serif TC（標題）+ Noto Sans TC（內文）
   兩者皆透過 Next.js 自動 self-host，避免 FOUT。
----------------------------------------------------------------------- */
const notoSerifTC = Noto_Serif_TC({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-noto-serif-tc",
  display: "swap",
});

const notoSansTC = Noto_Sans_TC({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-noto-sans-tc",
  display: "swap",
});

export const metadata: Metadata = {
  title: "量子境界 / Quantum Horizon — 跨入空間運算的下一個維度",
  description:
    "量子境界是一個探索空間運算、生成式介面與沉浸式網絡的視覺實驗。透過 WebGPU 級的粒子流體與滾動驅動的鏡頭路徑，重新定義你與螢幕之間的距離。",
  keywords: [
    "Quantum Horizon",
    "量子境界",
    "WebGPU",
    "Spatial UI",
    "Three.js",
    "React Three Fiber",
    "Glassmorphism",
    "Apple Vision Pro",
  ],
  authors: [{ name: "Creative Technologist Studio" }],
  openGraph: {
    title: "量子境界 / Quantum Horizon",
    description: "跨入空間運算的下一個維度",
    type: "website",
    locale: "zh_TW",
  },
  twitter: {
    card: "summary_large_image",
    title: "量子境界 / Quantum Horizon",
    description: "跨入空間運算的下一個維度",
  },
};

export const viewport: Viewport = {
  themeColor: "#03050B",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="zh-Hant"
      className={`${notoSerifTC.variable} ${notoSansTC.variable}`}
      suppressHydrationWarning
    >
      <body className="grain antialiased">
        {children}
      </body>
    </html>
  );
}
