import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FileText, GraduationCap, Briefcase, Download } from "lucide-react";
import data from "@/data/portfolio.json";

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headingRef.current, {
        y: 40,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 85%" },
      });

      gsap.from(leftRef.current, {
        x: -40,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
      });

      gsap.from(rightRef.current, {
        x: 40,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const { about } = data;

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-24 px-6 md:px-12"
      data-testid="about-section"
    >
      <div className="max-w-6xl mx-auto">
        <h2
          ref={headingRef}
          className="text-3xl md:text-4xl font-bold text-white mb-2"
          data-testid="about-heading"
        >
          {about.heading}
        </h2>
        <div className="w-14 h-[3px] bg-blue-500 rounded-full mb-10" />

        <div className="grid lg:grid-cols-[1fr_280px] gap-10 items-start">
          <div ref={leftRef} className="space-y-8" data-testid="about-left">
            <div
              className="rounded-xl border border-white/10 bg-white/5 p-5"
              data-testid="about-bio-block"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-md bg-blue-500/15 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <FileText size={14} className="text-blue-400" />
                </div>
                <span className="text-blue-400 font-semibold text-sm tracking-wide">Bio</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed" data-testid="about-bio-text">
                {about.bio}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div
                className="rounded-xl border border-white/10 bg-white/5 p-5"
                data-testid="about-education-block"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-md bg-blue-500/15 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <GraduationCap size={14} className="text-blue-400" />
                  </div>
                  <span className="text-blue-400 font-semibold text-sm tracking-wide">
                    Education
                  </span>
                </div>
                <div className="space-y-5">
                  {about.education.map((edu, i) => (
                    <div key={i} data-testid={`education-item-${i}`}>
                      <p className="text-white text-sm font-semibold leading-snug">{edu.degree}</p>
                      <p className="text-gray-400 text-xs mt-0.5">{edu.institution}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{edu.period}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className="rounded-xl border border-white/10 bg-white/5 p-5"
                data-testid="about-experience-block"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-md bg-blue-500/15 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <Briefcase size={14} className="text-blue-400" />
                  </div>
                  <span className="text-blue-400 font-semibold text-sm tracking-wide">
                    Experience
                  </span>
                </div>
                <div className="space-y-5">
                  {about.experience.map((exp, i) => (
                    <div key={i} data-testid={`experience-item-${i}`}>
                      <p className="text-white text-sm font-semibold leading-snug">{exp.role}</p>
                      <p className="text-gray-400 text-xs mt-0.5">{exp.company}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{exp.period}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div
            ref={rightRef}
            className="flex flex-col items-center text-center gap-4"
            data-testid="about-profile"
          >
            <div className="relative">
              <div className="w-36 h-36 rounded-full overflow-hidden border-2 border-blue-500/40 ring-4 ring-blue-500/10">
                <img
                  src={about.profile.photo}
                  alt={about.profile.name}
                  className="w-full h-full object-cover object-top"
                  data-testid="about-profile-photo"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-[#0a0a12]" />
            </div>

            <div>
              <h3 className="text-white font-bold text-lg" data-testid="about-profile-name">
                {about.profile.name}
              </h3>
              <p
                className="text-gray-400 text-xs leading-relaxed mt-1 max-w-[220px]"
                data-testid="about-profile-tagline"
              >
                {about.profile.tagline}
              </p>
            </div>

            <a
              href={about.profile.resumeUrl}
              download
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 mt-1"
              data-testid="btn-download-resume"
            >
              <Download size={14} />
              Download Resume
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
