import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture, Html, Billboard } from '@react-three/drei';
import {
  BackSide,
  BufferAttribute,
  Color,
  DoubleSide,
  type Mesh,
  type Group,
  type PointLight,
  type MeshBasicMaterial,
  type MeshPhongMaterial,
  type InstancedMesh,
  QuadraticBezierCurve3,
  TubeGeometry,
  Vector3,
  Object3D,
} from 'three';

/* ================================================================
   Earth3D v4 — 寫實地球 + 全球數據匯聚台灣 + HUD
   Chairman 2026-04-24 參考 Gemini_Generated_Image_jqroi...png
   --------------------------------------------------------------
   Phase 1：寫實紋理地球（day/normal/specular/clouds）+ 大氣輝光
   Phase 2：帶狀光束（tube r 0.012 粗版，vertex color 金↔藍）
   Phase 3：匯聚點 = 台灣（lat 25.033 / lon 121.565），初始旋轉
            讓台灣面 camera；Griffin logo + ripple 隨地球緩慢旋轉
   Phase 4：兩個 HUD 標籤（FINANCIAL DATA / GLOBAL DATA）
   Phase 5：整體節奏 — 地球 0.0008/frame 自轉、雲層再 +0.0003 漂移
   ================================================================ */

const GOLD_BRIGHT = '#FFD369';
const BLUE_BRIGHT = '#00D9FF';
const RADIAL_SEGMENTS = 6;
const TUBULAR_SEGMENTS = 64;

// ── 球面經緯度 → Three.js 座標 ──
function latLonToVec3(lat: number, lon: number, radius = 1): Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new Vector3(
    -Math.sin(phi) * Math.cos(theta) * radius,
    Math.cos(phi) * radius,
    Math.sin(phi) * Math.sin(theta) * radius,
  );
}

const TAIWAN_POS_UNIT = latLonToVec3(25.0330, 121.5654, 1);
const TAIWAN_POS_SURFACE = TAIWAN_POS_UNIT.clone().multiplyScalar(1.015);
// 讓台灣面向 camera（+Z 方向）
const INITIAL_EARTH_ROT_Y =
  Math.PI / 2 - Math.atan2(TAIWAN_POS_UNIT.z, TAIWAN_POS_UNIT.x);

// 發射點：全球 14 個代表性城市（參考圖有明顯 Europe、Middle East、Asia、US 多點）
const SOURCE_CITIES: Array<{ name: string; lat: number; lon: number }> = [
  { name: 'New York',   lat: 40.7128,  lon: -74.0060 },
  { name: 'London',     lat: 51.5074,  lon:  -0.1276 },
  { name: 'Paris',      lat: 48.8566,  lon:   2.3522 },
  { name: 'Berlin',     lat: 52.5200,  lon:  13.4050 },
  { name: 'Moscow',     lat: 55.7558,  lon:  37.6173 },
  { name: 'Dubai',      lat: 25.2048,  lon:  55.2708 },
  { name: 'Mumbai',     lat: 19.0760,  lon:  72.8777 },
  { name: 'Beijing',    lat: 39.9042,  lon: 116.4074 },
  { name: 'Tokyo',      lat: 35.6762,  lon: 139.6503 },
  { name: 'Singapore',  lat:  1.3521,  lon: 103.8198 },
  { name: 'Sydney',     lat: -33.8688, lon: 151.2093 },
  { name: 'São Paulo',  lat: -23.5505, lon: -46.6333 },
  { name: 'Los Angeles',lat: 34.0522,  lon: -118.2437 },
  { name: 'Seoul',      lat: 37.5665,  lon: 126.9780 },
];

const CITY_POSITIONS = SOURCE_CITIES.map((c) => latLonToVec3(c.lat, c.lon, 1));

// ══════════════════════════════════════════════════
// Phase 1 — 寫實地球本體 + 雲層 + 大氣輝光
// ══════════════════════════════════════════════════

function RealisticEarth() {
  const [day, normal, specular] = useTexture([
    '/textures/earth/earth-day.jpg',
    '/textures/earth/earth-normal.jpg',
    '/textures/earth/earth-specular.jpg',
  ]);
  return (
    <mesh>
      <sphereGeometry args={[1, 64, 64]} />
      <meshPhongMaterial
        map={day}
        normalMap={normal}
        specularMap={specular}
        specular={new Color('#4a5a6e')}
        shininess={14}
      />
    </mesh>
  );
}

function EarthClouds() {
  const clouds = useTexture('/textures/earth/earth-clouds.jpg');
  const ref = useRef<Mesh>(null);
  useFrame(() => { if (ref.current) ref.current.rotation.y += 0.0003; });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1.008, 48, 48]} />
      <meshLambertMaterial
        map={clouds}
        transparent
        opacity={0.38}
        depthWrite={false}
      />
    </mesh>
  );
}

function AtmosphereGlow() {
  return (
    <>
      {/* 內層光暈（半透明） */}
      <mesh>
        <sphereGeometry args={[1.025, 48, 48]} />
        <meshBasicMaterial
          color={new Color('#4a8cff')}
          transparent
          opacity={0.12}
          side={BackSide}
          depthWrite={false}
        />
      </mesh>
      {/* 外層更淡的光暈 */}
      <mesh>
        <sphereGeometry args={[1.08, 48, 48]} />
        <meshBasicMaterial
          color={new Color('#7fb0ff')}
          transparent
          opacity={0.05}
          side={BackSide}
          depthWrite={false}
        />
      </mesh>
    </>
  );
}

// ══════════════════════════════════════════════════
// Phase 3 — 匯聚台灣：Griffin Beacon + 藍色光環
// ══════════════════════════════════════════════════

const RIPPLE_POOL = 5;
const RIPPLE_PERIOD = 0.7;

function TaiwanBeacon() {
  const [griffin] = useTexture(['/brand/griffin-128.png']);
  const logoRef = useRef<Mesh>(null);
  const lightRef = useRef<PointLight>(null);
  const rippleRefs = useRef<Array<Mesh | null>>([]);
  const ripplePhases = useRef<number[]>(Array(RIPPLE_POOL).fill(0));
  const nextSpawn = useRef(0.4);

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    if (logoRef.current) {
      const breathe = 1 + Math.sin(t * 1.2) * 0.04;
      logoRef.current.scale.setScalar(breathe);
    }
    if (lightRef.current) {
      lightRef.current.intensity = 1.0 + Math.sin(t * 1.4) * 0.5;
    }
    if (t >= nextSpawn.current) {
      const idle = ripplePhases.current.findIndex((p) => p <= 0);
      if (idle >= 0) ripplePhases.current[idle] = 0.001;
      nextSpawn.current = t + RIPPLE_PERIOD;
    }
    for (let i = 0; i < RIPPLE_POOL; i++) {
      const m = rippleRefs.current[i];
      if (!m) continue;
      const ph = ripplePhases.current[i];
      if (ph <= 0) { if (m.visible) m.visible = false; continue; }
      const next = ph + delta * 0.55;
      if (next >= 1) { ripplePhases.current[i] = 0; m.visible = false; continue; }
      ripplePhases.current[i] = next;
      if (!m.visible) m.visible = true;
      m.scale.setScalar(0.6 + next * 2.2);
      (m.material as MeshBasicMaterial).opacity = Math.max(0, (1 - next) * 0.6);
    }
  });

  return (
    <group position={TAIWAN_POS_SURFACE}>
      {/* Griffin logo — Billboard 永遠面向 camera */}
      <Billboard>
        <mesh ref={logoRef}>
          <planeGeometry args={[0.22, 0.22]} />
          <meshBasicMaterial
            map={griffin}
            transparent
            alphaTest={0.05}
            toneMapped={false}
          />
        </mesh>

        {/* Ripple pool — 3 金 + 2 藍 */}
        {Array.from({ length: RIPPLE_POOL }).map((_, i) => {
          const isBlue = i === 1 || i === 3;
          return (
            <mesh
              key={i}
              ref={(el) => { rippleRefs.current[i] = el; }}
              position={[0, 0, -0.005]}
              visible={false}
            >
              <ringGeometry args={[0.08, 0.09, 48]} />
              <meshBasicMaterial
                color={isBlue ? BLUE_BRIGHT : GOLD_BRIGHT}
                transparent
                opacity={0}
                side={DoubleSide}
                toneMapped={false}
                depthWrite={false}
              />
            </mesh>
          );
        })}
      </Billboard>

      {/* 匯聚光源 */}
      <pointLight ref={lightRef} color={BLUE_BRIGHT} intensity={1.0} distance={2.5} />
      {/* 底座金點 */}
      <mesh>
        <sphereGeometry args={[0.013, 12, 12]} />
        <meshBasicMaterial color={GOLD_BRIGHT} toneMapped={false} />
      </mesh>
    </group>
  );
}

// ══════════════════════════════════════════════════
// 城市出發光點（無條件渲染的小金點）
// ══════════════════════════════════════════════════

function SourceCityDots() {
  return (
    <group>
      {CITY_POSITIONS.map((c, i) => (
        <mesh key={i} position={c.clone().multiplyScalar(1.003)}>
          <sphereGeometry args={[0.012, 10, 10]} />
          <meshBasicMaterial color={GOLD_BRIGHT} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

// ══════════════════════════════════════════════════
// Phase 2 — 帶狀光束：tube (radius 0.012) + vertex color 金→藍→金
// ══════════════════════════════════════════════════

interface LineSpec {
  curve: QuadraticBezierCurve3;
  tubeGeom: TubeGeometry;
  cycleOffset: number;
  isBlueDominant: boolean;
}

interface ParticleState {
  lineIdx: number;
  t: number;
  baseSpeed: number;
}

function buildRibbonTube(curve: QuadraticBezierCurve3, blueDominant: boolean): TubeGeometry {
  const geom = new TubeGeometry(curve, TUBULAR_SEGMENTS, 0.012, RADIAL_SEGMENTS, false);
  const posCount = geom.attributes.position.count;
  const colors = new Float32Array(posCount * 3);
  // 主色 + 副色：gold-dominant 線金多藍點綴，blue-dominant 線藍多金點綴
  const primary = new Color(blueDominant ? BLUE_BRIGHT : GOLD_BRIGHT);
  const secondary = new Color(blueDominant ? GOLD_BRIGHT : BLUE_BRIGHT);
  const out = new Color();
  const radialP1 = RADIAL_SEGMENTS + 1;
  for (let i = 0; i < posCount; i++) {
    const tubIdx = Math.floor(i / radialP1);
    const t = tubIdx / TUBULAR_SEGMENTS;
    const mix = Math.sin(t * Math.PI); // 中段 1、兩端 0
    out.copy(primary).lerp(secondary, mix * 0.45);
    colors[i * 3] = out.r;
    colors[i * 3 + 1] = out.g;
    colors[i * 3 + 2] = out.b;
  }
  geom.setAttribute('color', new BufferAttribute(colors, 3));
  return geom;
}

function ElectricConnectionSystem({
  particlesPerLine,
  lineCount,
}: {
  particlesPerLine: number;
  lineCount: number;
}) {
  const lines = useMemo<LineSpec[]>(() => {
    return Array.from({ length: lineCount }, (_, i) => {
      const city = CITY_POSITIONS[i % CITY_POSITIONS.length].clone().multiplyScalar(1.01);
      const end = TAIWAN_POS_SURFACE.clone();
      // 弧高依距離決定（cross product magnitude 的 proxy）
      const chord = city.distanceTo(end);
      const arcHeight = 1.25 + chord * 0.15;
      const mid = city.clone().add(end).multiplyScalar(0.5).normalize().multiplyScalar(arcHeight);
      const curve = new QuadraticBezierCurve3(city, mid, end);
      const isBlueDominant = i % 2 === 0; // 偶 index 藍為主、奇 index 金為主
      return {
        curve,
        tubeGeom: buildRibbonTube(curve, isBlueDominant),
        cycleOffset: (i / lineCount) * 3,
        isBlueDominant,
      };
    });
  }, [lineCount]);

  // 雙色粒子池
  const particlesBlue = useMemo<ParticleState[]>(() => {
    const out: ParticleState[] = [];
    for (let li = 0; li < lines.length; li++) {
      if (!lines[li].isBlueDominant) continue;
      for (let pi = 0; pi < particlesPerLine; pi++) {
        out.push({ lineIdx: li, t: pi / particlesPerLine, baseSpeed: 0.4 + Math.random() * 0.3 });
      }
    }
    return out;
  }, [lines, particlesPerLine]);

  const particlesGold = useMemo<ParticleState[]>(() => {
    const out: ParticleState[] = [];
    for (let li = 0; li < lines.length; li++) {
      if (lines[li].isBlueDominant) continue;
      for (let pi = 0; pi < particlesPerLine; pi++) {
        out.push({ lineIdx: li, t: pi / particlesPerLine, baseSpeed: 0.4 + Math.random() * 0.3 });
      }
    }
    return out;
  }, [lines, particlesPerLine]);

  const blueRef = useRef<InstancedMesh>(null);
  const goldRef = useRef<InstancedMesh>(null);
  const tubeRefs = useRef<Array<Mesh | null>>([]);
  const dummy = useMemo(() => new Object3D(), []);

  const updatePool = (inst: InstancedMesh, particles: ParticleState[], t: number, delta: number) => {
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
      dummy.scale.setScalar(intensity > 0.05 ? 1 + intensity * 0.35 : 0.15);
      dummy.updateMatrix();
      inst.setMatrixAt(idx, dummy.matrix);
    }
    inst.instanceMatrix.needsUpdate = true;
  };

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (blueRef.current) updatePool(blueRef.current, particlesBlue, t, delta);
    if (goldRef.current) updatePool(goldRef.current, particlesGold, t, delta);

    // Tube opacity pulse
    for (let li = 0; li < lines.length; li++) {
      const m = tubeRefs.current[li];
      if (!m) continue;
      const phase = (t + lines[li].cycleOffset) % 3;
      const intensity =
        phase < 0.3 ? 1.0
        : phase < 1.8 ? 1.0 - (phase - 0.3) / 1.5
        : 0;
      (m.material as MeshBasicMaterial).opacity = 0.35 + 0.55 * intensity;
    }
  });

  return (
    <group>
      {lines.map((line, i) => (
        <mesh
          key={i}
          ref={(el) => { tubeRefs.current[i] = el; }}
          geometry={line.tubeGeom}
        >
          <meshBasicMaterial
            vertexColors
            transparent
            opacity={0.6}
            depthWrite={false}
            toneMapped={false}
            side={DoubleSide}
          />
        </mesh>
      ))}

      {particlesBlue.length > 0 && (
        <instancedMesh
          ref={blueRef}
          args={[undefined as unknown as never, undefined as unknown as never, particlesBlue.length]}
        >
          <sphereGeometry args={[0.009, 8, 8]} />
          <meshBasicMaterial color={BLUE_BRIGHT} transparent opacity={0.95} toneMapped={false} />
        </instancedMesh>
      )}

      {particlesGold.length > 0 && (
        <instancedMesh
          ref={goldRef}
          args={[undefined as unknown as never, undefined as unknown as never, particlesGold.length]}
        >
          <sphereGeometry args={[0.009, 8, 8]} />
          <meshBasicMaterial color={GOLD_BRIGHT} transparent opacity={0.95} toneMapped={false} />
        </instancedMesh>
      )}
    </group>
  );
}

// ══════════════════════════════════════════════════
// Phase 4 — 數據 HUD (FINANCIAL DATA / GLOBAL DATA)
// ══════════════════════════════════════════════════

/* HUD class styles 定義在 src/pages/HomePage.css，避免在 Canvas 內 inject CSS */

function DataHUD({
  position,
  title,
  rows,
  chartPoints,
}: {
  position: Vector3;
  title: string;
  rows: Array<[string, string]>;
  chartPoints: string;
}) {
  return (
    <Html
      position={position}
      center
      distanceFactor={4}
      style={{ pointerEvents: 'none' }}
    >
      <div className="earth-hud">
        <div className="earth-hud-title">{title}</div>
        <div className="earth-hud-rows">
          {rows.map(([k, v], i) => (
            <div key={i} className="earth-hud-row"><span>{k}</span><span>{v}</span></div>
          ))}
        </div>
        <div className="earth-hud-chart">
          <svg width={140} height={28} viewBox="0 0 140 28">
            <polyline
              points={chartPoints}
              fill="none"
              stroke="#00D9FF"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <polyline
              points={chartPoints}
              fill="none"
              stroke="rgba(0,217,255,0.2)"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </Html>
  );
}

// ══════════════════════════════════════════════════
// Scene wrapper — 地球主 group 緩慢自轉 + HUD overlay
// ══════════════════════════════════════════════════

function EarthScene({ isMobile }: { isMobile: boolean }) {
  const mainRef = useRef<Group>(null);
  const particlesPerLine = isMobile ? 5 : 10;
  const lineCount = isMobile ? 8 : 14;

  useFrame(() => {
    if (mainRef.current) mainRef.current.rotation.y += 0.0008;
  });

  return (
    <>
      <ambientLight intensity={0.45} />
      <pointLight position={[5, 3, 5]} color="#fff0d0" intensity={1.8} />
      <pointLight position={[-4, -2, 3]} color={BLUE_BRIGHT} intensity={0.55} />

      {/* 大氣輝光 — 不跟地球旋轉 */}
      <AtmosphereGlow />

      {/* 主 group — 地球 + 城市 + 光束 + 台灣 Beacon */}
      <group ref={mainRef} rotation={[0, INITIAL_EARTH_ROT_Y, 0]}>
        <RealisticEarth />
        <EarthClouds />
        <SourceCityDots />
        <ElectricConnectionSystem
          particlesPerLine={particlesPerLine}
          lineCount={lineCount}
        />
        <TaiwanBeacon />
      </group>

      {/* HUD — 固定不隨地球旋轉（scene-level） */}
      <DataHUD
        position={new Vector3(1.7, 0.6, 0.3)}
        title="FINANCIAL DATA"
        rows={[
          ['SOURCES',      '14 / live'],
          ['INGEST RATE',  '2.3k ops/s'],
          ['CONVERGENCE',  '99.7%'],
        ]}
        chartPoints="0,22 20,18 35,20 50,10 70,14 90,6 110,10 130,4 140,7"
      />

      <DataHUD
        position={new Vector3(-1.55, -0.55, 0.2)}
        title="GLOBAL DATA"
        rows={[
          ['REGIONS',  '27'],
          ['LATENCY',  '124 ms'],
          ['UPTIME',   '99.99%'],
        ]}
        chartPoints="0,20 15,14 30,16 45,8 60,12 75,5 95,9 115,2 140,6"
      />
    </>
  );
}

// ══════════════════════════════════════════════════
// Root Canvas
// ══════════════════════════════════════════════════

export default function Earth3D() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  return (
    <Canvas
      camera={{ position: [0, 0, 3.1], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      dpr={[1, 2]}
      style={{ background: 'transparent' }}
    >
      <EarthScene isMobile={isMobile} />
    </Canvas>
  );
}
