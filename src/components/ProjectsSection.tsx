import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, ArrowUpRight, Eye, X } from "lucide-react";
import { useState } from "react";
import { useJutsuSounds } from "@/hooks/useJutsuSounds";

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
  onClose,
  playSound
}: { 
  project: Project | null; 
  isOpen: boolean; 
  onClose: () => void;
  playSound: () => void;
}) => {
  if (!project || !isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop with Byakugan effect */}
          <motion.div
            className="absolute inset-0 bg-background/95 backdrop-blur-md"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          
          {/* Byakugan veins effect */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute bg-gradient-to-r from-purple-500/20 to-transparent h-0.5"
                style={{
                  left: '50%',
                  top: '50%',
                  width: '50vw',
                  transformOrigin: 'left center',
                  transform: `rotate(${i * 30}deg)`,
                }}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: [0, 0.6, 0.3] }}
                transition={{ delay: i * 0.03, duration: 0.5 }}
              />
            ))}
          </div>

          {/* Modal Content */}
          <motion.div
            className="relative z-10 w-full max-w-5xl bg-card rounded-2xl overflow-hidden shadow-2xl border border-purple-500/30"
            initial={{ scale: 0.8, opacity: 0, rotateX: -15 }}
            animate={{ scale: 1, opacity: 1, rotateX: 0 }}
            exit={{ scale: 0.8, opacity: 0, rotateX: 15 }}
            transition={{ type: "spring", damping: 25 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                  <Eye className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{project.title}</h3>
                  <p className="text-xs text-muted-foreground font-mono">Byakugan Preview Mode</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
                  >
                    Visit Site <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Preview iframe */}
            <div className="relative aspect-video bg-background">
              {project.liveUrl ? (
                <iframe
                  src={project.liveUrl}
                  className="w-full h-full border-0"
                  title={`${project.title} Preview`}
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  Preview not available
                </div>
              )}
              
              {/* Scanning overlay effect */}
              <motion.div
                className="absolute inset-0 pointer-events-none bg-gradient-to-b from-purple-500/5 to-transparent"
                animate={{ y: ['-100%', '100%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
            </div>

            {/* Footer info */}
            <div className="p-4 bg-muted/30 border-t border-border">
              <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs font-mono rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
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
      className={`glass-card overflow-hidden group ${
        project.featured ? "sm:col-span-2 lg:row-span-2" : ""
      }`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ delay: index * 0.2, duration: 0.7, ease: "easeOut" }}
      whileHover={{ y: -8, transition: { duration: 0.4 } }}
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-video">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        
        {/* Links overlay */}
        <div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-400">
          {/* Byakugan Preview Button */}
          <button
            onClick={() => onPreview(project)}
            className="p-1.5 sm:p-2 rounded-full bg-purple-500/80 backdrop-blur-sm hover:bg-purple-400 text-white transition-colors"
            title="Byakugan Preview"
          >
            <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 sm:p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
            </a>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        <div className="flex items-start justify-between mb-2 sm:mb-3">
          <h3 className="text-lg sm:text-xl font-bold group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
        
        <p className="text-muted-foreground text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-mono rounded-md bg-muted text-muted-foreground"
            >
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
  const { playByakuganSound } = useJutsuSounds();

  const handlePreview = (project: Project) => {
    playByakuganSound();
    setPreviewProject(project);
  };

  return (
    <section id="projects" className="py-16 sm:py-24 lg:py-32 relative">
      {/* Background effects */}
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute bottom-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-secondary/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-10 sm:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <motion.p 
            className="font-mono text-primary mb-2 text-xs sm:text-sm"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            {"// Featured Work"}
          </motion.p>
          <motion.h2 
            className="text-3xl sm:text-4xl md:text-5xl font-display tracking-wide mb-3 sm:mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <span className="gradient-text">Project Showcase</span>
          </motion.h2>
          <motion.p 
            className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            A selection of projects showcasing full-stack development. Click the{" "}
            <Eye className="w-3 h-3 sm:w-4 sm:h-4 inline text-purple-400" /> icon for a Byakugan preview.
          </motion.p>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {projects.map((project, index) => (
            <ProjectCard 
              key={project.title} 
              project={project} 
              index={index} 
              onPreview={handlePreview}
            />
          ))}
        </div>
      </div>

      {/* Byakugan Preview Modal */}
      <ByakuganPreview
        project={previewProject}
        isOpen={!!previewProject}
        onClose={() => setPreviewProject(null)}
        playSound={playByakuganSound}
      />
    </section>
  );
};
