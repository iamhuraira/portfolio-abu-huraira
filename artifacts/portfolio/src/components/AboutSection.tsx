import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import data from "@/data/portfolio.json";

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        }
      );

      gsap.fromTo(
        contentRef.current?.children ?? [],
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-24 px-4 overflow-hidden"
      data-testid="about-section"
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <h2
            ref={headingRef}
            className="text-4xl md:text-5xl font-bold text-white mb-3"
            data-testid="about-heading"
          >
            {data.about.heading}
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full" />
        </div>

        <div
          ref={contentRef}
          className="grid md:grid-cols-1 gap-6 max-w-2xl mx-auto"
          data-testid="about-content"
        >
          {data.about.paragraphs.map((para, i) => (
            <p
              key={i}
              className="text-gray-400 text-base leading-relaxed"
              data-testid={`about-para-${i}`}
            >
              {para}
            </p>
          ))}
        </div>

        <div
          className="mt-12 grid grid-cols-3 gap-6 max-w-sm mx-auto text-center"
          data-testid="about-stats"
        >
          {[
            { value: "3+", label: "Years Exp." },
            { value: "20+", label: "Projects" },
            { value: "10+", label: "Clients" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-blue-500/40 transition-colors duration-300"
              data-testid={`stat-${stat.label.toLowerCase().replace(/\s/g, "-")}`}
            >
              <div className="text-2xl font-bold gradient-text-blue-purple">{stat.value}</div>
              <div className="text-gray-500 text-xs mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
