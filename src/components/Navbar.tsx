import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import data from "@/data/portfolio.json";
import { scrollToTarget } from "@/lib/smoothScroll";
import ThemeToggle from "@/components/ThemeToggle";

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!navRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        navRef.current,
        { y: -60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
      );
    }, navRef);
    return () => ctx.revert();
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    scrollToTarget(href);
  };

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-page/70 backdrop-blur-md border-b border-line shadow-[0_8px_32px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.35)]"
      data-testid="navbar"
    >
      <a
        href="#home"
        onClick={(e) => handleNavClick(e, "#home")}
        className="text-ink font-bold text-lg tracking-wide hover:text-accent-ink transition-colors duration-200"
        data-testid="nav-brand"
      >
        {data.brand}
      </a>

      <div className="flex items-center gap-6 md:gap-8">
      <ul className="hidden md:flex items-center gap-8" data-testid="nav-links">
        {data.nav.map((item) => (
          <li key={item.label}>
            <a
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className="text-ink/85 hover:text-ink text-sm font-medium transition-colors duration-200 relative group"
              data-testid={`nav-link-${item.label.toLowerCase().replace(/\s/g, "-")}`}
            >
              {item.label}
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-accent group-hover:w-full transition-all duration-300" />
            </a>
          </li>
        ))}
      </ul>
      <ThemeToggle />
      </div>
    </nav>
  );
}
