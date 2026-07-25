import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function ScrollIndicator() {
  const containerRef = useRef<HTMLDivElement>(null);
  const borderRef = useRef<SVGRectElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);
  const arrowRef = useRef<SVGGElement>(null);

  useEffect(() => {
    if (!containerRef.current || !borderRef.current || !dotRef.current || !arrowRef.current)
      return;

    const border = borderRef.current;
    const perimeter = 2 * (40 + 64);

    gsap.set(border, { strokeDasharray: perimeter, strokeDashoffset: perimeter, opacity: 1 });
    gsap.set(dotRef.current, { opacity: 0, y: -10 });
    gsap.set(arrowRef.current, { opacity: 0 });
    gsap.set(containerRef.current, { opacity: 1 });

    const tl = gsap.timeline({ delay: 1.2 });

    tl.to(border, {
      strokeDashoffset: 0,
      duration: 1.0,
      ease: "power2.inOut",
    })
      .to(
        dotRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "back.out(1.5)",
        },
        "-=0.1"
      )
      .to(
        dotRef.current,
        {
          y: 18,
          duration: 0.7,
          ease: "power2.in",
          onComplete: () => {
            gsap.set(dotRef.current, { opacity: 0, y: -10 });
            gsap.set(arrowRef.current, { opacity: 1 });

            gsap.fromTo(
              arrowRef.current,
              { y: 0 },
              {
                y: 8,
                duration: 0.85,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
              }
            );
          },
        }
      );

    return () => {
      tl.kill();
    };
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
      className="absolute bottom-10 left-1/2 -translate-x-1/2 cursor-pointer group"
      style={{ opacity: 1 }}
      data-testid="scroll-indicator"
    >
      <svg
        width="40"
        height="64"
        viewBox="0 0 40 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        overflow="visible"
      >
        <defs>
          <linearGradient id="arrowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
          <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.7" />
          </linearGradient>
        </defs>

        <rect
          ref={borderRef}
          x="1"
          y="1"
          width="38"
          height="62"
          rx="19"
          ry="19"
          stroke="url(#borderGrad)"
          strokeWidth="2"
          fill="none"
          className="group-hover:opacity-100 transition-opacity duration-300"
        />

        <circle
          ref={dotRef}
          cx="20"
          cy="14"
          r="4"
          fill="url(#arrowGrad)"
        />

        <g ref={arrowRef} data-testid="scroll-arrow-icon">
          <line
            x1="20"
            y1="18"
            x2="20"
            y2="36"
            stroke="url(#arrowGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <polyline
            points="13,30 20,38 27,30"
            fill="none"
            stroke="url(#arrowGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    </div>
  );
}
