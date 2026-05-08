import { motion } from "framer-motion";
import { ScrollReveal, ScrollScale } from "./ScrollReveal";
import { Terminal, Shield, Zap, Target } from "lucide-react";

export const AboutSection = () => {
  return (
    <section id="about" className="py-32 relative overflow-hidden bg-background">
      {/* Background Atmosphere - Parchment & Smoke */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.04]">
        <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')] bg-repeat" />
      </div>
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div 
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-primary/5 rounded-full blur-[150px]"
          animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <ScrollReveal className="text-center mb-20">
            <div className="inline-block px-3 py-1 bg-muted/50 border border-border rounded-md mb-4">
              <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                The Ninja Way
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-display tracking-wide mb-6">
              Forging My <span className="gradient-text">Destiny</span>
            </h2>
            <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-primary/50 to-transparent mx-auto" />
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            {/* Left Column: Narrative */}
            <div className="space-y-8">
              <ScrollReveal delay={0.2}>
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <Terminal className="w-5 h-5 text-primary" /> Master of the Arts
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Every line of code I write is a jutsu carefully calculated for maximum impact. With over 7 years of deep-immersion in the digital realm, I've developed a unique path that merges traditional full-stack mastery with the raw energy of AI innovation.
                </p>
              </ScrollReveal>

              <ScrollReveal delay={0.4}>
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <Shield className="w-5 h-5 text-primary" /> Unyielding Resolve
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  The way of the developer is often fraught with complex bugs and architectural challenges. My resolve is absolute: I never abandon a project, and I never sacrifice quality for speed. Every mission is executed with precision.
                </p>
              </ScrollReveal>
            </div>

            {/* Right Column: Skill Stats & Visual */}
            <div className="space-y-12">
              <ScrollScale>
                <div className="p-8 rounded-2xl bg-card/30 border border-border backdrop-blur-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                    <Target className="w-32 h-32 text-primary" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-8 relative z-10">
                    <div className="space-y-1">
                      <p className="text-4xl font-bold text-primary">50+</p>
                      <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">S-Rank Missions</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-4xl font-bold text-primary">07</p>
                      <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">Years of Journey</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-4xl font-bold text-primary">12+</p>
                      <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">Mastered Tools</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-4xl font-bold text-primary">A++</p>
                      <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">Skill Execution</p>
                    </div>
                  </div>
                </div>
              </ScrollScale>

              <ScrollReveal delay={0.6}>
                <div className="flex items-center gap-4 p-4 rounded-xl border border-primary/20 bg-primary/5">
                  <Zap className="w-6 h-6 text-primary animate-pulse" />
                  <p className="text-xs font-mono text-muted-foreground leading-relaxed italic">
                    "A shinobi's true power is not in the spells they cast, but in the problems they solve for others."
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
