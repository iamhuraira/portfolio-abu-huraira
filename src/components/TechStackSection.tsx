import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import data from "@/data/portfolio.json";

gsap.registerPlugin(ScrollTrigger);

export default function TechStackSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headingRef.current, {
        y: 40,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
      });

      gsap.from(cardsRef.current?.children ?? [], {
        y: 40,
        duration: 0.6,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="techstack"
      ref={sectionRef}
      className="relative py-24 px-4"
      data-testid="techstack-section"
    >
      <div className="max-w-6xl mx-auto">
        <div ref={headingRef} className="text-center mb-14">
          <h2 className="font-display text-4xl md:text-6xl font-bold tracking-tight text-ink mb-3" data-testid="techstack-heading">
            {data.techStack.heading}
          </h2>
          <p className="text-subtle text-sm mb-4">{data.techStack.subtitle}</p>
          <div className="w-16 h-1 bg-gradient-to-r from-accent to-purple-500 mx-auto rounded-full" />
        </div>

        <div
          ref={cardsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch"
          data-testid="techstack-categories"
        >
          {data.techStack.categories.map((cat) => (
            <div
              key={cat.name}
              className="h-full bg-soft border border-line rounded-xl p-6 hover:border-accent/40 hover:bg-soft transition-all duration-300 group"
              data-testid={`techstack-category-${cat.name.toLowerCase()}`}
            >
              <h3 className="text-ink font-semibold text-sm mb-4 uppercase tracking-widest group-hover:text-accent-ink transition-colors duration-200">
                {cat.name}
              </h3>
              <div className="flex flex-wrap gap-2">
                {cat.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-muted text-xs bg-soft border border-line rounded-md px-2.5 py-1 hover:text-ink hover:border-accent/40 transition-all duration-200"
                    data-testid={`skill-${skill.toLowerCase().replace(/\s/g, "-")}`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
