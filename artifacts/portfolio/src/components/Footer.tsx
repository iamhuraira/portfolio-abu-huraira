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
        className="border-t border-white/10 py-5 px-6"
        data-testid="footer"
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <span className="text-white font-bold text-base tracking-wide">
            {data.brand}
          </span>

          <nav className="flex items-center gap-6">
            {data.nav.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <span className="text-gray-500 text-xs">
            © {new Date().getFullYear()} Md. Nuruzzaman. All rights reserved.
          </span>
        </div>
      </footer>

      <button
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className={`fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center shadow-lg transition-all duration-300 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
        data-testid="scroll-to-top"
      >
        <ChevronUp size={18} />
      </button>
    </>
  );
}
