import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);

/**
 * Line-art vector shapes floating around the hero: they draw themselves in,
 * bob gently, drift with the mouse, and fly apart at different speeds on scroll.
 */
const SHAPES = [
  // [className position, size, depth (parallax speed), svg]
  { pos: "top-[18%] right-[8%]", size: 120, depth: 1.6, el: <circle cx="50" cy="50" r="42" className="hs-line stroke-accent" /> },
  {
    pos: "top-[30%] right-[30%] hidden md:block",
    size: 46,
    depth: 0.8,
    el: <path d="M50 10 V90 M10 50 H90" className="hs-line stroke-[#ff8a4c]" strokeWidth={10} />,
  },
  {
    pos: "top-[60%] right-[6%] hidden sm:block",
    size: 150,
    depth: 2.2,
    el: <path d="M5 60 C 20 20, 35 20, 50 60 S 80 100, 95 60" className="hs-line stroke-ink/60" />,
  },
  {
    pos: "top-[12%] left-[46%] hidden lg:block",
    size: 56,
    depth: 1.2,
    el: <path d="M50 5 L60 40 L95 50 L60 60 L50 95 L40 60 L5 50 L40 40 Z" className="hs-line stroke-accent" />,
  },
  {
    pos: "top-[9%] left-[24%] hidden md:block",
    size: 70,
    depth: 1.8,
    el: <path d="M50 10 L92 85 H8 Z" className="hs-line stroke-[#ff8a4c]" />,
  },
  {
    pos: "top-[48%] right-[22%] hidden lg:block",
    size: 90,
    depth: 1,
    el: <circle cx="50" cy="50" r="40" className="hs-line stroke-ink/40" strokeDasharray="2 10" />,
  },
];

export default function HeroShapes() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      // draw in (the dotted circle keeps its dashes, so it fades instead)
      gsap.from(".hs-line:not([stroke-dasharray])", { drawSVG: "0%", duration: 1.8, ease: "power2.inOut", stagger: 0.12, delay: 0.6 });
      gsap.from(".hs-line[stroke-dasharray]", { opacity: 0, rotate: -90, transformOrigin: "50% 50%", duration: 1.6, delay: 1 });

      const items = gsap.utils.toArray<HTMLElement>(".hs-item");
      items.forEach((el, i) => {
        const depth = Number(el.dataset.depth);
        // idle float
        gsap.to(el.firstElementChild, { y: -14, rotate: i % 2 ? 8 : -8, duration: 3 + i * 0.4, repeat: -1, yoyo: true, ease: "sine.inOut" });
        // scroll: drift up and spin, faster for "closer" shapes
        gsap.to(el, {
          yPercent: -120 * depth,
          rotate: (i % 2 ? 1 : -1) * 90 * depth,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
        });
      });

      // mouse parallax
      if (window.matchMedia("(pointer: fine)").matches) {
        const setters = items.map((el) => ({
          x: gsap.quickTo(el, "x", { duration: 0.8, ease: "power3.out" }),
          y: gsap.quickTo(el, "y", { duration: 0.8, ease: "power3.out" }),
          d: Number(el.dataset.depth),
        }));
        const move = (e: PointerEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          setters.forEach((s) => {
            s.x(nx * 40 * s.d);
            s.y(ny * 40 * s.d);
          });
        };
        window.addEventListener("pointermove", move);
        return () => window.removeEventListener("pointermove", move);
      }
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
      {SHAPES.map((s, i) => (
        <div key={i} className={`hs-item absolute ${s.pos}`} data-depth={s.depth} style={{ width: s.size, height: s.size }}>
          <svg viewBox="0 0 100 100" width="100%" height="100%" fill="none" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round">
            {s.el}
          </svg>
        </div>
      ))}
    </div>
  );
}
