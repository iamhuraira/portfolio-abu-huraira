import { useEffect, useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";
import { FaGithub, FaLinkedin, FaFacebook, FaInstagram, FaDiscord } from "react-icons/fa";
import data from "@/data/portfolio.json";
import RevealText from "@/components/motion/RevealText";
import { useMagnetic } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

const socialIcons: Record<string, React.ReactNode> = {
  GitHub: <FaGithub size={24} />,
  LinkedIn: <FaLinkedin size={24} />,
  Facebook: <FaFacebook size={16} />,
  Instagram: <FaInstagram size={16} />,
  Discord: <FaDiscord size={16} />,
};

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const emailRef = useMagnetic<HTMLAnchorElement>(0.15);
  const submitRef = useMagnetic<HTMLButtonElement>(0.25);

  const [formState, setFormState] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
    if (publicKey) {
      emailjs.init({ publicKey });
    }
  }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      setError("Contact form is not configured yet. Please email me directly.");
      return;
    }

    setIsSubmitting(true);

    try {
      await emailjs.send(serviceId, templateId, {
        from_name: formState.name,
        from_email: formState.email,
        user_name: formState.name,
        user_email: formState.email,
        name: formState.name,
        email: formState.email,
        reply_to: formState.email,
        subject: formState.subject,
        title: formState.subject,
        message: formState.message,
        to_email: data.contact.email,
      });

      setSubmitted(true);
      setFormState({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setSubmitted(false), 4000);
    } catch (err) {
      const detail =
        err instanceof emailjs.EmailJSResponseStatus
          ? err.text
          : err instanceof Error
            ? err.message
            : null;

      console.error("EmailJS error:", err);

      setError(
        import.meta.env.DEV && detail
          ? `Failed to send: ${detail}`
          : "Failed to send message. Please try again or email me directly.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const field =
    "w-full bg-transparent border-0 border-b border-line-strong px-0 py-3 text-base text-ink placeholder:text-subtle focus:outline-none focus:border-accent transition-colors duration-200";
  const label = "block text-subtle text-xs font-semibold uppercase tracking-[0.2em]";

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative overflow-hidden py-24 md:py-32 px-6 md:px-12"
      data-testid="contact-section"
    >
      <div
        className="pointer-events-none absolute -bottom-60 left-1/2 h-[700px] w-[900px] -translate-x-1/2"
        style={{ background: "radial-gradient(circle at center, rgba(59,130,246,0.14) 0%, transparent 65%)" }}
        aria-hidden="true"
      />
      <div className="relative max-w-6xl mx-auto">
        <div ref={headingRef} className="mb-16">
          <p className="text-accent-ink text-xs md:text-sm font-semibold uppercase tracking-[0.25em] mb-5" data-testid="contact-heading">
            {data.contact.heading}
          </p>
          <RevealText
            as="h2"
            text="Let's build something together."
            className="font-display font-bold text-5xl md:text-7xl lg:text-8xl tracking-tight leading-[0.95] text-ink max-w-4xl"
          />
          <p className="text-muted text-base md:text-lg max-w-2xl leading-relaxed mt-8">{data.contact.subtitle}</p>
          <a
            ref={emailRef}
            href={`mailto:${data.contact.email}`}
            className="group mt-10 inline-flex items-center gap-3 font-display text-xl sm:text-2xl md:text-4xl font-medium text-ink"
            data-testid="contact-email-big"
          >
            <span className="relative">
              {data.contact.email}
              <span className="absolute -bottom-1 left-0 h-[2px] w-full origin-left scale-x-0 bg-accent transition-transform duration-500 group-hover:scale-x-100" />
            </span>
            <ArrowUpRight className="h-7 w-7 md:h-9 md:w-9 shrink-0 text-accent-ink transition-transform duration-300 group-hover:rotate-45" />
          </a>
        </div>

        <div className="grid gap-12 md:grid-cols-[1fr_1.3fr] md:gap-16">
          <div ref={leftRef} data-testid="contact-info">
            <p className={`${label} mb-2`}>{data.contact.contactInfoLabel}</p>
            <ul className="mb-12">
              {[
                { icon: Mail, name: "Email", value: data.contact.email, href: `mailto:${data.contact.email}`, id: "contact-email" },
                { icon: Phone, name: "Phone", value: data.contact.phone, href: `tel:${data.contact.phone}`, id: "contact-phone" },
                { icon: MapPin, name: "Location", value: data.contact.location, href: null, id: "contact-location" },
              ].map(({ icon: Icon, name, value, href, id }) => (
                <li key={name} className="flex items-center gap-4 border-b border-line py-4" data-testid={id}>
                  <Icon size={18} className="text-accent-ink shrink-0" />
                  <span className="text-subtle text-sm w-20 shrink-0">{name}</span>
                  {href ? (
                    <a href={href} className="text-ink text-sm md:text-base hover:text-accent-ink transition-colors break-all">
                      {value}
                    </a>
                  ) : (
                    <span className="text-ink text-sm md:text-base">{value}</span>
                  )}
                </li>
              ))}
            </ul>

            <p className={`${label} mb-4`}>{data.contact.connectLabel}</p>
            <div className="flex flex-wrap gap-3">
              {data.socials.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="group inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm text-ink/85 hover:border-accent/60 hover:text-ink transition-colors"
                >
                  {socialIcons[social.name]}
                  {social.name}
                  <ArrowUpRight size={14} className="transition-transform group-hover:rotate-45" />
                </a>
              ))}
            </div>
          </div>

          <div ref={rightRef}>
            <div className="rounded-3xl border border-line bg-soft p-6 md:p-10 h-full">
              {submitted ? (
                <div className="flex items-center justify-center h-full text-green-400 text-base text-center py-16" data-testid="contact-success">
                  Message sent! I'll get back to you soon.
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8" data-testid="contact-form">
                  <div className="grid gap-8 md:grid-cols-2">
                    <div>
                      <label htmlFor="cf-name" className={label}>Name</label>
                      <input
                        id="cf-name"
                        type="text"
                        placeholder="Your name"
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        required
                        className={field}
                        data-testid="input-contact-name"
                      />
                    </div>
                    <div>
                      <label htmlFor="cf-email" className={label}>Email</label>
                      <input
                        id="cf-email"
                        type="email"
                        placeholder="you@company.com"
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        required
                        className={field}
                        data-testid="input-contact-email"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="cf-subject" className={label}>Subject</label>
                    <input
                      id="cf-subject"
                      type="text"
                      placeholder="What's it about?"
                      value={formState.subject}
                      onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                      required
                      className={field}
                      data-testid="input-contact-subject"
                    />
                  </div>
                  <div>
                    <label htmlFor="cf-message" className={label}>Message</label>
                    <textarea
                      id="cf-message"
                      rows={4}
                      placeholder="Tell me about your project"
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      required
                      className={`${field} resize-none`}
                      data-testid="textarea-contact-message"
                    />
                  </div>
                  {error && (
                    <p className="text-red-400 text-sm" data-testid="contact-error">
                      {error}
                    </p>
                  )}
                  <button
                    ref={submitRef}
                    type="submit"
                    disabled={isSubmitting}
                    className="group inline-flex items-center gap-2 rounded-full bg-accent hover:bg-accent-hover disabled:bg-accent/60 disabled:cursor-not-allowed px-8 py-3.5 text-sm font-medium text-white transition-colors"
                    data-testid="btn-contact-submit"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                    <ArrowUpRight size={16} className="transition-transform group-hover:rotate-45" />
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
