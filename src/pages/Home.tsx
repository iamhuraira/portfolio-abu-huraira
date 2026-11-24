import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import TechStackSection from "@/components/TechStackSection";
import ProjectsSection from "@/components/ProjectsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import Marquee from "@/components/Marquee";
import StatementSection from "@/components/StatementSection";
import ServicesSection from "@/components/ServicesSection";
import ProcessSection from "@/components/ProcessSection";
import ScrollProgress from "@/components/motion/ScrollProgress";
import Cursor from "@/components/motion/Cursor";
import { scrollToTarget, startSmoothScroll } from "@/lib/smoothScroll";
import { useScrollSkew } from "@/lib/motion";

export default function Home() {
  useEffect(() => startSmoothScroll(), []);
  useScrollSkew(".skew-scroll");

  // links like "/#contact" (e.g. from the 3D world) land on that section
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;
    const t = window.setTimeout(() => scrollToTarget(hash), 300);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-page text-ink" data-testid="home-page">
      <ScrollProgress />
      <Navbar />
      <HeroSection />
      <Marquee />
      <StatementSection />
      <AboutSection />
      <ServicesSection />
      <ProcessSection />
      <TechStackSection />
      <ProjectsSection />
      <ContactSection />
      <Footer />
      <Cursor />
    </div>
  );
}
