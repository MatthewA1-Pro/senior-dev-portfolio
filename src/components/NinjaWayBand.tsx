import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import konohaDusk from "@/assets/naruto/konoha-dusk.webp";

const LINES = [
  { text: "I won't run away anymore.", accent: "run away" },
  { text: "I won't go back on my word.", accent: "my word" },
  { text: "That is my Ninja Way.", accent: "Ninja Way" },
];

/** Renders a line with its key phrase picked out in the dusk gradient. */
const Line = ({ text, accent }: { text: string; accent: string }) => {
  const [before, after] = text.split(accent);
  return (
    <>
      {before}
      <span className="bg-gradient-to-r from-[hsl(var(--sunset))] to-[hsl(var(--kurama))] bg-clip-text text-transparent">
        {accent}
      </span>
      {after}
    </>
  );
};

/**
 * Konoha at dusk under Naruto's creed. The image is the village-and-Hokage-rock
 * half of the reference poster; the quote that was baked into its upper half is
 * set here in the site's own type instead, so it stays sharp at any width.
 */
export const NinjaWayBand = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.18, 1.02]);
  const imageY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  return (
    <section ref={ref} className="relative py-10 lg:py-24 bg-background" aria-label="The Ninja Way">
      <div className="container mx-auto px-6">
        <div className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-[#07070b] lg:min-h-[640px]">
          <div className="relative h-56 overflow-hidden sm:h-72 lg:absolute lg:inset-0 lg:h-auto">
          <motion.img
            src={konohaDusk}
            alt="Konoha village and the Hokage rock at dusk, Naruto looking out over it"
            className="absolute inset-0 h-full w-full object-cover object-bottom"
            style={{ scale: imageScale, y: imageY }}
            loading="lazy"
          />
          {/* Phones: the strip fades into the quote panel below it */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#07070b] via-transparent to-transparent lg:hidden" />
          </div>

          {/* Legibility on desktop: a hard ink fade on the left, not a blur over the art */}
          <div className="absolute inset-0 hidden bg-gradient-to-r from-[#07070b]/95 via-[#07070b]/55 via-45% to-transparent to-75% lg:block" />
          <div className="absolute inset-0 hidden bg-gradient-to-t from-[#07070b]/70 via-transparent to-transparent lg:block" />
          {/* Manga screentone keeps the upscaled art from reading soft */}
          <div className="absolute inset-0 screentone opacity-60 mix-blend-overlay" />

          <div className="relative z-10 flex h-full flex-col justify-center px-6 pb-12 pt-2 sm:px-14 lg:min-h-[640px] lg:w-[70%] lg:py-16">
            <motion.p
              className="mb-6 font-mono text-[10px] uppercase tracking-[0.3em] text-[hsl(var(--sunset))] sm:mb-8 sm:text-xs sm:tracking-[0.45em]"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
            >
              <span className="font-japanese mr-3 text-base tracking-[0.3em]">火の意志</span>
              The Will of Fire
            </motion.p>

            <blockquote className="font-display text-4xl leading-[1.12] tracking-wide text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] text-[2rem] sm:text-5xl lg:text-[3.3rem]">
              {LINES.map((line, i) => (
                <motion.span
                  key={line.text}
                  className="block lg:whitespace-nowrap"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ delay: 0.15 + i * 0.22, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Line {...line} />
                </motion.span>
              ))}
            </blockquote>

            <motion.div
              className="mt-10 flex items-center gap-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: 0.9 }}
            >
              <span className="h-px w-12 bg-[hsl(var(--sunset))]" />
              <span className="font-mono text-xs uppercase tracking-[0.4em] text-white/70">Naruto Uzumaki</span>
            </motion.div>

            <motion.p
              className="mt-8 max-w-md text-base leading-relaxed text-white/65"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: 1.1 }}
            >
              The same rule runs through my work: I don't abandon a build halfway, and I don't ship
              something I wouldn't stand behind.
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
};
