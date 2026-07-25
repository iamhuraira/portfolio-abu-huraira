import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Mail, Phone, MapPin, IdCard, Link2 } from "lucide-react";
import { FaGithub, FaLinkedin, FaFacebook, FaInstagram, FaDiscord } from "react-icons/fa";
import data from "@/data/portfolio.json";

gsap.registerPlugin(ScrollTrigger);

const socialIcons: Record<string, React.ReactNode> = {
  GitHub: <FaGithub size={24} />,
  LinkedIn: <FaLinkedin size={24} />,
  Facebook: <FaFacebook size={24} />,
  Instagram: <FaInstagram size={24} />,
  Discord: <FaDiscord size={24} />,
};

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  const [formState, setFormState] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headingRef.current, {
        y: 40,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
      });
      gsap.from([leftRef.current, rightRef.current], {
        y: 40,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 72%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormState({ name: "", email: "", subject: "", message: "" });
    }, 3000);
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative py-24 px-6"
      data-testid="contact-section"
    >
      <div className="max-w-6xl mx-auto">
        <div ref={headingRef} className="mb-12">
          <h2
            className="text-4xl md:text-5xl font-bold text-white mb-1"
            data-testid="contact-heading"
          >
            {data.contact.heading}
          </h2>
          <div className="w-14 h-1 bg-blue-500 mb-5 rounded-full" />
         
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          
          <div ref={leftRef} className="space-y-8" data-testid="contact-info">
          <p className="text-gray-400 text-sm max-w-lg leading-relaxed">
            {data.contact.subtitle}
          </p>
            {/* Contact Information block */}
            <div>
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-blue-500/15 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <IdCard size={20} className="text-blue-400" />
                </div>
                <div className="pt-0.5">
                  <div className="text-blue-400 font-semibold text-base leading-tight">{data.contact.contactInfoLabel}</div>
                  <div className="text-gray-400 text-sm mt-0.5">{data.contact.contactInfoSub}</div>
                </div>
              </div>

              <div className="space-y-5 pl-2">
                <div className="flex items-start gap-4" data-testid="contact-email">
                  <Mail size={22} className="text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-white text-sm font-semibold">Email</div>
                    <a
                      href={`mailto:${data.contact.email}`}
                      className="text-gray-400 text-sm hover:text-blue-400 transition-colors duration-200"
                    >
                      {data.contact.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4" data-testid="contact-phone">
                  <Phone size={22} className="text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-white text-sm font-semibold">Phone</div>
                    <a
                      href={`tel:${data.contact.phone}`}
                      className="text-gray-400 text-sm hover:text-blue-400 transition-colors duration-200"
                    >
                      {data.contact.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4" data-testid="contact-location">
                  <MapPin size={22} className="text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-white text-sm font-semibold">Location</div>
                    <div className="text-gray-400 text-sm">{data.contact.location}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Connect with Me block */}
            <div>
              <div className="flex items-start gap-4 mb-5">
                <div className="w-12 h-12 rounded-xl bg-blue-500/15 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <Link2 size={20} className="text-blue-400" />
                </div>
                <div className="pt-0.5">
                  <div className="text-blue-400 font-semibold text-base leading-tight">{data.contact.connectLabel}</div>
                  <div className="text-gray-400 text-sm mt-0.5">{data.contact.connectSub}</div>
                </div>
              </div>
              <div className="flex items-center gap-5 pl-2">
                {data.socials.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    {socialIcons[social.name]}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div ref={rightRef}>
            <div className="bg-[#0d0d1a] border border-white/10 rounded-xl p-6 h-full">
              {submitted ? (
                <div className="flex items-center justify-center h-full text-green-400 text-sm text-center py-8" data-testid="contact-success">
                  Message sent! I'll get back to you soon.
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4" data-testid="contact-form">
                  <div>
                    <label className="block text-white text-sm mb-1.5">Name</label>
                    <input
                      type="text"
                      placeholder="Enter your name"
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      required
                      className="w-full bg-[#0a0a12] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500/60 transition-colors duration-200"
                      data-testid="input-contact-name"
                    />
                  </div>
                  <div>
                    <label className="block text-white text-sm mb-1.5">Email</label>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      required
                      className="w-full bg-[#0a0a12] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500/60 transition-colors duration-200"
                      data-testid="input-contact-email"
                    />
                  </div>
                  <div>
                    <label className="block text-white text-sm mb-1.5">Subject</label>
                    <input
                      type="text"
                      placeholder="Enter subject"
                      value={formState.subject}
                      onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                      required
                      className="w-full bg-[#0a0a12] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500/60 transition-colors duration-200"
                      data-testid="input-contact-subject"
                    />
                  </div>
                  <div>
                    <label className="block text-white text-sm mb-1.5">Message</label>
                    <textarea
                      rows={5}
                      placeholder="Enter your message"
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      required
                      className="w-full bg-[#0a0a12] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500/60 transition-colors duration-200 resize-none"
                      data-testid="textarea-contact-message"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium text-sm py-3 rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    data-testid="btn-contact-submit"
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
