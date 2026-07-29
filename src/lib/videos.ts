export type VideoProvider = "youtube" | "vimeo" | "file";

export interface ParsedVideo {
  provider: VideoProvider;
  embedUrl: string;
  originalUrl: string;
}

export function parseVideoUrl(url: string): ParsedVideo | null {
  const trimmed = url.trim();
  if (!trimmed) return null;

  const youtubeMatch = trimmed.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/,
  );
  if (youtubeMatch) {
    return {
      provider: "youtube",
      embedUrl: `https://www.youtube.com/embed/${youtubeMatch[1]}?rel=0`,
      originalUrl: trimmed,
    };
  }

  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch) {
    return {
      provider: "vimeo",
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
      originalUrl: trimmed,
    };
  }

  if (/\.(mp4|webm|ogg)(\?|$)/i.test(trimmed)) {
    return {
      provider: "file",
      embedUrl: trimmed,
      originalUrl: trimmed,
    };
  }

  return null;
}
