import { motion } from "framer-motion";
import { Globe3D } from "./Globe3D";
import { ChevronDown, Mail, MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "+2349138508184";
const EMAIL = "base44.dev1@gmail.com";

export const HeroSection = () => {
  const openWhatsApp = () => {
    const message = encodeURIComponent("Hi Matthew! I'd like to discuss a project with you.");
    window.open(`https://wa.me/${WHATSAPP_NUMBER.replace(/\+/g, '')}?text=${message}`, '_blank');
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Naruto swirl background */}
      <div className="absolute inset-0 grid-bg opacity-50" />
      
      {/* 3D Globe - pushed back with lower z-index and reduced opacity */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Globe3D />
      </div>
      
      {/* Dark gradient overlay for text contrast */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-background/60 via-transparent to-background/80 pointer-events-none" />
      
      {/* Content - higher z-index for visibility */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto pt-16 sm:pt-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          {/* Naruto-style decorative element */}
          <motion.div
            className="mb-4 sm:mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <span className="text-primary/80 text-xs sm:text-sm tracking-[0.3em] uppercase">
              忍者の道 — Way of the Shinobi
            </span>
          </motion.div>

          {/* Name - clean styling without excess glow */}
          <motion.h1
            className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-display tracking-wider mb-6 sm:mb-8 leading-none"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <span className="gradient-text animate-gradient">MATTHEW</span>
          </motion.h1>

          {/* Title - with background for visibility */}
          <motion.p
            className="text-base sm:text-lg md:text-xl text-foreground font-medium mb-2 sm:mb-3 tracking-wide px-4 py-2 bg-background/70 backdrop-blur-sm rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            Senior Full-Stack Developer
          </motion.p>

          <motion.p
            className="text-sm sm:text-base md:text-lg text-primary/90 tracking-wider px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            Custom Code • AI Innovation • Prompt Engineering
          </motion.p>

          {/* Naruto-style bottom element */}
          <motion.div
            className="mt-4 sm:mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <span className="text-secondary/60 text-xs tracking-[0.2em]">
              ⚡ 術を極める — Mastering the Art ⚡
            </span>
          </motion.div>

          {/* Social Links */}
          <motion.div
            className="flex items-center justify-center gap-4 sm:gap-6 mt-8 sm:mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            <button
              onClick={openWhatsApp}
              className="p-2.5 sm:p-3 rounded-full glass-card hover:neon-border transition-all duration-300 group"
            >
              <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground group-hover:text-primary transition-colors" />
            </button>
            <a
              href={`mailto:${EMAIL}`}
              className="p-2.5 sm:p-3 rounded-full glass-card hover:neon-border transition-all duration-300 group"
            >
              <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground group-hover:text-primary transition-colors" />
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ delay: 1.2, duration: 2.5, repeat: Infinity }}
      >
        <a href="#skills" className="flex flex-col items-center text-muted-foreground hover:text-primary transition-colors">
          <span className="font-mono text-xs sm:text-sm mb-2">Scroll</span>
          <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
        </a>
      </motion.div>
    </section>
  );
};
