import { useEffect } from "react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";

/** Same core-to-edge ramp the intro ends on, so the handoff frame is identical. */
export const CHAKRA_FILL =
  "radial-gradient(circle at 50% 50%, #ffffff 0%, #dff4ff 16%, #7cc8ff 36%, #1f73e6 60%, #07183a 100%)";

/**
 * The cut from the opening shot to the site. The intro freezes on the rasengan
 * filling the lens; this picks up on that exact frame and detonates it - a hole
 * tears open from the centre and widens past the corners, revealing the page
 * underneath, while shockwave rings and chakra rays blow outward.
 *
 * It replaces a flat white flash followed by a fade, which read as a loading
 * glitch rather than an impact.
 */
export const RasenganBurst = ({ onDone }: { onDone: () => void }) => {
  const hole = useMotionValue(0);
  const mask = useTransform(
    hole,
    (r) => `radial-gradient(circle at 50% 50%, transparent ${r}%, #000 ${r + 6}%)`,
  );

  useEffect(() => {
    const controls = animate(hole, 112, { duration: 1.05, ease: [0.16, 1, 0.3, 1], delay: 0.06 });
    const timer = window.setTimeout(onDone, 1350);
    return () => {
      controls.stop();
      window.clearTimeout(timer);
    };
  }, [hole, onDone]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[115] overflow-hidden">
      {/* The detonating core, with the page showing through the widening hole */}
      <motion.div
        className="absolute inset-0"
        style={{ background: CHAKRA_FILL, WebkitMaskImage: mask, maskImage: mask }}
      />

      {/* Shockwave rings */}
      {[0, 0.1, 0.22].map((delay, i) => (
        <motion.div
          key={i}
          className="absolute left-1/2 top-1/2 aspect-square w-[40vmax] rounded-full"
          style={{
            // framer's transform replaces Tailwind translate classes, so the
            // centring offset has to live in framer's own x/y.
            x: "-50%",
            y: "-50%",
            border: `${3 - i}px solid rgba(190, 230, 255, 0.95)`,
            boxShadow: "0 0 40px rgba(90, 170, 255, 0.8), inset 0 0 40px rgba(90, 170, 255, 0.6)",
          }}
          initial={{ scale: 0.15, opacity: 1 }}
          animate={{ scale: 3.4, opacity: 0 }}
          transition={{ duration: 0.95, delay, ease: [0.2, 0.8, 0.3, 1] }}
        />
      ))}

      {/* Chakra rays spinning outward - the rasengan's spiral coming apart */}
      <motion.div
        className="absolute left-1/2 top-1/2 aspect-square w-[160vmax] rounded-full"
        style={{
          x: "-50%",
          y: "-50%",
          background:
            "repeating-conic-gradient(from 0deg, rgba(150,215,255,0.7) 0deg 1.2deg, transparent 1.2deg 14deg)",
          WebkitMaskImage: "radial-gradient(circle, transparent 8%, #000 22%, transparent 62%)",
          maskImage: "radial-gradient(circle, transparent 8%, #000 22%, transparent 62%)",
        }}
        initial={{ scale: 0.3, rotate: 0, opacity: 1 }}
        animate={{ scale: 1.6, rotate: 70, opacity: 0 }}
        transition={{ duration: 1.1, ease: "easeOut" }}
      />
    </div>
  );
};
