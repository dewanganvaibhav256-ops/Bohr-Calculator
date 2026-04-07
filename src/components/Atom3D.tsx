import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, Line, Text, Float } from "@react-three/drei";
import * as THREE from "three";

interface ElectronOrbitProps {
  radius: number;
  speed: number;
  color: string;
  isActive: boolean;
  label: number;
}

function ElectronOrbit({ radius, speed, color, isActive, label }: ElectronOrbitProps) {
  const electronRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  const orbitPoints = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 128; i++) {
      const angle = (i / 128) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
    }
    return pts;
  }, [radius]);

  useFrame(({ clock }) => {
    if (electronRef.current && isActive) {
      const t = clock.getElapsedTime() * speed;
      electronRef.current.position.x = Math.cos(t) * radius;
      electronRef.current.position.z = Math.sin(t) * radius;
    }
    if (glowRef.current && isActive) {
      const t = clock.getElapsedTime() * speed;
      glowRef.current.position.x = Math.cos(t) * radius;
      glowRef.current.position.z = Math.sin(t) * radius;
      glowRef.current.scale.setScalar(1 + Math.sin(clock.getElapsedTime() * 3) * 0.3);
    }
  });

  return (
    <group>
      <Line
        points={orbitPoints}
        color={isActive ? color : "#2a2f3d"}
        lineWidth={isActive ? 1.5 : 0.5}
        opacity={isActive ? 0.7 : 0.25}
        transparent
        dashed={!isActive}
        dashSize={0.2}
        gapSize={0.15}
      />
      {isActive && (
        <>
          <Sphere ref={electronRef} args={[0.12, 16, 16]} position={[radius, 0, 0]}>
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
          </Sphere>
          <Sphere ref={glowRef} args={[0.3, 16, 16]} position={[radius, 0, 0]}>
            <meshStandardMaterial color={color} transparent opacity={0.15} />
          </Sphere>
        </>
      )}
      <Text
        position={[radius + 0.3, 0.3, 0]}
        fontSize={0.18}
        color={isActive ? "#e2e8f0" : "#64748b"}
        anchorX="left"
      >
        {`n=${label}`}
      </Text>
    </group>
  );
}

function Nucleus({ Z }: { Z: number }) {
  const nucleusRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (nucleusRef.current) {
      nucleusRef.current.rotation.y = clock.getElapsedTime() * 0.3;
    }
  });

  const protons = useMemo(() => {
    const positions: [number, number, number][] = [];
    const count = Math.min(Z, 10);
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(1 - 2 * (i + 0.5) / count);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = 0.25;
      positions.push([r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi)]);
    }
    return positions;
  }, [Z]);

  return (
    <group ref={nucleusRef}>
      {protons.map((pos, i) => (
        <Sphere key={i} args={[0.1, 12, 12]} position={pos}>
          <meshStandardMaterial
            color={i % 2 === 0 ? "#38bdf8" : "#f472b6"}
            emissive={i % 2 === 0 ? "#38bdf8" : "#f472b6"}
            emissiveIntensity={1.5}
          />
        </Sphere>
      ))}
      {/* Core glow */}
      <Sphere args={[0.45, 16, 16]}>
        <meshStandardMaterial color="#38bdf8" transparent opacity={0.08} />
      </Sphere>
      <pointLight color="#38bdf8" intensity={3} distance={5} />
    </group>
  );
}

function PhotonBeam({ from, to, color }: { from: number; to: number; color: string }) {
  const beamRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (beamRef.current) {
      const t = (clock.getElapsedTime() % 2) / 2;
      const y = from + (to - from) * t;
      beamRef.current.position.y = y;
      beamRef.current.scale.setScalar(1 - t * 0.5);
      (beamRef.current.material as THREE.MeshStandardMaterial).opacity = 1 - t;
    }
  });

  return (
    <Float speed={4} floatIntensity={0.3}>
      <Sphere ref={beamRef} args={[0.15, 12, 12]} position={[0, from, 0]}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3} transparent opacity={0.8} />
      </Sphere>
    </Float>
  );
}

interface Atom3DProps {
  Z: number;
  ni: number;
  nf: number;
  wavelengthNm: number | null;
}

function wavelengthToHex(nm: number): string {
  if (nm < 380) return "#a855f7";
  if (nm < 450) return "#6366f1";
  if (nm < 490) return "#3b82f6";
  if (nm < 560) return "#22c55e";
  if (nm < 590) return "#eab308";
  if (nm < 650) return "#f97316";
  return "#ef4444";
}

function Scene({ Z, ni, nf, wavelengthNm }: Atom3DProps) {
  const maxLevel = Math.max(ni, nf, 4);
  const orbits = useMemo(() => {
    const levels = new Set<number>();
    for (let i = 1; i <= Math.min(maxLevel, 7); i++) levels.add(i);
    levels.add(ni);
    levels.add(nf);
    return Array.from(levels).sort((a, b) => a - b);
  }, [ni, nf, maxLevel]);

  const getRadius = (n: number) => 0.6 + n * 0.55;
  const isEmission = ni > nf;
  const photonColor = wavelengthNm ? wavelengthToHex(wavelengthNm) : "#38bdf8";

  return (
    <>
      <ambientLight intensity={0.15} />
      <pointLight position={[10, 10, 10]} intensity={0.3} />

      <Nucleus Z={Z} />

      {orbits.map(n => (
        <ElectronOrbit
          key={n}
          radius={getRadius(n)}
          speed={2.5 / n}
          color={n === ni ? "#38bdf8" : n === nf ? "#a78bfa" : "#475569"}
          isActive={n === ni || n === nf}
          label={n}
        />
      ))}

      {isEmission && wavelengthNm && (
        <PhotonBeam from={0} to={getRadius(nf) + 1} color={photonColor} />
      )}

      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={2}
        maxDistance={12}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  );
}

export default function Atom3D(props: Atom3DProps) {
  return (
    <div className="w-full aspect-square max-h-[400px] rounded-2xl overflow-hidden border border-border bg-background/50">
      <Canvas camera={{ position: [0, 3, 5], fov: 50 }} dpr={[1, 2]}>
        <Scene {...props} />
      </Canvas>
      <div className="text-center text-[10px] text-muted-foreground -mt-6 pb-2 relative z-10">
        Drag to rotate • Scroll to zoom
      </div>
    </div>
  );
}
