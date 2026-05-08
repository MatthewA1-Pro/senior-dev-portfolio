import { motion } from "framer-motion";
import { Mail, MessageSquare, Send, Phone, MapPin } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { RamenShop } from "./three/NarutoModels";
import { MagneticButton } from "./ScrollReveal";

export const ContactSection = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

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
    <section id="contact" className="py-24 relative overflow-hidden bg-background">
      {/* Background: Immersive Ichiraku Experience */}
      <div className="absolute inset-0 z-0">
        <RamenShop />
        {/* Dark vignette to focus on form */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/20 to-transparent z-1" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side: Cinematic Narrative */}
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
              <p className="text-muted-foreground text-lg mb-12 leading-relaxed max-w-md">
                Whether you have a high-stakes mission or just want to discuss system architecture over a warm bowl of ramen, my transceiver is always open.
              </p>
            </motion.div>

            <div className="space-y-6">
              {[
                { icon: Mail, label: "Messenger Hawk", value: "oderinwalematthew3@gmail.com", href: "mailto:oderinwalematthew3@gmail.com" },
                { icon: Phone, label: "Signal Transceiver", value: "+234 913 950 8184", href: "tel:+2349139508184" },
                { icon: MapPin, label: "Current Sector", value: "Lagos, Nigeria", href: "#" }
              ].map((contact, i) => (
                <motion.a
                  key={i}
                  href={contact.href}
                  className="flex items-center gap-5 p-5 rounded-2xl border border-border bg-card/20 backdrop-blur-md hover:border-primary/50 transition-all group"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * i }}
                >
                  <div className="p-3.5 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-300">
                    <contact.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1">{contact.label}</p>
                    <p className="font-medium text-white/90">{contact.value}</p>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Right Side: Ninja-Tech Contact Panel */}
          <motion.div
            className="glass-card p-10 relative overflow-hidden group"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Ambient Steam Animation overlay */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-[100px] animate-pulse pointer-events-none" />
            
            <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.2em]">Designation</label>
                    <input 
                      required
                      type="text" 
                      placeholder="Your name"
                      className="w-full bg-background/40 border-b border-border py-2 focus:outline-none focus:border-primary transition-colors text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.2em]">Transceiver ID</label>
                    <input 
                      required
                      type="email" 
                      placeholder="Your email"
                      className="w-full bg-background/40 border-b border-border py-2 focus:outline-none focus:border-primary transition-colors text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.2em]">Mission Type</label>
                  <input 
                    required
                    type="text" 
                    placeholder="Subject of transmission"
                    className="w-full bg-background/40 border-b border-border py-2 focus:outline-none focus:border-primary transition-colors text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.2em]">The Intel</label>
                  <textarea 
                    required
                    rows={4}
                    placeholder="State your business, shinobi..."
                    className="w-full bg-background/40 border border-border/20 p-4 rounded-xl focus:outline-none focus:border-primary/50 transition-colors text-sm resize-none"
                  />
                </div>
              </div>
              
              <MagneticButton
                className="w-full py-5 bg-primary text-primary-foreground rounded-xl font-bold text-xs tracking-widest uppercase hover:opacity-90 transition-opacity shadow-lg shadow-primary/20 flex items-center justify-center gap-3"
              >
                {isSubmitting ? "TRANSMITTING..." : "SEND INTEL"} <Send className="w-4 h-4" />
              </MagneticButton>
            </form>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
};
