import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import data from "@/data/portfolio.json";

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin, MotionPathPlugin);

/** A big statement that lights up word by word as you scroll, plus counting stats. */
export default function StatementSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { statement } = data;

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (!reduce) {
        // a line draws itself through the section while a dot rides along it
        const flow = { trigger: el, start: "top 75%", end: "bottom 55%", scrub: 1 };
        gsap.fromTo(".flow-path", { drawSVG: "0%" }, { drawSVG: "100%", ease: "none", scrollTrigger: flow });
        gsap.to(".flow-dot", {
          ease: "none",
          motionPath: { path: ".flow-path", align: ".flow-path", alignOrigin: [0.5, 0.5] },
          scrollTrigger: flow,
        });
        gsap.fromTo(
          ".st-word",
          { opacity: 0.14 },
          {
            opacity: 1,
            stagger: 0.1,
            ease: "none",
            scrollTrigger: { trigger: ".st-text", start: "top 80%", end: "bottom 45%", scrub: true },
          }
        );
      }
      gsap.utils.toArray<HTMLElement>(".st-num").forEach((num) => {
        const target = Number(num.dataset.value);
        const counter = { v: reduce ? target : 0 };
        num.textContent = String(counter.v);
        if (reduce) return;
        gsap.to(counter, {
          v: target,
          duration: 1.6,
          ease: "power2.out",
          scrollTrigger: { trigger: num, start: "top 90%" },
          onUpdate: () => (num.textContent = String(Math.round(counter.v))),
        });
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden py-28 md:py-40 px-6 md:px-12" data-testid="statement-section">
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 1200 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M -40 140 C 240 40, 380 280, 600 230 S 980 60, 1080 300 S 860 760, 1260 830"
          className="stroke-line-strong"
          strokeWidth={2}
          strokeDasharray="4 10"
        />
        <path
          className="flow-path stroke-accent"
          d="M -40 140 C 240 40, 380 280, 600 230 S 980 60, 1080 300 S 860 760, 1260 830"
          strokeWidth={3}
          strokeLinecap="round"
        />
        <g className="flow-dot">
          <circle r={18} className="fill-accent/15" />
          <circle r={8} className="fill-accent" />
        </g>
      </svg>
      <div className="relative max-w-6xl mx-auto">
        <p className="text-accent-ink text-xs md:text-sm font-semibold uppercase tracking-[0.25em] mb-8">{statement.eyebrow}</p>
        <p className="st-text font-display font-semibold text-3xl md:text-5xl lg:text-6xl leading-[1.15] tracking-tight text-ink">
          {statement.text.split(" ").map((w, i) => (
            <span key={i} className="st-word">
              {w}{" "}
            </span>
          ))}
        </p>

        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-y-10 border-t border-line pt-10">
          {statement.stats.map((s) => (
            <div key={s.label}>
              <div className="font-display font-bold text-5xl md:text-6xl text-ink">
                <span className="st-num" data-value={s.value}>
                  {s.value}
                </span>
                <span className="text-accent-ink">{s.suffix}</span>
              </div>
              <div className="text-muted text-sm mt-2">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
