import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaGithub } from "react-icons/fa";
import { ExternalLink } from "lucide-react";
import data from "@/data/portfolio.json";

gsap.registerPlugin(ScrollTrigger);

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        }
      );

      gsap.fromTo(
        gridRef.current?.children ?? [],
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 72%" },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative py-24 px-4"
      data-testid="projects-section"
    >
      <div className="max-w-5xl mx-auto">
        <div ref={headingRef} className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-2" data-testid="projects-heading">
            {data.projects.heading}
          </h2>
          <p className="text-gray-500 text-sm mb-4">{data.projects.subtitle}</p>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full" />
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          data-testid="projects-grid"
        >
          {data.projects.items.map((project) => (
            <div
              key={project.id}
              className="relative bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-all duration-300 group hover:-translate-y-1"
              data-testid={`project-card-${project.id}`}
            >
              <div
                className={`h-2 w-full bg-gradient-to-r ${project.gradient}`}
                aria-hidden="true"
              />
              <div className="p-6">
                <h3
                  className="text-white font-semibold text-lg mb-2 group-hover:text-blue-300 transition-colors duration-200"
                  data-testid={`project-title-${project.id}`}
                >
                  {project.title}
                </h3>
                <p
                  className="text-gray-500 text-sm leading-relaxed mb-4"
                  data-testid={`project-desc-${project.id}`}
                >
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-5" data-testid={`project-tags-${project.id}`}>
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-md px-2 py-0.5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4">
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-gray-400 hover:text-white text-xs transition-colors duration-200"
                    data-testid={`project-github-${project.id}`}
                  >
                    <FaGithub size={14} />
                    <span>Code</span>
                  </a>
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-gray-400 hover:text-blue-400 text-xs transition-colors duration-200"
                    data-testid={`project-live-${project.id}`}
                  >
                    <ExternalLink size={13} />
                    <span>Live Demo</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
