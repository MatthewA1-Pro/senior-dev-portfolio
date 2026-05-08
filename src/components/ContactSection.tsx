import { motion } from "framer-motion";
import { Mail, MessageSquare, Send, Phone } from "lucide-react";
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
        title: "Message Sent",
        description: "Your message has been successfully transmitted via messenger hawk.",
      });
    }, 1500);
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-background">
      {/* Background: Ichiraku Ramen Shop Experience */}
      <div className="absolute inset-0 z-0">
        <RamenShop />
        {/* Dark overlay for form readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent z-1" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side: Text & Invite */}
          <div>
            <motion.p 
              className="font-mono text-primary mb-2 text-sm tracking-widest uppercase"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              {"// End of the Trail"}
            </motion.p>
            <motion.h2 
              className="text-4xl md:text-6xl font-display tracking-wide mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Meet Me At <br />
              <span className="gradient-text">Ichiraku</span>
            </motion.h2>
            <motion.p 
              className="text-muted-foreground text-lg mb-10 leading-relaxed max-w-md"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Whether you have a mission for me or just want to discuss the latest tech over a bowl of ramen, my door is always open.
            </motion.p>

            <div className="space-y-6">
              {[
                { icon: Mail, label: "Messenger Hawk", value: "oderinwalematthew3@gmail.com", href: "mailto:oderinwalematthew3@gmail.com" },
                { icon: Phone, label: "Signal Transceiver", value: "+234 913 950 8184", href: "tel:+2349139508184" },
                { icon: MessageSquare, label: "Direct Transmission", value: "WhatsApp Matthew", href: "https://wa.me/2349139508184" }
              ].map((contact, i) => (
                <motion.a
                  key={i}
                  href={contact.href}
                  className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card/30 backdrop-blur-sm hover:border-primary/50 transition-all group"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * i }}
                >
                  <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                    <contact.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">{contact.label}</p>
                    <p className="font-medium">{contact.value}</p>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Right Side: Contact Form */}
          <motion.div
            className="glass-card p-8 sm:p-10 relative"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Form steam effect animation */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-40 bg-primary/5 rounded-full blur-3xl animate-pulse" />
            
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Name</label>
                  <input 
                    required
                    type="text" 
                    placeholder="Enter your name"
                    className="w-full bg-background/50 border border-border p-3 rounded-lg focus:outline-none focus:border-primary transition-colors text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Email</label>
                  <input 
                    required
                    type="email" 
                    placeholder="Enter your email"
                    className="w-full bg-background/50 border border-border p-3 rounded-lg focus:outline-none focus:border-primary transition-colors text-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Subject</label>
                <input 
                  required
                  type="text" 
                  placeholder="The mission details"
                  className="w-full bg-background/50 border border-border p-3 rounded-lg focus:outline-none focus:border-primary transition-colors text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Message</label>
                <textarea 
                  required
                  rows={4}
                  placeholder="Speak your mind, shinobi..."
                  className="w-full bg-background/50 border border-border p-3 rounded-lg focus:outline-none focus:border-primary transition-colors text-sm resize-none"
                />
              </div>
              
              <MagneticButton
                className="w-full py-4 bg-primary text-primary-foreground rounded-lg font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                {isSubmitting ? "Transmitting..." : "Send Intel"} <Send className="w-4 h-4" />
              </MagneticButton>
            </form>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
};
