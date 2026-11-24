import { useEffect, useRef } from "react";
import { gsap } from "gsap";

/** A soft ring that trails the cursor and grows over links and buttons. Desktop only. */
export default function Cursor() {
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ring = ringRef.current;
    if (!ring || !window.matchMedia("(pointer: fine)").matches) return;
    gsap.set(ring, { xPercent: -50, yPercent: -50 });
    const xTo = gsap.quickTo(ring, "x", { duration: 0.35, ease: "power3.out" });
    const yTo = gsap.quickTo(ring, "y", { duration: 0.35, ease: "power3.out" });

    const move = (e: PointerEvent) => {
      ring.style.opacity = "1";
      xTo(e.clientX);
      yTo(e.clientY);
    };
    const over = (e: PointerEvent) => {
      const hit = (e.target as Element).closest?.("a, button, [data-cursor]");
      ring.classList.toggle("is-hover", !!hit);
    };
    const leave = () => (ring.style.opacity = "0");

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, []);

  return <div ref={ringRef} className="cursor-ring" aria-hidden="true" />;
}
