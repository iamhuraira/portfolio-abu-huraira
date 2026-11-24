export type StationId = "about" | "projects" | "skills" | "services" | "contact";

export type Station = {
  id: StationId;
  label: string;
  /** what the character says when you walk up */
  line: string;
  position: [number, number, number];
  /** collision radius */
  radius: number;
};

export const STATIONS: Station[] = [
  { id: "about", label: "About me", line: "That's me in the frame! Want my story?", position: [-5.2, 0, 1.4], radius: 0.8 },
  { id: "projects", label: "Projects", line: "My desk — this is where I ship products.", position: [-3.4, 0, -4.4], radius: 1.1 },
  { id: "skills", label: "Tech stack", line: "Every book here is a tool I use.", position: [3.6, 0, -4.4], radius: 1.0 },
  { id: "services", label: "Services", line: "Here's how I can help your business.", position: [5.3, 0, 1.4], radius: 0.6 },
  { id: "contact", label: "Contact", line: "Drop me a letter — I reply fast!", position: [1.9, 0, 5.4], radius: 0.5 },
];

export const ISLAND_RADIUS = 8.6;
export const PLAYER_START: [number, number, number] = [0, 0, 1.2];

/** rotation so a station's front (+Z) faces the island centre */
export const faceCentre = ([x, , z]: [number, number, number]) => Math.atan2(-x, -z);

/** a spot just in front of a station, where the player stands to use it */
export function approachPoint([x, , z]: [number, number, number], dist = 1.6): [number, number] {
  const len = Math.hypot(x, z) || 1;
  return [x - (x / len) * dist, z - (z / len) * dist];
}

/** lanterns sit between the paths so they never block the way to a station */
export const LANTERNS: [number, number, number][] = [42, 118, 198, 270].map((deg) => {
  const a = (deg * Math.PI) / 180;
  return [Math.cos(a) * 2.7, 0, Math.sin(a) * 2.7];
});
