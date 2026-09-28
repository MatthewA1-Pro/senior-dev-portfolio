import { motion } from "framer-motion";
import { ArrowUpRight, Eye } from "lucide-react";
import { useState, lazy, Suspense, useCallback } from "react";
import { ScrollReveal } from "./ScrollReveal";
import ErrorBoundary from "./ErrorBoundary";
import { ViewportMount } from "./ViewportMount";
import { ByakuganPreview, type ByakuganItem } from "./ByakuganPreview";

import projectHumindly from "@/assets/project-humindly.png";
import projectIchranavigator from "@/assets/project-ichranavigator.png";
import projectJointheworld from "@/assets/project-jointheworld.png";

// 2MB of geometry below the fold - keep it out of the initial load.
const BaryonNaruto = lazy(() =>
  import("./three/NarutoModels").then((m) => ({ default: m.BaryonNaruto })),
);

type Rank = "S" | "A";

interface Project {
  title: string;
  description: string;
  image: string;
  tags: string[];
  liveUrl?: string;
  rank: Rank;
  /** What the client got out of it, one line. */
  outcome: string;
}

const projects: Project[] = [
  {
    title: "Humindly",
    description:
      "AI-powered recruitment platform combining the speed of AI with human precision to accelerate hiring in Tech, Finance, Pharma & Engineering.",
    image: projectHumindly,
    tags: ["React", "Node.js", "AI/ML", "PostgreSQL", "TypeScript"],
    liveUrl: "https://humindly.fr",
    rank: "S",
    outcome: "AI-assisted matching across four hiring verticals",
  },
  {
    title: "ICHRA Navigator",
    description:
      "Healthcare benefits navigation platform simplifying ICHRA compliance and employee health plan selection for modern employers.",
    image: projectIchranavigator,
    tags: ["React", "TypeScript", "Supabase", "Tailwind CSS"],
    liveUrl: "https://ichranavigator.com",
    rank: "S",
    outcome: "Compliance assessment in under 90 seconds",
  },
  {
    title: "Join The World",
    description:
      "Global community platform connecting travelers and digital nomads for authentic local experiences and entrepreneurship.",
    image: projectJointheworld,
    tags: ["React", "Node.js", "Real-time", "PostgreSQL"],
    liveUrl: "https://jointheworld.co",
    rank: "A",
    outcome: "Real-time community for travellers and founders",
  },
];

const RANK_STYLE: Record<Rank, string> = {
  S: "border-[hsl(var(--sage-red))] text-[hsl(var(--sage-red))] bg-[#1a0706]/90",
  A: "border-primary text-primary bg-[#1a0d04]/90",
};

/** A hanko-style rank stamp, pressed on at an angle like an official seal. */
const RankStamp = ({ rank }: { rank: Rank }) => (
  <div
    className={`flex h-14 w-14 -rotate-12 flex-col items-center justify-center rounded-full border-2 ${RANK_STYLE[rank]}`}
    aria-label={`${rank}-rank mission`}
  >
    <span className="font-display text-2xl leading-none">{rank}</span>
    <span className="font-mono text-[7px] uppercase tracking-[0.2em]">Rank</span>
  </div>
);

const MissionCard = ({
  project,
  index,
  onPreview,
}: {
  project: Project;
  index: number;
  onPreview: (p: Project) => void;
}) => (
  <motion.article
    className="group grid overflow-hidden rounded-2xl border border-white/[0.08] bg-card transition-colors duration-300 hover:border-primary/60 sm:grid-cols-[1.05fr_1fr]"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ delay: index * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
  >
    {/* Dossier photo */}
    <button
      type="button"
      onClick={() => onPreview(project)}
      className="relative aspect-[16/11] overflow-hidden bg-black text-left sm:aspect-auto sm:min-h-[260px]"
      aria-label={`Preview ${project.title} with Byakugan`}
    >
      <img
        src={project.image}
        alt={`${project.title} screenshot`}
        className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
        loading="lazy"
      />
      <div className="absolute left-4 top-4">
        <RankStamp rank={project.rank} />
      </div>
      <span className="absolute bottom-3 left-4 rounded bg-black/75 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.3em] text-white/85">
        Mission {String(index + 1).padStart(2, "0")}
      </span>
    </button>

    {/* Briefing */}
    <div className="flex flex-col p-6">
      <h3 className="mb-2 text-2xl font-bold text-white transition-colors group-hover:text-primary">
        {project.title}
      </h3>
      <p className="mb-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{project.description}</p>
      <p className="mb-4 text-sm text-primary/90">{project.outcome}</p>

      <div className="mb-5 flex flex-wrap gap-1.5">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="rounded border border-white/10 bg-white/[0.04] px-2 py-0.5 font-mono text-[10px] text-white/70"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-auto flex items-center gap-3">
        <button
          type="button"
          onClick={() => onPreview(project)}
          className="inline-flex items-center gap-2 rounded-lg border border-[#cbbcff]/35 bg-[#cbbcff]/[0.08] px-3.5 py-2 font-mono text-xs uppercase tracking-widest text-[#d9ceff] transition-colors hover:bg-[#cbbcff]/20"
        >
          <Eye className="h-4 w-4" /> Byakugan
        </button>
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 font-mono text-xs uppercase tracking-widest text-white/70 transition-colors hover:text-primary"
          >
            Live <ArrowUpRight className="h-4 w-4" />
          </a>
        )}
      </div>
    </div>
  </motion.article>
);

export const ProjectsSection = () => {
  const [preview, setPreview] = useState<ByakuganItem | null>(null);

  const openPreview = useCallback((p: Project) => {
    setPreview({
      title: p.title,
      description: p.description,
      image: p.image,
      url: p.liveUrl,
      tags: p.tags,
      note: p.outcome,
      badge: `${p.rank}-Rank Mission`,
    });
  }, []);
  const closePreview = useCallback(() => setPreview(null), []);

  return (
    <section id="projects" className="relative bg-background py-16 lg:py-36">
      <div className="container relative z-10 mx-auto px-6">
        <ScrollReveal className="mb-14 flex flex-col gap-6 lg:mb-20 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.35em] text-primary">
              <span className="font-japanese mr-3 text-sm">任務</span>Operational Intel
            </p>
            <h2 className="font-display text-5xl tracking-wide text-white md:text-7xl">
              S-Rank <span className="gradient-text">Missions</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            Shipped work for real clients. Open any dossier with the Byakugan to inspect it without
            leaving the page.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Baryon Mode, pinned while the missions scroll past */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24">
              <div
                className="relative h-[52vh] overflow-hidden rounded-3xl border border-[hsl(var(--sage-red))]/35 lg:h-[72vh]"
                style={{
                  background:
                    "radial-gradient(ellipse at 50% 60%, hsl(var(--sage-red) / 0.55) 0%, hsl(var(--crimson)) 45%, #0b0406 100%)",
                }}
              >
                <ViewportMount className="absolute inset-0">
                  <ErrorBoundary fallback={null}>
                    <Suspense fallback={null}>
                      <BaryonNaruto />
                    </Suspense>
                  </ErrorBoundary>
                </ViewportMount>

                <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/80 to-transparent p-5 pt-16">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-white/70">Final form</p>
                    <p className="font-display text-2xl text-white">Baryon Mode</p>
                  </div>
                  <span className="font-japanese text-3xl text-[hsl(var(--sunset))]">重粒子</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6 lg:col-span-7">
            {projects.map((project, index) => (
              <MissionCard key={project.title} project={project} index={index} onPreview={openPreview} />
            ))}
          </div>
        </div>
      </div>

      <ByakuganPreview item={preview} onClose={closePreview} />
    </section>
  );
};
