import * as THREE from "three";

/**
 * Chibi "mini-Abu" built entirely in code: black square glasses, full beard,
 * curly hair, charcoal suit. Faces +Z, feet at y = 0, about 2 units tall.
 * Moves (idle, walk, wave, yes, thumbs) are animated in code and cross-faded.
 */

export type MiniMe = {
  object: THREE.Group;
  current: string;
  play(name: Move, once?: boolean): void;
  /** walkRate ~1 = normal walk, ~1.6 = run */
  update(dt: number, walkRate: number): void;
  setTalking(on: boolean): void;
};
export type Move = "idle" | "walk" | "wave" | "yes" | "thumbs";

const COLORS = {
  skin: 0xc0845c,
  hair: 0x16110f,
  suit: 0x383b44,
  pants: 0x2c2f36,
  shirt: 0xf1f1ee,
  tie: 0x1d4ed8,
  frame: 0x080808,
  shoe: 0x2a1c14,
  lip: 0x8f4f43,
  eyeWhite: 0xfafafa,
  iris: 0x2b1b12,
};

const mat = (color: number, roughness = 0.6, extra: THREE.MeshStandardMaterialParameters = {}) =>
  new THREE.MeshStandardMaterial({ color, roughness, metalness: 0, ...extra });

function mesh(
  parent: THREE.Object3D,
  geo: THREE.BufferGeometry,
  material: THREE.Material,
  pos: [number, number, number] = [0, 0, 0],
  scale: [number, number, number] = [1, 1, 1],
  rot: [number, number, number] = [0, 0, 0]
) {
  const m = new THREE.Mesh(geo, material);
  m.position.set(...pos);
  m.scale.set(...scale);
  m.rotation.set(...rot);
  m.castShadow = true;
  parent.add(m);
  return m;
}

function roundedRect(w: number, h: number, r: number) {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

// ---------------------------------------------------------------- poses

const KEYS = [
  "body.py", "pelvis.ry",
  "torso.rx", "torso.ry", "torso.rz",
  "head.rx", "head.ry", "head.rz",
  "shL.rx", "shL.rz", "shR.rx", "shR.rz",
  "elL.rx", "elL.rz", "elR.rx", "elR.rz",
  "hipL.rx", "hipR.rx", "knL.rx", "knR.rx",
] as const;
type Key = (typeof KEYS)[number];
type Pose = Record<Key, number>;

const lerp = THREE.MathUtils.lerp;
const smooth = (a: number, b: number, t: number) => {
  const x = THREE.MathUtils.clamp((t - a) / (b - a), 0, 1);
  return x * x * (3 - 2 * x);
};
const envelope = (t: number, dur: number, fadeIn = 0.35, fadeOut = 0.4) =>
  smooth(0, fadeIn, t) * (1 - smooth(dur - fadeOut, dur, t));

function idlePose(t: number): Pose {
  const breathe = Math.sin(t * 1.7);
  const p = Object.fromEntries(KEYS.map((k) => [k, 0])) as Pose;
  p["body.py"] = 0.006 * breathe;
  p["torso.rx"] = 0.015 * breathe;
  p["head.ry"] = 0.06 * Math.sin(t * 0.45);
  p["head.rz"] = 0.025 * Math.sin(t * 0.6);
  p["shL.rz"] = 0.12 + 0.015 * breathe;
  p["shR.rz"] = -0.12 - 0.015 * breathe;
  p["elL.rx"] = -0.18;
  p["elR.rx"] = -0.18;
  return p;
}

function walkPose(phase: number): Pose {
  const p = idlePose(0);
  const s = Math.sin(phase);
  p["body.py"] = 0.03 * Math.abs(Math.cos(phase));
  p["pelvis.ry"] = 0.06 * s;
  p["torso.ry"] = -0.1 * s;
  p["torso.rx"] = 0.06;
  p["head.ry"] = 0.05 * s;
  p["hipL.rx"] = -0.6 * s;
  p["hipR.rx"] = 0.6 * s;
  p["knL.rx"] = 0.1 + 0.8 * Math.max(0, Math.sin(phase - 1.2));
  p["knR.rx"] = 0.1 + 0.8 * Math.max(0, -Math.sin(phase - 1.2));
  p["shL.rx"] = 0.55 * s;
  p["shR.rx"] = -0.55 * s;
  p["elL.rx"] = -0.4 - 0.2 * Math.max(0, -s);
  p["elR.rx"] = -0.4 - 0.2 * Math.max(0, s);
  return p;
}

const MOVES: Record<Move, { loop: boolean; dur: number; pose: (t: number, phase: number) => Pose }> = {
  idle: { loop: true, dur: 0, pose: (t) => idlePose(t) },
  walk: { loop: true, dur: 0, pose: (_t, phase) => walkPose(phase) },
  wave: {
    loop: false,
    dur: 2.4,
    pose: (t) => {
      const p = idlePose(t);
      const e = envelope(t, 2.4);
      p["shR.rz"] = lerp(p["shR.rz"], -2.65, e);
      p["shR.rx"] = lerp(0, -0.25, e);
      p["elR.rx"] = lerp(p["elR.rx"], -0.15, e);
      p["elR.rz"] = e * 0.45 * Math.sin(t * 11);
      p["head.rz"] += 0.1 * e;
      p["torso.rz"] = 0.05 * e;
      return p;
    },
  },
  yes: {
    loop: false,
    dur: 1.6,
    pose: (t) => {
      const p = idlePose(t);
      const e = envelope(t, 1.6, 0.15, 0.3);
      p["head.rx"] = 0.26 * Math.sin(t * Math.PI * 3.2) * e;
      return p;
    },
  },
  thumbs: {
    loop: false,
    dur: 1.9,
    pose: (t) => {
      const p = idlePose(t);
      const e = envelope(t, 1.9);
      p["shR.rx"] = lerp(0, -1.2, e) - 0.08 * Math.sin(t * 9) * e;
      p["shR.rz"] = lerp(p["shR.rz"], -0.3, e);
      p["elR.rx"] = lerp(p["elR.rx"], -1.15, e);
      p["head.rz"] = -0.08 * e;
      return p;
    },
  },
};

// ---------------------------------------------------------------- builder

export function createMiniMe(): MiniMe {
  const M = {
    skin: mat(COLORS.skin, 0.55),
    hair: mat(COLORS.hair, 0.9),
    beard: mat(COLORS.hair, 0.95, { side: THREE.DoubleSide }),
    suit: mat(COLORS.suit, 0.75),
    pants: mat(COLORS.pants, 0.8),
    shirt: mat(COLORS.shirt, 0.5),
    tie: mat(COLORS.tie, 0.4),
    frame: mat(COLORS.frame, 0.25),
    shoe: mat(COLORS.shoe, 0.4),
    lip: mat(COLORS.lip, 0.5),
    eyeWhite: mat(COLORS.eyeWhite, 0.2),
    iris: mat(COLORS.iris, 0.2),
    lens: new THREE.MeshStandardMaterial({ color: 0xbcd0e0, transparent: true, opacity: 0.16, roughness: 0.05 }),
  };
  const sphere = (r: number, w = 32, h = 20) => new THREE.SphereGeometry(r, w, h);
  const capsule = (r: number, len: number) => new THREE.CapsuleGeometry(r, len, 8, 20);

  const root = new THREE.Group();
  root.name = "mini-abu";
  const body = new THREE.Group();
  root.add(body);
  const pelvis = new THREE.Group();
  pelvis.position.y = 0.78;
  body.add(pelvis);

  // torso
  const torso = new THREE.Group();
  pelvis.add(torso);
  mesh(torso, capsule(0.25, 0.14), M.suit, [0, 0.26, 0], [1, 1, 0.78]);
  const v = new THREE.Shape();
  v.moveTo(-0.11, 0.125);
  v.lineTo(0.11, 0.125);
  v.lineTo(0, -0.125);
  v.closePath();
  const vNeck = mesh(torso, new THREE.ShapeGeometry(v), M.shirt, [0, 0.395, 0.168], [1, 1, 1], [-0.27, 0, 0]);
  mesh(vNeck, new THREE.BoxGeometry(0.045, 0.19, 0.012), M.tie, [0, -0.02, 0.008]);
  mesh(vNeck, new THREE.BoxGeometry(0.05, 0.035, 0.016), M.tie, [0, 0.095, 0.01]);
  for (const s of [-1, 1]) {
    mesh(vNeck, new THREE.BoxGeometry(0.022, 0.27, 0.014), M.suit, [s * 0.062, 0, 0.004], [1, 1, 1], [0, 0, s * 0.42]);
  }
  mesh(torso, sphere(0.014, 12, 8), M.frame, [0, 0.22, 0.197]);
  mesh(torso, sphere(0.014, 12, 8), M.frame, [0, 0.14, 0.196]);

  // head
  const head = new THREE.Group();
  head.position.y = 0.58;
  torso.add(head);
  mesh(head, new THREE.CylinderGeometry(0.075, 0.085, 0.12, 16), M.skin, [0, 0.03, 0]);
  const skull = new THREE.Group();
  skull.position.y = 0.27;
  head.add(skull);
  mesh(skull, sphere(0.3, 48, 32), M.skin);
  for (const s of [-1, 1]) mesh(skull, sphere(0.06), M.skin, [s * 0.295, 0, -0.01], [0.5, 1, 0.8]);

  // curly hair
  mesh(skull, new THREE.SphereGeometry(0.31, 40, 20, 0, Math.PI * 2, 0, Math.PI * 0.45), M.hair, [0, 0.005, -0.01], [1, 1, 1], [-0.32, 0, 0]);
  let seed = 7;
  const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const curls: THREE.Vector3[] = [];
  const N = 160;
  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const th = i * 2.399963;
    const p = new THREE.Vector3(Math.cos(th) * r, y, Math.sin(th) * r).multiplyScalar(0.3);
    if ((p.y > 0.1 && !(p.z > 0.14 && p.y < 0.22)) || (p.z < -0.08 && p.y > -0.12)) curls.push(p);
  }
  const curlMesh = new THREE.InstancedMesh(sphere(1, 12, 10), M.hair, curls.length);
  const tmp = new THREE.Object3D();
  curls.forEach((p, i) => {
    tmp.position.copy(p).multiplyScalar(1.04);
    tmp.scale.setScalar(0.055 + rand() * 0.03);
    tmp.updateMatrix();
    curlMesh.setMatrixAt(i, tmp.matrix);
  });
  curlMesh.castShadow = true;
  skull.add(curlMesh);

  // face
  const eyes: THREE.Object3D[] = [];
  for (const s of [-1, 1]) {
    const eye = new THREE.Group();
    eye.position.set(s * 0.105, 0.035, 0.25);
    skull.add(eye);
    mesh(eye, sphere(0.05), M.eyeWhite);
    mesh(eye, sphere(0.027, 16, 12), M.iris, [0, 0, 0.038]);
    eyes.push(eye);
    mesh(skull, new THREE.BoxGeometry(0.11, 0.024, 0.03), M.hair, [s * 0.108, 0.125, 0.272], [1, 1, 1], [0.15, 0, -s * 0.1]);
  }
  mesh(skull, sphere(0.05), M.skin, [0, -0.035, 0.295], [0.8, 1, 1]);
  mesh(
    skull,
    new THREE.SphereGeometry(0.315, 40, 24, Math.PI / 2 - 1.95, 3.9, Math.PI * 0.56, Math.PI * 0.44),
    M.beard,
    [0, -0.02, 0.005],
    [0.97, 1.28, 1]
  );
  for (const s of [-1, 1]) mesh(skull, capsule(0.03, 0.16), M.hair, [s * 0.283, -0.01, 0.03]);
  for (const s of [-1, 1]) mesh(skull, capsule(0.024, 0.07), M.hair, [s * 0.042, -0.088, 0.297], [1, 1, 1], [0, 0, s * 1.25]);
  const mouth = mesh(skull, sphere(1, 16, 10), M.lip, [0, -0.14, 0.306], [0.05, 0.016, 0.02]);

  // glasses
  const frameShape = roundedRect(0.155, 0.115, 0.022);
  frameShape.holes.push(roundedRect(0.12, 0.08, 0.014));
  const frameGeo = new THREE.ExtrudeGeometry(frameShape, { depth: 0.022, bevelEnabled: false, curveSegments: 6 });
  const lensGeo = new THREE.ShapeGeometry(roundedRect(0.12, 0.08, 0.014));
  for (const s of [-1, 1]) {
    mesh(skull, frameGeo, M.frame, [s * 0.105, 0.045, 0.31]);
    mesh(skull, lensGeo, M.lens, [s * 0.105, 0.045, 0.32]);
    const front = new THREE.Vector2(s * 0.182, 0.32);
    const back = new THREE.Vector2(s * 0.292, 0.0);
    mesh(
      skull,
      new THREE.BoxGeometry(0.014, 0.018, front.distanceTo(back)),
      M.frame,
      [(front.x + back.x) / 2, 0.06, (front.y + back.y) / 2],
      [1, 1, 1],
      [0, Math.atan2(front.x - back.x, front.y - back.y), 0]
    );
  }
  mesh(skull, new THREE.BoxGeometry(0.06, 0.018, 0.02), M.frame, [0, 0.065, 0.322]);

  // arms
  const shoulder = { L: new THREE.Group(), R: new THREE.Group() };
  const elbow = { L: new THREE.Group(), R: new THREE.Group() };
  for (const [side, s] of [["L", 1], ["R", -1]] as const) {
    const sh = shoulder[side];
    sh.position.set(s * 0.29, 0.47, 0);
    torso.add(sh);
    mesh(sh, sphere(0.085), M.suit);
    mesh(sh, capsule(0.075, 0.16), M.suit, [0, -0.155, 0]);
    const el = elbow[side];
    el.position.y = -0.29;
    sh.add(el);
    mesh(el, capsule(0.068, 0.14), M.suit, [0, -0.12, 0]);
    mesh(el, new THREE.CylinderGeometry(0.066, 0.066, 0.03, 16), M.shirt, [0, -0.245, 0]);
    const hand = new THREE.Group();
    hand.position.y = -0.28;
    el.add(hand);
    mesh(hand, sphere(0.07), M.skin, [0, -0.04, 0], [0.85, 1, 0.75]);
    mesh(hand, capsule(0.022, 0.04), M.skin, [-s * 0.02, -0.025, 0.05], [1, 1, 1], [Math.PI / 2, 0, 0]);
  }

  // legs
  const hip = { L: new THREE.Group(), R: new THREE.Group() };
  const knee = { L: new THREE.Group(), R: new THREE.Group() };
  for (const [side, s] of [["L", 1], ["R", -1]] as const) {
    const h = hip[side];
    h.position.set(s * 0.12, 0, 0);
    pelvis.add(h);
    mesh(h, capsule(0.1, 0.2), M.pants, [0, -0.17, 0]);
    const k = knee[side];
    k.position.y = -0.36;
    h.add(k);
    mesh(k, capsule(0.09, 0.18), M.pants, [0, -0.16, 0]);
    mesh(k, sphere(1, 24, 14), M.shoe, [0, -0.36, 0.04], [0.1, 0.065, 0.16]);
  }

  // ---- animation state
  const local: Record<string, number> = {};
  const weight: Record<string, number> = { idle: 1 };
  let target: Move = "idle";
  let phase = 0;
  let talking = false;
  let clock = 0;
  let nextBlink = 2.5;
  let finished = false;

  const apply = (p: Pose) => {
    body.position.y = p["body.py"];
    pelvis.rotation.y = p["pelvis.ry"];
    torso.rotation.set(p["torso.rx"], p["torso.ry"], p["torso.rz"]);
    head.rotation.set(p["head.rx"], p["head.ry"], p["head.rz"]);
    shoulder.L.rotation.set(p["shL.rx"], 0, p["shL.rz"]);
    shoulder.R.rotation.set(p["shR.rx"], 0, p["shR.rz"]);
    elbow.L.rotation.set(p["elL.rx"], 0, p["elL.rz"]);
    elbow.R.rotation.set(p["elR.rx"], 0, p["elR.rz"]);
    hip.L.rotation.x = p["hipL.rx"];
    hip.R.rotation.x = p["hipR.rx"];
    knee.L.rotation.x = p["knL.rx"];
    knee.R.rotation.x = p["knR.rx"];
  };

  const me: MiniMe = {
    object: root,
    current: "idle",
    play(name, once = false) {
      if (me.current === name && !once) return;
      local[name] = 0;
      finished = false;
      target = name;
      me.current = name;
    },
    update(dt, walkRate) {
      clock += dt;
      phase += dt * Math.PI * 2 * 1.5 * walkRate;
      const fade = Math.min(1, dt / 0.2);
      for (const name of Object.keys(MOVES) as Move[]) {
        const w = weight[name] ?? 0;
        weight[name] = w + ((name === target ? 1 : 0) - w) * fade;
        local[name] = (local[name] ?? 0) + dt;
      }
      const out = Object.fromEntries(KEYS.map((k) => [k, 0])) as Pose;
      let total = 0;
      for (const [name, move] of Object.entries(MOVES) as [Move, (typeof MOVES)[Move]][]) {
        const w = weight[name];
        if (w < 0.001) continue;
        const p = move.pose(local[name], phase);
        for (const k of KEYS) out[k] += p[k] * w;
        total += w;
      }
      for (const k of KEYS) out[k] /= total || 1;
      apply(out);

      const move = MOVES[target];
      if (!move.loop && local[target] >= move.dur && !finished) {
        finished = true;
        me.play("idle");
      }

      const blink = clock > nextBlink ? Math.abs(Math.sin(((clock - nextBlink) / 0.14) * Math.PI)) : 0;
      if (clock > nextBlink + 0.14) nextBlink = clock + 2.5 + Math.random() * 3;
      for (const e of eyes) e.scale.y = 1 - 0.9 * blink;
      mouth.scale.y = talking ? 0.016 + 0.022 * Math.abs(Math.sin(clock * 17)) : 0.016;
    },
    setTalking(on) {
      talking = on;
    },
  };
  apply(idlePose(0));
  return me;
}
