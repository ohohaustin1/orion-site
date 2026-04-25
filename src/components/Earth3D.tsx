import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture, Html, Billboard } from '@react-three/drei';
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
  type ShaderMaterial,
  QuadraticBezierCurve3,
  Vector3,
  Object3D,
} from 'three';

/* ================================================================
   Earth3D v7 — 全球決策指揮台
   Chairman 2026-04-24 v7 四大致命傷修復 + Bonus：
     P0-1 粒子流（拿掉 tube、200/line、拖尾、ease-t、random delay）
     P0-2 CorePylon 垂直光柱 + SuccessRipple 吸收環
     P1-1 Fresnel shader atmosphere（取代 BackSide sphere 雙層）
     P1-2 主要城市 3-letter 地理標籤（drei Html + occlude）
     P2-1 Parallax starfield 對比強化（far/mid 速率差距拉大）
     Bonus 隨機 city pulse（setInterval 激活）
   不含：Bloom Pass（dep 風險，待 Chairman 認可再加）
   ================================================================ */

const GOLD_BRIGHT = '#FFD369';
const BLUE_BRIGHT = '#00D9FF';

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

// v7.6 Chairman 2026-04-24：flag 路線放棄（v7.4 flagcdn.com 載不上、v7.5 local
// SVG 仍有問題），改回純文字 3-letter code + pulse 藍點即可。flagLocalUrl 移除。

// ══════════════════════════════════════════════════
// 27 全球城市（label 為 3-letter code 用於地理標籤）
// ══════════════════════════════════════════════════
interface City {
  name: string;
  code: string;           // 3-letter
  flag: string;           // v7.3 Chairman 指示：國旗 emoji 代替 code
  lat: number;
  lon: number;
  isDestination?: boolean;
  labelOnly?: boolean;    // 主要城市才顯 Html 標籤
}

const CITIES: City[] = [
  { name: 'New York',     code: 'NYC', flag: '🇺🇸', lat:  40.7128, lon:  -74.0060, labelOnly: true },
  { name: 'London',       code: 'LON', flag: '🇬🇧', lat:  51.5074, lon:   -0.1278, labelOnly: true },
  { name: 'Frankfurt',    code: 'FRA', flag: '🇩🇪', lat:  50.1109, lon:    8.6821 },
  { name: 'Tokyo',        code: 'TYO', flag: '🇯🇵', lat:  35.6762, lon:  139.6503, labelOnly: true },
  { name: 'Sydney',       code: 'SYD', flag: '🇦🇺', lat: -33.8688, lon:  151.2093, labelOnly: true },
  { name: 'Singapore',    code: 'SIN', flag: '🇸🇬', lat:   1.3521, lon:  103.8198, labelOnly: true },
  { name: 'Dubai',        code: 'DXB', flag: '🇦🇪', lat:  25.2048, lon:   55.2708, labelOnly: true },
  { name: 'Mumbai',       code: 'BOM', flag: '🇮🇳', lat:  19.0760, lon:   72.8777 },
  { name: 'São Paulo',    code: 'GRU', flag: '🇧🇷', lat: -23.5505, lon:  -46.6333, labelOnly: true },
  { name: 'Lagos',        code: 'LOS', flag: '🇳🇬', lat:   6.5244, lon:    3.3792 },
  { name: 'Moscow',       code: 'MOW', flag: '🇷🇺', lat:  55.7558, lon:   37.6173 },
  { name: 'Seoul',        code: 'ICN', flag: '🇰🇷', lat:  37.5665, lon:  126.9780 },
  { name: 'Hong Kong',    code: 'HKG', flag: '🇭🇰', lat:  22.3193, lon:  114.1694 },
  { name: 'Paris',        code: 'PAR', flag: '🇫🇷', lat:  48.8566, lon:    2.3522 },
  { name: 'Toronto',      code: 'YTO', flag: '🇨🇦', lat:  43.6532, lon:  -79.3832 },
  { name: 'Berlin',       code: 'BER', flag: '🇩🇪', lat:  52.5200, lon:   13.4050 },
  { name: 'Amsterdam',    code: 'AMS', flag: '🇳🇱', lat:  52.3676, lon:    4.9041 },
  { name: 'Chicago',      code: 'CHI', flag: '🇺🇸', lat:  41.8781, lon:  -87.6298 },
  { name: 'Los Angeles',  code: 'LAX', flag: '🇺🇸', lat:  34.0522, lon: -118.2437, labelOnly: true },
  { name: 'Shanghai',     code: 'SHA', flag: '🇨🇳', lat:  31.2304, lon:  121.4737, labelOnly: true },
  { name: 'Bangkok',      code: 'BKK', flag: '🇹🇭', lat:  13.7563, lon:  100.5018 },
  { name: 'Istanbul',     code: 'IST', flag: '🇹🇷', lat:  41.0082, lon:   28.9784 },
  { name: 'Mexico City',  code: 'MEX', flag: '🇲🇽', lat:  19.4326, lon:  -99.1332 },
  { name: 'Johannesburg', code: 'JNB', flag: '🇿🇦', lat: -26.2041, lon:   28.0473 },
  { name: 'Vancouver',    code: 'YVR', flag: '🇨🇦', lat:  49.2827, lon: -123.1207 },
  { name: 'Auckland',     code: 'AKL', flag: '🇳🇿', lat: -36.8485, lon:  174.7633 },
  { name: 'Taipei',       code: 'TPE', flag: '🏴', lat:  25.0330, lon:  121.5654, isDestination: true },
];

const TAIPEI = CITIES.find((c) => c.isDestination)!;
const TAIPEI_POS_UNIT = latLonToVec3(TAIPEI.lat, TAIPEI.lon, 1);
const TAIPEI_POS_SURFACE = TAIPEI_POS_UNIT.clone().multiplyScalar(1.015);
const SOURCE_CITIES = CITIES.filter((c) => !c.isDestination);
// Three.js rotation.y = θ 把 xz 平面座標逆向旋轉：
//   new_angle = old_angle - θ
// 要讓 TAIPEI 在 +Z 中央（new_angle = π/2），必須：
//   θ = atan2(z, x) - π/2
// 先前 v5/v7 用的是 +π/2 - atan2(z,x)（sign 反）導致 TAIPEI 被旋到 +X 右邊，
// label 與光束匯聚點偏移。Chairman 2026-04-24 v7 反饋後修正。
const INITIAL_EARTH_ROT_Y =
  Math.atan2(TAIPEI_POS_UNIT.z, TAIPEI_POS_UNIT.x) - Math.PI / 2;

// ══════════════════════════════════════════════════
// P1-1 Fresnel shader atmosphere（取代 BackSide sphere）
// ══════════════════════════════════════════════════

const atmosphereVertex = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPos.xyz;
    gl_Position = projectionMatrix * mvPos;
  }
`;

const atmosphereFragment = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  uniform vec3 uColor;
  uniform float uPower;
  uniform float uIntensity;
  void main() {
    vec3 viewDir = normalize(vViewPosition);
    float fresnel = 1.0 - max(0.0, dot(vNormal, viewDir));
    fresnel = pow(fresnel, uPower);
    gl_FragColor = vec4(uColor, fresnel * uIntensity);
  }
`;

function FresnelAtmosphere() {
  const matRef = useRef<ShaderMaterial>(null);
  const uniforms = useMemo(() => ({
    uColor: { value: new Color(BLUE_BRIGHT) },
    uPower: { value: 3.5 },       // Chairman v7 反饋：外圈太厚 → 提高 power 讓 fresnel 更 edge-only
    uIntensity: { value: 0.4 },   // intensity 0.95 → 0.4 薄光暈
  }), []);
  return (
    <mesh scale={1.06}>
      <sphereGeometry args={[1, 64, 64]} />
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={atmosphereVertex}
        fragmentShader={atmosphereFragment}
        transparent
        side={BackSide}
        blending={AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

// ══════════════════════════════════════════════════
// 寫實地球 + 夜景 emissive
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
        /* v7.3 Chairman：海藍一點、亮一點 — specular 色調更藍、光澤更高 */
        specular={new Color('#4a90e2')}
        shininess={32}
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
    <mesh ref={ref} scale={1.005}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshLambertMaterial
        map={clouds}
        transparent
        opacity={0.45}
        depthWrite={false}
      />
    </mesh>
  );
}

// ══════════════════════════════════════════════════
// 27 城市 glow dots + 隨機 pulse 激活
// ══════════════════════════════════════════════════

type PulseMap = Map<number, number>; // cityIdx → activateUntil(t)

function CityLightDots({ pulseMap }: { pulseMap: React.MutableRefObject<PulseMap> }) {
  const haloRefs = useRef<Array<Mesh | null>>([]);
  const coreRefs = useRef<Array<Mesh | null>>([]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    for (let i = 0; i < CITIES.length; i++) {
      const core = coreRefs.current[i];
      const halo = haloRefs.current[i];
      if (!core || !halo) continue;
      const activeUntil = pulseMap.current.get(i) ?? 0;
      const boosted = t < activeUntil;
      const breathe = 1 + Math.sin(t * 2 + i) * 0.08;
      const boostScale = boosted ? 2.2 : 1;
      core.scale.setScalar(breathe * boostScale);
      halo.scale.setScalar(breathe * (boosted ? 2.5 : 1));
      const haloMat = halo.material as MeshBasicMaterial;
      haloMat.opacity = boosted ? 0.6 : 0.32;
    }
  });

  return (
    <group>
      {CITIES.map((city, i) => {
        const pos = latLonToVec3(city.lat, city.lon, 1.006);
        const isDest = city.isDestination;
        const color = isDest ? GOLD_BRIGHT : BLUE_BRIGHT;
        return (
          <group key={i} position={pos}>
            <mesh ref={(el) => { coreRefs.current[i] = el; }}>
              <sphereGeometry args={[0.008, 10, 10]} />
              <meshBasicMaterial color={color} toneMapped={false} />
            </mesh>
            <mesh ref={(el) => { haloRefs.current[i] = el; }}>
              <sphereGeometry args={[0.02, 12, 12]} />
              <meshBasicMaterial
                color={color}
                transparent
                opacity={0.32}
                blending={AdditiveBlending}
                depthWrite={false}
                toneMapped={false}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

// ══════════════════════════════════════════════════
// P1-2 城市地理標籤（只主要城市 + occlude）
// ══════════════════════════════════════════════════

function CityLabels({ earthRef }: { earthRef: React.RefObject<Group> }) {
  const majorCities = CITIES.filter((c) => c.labelOnly);
  return (
    <>
      {majorCities.map((c) => {
        // v7.6: Taipei / destination 不 render label（Chairman 主權規避）
        if (c.isDestination) return null;
        const pos = latLonToVec3(c.lat, c.lon, 1.06);
        return (
          <Html
            key={c.code}
            position={pos}
            center
            distanceFactor={5}
            occlude={earthRef.current ? [earthRef as unknown as React.RefObject<Group>] : undefined}
            style={{ pointerEvents: 'none' }}
          >
            <div className="earth-city-label">
              <span className="earth-city-dot" aria-hidden="true" />
              <span className="earth-city-code">{c.code}</span>
            </div>
          </Html>
        );
      })}
    </>
  );
}

// ══════════════════════════════════════════════════
// P0-2 Core Pylon — 台灣垂直光柱 + SuccessRipple
// ══════════════════════════════════════════════════

function CorePylon() {
  const [griffin] = useTexture(['/brand/griffin-128.png']);
  const coreRef = useRef<Mesh>(null);
  const pylonRef = useRef<Mesh>(null);
  const logoRef = useRef<Mesh>(null);
  const lightRef = useRef<PointLight>(null);
  const rippleRefs = useRef<Array<Mesh | null>>([]);
  const ripplePhases = useRef<number[]>([0, 0, 0, 0, 0, 0]);
  const nextSpawn = useRef(0.3);
  const cylinderWrapRef = useRef<Group>(null);

  // Cylinder 專用 orientation：只 rotate 這個子 group 讓 cylinder 站直朝外
  // 不再 rotate 整個 CorePylon group（v7.3 fix：先前 rotateX 把 ring 也躺平
  // 地球表面 + ripple scale 擴散後形成繞地球的大藍環，Chairman 誤以為是 Fresnel）
  useEffect(() => {
    if (cylinderWrapRef.current) {
      cylinderWrapRef.current.lookAt(TAIPEI_POS_UNIT.clone().multiplyScalar(3));
      cylinderWrapRef.current.rotateX(Math.PI / 2);
    }
  }, []);

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;

    // Core breathing（大幅度）
    if (coreRef.current) {
      const pulse = 1 + Math.sin(t * 3) * 0.15;
      coreRef.current.scale.setScalar(pulse);
    }
    if (pylonRef.current) {
      const pulseY = 1 + Math.sin(t * 2.5) * 0.1;
      pylonRef.current.scale.y = pulseY;
    }
    if (logoRef.current) {
      const lp = 1 + Math.sin(t * 1.4) * 0.05;
      logoRef.current.scale.setScalar(lp);
    }
    if (lightRef.current) {
      lightRef.current.intensity = 2.5 + Math.sin(t * 2) * 1.0;
    }

    // Success ripple pool — 每 0.5s spawn 一個
    if (t >= nextSpawn.current) {
      const idle = ripplePhases.current.findIndex((p) => p <= 0);
      if (idle >= 0) ripplePhases.current[idle] = 0.001;
      nextSpawn.current = t + 0.5;
    }
    for (let i = 0; i < ripplePhases.current.length; i++) {
      const m = rippleRefs.current[i];
      if (!m) continue;
      const ph = ripplePhases.current[i];
      if (ph <= 0) { if (m.visible) m.visible = false; continue; }
      const next = ph + delta * 0.7;
      if (next >= 1) { ripplePhases.current[i] = 0; m.visible = false; continue; }
      ripplePhases.current[i] = next;
      if (!m.visible) m.visible = true;
      // v7.3 max scale 3.6 → 2.0 避免 ring 太大與地球外圍重疊
      m.scale.setScalar(0.5 + next * 1.5);
      (m.material as MeshBasicMaterial).opacity = Math.max(0, (1 - next) * 0.7);
    }
  });

  return (
    <group position={TAIPEI_POS_SURFACE}>
      {/* 垂直光柱 — 獨立 sub-group 處理 orientation，讓 cylinder 站直朝外
          (這個旋轉只影響 cylinder，不會連累 ring/griffin) */}
      <group ref={cylinderWrapRef}>
        <mesh ref={pylonRef} position={[0, 0.08, 0]}>
          <cylinderGeometry args={[0.005, 0.001, 0.18, 16, 1, true]} />
          <meshBasicMaterial
            color={GOLD_BRIGHT}
            transparent
            opacity={0.75}
            blending={AdditiveBlending}
            depthWrite={false}
            side={DoubleSide}
            toneMapped={false}
          />
        </mesh>
      </group>

      {/* Billboard 組 — Griffin / 核心光球 / Ripple 永遠面 camera，避免躺平地球表面 */}
      <Billboard>
        {/* 核心光球 */}
        <mesh ref={coreRef}>
          <sphereGeometry args={[0.025, 24, 24]} />
          <meshBasicMaterial
            color={GOLD_BRIGHT}
            transparent
            opacity={0.9}
            blending={AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>

        {/* Griffin logo */}
        <mesh ref={logoRef} position={[0, 0, 0.04]}>
          <planeGeometry args={[0.18, 0.18]} />
          <meshBasicMaterial map={griffin} transparent alphaTest={0.05} toneMapped={false} />
        </mesh>

        {/* Success Ripple pool — 6 個環交錯擴散（face camera 的平板環，不會繞地球） */}
        {Array.from({ length: 6 }).map((_, i) => {
          const isBlue = i % 2 === 1;
          return (
            <mesh
              key={i}
              ref={(el) => { rippleRefs.current[i] = el; }}
              position={[0, 0, 0.02]}
              visible={false}
            >
              <ringGeometry args={[0.04, 0.048, 48]} />
              <meshBasicMaterial
                color={isBlue ? BLUE_BRIGHT : GOLD_BRIGHT}
                transparent
                opacity={0}
                side={DoubleSide}
                blending={AdditiveBlending}
                depthWrite={false}
                toneMapped={false}
              />
            </mesh>
          );
        })}
      </Billboard>

      {/* 強光源 — 中心金光 */}
      <pointLight ref={lightRef} color={GOLD_BRIGHT} intensity={2.5} distance={3.5} />
    </group>
  );
}

// ══════════════════════════════════════════════════
// P0-1 粒子流：200/line + 拖尾 + ease-t + random delay
// ══════════════════════════════════════════════════

interface LineSpec {
  curve: QuadraticBezierCurve3;
  cycleOffset: number;
  startDelay: number;      // 隨機延遲 0-3s（錯開發射）
  speedMul: number;        // 城市活躍加速倍數（pulse）
  cityIdx: number;
}

interface ParticleState {
  lineIdx: number;
  t: number;
  baseSpeed: number;
  trailOffset: number;     // 0 = main，>0 = trail（同 t 偏移）
}

function ParticleStreams({
  pulseMap,
  particlesPerLine,
  lineCount,
}: {
  pulseMap: React.MutableRefObject<PulseMap>;
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
        cycleOffset: (i / count) * 3,
        startDelay: Math.random() * 3,
        speedMul: 1,
        cityIdx: CITIES.findIndex((c) => c.code === source.code),
      };
    });
  }, [lineCount]);

  // 每條線 N = particlesPerLine 個 instance，其中每 5 個為一組（1 main + 4 trail）
  const GROUP = 5;
  const mainsPerLine = Math.floor(particlesPerLine / GROUP);

  const particles = useMemo<ParticleState[]>(() => {
    const out: ParticleState[] = [];
    for (let li = 0; li < lines.length; li++) {
      for (let g = 0; g < mainsPerLine; g++) {
        const tStart = g / mainsPerLine;
        const speed = 0.45 + Math.random() * 0.35;
        for (let trail = 0; trail < GROUP; trail++) {
          out.push({
            lineIdx: li,
            t: tStart,
            baseSpeed: speed,
            trailOffset: trail, // 0=main，1-4=trail（render 用 opacity/size 遞減）
          });
        }
      }
    }
    return out;
  }, [lines, mainsPerLine]);

  const instRef = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new Object3D(), []);

  // 拖尾 opacity scale — trailOffset 0→1→2→3→4
  const TRAIL_OPACITY = [1.0, 0.7, 0.45, 0.25, 0.1];
  const TRAIL_SCALE = [1.0, 0.85, 0.7, 0.55, 0.4];
  const TRAIL_T_OFFSET = [0, -0.02, -0.04, -0.06, -0.08];

  // Ease: 靠近終點加速
  const easeT = (t: number) => Math.pow(Math.max(0, Math.min(1, t)), 1.4);

  useFrame((state, delta) => {
    if (!instRef.current) return;
    const t = state.clock.elapsedTime;

    // Apply pulse speedMul（若該 line 的 city 在 pulseMap 激活，速度 x2）
    for (let li = 0; li < lines.length; li++) {
      const activeUntil = pulseMap.current.get(lines[li].cityIdx) ?? 0;
      lines[li].speedMul = t < activeUntil ? 2.0 : 1.0;
    }

    for (let idx = 0; idx < particles.length; idx++) {
      const p = particles[idx];
      const line = lines[p.lineIdx];

      // 3 秒節奏 phase（cycleOffset 均分）
      const phase = (t + line.cycleOffset - line.startDelay) % 3;
      const intensity =
        phase < 0.0 ? 0  // delay 未到
        : phase < 0.3 ? 1.0
        : phase < 1.8 ? 1.0 - (phase - 0.3) / 1.5
        : 0;

      // Main 粒子推進 t
      if (p.trailOffset === 0) {
        p.t += p.baseSpeed * intensity * line.speedMul * delta;
        if (p.t > 1) p.t -= 1;
      } else {
        // Trail 跟隨其組內 main 的 t — main 在同一 group 最前面
        // 找同組 main 的 t
        const groupBase = idx - p.trailOffset;
        p.t = particles[groupBase].t;
      }

      // Trail t 偏移
      let effectiveT = p.t + TRAIL_T_OFFSET[p.trailOffset];
      if (effectiveT < 0) effectiveT += 1; // wrap

      // 吸入 ease
      const eased = easeT(effectiveT);
      const pos = line.curve.getPointAt(eased);
      dummy.position.copy(pos);

      // 靠近終點（t > 0.9）粒子縮小 + fade — main only
      const fadeNear =
        effectiveT > 0.95 ? Math.max(0, 1 - (effectiveT - 0.95) * 20)
        : effectiveT > 0.9 ? 0.5 + (0.95 - effectiveT) * 10
        : 1;

      const size =
        intensity > 0.05
          ? TRAIL_SCALE[p.trailOffset] * (1 + intensity * 0.35) * fadeNear
          : 0;
      dummy.scale.setScalar(size * 0.6);
      dummy.updateMatrix();
      instRef.current.setMatrixAt(idx, dummy.matrix);
    }
    instRef.current.instanceMatrix.needsUpdate = true;

    // 材質層 opacity 脈動（整體 fade-in/out 節奏感）
    const mat = instRef.current.material as MeshBasicMaterial;
    mat.opacity = 0.9 + Math.sin(t * 2) * 0.08;
    void TRAIL_OPACITY; // opacity 已透過 scale fade 模擬
  });

  return (
    <instancedMesh
      ref={instRef}
      args={[undefined as unknown as never, undefined as unknown as never, particles.length]}
    >
      <sphereGeometry args={[0.006, 6, 6]} />
      <meshBasicMaterial
        color={BLUE_BRIGHT}
        transparent
        opacity={0.9}
        blending={AdditiveBlending}
        depthWrite={false}
        toneMapped={false}
      />
    </instancedMesh>
  );
}

// ══════════════════════════════════════════════════
// P2 Parallax 3D Starfield（對比強化）
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
  count, minR, maxR, size, opacity, rotSpeed, color = '#ffffff', sizeAttenuation = true,
}: {
  count: number; minR: number; maxR: number; size: number;
  opacity: number; rotSpeed: number; color?: string; sizeAttenuation?: boolean;
}) {
  const ref = useRef<Points>(null);
  const geom = useMemo(() => makeStarGeometry(count, minR, maxR), [count, minR, maxR]);
  useFrame(() => { if (ref.current) ref.current.rotation.y += rotSpeed; });
  return (
    <points ref={ref} geometry={geom}>
      <pointsMaterial
        color={color}
        size={size}
        transparent
        opacity={opacity}
        sizeAttenuation={sizeAttenuation}
        depthWrite={false}
      />
    </points>
  );
}

function ParallaxStarField({ density }: { density: number }) {
  // 強化對比：far 極慢、mid 快 3x、near 快 6x
  return (
    <>
      <StarFieldLayer count={Math.round(density)} minR={180} maxR={320} size={0.5} opacity={0.7} rotSpeed={0.00005} sizeAttenuation={false} />
      <StarFieldLayer count={Math.round(density * 0.35)} minR={100} maxR={160} size={1.1} opacity={0.5} rotSpeed={0.00015} color="#cfe1ff" />
      <StarFieldLayer count={Math.round(density * 0.12)} minR={60} maxR={95} size={1.6} opacity={0.38} rotSpeed={0.00030} color="#a8c9ff" />
    </>
  );
}

// ══════════════════════════════════════════════════
// Bonus — 隨機 city pulse activation（每 2-5s 隨機 city 活躍 3s）
// ══════════════════════════════════════════════════

function useRandomPulse(pulseMap: React.MutableRefObject<PulseMap>, clockRef: React.MutableRefObject<number>) {
  useEffect(() => {
    let mounted = true;
    const schedule = () => {
      if (!mounted) return;
      const delay = 1500 + Math.random() * 2500; // 1.5-4s
      setTimeout(() => {
        const ci = Math.floor(Math.random() * CITIES.length);
        pulseMap.current.set(ci, clockRef.current + 2.5); // 活躍 2.5 秒
        schedule();
      }, delay);
    };
    schedule();
    return () => { mounted = false; };
  }, [pulseMap, clockRef]);
}

// ══════════════════════════════════════════════════
// Scene wrapper
// ══════════════════════════════════════════════════

function EarthScene({ isMobile }: { isMobile: boolean }) {
  const mainRef = useRef<Group>(null);
  const pulseMap = useRef<PulseMap>(new Map());
  const clockRef = useRef(0);
  const particlesPerLine = isMobile ? 80 : 200;
  const lineCount = isMobile ? 14 : 26;
  const starDensity = isMobile ? 4000 : 10000;

  useRandomPulse(pulseMap, clockRef);

  useFrame(({ clock }) => {
    clockRef.current = clock.elapsedTime;
    if (mainRef.current) mainRef.current.rotation.y += 0.0008;
  });

  return (
    <>
      <ambientLight intensity={0.55} />
      {/* v7.3 Chairman：海要藍要亮 — 主光改冷白、強度↑；補一個藍色 rim light 讓海反光更藍 */}
      <directionalLight position={[5, 3, 5]} color="#e8f0ff" intensity={2.2} />
      <pointLight position={[-4, -2, 3]} color={BLUE_BRIGHT} intensity={0.8} />
      <hemisphereLight color="#b0d4ff" groundColor="#0a1428" intensity={0.4} />

      <ParallaxStarField density={starDensity} />

      {/* v7.2 Chairman 2026-04-24：拿掉 FresnelAtmosphere 外環（視覺太厚重壓迫）
          組件定義保留為 dead code 便於未來恢復，這裡不 render */}

      <group ref={mainRef} rotation={[0, INITIAL_EARTH_ROT_Y, 0]}>
        <RealisticEarth />
        <EarthClouds />
        <CityLightDots pulseMap={pulseMap} />
        <ParticleStreams
          pulseMap={pulseMap}
          particlesPerLine={particlesPerLine}
          lineCount={lineCount}
        />
        <CorePylon />
        {/* P1-2 城市標籤搬進 mainRef 一起旋轉 — fix Chairman v7 反饋「TPE 跑到印度」座標偏移 */}
        <CityLabels earthRef={mainRef} />
      </group>
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
