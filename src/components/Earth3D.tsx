import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import {
  QuadraticBezierCurve3,
  DoubleSide,
  type Mesh,
  type Group,
  type PointLight,
  type MeshBasicMaterial,
  type InstancedMesh,
  TextureLoader,
  Vector3,
  Object3D,
} from 'three';

/* ==============================================================
   Earth3D v2 — 電流匯聚感
   Chairman 2026-04-24 P1：曲線 + 光點流 + 三相節奏 + 中央 ripple
   --------------------------------------------------------------
   升級點：
   1. 連線曲線改 QuadraticBezierCurve3，mid * 1.3 拉弧
   2. 實體 tubeGeometry 刪除，改粒子沿線流動（instancedMesh）
   3. 節奏：快閃(0-0.3s) → 慢滅(0.3-1.8s) → 停頓(1.8-3.0s)
   4. 中央 LOGO：呼吸縮放 + 5-ring ripple pool（0.55s 一環）
   5. 手機降級：10 粒子 → 5，14 線 → 8
   ============================================================== */

const GOLD = '#C5A059';
const BRIGHT_GOLD = '#FFD369';

// ── 用 Fibonacci 球面均勻分布城市 ──
function cityPositions(n: number) {
  const pts: Vector3[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    pts.push(new Vector3(Math.cos(theta) * r, y, Math.sin(theta) * r));
  }
  return pts;
}

function WireframeEarth() {
  const ref = useRef<Mesh>(null);
  useFrame(() => {
    if (ref.current) ref.current.rotation.y += 0.003;
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1, 36, 24]} />
      <meshBasicMaterial color={GOLD} wireframe transparent opacity={0.55} />
    </mesh>
  );
}

function CityLights({ cities }: { cities: Vector3[] }) {
  const groupRef = useRef<Group>(null);
  useFrame(() => {
    if (groupRef.current) groupRef.current.rotation.y += 0.003;
  });
  return (
    <group ref={groupRef}>
      {cities.map((c, i) => (
        <mesh key={i} position={[c.x * 1.002, c.y * 1.002, c.z * 1.002]}>
          <sphereGeometry args={[0.018, 10, 10]} />
          <meshBasicMaterial color={BRIGHT_GOLD} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

// ── 電流線池：固定 N 條 QuadraticBezier，粒子用 instancedMesh 單 draw-call 更新 ──
interface LineSpec {
  curve: QuadraticBezierCurve3;
  cycleOffset: number;  // 0..3 在 3 秒週期裡的起始 phase，14 條 evenly spaced
}

interface ParticleState {
  lineIdx: number;
  t: number;        // 0..1 沿曲線參數
  baseSpeed: number; // units/sec，速度由 intensity 調制
}

function ElectricConnectionSystem({
  cities,
  particlesPerLine,
  lineCount,
}: {
  cities: Vector3[];
  particlesPerLine: number;
  lineCount: number;
}) {
  const groupRef = useRef<Group>(null);
  const instRef = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new Object3D(), []);

  const lines = useMemo<LineSpec[]>(() => {
    return Array.from({ length: lineCount }, (_, i) => {
      const city = cities[i % cities.length].clone();
      const end = new Vector3(0, 0, 0);
      // Chairman spec：mid 往外推，製造弧度
      const mid = city.clone().multiplyScalar(1.3);
      return {
        curve: new QuadraticBezierCurve3(city, mid, end),
        cycleOffset: (i / lineCount) * 3, // 3s 週期內均分
      };
    });
  }, [cities, lineCount]);

  const particles = useMemo<ParticleState[]>(() => {
    const state: ParticleState[] = [];
    for (let li = 0; li < lines.length; li++) {
      for (let pi = 0; pi < particlesPerLine; pi++) {
        state.push({
          lineIdx: li,
          t: pi / particlesPerLine,               // 平均散佈初始位置
          baseSpeed: 0.35 + Math.random() * 0.35, // 0.35 ~ 0.7
        });
      }
    }
    return state;
  }, [lines, particlesPerLine]);

  const totalParticles = particles.length;

  useFrame((state, delta) => {
    if (!instRef.current) return;
    const t = state.clock.elapsedTime;

    for (let idx = 0; idx < totalParticles; idx++) {
      const p = particles[idx];
      const line = lines[p.lineIdx];

      // 3 相節奏：
      //   [0, 0.3s)  intensity = 1         快閃
      //   [0.3, 1.8) intensity = linear 1→0  慢滅
      //   [1.8, 3.0) intensity = 0        停頓
      const phase = (t + line.cycleOffset) % 3;
      const intensity =
        phase < 0.3 ? 1.0
        : phase < 1.8 ? 1.0 - (phase - 0.3) / 1.5
        : 0;

      p.t += p.baseSpeed * intensity * delta;
      if (p.t > 1) p.t -= 1;

      const pos = line.curve.getPointAt(p.t);
      dummy.position.copy(pos);
      // 停頓期把粒子縮到幾乎隱形，模擬電流斷流
      const sizeFactor = intensity > 0.05 ? 1 + intensity * 0.25 : 0.15;
      dummy.scale.setScalar(sizeFactor);
      dummy.updateMatrix();
      instRef.current.setMatrixAt(idx, dummy.matrix);
    }
    instRef.current.instanceMatrix.needsUpdate = true;

    // 粒子和城市 + 地球一起繞 Y
    if (groupRef.current) groupRef.current.rotation.y += 0.003;
  });

  return (
    <group ref={groupRef}>
      <instancedMesh
        ref={instRef}
        // Three.js requires initial args so instance count is reserved
        args={[undefined as unknown as never, undefined as unknown as never, totalParticles]}
      >
        <sphereGeometry args={[0.018, 8, 8]} />
        <meshBasicMaterial color={BRIGHT_GOLD} transparent opacity={0.95} toneMapped={false} />
      </instancedMesh>
    </group>
  );
}

// ── 中央 Griffin Logo + 呼吸縮放 + ripple pool ──
const RIPPLE_POOL_SIZE = 5;
const RIPPLE_PERIOD = 0.55; // 每 0.55s 新噴一環

function CentralLogo() {
  const texture = useLoader(TextureLoader, '/brand/griffin-128.png');
  const logoRef = useRef<Mesh>(null);
  const lightRef = useRef<PointLight>(null);
  const rippleRefs = useRef<Array<Mesh | null>>([]);
  const ripplePhases = useRef<number[]>(Array(RIPPLE_POOL_SIZE).fill(0));
  const nextSpawnAt = useRef(0.2);

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;

    // Logo 呼吸縮放 + 微旋轉
    if (logoRef.current) {
      logoRef.current.rotation.z = Math.sin(t * 0.5) * 0.06;
      const breathe = 1 + Math.sin(t * 1.2) * 0.035;
      // Chairman spec：接收到粒子震動 +3%，用全局節拍近似每 3s 一次的「強接收」脈衝
      const catchPulse = 1 + Math.max(0, Math.sin(t * (Math.PI * 2 / 3))) * 0.025;
      logoRef.current.scale.setScalar(0.5 * breathe * catchPulse);
    }

    // Point light 隨節奏脈動
    if (lightRef.current) {
      lightRef.current.intensity = 0.75 + Math.sin(t * 1.4) * 0.35;
    }

    // Spawn ripple：找一個已熄滅（phase = 0）的 slot
    if (t >= nextSpawnAt.current) {
      const idleIdx = ripplePhases.current.findIndex((p) => p <= 0);
      if (idleIdx >= 0) {
        ripplePhases.current[idleIdx] = 0.001; // 開始計時
      }
      nextSpawnAt.current = t + RIPPLE_PERIOD;
    }

    // 更新所有 ripple
    for (let i = 0; i < RIPPLE_POOL_SIZE; i++) {
      const m = rippleRefs.current[i];
      if (!m) continue;
      const phase = ripplePhases.current[i];

      if (phase <= 0) {
        if (m.visible) m.visible = false;
        continue;
      }

      // 推進 phase，約 1.7s 完整走完
      const next = phase + delta * 0.6;
      if (next >= 1) {
        ripplePhases.current[i] = 0;
        m.visible = false;
        continue;
      }
      ripplePhases.current[i] = next;

      if (!m.visible) m.visible = true;
      const sc = 0.5 + next * 2.4;                 // 從 0.5 → 2.9
      m.scale.setScalar(sc);
      const mat = m.material as MeshBasicMaterial;
      mat.opacity = Math.max(0, (1 - next) * 0.55);
    }
  });

  return (
    <group>
      <mesh ref={logoRef}>
        <planeGeometry args={[1.1, 1.1]} />
        <meshBasicMaterial map={texture} transparent alphaTest={0.05} toneMapped={false} />
      </mesh>

      {/* Ripple pool — 預先 mount 5 個 ring，phase 驅動 visibility + scale + opacity */}
      {Array.from({ length: RIPPLE_POOL_SIZE }).map((_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            rippleRefs.current[i] = el;
          }}
          position={[0, 0, -0.02]}
          visible={false}
        >
          <ringGeometry args={[0.18, 0.2, 48]} />
          <meshBasicMaterial
            color={BRIGHT_GOLD}
            transparent
            opacity={0}
            side={DoubleSide}
            toneMapped={false}
            depthWrite={false}
          />
        </mesh>
      ))}

      <pointLight ref={lightRef} color={BRIGHT_GOLD} intensity={0.8} distance={2.4} />
    </group>
  );
}

// ── Root ──
export default function Earth3D() {
  // 手機降級：Chairman spec，寬度 < 768 減半
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const particlesPerLine = isMobile ? 5 : 10;
  const lineCount = isMobile ? 8 : 14;

  const cities = useMemo(() => cityPositions(20), []);

  return (
    <Canvas
      camera={{ position: [0, 0, 3], fov: 50 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      dpr={[1, 2]}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.35} />
      <pointLight position={[10, 10, 10]} color={GOLD} intensity={1.8} />
      <pointLight position={[-5, -4, 3]} color={BRIGHT_GOLD} intensity={0.8} />
      <WireframeEarth />
      <CityLights cities={cities} />
      <ElectricConnectionSystem
        cities={cities}
        particlesPerLine={particlesPerLine}
        lineCount={lineCount}
      />
      <CentralLogo />
    </Canvas>
  );
}
