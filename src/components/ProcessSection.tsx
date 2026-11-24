import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import RevealText from "@/components/motion/RevealText";
import data from "@/data/portfolio.json";
import { useMediaQuery } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger, MorphSVGPlugin, DrawSVGPlugin);

/** One filled icon per step (200x200 box). The pinned version morphs between them. */
const ICONS = [
  // chat bubble
  "M40 52 Q40 30 62 30 H138 Q160 30 160 52 V108 Q160 130 138 130 H92 L60 162 V130 Q40 130 40 108 Z",
  // layout: header + two panels
  "M34 34 H166 V80 H34 Z M34 94 H92 V166 H34 Z M106 94 H166 V166 H106 Z",
  // code brackets </>
  "M72 48 L28 100 L72 152 L86 138 L54 100 L86 62 Z M120 38 L138 43 L94 162 L76 157 Z M128 48 L172 100 L128 152 L114 138 L146 100 L114 62 Z",
  // rocket with a round window
  "M100 22 C134 44 144 88 134 128 L154 156 L130 156 L120 142 H80 L70 156 L46 156 L66 128 C56 88 66 44 100 22 Z M100 66 A14 14 0 1 0 100.01 66 Z",
];

export default function ProcessSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const pinned = useMediaQuery("(min-width: 768px) and (min-height: 640px)");
  const { process } = data;
  const steps = process.steps;

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      if (pinned) {
        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          scrollTrigger: {
            trigger: ".proc-pin",
            start: "top top",
            end: () => `+=${window.innerHeight * 2.4}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            onUpdate: (self) => setActive(Math.min(steps.length - 1, Math.floor(self.progress * steps.length * 0.999))),
          },
        });
        tl.fromTo(".proc-ring", { drawSVG: "0%" }, { drawSVG: "100%", ease: "none", duration: steps.length }, 0);
        ICONS.slice(1).forEach((shape, i) => {
          const at = i + 0.6;
          tl.to(".proc-icon", { morphSVG: { shape, shapeIndex: "auto" }, duration: 0.8 }, at)
            .fromTo(".proc-badge", { rotate: -20, scale: 0.85 }, { rotate: 0, scale: 1, duration: 0.8, ease: "back.out(2)" }, at);
        });
      } else {
        gsap.utils.toArray<HTMLElement>(".proc-card").forEach((card) => {
          gsap.from(card, { y: 40, opacity: 0, duration: 0.8, ease: "power3.out", clearProps: "transform,opacity", scrollTrigger: { trigger: card, start: "top 85%" } });
          gsap.from(card.querySelector(".proc-card-icon"), { drawSVG: "0%", duration: 1.4, ease: "power2.inOut", scrollTrigger: { trigger: card, start: "top 85%" } });
        });
      }
    }, el);
    return () => ctx.revert();
  }, [pinned, steps.length]);

  const header = (
    <div className="mb-10 md:mb-14">
      <p className="text-accent-ink text-xs md:text-sm font-semibold uppercase tracking-[0.25em] mb-5">{process.eyebrow}</p>
      <RevealText as="h2" text={process.heading} className="font-display font-bold text-4xl md:text-6xl tracking-tight text-ink max-w-3xl leading-[1.05]" />
    </div>
  );

  if (!pinned) {
    return (
      <section ref={sectionRef} id="process" className="relative py-24 px-6" data-testid="process-section">
        <div className="max-w-6xl mx-auto">
          {header}
          <ol className="grid gap-5">
            {steps.map((s, i) => (
              <li key={s.title} className="proc-card rounded-2xl border border-line bg-soft p-6 flex gap-5">
                <svg viewBox="0 0 200 200" className="w-14 h-14 shrink-0" aria-hidden="true">
                  <path d={ICONS[i]} fillRule="evenodd" className="proc-card-icon fill-accent/10 stroke-accent" strokeWidth={8} strokeLinejoin="round" />
                </svg>
                <div>
                  <p className="font-display text-sm text-subtle mb-1">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="font-display text-xl font-semibold text-ink mb-2">{s.title}</h3>
                  <p className="text-muted text-sm leading-relaxed">{s.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} id="process" className="relative" data-testid="process-section">
      <div className="proc-pin h-screen flex items-center px-6 md:px-12 overflow-hidden">
        <div className="max-w-6xl w-full mx-auto">
          {header}
          <div className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-12 items-center">
            {/* morphing icon */}
            <div className="relative mx-auto w-full max-w-[340px] aspect-square">
              <svg viewBox="0 0 220 220" className="absolute inset-0 w-full h-full -rotate-90" aria-hidden="true">
                <circle cx="110" cy="110" r="104" fill="none" className="stroke-line" strokeWidth={2} />
                <circle cx="110" cy="110" r="104" fill="none" className="proc-ring stroke-accent" strokeWidth={4} strokeLinecap="round" />
              </svg>
              <div className="proc-badge absolute inset-[14%] rounded-full bg-accent-soft border border-accent/20 flex items-center justify-center">
                <svg viewBox="0 0 200 200" className="w-[58%] h-[58%]" aria-hidden="true">
                  <path className="proc-icon fill-accent" fillRule="evenodd" d={ICONS[0]} />
                </svg>
              </div>
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 font-display text-sm font-semibold text-ink bg-page px-3 rounded-full border border-line">
                {String(active + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
              </span>
            </div>

            {/* steps */}
            <ol className="space-y-3">
              {steps.map((s, i) => {
                const on = i === active;
                return (
                  <li
                    key={s.title}
                    className={`rounded-2xl border p-5 transition-all duration-500 ${
                      on ? "border-accent/40 bg-surface shadow-[0_10px_40px_-15px_rgba(47,91,255,0.35)] translate-x-2" : "border-transparent opacity-45"
                    }`}
                  >
                    <div className="flex items-baseline gap-4">
                      <span className={`font-display text-sm ${on ? "text-accent-ink" : "text-subtle"}`}>{String(i + 1).padStart(2, "0")}</span>
                      <div>
                        <h3 className="font-display text-xl md:text-2xl font-semibold text-ink">{s.title}</h3>
                        <p
                          className={`text-muted text-sm leading-relaxed overflow-hidden transition-all duration-500 ${
                            on ? "max-h-24 mt-2 opacity-100" : "max-h-0 opacity-0"
                          }`}
                        >
                          {s.description}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
