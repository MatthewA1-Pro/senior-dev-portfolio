import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useProgress } from '@react-three/drei';

interface LoadingScreenProps {
  onComplete: () => void;
}

/** Keeps the title card on screen long enough to read, even on a warm cache. */
const MIN_VISIBLE_MS = 2400;
/** Never trap a visitor behind a stalled or failed download. */
const MAX_WAIT_MS = 12000;

const HEAD = '/naruto/sage-head.webp';
/** A ring traced around his silhouette (scripts/prepare-art.mjs). */
const OUTLINE = '/naruto/sage-outline.png';

const maskStyle = (url: string): React.CSSProperties => ({
  WebkitMaskImage: `url(${url})`,
  maskImage: `url(${url})`,
  WebkitMaskSize: '100% 100%',
  maskSize: '100% 100%',
  WebkitMaskRepeat: 'no-repeat',
  maskRepeat: 'no-repeat',
});

export const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  // Real GLB progress, reported through three's default loading manager by the
  // preloads in ModelBase.
  const { progress, total } = useProgress();
  const [displayed, setDisplayed] = useState(0);
  const startedAt = useRef(performance.now());
  const done = useRef(false);

  useEffect(() => {
    let frame: number;

    const tick = () => {
      const elapsed = performance.now() - startedAt.current;
      const timedOut = elapsed >= MAX_WAIT_MS;

      // Before any request registers, total is 0 and progress reads 0. Creep
      // forward so the bar is never frozen at zero while requests spin up.
      const target =
        timedOut || (total > 0 && progress >= 100)
          ? 100
          : total === 0
            ? Math.min(55, (elapsed / MIN_VISIBLE_MS) * 55)
            : progress;

      setDisplayed((prev) => {
        const next = prev + (target - prev) * 0.12;
        const settled = next > 99.4 ? 100 : next;

        if (!done.current && settled >= 100 && elapsed >= MIN_VISIBLE_MS) {
          done.current = true;
          window.setTimeout(onComplete, 450);
        }
        return settled;
      });

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [progress, total, onComplete]);

  const shown = Math.round(displayed);
  const charge = displayed / 100;

  return (
    <motion.div
      className="fixed inset-0 z-[150] flex flex-col items-center justify-center overflow-hidden bg-[#08080c]"
      style={{ backgroundImage: 'radial-gradient(circle at 50% 42%, #1c0e06 0%, #08080c 60%)' }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.7, ease: 'easeInOut' }}
    >
      {/* Drifting embers */}
      {Array.from({ length: 14 }, (_, i) => (
        <motion.span
          key={i}
          className="pointer-events-none absolute h-1 w-1 rounded-full bg-primary"
          style={{ left: `${8 + i * 6.4}%`, bottom: '-5%' }}
          animate={{ y: [0, -520 - (i % 4) * 90], opacity: [0, 0.9, 0] }}
          transition={{ duration: 6 + (i % 5), repeat: Infinity, delay: i * 0.45, ease: 'easeOut' }}
        />
      ))}

      <div className="relative z-10 flex flex-col items-center">
        {/* Sage Naruto's silhouette with a light running round its outline */}
        <div
          className="relative mb-8 h-[260px] w-[260px] sm:h-[300px] sm:w-[300px]"
          // The cutout is cropped at the shoulders; fade that edge out rather
          // than letting the outline trace a hard horizontal line.
          style={{
            WebkitMaskImage: 'linear-gradient(to bottom, #000 72%, transparent 97%)',
            maskImage: 'linear-gradient(to bottom, #000 72%, transparent 97%)',
          }}
        >
          {/* The whole outline, faint, so the path the light takes is readable */}
          <div className="absolute inset-0" style={{ ...maskStyle(OUTLINE), background: 'hsl(var(--primary) / 0.14)' }} />

          {/* The travelling light. The glow filter sits on a wrapper outside the
              mask, otherwise the mask would clip the glow off along with the
              rest of the gradient. */}
          <div
            className="absolute inset-0"
            style={{ filter: 'drop-shadow(0 0 6px #ffb347) drop-shadow(0 0 16px #ff6a00)' }}
          >
            <div className="absolute inset-0 overflow-hidden" style={maskStyle(OUTLINE)}>
              {/* Oversized and centred with inset, not translate: framer's
                  rotate would overwrite a translate transform. */}
              <motion.div
                className="absolute -inset-1/3"
                style={{
                  background:
                    'conic-gradient(from 0deg, transparent 0deg, transparent 230deg, rgba(255,106,0,0.35) 290deg, #ff8a1f 330deg, #fff4dc 352deg, transparent 360deg)',
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 2.1, repeat: Infinity, ease: 'linear' }}
              />
            </div>
          </div>

          {/* Silhouette in shadow, filling with colour as the chakra charges */}
          <img
            src={HEAD}
            alt=""
            className="absolute inset-0 h-full w-full"
            style={{ filter: 'brightness(0.07) saturate(0)' }}
          />
          <img
            src={HEAD}
            alt="Sage Mode Naruto"
            className="absolute inset-0 h-full w-full"
            style={{ clipPath: `inset(${(1 - charge) * 100}% 0 0 0)` }}
          />
        </div>

        <p className="font-japanese mb-3 text-2xl tracking-[0.5em] text-primary">火の意志</p>

        <h1 className="font-display text-4xl tracking-[0.4em] text-white sm:text-5xl">MATTHEW</h1>

        <div className="mt-7 h-[2px] w-56 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full"
            style={{
              width: `${shown}%`,
              background: 'linear-gradient(90deg, hsl(var(--sunset)), hsl(var(--primary)), hsl(var(--sage-red)))',
            }}
          />
        </div>

        <span className="mt-4 font-mono text-[10px] uppercase tracking-[0.5em] text-muted-foreground">
          Gathering Sage Chakra {shown}%
        </span>
      </div>
    </motion.div>
  );
};
