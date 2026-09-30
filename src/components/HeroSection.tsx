import { motion } from "framer-motion";
import { ArrowRight, Github, Linkedin, Mail } from "lucide-react";
import { lazy, Suspense } from "react";
import ErrorBoundary from "./ErrorBoundary";

// Dynamic so the three.js scenes form their own chunk. It loads behind the
// opening sequence, so it is always warm by the time the hero is revealed.
const HeroNaruto = lazy(() =>
  import("./three/NarutoModels").then((m) => ({ default: m.HeroNaruto })),
);
import { MagneticButton } from "./ScrollReveal";

/** Archimedean spiral - the Uzumaki swirl - as an SVG path. */
const HERO_SPIRAL = (() => {
  const turns = 4;
  const steps = turns * 72;
  const pts: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const a = t * turns * Math.PI * 2;
    const r = 3 + 52 * t;
    pts.push(`${(60 + Math.cos(a) * r).toFixed(2)},${(60 + Math.sin(a) * r).toFixed(2)}`);
  }
  return `M${pts.join(" L")}`;
})();

interface HeroSectionProps {
  isIntroComplete: boolean;
}

export const HeroSection = ({ isIntroComplete }: HeroSectionProps) => {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-background">
      {/* Crisp Uzumaki line-art behind the Sage. Stroke, not blur: the old
          blurred glow blobs were what made the page look hazy. */}
      <svg
        aria-hidden
        viewBox="0 0 120 120"
        className="pointer-events-none absolute right-[-6%] top-1/2 hidden h-[115vh] -translate-y-1/2 lg:block"
      >
        <path d={HERO_SPIRAL} fill="none" stroke="hsl(var(--primary))" strokeOpacity={0.14} strokeWidth={0.5} />
        <circle cx="60" cy="60" r="57" fill="none" stroke="hsl(var(--primary))" strokeOpacity={0.1} strokeWidth={0.3} />
      </svg>

      {/* Impact shake as the rasengan burst clears */}
      <motion.div
        className="container mx-auto px-6 relative z-10"
        animate={
          isIntroComplete
            ? { x: [0, -14, 11, -7, 4, 0], y: [0, 7, -6, 3, -1, 0] }
            : {}
        }
        transition={{ duration: 0.55, ease: "easeOut" }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-12 items-center">
          
          {/* Phone-only title, so the name leads and the Sage sits under it */}
          <motion.div
            className="order-1 lg:hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={isIntroComplete ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-5">
              <span className="text-[10px] font-mono tracking-widest text-primary uppercase">
                Sage Level Developer
              </span>
            </div>
            <p className="text-[4.2rem] leading-[0.9] font-display tracking-tight" aria-hidden>
              <span className="gradient-text">MATTHEW</span>
            </p>
          </motion.div>

          {/* Left Side: Content (desktop), copy and actions (phones) */}
          <motion.div
            className="z-20 order-3 lg:order-1"
            initial={{ opacity: 0, x: -50 }}
            animate={isIntroComplete ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="hidden lg:inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-8">
              <span className="text-[10px] font-mono tracking-widest text-primary uppercase">
                Sage Level Developer
              </span>
            </div>

            {/* The one real h1. On phones it is visually hidden (the title block
                above shows the name) but stays available to screen readers. */}
            <h1 className="sr-only lg:not-sr-only lg:block text-[8.5rem] xl:text-[10rem] font-display tracking-tight mb-8 leading-[0.85]">
              <span className="gradient-text">MATTHEW</span>
            </h1>

            <p className="text-lg lg:text-xl text-muted-foreground max-w-lg mb-8 lg:mb-12 leading-relaxed">
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
            className="relative order-2 h-[46vh] sm:h-[55vh] lg:h-[86vh] z-10 cursor-grab active:cursor-grabbing"
            initial={{ opacity: 0, scale: 0.82 }}
            animate={isIntroComplete ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.12 }}
          >
            <ErrorBoundary fallback={null}>
              <Suspense fallback={null}>
                <HeroNaruto active={isIntroComplete} />
              </Suspense>
            </ErrorBoundary>
          </motion.div>
          
        </div>
      </motion.div>

      {/* Scroll indicator - Cinematic Style */}
      <motion.div 
        className="absolute bottom-12 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-4"
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
