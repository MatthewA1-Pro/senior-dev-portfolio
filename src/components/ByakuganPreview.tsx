import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";

export interface ByakuganItem {
  title: string;
  description: string;
  image?: string;
  url?: string;
  tags?: string[];
  /** One-line outcome shown under the description. */
  note?: string;
  /** Short label for the kind of work, e.g. "S-Rank" or "Lovable". */
  badge?: string;
}

const LAVENDER = "#cbbcff";
const LAVENDER_PALE = "#efeaff";

/** The Byakugan: pale lavender iris with ringed detail and no pupil. */
const ByakuganEye = ({ size = 220 }: { size?: number }) => (
  <svg width={size} height={size / 2} viewBox="0 0 220 110" aria-hidden>
    <defs>
      <radialGradient id="byakugan-iris" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="55%" stopColor={LAVENDER_PALE} />
        <stop offset="100%" stopColor={LAVENDER} />
      </radialGradient>
      <clipPath id="byakugan-lid">
        <path d="M6 55 Q110 -18 214 55 Q110 128 6 55 Z" />
      </clipPath>
    </defs>
    <path d="M6 55 Q110 -18 214 55 Q110 128 6 55 Z" fill="#f7f5ff" />
    <g clipPath="url(#byakugan-lid)">
      <circle cx="110" cy="55" r="38" fill="url(#byakugan-iris)" />
      {[30, 22, 14].map((r) => (
        <circle key={r} cx="110" cy="55" r={r} fill="none" stroke={LAVENDER} strokeOpacity={0.55} strokeWidth={1.2} />
      ))}
    </g>
    <path
      d="M6 55 Q110 -18 214 55 Q110 128 6 55 Z"
      fill="none"
      stroke="#2a2440"
      strokeWidth={4}
      strokeLinejoin="round"
    />
  </svg>
);

/** Deterministic PRNG so the veins keep the same shape across renders. */
const seeded = (seed: number) => () => {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
};

/** Veins radiating from the eye, each with a couple of forked branches. */
const buildVeins = () => {
  const rand = seeded(361);
  const veins: string[] = [];
  const count = 18;
  for (let i = 0; i < count; i++) {
    const baseAngle = (i / count) * Math.PI * 2 + (rand() - 0.5) * 0.3;
    let x = 500 + Math.cos(baseAngle) * 120;
    let y = 500 + Math.sin(baseAngle) * 70;
    let angle = baseAngle;
    let d = `M${x.toFixed(1)} ${y.toFixed(1)}`;
    const segments = 6 + Math.floor(rand() * 4);
    for (let s = 0; s < segments; s++) {
      angle += (rand() - 0.5) * 0.7;
      const step = 38 + rand() * 34;
      x += Math.cos(angle) * step;
      y += Math.sin(angle) * step;
      d += ` L${x.toFixed(1)} ${y.toFixed(1)}`;
      if (s > 1 && rand() > 0.62) {
        const bAngle = angle + (rand() > 0.5 ? 1 : -1) * (0.6 + rand() * 0.5);
        const bx = x + Math.cos(bAngle) * (30 + rand() * 40);
        const by = y + Math.sin(bAngle) * (30 + rand() * 40);
        veins.push(`M${x.toFixed(1)} ${y.toFixed(1)} L${bx.toFixed(1)} ${by.toFixed(1)}`);
      }
    }
    veins.unshift(d);
  }
  return veins;
};

/** Chakra points scattered over the image while it is seen "through". */
const buildTenketsu = () => {
  const rand = seeded(64);
  return Array.from({ length: 22 }, () => ({ x: 6 + rand() * 88, y: 8 + rand() * 84, d: rand() * 1.2 }));
};

type Phase = "activating" | "seeing";

/**
 * Hinata's Byakugan as a project preview: the eye opens as veins burst outward,
 * then settles into the header while the work is viewed first as lavender
 * X-ray - a 360° sweep with chakra points lit - before resolving to colour.
 *
 * Replaces two duplicated modals that embedded the live site in an iframe,
 * which renders blank for any site sending X-Frame-Options, and returned null
 * ahead of AnimatePresence so their exit animation could never run.
 */
export const ByakuganPreview = ({ item, onClose }: { item: ByakuganItem | null; onClose: () => void }) => {
  const [phase, setPhase] = useState<Phase>("activating");
  const [resolved, setResolved] = useState(false);
  const veins = useMemo(buildVeins, []);
  const tenketsu = useMemo(buildTenketsu, []);

  useEffect(() => {
    if (!item) return;
    setPhase("activating");
    setResolved(false);
    const toSeeing = window.setTimeout(() => setPhase("seeing"), 950);
    const toColour = window.setTimeout(() => setResolved(true), 3600);

    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.clearTimeout(toSeeing);
      window.clearTimeout(toColour);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [item, onClose]);

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          key="byakugan"
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          role="dialog"
          aria-modal="true"
          aria-label={`${item.title} - Byakugan preview`}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0"
            style={{ backgroundColor: "#07060d", backgroundImage: `radial-gradient(ellipse at center, transparent 40%, rgba(203,188,255,0.14) 100%)` }}
            onClick={onClose}
          />

          {/* Veins bursting from the eye */}
          <svg
            aria-hidden
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox="0 0 1000 1000"
            preserveAspectRatio="xMidYMid slice"
            style={{ filter: `drop-shadow(0 0 5px ${LAVENDER})` }}
          >
            {veins.map((d, i) => (
              <motion.path
                key={i}
                d={d}
                fill="none"
                stroke={LAVENDER_PALE}
                strokeWidth={i < 18 ? 2.4 : 1.3}
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{
                  pathLength: 1,
                  opacity: phase === "activating" ? 0.95 : 0.22,
                }}
                transition={{
                  pathLength: { delay: 0.25 + (i % 18) * 0.018, duration: 0.55, ease: "easeOut" },
                  opacity: { duration: 0.5 },
                }}
              />
            ))}
          </svg>

          {/* Activation: the eye opens at the centre */}
          <AnimatePresence>
            {phase === "activating" && (
              <motion.div
                key="eye"
                layoutId="byakugan-eye"
                className="relative z-10"
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{ scaleY: 1, opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                style={{ filter: `drop-shadow(0 0 24px ${LAVENDER})` }}
              >
                <ByakuganEye size={240} />
                <p className="mt-6 text-center font-japanese text-3xl tracking-[0.6em] text-[#efeaff]">白眼</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* The preview itself */}
          <AnimatePresence>
            {phase === "seeing" && (
              <motion.div
                key="panel"
                className="relative z-10 grid max-h-[88vh] w-full max-w-5xl overflow-y-auto rounded-2xl border bg-[#0d0b16] md:max-h-none md:grid-cols-5 md:overflow-hidden"
                style={{ borderColor: "rgba(203,188,255,0.28)", boxShadow: "0 0 0 1px rgba(203,188,255,0.06), 0 30px 80px rgba(0,0,0,0.7)" }}
                initial={{ opacity: 0, scale: 0.94, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Stage */}
                <div className="relative aspect-[16/10] overflow-hidden bg-black md:col-span-3 md:aspect-auto md:min-h-[440px]">
                  {item.image ? (
                    <motion.img
                      src={item.image}
                      alt={`${item.title} screenshot`}
                      className="absolute inset-0 h-full w-full object-cover object-top"
                      initial={{ filter: "grayscale(1) contrast(1.3) brightness(1.15)" }}
                      animate={{
                        filter: resolved
                          ? "grayscale(0) contrast(1) brightness(1)"
                          : "grayscale(1) contrast(1.3) brightness(1.15)",
                      }}
                      transition={{ duration: 0.9 }}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center font-japanese text-6xl text-[#cbbcff]/40">
                      白眼
                    </div>
                  )}

                  {/* Lavender tint of the X-ray view */}
                  <motion.div
                    className="absolute inset-0 mix-blend-color"
                    style={{ background: LAVENDER }}
                    animate={{ opacity: resolved ? 0 : 0.6 }}
                    transition={{ duration: 0.9 }}
                  />

                  {/* 360° field of vision: one full sweep */}
                  {!resolved && (
                    <motion.div
                      className="absolute left-1/2 top-1/2 aspect-square w-[180%] mix-blend-screen"
                      style={{
                        x: "-50%",
                        y: "-50%",
                        background:
                          "conic-gradient(from 0deg, transparent 0deg, transparent 300deg, rgba(203,188,255,0.1) 330deg, rgba(239,234,255,0.75) 358deg, transparent 360deg)",
                      }}
                      initial={{ rotate: 0 }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2.2, ease: "easeInOut" }}
                    />
                  )}

                  {/* Tenketsu - chakra points visible only to the Byakugan */}
                  {tenketsu.map((p, i) => (
                    <motion.span
                      key={i}
                      className="absolute h-1.5 w-1.5 rounded-full"
                      style={{
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        x: "-50%",
                        y: "-50%",
                        background: LAVENDER_PALE,
                        boxShadow: `0 0 8px ${LAVENDER}`,
                      }}
                      animate={
                        resolved
                          ? { opacity: 0, scale: 0 }
                          : { opacity: [0, 1, 0.4, 1], scale: [0, 1.4, 1, 1.2] }
                      }
                      transition={{ duration: resolved ? 0.4 : 1.4, delay: resolved ? 0 : p.d }}
                    />
                  ))}

                  {/* HUD readouts */}
                  <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-between p-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[#efeaff]/80">
                    <span className="rounded bg-black/70 px-2 py-1">視界 360°</span>
                    <span className="rounded bg-black/70 px-2 py-1">{resolved ? "Clear sight" : "Scanning"}</span>
                  </div>
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-between p-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[#efeaff]/80">
                    <span className="rounded bg-black/70 px-2 py-1">点穴 361</span>
                    <span className="rounded bg-black/70 px-2 py-1">Jūken</span>
                  </div>
                </div>

                {/* Intel */}
                <div className="flex flex-col p-6 sm:p-8 md:col-span-2">
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <motion.div layoutId="byakugan-eye" className="origin-left">
                        <ByakuganEye size={56} />
                      </motion.div>
                      <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#cbbcff]">
                        白眼 Byakugan
                      </span>
                    </div>
                    <button
                      onClick={onClose}
                      className="rounded-full p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                      aria-label="Close preview"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {item.badge && (
                    <span className="mb-3 self-start rounded-full border border-[#cbbcff]/30 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-[#cbbcff]">
                      {item.badge}
                    </span>
                  )}
                  <h3 className="mb-3 font-display text-3xl text-white">{item.title}</h3>
                  <p className="mb-4 text-sm leading-relaxed text-white/70">{item.description}</p>
                  {item.note && <p className="mb-4 text-sm text-[#cbbcff]">{item.note}</p>}

                  {item.tags && (
                    <div className="mb-6 flex flex-wrap gap-2">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded border border-[#cbbcff]/20 bg-[#cbbcff]/[0.07] px-2 py-0.5 font-mono text-[10px] text-[#e4dcff]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-auto space-y-5">
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 rounded-xl bg-[#cbbcff] px-5 py-3.5 text-sm font-bold uppercase tracking-widest text-[#15102a] transition-colors hover:bg-[#ddd3ff]"
                      >
                        Enter the mission <ArrowUpRight className="h-4 w-4" />
                      </a>
                    )}
                    <p className="border-l-2 border-[#cbbcff]/40 pl-3 font-mono text-[11px] italic leading-relaxed text-white/50">
                      "I don't go back on my word. That's my ninja way too."
                      <span className="mt-1 block not-italic tracking-widest text-[#cbbcff]/70">- Hinata Hyūga</span>
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
