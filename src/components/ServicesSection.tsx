import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Building2, FileSpreadsheet, Layers, Plug, Puzzle, Sparkles, type LucideIcon } from "lucide-react";
import RevealText from "@/components/motion/RevealText";
import data from "@/data/portfolio.json";
import { scrollToTarget } from "@/lib/smoothScroll";

gsap.registerPlugin(ScrollTrigger);

const icons: Record<string, LucideIcon> = { Layers, Sparkles, FileSpreadsheet, Puzzle, Building2, Plug };

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { services } = data;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".svc-card", {
        y: 60,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: { trigger: ".svc-grid", start: "top 80%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // spotlight follows the pointer inside each card
  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <section id="services" ref={sectionRef} className="relative py-24 md:py-32 px-6 md:px-12" data-testid="services-section">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <p className="text-accent-ink text-xs md:text-sm font-semibold uppercase tracking-[0.25em] mb-5">{services.eyebrow}</p>
            <RevealText
              as="h2"
              text={services.heading}
              className="font-display font-bold text-4xl md:text-6xl tracking-tight text-ink max-w-2xl leading-[1.05]"
            />
          </div>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              scrollToTarget("#contact");
            }}
            className="group inline-flex items-center gap-2 text-sm text-ink/75 hover:text-ink shrink-0"
          >
            Start a project
            <ArrowUpRight size={16} className="transition-transform group-hover:rotate-45" />
          </a>
        </div>

        <div className="svc-grid grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.items.map((s, i) => {
            const Icon = icons[s.icon] ?? Layers;
            return (
              <article
                key={s.title}
                onPointerMove={onMove}
                data-cursor
                className="svc-card spotlight-card group rounded-2xl border border-line bg-soft p-7 hover:border-accent/40 transition-colors duration-300"
                data-testid={`service-${i}`}
              >
                <div className="flex items-start justify-between mb-10">
                  <div className="w-12 h-12 rounded-xl bg-accent-soft border border-accent/25 flex items-center justify-center">
                    <Icon size={20} className="text-accent-ink" />
                  </div>
                  <span className="font-display text-sm text-subtle">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="font-display font-semibold text-xl text-ink mb-3 flex items-center justify-between">
                  {s.title}
                  <ArrowUpRight
                    size={18}
                    className="text-subtle opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-accent-ink transition-all duration-300"
                  />
                </h3>
                <p className="text-muted text-sm leading-relaxed">{s.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
