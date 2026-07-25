import { Link, useRoute } from "wouter";
import { FaGithub } from "react-icons/fa";
import { ArrowLeft, ExternalLink, Play } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import data from "@/data/portfolio.json";
import NotFound from "@/pages/not-found";
import { isValidUrl } from "@/lib/urls";

export default function ProjectDetail() {
  const [, params] = useRoute("/projects/:id");
  const projectId = Number(params?.id);
  const project = data.projects.items.find((item) => item.id === projectId);

  if (!project) {
    return <NotFound />;
  }

  const showGithub = isValidUrl(project.githubUrl);
  const showLive = isValidUrl(project.liveUrl);
  const showVideo = isValidUrl(project.videoUrl);
  const details = project.description;

  return (
    <div className="min-h-screen bg-[#0a0a12] text-white">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 py-24">
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          Back to Projects
        </Link>

        <div className="rounded-xl overflow-hidden border border-white/10 mb-8">
          <img
            src={project.preview}
            alt={project.title}
            className="w-full max-h-[420px] object-cover object-top"
          />
        </div>

        <div className="mb-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {project.title}
          </h1>
          <p className={`text-sm font-medium ${project.typeColor}`}>{project.type}</p>
        </div>

        <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-8">
          {details}
        </p>

        <div className="mb-10">
          <h2 className="text-white font-semibold text-sm mb-3">Tech Stack</h2>
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

        {(showGithub || showLive || showVideo) && (
          <div className="flex flex-wrap gap-3">
            {showGithub && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-blue-400 border border-blue-500/40 rounded-md px-4 py-2 hover:bg-blue-500/10 transition-colors"
              >
                <FaGithub size={14} />
                GitHub
              </a>
            )}

            {showLive && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-blue-400 border border-blue-500/40 rounded-md px-4 py-2 hover:bg-blue-500/10 transition-colors"
              >
                <ExternalLink size={14} />
                Live Site
              </a>
            )}

            {showVideo && (
              <a
                href={project.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-blue-400 border border-blue-500/40 rounded-md px-4 py-2 hover:bg-blue-500/10 transition-colors"
              >
                <Play size={14} />
                Video
              </a>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
