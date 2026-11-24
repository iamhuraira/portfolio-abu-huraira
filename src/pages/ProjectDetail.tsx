import { Link, useRoute } from "wouter";
import { FaGithub } from "react-icons/fa";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  CheckCircle2,
  ExternalLink,
  Play,
  User,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProjectGallery from "@/components/project/ProjectGallery";
import ProjectVideos from "@/components/project/ProjectVideos";
import data from "@/data/portfolio.json";
import { typeColor } from "@/lib/typeColor";
import NotFound from "@/pages/not-found";
import { assetUrl, isValidUrl } from "@/lib/urls";

interface GalleryImage {
  src: string;
  alt: string;
}

interface ProjectVideo {
  url: string;
  title?: string;
}

interface Project {
  id: number;
  title: string;
  type: string;
  typeColor: string;
  description: string;
  overview?: string;
  role?: string;
  year?: string;
  preview: string;
  techStack: { name: string; color: string }[];
  highlights?: string[];
  gallery?: GalleryImage[];
  videos?: ProjectVideo[];
  githubUrl: string;
  liveUrl: string;
  videoUrl: string;
}

function getGallery(project: Project): GalleryImage[] {
  if (project.gallery && project.gallery.length > 0) return project.gallery;
  return [{ src: project.preview, alt: `${project.title} preview` }];
}

export default function ProjectDetail() {
  const [, params] = useRoute("/projects/:id");
  const projectId = Number(params?.id);
  const projects = data.projects.items as Project[];
  const projectIndex = projects.findIndex((item) => item.id === projectId);
  const project = projects[projectIndex];

  if (!project) {
    return <NotFound />;
  }

  const prevProject = projectIndex > 0 ? projects[projectIndex - 1] : null;
  const nextProject = projectIndex < projects.length - 1 ? projects[projectIndex + 1] : null;

  const showGithub = isValidUrl(project.githubUrl);
  const showLive = isValidUrl(project.liveUrl);
  const showVideo = isValidUrl(project.videoUrl);
  const overview = project.overview ?? project.description;
  const highlights = project.highlights ?? [];
  const gallery = getGallery(project);
  const videos = project.videos ?? [];

  return (
    <div className="min-h-screen bg-page text-ink">
      <Navbar />

      {/* Hero */}
      <div className="relative pt-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/10 via-transparent to-page pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent-soft rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-6 pt-8 pb-10">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink transition-colors mb-8 group"
          >
            <ArrowLeft
              size={16}
              className="transition-transform group-hover:-translate-x-0.5"
            />
            Back to Projects
          </Link>

          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full bg-soft border border-line ${typeColor(project.typeColor)}`}
                >
                  {project.type}
                </span>
                {project.year && (
                  <span className="flex items-center gap-1.5 text-xs text-subtle">
                    <Calendar size={12} />
                    {project.year}
                  </span>
                )}
                {project.role && (
                  <span className="flex items-center gap-1.5 text-xs text-subtle">
                    <User size={12} />
                    {project.role}
                  </span>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-ink mb-4 leading-tight">
                {project.title}
              </h1>

              <p className="text-muted text-sm md:text-base leading-relaxed mb-8 max-w-xl">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-3">
                {showLive && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    <ExternalLink size={15} />
                    Visit Live Site
                  </a>
                )}
                {showGithub && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-ink/75 border border-line rounded-lg px-5 py-2.5 hover:bg-soft hover:text-ink transition-colors"
                  >
                    <FaGithub size={15} />
                    View on GitHub
                  </a>
                )}
                {showVideo && (
                  <a
                    href={project.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-ink/75 border border-line rounded-lg px-5 py-2.5 hover:bg-soft hover:text-ink transition-colors"
                  >
                    <Play size={15} />
                    Watch Demo
                  </a>
                )}
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden border border-line shadow-2xl shadow-blue-500/5">
              <div className="absolute inset-0 bg-gradient-to-tr from-accent/10 to-purple-500/10 pointer-events-none z-10" />
              <img
                src={assetUrl(project.preview)}
                alt={project.title}
                className="w-full aspect-video object-cover object-top"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-10">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-8 md:space-y-12 min-w-0">
            <section>
              <h2 className="text-xl font-bold text-ink mb-4">Overview</h2>
              <div className="w-10 h-0.5 bg-accent rounded-full mb-5" />
              <p className="text-muted text-sm md:text-base leading-relaxed">{overview}</p>
            </section>

            {highlights.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-ink mb-5">Key Highlights</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {highlights.map((highlight) => (
                    <div
                      key={highlight}
                      className="flex items-start gap-3 p-4 rounded-xl bg-surface border border-line hover:border-line-strong transition-colors"
                    >
                      <CheckCircle2
                        size={16}
                        className="text-accent-ink flex-shrink-0 mt-0.5"
                      />
                      <p className="text-ink/75 text-sm leading-relaxed">{highlight}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <ProjectGallery images={gallery} title={project.title} />
            <ProjectVideos videos={videos} fallbackVideoUrl={project.videoUrl} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="sticky top-24 space-y-6">
              <div className="rounded-2xl border border-line bg-surface p-6">
                <h3 className="text-ink font-semibold text-sm mb-4">Project Info</h3>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-xs text-subtle mb-1">Type</dt>
                    <dd className={`text-sm font-medium ${typeColor(project.typeColor)}`}>
                      {project.type}
                    </dd>
                  </div>
                  {project.role && (
                    <div>
                      <dt className="text-xs text-subtle mb-1">Role</dt>
                      <dd className="text-sm text-ink/75">{project.role}</dd>
                    </div>
                  )}
                  {project.year && (
                    <div>
                      <dt className="text-xs text-subtle mb-1">Year</dt>
                      <dd className="text-sm text-ink/75">{project.year}</dd>
                    </div>
                  )}
                </dl>
              </div>

              <div className="rounded-2xl border border-line bg-surface p-6">
                <h3 className="text-ink font-semibold text-sm mb-4">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech.name}
                      className="flex items-center gap-1.5 text-xs text-ink/75 bg-soft border border-line rounded-lg px-2.5 py-1.5"
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
                <div className="rounded-2xl border border-line bg-surface p-6">
                  <h3 className="text-ink font-semibold text-sm mb-4">Links</h3>
                  <div className="space-y-2">
                    {showLive && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-accent-ink hover:text-accent-ink transition-colors py-1"
                      >
                        <ExternalLink size={14} />
                        Live Site
                      </a>
                    )}
                    {showGithub && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-accent-ink hover:text-accent-ink transition-colors py-1"
                      >
                        <FaGithub size={14} />
                        GitHub Repository
                      </a>
                    )}
                    {showVideo && (
                      <a
                        href={project.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-accent-ink hover:text-accent-ink transition-colors py-1"
                      >
                        <Play size={14} />
                        Video Demo
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Prev / Next navigation */}
        <div
          className={`mt-10 sm:mt-16 pt-6 sm:pt-8 border-t border-line grid gap-3 sm:gap-4 ${
            prevProject && nextProject ? "grid-cols-2" : "grid-cols-1"
          }`}
        >
          {prevProject && (
            <Link
              href={`/projects/${prevProject.id}`}
              className="group flex items-center gap-2.5 sm:gap-4 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-line bg-surface hover:border-accent/30 hover:bg-accent-soft transition-all min-w-0 w-full touch-manipulation active:scale-[0.98]"
            >
              <span className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-soft border border-line flex items-center justify-center group-hover:border-accent/30 group-hover:bg-accent-soft transition-colors">
                <ArrowLeft
                  size={15}
                  className="text-muted group-hover:text-accent-ink transition-colors"
                />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] sm:text-xs uppercase tracking-wide text-subtle mb-0.5">
                  Previous
                </p>
                <p className="text-xs sm:text-sm font-medium text-ink truncate group-hover:text-accent-ink transition-colors">
                  {prevProject.title}
                </p>
              </div>
            </Link>
          )}

          {nextProject && (
            <Link
              href={`/projects/${nextProject.id}`}
              className="group flex items-center gap-2.5 sm:gap-4 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-line bg-surface hover:border-accent/30 hover:bg-accent-soft transition-all min-w-0 w-full touch-manipulation active:scale-[0.98]"
            >
              <div className="min-w-0 flex-1 text-right">
                <p className="text-[10px] sm:text-xs uppercase tracking-wide text-subtle mb-0.5">
                  Next
                </p>
                <p className="text-xs sm:text-sm font-medium text-ink truncate group-hover:text-accent-ink transition-colors">
                  {nextProject.title}
                </p>
              </div>
              <span className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-soft border border-line flex items-center justify-center group-hover:border-accent/30 group-hover:bg-accent-soft transition-colors">
                <ArrowRight
                  size={15}
                  className="text-muted group-hover:text-accent-ink transition-colors"
                />
              </span>
            </Link>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
