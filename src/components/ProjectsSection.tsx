import { useEffect, useRef } from "react";
import { Link } from "wouter";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaGithub } from "react-icons/fa";
import { ExternalLink, FileText, Play } from "lucide-react";
import data from "@/data/portfolio.json";
import { isValidUrl } from "@/lib/urls";

gsap.registerPlugin(ScrollTrigger);

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headingRef.current, {
        y: 40,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
      });

      gsap.from(gridRef.current?.children ?? [], {
        y: 60,
        duration: 0.7,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 72%" },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative py-24 px-6"
      data-testid="projects-section"
    >
      <div className="max-w-6xl mx-auto">
        <div ref={headingRef} className="mb-12">
          <h2
            className="text-4xl md:text-5xl font-bold text-white mb-1"
            data-testid="projects-heading"
          >
            {data.projects.heading}
          </h2>
          <div className="w-14 h-1 bg-blue-500 mb-5 rounded-full" />
          <p className="text-gray-400 text-sm max-w-lg leading-relaxed">
            {data.projects.subtitle}
          </p>
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          data-testid="projects-grid"
        >
          {data.projects.items.map((project) => {
            const showGithub = isValidUrl(project.githubUrl);
            const showLive = isValidUrl(project.liveUrl);
            const showVideo = isValidUrl(project.videoUrl);

            return (
              <div
                key={project.id}
                className="flex flex-col bg-[#0d0d1a] border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-all duration-300 group"
                data-testid={`project-card-${project.id}`}
              >
                <div className="relative overflow-hidden" style={{ height: "180px" }}>
                  <img
                    src={project.preview}
                    alt={project.title}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="flex flex-col flex-1 p-5">
                  <div className="mb-3">
                    <span className="text-white font-bold text-lg mr-2">
                      {project.title}
                    </span>
                    <span className={`text-xs font-medium ${project.typeColor}`}>
                      ({project.type})
                    </span>
                  </div>

                  <p className="text-gray-400 text-sm leading-relaxed mb-4">
                    {project.description}
                  </p>

                  <div className="mb-5">
                    <p className="text-gray-400 text-xs mb-2 font-medium">Tech stack:</p>
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.map((tech) => (
                        <span
                          key={tech.name}
                          className="flex items-center gap-1.5 text-xs text-gray-300 bg-white/5 border border-white/10 rounded-md px-2 py-1"
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

                  <div className="mt-auto flex flex-wrap gap-2 pt-4 border-t border-white/10">
                    <Link
                      href={`/projects/${project.id}`}
                      className="flex items-center gap-1.5 text-xs text-blue-400 border border-blue-500/40 rounded-md px-3 py-1.5 hover:bg-blue-500/10 transition-colors duration-200"
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
                        className="flex items-center gap-1.5 text-xs text-blue-400 border border-blue-500/40 rounded-md px-3 py-1.5 hover:bg-blue-500/10 transition-colors duration-200"
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
                        className="flex items-center gap-1.5 text-xs text-blue-400 border border-blue-500/40 rounded-md px-3 py-1.5 hover:bg-blue-500/10 transition-colors duration-200"
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
                        className="flex items-center gap-1.5 text-xs text-blue-400 border border-blue-500/40 rounded-md px-3 py-1.5 hover:bg-blue-500/10 transition-colors duration-200"
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
