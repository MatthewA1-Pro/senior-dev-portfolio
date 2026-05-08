import { motion } from "framer-motion";
import { ScrollReveal, Parallax } from "./ScrollReveal";
import { ScrollScale } from "./ScrollReveal";

export const AboutSection = () => {
  return (
    <section id="about" className="py-24 relative overflow-hidden bg-background">
      {/* Background Atmosphere: Parchment Texture Look */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')] bg-repeat" />
      
      {/* Soft Smoke Transitions */}
      <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-background to-transparent z-1" />
      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-background to-transparent z-1" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal className="text-center mb-16">
            <p className="font-mono text-primary mb-2 text-sm tracking-widest uppercase">
              {"// The Ninja Way"}
            </p>
            <h2 className="text-4xl md:text-6xl font-display tracking-wide mb-8">
              Forging My <span className="gradient-text">Destiny</span>
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <ScrollScale>
              <div className="relative aspect-square rounded-2xl overflow-hidden border border-primary/20 glass-card p-2 group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent z-1" />
                <div className="w-full h-full rounded-xl overflow-hidden relative">
                   {/* Placeholder for professional/anime-styled photo */}
                  <div className="absolute inset-0 flex items-center justify-center bg-muted/20">
                    <span className="font-mono text-xs text-muted-foreground">SHINOBI_DATA.IMG</span>
                  </div>
                </div>
                {/* Subtle animated symbols in corners */}
                <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-primary/40" />
                <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-primary/40" />
              </div>
            </ScrollScale>

            <div className="space-y-6">
              <ScrollReveal delay={0.2}>
                <h3 className="text-2xl font-bold text-white mb-4">Mastering the Arts</h3>
                <p className="text-muted-foreground leading-relaxed">
                  With over 7 years of journeying through the digital landscape, I have mastered the secret techniques of full-stack development. My path is one of continuous evolution, combining ancient coding wisdom with the cutting-edge power of AI.
                </p>
              </ScrollReveal>
              
              <ScrollReveal delay={0.4}>
                <h3 className="text-2xl font-bold text-white mb-4">Unyielding Resolve</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Like a shinobi on a mission, I approach every project with unyielding focus and precision. Whether it's architecting complex systems or fine-tuning the smallest interaction, I never back down from a challenge.
                </p>
              </ScrollReveal>

              <ScrollReveal delay={0.6}>
                <div className="flex gap-6 pt-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-primary">50+</p>
                    <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Missions Done</p>
                  </div>
                  <div className="w-[1px] h-12 bg-border" />
                  <div className="text-center">
                    <p className="text-3xl font-bold text-primary">7+</p>
                    <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Years Experience</p>
                  </div>
                  <div className="w-[1px] h-12 bg-border" />
                  <div className="text-center">
                    <p className="text-3xl font-bold text-primary">A++</p>
                    <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Skill Rank</p>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
