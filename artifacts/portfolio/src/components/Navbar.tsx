import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import data from "@/data/portfolio.json";

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
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5"
      data-testid="navbar"
    >
      <a
        href="#home"
        onClick={(e) => handleNavClick(e, "#home")}
        className="text-white font-bold text-lg tracking-wide hover:text-blue-400 transition-colors duration-200"
        data-testid="nav-brand"
      >
        {data.brand}
      </a>

      <ul className="hidden md:flex items-center gap-8" data-testid="nav-links">
        {data.nav.map((item) => (
          <li key={item.label}>
            <a
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className="text-gray-300 hover:text-white text-sm font-medium transition-colors duration-200 relative group"
              data-testid={`nav-link-${item.label.toLowerCase().replace(/\s/g, "-")}`}
            >
              {item.label}
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-blue-400 group-hover:w-full transition-all duration-300" />
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
