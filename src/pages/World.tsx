import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import Island from "@/components/world/Island";
import Player, { type WalkTarget } from "@/components/world/Player";
import Panel from "@/components/world/Panel";
import { STATIONS, approachPoint, type StationId } from "@/components/world/stations";

const GREETING = "Hi, I'm Abu! 👋 Walk around and explore my world.";

export default function World() {
  const keys = useRef<Set<string>>(new Set());
  const target = useRef<WalkTarget>(null);
  const [started, setStarted] = useState(false);
  const [nearId, setNearId] = useState<StationId | null>(null);
  const [openId, setOpenId] = useState<StationId | null>(null);
  const [speech, setSpeech] = useState("");
  const [greetKey, setGreetKey] = useState(0);
  const speechTimer = useRef(0);
  // station the player clicked on and is walking to
  const pendingOpen = useRef<StationId | null>(null);

  const say = useCallback((text: string, ms = 3500) => {
    window.clearTimeout(speechTimer.current);
    setSpeech(text);
    speechTimer.current = window.setTimeout(() => setSpeech(""), ms);
  }, []);

  // keyboard
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.closest?.("input, textarea")) return;
      keys.current.add(e.code);
      if (e.code.startsWith("Arrow") || e.code === "Space") e.preventDefault();
    };
    const up = (e: KeyboardEvent) => keys.current.delete(e.code);
    const clear = () => keys.current.clear();
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", clear);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", clear);
    };
  }, []);

  // E / Enter opens the nearby station
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!started || openId) return;
      if ((e.code === "KeyE" || e.code === "Enter") && nearId) {
        keys.current.clear();
        setOpenId(nearId);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [started, openId, nearId]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      document.body.style.cursor = "";
    };
  }, []);

  const onNearChange = useCallback(
    (id: StationId | null) => {
      setNearId(id);
      if (id && pendingOpen.current === id) {
        pendingOpen.current = null;
        target.current = null;
        setOpenId(id);
        return;
      }
      if (id) say(STATIONS.find((s) => s.id === id)!.line);
    },
    [say]
  );

  const start = () => {
    setStarted(true);
    setGreetKey((k) => k + 1);
    say(GREETING, 5000);
  };

  return (
    <div className="world-root" data-testid="world-page">
      <Canvas shadows dpr={[1, 1.75]} camera={{ fov: 40, position: [0, 9, 12], near: 0.1, far: 120 }}>
        <color attach="background" args={["#bfe3ee"]} />
        <fog attach="fog" args={["#bfe3ee", 22, 48]} />
        <hemisphereLight args={["#fff6e5", "#7fae6a", 0.9]} />
        <directionalLight
          position={[8, 14, 6]}
          intensity={2.2}
          color="#fff1d6"
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-12}
          shadow-camera-right={12}
          shadow-camera-top={12}
          shadow-camera-bottom={-12}
          shadow-bias={-0.0004}
        />
        <Suspense fallback={null}>
          <Island
            nearId={nearId}
            onGroundClick={(x, z) => {
              if (!started || openId) return;
              pendingOpen.current = null;
              target.current = { x, z, openOnArrive: null };
            }}
            onStationClick={(id) => {
              if (!started || openId) return;
              if (nearId === id) return setOpenId(id);
              const s = STATIONS.find((st) => st.id === id)!;
              const [x, z] = approachPoint(s.position);
              pendingOpen.current = id;
              target.current = { x, z, openOnArrive: id };
            }}
          />
          <Player
            keys={keys}
            target={target}
            frozen={!started || !!openId}
            speech={started ? speech : ""}
            greetKey={greetKey}
            onNearChange={onNearChange}
            onArriveOpen={(id) => setOpenId(id)}
          />
        </Suspense>
      </Canvas>

      {/* HUD */}
      <div className="world-hud-top">
        <Link href="/" className="world-pill">
          <ArrowLeft size={16} /> Classic site
        </Link>
        <span className="world-brand">Abu's world</span>
      </div>

      {started && nearId && !openId && (
        <button className="world-prompt" onClick={() => setOpenId(nearId)}>
          <kbd>E</kbd> Open {STATIONS.find((s) => s.id === nearId)!.label}
        </button>
      )}

      {started && !openId && (
        <p className="world-help">Arrows / WASD or click to walk · Shift to run · E to interact · Scroll to zoom</p>
      )}

      {openId && <Panel id={openId} onClose={() => setOpenId(null)} />}

      {!started && (
        <div className="world-intro">
          <div className="world-card">
            <p className="text-sm uppercase tracking-[0.2em] text-[#8a5a34] mb-2">Welcome to</p>
            <h1 className="text-4xl md:text-5xl font-semibold mb-3">Abu's world</h1>
            <p className="text-[#4a3524] mb-6">
              Full-stack and AI developer from Lahore. Walk around my little island to see my work, skills and story.
            </p>
            <ul className="world-controls">
              <li><kbd>↑ ↓ ← →</kbd> / <kbd>WASD</kbd> or click / tap<span>Move</span></li>
              <li><kbd>Shift</kbd><span>Run</span></li>
              <li><kbd>E</kbd> or click an object<span>Interact</span></li>
              <li><kbd>Scroll</kbd><span>Zoom</span></li>
            </ul>
            <div className="flex flex-wrap gap-3 justify-center mt-7">
              <button className="world-btn" onClick={start} data-testid="world-start">
                Let's go
              </button>
              <Link href="/" className="world-btn is-ghost">
                Classic site
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
