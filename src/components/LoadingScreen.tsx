import { useEffect, useRef, type CSSProperties } from 'react';
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
/** A ring traced around his silhouette, and a wider soft one for its glow (scripts/prepare-art.mjs). */
const OUTLINE = '/naruto/sage-outline.png';
const OUTLINE_GLOW = '/naruto/sage-outline-glow.png';

const maskStyle = (url: string): CSSProperties => ({
  WebkitMaskImage: `url(${url})`,
  maskImage: `url(${url})`,
  WebkitMaskSize: '100% 100%',
  maskSize: '100% 100%',
  WebkitMaskRepeat: 'no-repeat',
  maskRepeat: 'no-repeat',
});

const EMBERS = Array.from({ length: 14 }, (_, i) => ({
  left: `${8 + i * 6.4}%`,
  '--rise': `${-(520 + (i % 4) * 90)}px`,
  '--dur': `${6 + (i % 5)}s`,
  '--delay': `${i * 0.45}s`,
})) as CSSProperties[];

/**
 * Loading screen: Sage Naruto's silhouette with a light running round its
 * outline, filling with colour as the models load.
 *
 * Built to stay smooth while the page is busiest. The previous version set
 * React state on every animation frame and animated the light (with a blur
 * filter over it) from JavaScript, so any main-thread work - bundle parsing,
 * model decoding - stalled it. Now the light and embers are CSS animations the
 * browser runs off the main thread, the glow is a pre-blurred mask, and
 * progress writes straight to the DOM.
 */
export const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  // Real GLB progress through three's default loading manager.
  const { progress, total } = useProgress();
  const live = useRef({ progress, total });
  live.current = { progress, total };

  const barRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);
  const headRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const startedAt = performance.now();
    let displayed = 0;
    let frame = 0;
    let done = false;
    let lastShown = -1;

    const tick = () => {
      const elapsed = performance.now() - startedAt;
      const { progress: p, total: t } = live.current;

      // Before any request registers, total is 0; creep forward so the bar is
      // never frozen at zero while requests spin up.
      const target =
        elapsed >= MAX_WAIT_MS || (t > 0 && p >= 100)
          ? 100
          : t === 0
            ? Math.min(55, (elapsed / MIN_VISIBLE_MS) * 55)
            : p;

      displayed += (target - displayed) * 0.12;
      if (displayed > 99.4) displayed = 100;

      const shown = Math.round(displayed);
      if (shown !== lastShown) {
        lastShown = shown;
        if (barRef.current) barRef.current.style.transform = `scaleX(${displayed / 100})`;
        if (pctRef.current) pctRef.current.textContent = `${shown}%`;
        if (headRef.current) headRef.current.style.clipPath = `inset(${100 - displayed}% 0 0 0)`;
      }

      if (!done && displayed >= 100 && elapsed >= MIN_VISIBLE_MS) {
        done = true;
        window.setTimeout(onComplete, 350);
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[150] flex flex-col items-center justify-center overflow-hidden bg-[#08080c]"
      style={{ backgroundImage: 'radial-gradient(circle at 50% 42%, #1c0e06 0%, #08080c 60%)' }}
      // Opacity only: this fades straight into the opening shot, which is
      // already drawn underneath.
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
    >
      {EMBERS.map((style, i) => (
        <span
          key={i}
          className="animate-ember pointer-events-none absolute bottom-[-5%] h-1 w-1 rounded-full bg-primary"
          style={style}
        />
      ))}

      <div className="relative z-10 flex flex-col items-center">
        <div
          className="relative mb-8 h-[260px] w-[260px] sm:h-[300px] sm:w-[300px]"
          // The cutout is cropped at the shoulders; fade that edge out rather
          // than letting the outline trace a hard horizontal line.
          style={{
            WebkitMaskImage: 'linear-gradient(to bottom, #000 72%, transparent 97%)',
            maskImage: 'linear-gradient(to bottom, #000 72%, transparent 97%)',
          }}
        >
          {/* The whole path, faint */}
          <div className="absolute inset-0" style={{ ...maskStyle(OUTLINE), background: 'hsl(var(--primary) / 0.14)' }} />

          {/* Soft glow travelling with the light */}
          <div className="absolute inset-0 overflow-hidden" style={maskStyle(OUTLINE_GLOW)}>
            <div
              className="animate-orbit absolute -inset-1/3"
              style={{
                background:
                  'conic-gradient(from 0deg, transparent 0deg, transparent 250deg, rgba(255,106,0,0.25) 300deg, rgba(255,150,40,0.75) 340deg, rgba(255,230,190,0.9) 354deg, transparent 360deg)',
              }}
            />
          </div>

          {/* The sharp light itself */}
          <div className="absolute inset-0 overflow-hidden" style={maskStyle(OUTLINE)}>
            <div
              className="animate-orbit absolute -inset-1/3"
              style={{
                background:
                  'conic-gradient(from 0deg, transparent 0deg, transparent 230deg, rgba(255,106,0,0.35) 290deg, #ff8a1f 330deg, #fff4dc 352deg, transparent 360deg)',
              }}
            />
          </div>

          {/* Silhouette in shadow, filling with colour as the chakra charges */}
          <img src={HEAD} alt="" className="absolute inset-0 h-full w-full" style={{ filter: 'brightness(0.07) saturate(0)' }} />
          <img
            ref={headRef}
            src={HEAD}
            alt="Sage Mode Naruto"
            className="absolute inset-0 h-full w-full"
            style={{ clipPath: 'inset(100% 0 0 0)' }}
          />
        </div>

        <p className="font-japanese mb-3 text-2xl tracking-[0.5em] text-primary">火の意志</p>

        <h1 className="font-display text-4xl tracking-[0.4em] text-white sm:text-5xl">MATTHEW</h1>

        <div className="mt-7 h-[2px] w-56 overflow-hidden rounded-full bg-white/10">
          <div
            ref={barRef}
            className="h-full w-full origin-left rounded-full"
            style={{
              transform: 'scaleX(0)',
              background: 'linear-gradient(90deg, hsl(var(--sunset)), hsl(var(--primary)), hsl(var(--sage-red)))',
            }}
          />
        </div>

        <span className="mt-4 font-mono text-[10px] uppercase tracking-[0.5em] text-muted-foreground">
          Gathering Sage Chakra <span ref={pctRef}>0%</span>
        </span>
      </div>
    </motion.div>
  );
};
