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
      {/* Grid background */}
      <div className="absolute inset-0 grid-bg opacity-30" />
      
      {/* 3D Globe */}
      <Globe3D />
      
      {/* Content */}
      <div className="relative z-10 text-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Decorative bracket */}
          <motion.p
            className="font-mono text-primary mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {"<developer>"}
          </motion.p>

          {/* Name */}
          <motion.h1
            className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <span className="gradient-text animate-gradient">MATTHEW</span>
          </motion.h1>

          {/* Title */}
          <motion.p
            className="text-xl md:text-2xl text-muted-foreground mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Senior Full-Stack Developer
          </motion.p>

          <motion.p
            className="text-lg text-primary font-mono"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Custom Code • AI Innovation • Prompt Engineering
          </motion.p>

          {/* Closing bracket */}
          <motion.p
            className="font-mono text-primary mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            {"</developer>"}
          </motion.p>

          {/* Social Links */}
          <motion.div
            className="flex items-center justify-center gap-6 mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <button
              onClick={openWhatsApp}
              className="p-3 rounded-full glass-card hover:neon-border transition-all duration-300 group"
            >
              <MessageCircle className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
            </button>
            <a
              href={`mailto:${EMAIL}`}
              className="p-3 rounded-full glass-card hover:neon-border transition-all duration-300 group"
            >
              <Mail className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ delay: 1, duration: 2, repeat: Infinity }}
      >
        <a href="#skills" className="flex flex-col items-center text-muted-foreground hover:text-primary transition-colors">
          <span className="font-mono text-sm mb-2">Scroll</span>
          <ChevronDown className="w-5 h-5" />
        </a>
      </motion.div>
    </section>
  );
};
