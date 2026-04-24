import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture, Billboard } from '@react-three/drei';
import {
  AdditiveBlending,
  BackSide,
  BufferAttribute,
  BufferGeometry,
  Color,
  DoubleSide,
  type Mesh,
  type Group,
  type PointLight,
  type Points,
  type MeshBasicMaterial,
  type InstancedMesh,
  QuadraticBezierCurve3,
  TubeGeometry,
  Vector3,
  Object3D,
} from 'three';

/* ================================================================
   Earth3D v5 — 全球指揮台
   Chairman 2026-04-24 v5 指示：
     Phase 4 — 拿掉 FINANCIAL DATA / GLOBAL DATA HUD 面板
     Phase 1 — 27 個全球城市光點（26 藍源 + 1 金 Taipei 匯聚點）
     Phase 3 — 地球加夜景 emissiveMap（城市燈光）讓夜面活過來
     Phase 2 — 粒子流 per line 100（mobile 50），26 條光束密度飆升
     Phase 5 — 3D 視差星空兩層（BufferGeometry Points），縱深感
   不含：Bloom / Shader atmosphere / CesiumJS / GeoJSON（延後評估）
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

// ══════════════════════════════════════════════════
// Phase 1 — 27 全球城市（Chairman 2026-04-24 v5 list）
// ══════════════════════════════════════════════════
interface City { name: string; lat: number; lon: number; isDestination?: boolean; }

const CITIES: City[] = [
  { name: 'New York',     lat:  40.7128, lon:  -74.0060 },
  { name: 'London',       lat:  51.5074, lon:   -0.1278 },
  { name: 'Frankfurt',    lat:  50.1109, lon:    8.6821 },
  { name: 'Tokyo',        lat:  35.6762, lon:  139.6503 },
  { name: 'Sydney',       lat: -33.8688, lon:  151.2093 },
  { name: 'Singapore',    lat:   1.3521, lon:  103.8198 },
  { name: 'Dubai',        lat:  25.2048, lon:   55.2708 },
  { name: 'Mumbai',       lat:  19.0760, lon:   72.8777 },
  { name: 'São Paulo',    lat: -23.5505, lon:  -46.6333 },
  { name: 'Lagos',        lat:   6.5244, lon:    3.3792 },
  { name: 'Moscow',       lat:  55.7558, lon:   37.6173 },
  { name: 'Seoul',        lat:  37.5665, lon:  126.9780 },
  { name: 'Hong Kong',    lat:  22.3193, lon:  114.1694 },
  { name: 'Paris',        lat:  48.8566, lon:    2.3522 },
  { name: 'Toronto',      lat:  43.6532, lon:  -79.3832 },
  { name: 'Berlin',       lat:  52.5200, lon:   13.4050 },
  { name: 'Amsterdam',    lat:  52.3676, lon:    4.9041 },
  { name: 'Chicago',      lat:  41.8781, lon:  -87.6298 },
  { name: 'Los Angeles',  lat:  34.0522, lon: -118.2437 },
  { name: 'Shanghai',     lat:  31.2304, lon:  121.4737 },
  { name: 'Bangkok',      lat:  13.7563, lon:  100.5018 },
  { name: 'Istanbul',     lat:  41.0082, lon:   28.9784 },
  { name: 'Mexico City',  lat:  19.4326, lon:  -99.1332 },
  { name: 'Johannesburg', lat: -26.2041, lon:   28.0473 },
  { name: 'Vancouver',    lat:  49.2827, lon: -123.1207 },
  { name: 'Auckland',     lat: -36.8485, lon:  174.7633 },
  { name: 'Taipei',       lat:  25.0330, lon:  121.5654, isDestination: true },
];

const TAIPEI = CITIES.find((c) => c.isDestination)!;
const TAIPEI_POS_UNIT = latLonToVec3(TAIPEI.lat, TAIPEI.lon, 1);
const TAIPEI_POS_SURFACE = TAIPEI_POS_UNIT.clone().multiplyScalar(1.015);
const SOURCE_CITIES = CITIES.filter((c) => !c.isDestination);
// 初始旋轉讓 Taipei 面向 camera (+Z)
const INITIAL_EARTH_ROT_Y =
  Math.PI / 2 - Math.atan2(TAIPEI_POS_UNIT.z, TAIPEI_POS_UNIT.x);

// ══════════════════════════════════════════════════
// Phase 3 — 寫實地球（+ 夜景 emissiveMap 讓城市燈光活起來）
// ══════════════════════════════════════════════════

function RealisticEarth() {
  const [day, night, normal, specular] = useTexture([
    '/textures/earth/earth-day.jpg',
    '/textures/earth/earth-night.png',
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
        specular={new Color('#5a6a7e')}
        shininess={16}
        /* 夜景城市燈光 — 白色 emissive，夜面顯色、日面被 diffuse 覆蓋 */
        emissive={new Color('#ffffff')}
        emissiveMap={night}
        emissiveIntensity={0.85}
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
        opacity={0.35}
        depthWrite={false}
      />
    </mesh>
  );
}

function AtmosphereGlow() {
  return (
    <>
      <mesh>
        <sphereGeometry args={[1.025, 48, 48]} />
        <meshBasicMaterial color={new Color('#4a8cff')} transparent opacity={0.14} side={BackSide} depthWrite={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.09, 48, 48]} />
        <meshBasicMaterial color={new Color('#7fb0ff')} transparent opacity={0.06} side={BackSide} depthWrite={false} />
      </mesh>
    </>
  );
}

// ══════════════════════════════════════════════════
// Phase 1 — 27 城市 glow dots（雙層 mesh，不用 pointLight 避免 27 燈性能爆炸）
// ══════════════════════════════════════════════════

function CityLightDots() {
  // 共用球形幾何，兩種色 material（分批渲染）
  const blueCore = useMemo(() => ({ r: 0.009 }), []);
  const blueHalo = useMemo(() => ({ r: 0.022 }), []);
  return (
    <group>
      {CITIES.map((city, i) => {
        const pos = latLonToVec3(city.lat, city.lon, 1.005);
        const isDest = city.isDestination;
        const color = isDest ? GOLD_BRIGHT : BLUE_BRIGHT;
        return (
          <group key={i} position={pos}>
            {/* Inner bright core */}
            <mesh>
              <sphereGeometry args={[blueCore.r, 10, 10]} />
              <meshBasicMaterial color={color} toneMapped={false} />
            </mesh>
            {/* Outer glow halo — additive blending 模擬發光 */}
            <mesh>
              <sphereGeometry args={[blueHalo.r, 12, 12]} />
              <meshBasicMaterial
                color={color}
                transparent
                opacity={0.35}
                blending={AdditiveBlending}
                depthWrite={false}
                toneMapped={false}
              />
            </mesh>
            {/* Destination 再加一層更大的光環 */}
            {isDest && (
              <mesh>
                <sphereGeometry args={[0.04, 14, 14]} />
                <meshBasicMaterial
                  color={color}
                  transparent
                  opacity={0.18}
                  blending={AdditiveBlending}
                  depthWrite={false}
                  toneMapped={false}
                />
              </mesh>
            )}
          </group>
        );
      })}
    </group>
  );
}

// ══════════════════════════════════════════════════
// Phase 3b — 中央 Taipei Beacon（Griffin Billboard + ripple）
// ══════════════════════════════════════════════════

const RIPPLE_POOL = 5;
const RIPPLE_PERIOD = 0.7;

function TaipeiBeacon() {
  const [griffin] = useTexture(['/brand/griffin-128.png']);
  const logoRef = useRef<Mesh>(null);
  const lightRef = useRef<PointLight>(null);
  const rippleRefs = useRef<Array<Mesh | null>>([]);
  const ripplePhases = useRef<number[]>(Array(RIPPLE_POOL).fill(0));
  const nextSpawn = useRef(0.4);

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    if (logoRef.current) {
      const breathe = 1 + Math.sin(t * 1.2) * 0.05;
      logoRef.current.scale.setScalar(breathe);
    }
    if (lightRef.current) {
      lightRef.current.intensity = 1.2 + Math.sin(t * 1.5) * 0.5;
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
      m.scale.setScalar(0.6 + next * 2.3);
      (m.material as MeshBasicMaterial).opacity = Math.max(0, (1 - next) * 0.6);
    }
  });

  return (
    <group position={TAIPEI_POS_SURFACE}>
      <Billboard>
        <mesh ref={logoRef}>
          <planeGeometry args={[0.2, 0.2]} />
          <meshBasicMaterial map={griffin} transparent alphaTest={0.05} toneMapped={false} />
        </mesh>
        {Array.from({ length: RIPPLE_POOL }).map((_, i) => {
          const isBlue = i === 1 || i === 3;
          return (
            <mesh
              key={i}
              ref={(el) => { rippleRefs.current[i] = el; }}
              position={[0, 0, -0.005]}
              visible={false}
            >
              <ringGeometry args={[0.07, 0.08, 48]} />
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
      <pointLight ref={lightRef} color={GOLD_BRIGHT} intensity={1.2} distance={2.8} />
    </group>
  );
}

// ══════════════════════════════════════════════════
// Phase 2 — 粒子流（per line 100 desktop / 50 mobile），26 條光束
// ══════════════════════════════════════════════════

interface LineSpec {
  curve: QuadraticBezierCurve3;
  tubeGeom: TubeGeometry;
  cycleOffset: number;
}

interface ParticleState {
  lineIdx: number;
  t: number;
  baseSpeed: number;
}

function buildRibbonTube(curve: QuadraticBezierCurve3): TubeGeometry {
  const geom = new TubeGeometry(curve, TUBULAR_SEGMENTS, 0.008, RADIAL_SEGMENTS, false);
  const posCount = geom.attributes.position.count;
  const colors = new Float32Array(posCount * 3);
  const startCol = new Color(BLUE_BRIGHT);
  const endCol = new Color(GOLD_BRIGHT);
  const out = new Color();
  const radialP1 = RADIAL_SEGMENTS + 1;
  for (let i = 0; i < posCount; i++) {
    const tubIdx = Math.floor(i / radialP1);
    const t = tubIdx / TUBULAR_SEGMENTS;
    // 起點藍（source city）→ 終點金（Taipei）線性漸層
    out.copy(startCol).lerp(endCol, t);
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
    const count = Math.min(lineCount, SOURCE_CITIES.length);
    return Array.from({ length: count }, (_, i) => {
      const source = SOURCE_CITIES[i % SOURCE_CITIES.length];
      const start = latLonToVec3(source.lat, source.lon, 1.01);
      const end = TAIPEI_POS_SURFACE.clone();
      const chord = start.distanceTo(end);
      const arcHeight = 1.22 + chord * 0.14;
      const mid = start.clone().add(end).multiplyScalar(0.5).normalize().multiplyScalar(arcHeight);
      const curve = new QuadraticBezierCurve3(start, mid, end);
      return {
        curve,
        tubeGeom: buildRibbonTube(curve),
        cycleOffset: (i / count) * 3,
      };
    });
  }, [lineCount]);

  const particles = useMemo<ParticleState[]>(() => {
    const out: ParticleState[] = [];
    for (let li = 0; li < lines.length; li++) {
      for (let pi = 0; pi < particlesPerLine; pi++) {
        out.push({
          lineIdx: li,
          t: pi / particlesPerLine,
          baseSpeed: 0.42 + Math.random() * 0.28,
        });
      }
    }
    return out;
  }, [lines, particlesPerLine]);

  const instRef = useRef<InstancedMesh>(null);
  const tubeRefs = useRef<Array<Mesh | null>>([]);
  const dummy = useMemo(() => new Object3D(), []);

  useFrame((state, delta) => {
    if (!instRef.current) return;
    const t = state.clock.elapsedTime;

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
      dummy.scale.setScalar(intensity > 0.05 ? 1 + intensity * 0.4 : 0.12);
      dummy.updateMatrix();
      instRef.current.setMatrixAt(idx, dummy.matrix);
    }
    instRef.current.instanceMatrix.needsUpdate = true;

    // Tube opacity pulse
    for (let li = 0; li < lines.length; li++) {
      const m = tubeRefs.current[li];
      if (!m) continue;
      const phase = (t + lines[li].cycleOffset) % 3;
      const intensity =
        phase < 0.3 ? 1.0
        : phase < 1.8 ? 1.0 - (phase - 0.3) / 1.5
        : 0;
      (m.material as MeshBasicMaterial).opacity = 0.3 + 0.55 * intensity;
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
            opacity={0.55}
            depthWrite={false}
            toneMapped={false}
            side={DoubleSide}
            blending={AdditiveBlending}
          />
        </mesh>
      ))}

      {particles.length > 0 && (
        <instancedMesh
          ref={instRef}
          args={[undefined as unknown as never, undefined as unknown as never, particles.length]}
        >
          <sphereGeometry args={[0.008, 8, 8]} />
          <meshBasicMaterial color={BLUE_BRIGHT} transparent opacity={0.95} toneMapped={false} />
        </instancedMesh>
      )}
    </group>
  );
}

// ══════════════════════════════════════════════════
// Phase 5 — 3D 星空視差（兩層，不同速度製造深度）
// ══════════════════════════════════════════════════

function makeStarGeometry(count: number, minR: number, maxR: number): BufferGeometry {
  const g = new BufferGeometry();
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = minR + Math.random() * (maxR - minR);
    const phi = Math.acos(2 * Math.random() - 1);
    const theta = Math.random() * Math.PI * 2;
    positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.cos(phi);
    positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
  }
  g.setAttribute('position', new BufferAttribute(positions, 3));
  return g;
}

function StarFieldLayer({
  count,
  minR,
  maxR,
  size,
  opacity,
  rotSpeed,
  color = '#ffffff',
}: {
  count: number;
  minR: number;
  maxR: number;
  size: number;
  opacity: number;
  rotSpeed: number;
  color?: string;
}) {
  const ref = useRef<Points>(null);
  const geom = useMemo(() => makeStarGeometry(count, minR, maxR), [count, minR, maxR]);
  useFrame(() => {
    if (ref.current) ref.current.rotation.y += rotSpeed;
  });
  return (
    <points ref={ref} geometry={geom}>
      <pointsMaterial
        color={color}
        size={size}
        transparent
        opacity={opacity}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function ParallaxStarField({ density }: { density: number }) {
  return (
    <>
      {/* Far layer — 小顆，緩慢 */}
      <StarFieldLayer count={Math.round(density)} minR={140} maxR={260} size={0.7} opacity={0.75} rotSpeed={0.00008} />
      {/* Mid layer — 較大顆，稍快 */}
      <StarFieldLayer count={Math.round(density * 0.3)} minR={90} maxR={140} size={1.3} opacity={0.5} rotSpeed={0.00018} color="#cfe1ff" />
    </>
  );
}

// ══════════════════════════════════════════════════
// Scene wrapper
// ══════════════════════════════════════════════════

function EarthScene({ isMobile }: { isMobile: boolean }) {
  const mainRef = useRef<Group>(null);
  const particlesPerLine = isMobile ? 50 : 100;
  const lineCount = isMobile ? 14 : 26;
  const starDensity = isMobile ? 4000 : 10000;

  useFrame(() => {
    if (mainRef.current) mainRef.current.rotation.y += 0.0008;
  });

  return (
    <>
      {/* 光照系統 */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 3, 5]} color="#fff5dc" intensity={1.8} />
      <pointLight position={[-4, -2, 3]} color={BLUE_BRIGHT} intensity={0.5} />

      {/* Phase 5 — 視差 3D 星空（不跟地球旋轉） */}
      <ParallaxStarField density={starDensity} />

      {/* 大氣輝光（不隨地球旋轉） */}
      <AtmosphereGlow />

      {/* 主 group — 地球 + 城市 + 光束 + Taipei Beacon 一起旋轉 */}
      <group ref={mainRef} rotation={[0, INITIAL_EARTH_ROT_Y, 0]}>
        <RealisticEarth />
        <EarthClouds />
        <CityLightDots />
        <ElectricConnectionSystem
          particlesPerLine={particlesPerLine}
          lineCount={lineCount}
        />
        <TaipeiBeacon />
      </group>

      {/* Phase 4 — DATA HUD 已全部拿掉 */}
    </>
  );
}

export default function Earth3D() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  return (
    <Canvas
      camera={{ position: [0, 0, 3.0], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      dpr={[1, 2]}
      style={{ background: 'transparent' }}
    >
      <EarthScene isMobile={isMobile} />
    </Canvas>
  );
}
