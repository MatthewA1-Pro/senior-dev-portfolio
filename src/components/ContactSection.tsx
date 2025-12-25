import { motion } from "framer-motion";
import { useState } from "react";
import { Send, Mail, MapPin, MessageCircle } from "lucide-react";
import { toast } from "sonner";

const WHATSAPP_NUMBER = "+2349138508184";
const EMAIL = "base44.dev@gmail.com";

export const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success("Message sent! I'll get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
    setIsSubmitting(false);
  };

  const openWhatsApp = () => {
    const message = encodeURIComponent("Hi Matthew! I'd like to discuss a project with you.");
    window.open(`https://wa.me/${WHATSAPP_NUMBER.replace(/\+/g, '')}?text=${message}`, '_blank');
  };

  const socialLinks = [
    { icon: <Mail className="w-5 h-5" />, href: `mailto:${EMAIL}`, label: "Email" },
    { icon: <MessageCircle className="w-5 h-5" />, onClick: openWhatsApp, label: "WhatsApp" },
  ];

  const contactInfo = [
    { icon: <Mail className="w-5 h-5" />, label: EMAIL },
    { icon: <MessageCircle className="w-5 h-5" />, label: WHATSAPP_NUMBER },
    { icon: <MapPin className="w-5 h-5" />, label: "Available Worldwide" },
  ];

  return (
    <section id="contact" className="py-32 relative">
      {/* Background effects */}
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="font-mono text-primary mb-2">{"// Get In Touch"}</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Let's Connect</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Have a project in mind? Looking for a senior developer or AI consultant? 
            Let's discuss how we can work together.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block font-mono text-sm text-muted-foreground mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-mono"
                  placeholder="Your name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block font-mono text-sm text-muted-foreground mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-mono"
                  placeholder="your@email.com"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block font-mono text-sm text-muted-foreground mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-mono resize-none"
                  placeholder="Tell me about your project..."
                />
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-4 rounded-lg bg-gradient-to-r from-primary to-secondary text-primary-foreground font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? (
                  "Sending..."
                ) : (
                  <>
                    Send Message
                    <Send className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            className="flex flex-col justify-center"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <div className="glass-card p-8">
              <h3 className="text-xl font-bold mb-6">Contact Info</h3>
              
              <div className="space-y-4 mb-8">
                {contactInfo.map((item) => (
                  <div key={item.label} className="flex items-center gap-4 text-muted-foreground">
                    <div className="p-2 rounded-lg bg-muted">
                      {item.icon}
                    </div>
                    <span className="font-mono text-sm">{item.label}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-6">
                <h4 className="font-mono text-sm text-muted-foreground mb-4">Connect With Me</h4>
                <div className="flex gap-4">
                  {socialLinks.map((link) => (
                    link.onClick ? (
                      <button
                        key={link.label}
                        onClick={link.onClick}
                        className="p-3 rounded-lg glass-card hover:neon-border transition-all duration-300 group"
                      >
                        <span className="text-muted-foreground group-hover:text-primary transition-colors">
                          {link.icon}
                        </span>
                      </button>
                    ) : (
                      <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-lg glass-card hover:neon-border transition-all duration-300 group"
                      >
                        <span className="text-muted-foreground group-hover:text-primary transition-colors">
                          {link.icon}
                        </span>
                      </a>
                    )
                  ))}
                </div>
              </div>

              {/* Availability Status */}
              <div className="mt-8 p-4 rounded-lg bg-neon-green/10 border border-neon-green/30">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-neon-green animate-glow-pulse" />
                  <span className="font-mono text-sm text-foreground">
                    Currently available for new projects
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
