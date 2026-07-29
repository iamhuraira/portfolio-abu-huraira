import { ExternalLink, Play } from "lucide-react";
import { parseVideoUrl } from "@/lib/videos";
import { assetUrl, isValidUrl } from "@/lib/urls";

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

function getVideoSrc(url: string, parsed: NonNullable<ReturnType<typeof parseVideoUrl>>) {
  if (parsed.provider === "file" && url.startsWith("/")) {
    return assetUrl(url);
  }
  return parsed.embedUrl;
}

export default function ProjectVideos({ videos, fallbackVideoUrl }: ProjectVideosProps) {
  const entries = getVideoEntries(videos, fallbackVideoUrl);
  if (entries.length === 0) return null;

  return (
    <section data-testid="project-videos" className="min-w-0">
      <div className="flex items-center gap-2 mb-4 sm:mb-5">
        <Play size={16} className="text-blue-400 sm:w-[18px] sm:h-[18px] flex-shrink-0" />
        <h2 className="text-lg sm:text-xl font-bold text-white">Videos</h2>
      </div>

      <div className={`grid grid-cols-1 gap-4 sm:gap-6 min-w-0 ${entries.length > 1 ? "md:grid-cols-2" : ""}`}>
        {entries.map((entry, index) => {
          const parsed = parseVideoUrl(entry.url);

          if (!parsed) {
            return (
              <a
                key={entry.url}
                href={entry.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-white/10 bg-[#0d0d1a] hover:border-blue-500/40 hover:bg-blue-500/5 transition-colors min-w-0"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-500/15 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <Play size={18} className="text-blue-400 ml-0.5 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-white font-medium text-sm truncate">
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
            const videoSrc = getVideoSrc(entry.url, parsed);

            return (
              <div
                key={entry.url}
                className="rounded-xl sm:rounded-2xl overflow-hidden border border-white/10 bg-[#0d0d1a] min-w-0 w-full"
              >
                {entry.title && (
                  <p className="px-3 sm:px-4 pt-3 sm:pt-4 text-sm font-medium text-white line-clamp-2">
                    {entry.title}
                  </p>
                )}
                <div className="w-full min-w-0 p-0">
                  <video
                    src={videoSrc}
                    controls
                    playsInline
                    preload="metadata"
                    className="w-full max-w-full aspect-video bg-black block"
                  >
                    <track kind="captions" />
                  </video>
                </div>
              </div>
            );
          }

          return (
            <div
              key={entry.url}
              className="rounded-xl sm:rounded-2xl overflow-hidden border border-white/10 bg-[#0d0d1a] min-w-0 w-full"
            >
              {entry.title && (
                <p className="px-3 sm:px-4 pt-3 sm:pt-4 pb-2 sm:pb-3 text-sm font-medium text-white line-clamp-2">
                  {entry.title}
                </p>
              )}
              <div className="relative w-full min-w-0 aspect-video bg-black">
                <iframe
                  src={parsed.embedUrl}
                  title={entry.title ?? `Project video ${index + 1}`}
                  className="absolute inset-0 w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
