"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

import { usePerformance } from "./PerformanceGuard";

import vertexShader from "./shaders/particles.vert";
import fragmentShader from "./shaders/particles.frag";

/* ---------------------------------------------------------------------
   ParticleField
   ---------------------------------------------------------------------
   GPU 計算的量子粒子場，數萬粒子在 GPU 上即時演化。
   向 CameraRig 借用滾動進度（透過 ref.current.uniforms 注入）。
   --------------------------------------------------------------------- */

interface ParticleFieldProps {
  scrollRef: React.MutableRefObject<{ progress: number }>;
}

export default function ParticleField({ scrollRef }: ParticleFieldProps) {
  const { tier } = usePerformance();
  const { gl, viewport } = useThree();

  // 依等級決定粒子數
  const count = {
    ultra: 80_000,
    high: 40_000,
    balanced: 18_000,
    lite: 6_000,
  }[tier];

  const matRef = useRef<THREE.ShaderMaterial>(null);
  const pointer = useMemo(() => new THREE.Vector3(999, 999, 999), []);

  /* -------- 幾何資料：種子位置 + 隨機數 + 圖層 -------- */
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const seeds = new Float32Array(count * 3);
    const randoms = new Float32Array(count);
    const layers = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // 在球體內均勻分布
      const r = Math.cbrt(Math.random()) * 1.0;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      seeds[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
      seeds[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      seeds[i * 3 + 2] = r * Math.cos(phi);

      randoms[i] = Math.random();
      layers[i] = Math.floor(Math.random() * 4);
    }

    geo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 3));
    geo.setAttribute("position", new THREE.BufferAttribute(seeds, 3)); // 必要
    geo.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 1));
    geo.setAttribute("aLayer", new THREE.BufferAttribute(layers, 1));

    return geo;
  }, [count]);

  /* -------- ShaderMaterial uniforms -------- */
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uSize: { value: tier === "lite" ? 14 : tier === "balanced" ? 18 : 22 },
      uSpread: { value: 4.5 },
      uTurbulence: { value: 0.35 },
      uPointer: { value: pointer },
      uPointerStrength: { value: 0 },
      uPixelRatio: { value: Math.min(gl.getPixelRatio(), 2) },
    }),
    [pointer, tier, gl]
  );

  /* -------- 滑鼠追蹤 -------- */
  useFrame((state, delta) => {
    if (!matRef.current) return;
    const u = matRef.current.uniforms;

    u.uTime.value += delta;
    u.uScroll.value = THREE.MathUtils.lerp(
      u.uScroll.value,
      scrollRef.current.progress,
      0.08
    );

    // 滑鼠位置投射至 z=0 平面
    const mouse = state.pointer;
    pointer.set(
      (mouse.x * viewport.width) / 2,
      (mouse.y * viewport.height) / 2,
      0
    );
    u.uPointerStrength.value = THREE.MathUtils.lerp(
      u.uPointerStrength.value,
      0.4,
      0.05
    );
  });

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
