import { ExternalLink, Play } from "lucide-react";
import { parseVideoUrl } from "@/lib/videos";
import { isValidUrl } from "@/lib/urls";

interface ProjectVideo {
  url: string;
  title?: string;
}

interface ProjectVideosProps {
  videos: ProjectVideo[];
  fallbackVideoUrl?: string;
}

function getVideoEntries(videos: ProjectVideo[], fallbackVideoUrl?: string) {
  const entries = videos.filter((v) => isValidUrl(v.url));

  if (entries.length === 0 && isValidUrl(fallbackVideoUrl)) {
    return [{ url: fallbackVideoUrl!, title: "Project Demo" }];
  }

  return entries;
}

export default function ProjectVideos({ videos, fallbackVideoUrl }: ProjectVideosProps) {
  const entries = getVideoEntries(videos, fallbackVideoUrl);
  if (entries.length === 0) return null;

  return (
    <section data-testid="project-videos">
      <div className="flex items-center gap-2 mb-5">
        <Play size={18} className="text-blue-400" />
        <h2 className="text-xl font-bold text-white">Videos</h2>
      </div>

      <div className={`grid gap-6 ${entries.length > 1 ? "md:grid-cols-2" : ""}`}>
        {entries.map((entry, index) => {
          const parsed = parseVideoUrl(entry.url);

          if (!parsed) {
            return (
              <a
                key={entry.url}
                href={entry.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-5 rounded-2xl border border-white/10 bg-[#0d0d1a] hover:border-blue-500/40 hover:bg-blue-500/5 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-500/15 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <Play size={20} className="text-blue-400 ml-0.5" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">
                    {entry.title ?? `Video ${index + 1}`}
                  </p>
                  <p className="text-gray-500 text-xs mt-0.5 flex items-center gap-1">
                    Watch externally <ExternalLink size={11} />
                  </p>
                </div>
              </a>
            );
          }

          if (parsed.provider === "file") {
            return (
              <div
                key={entry.url}
                className="rounded-2xl overflow-hidden border border-white/10 bg-[#0d0d1a]"
              >
                {entry.title && (
                  <p className="px-4 pt-4 text-sm font-medium text-white">{entry.title}</p>
                )}
                <video
                  src={parsed.embedUrl}
                  controls
                  className="w-full aspect-video bg-black"
                  preload="metadata"
                >
                  <track kind="captions" />
                </video>
              </div>
            );
          }

          return (
            <div
              key={entry.url}
              className="rounded-2xl overflow-hidden border border-white/10 bg-[#0d0d1a]"
            >
              {entry.title && (
                <p className="px-4 pt-4 pb-3 text-sm font-medium text-white">{entry.title}</p>
              )}
              <div className={`relative w-full aspect-video ${entry.title ? "" : "mt-0"}`}>
                <iframe
                  src={parsed.embedUrl}
                  title={entry.title ?? `Project video ${index + 1}`}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
