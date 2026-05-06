import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function ScrollIndicator() {
  const containerRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!containerRef.current || !arrowRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, delay: 2, ease: "power3.out" }
      );

      gsap.to(arrowRef.current, {
        y: 8,
        duration: 0.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    });

    return () => ctx.revert();
  }, []);

  const handleClick = () => {
    const aboutSection = document.querySelector("#about");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      className="absolute bottom-10 left-1/2 -translate-x-1/2 cursor-pointer"
      data-testid="scroll-indicator"
    >
      <div className="w-10 h-16 rounded-full border-2 border-blue-400/60 flex items-center justify-center hover:border-blue-400 transition-colors duration-300">
        <svg
          ref={arrowRef}
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#60a5fa"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          data-testid="scroll-arrow-icon"
        >
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </div>
    </div>
  );
}
