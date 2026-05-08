"use client";

import { Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Vignette,
  Noise,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

import { usePerformance } from "./PerformanceGuard";
import ParticleField from "./ParticleField";
import NebulaBackground from "./NebulaBackground";
import CrystalCore from "./CrystalCore";
import NetworkLattice from "./NetworkLattice";
import CameraRig from "./CameraRig";

/* ---------------------------------------------------------------------
   Scene
   ---------------------------------------------------------------------
   單一 R3F Canvas，內部組裝：
     - NebulaBackground（最遠層）
     - ParticleField（量子粒子）
     - CrystalCore（中央晶核）
     - NetworkLattice（網絡）
     - CameraRig（滾動驅動攝影機）
     - EffectComposer（Bloom + ChromaticAberration + Vignette + Noise）
   --------------------------------------------------------------------- */

export default function Scene() {
  const { tier, dpr, prefersReducedMotion } = usePerformance();
  const scrollRef = useRef({ progress: 0 });

  // 後製分級：lite 完全關閉，balanced 僅 bloom，high/ultra 全開
  const showPost = tier !== "lite" && !prefersReducedMotion;
  const showFullPost = (tier === "ultra" || tier === "high") && !prefersReducedMotion;

  return (
    <div className="canvas-stage">
      <Canvas
        camera={{ position: [0, 0.4, 9.5], fov: 50, near: 0.1, far: 100 }}
        dpr={dpr}
        gl={{
          antialias: tier !== "lite",
          alpha: true,
          powerPreference: tier === "lite" ? "low-power" : "high-performance",
          stencil: false,
          depth: true,
        }}
        // 行動 / lite 用降階 frameloop 維持流暢
        frameloop={tier === "lite" ? "demand" : "always"}
      >
        <Suspense fallback={null}>
          <NebulaBackground scrollRef={scrollRef} />
          <ParticleField scrollRef={scrollRef} />
          <CrystalCore scrollRef={scrollRef} />
          <NetworkLattice scrollRef={scrollRef} />
          <CameraRig scrollRef={scrollRef} />

          {showPost && showFullPost && (
            <EffectComposer disableNormalPass multisampling={0}>
              <Bloom
                intensity={tier === "ultra" ? 1.4 : 1.0}
                luminanceThreshold={0.08}
                luminanceSmoothing={0.4}
                mipmapBlur
                radius={0.85}
              />
              <ChromaticAberration
                blendFunction={BlendFunction.NORMAL}
                offset={[0.0008, 0.0012]}
                radialModulation={false}
                modulationOffset={0}
              />
              <Vignette eskil={false} offset={0.15} darkness={0.85} />
              <Noise opacity={0.04} blendFunction={BlendFunction.OVERLAY} />
            </EffectComposer>
          )}
          {showPost && !showFullPost && (
            <EffectComposer disableNormalPass multisampling={0}>
              <Bloom
                intensity={1.0}
                luminanceThreshold={0.08}
                luminanceSmoothing={0.4}
                mipmapBlur
                radius={0.85}
              />
              <Vignette eskil={false} offset={0.15} darkness={0.85} />
            </EffectComposer>
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}
