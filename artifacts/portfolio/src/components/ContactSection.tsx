import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Mail, MapPin, Send } from "lucide-react";
import data from "@/data/portfolio.json";

gsap.registerPlugin(ScrollTrigger);

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        }
      );

      gsap.fromTo(
        [infoRef.current, formRef.current],
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 72%" },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormState({ name: "", email: "", message: "" });
    }, 3000);
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative py-24 px-4"
      data-testid="contact-section"
    >
      <div className="max-w-4xl mx-auto">
        <div ref={headingRef} className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-2" data-testid="contact-heading">
            {data.contact.heading}
          </h2>
          <p className="text-gray-500 text-sm mb-4">{data.contact.subtitle}</p>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full" />
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          <div ref={infoRef} className="space-y-6" data-testid="contact-info">
            <p className="text-gray-400 text-sm leading-relaxed">{data.contact.description}</p>

            <div className="space-y-4">
              <div className="flex items-center gap-3" data-testid="contact-email">
                <div className="w-9 h-9 rounded-lg bg-blue-500/15 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <Mail size={15} className="text-blue-400" />
                </div>
                <div>
                  <div className="text-gray-500 text-xs">Email</div>
                  <a
                    href={`mailto:${data.contact.email}`}
                    className="text-gray-300 text-sm hover:text-blue-400 transition-colors duration-200"
                  >
                    {data.contact.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3" data-testid="contact-location">
                <div className="w-9 h-9 rounded-lg bg-blue-500/15 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <MapPin size={15} className="text-blue-400" />
                </div>
                <div>
                  <div className="text-gray-500 text-xs">Location</div>
                  <div className="text-gray-300 text-sm">{data.contact.location}</div>
                </div>
              </div>
            </div>

            <div
              className="inline-flex items-center gap-2 text-xs text-green-400 bg-green-400/10 border border-green-400/20 rounded-full px-3 py-1.5"
              data-testid="contact-availability"
            >
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              {data.contact.availability}
            </div>
          </div>

          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="space-y-4"
            data-testid="contact-form"
          >
            {submitted ? (
              <div
                className="text-center py-8 text-green-400 text-sm"
                data-testid="contact-success"
              >
                Message sent! I'll get back to you soon.
              </div>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500/60 transition-colors duration-200"
                  data-testid="input-contact-name"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500/60 transition-colors duration-200"
                  data-testid="input-contact-email"
                />
                <textarea
                  rows={4}
                  placeholder="Your Message"
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500/60 transition-colors duration-200 resize-none"
                  data-testid="textarea-contact-message"
                />
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-medium text-sm py-3 rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  data-testid="btn-contact-submit"
                >
                  <Send size={14} />
                  Send Message
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
