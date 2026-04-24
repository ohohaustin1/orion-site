import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import {
  CatmullRomCurve3,
  Color,
  DoubleSide,
  type Mesh,
  type Group,
  TextureLoader,
  Vector3,
} from 'three';

/* ==============================================================
   Earth3D — 金色線框地球 + 城市光點 + 閃現連線 + 中央 griffin LOGO
   依賴：@react-three/fiber, three
   ============================================================== */

const GOLD = '#C5A059';
const BRIGHT_GOLD = '#FFD369';

function cityPositions(n: number) {
  // 均勻分布球面（Fibonacci sphere）
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
          <meshBasicMaterial color={BRIGHT_GOLD} />
        </mesh>
      ))}
    </group>
  );
}

function ConnectionLines({ cities }: { cities: Vector3[] }) {
  // Pre-build set of curves; animate dash offset to simulate electricity
  const curves = useMemo(() => {
    const out: Array<{ curve: CatmullRomCurve3; color: Color; offset: number }> = [];
    for (let i = 0; i < 14; i++) {
      const start = cities[Math.floor(Math.random() * cities.length)];
      const end = new Vector3(0, 0, 0);                            // 匯聚中央
      const mid = start.clone().multiplyScalar(1.45);               // 拉出來再收
      out.push({
        curve: new CatmullRomCurve3([start.clone(), mid, end]),
        color: new Color(BRIGHT_GOLD),
        offset: Math.random() * Math.PI * 2,
      });
    }
    return out;
  }, [cities]);

  const groupRef = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    // pulse each tube's opacity
    const t = clock.getElapsedTime();
    groupRef.current.children.forEach((child, i) => {
      const m = (child as Mesh).material as { opacity?: number; transparent?: boolean };
      if (m && typeof m.opacity === 'number') {
        m.opacity = 0.25 + 0.55 * (0.5 + Math.sin(t * 1.6 + curves[i].offset) * 0.5);
      }
    });
    // rotate with the earth for cohesion
    groupRef.current.rotation.y += 0.003;
  });

  return (
    <group ref={groupRef}>
      {curves.map((c, i) => (
        <mesh key={i}>
          <tubeGeometry args={[c.curve, 48, 0.008, 6, false]} />
          <meshBasicMaterial color={BRIGHT_GOLD} transparent opacity={0.5} side={DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

function CentralLogo() {
  const texture = useLoader(TextureLoader, '/brand/griffin-128.png');
  const ref = useRef<Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.5) * 0.08;
      const scale = 1 + Math.sin(clock.getElapsedTime() * 1.2) * 0.04;
      ref.current.scale.setScalar(0.45 * scale);
    }
  });
  return (
    <mesh ref={ref}>
      <planeGeometry args={[1.1, 1.1]} />
      <meshBasicMaterial map={texture} transparent alphaTest={0.05} toneMapped={false} />
    </mesh>
  );
}

export default function Earth3D() {
  const cities = useMemo(() => cityPositions(20), []);

  return (
    <Canvas
      camera={{ position: [0, 0, 3], fov: 50 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.35} />
      <pointLight position={[10, 10, 10]} color={GOLD} intensity={1.8} />
      <pointLight position={[-5, -4, 3]} color={BRIGHT_GOLD} intensity={0.8} />
      <WireframeEarth />
      <CityLights cities={cities} />
      <ConnectionLines cities={cities} />
      <CentralLogo />
    </Canvas>
  );
}
