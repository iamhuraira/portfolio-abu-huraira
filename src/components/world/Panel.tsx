import { useEffect } from "react";
import { Link } from "wouter";
import { X, Download, Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";
import data from "@/data/portfolio.json";
import { isValidUrl } from "@/lib/urls";
import type { StationId } from "./stations";

const TITLES: Record<StationId, string> = {
  about: "About me",
  projects: "Projects",
  skills: "Tech stack",
  services: "Services",
  contact: "Say hello",
};

function About() {
  const { about } = data;
  return (
    <>
      <div className="flex items-center gap-4 mb-4">
        <img src={about.profile.photo} alt={about.profile.name} className="w-16 h-16 rounded-2xl object-cover object-top border-2 border-[#8a5a34]/30" />
        <div>
          <p className="text-lg font-semibold">{about.profile.name}</p>
          <p className="text-sm text-[#7a5a3c]">{about.profile.tagline}</p>
        </div>
      </div>
      <p className="text-[15px] leading-relaxed text-[#4a3524]">{about.bio}</p>
      <h4 className="world-h4">Experience</h4>
      <ul className="space-y-2">
        {about.experience.map((e) => (
          <li key={e.role + e.company} className="world-row">
            <div>
              <p className="font-semibold">{e.role}</p>
              <p className="text-sm text-[#7a5a3c]">{e.company}</p>
            </div>
            <span className="text-xs text-[#7a5a3c] whitespace-nowrap">{e.period}</span>
          </li>
        ))}
      </ul>
      <h4 className="world-h4">Education</h4>
      {about.education.map((e) => (
        <div key={e.degree} className="world-row">
          <div>
            <p className="font-semibold">{e.degree}</p>
            <p className="text-sm text-[#7a5a3c]">{e.institution}</p>
          </div>
          <span className="text-xs text-[#7a5a3c] whitespace-nowrap">{e.period}</span>
        </div>
      ))}
      <a href={about.profile.resumeUrl} download className="world-btn mt-5">
        <Download size={16} /> Download resume
      </a>
    </>
  );
}

function Projects() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {data.projects.items.map((p) => (
        <div key={p.id} className="rounded-2xl bg-white/70 border-2 border-[#8a5a34]/20 overflow-hidden">
          <img src={p.preview} alt={p.title} className="h-28 w-full object-cover object-top" />
          <div className="p-3">
            <p className="font-semibold leading-tight">{p.title}</p>
            <p className="text-xs text-[#7a5a3c] mb-2">{p.type}</p>
            <div className="flex flex-wrap gap-2">
              <Link href={`/projects/${p.id}`} className="world-chip">
                Details
              </Link>
              {isValidUrl(p.liveUrl) && (
                <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="world-chip">
                  Live <ArrowUpRight size={12} />
                </a>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Skills() {
  return (
    <div className="space-y-4">
      {data.techStack.categories.map((c) => (
        <div key={c.name}>
          <h4 className="world-h4 mt-0">{c.name}</h4>
          <div className="flex flex-wrap gap-2">
            {c.skills.map((s) => (
              <span key={s} className="world-chip">
                {s}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function Services() {
  return (
    <ul className="space-y-3">
      {data.services.items.map((s, i) => (
        <li key={s.title} className="rounded-2xl bg-white/70 border-2 border-[#8a5a34]/20 p-4">
          <p className="font-semibold">
            <span className="text-[#2f5bff] mr-2">{String(i + 1).padStart(2, "0")}</span>
            {s.title}
          </p>
          <p className="text-sm text-[#4a3524] mt-1 leading-relaxed">{s.description}</p>
        </li>
      ))}
    </ul>
  );
}

function Contact() {
  const { contact } = data;
  return (
    <>
      <p className="text-[15px] leading-relaxed text-[#4a3524] mb-4">{contact.subtitle}</p>
      <div className="space-y-2">
        <a href={`mailto:${contact.email}`} className="world-row hover:bg-white">
          <span className="flex items-center gap-3"><Mail size={18} /> {contact.email}</span>
          <ArrowUpRight size={16} />
        </a>
        <a href={`tel:${contact.phone}`} className="world-row hover:bg-white">
          <span className="flex items-center gap-3"><Phone size={18} /> {contact.phone}</span>
          <ArrowUpRight size={16} />
        </a>
        <div className="world-row">
          <span className="flex items-center gap-3"><MapPin size={18} /> {contact.location}</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mt-4">
        {data.socials.map((s) => (
          <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" className="world-chip">
            {s.name} <ArrowUpRight size={12} />
          </a>
        ))}
      </div>
      {/* full page load so the classic site opens straight at its contact form */}
      <a href="/#contact" className="world-btn mt-5">
        Send a message
      </a>
    </>
  );
}

const BODIES: Record<StationId, () => React.ReactElement> = { about: About, projects: Projects, skills: Skills, services: Services, contact: Contact };

export default function Panel({ id, onClose }: { id: StationId; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  const Body = BODIES[id];
  return (
    <div className="world-panel-wrap" onPointerDown={onClose}>
      <section className="world-panel" role="dialog" aria-label={TITLES[id]} onPointerDown={(e) => e.stopPropagation()}>
        <header className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-semibold">{TITLES[id]}</h3>
          <button onClick={onClose} aria-label="Close" className="world-close">
            <X size={18} />
          </button>
        </header>
        <div className="world-panel-body">
          <Body />
        </div>
      </section>
    </div>
  );
}
