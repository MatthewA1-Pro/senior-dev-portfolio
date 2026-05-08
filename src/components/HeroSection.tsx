import { motion } from "framer-motion";
import { ArrowRight, Github, Linkedin, Mail } from "lucide-react";
import { HeroNaruto } from "./three/NarutoModels";
import { MagneticButton } from "./ScrollReveal";

interface HeroSectionProps {
  isIntroComplete: boolean;
}

export const HeroSection = ({ isIntroComplete }: HeroSectionProps) => {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-background">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 grid-bg opacity-5" />
        <div className="absolute top-0 right-0 w-[50%] h-full bg-gradient-to-l from-primary/5 to-transparent" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side: Content */}
          <motion.div
            className="z-20"
            initial={{ opacity: 0, x: -50 }}
            animate={isIntroComplete ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-8">
              <span className="text-[10px] font-mono tracking-widest text-primary uppercase">
                Sage Level Developer
              </span>
            </div>
            
            <h1 className="text-7xl md:text-9xl font-display tracking-tight mb-8 leading-[0.9]">
              <span className="text-white opacity-90">MATTHEW</span>
              <br />
              <span className="gradient-text">ADEDIGBA</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-lg mb-12 leading-relaxed">
              Forging high-performance digital architectures with the precision of a master shinobi. Expert in Full-Stack Mastery and AI Innovation.
            </p>
            
            <div className="flex flex-wrap gap-6 items-center">
              <MagneticButton
                as="a"
                href="#projects"
                className="px-10 py-5 bg-primary text-primary-foreground rounded-full font-bold text-sm tracking-widest uppercase hover:scale-105 transition-transform flex items-center gap-3"
              >
                S-Rank Missions <ArrowRight className="w-4 h-4" />
              </MagneticButton>
              
              <div className="flex items-center gap-6 ml-4">
                {[
                  { icon: Github, href: "https://github.com/MatthewA1-Pro" },
                  { icon: Linkedin, href: "https://linkedin.com" },
                  { icon: Mail, href: "mailto:oderinwalematthew3@gmail.com" }
                ].map((social, i) => (
                  <motion.a
                    key={i}
                    href={social.href}
                    target="_blank"
                    className="text-muted-foreground hover:text-primary transition-colors"
                    whileHover={{ y: -5, scale: 1.1 }}
                  >
                    <social.icon className="w-6 h-6" />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
          
          {/* Right Side: 3D Sage Centerpiece */}
          <motion.div 
            className="relative h-[70vh] lg:h-[90vh] z-10 cursor-grab active:cursor-grabbing"
            initial={{ opacity: 0, scale: 0.9, x: 100 }}
            animate={isIntroComplete ? { opacity: 1, scale: 1, x: 0 } : {}}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.8 }}
          >
            <HeroNaruto />
            {/* Subtle Aura Glow behind model */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-primary/10 rounded-full blur-[100px] -z-1 pointer-events-none" />
          </motion.div>
          
        </div>
      </div>
      
      {/* Scroll indicator - Cinematic Style */}
      <motion.div 
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
        initial={{ opacity: 0 }}
        animate={isIntroComplete ? { opacity: 1 } : {}}
        transition={{ delay: 2 }}
      >
        <span className="text-[10px] font-mono text-muted-foreground tracking-[0.6em] uppercase">Scroll to descend</span>
        <div className="w-[1px] h-16 bg-gradient-to-b from-primary/50 to-transparent" />
      </motion.div>
    </section>
  );
};
