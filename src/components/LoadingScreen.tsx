import { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useProgress } from '@react-three/drei';

interface LoadingScreenProps {
  onComplete: () => void;
}

/** Keeps the title card on screen long enough to read, even on a warm cache. */
const MIN_VISIBLE_MS = 2200;
/** Never trap a visitor behind a stalled or failed download. */
const MAX_WAIT_MS = 12000;

/** Archimedean spiral as an SVG path - the Uzumaki swirl. */
const spiralPath = (turns: number, rStart: number, rEnd: number, cx = 60, cy = 60) => {
  const steps = Math.round(turns * 64);
  const points: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const angle = t * turns * Math.PI * 2;
    const r = rStart + (rEnd - rStart) * t;
    points.push(`${(cx + Math.cos(angle) * r).toFixed(2)},${(cy + Math.sin(angle) * r).toFixed(2)}`);
  }
  return `M${points.join(' L')}`;
};

export const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  // Real GLB progress, reported through three's default loading manager by the
  // preloads in ModelBase.
  const { progress, total } = useProgress();
  const [displayed, setDisplayed] = useState(0);
  const startedAt = useRef(performance.now());
  const done = useRef(false);

  const swirl = useMemo(() => spiralPath(3.25, 4, 42), []);

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
      className="fixed inset-0 z-[150] flex flex-col items-center justify-center overflow-hidden bg-[#0a0705]"
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.7, ease: 'easeInOut' }}
    >
      {/* Chakra glow that brightens as the charge builds */}
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[620px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[130px]"
        style={{ background: 'hsl(var(--primary) / 0.16)' }}
        animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.85, 0.5] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Drifting embers */}
      {Array.from({ length: 14 }, (_, i) => (
        <motion.span
          key={i}
          className="pointer-events-none absolute h-1 w-1 rounded-full bg-primary/70"
          style={{ left: `${8 + i * 6.4}%`, bottom: '-5%' }}
          animate={{ y: [0, -520 - (i % 4) * 90], opacity: [0, 0.9, 0] }}
          transition={{
            duration: 6 + (i % 5),
            repeat: Infinity,
            delay: i * 0.45,
            ease: 'easeOut',
          }}
        />
      ))}

      <div className="relative z-10 flex flex-col items-center">
        {/* The Uzumaki swirl draws itself as the chakra charges */}
        <div className="relative mb-10">
          <svg width="150" height="150" viewBox="0 0 120 120" className="overflow-visible">
            {/* Ghost of the full spiral */}
            <path
              d={swirl}
              fill="none"
              stroke="hsl(var(--primary))"
              strokeOpacity={0.12}
              strokeWidth={5}
              strokeLinecap="round"
            />
            <motion.path
              d={swirl}
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth={5}
              strokeLinecap="round"
              style={{ pathLength: charge, filter: 'drop-shadow(0 0 10px hsl(var(--primary) / 0.85))' }}
            />
            {/* Tail of the leaf symbol */}
            <motion.path
              d="M 60 18 L 96 2"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth={5}
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: charge > 0.96 ? 1 : 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              style={{ filter: 'drop-shadow(0 0 10px hsl(var(--primary) / 0.85))' }}
            />
          </svg>

          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
          >
            <div className="h-[150px] w-[150px] rounded-full border border-dashed border-primary/20" />
          </motion.div>
        </div>

        <p className="font-japanese mb-3 text-2xl tracking-[0.5em] text-primary/80">火の意志</p>

        <h1 className="font-display text-4xl tracking-[0.4em] text-white/90 sm:text-5xl">MATTHEW</h1>

        <div className="mt-7 h-[2px] w-56 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary via-secondary to-primary"
            style={{ width: `${shown}%` }}
          />
        </div>

        <span className="mt-4 font-mono text-[10px] uppercase tracking-[0.5em] text-muted-foreground">
          Channeling Chakra {shown}%
        </span>
      </div>
    </motion.div>
  );
};
