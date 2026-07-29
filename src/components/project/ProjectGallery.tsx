import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { assetUrl } from "@/lib/urls";

interface GalleryImage {
  src: string;
  alt: string;
}

interface ProjectGalleryProps {
  images: GalleryImage[];
  title: string;
}

export default function ProjectGallery({ images, title }: ProjectGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const active = images[activeIndex];

  useEffect(() => {
    if (!lightboxOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowRight") setActiveIndex((i) => (i + 1) % images.length);
      if (e.key === "ArrowLeft") setActiveIndex((i) => (i - 1 + images.length) % images.length);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [lightboxOpen, images.length]);

  if (images.length === 0) return null;

  const goTo = (index: number) => setActiveIndex(index);
  const goPrev = () => setActiveIndex((i) => (i - 1 + images.length) % images.length);
  const goNext = () => setActiveIndex((i) => (i + 1) % images.length);

  return (
    <section data-testid="project-gallery">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-white">Gallery</h2>
        <span className="text-xs text-gray-500">
          {activeIndex + 1} / {images.length}
        </span>
      </div>

      <div className="relative group rounded-2xl overflow-hidden border border-white/10 bg-[#0d0d1a]">
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          className="block w-full cursor-zoom-in"
          aria-label="Open image in lightbox"
        >
          <img
            src={assetUrl(active.src)}
            alt={active.alt}
            className="w-full max-h-[480px] object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
          />
        </button>

        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#0a0a12]/60 via-transparent to-transparent" />

        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
          <p className="text-sm text-gray-200 font-medium drop-shadow-lg">{active.alt}</p>
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            className="pointer-events-auto flex items-center gap-1.5 text-xs text-white bg-black/50 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-1.5 hover:bg-black/70 transition-colors"
          >
            <ZoomIn size={13} />
            Expand
          </button>
        </div>

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
              aria-label="Next image"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-gallery">
          {images.map((image, index) => (
            <button
              key={image.src}
              type="button"
              onClick={() => goTo(index)}
              className={`flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                index === activeIndex
                  ? "border-blue-500 ring-2 ring-blue-500/30"
                  : "border-white/10 opacity-60 hover:opacity-100 hover:border-white/30"
              }`}
              aria-label={`View ${image.alt}`}
            >
              <img
                src={assetUrl(image.src)}
                alt={image.alt}
                className="w-full h-full object-cover object-top"
              />
            </button>
          ))}
        </div>
      )}

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          onClick={() => setLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={`${title} gallery lightbox`}
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
            aria-label="Close lightbox"
          >
            <X size={20} />
          </button>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goPrev();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
                aria-label="Previous image"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goNext();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
                aria-label="Next image"
              >
                <ChevronRight size={22} />
              </button>
            </>
          )}

          <div
            className="max-w-6xl w-full max-h-[90vh] flex flex-col items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={assetUrl(active.src)}
              alt={active.alt}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />
            <p className="text-sm text-gray-400 text-center">
              {active.alt} · {activeIndex + 1} of {images.length}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
