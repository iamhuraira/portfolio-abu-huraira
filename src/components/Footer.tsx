import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";
import data from "@/data/portfolio.json";

export default function Footer() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <>
      <footer
        className="border-t border-white/10 py-6 sm:py-5 px-4 sm:px-6 pb-20 sm:pb-5"
        data-testid="footer"
      >
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center md:flex-row md:items-center md:justify-between md:text-left gap-4 md:gap-3">
          <span className="text-white font-bold text-base tracking-wide">
            {data.footer.brand}
          </span>

          <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:gap-x-6 max-w-full">
            {data.nav.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-gray-400 hover:text-white text-xs sm:text-sm transition-colors duration-200 whitespace-nowrap"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <span className="text-gray-500 text-[11px] sm:text-xs text-center md:text-right max-w-xs sm:max-w-none leading-relaxed">
            {data.footer.copyright}
          </span>
        </div>
      </footer>

      <button
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className={`fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-50 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center shadow-lg transition-all duration-300 touch-manipulation ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
        data-testid="scroll-to-top"
      >
        <ChevronUp size={16} className="sm:w-[18px] sm:h-[18px]" />
      </button>
    </>
  );
}
