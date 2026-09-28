import { Suspense, lazy, useState } from "react";
import { motion } from "framer-motion";
import { Mail, Send, Phone, MapPin, MessageCircle, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MagneticButton } from "./ScrollReveal";
import ErrorBoundary from "./ErrorBoundary";
import { ViewportMount } from "./ViewportMount";

const RamenShop = lazy(() =>
  import("./three/NarutoModels").then((m) => ({ default: m.RamenShop })),
);

const EMAIL = "oderinwalematthew3@gmail.com";
/** 0913 850 8184 in international form, reused for tel: and wa.me links. */
const PHONE_INTL = "2349138508184";
const PHONE_DISPLAY = "+234 913 850 8184";
const WHATSAPP_URL = `https://wa.me/${PHONE_INTL}?text=${encodeURIComponent(
  "Hi Matthew, I saw your portfolio and I have a mission for you.",
)}`;

const CONTACT_CHANNELS = [
  { icon: Mail, label: "Messenger Hawk", value: EMAIL, href: `mailto:${EMAIL}` },
  { icon: Phone, label: "Signal Transceiver", value: PHONE_DISPLAY, href: `tel:+${PHONE_INTL}` },
  { icon: MapPin, label: "Current Sector", value: "Lagos, Nigeria", href: undefined },
];

/**
 * The closing scene. The shop gets its own unobstructed band first - it used
 * to sit behind the form under two full-width scrims, which is a large part of
 * why it read as faint - and the contact block follows beneath it.
 */
export const IchirakuFooter = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const currentYear = new Date().getFullYear();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Intel Transmitted",
        description: "Your message has been successfully delivered via messenger hawk.",
      });
    }, 1500);
  };

  return (
    <footer id="contact" className="relative overflow-hidden bg-background">
      {/* Scene band: the shop, clear and lit, with only a thin edge fade */}
      <div
        className="relative h-[68vh] min-h-[480px]"
        style={{ background: "radial-gradient(ellipse at 50% 70%, #3a1d0c 0%, #140b07 55%, hsl(var(--background)) 100%)" }}
      >
        <ViewportMount className="absolute inset-0">
          <ErrorBoundary fallback={null}>
            <Suspense fallback={null}>
              <RamenShop />
            </Suspense>
          </ErrorBoundary>
        </ViewportMount>

        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />

        <div className="pointer-events-none container relative z-10 mx-auto flex h-full items-end px-6 pb-10">
          <div className="flex w-full items-end justify-between gap-6">
            <div>
              <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.4em] text-[hsl(var(--sunset))]">
                Konoha · After the mission
              </p>
              <p className="font-display text-4xl text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] md:text-6xl">
                Ichiraku Ramen
              </p>
            </div>
            <span className="hidden font-japanese text-5xl text-[hsl(var(--sunset))] drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] sm:block">
              一楽
            </span>
          </div>
        </div>
      </div>

      <div className="container relative z-10 mx-auto px-6 py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: the invitation */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-block px-3 py-1 bg-primary/10 border border-primary/20 rounded-md mb-4">
                <span className="font-mono text-[10px] tracking-widest text-primary uppercase">
                  End of the Trail
                </span>
              </div>
              <h2 className="text-4xl md:text-6xl font-display tracking-wide mb-6">
                Meet Me At <br />
                <span className="gradient-text">Ichiraku</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-10 leading-relaxed max-w-md">
                Whether you have a high-stakes mission or just want to talk system architecture
                over a warm bowl of ramen, my transceiver is always open.
              </p>
            </motion.div>

            {/* WhatsApp first: it is the channel that reaches me fastest. */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-10"
            >
              <MagneticButton
                as="a"
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-5 bg-[#25D366] text-[#06241a] rounded-full font-bold text-sm tracking-widest uppercase flex items-center gap-3 shadow-lg shadow-[#25D366]/20"
              >
                <MessageCircle className="w-5 h-5" />
                Message me on WhatsApp
              </MagneticButton>
            </motion.div>

            <div className="space-y-4">
              {CONTACT_CHANNELS.map((channel, i) => {
                const inner = (
                  <>
                    <div className="p-3.5 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-300">
                      <channel.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1">
                        {channel.label}
                      </p>
                      <p className="font-medium text-white/90">{channel.value}</p>
                    </div>
                  </>
                );
                const className =
                  "flex items-center gap-5 p-5 rounded-2xl border border-white/[0.08] bg-card transition-all group";

                return (
                  <motion.div
                    key={channel.label}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * i }}
                  >
                    {channel.href ? (
                      <a href={channel.href} className={`${className} hover:border-primary/50`}>
                        {inner}
                      </a>
                    ) : (
                      <div className={className}>{inner}</div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right: the order slip */}
          <motion.div
            className="glass-card p-8 sm:p-10 relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >

            <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label
                      htmlFor="contact-name"
                      className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.2em]"
                    >
                      Designation
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      required
                      type="text"
                      placeholder="Your name"
                      className="w-full bg-background/40 border-b border-border py-2 focus:outline-none focus:border-primary transition-colors text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="contact-email"
                      className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.2em]"
                    >
                      Transceiver ID
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      required
                      type="email"
                      placeholder="Your email"
                      className="w-full bg-background/40 border-b border-border py-2 focus:outline-none focus:border-primary transition-colors text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="contact-subject"
                    className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.2em]"
                  >
                    Mission Type
                  </label>
                  <input
                    id="contact-subject"
                    name="subject"
                    required
                    type="text"
                    placeholder="Subject of transmission"
                    className="w-full bg-background/40 border-b border-border py-2 focus:outline-none focus:border-primary transition-colors text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="contact-message"
                    className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.2em]"
                  >
                    The Intel
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={4}
                    placeholder="State your business, shinobi..."
                    className="w-full bg-background/40 border border-border/20 p-4 rounded-xl focus:outline-none focus:border-primary/50 transition-colors text-sm resize-none"
                  />
                </div>
              </div>

              <MagneticButton type="submit" fullWidth className="w-full py-5 bg-primary text-primary-foreground rounded-xl font-bold text-xs tracking-widest uppercase hover:opacity-90 transition-opacity shadow-lg shadow-primary/20 flex items-center justify-center gap-3">
                {isSubmitting ? "TRANSMITTING..." : "SEND INTEL"} <Send className="w-4 h-4" />
              </MagneticButton>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Closing bar */}
      <div className="relative z-10 border-t border-white/[0.06] bg-[#08080c]">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <motion.a href="#home" className="font-mono text-xl font-bold" whileHover={{ scale: 1.05 }}>
              <span className="text-primary">M</span>
              <span className="text-foreground">.</span>
            </motion.a>

            <div className="text-center">
              <p className="text-sm text-muted-foreground font-mono flex items-center gap-1 justify-center">
                © {currentYear} Matthew. Built with{" "}
                <Heart className="w-4 h-4 text-destructive inline" /> and{" "}
                <span className="text-primary">AI</span>
              </p>
              <a
                href={`mailto:${EMAIL}`}
                className="text-sm text-muted-foreground hover:text-primary transition-colors font-mono"
              >
                {EMAIL}
              </a>
            </div>

            <div className="flex items-center gap-6">
              {[
                { href: "#skills", label: "Skills" },
                { href: "#projects", label: "Projects" },
                { href: WHATSAPP_URL, label: "WhatsApp", external: true },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors font-mono"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
