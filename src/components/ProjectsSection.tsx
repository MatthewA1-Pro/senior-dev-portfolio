import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, ArrowUpRight, Eye, X } from "lucide-react";
import { useState, lazy, Suspense } from "react";
import { useJutsuSounds } from "@/hooks/useJutsuSounds";
import { useTilt3D } from "@/hooks/useTilt3D";
import { ScrollReveal, Parallax } from "./ScrollReveal";
import ErrorBoundary from "./ErrorBoundary";
import { ViewportMount } from "./ViewportMount";

// 2MB of geometry that sits below the fold - keep it out of the initial load.
const BaryonNaruto = lazy(() =>
  import("./three/NarutoModels").then((m) => ({ default: m.BaryonNaruto })),
);

import projectHumindly from "@/assets/project-humindly.png";
import projectIchranavigator from "@/assets/project-ichranavigator.png";
import projectJointheworld from "@/assets/project-jointheworld.png";

interface Project {
  title: string;
  description: string;
  image: string;
  tags: string[];
  liveUrl?: string;
  featured?: boolean;
}

const projects: Project[] = [
  {
    title: "Humindly",
    description: "AI-powered recruitment platform combining the speed of AI with human precision to accelerate hiring in Tech, Finance, Pharma & Engineering.",
    image: projectHumindly,
    tags: ["React", "Node.js", "AI/ML", "PostgreSQL", "TypeScript"],
    liveUrl: "https://humindly.fr",
    featured: true,
  },
  {
    title: "ICHRA Navigator",
    description: "Healthcare benefits navigation platform simplifying ICHRA compliance and employee health plan selection for modern employers.",
    image: projectIchranavigator,
    tags: ["React", "TypeScript", "Supabase", "Tailwind CSS"],
    liveUrl: "https://ichranavigator.com",
    featured: true,
  },
  {
    title: "Join The World",
    description: "Global community platform connecting travelers and digital nomads for authentic local experiences and entrepreneurship.",
    image: projectJointheworld,
    tags: ["React", "Node.js", "Real-time", "PostgreSQL"],
    liveUrl: "https://jointheworld.co",
  },
];

// Byakugan Preview Modal
const ByakuganPreview = ({ 
  project, 
  isOpen, 
  onClose 
}: { 
  project: Project | null; 
  isOpen: boolean; 
  onClose: () => void;
}) => {
  if (!project || !isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/95 backdrop-blur-md"
            onClick={onClose}
          />
          
          <motion.div
            className="relative z-10 w-full max-w-4xl max-h-[90vh] bg-card rounded-2xl overflow-hidden shadow-2xl border border-primary/30 flex flex-col"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <Eye className="w-4 h-4 text-primary-foreground" />
                </div>
                <h3 className="font-bold text-lg">{project.title}</h3>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-muted rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative flex-grow bg-background overflow-hidden">
              <iframe
                src={project.liveUrl}
                className="w-full h-full min-h-[400px] border-0"
                title={project.title}
              />
              {/* Scanning Effect */}
              <motion.div
                className="absolute inset-0 pointer-events-none bg-gradient-to-b from-primary/5 to-transparent"
                animate={{ y: ['-100%', '100%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ProjectCard = ({ project, index, onPreview }: { project: Project; index: number; onPreview: (project: Project) => void }) => {
  return (
    <motion.div
      className={`glass-card overflow-hidden group relative ${
        project.featured ? "md:col-span-2" : ""
      }`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      whileHover={{ y: -5 }}
    >
      {/* Chakra Pulse Effect on Hover */}
      <motion.div 
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"
        style={{
          boxShadow: 'inset 0 0 50px hsl(var(--primary) / 0.15)',
        }}
      />
      
      {/* Image */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
        
        {/* Quick Actions */}
        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
          <button
            onClick={() => onPreview(project)}
            className="p-2 rounded-full bg-primary/80 backdrop-blur-sm text-white hover:bg-primary transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-background/80 backdrop-blur-sm text-foreground hover:bg-primary hover:text-white transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 relative z-20">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span key={tag} className="px-2 py-0.5 text-[10px] font-mono rounded bg-muted text-muted-foreground border border-border">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export const ProjectsSection = () => {
  const [previewProject, setPreviewProject] = useState<Project | null>(null);

  return (
    <section id="projects" className="py-32 relative overflow-hidden bg-[#050505]">
      <div className="container mx-auto px-6 relative z-20">
        {/* Section Header */}
        <ScrollReveal className="text-center mb-20">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="h-[1px] w-8 bg-primary/40" />
            <p className="font-mono text-primary text-xs tracking-[0.3em] uppercase">
              Operational Intel
            </p>
            <div className="h-[1px] w-8 bg-primary/40" />
          </div>
          <h2 className="text-5xl md:text-8xl font-display tracking-wider mb-6">
            <span className="text-white">S-RANK</span> MISSIONS
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Projects Grid */}
          <div className="lg:col-span-8 order-2 lg:order-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projects.map((project, index) => (
                <ProjectCard 
                  key={project.title} 
                  project={project} 
                  index={index} 
                  onPreview={setPreviewProject}
                />
              ))}
            </div>
          </div>

          {/* Baryon Mode Character - HIGH VISIBILITY */}
          <div className="lg:col-span-4 order-1 lg:order-2 h-[60vh] lg:h-[80vh] relative">
            <motion.div 
              className="w-full h-full scale-125"
              initial={{ opacity: 0, scale: 1 }}
              whileInView={{ opacity: 1, scale: 1.25 }}
              viewport={{ once: true }}
            >
              <ViewportMount className="w-full h-full">
                <ErrorBoundary fallback={null}>
                  <Suspense fallback={null}>
                    <BaryonNaruto />
                  </Suspense>
                </ErrorBoundary>
              </ViewportMount>
            </motion.div>
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-red-600/20 rounded-full blur-[120px] -z-1" />
          </div>
        </div>
      </div>

      <ByakuganPreview
        project={previewProject}
        isOpen={!!previewProject}
        onClose={() => setPreviewProject(null)}
      />
    </section>
  );
};
