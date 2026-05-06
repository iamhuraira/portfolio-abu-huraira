import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { FaGithub, FaLinkedin, FaFacebook, FaInstagram, FaDiscord } from "react-icons/fa";
import ScrollIndicator from "@/components/ScrollIndicator";
import data from "@/data/portfolio.json";

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  FaGithub,
  FaLinkedin,
  FaFacebook,
  FaInstagram,
  FaDiscord,
};

export default function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const adjectiveRef = useRef<HTMLSpanElement>(null);
  const developerRef = useRef<HTMLSpanElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const blobTealRef = useRef<HTMLDivElement>(null);
  const blobPurpleRef = useRef<HTMLDivElement>(null);

  const phrases = data.hero.rotatingPhrases;

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 });
      tl.fromTo(
        adjectiveRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
      )
        .fromTo(
          developerRef.current,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
          "-=0.5"
        )
        .from(
          subtitleRef.current,
          { y: 20, duration: 0.7, ease: "power3.out" },
          "-=0.4"
        )
        .from(
          ctaRef.current,
          { y: 20, duration: 0.7, ease: "power3.out" },
          "-=0.35"
        );

      gsap.to(blobTealRef.current, {
        x: 30,
        y: -20,
        duration: 7,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(blobPurpleRef.current, {
        x: -25,
        y: 25,
        duration: 9,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!adjectiveRef.current) return;

      gsap.to(adjectiveRef.current, {
        opacity: 0,
        y: -12,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          setCurrentIndex((prev) => (prev + 1) % phrases.length);
          gsap.fromTo(
            adjectiveRef.current,
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }
          );
        },
      });
    }, 2800);

    return () => clearInterval(interval);
  }, [phrases.length]);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      data-testid="hero-section"
    >
      <div
        ref={blobTealRef}
        className="absolute bottom-0 left-0 w-[700px] h-[700px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, rgba(20,184,166,0.15) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />
      <div
        ref={blobPurpleRef}
        className="absolute bottom-0 right-0 w-[700px] h-[700px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, rgba(139,92,246,0.15) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto flex flex-col items-center">
        <h1
          className="text-5xl md:text-6xl font-bold leading-snug mb-5"
          data-testid="hero-title"
        >
          <span
            ref={adjectiveRef}
            className="block text-gray-500 mb-1"
            data-testid="hero-adjective"
          >
            {phrases[currentIndex].adjective}
          </span>
          <span
            ref={developerRef}
            className="block"
            style={{
              backgroundImage: "linear-gradient(135deg, #3b82f6, #a855f7)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
            data-testid="hero-role"
          >
            {data.hero.staticTitle}
          </span>
        </h1>

        <p
          ref={subtitleRef}
          className="text-gray-400 text-sm md:text-base leading-relaxed mb-8 max-w-lg mx-auto"
          style={{ opacity: 1 }}
          data-testid="hero-bio"
        >
          {data.hero.greeting}
          <br />
          {data.hero.subtitle}
        </p>

        <div
          ref={ctaRef}
          className="flex items-center justify-center gap-6 flex-wrap"
          style={{ opacity: 1 }}
          data-testid="hero-cta-group"
        >
          <a
            href={data.hero.ctaLink}
            onClick={(e) => {
              e.preventDefault();
              document.querySelector(data.hero.ctaLink)?.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded text-sm transition-all duration-200 hover:scale-105 active:scale-95"
            data-testid="btn-view-projects"
          >
            {data.hero.cta}
          </a>

          <span className="w-px h-6 bg-gray-700" aria-hidden="true" />

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
                  className="text-gray-400 hover:text-white transition-colors duration-200 hover:scale-110 transform"
                  data-testid={`social-link-${social.name.toLowerCase()}`}
                >
                  <Icon size={18} />
                </a>
              );
            })}
          </div>
        </div>
      </div>

      <ScrollIndicator />
    </section>
  );
}
