import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { createMiniMe } from "./miniMe";
import { STATIONS, LANTERNS, ISLAND_RADIUS, PLAYER_START, type StationId } from "./stations";

export type WalkTarget = { x: number; z: number; openOnArrive: StationId | null } | null;

type Props = {
  keys: MutableRefObject<Set<string>>;
  target: MutableRefObject<WalkTarget>;
  frozen: boolean;
  speech: string;
  greetKey: number;
  onNearChange: (id: StationId | null) => void;
  onArriveOpen: (id: StationId) => void;
};

const SCALE = 0.85;
const WALK = 3.0;
const RUN = 5.2;
const CAM_OFFSET = new THREE.Vector3(0, 8.5, 10.5);
const NEAR_DIST = 2.1;

const obstacles = [
  ...STATIONS.map((s) => ({ x: s.position[0], z: s.position[2], r: s.radius })),
  // trees, lanterns, pond
  { x: -7.2, z: -2.5, r: 0.5 }, { x: -6.4, z: 4.6, r: 0.45 }, { x: -1.2, z: -7.6, r: 0.55 }, { x: 6.6, z: -2.2, r: 0.5 },
  { x: 7.4, z: 3.6, r: 0.45 }, { x: -4.2, z: 6.8, r: 0.5 }, { x: 4.8, z: -6.6, r: 0.5 }, { x: -7.6, z: 1.1, r: 0.4 },
  { x: 0.6, z: -6.8, r: 0.4 },
  ...LANTERNS.map(([x, , z]) => ({ x, z, r: 0.2 })),
  { x: 0.2, z: -7.2, r: 1.45 },
];

export default function Player({ keys, target, frozen, speech, greetKey, onNearChange, onArriveOpen }: Props) {
  const group = useRef<THREE.Group>(null);
  const me = useMemo(() => createMiniMe(), []);
  const { camera, gl } = useThree();
  // tall phone screens start zoomed out so more of the island fits
  const zoom = useRef(window.innerWidth / window.innerHeight < 0.8 ? 1.6 : 1);
  const nearRef = useRef<StationId | null>(null);
  const yaw = useRef(0);
  const stuck = useRef(0);
  const prev = useMemo(() => new THREE.Vector3(), []);

  // greeting wave whenever greetKey changes (start of the game)
  useEffect(() => {
    if (greetKey > 0) me.play("wave", true);
  }, [greetKey, me]);

  useEffect(() => {
    me.setTalking(!!speech);
    const t = window.setTimeout(() => me.setTalking(false), Math.min(2500, speech.length * 45));
    return () => window.clearTimeout(t);
  }, [speech, me]);

  // scroll / pinch to zoom
  useEffect(() => {
    const el = gl.domElement;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      zoom.current = THREE.MathUtils.clamp(zoom.current + e.deltaY * 0.0012, 0.6, 1.7);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [gl]);

  const camGoal = useMemo(() => new THREE.Vector3(), []);
  const lookAt = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, rawDt) => {
    const g = group.current;
    if (!g) return;
    const dt = Math.min(rawDt, 0.1);
    const k = keys.current;

    // ---- input → direction
    let dx = 0;
    let dz = 0;
    if (!frozen) {
      if (k.has("ArrowUp") || k.has("KeyW")) dz -= 1;
      if (k.has("ArrowDown") || k.has("KeyS")) dz += 1;
      if (k.has("ArrowLeft") || k.has("KeyA")) dx -= 1;
      if (k.has("ArrowRight") || k.has("KeyD")) dx += 1;
    }
    const usingKeys = dx !== 0 || dz !== 0;
    if (usingKeys) target.current = null;
    const t = target.current;
    if (!usingKeys && t && !frozen) {
      const tx = t.x - g.position.x;
      const tz = t.z - g.position.z;
      const d = Math.hypot(tx, tz);
      if (d < 0.12) {
        if (t.openOnArrive) onArriveOpen(t.openOnArrive);
        target.current = null;
      } else {
        dx = tx / d;
        dz = tz / d;
      }
    }

    const len = Math.hypot(dx, dz);
    prev.set(g.position.x, 0, g.position.z);
    const running = k.has("ShiftLeft") || k.has("ShiftRight");
    const speed = running ? RUN : WALK;
    if (len > 0) {
      dx /= len;
      dz /= len;
      g.position.x += dx * speed * dt;
      g.position.z += dz * speed * dt;
      yaw.current = Math.atan2(dx, dz);
    }

    // ---- collisions: push out of obstacles, stay on the island
    for (const o of obstacles) {
      const ox = g.position.x - o.x;
      const oz = g.position.z - o.z;
      const d = Math.hypot(ox, oz);
      const min = o.r + 0.35;
      if (d < min && d > 1e-4) {
        g.position.x = o.x + (ox / d) * min;
        g.position.z = o.z + (oz / d) * min;
      }
    }
    // click-walking but blocked by something: give up instead of walking in place
    if (target.current && len > 0) {
      const moved = Math.hypot(g.position.x - prev.x, g.position.z - prev.z);
      stuck.current = moved < speed * dt * 0.25 ? stuck.current + dt : 0;
      if (stuck.current > 0.4) {
        target.current = null;
        stuck.current = 0;
      }
    }
    const r = Math.hypot(g.position.x, g.position.z);
    if (r > ISLAND_RADIUS) {
      g.position.x *= ISLAND_RADIUS / r;
      g.position.z *= ISLAND_RADIUS / r;
    }

    // ---- facing + animation
    const diff = Math.atan2(Math.sin(yaw.current - g.rotation.y), Math.cos(yaw.current - g.rotation.y));
    g.rotation.y += diff * Math.min(1, dt * 12);
    if (len > 0) me.play("walk");
    else if (me.current === "walk") me.play("idle");
    me.update(dt, running ? 1.6 : 1);

    // ---- nearest station
    let near: StationId | null = null;
    let best = NEAR_DIST;
    for (const s of STATIONS) {
      const d = Math.hypot(s.position[0] - g.position.x, s.position[2] - g.position.z) - s.radius;
      if (d < best) {
        best = d;
        near = s.id;
      }
    }
    if (near !== nearRef.current) {
      nearRef.current = near;
      onNearChange(near);
    }

    // ---- camera follows
    camGoal.copy(CAM_OFFSET).multiplyScalar(zoom.current).add(g.position);
    camera.position.lerp(camGoal, 1 - Math.exp(-dt * 4));
    lookAt.set(g.position.x, 0.9, g.position.z);
    camera.lookAt(lookAt);
  });

  return (
    <group ref={group} position={PLAYER_START}>
      <primitive object={me.object} scale={SCALE} />
      {speech && (
        <Html position={[0, 2.35, 0]} center zIndexRange={[20, 10]} style={{ pointerEvents: "none" }}>
          <div className="world-bubble">{speech}</div>
        </Html>
      )}
    </group>
  );
}
