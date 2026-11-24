import { useEffect, useRef } from "react";
import { Link } from "wouter";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaGithub } from "react-icons/fa";
import { ExternalLink, FileText, Play } from "lucide-react";
import data from "@/data/portfolio.json";
import { typeColor } from "@/lib/typeColor";
import { isValidUrl } from "@/lib/urls";
import { useMediaQuery } from "@/lib/motion";
import RevealText from "@/components/motion/RevealText";

gsap.registerPlugin(ScrollTrigger);

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  // sideways scroll only where a full card row fits on screen
  const horizontal = useMediaQuery("(min-width: 1024px) and (min-height: 720px)");

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!horizontal) {
        gsap.from(gridRef.current?.children ?? [], {
          y: 60,
          opacity: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: "power3.out",
          clearProps: "transform,opacity",
          scrollTrigger: { trigger: gridRef.current, start: "top 85%" },
        });
      }

      // in sideways mode the sliding track is the reveal
      if (horizontal && gridRef.current && pinRef.current) {
        const track = gridRef.current;
        const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
        gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: pinRef.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [horizontal]);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className={`relative ${horizontal ? "" : "py-24 px-6"}`}
      data-testid="projects-section"
    >
      <div
        ref={pinRef}
        className={horizontal ? "h-screen flex flex-col justify-center overflow-hidden" : "max-w-6xl mx-auto"}
      >
        <div
          ref={headingRef}
          className={`mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4 ${
            horizontal ? "w-full max-w-6xl mx-auto px-6" : ""
          }`}
        >
          <div>
            <p className="text-accent-ink text-xs md:text-sm font-semibold uppercase tracking-[0.25em] mb-5">Selected work</p>
            <RevealText
              as="h2"
              text={data.projects.heading}
              className="font-display font-bold text-4xl md:text-6xl tracking-tight text-ink"
            />
          </div>
          <p className="text-muted text-sm max-w-md leading-relaxed">
            {data.projects.subtitle}
            {horizontal && <span className="block text-subtle mt-2">Keep scrolling →</span>}
          </p>
        </div>

        <div
          ref={gridRef}
          className={
            horizontal
              ? "flex gap-6 w-max px-[max(1.5rem,calc((100vw-72rem)/2+1.5rem))] items-stretch"
              : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          }
          data-testid="projects-grid"
        >
          {data.projects.items.map((project) => {
            const showGithub = isValidUrl(project.githubUrl);
            const showLive = isValidUrl(project.liveUrl);
            const showVideo = isValidUrl(project.videoUrl);

            return (
              <div
                key={project.id}
                data-cursor
                className={`flex flex-col bg-surface border border-line rounded-2xl overflow-hidden hover:border-accent/40 hover:-translate-y-1 transition-[border-color,translate] duration-300 group ${
                  horizontal ? "w-[400px] shrink-0" : ""
                }`}
                data-testid={`project-card-${project.id}`}
              >
                <div className="skew-scroll relative overflow-hidden" style={{ height: "180px" }}>
                  <img
                    src={project.preview}
                    alt={project.title}
                    className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                </div>

                <div className="flex flex-col flex-1 p-5">
                  <div className="mb-3">
                    <span className="text-ink font-bold text-lg mr-2">
                      {project.title}
                    </span>
                    <span className={`text-xs font-medium ${typeColor(project.typeColor)}`}>
                      ({project.type})
                    </span>
                  </div>

                  <p className="text-muted text-sm leading-relaxed mb-4">
                    {project.description}
                  </p>

                  <div className="mb-5">
                    <p className="text-muted text-xs mb-2 font-medium">Tech stack:</p>
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.map((tech) => (
                        <span
                          key={tech.name}
                          className="flex items-center gap-1.5 text-xs text-ink/75 bg-soft border border-line rounded-md px-2 py-1"
                        >
                          <span
                            className="inline-block w-2 h-2 rounded-full flex-shrink-0"
                            style={{ backgroundColor: tech.color }}
                          />
                          {tech.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-auto flex flex-wrap gap-2 pt-4 border-t border-line">
                    <Link
                      href={`/projects/${project.id}`}
                      className="flex items-center gap-1.5 text-xs text-accent-ink border border-accent/40 rounded-md px-3 py-1.5 hover:bg-accent-soft transition-colors duration-200"
                    >
                      <FileText size={11} />
                      Details
                      <span className="ml-0.5">→</span>
                    </Link>

                    {showGithub && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs text-accent-ink border border-accent/40 rounded-md px-3 py-1.5 hover:bg-accent-soft transition-colors duration-200"
                      >
                        <FaGithub size={12} />
                        GitHub
                        <span className="ml-0.5">→</span>
                      </a>
                    )}

                    {showLive && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs text-accent-ink border border-accent/40 rounded-md px-3 py-1.5 hover:bg-accent-soft transition-colors duration-200"
                      >
                        <ExternalLink size={11} />
                        Live Site
                        <span className="ml-0.5">→</span>
                      </a>
                    )}

                    {showVideo && (
                      <a
                        href={project.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs text-accent-ink border border-accent/40 rounded-md px-3 py-1.5 hover:bg-accent-soft transition-colors duration-200"
                      >
                        <Play size={11} />
                        Video
                        <span className="ml-0.5">→</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
