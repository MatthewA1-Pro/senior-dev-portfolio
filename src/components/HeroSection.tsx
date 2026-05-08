import { motion } from "framer-motion";
import { ArrowRight, Github, Linkedin, Mail } from "lucide-react";
import { HeroNaruto } from "./three/NarutoModels";
import { MagneticButton } from "./ScrollReveal";

interface HeroSectionProps {
  isIntroComplete: boolean;
}

export const HeroSection = ({ isIntroComplete }: HeroSectionProps) => {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 z-0 bg-background" />
      <div className="absolute inset-0 grid-bg opacity-10" />
      
      {/* Background Glows - Substantially Reduced Clutter */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side: Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isIntroComplete ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
          >
            <div className="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <span className="text-[10px] font-mono tracking-widest text-primary uppercase">
                The Sage of Modern Code
              </span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-display tracking-wider mb-6 leading-none">
              <span className="text-white">MATTHEW</span>
              <br />
              <span className="gradient-text">ADEDIGBA</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-lg mb-10 leading-relaxed">
              Senior Full-Stack Developer specializing in high-performance digital experiences, AI innovation, and complex system architecture.
            </p>
            
            <div className="flex flex-wrap gap-4 items-center">
              <MagneticButton
                as="a"
                href="#projects"
                className="px-8 py-4 bg-primary text-primary-foreground rounded-full font-medium flex items-center gap-2 hover:opacity-90 transition-opacity"
              >
                View S-Rank Missions <ArrowRight className="w-4 h-4" />
              </MagneticButton>
              
              <div className="flex items-center gap-4 ml-2">
                {[
                  { icon: Github, href: "https://github.com/MatthewA1-Pro" },
                  { icon: Linkedin, href: "https://linkedin.com" },
                  { icon: Mail, href: "mailto:oderinwalematthew3@gmail.com" }
                ].map((social, i) => (
                  <motion.a
                    key={i}
                    href={social.href}
                    target="_blank"
                    className="p-3 rounded-full border border-border hover:border-primary/50 hover:text-primary transition-all"
                    whileHover={{ y: -3 }}
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
          
          {/* Right Side: 3D Sage Centerpiece */}
          <motion.div 
            className="relative h-[60vh] lg:h-[80vh] z-0"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isIntroComplete ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1.5, ease: "easeOut", delay: 1 }}
          >
            <HeroNaruto />
          </motion.div>
          
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={isIntroComplete ? { opacity: 1 } : {}}
        transition={{ delay: 2.5 }}
      >
        <span className="text-[10px] font-mono text-muted-foreground tracking-[0.3em] uppercase">Scroll to explore</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-primary to-transparent" />
      </motion.div>
    </section>
  );
};
