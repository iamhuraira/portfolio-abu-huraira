import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Download } from "lucide-react";
import RevealText from "@/components/motion/RevealText";
import data from "@/data/portfolio.json";
import { useMagnetic } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const resumeBtn = useMagnetic<HTMLAnchorElement>(0.25);
  const { about } = data;

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const ctx = gsap.context(() => {
      // photo uncovers from the bottom up
      gsap.fromTo(
        ".about-photo",
        { clipPath: "inset(100% 0% 0% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.3,
          ease: "power4.inOut",
          scrollTrigger: { trigger: ".about-photo", start: "top 80%" },
        }
      );
      gsap.from(".about-photo img", {
        scale: 1.3,
        duration: 1.6,
        ease: "power3.out",
        scrollTrigger: { trigger: ".about-photo", start: "top 80%" },
      });
      gsap.from(".about-fade", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.08,
        clearProps: "transform,opacity",
        scrollTrigger: { trigger: ".about-body", start: "top 80%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const rows = [
    ...about.experience.map((e) => ({ title: e.role, sub: e.company, period: e.period, kind: "Experience" })),
    ...about.education.map((e) => ({ title: e.degree, sub: e.institution, period: e.period, kind: "Education" })),
  ];

  return (
    <section id="about" ref={sectionRef} className="relative py-24 md:py-32 px-6 md:px-12" data-testid="about-section">
      <div className="max-w-6xl mx-auto grid gap-14 lg:grid-cols-[340px_1fr] lg:gap-20">
        {/* profile card */}
        <div className="lg:sticky lg:top-28 self-start" data-testid="about-profile">
          <div className="about-photo group relative aspect-[4/5] overflow-hidden rounded-3xl border border-line bg-soft">
            <img
              src={about.profile.photo}
              alt={about.profile.name}
              className="h-full w-full object-cover object-top grayscale transition-[filter,transform] duration-700 group-hover:grayscale-0 group-hover:scale-105"
              data-testid="about-profile-photo"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-page via-page/70 to-transparent p-6 pt-20">
              <h3 className="font-display text-2xl font-semibold text-ink" data-testid="about-profile-name">
                {about.profile.name}
              </h3>
              <p className="text-ink/75 text-sm mt-1" data-testid="about-profile-tagline">
                {about.profile.tagline}
              </p>
            </div>
          </div>
          <a
            ref={resumeBtn}
            href={about.profile.resumeUrl}
            download
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
            data-testid="btn-download-resume"
          >
            <Download size={15} />
            Download Resume
          </a>
        </div>

        {/* story + timeline */}
        <div className="about-body">
          <p className="text-accent-ink text-xs md:text-sm font-semibold uppercase tracking-[0.25em] mb-5">About me</p>
          <RevealText
            as="h2"
            text={about.heading}
            className="font-display font-bold text-4xl md:text-6xl tracking-tight text-ink mb-8"
          />
          <p className="about-fade text-ink/75 text-base md:text-lg leading-relaxed" data-testid="about-bio-text">
            {about.bio}
          </p>

          <div className="mt-14">
            {(["Experience", "Education"] as const).map((kind) => (
              <div key={kind} className="mb-10 last:mb-0" data-testid={`about-${kind.toLowerCase()}-block`}>
                <p className="about-fade text-subtle text-xs font-semibold uppercase tracking-[0.25em] mb-3">{kind}</p>
                <ul>
                  {rows
                    .filter((r) => r.kind === kind)
                    .map((r, i) => (
                      <li
                        key={i}
                        data-cursor
                        className="about-fade group grid grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-1 border-t border-line py-5 last:border-b transition-colors hover:border-accent/40"
                        data-testid={`${kind.toLowerCase()}-item-${i}`}
                      >
                        <div>
                          <p className="font-display text-lg md:text-xl font-medium text-ink transition-transform duration-300 group-hover:translate-x-2">
                            {r.title}
                          </p>
                          <p className="text-muted text-sm mt-1 transition-transform duration-300 group-hover:translate-x-2">
                            {r.sub}
                          </p>
                        </div>
                        <span className="text-subtle text-xs md:text-sm whitespace-nowrap tabular-nums group-hover:text-accent-ink transition-colors">
                          {r.period}
                        </span>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
