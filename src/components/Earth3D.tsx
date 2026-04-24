import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import {
  BufferAttribute,
  Color,
  DoubleSide,
  type Mesh,
  type Group,
  type PointLight,
  type MeshBasicMaterial,
  type InstancedMesh,
  QuadraticBezierCurve3,
  TextureLoader,
  TubeGeometry,
  Vector3,
  Object3D,
} from 'three';

/* ==============================================================
   Earth3D v3 — Zeabur 風雙色電流
   Chairman 2026-04-24：
     1. Tube 回補細線（radius 0.003），vertex color 金→藍→金
     2. 粒子 r 0.018 → 0.008，分金/藍兩個 InstancedMesh 交錯
     3. Ripple pool 5 環，3 金 + 2 藍
     4. Wireframe earth segment 36x24 → 48x32 更細
   ============================================================== */

const GOLD = '#C5A059';
const GOLD_BRIGHT = '#FFD369';
const BLUE = '#00D9FF';

const RADIAL_SEGMENTS = 6;
const TUBULAR_SEGMENTS = 48;

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
  useFrame(() => { if (ref.current) ref.current.rotation.y += 0.003; });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1, 48, 32]} />
      <meshBasicMaterial color={GOLD} wireframe transparent opacity={0.5} />
    </mesh>
  );
}

function CityLights({ cities }: { cities: Vector3[] }) {
  const groupRef = useRef<Group>(null);
  useFrame(() => { if (groupRef.current) groupRef.current.rotation.y += 0.003; });
  return (
    <group ref={groupRef}>
      {cities.map((c, i) => (
        <mesh key={i} position={[c.x * 1.002, c.y * 1.002, c.z * 1.002]}>
          <sphereGeometry args={[0.016, 10, 10]} />
          <meshBasicMaterial color={GOLD_BRIGHT} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

// ── 電流線 + 雙色粒子池 ──
interface LineSpec {
  curve: QuadraticBezierCurve3;
  tubeGeom: TubeGeometry;
  cycleOffset: number;
  isBlueLine: boolean;
}

interface ParticleState {
  lineIdx: number;
  t: number;
  baseSpeed: number;
}

function buildTubeWithGradient(curve: QuadraticBezierCurve3): TubeGeometry {
  const geom = new TubeGeometry(curve, TUBULAR_SEGMENTS, 0.003, RADIAL_SEGMENTS, false);
  const posAttr = geom.attributes.position;
  const vCount = posAttr.count;
  const colors = new Float32Array(vCount * 3);
  const gold = new Color(GOLD_BRIGHT);
  const blue = new Color(BLUE);
  const out = new Color();
  const radialP1 = RADIAL_SEGMENTS + 1;
  for (let vi = 0; vi < vCount; vi++) {
    // TubeGeometry 頂點順序：每圈 (radialSegments+1) 個 → 取 tubIdx
    const tubIdx = Math.floor(vi / radialP1);
    const t = tubIdx / TUBULAR_SEGMENTS;
    const blueAmt = Math.sin(t * Math.PI); // 0(城市) → 1(中段) → 0(中央)
    out.copy(gold).lerp(blue, blueAmt);
    colors[vi * 3] = out.r;
    colors[vi * 3 + 1] = out.g;
    colors[vi * 3 + 2] = out.b;
  }
  geom.setAttribute('color', new BufferAttribute(colors, 3));
  return geom;
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

  const lines = useMemo<LineSpec[]>(() => {
    return Array.from({ length: lineCount }, (_, i) => {
      const city = cities[i % cities.length].clone();
      const mid = city.clone().multiplyScalar(1.3);
      const curve = new QuadraticBezierCurve3(city, mid, new Vector3(0, 0, 0));
      return {
        curve,
        tubeGeom: buildTubeWithGradient(curve),
        cycleOffset: (i / lineCount) * 3,
        isBlueLine: i % 2 === 1, // 奇 index 藍粒子、偶 index 金粒子
      };
    });
  }, [cities, lineCount]);

  // 把粒子依 line 顏色分兩組
  const particlesGold = useMemo<ParticleState[]>(() => {
    const out: ParticleState[] = [];
    for (let li = 0; li < lines.length; li++) {
      if (lines[li].isBlueLine) continue;
      for (let pi = 0; pi < particlesPerLine; pi++) {
        out.push({ lineIdx: li, t: pi / particlesPerLine, baseSpeed: 0.35 + Math.random() * 0.35 });
      }
    }
    return out;
  }, [lines, particlesPerLine]);

  const particlesBlue = useMemo<ParticleState[]>(() => {
    const out: ParticleState[] = [];
    for (let li = 0; li < lines.length; li++) {
      if (!lines[li].isBlueLine) continue;
      for (let pi = 0; pi < particlesPerLine; pi++) {
        out.push({ lineIdx: li, t: pi / particlesPerLine, baseSpeed: 0.35 + Math.random() * 0.35 });
      }
    }
    return out;
  }, [lines, particlesPerLine]);

  const goldRef = useRef<InstancedMesh>(null);
  const blueRef = useRef<InstancedMesh>(null);
  const tubeRefs = useRef<Array<Mesh | null>>([]);
  const dummy = useMemo(() => new Object3D(), []);

  const updatePool = (
    inst: InstancedMesh,
    particles: ParticleState[],
    t: number,
    delta: number,
  ) => {
    for (let idx = 0; idx < particles.length; idx++) {
      const p = particles[idx];
      const line = lines[p.lineIdx];
      const phase = (t + line.cycleOffset) % 3;
      const intensity =
        phase < 0.3 ? 1.0
        : phase < 1.8 ? 1.0 - (phase - 0.3) / 1.5
        : 0;

      p.t += p.baseSpeed * intensity * delta;
      if (p.t > 1) p.t -= 1;

      const pos = line.curve.getPointAt(p.t);
      dummy.position.copy(pos);
      const sizeFactor = intensity > 0.05 ? 1 + intensity * 0.3 : 0.12;
      dummy.scale.setScalar(sizeFactor);
      dummy.updateMatrix();
      inst.setMatrixAt(idx, dummy.matrix);
    }
    inst.instanceMatrix.needsUpdate = true;
  };

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    if (goldRef.current)  updatePool(goldRef.current, particlesGold, t, delta);
    if (blueRef.current)  updatePool(blueRef.current, particlesBlue, t, delta);

    // Tube opacity 同步脈動 — 離 phase 越近，opacity 越亮
    for (let li = 0; li < lines.length; li++) {
      const m = tubeRefs.current[li];
      if (!m) continue;
      const phase = (t + lines[li].cycleOffset) % 3;
      const intensity =
        phase < 0.3 ? 1.0
        : phase < 1.8 ? 1.0 - (phase - 0.3) / 1.5
        : 0;
      const mat = m.material as MeshBasicMaterial;
      mat.opacity = 0.25 + 0.65 * intensity;
    }

    if (groupRef.current) groupRef.current.rotation.y += 0.003;
  });

  return (
    <group ref={groupRef}>
      {/* 14 條細 tube，vertex color 金→藍→金 */}
      {lines.map((line, i) => (
        <mesh
          key={i}
          ref={(el) => { tubeRefs.current[i] = el; }}
          geometry={line.tubeGeom}
        >
          <meshBasicMaterial
            vertexColors
            transparent
            opacity={0.5}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      ))}

      {/* 金色粒子 pool */}
      {particlesGold.length > 0 && (
        <instancedMesh
          ref={goldRef}
          args={[undefined as unknown as never, undefined as unknown as never, particlesGold.length]}
        >
          <sphereGeometry args={[0.008, 8, 8]} />
          <meshBasicMaterial color={GOLD_BRIGHT} transparent opacity={0.95} toneMapped={false} />
        </instancedMesh>
      )}

      {/* 藍色粒子 pool */}
      {particlesBlue.length > 0 && (
        <instancedMesh
          ref={blueRef}
          args={[undefined as unknown as never, undefined as unknown as never, particlesBlue.length]}
        >
          <sphereGeometry args={[0.008, 8, 8]} />
          <meshBasicMaterial color={BLUE} transparent opacity={0.95} toneMapped={false} />
        </instancedMesh>
      )}
    </group>
  );
}

// ── 中央 Griffin Logo + 雙色 ripple pool ──
const RIPPLE_POOL_SIZE = 5;
const RIPPLE_PERIOD = 0.55;

function CentralLogo() {
  const texture = useLoader(TextureLoader, '/brand/griffin-128.png');
  const logoRef = useRef<Mesh>(null);
  const lightRef = useRef<PointLight>(null);
  const rippleRefs = useRef<Array<Mesh | null>>([]);
  const ripplePhases = useRef<number[]>(Array(RIPPLE_POOL_SIZE).fill(0));
  const nextSpawnAt = useRef(0.2);

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;

    if (logoRef.current) {
      logoRef.current.rotation.z = Math.sin(t * 0.5) * 0.06;
      const breathe = 1 + Math.sin(t * 1.2) * 0.035;
      const catchPulse = 1 + Math.max(0, Math.sin(t * (Math.PI * 2 / 3))) * 0.025;
      logoRef.current.scale.setScalar(0.5 * breathe * catchPulse);
    }

    if (lightRef.current) {
      lightRef.current.intensity = 0.75 + Math.sin(t * 1.4) * 0.35;
    }

    if (t >= nextSpawnAt.current) {
      const idleIdx = ripplePhases.current.findIndex((p) => p <= 0);
      if (idleIdx >= 0) ripplePhases.current[idleIdx] = 0.001;
      nextSpawnAt.current = t + RIPPLE_PERIOD;
    }

    for (let i = 0; i < RIPPLE_POOL_SIZE; i++) {
      const m = rippleRefs.current[i];
      if (!m) continue;
      const phase = ripplePhases.current[i];
      if (phase <= 0) { if (m.visible) m.visible = false; continue; }
      const next = phase + delta * 0.6;
      if (next >= 1) { ripplePhases.current[i] = 0; m.visible = false; continue; }
      ripplePhases.current[i] = next;
      if (!m.visible) m.visible = true;
      const sc = 0.5 + next * 2.4;
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

      {/* 5 環 ripple：3 金 + 2 藍交錯（index 1、3 藍） */}
      {Array.from({ length: RIPPLE_POOL_SIZE }).map((_, i) => {
        const isBlue = i === 1 || i === 3;
        return (
          <mesh
            key={i}
            ref={(el) => { rippleRefs.current[i] = el; }}
            position={[0, 0, -0.02]}
            visible={false}
          >
            <ringGeometry args={[0.18, 0.2, 48]} />
            <meshBasicMaterial
              color={isBlue ? BLUE : GOLD_BRIGHT}
              transparent
              opacity={0}
              side={DoubleSide}
              toneMapped={false}
              depthWrite={false}
            />
          </mesh>
        );
      })}

      <pointLight ref={lightRef} color={GOLD_BRIGHT} intensity={0.8} distance={2.4} />
    </group>
  );
}

// ── Root ──
export default function Earth3D() {
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
      <pointLight position={[-5, -4, 3]} color={BLUE} intensity={0.7} />
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
