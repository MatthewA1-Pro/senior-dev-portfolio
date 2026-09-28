import { motion } from "framer-motion";
import { ScrollReveal } from "./ScrollReveal";
import { Terminal, Shield, Zap } from "lucide-react";
import geninManga from "@/assets/naruto/genin-manga.webp";
import ninjaWay from "@/assets/naruto/ninja-way.webp";

const STATS = [
  { value: "50+", label: "S-Rank Missions" },
  { value: "07", label: "Years of Journey" },
  { value: "12+", label: "Mastered Tools" },
  { value: "A++", label: "Skill Execution" },
];

/** A poster in the journey stack: crisp frame, caption strip, hover straightens it. */
const Poster = ({
  src,
  alt,
  caption,
  kanji,
  className,
  rotate,
  delay,
  captionTop = false,
}: {
  src: string;
  alt: string;
  caption: string;
  kanji: string;
  className: string;
  rotate: number;
  delay: number;
  captionTop?: boolean;
}) => (
  <motion.figure
    className={`absolute overflow-hidden rounded-2xl border border-white/10 bg-card shadow-[0_24px_60px_rgba(0,0,0,0.6)] ${className}`}
    initial={{ opacity: 0, y: 40, rotate: 0 }}
    whileInView={{ opacity: 1, y: 0, rotate }}
    whileHover={{ rotate: 0, scale: 1.03, zIndex: 30 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
  >
    <img src={src} alt={alt} className="block h-full w-full object-cover" loading="lazy" />
    <figcaption
      className={`absolute inset-x-0 flex items-center justify-between px-4 ${
        captionTop
          ? "top-0 bg-gradient-to-b from-black via-black/80 to-transparent pb-10 pt-3"
          : "bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent pb-3 pt-10"
      }`}
    >
      <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/85">{caption}</span>
      <span className="font-japanese text-lg text-primary">{kanji}</span>
    </figcaption>
  </motion.figure>
);

export const AboutSection = () => {
  return (
    <section id="about" className="relative overflow-hidden bg-background py-28 lg:py-36">
      <div className="container relative z-10 mx-auto px-6">
        <ScrollReveal className="mb-16 text-center lg:mb-24">
          <div className="mb-4 inline-block rounded-md border border-primary/30 bg-primary/10 px-3 py-1">
            <span className="font-mono text-[10px] uppercase tracking-widest text-primary">The Ninja Way</span>
          </div>
          <h2 className="mb-5 font-display text-4xl tracking-wide md:text-6xl">
            Forging My <span className="gradient-text">Destiny</span>
          </h2>
          <p className="font-mono text-sm tracking-wider text-muted-foreground">- that's my Ninja way</p>
        </ScrollReveal>

        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-12">
          {/* Genin -> Sage: the journey told in two frames */}
          <div className="relative mx-auto h-[520px] w-full max-w-[460px] sm:h-[600px] lg:col-span-5">
            <Poster
              src={geninManga}
              alt="Genin Naruto grinning up at the camera, surrounded by manga panels"
              caption="Genin · where it started"
              kanji="始"
              className="left-0 top-0 z-10 h-[78%] w-[66%]"
              rotate={-5}
              delay={0}
              captionTop
            />
            <Poster
              src={ninjaWay}
              alt="Sage Mode Naruto before a mountain under the words that's my Ninja way"
              caption="Sage · where it's going"
              kanji="道"
              className="bottom-0 right-0 z-20 h-[72%] w-[64%]"
              rotate={4}
              delay={0.15}
            />
          </div>

          <div className="space-y-10 lg:col-span-7">
            <ScrollReveal delay={0.1}>
              <h3 className="mb-4 flex items-center gap-3 text-2xl font-bold text-white">
                <Terminal className="h-5 w-5 text-primary" /> Master of the Arts
              </h3>
              <p className="leading-relaxed text-muted-foreground">
                Every line of code I write is a jutsu carefully calculated for maximum impact. With over 7
                years of deep immersion in the digital realm, I've developed a path that merges full-stack
                mastery with the raw energy of AI innovation.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <h3 className="mb-4 flex items-center gap-3 text-2xl font-bold text-white">
                <Shield className="h-5 w-5 text-primary" /> Unyielding Resolve
              </h3>
              <p className="leading-relaxed text-muted-foreground">
                The way of the developer is full of complex bugs and architectural challenges. My resolve is
                absolute: I never abandon a project, and I never sacrifice quality for speed.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.07] sm:grid-cols-4">
                {STATS.map((stat) => (
                  <div key={stat.label} className="bg-card px-5 py-6">
                    <p className="text-3xl font-bold text-primary">{stat.value}</p>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.4}>
              <div className="flex items-center gap-4 rounded-xl border border-primary/25 bg-primary/[0.07] p-5">
                <Zap className="h-6 w-6 shrink-0 text-primary" />
                <p className="font-mono text-xs italic leading-relaxed text-muted-foreground">
                  "A shinobi's true power is not in the spells they cast, but in the problems they solve for
                  others."
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
};
