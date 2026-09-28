import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useProgress } from '@react-three/drei';

interface LoadingScreenProps {
  onComplete: () => void;
}

/** Keeps the title card on screen long enough to read, even on a warm cache. */
const MIN_VISIBLE_MS = 1800;
/** Never trap a visitor behind a stalled or failed download. */
const MAX_WAIT_MS = 12000;

export const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  // Real GLB progress, reported through three's default loading manager by the
  // preloads in ModelBase. The bar used to be a hard-coded 2s timer that could
  // hand over to the opening shot before its model existed.
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
          window.setTimeout(onComplete, 400);
        }
        return settled;
      });

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [progress, total, onComplete]);

  const shown = Math.round(displayed);

  return (
    <motion.div
      className="fixed inset-0 z-[150] bg-black flex flex-col items-center justify-center overflow-hidden"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="absolute inset-0 z-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="relative z-10 opacity-20 mb-12"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.2 }}
        transition={{ duration: 2 }}
      >
        <svg width="120" height="120" viewBox="0 0 100 100" fill="currentColor" className="text-primary">
          <path d="M50 10 C 20 10, 10 40, 10 50 C 10 70, 40 90, 50 90 C 70 90, 90 70, 90 50 C 90 30, 70 10, 50 10 Z M50 25 C 65 25, 75 35, 75 50 C 75 65, 65 75, 50 75 C 35 75, 25 65, 25 50 C 25 35, 35 25, 50 25 Z" />
        </svg>
      </motion.div>

      <div className="relative z-10 flex flex-col items-center gap-4">
        <h1 className="font-display text-4xl tracking-[0.4em] text-white/90">MATTHEW</h1>

        <div className="w-48 h-[1px] bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-primary" style={{ width: `${shown}%` }} />
        </div>

        <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.5em]">
          Channeling Chakra {shown}%
        </span>
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
    </motion.div>
  );
};
