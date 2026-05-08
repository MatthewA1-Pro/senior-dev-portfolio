import { motion, AnimatePresence } from "framer-motion";
import { HeroNaruto } from "./three/NarutoModels";
import { ChevronDown, Mail, MessageCircle, Send, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { MagneticButton } from "./ScrollReveal";

const WHATSAPP_NUMBER = "+44 7352 966432";
const EMAIL = "base44.dev1@gmail.com";

interface HeroSectionProps {
  isIntroComplete?: boolean;
}

export const HeroSection = ({ isIntroComplete = false }: HeroSectionProps) => {
  const [showContactModal, setShowContactModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openWhatsApp = () => {
    const message = encodeURIComponent("Hi Matthew! I'd like to discuss a project with you.");
    window.open(`https://wa.me/${WHATSAPP_NUMBER.replace(/\+/g, '')}?text=${message}`, '_blank');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: {
          name: formData.name,
          email: formData.email,
          message: formData.message,
        },
      });

      if (error) throw error;

      toast.success("Message sent! I'll get back to you soon.");
      setFormData({ name: "", email: "", message: "" });
      setShowContactModal(false);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error("Failed to send message. Please try WhatsApp or email directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Naruto swirl background */}
      <div className="absolute inset-0 grid-bg opacity-30" />
      
      {/* New Hero Naruto Centerpiece */}
      <motion.div 
        className="absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2.5, ease: "easeOut", delay: 1 }}
      >
        <HeroNaruto />
      </motion.div>
      
      {/* Cinematic letterbox bars - fade out after intro */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-16 bg-black z-20"
        initial={{ height: "15vh" }}
        animate={{ height: isIntroComplete ? 0 : "8vh" }}
        transition={{ duration: 1.5, ease: [0.25, 0.4, 0.25, 1], delay: isIntroComplete ? 0 : 0 }}
      />
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-16 bg-black z-20"
        initial={{ height: "15vh" }}
        animate={{ height: isIntroComplete ? 0 : "8vh" }}
        transition={{ duration: 1.5, ease: [0.25, 0.4, 0.25, 1], delay: isIntroComplete ? 0 : 0 }}
      />
      
      {/* Dark gradient overlay for text contrast */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-background/60 via-transparent to-background/80 pointer-events-none" />
      
      {/* Content - higher z-index for visibility */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto pt-16 sm:pt-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.8 }}
          className="flex flex-col items-center"
        >
          {/* Anime-style decorative element */}
          <motion.div
            className="mb-6 sm:mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 1 }}
          >
            <span className="text-accent text-sm sm:text-base md:text-lg tracking-[0.2em] font-japanese">
              運命を切り開く — Forging My Destiny
            </span>
          </motion.div>

          {/* Name - elegant anime typography with cinematic reveal */}
          <motion.h1
            className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-display tracking-wider mb-8 sm:mb-10 leading-none"
            initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 1.8, duration: 1.2, ease: [0.25, 0.4, 0.25, 1] }}
          >
            <span className="gradient-text animate-gradient">MATTHEW</span>
          </motion.h1>

          {/* Title - with anime-styled border */}
          <motion.p
            className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-foreground font-semibold mb-3 sm:mb-4 tracking-wide px-6 py-3 glass-card"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2.2, duration: 0.8 }}
          >
            Senior Full-Stack Developer
          </motion.p>

          <motion.p
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-secondary tracking-wider px-4 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5, duration: 0.8 }}
          >
            Custom Code • AI Innovation • Prompt Engineering
          </motion.p>

          {/* Anime-style bottom element */}
          <motion.div
            className="mt-6 sm:mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.8, duration: 0.8 }}
          >
            <span className="text-accent/80 text-sm sm:text-base tracking-[0.15em] font-japanese">
              ✦ 伝説になる ✦ Becoming Legend
            </span>
          </motion.div>

          {/* Social Links */}
          <motion.div
            className="flex items-center justify-center gap-4 sm:gap-6 mt-8 sm:mt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.2, duration: 0.8 }}
          >
            <MagneticButton
              as="button"
              onClick={openWhatsApp}
              className="p-2.5 sm:p-3 rounded-full glass-card hover:anime-border transition-all duration-300 group"
              strength={0.5}
            >
              <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground group-hover:text-primary transition-colors" />
            </MagneticButton>
            <MagneticButton
              as="button"
              onClick={() => setShowContactModal(true)}
              className="p-2.5 sm:p-3 rounded-full glass-card hover:anime-border transition-all duration-300 group"
              strength={0.5}
            >
              <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground group-hover:text-primary transition-colors" />
            </MagneticButton>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator - only show after intro */}
      {isIntroComplete && (
        <motion.div
          className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ delay: 0.5, duration: 2.5, repeat: Infinity }}
        >
          <a href="#skills" className="flex flex-col items-center text-muted-foreground hover:text-primary transition-colors">
            <span className="font-mono text-xs sm:text-sm mb-2">Scroll</span>
            <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
          </a>
        </motion.div>
      )}

      {/* Contact Modal */}
      <AnimatePresence>
        {showContactModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setShowContactModal(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            
            {/* Modal */}
            <motion.div
              className="relative w-full max-w-md glass-card p-6 sm:p-8"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
            >
              {/* Close button */}
              <button
                onClick={() => setShowContactModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
              
              <h3 className="text-xl sm:text-2xl font-display mb-6 gradient-text">Get In Touch</h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="hero-name" className="block font-mono text-sm text-muted-foreground mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="hero-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-mono text-sm"
                    placeholder="Your name"
                  />
                </div>
                
                <div>
                  <label htmlFor="hero-email" className="block font-mono text-sm text-muted-foreground mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="hero-email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-mono text-sm"
                    placeholder="your@email.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="hero-message" className="block font-mono text-sm text-muted-foreground mb-2">
                    Message
                  </label>
                  <textarea
                    id="hero-message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-mono text-sm resize-none"
                    placeholder="Tell me about your project..."
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-primary to-secondary text-primary-foreground font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
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
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
