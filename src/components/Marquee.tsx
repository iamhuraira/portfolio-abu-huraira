import data from "@/data/portfolio.json";

const skills = data.techStack.categories.flatMap((c) => c.skills);
const half = Math.ceil(skills.length / 2);
const rows = [skills.slice(0, half), skills.slice(half)];

/** Two endless rows of skills scrolling in opposite directions. Pauses on hover. */
export default function Marquee() {
  return (
    <div className="marquee relative py-10 border-y border-line overflow-hidden select-none" aria-label="Skills" data-testid="skills-marquee">
      {rows.map((row, r) => (
        <div key={r} className={`skew-scroll flex overflow-hidden ${r ? "mt-4" : ""}`} aria-hidden={r === 1}>
          <div
            className={`marquee-track flex shrink-0 items-center gap-8 pr-8 ${r ? "is-reverse" : ""}`}
            style={{ ["--marquee-duration" as string]: `${row.length * 2.6}s` }}
          >
            {[...row, ...row].map((skill, i) => (
              <span key={i} className="flex items-center gap-8 whitespace-nowrap">
                <span
                  className={`font-display font-semibold text-3xl md:text-5xl tracking-tight ${
                    (i + r) % 2 ? "text-outline" : "text-ink/90"
                  }`}
                >
                  {skill}
                </span>
                <span className="text-accent-ink/70 text-xl md:text-2xl">✦</span>
              </span>
            ))}
          </div>
        </div>
      ))}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-page to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-page to-transparent" />
    </div>
  );
}
