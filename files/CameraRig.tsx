"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ---------------------------------------------------------------------
   CameraRig
   ---------------------------------------------------------------------
   核心元件：
     • 攝影機沿著預先定義的「空間路徑」移動
     • 每個 chapter（共 4 個）對應一段路徑
     • GSAP ScrollTrigger 把頁面滾動進度映射到 0..1 進度值
     • 在 useFrame 內以 lerp 平滑插值，避免 jitter
   --------------------------------------------------------------------- */

interface CameraRigProps {
  scrollRef: React.MutableRefObject<{ progress: number }>;
}

// 攝影機的 5 個關鍵點（4 段旅程）— 從遠處進入 → 環繞晶核 → 穿越網絡 → 散逸
const CAMERA_KEYFRAMES: Array<{ pos: [number, number, number]; lookAt: [number, number, number] }> = [
  { pos: [0,    0.4,  9.5], lookAt: [0, 0, 0] },     // 0% 入境
  { pos: [2.5,  1.0,  4.5], lookAt: [0, 0, 0] },     // 33% 接近核心
  { pos: [-3.5, 0.6,  2.0], lookAt: [0, 0, 0] },     // 66% 穿越網絡
  { pos: [0.0,  2.0, -2.5], lookAt: [0, 0, -8] },    // 100% 離散
];

export default function CameraRig({ scrollRef }: CameraRigProps) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(...CAMERA_KEYFRAMES[0].pos));
  const targetLook = useRef(new THREE.Vector3(...CAMERA_KEYFRAMES[0].lookAt));
  const currentLook = useRef(new THREE.Vector3(...CAMERA_KEYFRAMES[0].lookAt));

  /* -------- ScrollTrigger 註冊 -------- */
  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: "#scroll-stage",
      start: "top top",
      end: "bottom bottom",
      scrub: 1.2, // 平滑滾動，1.2 秒延遲跟隨
      onUpdate: (self) => {
        scrollRef.current.progress = self.progress;
      },
    });

    return () => {
      trigger.kill();
    };
  }, [scrollRef]);

  /* -------- 每幀根據 progress 計算目標位置 -------- */
  useFrame(() => {
    const p = scrollRef.current.progress;

    // 找出當前所在的兩個關鍵點與插值
    const segCount = CAMERA_KEYFRAMES.length - 1;
    const segFloat = p * segCount;
    const segIdx = Math.min(Math.floor(segFloat), segCount - 1);
    const segLerp = segFloat - segIdx;

    // 平滑插值（cubic ease）
    const eased = segLerp * segLerp * (3 - 2 * segLerp);

    const a = CAMERA_KEYFRAMES[segIdx];
    const b = CAMERA_KEYFRAMES[segIdx + 1];

    targetPos.current.set(
      a.pos[0] + (b.pos[0] - a.pos[0]) * eased,
      a.pos[1] + (b.pos[1] - a.pos[1]) * eased,
      a.pos[2] + (b.pos[2] - a.pos[2]) * eased
    );
    targetLook.current.set(
      a.lookAt[0] + (b.lookAt[0] - a.lookAt[0]) * eased,
      a.lookAt[1] + (b.lookAt[1] - a.lookAt[1]) * eased,
      a.lookAt[2] + (b.lookAt[2] - a.lookAt[2]) * eased
    );

    // 攝影機平滑跟隨（exponential smoothing）
    camera.position.lerp(targetPos.current, 0.07);
    currentLook.current.lerp(targetLook.current, 0.07);
    camera.lookAt(currentLook.current);
  });

  return null;
}
