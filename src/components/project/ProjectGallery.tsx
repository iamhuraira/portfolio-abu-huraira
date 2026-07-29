import { useEffect, useRef, useState } from "react";
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
  const touchStartX = useRef(0);

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

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (images.length <= 1) return;

    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) < 48) return;

    if (diff > 0) goNext();
    else goPrev();
  };

  return (
    <section data-testid="project-gallery" className="min-w-0">
      <div className="flex items-center justify-between mb-4 sm:mb-5 gap-3">
        <h2 className="text-lg sm:text-xl font-bold text-white">Gallery</h2>
        <span className="text-xs text-gray-500 flex-shrink-0">
          {activeIndex + 1} / {images.length}
        </span>
      </div>

      <div
        className="relative group rounded-xl sm:rounded-2xl overflow-hidden border border-white/10 bg-[#0d0d1a]"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          className="block w-full cursor-zoom-in touch-manipulation"
          aria-label="Open image in lightbox"
        >
          <img
            src={assetUrl(active.src)}
            alt={active.alt}
            className="w-full h-auto max-h-[220px] sm:max-h-[360px] md:max-h-[480px] object-cover object-top transition-transform duration-500 sm:group-hover:scale-[1.02]"
          />
        </button>

        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#0a0a12]/70 via-transparent to-transparent sm:from-[#0a0a12]/60" />

        <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 hidden sm:flex items-end justify-between gap-3">
          <p className="text-sm text-gray-200 font-medium drop-shadow-lg line-clamp-2 min-w-0">
            {active.alt}
          </p>
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            className="pointer-events-auto flex items-center gap-1.5 text-xs text-white bg-black/50 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-1.5 hover:bg-black/70 transition-colors flex-shrink-0"
          >
            <ZoomIn size={13} />
            Expand
          </button>
        </div>

        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          className="absolute top-3 right-3 sm:hidden pointer-events-auto flex items-center justify-center w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 text-white"
          aria-label="Expand image"
        >
          <ZoomIn size={14} />
        </button>

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/70 transition-colors touch-manipulation"
              aria-label="Previous image"
            >
              <ChevronLeft size={16} className="sm:w-[18px] sm:h-[18px]" />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/70 transition-colors touch-manipulation"
              aria-label="Next image"
            >
              <ChevronRight size={16} className="sm:w-[18px] sm:h-[18px]" />
            </button>
          </>
        )}
      </div>

      <p className="sm:hidden mt-2.5 text-xs text-gray-400 leading-relaxed px-0.5">{active.alt}</p>

      {images.length > 1 && (
        <>
          <p className="sm:hidden mt-3 mb-2 text-[11px] text-gray-600">Swipe thumbnails or main image</p>
          <div className="-mx-1 px-1 mt-3 sm:mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-gallery snap-x snap-mandatory touch-pan-x overscroll-x-contain">
            {images.map((image, index) => (
              <button
                key={image.src}
                type="button"
                onClick={() => goTo(index)}
                className={`flex-shrink-0 snap-start w-[72px] h-12 sm:w-24 sm:h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 touch-manipulation ${
                  index === activeIndex
                    ? "border-blue-500 ring-2 ring-blue-500/30 opacity-100"
                    : "border-white/10 opacity-60 hover:opacity-100 hover:border-white/30"
                }`}
                aria-label={`View ${image.alt}`}
                aria-current={index === activeIndex ? "true" : undefined}
              >
                <img
                  src={assetUrl(image.src)}
                  alt={image.alt}
                  className="w-full h-full object-cover object-top"
                  draggable={false}
                />
              </button>
            ))}
          </div>
        </>
      )}

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-3 sm:p-4"
          onClick={() => setLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={`${title} gallery lightbox`}
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10 touch-manipulation"
            aria-label="Close lightbox"
          >
            <X size={18} className="sm:w-5 sm:h-5" />
          </button>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goPrev();
                }}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10 touch-manipulation"
                aria-label="Previous image"
              >
                <ChevronLeft size={20} className="sm:w-[22px] sm:h-[22px]" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goNext();
                }}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10 touch-manipulation"
                aria-label="Next image"
              >
                <ChevronRight size={20} className="sm:w-[22px] sm:h-[22px]" />
              </button>
            </>
          )}

          <div
            className="w-full max-w-6xl max-h-full flex flex-col items-center justify-center gap-3 sm:gap-4 px-8 sm:px-12"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <img
              src={assetUrl(active.src)}
              alt={active.alt}
              className="max-w-full max-h-[65vh] sm:max-h-[80vh] w-auto h-auto object-contain rounded-lg"
            />
            <p className="text-xs sm:text-sm text-gray-400 text-center px-2 line-clamp-2">
              {active.alt} · {activeIndex + 1} of {images.length}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
