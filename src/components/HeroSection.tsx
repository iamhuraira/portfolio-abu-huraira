import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDownRight, ArrowUpRight, Gamepad2 } from "lucide-react";
import { Link } from "wouter";
import { FaGithub, FaLinkedin, FaFacebook, FaInstagram, FaDiscord } from "react-icons/fa";
import RevealText from "@/components/motion/RevealText";
import HeroShapes from "@/components/motion/HeroShapes";
import data from "@/data/portfolio.json";
import { scrollToTarget } from "@/lib/smoothScroll";
import { useMagnetic } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  FaGithub,
  FaLinkedin,
  FaFacebook,
  FaInstagram,
  FaDiscord,
};

export default function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const adjectiveRef = useRef<HTMLSpanElement>(null);
  const primaryBtn = useMagnetic<HTMLAnchorElement>();
  const secondaryBtn = useMagnetic<HTMLAnchorElement>();

  const phrases = data.hero.rotatingPhrases;
  const [firstName, ...rest] = data.brand.split(" ");
  const lastName = rest.join(" ");

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-fade", { y: 24, opacity: 0, duration: 0.9, ease: "power3.out", stagger: 0.1, delay: 0.9 });
      // the name drifts down and fades as you scroll past the hero
      gsap.to(nameRef.current, {
        yPercent: 30,
        opacity: 0.25,
        ease: "none",
        scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(".hero-blob", { x: 40, y: -30, duration: 8, repeat: -1, yoyo: true, ease: "sine.inOut", stagger: 1.5 });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const el = adjectiveRef.current;
      if (!el) return;
      gsap.to(el, {
        yPercent: -100,
        opacity: 0,
        duration: 0.35,
        ease: "power2.in",
        onComplete: () => {
          setCurrentIndex((prev) => (prev + 1) % phrases.length);
          gsap.fromTo(el, { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.55, ease: "power3.out" });
        },
      });
    }, 3500);
    return () => clearInterval(interval);
  }, [phrases.length]);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative min-h-screen flex flex-col justify-end overflow-hidden pt-28 pb-14 px-6 md:px-12"
      data-testid="hero-section"
    >
      <div className="hero-grid absolute inset-0 pointer-events-none" aria-hidden="true" />
      <HeroShapes />
      <div
        className="hero-blob absolute -bottom-40 -left-40 w-[700px] h-[700px] pointer-events-none"
        style={{ background: "radial-gradient(circle at center, var(--c-glow-a) 0%, transparent 70%)" }}
        aria-hidden="true"
      />
      <div
        className="hero-blob absolute -top-20 -right-40 w-[760px] h-[760px] pointer-events-none"
        style={{ background: "radial-gradient(circle at center, var(--c-glow-b) 0%, transparent 70%)" }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl w-full mx-auto">
        <div className="hero-fade flex flex-wrap items-center gap-3 mb-8 text-xs md:text-sm text-muted">
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-soft px-3 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Available for new projects
          </span>
          <span>{data.contact.location}</span>
          <Link
            href="/world"
            className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent-soft px-3 py-1.5 text-accent-ink hover:bg-accent hover:text-white transition-colors"
            data-testid="link-world"
          >
            <Gamepad2 size={14} /> Explore my 3D world
          </Link>
        </div>

        <h1 className="sr-only">
          {data.brand} — {phrases[0].adjective} {data.hero.staticTitle}
        </h1>
        <div ref={nameRef} aria-hidden="true" className="font-display font-bold uppercase leading-[0.86] tracking-[-0.04em]">
          <RevealText
            as="div"
            by="char"
            onScroll={false}
            delay={0.15}
            text={firstName}
            className="text-[clamp(4.2rem,16vw,14rem)] text-ink"
          />
          <RevealText
            as="div"
            by="char"
            onScroll={false}
            delay={0.4}
            text={lastName}
            className="text-[clamp(4.2rem,16vw,14rem)] text-outline md:pl-[12vw]"
          />
        </div>

        <div className="mt-10 md:mt-14 grid gap-10 md:grid-cols-[1fr_auto] md:items-end">
          <div className="max-w-xl">
            <p className="hero-fade text-xl md:text-2xl font-display font-medium text-ink mb-4" data-testid="hero-title">
              <span className="inline-flex overflow-hidden align-bottom">
                <span ref={adjectiveRef} className="inline-block" data-testid="hero-adjective">
                  {phrases[currentIndex].adjective}
                </span>
              </span>{" "}
              <span className="hero-gradient-text" data-testid="hero-role">
                {data.hero.staticTitle}
              </span>
            </p>
            <p className="hero-fade text-muted text-sm md:text-base leading-relaxed" data-testid="hero-bio">
              {data.hero.greeting}
            </p>
          </div>

          <div className="hero-fade flex flex-col items-start md:items-end gap-6" data-testid="hero-cta-group">
            <div className="flex flex-wrap items-center gap-3">
              <a
                ref={primaryBtn}
                href={data.hero.ctaLink}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToTarget(data.hero.ctaLink);
                }}
                className="group inline-flex items-center gap-2 rounded-full bg-accent hover:bg-accent-hover px-6 py-3 text-sm font-medium text-white transition-colors"
                data-testid="btn-view-projects"
              >
                {data.hero.cta}
                <ArrowDownRight size={16} className="transition-transform group-hover:rotate-[-45deg]" />
              </a>
              <a
                ref={secondaryBtn}
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToTarget("#contact");
                }}
                className="group inline-flex items-center gap-2 rounded-full border border-line-strong hover:border-ink/40 px-6 py-3 text-sm font-medium text-ink transition-colors"
              >
                Let's talk
                <ArrowUpRight size={16} className="transition-transform group-hover:rotate-45" />
              </a>
            </div>
            <div className="flex items-center gap-4" data-testid="hero-socials">
              {data.socials.map((social) => {
                const Icon = iconMap[social.icon];
                if (!Icon) return null;
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className="text-muted hover:text-ink transition-colors"
                    data-testid={`social-link-${social.name.toLowerCase()}`}
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
