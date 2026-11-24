import { useMemo, useRef, type ComponentType } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { Html, useTexture } from "@react-three/drei";
import * as THREE from "three";
import data from "@/data/portfolio.json";
import { STATIONS, LANTERNS, faceCentre, approachPoint, type StationId } from "./stations";

const C = {
  grass: "#9cc46b",
  grassDark: "#86b257",
  dirt: "#c68b59",
  sand: "#efd5a4",
  water: "#79c6d6",
  wood: "#b9824f",
  woodDark: "#8a5a34",
  stone: "#ebdfc7",
  rock: "#a9a59c",
  leaf: "#6faa4c",
  leaf2: "#8cc461",
  petal: "#ffffff",
  pollen: "#f6c445",
  glow: "#ffd27a",
};

type MeshProps = { position?: [number, number, number]; rotation?: [number, number, number]; scale?: number };

function Box({ args, color, ...p }: MeshProps & { args: [number, number, number]; color: string }) {
  return (
    <mesh castShadow receiveShadow {...p}>
      <boxGeometry args={args} />
      <meshStandardMaterial color={color} roughness={0.8} />
    </mesh>
  );
}

// ------------------------------------------------------------------ scenery

function Tree({ position, scale = 1 }: MeshProps) {
  return (
    <group position={position} scale={scale}>
      <mesh castShadow position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.12, 0.18, 1.2, 8]} />
        <meshStandardMaterial color={C.woodDark} roughness={0.9} />
      </mesh>
      <mesh castShadow position={[0, 1.55, 0]}>
        <icosahedronGeometry args={[0.85, 1]} />
        <meshStandardMaterial color={C.leaf} roughness={0.85} flatShading />
      </mesh>
      <mesh castShadow position={[0.25, 2.15, 0.1]}>
        <icosahedronGeometry args={[0.55, 1]} />
        <meshStandardMaterial color={C.leaf2} roughness={0.85} flatShading />
      </mesh>
    </group>
  );
}

function Lantern({ position }: MeshProps) {
  return (
    <group position={position}>
      <Box args={[0.12, 1.3, 0.12]} position={[0, 0.65, 0]} color={C.woodDark} />
      <mesh position={[0, 1.42, 0]}>
        <boxGeometry args={[0.3, 0.32, 0.3]} />
        <meshStandardMaterial color={C.glow} emissive={C.glow} emissiveIntensity={0.9} />
      </mesh>
      <Box args={[0.38, 0.06, 0.38]} position={[0, 1.61, 0]} color={C.woodDark} />
    </group>
  );
}

function Flowers() {
  const spots = useMemo(() => {
    let seed = 11;
    const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const out: [number, number][] = [];
    while (out.length < 34) {
      const a = rand() * Math.PI * 2;
      const r = 3 + rand() * 5;
      const x = Math.cos(a) * r;
      const z = Math.sin(a) * r;
      if (STATIONS.some((s) => Math.hypot(s.position[0] - x, s.position[2] - z) < 1.6)) continue;
      out.push([x, z]);
    }
    return out;
  }, []);
  return (
    <group>
      {spots.map(([x, z], i) => (
        <group key={i} position={[x, 0.06, z]} rotation={[0, i, 0]}>
          {[0, 1, 2, 3, 4].map((k) => (
            <mesh key={k} position={[Math.cos((k / 5) * Math.PI * 2) * 0.07, 0.05, Math.sin((k / 5) * Math.PI * 2) * 0.07]}>
              <sphereGeometry args={[0.055, 8, 6]} />
              <meshStandardMaterial color={C.petal} />
            </mesh>
          ))}
          <mesh position={[0, 0.07, 0]}>
            <sphereGeometry args={[0.04, 8, 6]} />
            <meshStandardMaterial color={C.pollen} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Pond({ position }: MeshProps) {
  return (
    <group position={position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]} receiveShadow>
        <circleGeometry args={[1.2, 32]} />
        <meshStandardMaterial color={C.water} roughness={0.2} />
      </mesh>
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return (
          <mesh key={i} castShadow position={[Math.cos(a) * 1.3, 0.1, Math.sin(a) * 1.3]} scale={[1, 0.6, 1]}>
            <dodecahedronGeometry args={[0.22, 0]} />
            <meshStandardMaterial color={C.stone} flatShading />
          </mesh>
        );
      })}
      <mesh rotation={[-Math.PI / 2, 0, 0.6]} position={[0.35, 0.07, -0.2]}>
        <circleGeometry args={[0.22, 16, 0.4, Math.PI * 1.8]} />
        <meshStandardMaterial color={C.leaf} />
      </mesh>
    </group>
  );
}

// ------------------------------------------------------------------ stations

function Easel() {
  const photo = useTexture(data.about.profile.photo);
  photo.colorSpace = THREE.SRGBColorSpace;
  return (
    <group>
      <Box args={[0.08, 1.7, 0.08]} position={[-0.42, 0.85, -0.1]} rotation={[0.12, 0, 0.1]} color={C.wood} />
      <Box args={[0.08, 1.7, 0.08]} position={[0.42, 0.85, -0.1]} rotation={[0.12, 0, -0.1]} color={C.wood} />
      <Box args={[0.08, 1.6, 0.08]} position={[0, 0.8, -0.45]} rotation={[-0.35, 0, 0]} color={C.wood} />
      <Box args={[1.1, 1.1, 0.08]} position={[0, 1.35, 0]} rotation={[-0.12, 0, 0]} color={C.woodDark} />
      <mesh position={[0, 1.36, 0.05]} rotation={[-0.12, 0, 0]}>
        <planeGeometry args={[0.92, 0.92]} />
        <meshStandardMaterial map={photo} roughness={0.7} />
      </mesh>
      <Box args={[0.9, 0.06, 0.18]} position={[0, 0.75, 0.05]} color={C.wood} />
    </group>
  );
}

function Desk() {
  return (
    <group>
      <Box args={[1.9, 0.1, 0.95]} position={[0, 0.82, 0]} color={C.wood} />
      {[-0.85, 0.85].map((x) => [-0.38, 0.38].map((z) => <Box key={`${x}${z}`} args={[0.08, 0.8, 0.08]} position={[x, 0.4, z]} color={C.woodDark} />))}
      {/* laptop */}
      <Box args={[0.7, 0.04, 0.48]} position={[0, 0.89, 0.08]} color="#c9ccd3" />
      <group position={[0, 0.9, -0.15]} rotation={[-0.35, 0, 0]}>
        <Box args={[0.7, 0.46, 0.03]} position={[0, 0.23, 0]} color="#c9ccd3" />
        <mesh position={[0, 0.23, 0.017]}>
          <planeGeometry args={[0.62, 0.38]} />
          <meshStandardMaterial color="#2f5bff" emissive="#3b6bff" emissiveIntensity={0.8} />
        </mesh>
      </group>
      {/* mug + plant */}
      <mesh castShadow position={[0.62, 0.95, 0.15]}>
        <cylinderGeometry args={[0.07, 0.07, 0.16, 16]} />
        <meshStandardMaterial color="#fafafa" />
      </mesh>
      <mesh castShadow position={[-0.65, 0.98, -0.1]}>
        <cylinderGeometry args={[0.1, 0.08, 0.22, 12]} />
        <meshStandardMaterial color="#d9775b" />
      </mesh>
      <mesh castShadow position={[-0.65, 1.2, -0.1]}>
        <icosahedronGeometry args={[0.18, 0]} />
        <meshStandardMaterial color={C.leaf} flatShading />
      </mesh>
      {/* chair */}
      <group position={[0, 0, 0.9]}>
        <Box args={[0.6, 0.08, 0.55]} position={[0, 0.5, 0]} color={C.woodDark} />
        <Box args={[0.6, 0.6, 0.08]} position={[0, 0.82, 0.25]} color={C.woodDark} />
        {[-0.25, 0.25].map((x) => [-0.22, 0.22].map((z) => <Box key={`${x}${z}`} args={[0.06, 0.5, 0.06]} position={[x, 0.25, z]} color={C.woodDark} />))}
      </group>
    </group>
  );
}

function Bookshelf() {
  const colors = ["#2f5bff", "#e2725b", "#f2c14e", "#5fa96b", "#8f6bd8", "#3fb5c9", "#e58fb0"];
  return (
    <group>
      <Box args={[1.7, 2.1, 0.5]} position={[0, 1.05, -0.05]} color={C.woodDark} />
      {[0.45, 1.05, 1.65].map((y, row) => (
        <group key={y} position={[0, y, 0.08]}>
          <Box args={[1.5, 0.05, 0.4]} position={[0, -0.2, 0]} color={C.wood} />
          {Array.from({ length: 8 }, (_, i) => (
            <Box
              key={i}
              args={[0.13, 0.32 + ((i * 7 + row * 3) % 4) * 0.03, 0.3]}
              position={[-0.62 + i * 0.175, -0.02, 0.04]}
              rotation={[0, 0, i === 5 ? 0.18 : 0]}
              color={colors[(i + row * 2) % colors.length]}
            />
          ))}
        </group>
      ))}
    </group>
  );
}

function Signboard() {
  return (
    <group>
      <Box args={[0.12, 1.5, 0.12]} position={[-0.55, 0.75, 0]} color={C.woodDark} />
      <Box args={[0.12, 1.5, 0.12]} position={[0.55, 0.75, 0]} color={C.woodDark} />
      <Box args={[1.5, 0.75, 0.08]} position={[0, 1.2, 0.04]} color={C.wood} />
      {[0, 1, 2].map((i) => (
        <Box key={i} args={[1.1 - i * 0.2, 0.06, 0.02]} position={[-0.1 + i * 0.1, 1.38 - i * 0.16, 0.09]} color="#fff4de" />
      ))}
    </group>
  );
}

function Mailbox() {
  return (
    <group>
      <Box args={[0.12, 1, 0.12]} position={[0, 0.5, 0]} color={C.woodDark} />
      <mesh castShadow position={[0, 1.15, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <capsuleGeometry args={[0.2, 0.35, 6, 16]} />
        <meshStandardMaterial color="#d95b4b" roughness={0.5} />
      </mesh>
      <Box args={[0.03, 0.3, 0.05]} position={[0.22, 1.3, -0.05]} color="#f2c14e" />
      <Box args={[0.03, 0.12, 0.16]} position={[0.22, 1.42, 0.02]} color="#f2c14e" />
    </group>
  );
}

const MODELS: Record<StationId, ComponentType> = {
  about: Easel,
  projects: Desk,
  skills: Bookshelf,
  services: Signboard,
  contact: Mailbox,
};

function StationRing({ active }: { active: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const s = active ? 1 + Math.sin(clock.elapsedTime * 4) * 0.05 : 1;
    ref.current.scale.setScalar(s);
  });
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
      <ringGeometry args={[1.15, 1.3, 40]} />
      <meshBasicMaterial color={active ? "#2f5bff" : "#ffffff"} transparent opacity={active ? 0.9 : 0.35} />
    </mesh>
  );
}

// ------------------------------------------------------------------ island

type IslandProps = {
  nearId: StationId | null;
  onGroundClick: (x: number, z: number) => void;
  onStationClick: (id: StationId) => void;
};

export default function Island({ nearId, onGroundClick, onStationClick }: IslandProps) {
  const trees: [number, number, number, number][] = [
    [-7.2, 0, -2.5, 1.1], [-6.4, 0, 4.6, 0.9], [-1.2, 0, -7.6, 1.2], [6.6, 0, -2.2, 1], [7.4, 0, 3.6, 0.85],
    [-4.2, 0, 6.8, 1], [4.8, 0, -6.6, 0.95], [-7.6, 0, 1.1, 0.8], [0.6, 0, -6.8, 0.8],
  ];
  const ground = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    onGroundClick(e.point.x, e.point.z);
  };

  return (
    <group>
      {/* water */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.45, 0]} receiveShadow onPointerDown={ground}>
        <circleGeometry args={[60, 64]} />
        <meshStandardMaterial color={C.water} roughness={0.3} />
      </mesh>
      {/* sand, dirt cliff, grass top */}
      <mesh position={[0, -0.42, 0]} receiveShadow>
        <cylinderGeometry args={[10.2, 10.6, 0.12, 48]} />
        <meshStandardMaterial color={C.sand} />
      </mesh>
      <mesh position={[0, -0.2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[9.3, 9.6, 0.45, 48]} />
        <meshStandardMaterial color={C.dirt} roughness={0.9} />
      </mesh>
      <mesh position={[0, 0, 0]} receiveShadow onPointerDown={ground}>
        <cylinderGeometry args={[9.35, 9.35, 0.06, 48]} />
        <meshStandardMaterial color={C.grass} roughness={0.95} />
      </mesh>
      {/* stone plaza + stepping stones to every station */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]} receiveShadow onPointerDown={ground}>
        <circleGeometry args={[2.4, 40]} />
        <meshStandardMaterial color={C.stone} roughness={0.9} />
      </mesh>
      {STATIONS.map((s) => {
        const [ax, az] = approachPoint(s.position, 1.4);
        const steps = 4;
        return Array.from({ length: steps }, (_, i) => {
          const t = (i + 1) / (steps + 1);
          const len = Math.hypot(ax, az);
          const r = 2.4 + (len - 2.4) * t;
          return (
            <mesh key={`${s.id}${i}`} rotation={[-Math.PI / 2, 0, i]} position={[(ax / len) * r, 0.04, (az / len) * r]} receiveShadow>
              <circleGeometry args={[0.32, 7]} />
              <meshStandardMaterial color={C.stone} />
            </mesh>
          );
        });
      })}
      {/* wooden dock at the front */}
      <group position={[-1.6, 0, 9.6]}>
        {Array.from({ length: 6 }, (_, i) => (
          <Box key={i} args={[1.4, 0.08, 0.32]} position={[0, -0.05, i * 0.38]} color={i % 2 ? C.wood : "#c48e5b"} />
        ))}
        <Box args={[0.12, 0.7, 0.12]} position={[-0.7, -0.2, 2]} color={C.woodDark} />
        <Box args={[0.12, 0.7, 0.12]} position={[0.7, -0.2, 2]} color={C.woodDark} />
      </group>

      {trees.map(([x, y, z, s], i) => (
        <Tree key={i} position={[x, y, z]} scale={s} />
      ))}
      {LANTERNS.map((p, i) => (
        <Lantern key={i} position={p as [number, number, number]} />
      ))}
      <Pond position={[0.2, 0, -7.2]} />
      <Flowers />

      {STATIONS.map((s) => {
        const Model = MODELS[s.id];
        const active = nearId === s.id;
        return (
          <group key={s.id} position={s.position}>
            <group
              rotation={[0, faceCentre(s.position), 0]}
              onPointerDown={(e) => {
                e.stopPropagation();
                onStationClick(s.id);
              }}
              onPointerOver={() => (document.body.style.cursor = "pointer")}
              onPointerOut={() => (document.body.style.cursor = "")}
            >
              <Model />
            </group>
            <StationRing active={active} />
            <Html position={[0, s.id === "skills" ? 2.7 : 2.3, 0]} center zIndexRange={[10, 0]} style={{ pointerEvents: "none" }}>
              <div className={`world-tag ${active ? "is-active" : ""}`}>{s.label}</div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}
