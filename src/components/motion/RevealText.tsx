import { createElement, useEffect, useRef, type ElementType } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Props = {
  text: string;
  as?: ElementType;
  className?: string;
  /** animate each word, or each character */
  by?: "word" | "char";
  delay?: number;
  /** wait until the text scrolls into view (default) or play immediately */
  onScroll?: boolean;
  stagger?: number;
};

/** Text that slides up into view from behind a mask, word by word or letter by letter. */
export default function RevealText({ text, as = "div", className, by = "word", delay = 0, onScroll = true, stagger }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from(el.querySelectorAll(".rv-i"), {
        yPercent: 115,
        duration: 1.1,
        ease: "power4.out",
        stagger: stagger ?? (by === "char" ? 0.035 : 0.06),
        delay,
        scrollTrigger: onScroll ? { trigger: el, start: "top 88%" } : undefined,
      });
    }, el);
    return () => ctx.revert();
  }, [by, delay, onScroll, stagger]);

  const words = text.split(" ");
  return createElement(
    as,
    { ref, className, "aria-label": text },
    words.map((word, i) => (
      <span key={i} aria-hidden="true" className="inline-block overflow-hidden align-bottom pb-[0.1em] -mb-[0.1em]">
        {by === "char" ? (
          Array.from(word).map((c, j) => (
            <span key={j} className="rv-i inline-block">
              {c}
            </span>
          ))
        ) : (
          <span className="rv-i inline-block">{word}</span>
        )}
        {i < words.length - 1 ? " " : ""}
      </span>
    ))
  );
}
