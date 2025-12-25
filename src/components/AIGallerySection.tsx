import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Wand2, ArrowRight, Eye, X } from "lucide-react";
import { useState } from "react";

import projectSelfmapmaker from "@/assets/project-selfmapmaker.png";
import projectInsurehubai from "@/assets/project-insurehubai.png";

interface AIProject {
  title: string;
  description: string;
  platform: string;
  url: string;
  result: string;
  icon: React.ReactNode;
  gradient: string;
  image?: string;
}

const aiProjects: AIProject[] = [
  {
    title: "Self Map Maker",
    description: "AI-powered self-discovery tool that generates personalized mind maps and insights based on user reflections.",
    platform: "Lovable",
    url: "https://self-map-maker.lovable.app",
    result: "Interactive visualization app built with AI-assisted development",
    icon: <Wand2 className="w-6 h-6" />,
    gradient: "from-neon-pink to-neon-purple",
    image: projectSelfmapmaker,
  },
  {
    title: "InsureHub AI",
    description: "AI-driven insurance contracting platform connecting agents with carriers for fast approvals and competitive commissions.",
    platform: "Lovable",
    url: "https://insure-hub-ai.lovable.app",
    result: "Complete insurance SaaS with AI-powered recommendations",
    icon: <Sparkles className="w-6 h-6" />,
    gradient: "from-neon-cyan to-neon-green",
    image: projectInsurehubai,
  },
];

// Byakugan Preview Modal
const ByakuganPreview = ({ 
  project, 
  isOpen, 
  onClose 
}: { 
  project: AIProject | null; 
  isOpen: boolean; 
  onClose: () => void;
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
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
                >
                  Visit Site <ArrowRight className="w-3 h-3" />
                </a>
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
              <iframe
                src={project.url}
                className="w-full h-full border-0"
                title={`${project.title} Preview`}
                loading="lazy"
              />
              
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
              <div className="flex items-center gap-2 text-sm text-primary">
                <ArrowRight className="w-4 h-4" />
                <span className="font-medium">{project.result}</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const AIProjectCard = ({ project, index, onPreview }: { project: AIProject; index: number; onPreview: (project: AIProject) => void }) => {
  return (
    <motion.div
      className="glass-card overflow-hidden group hover:neon-border transition-all duration-500"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ delay: index * 0.2, duration: 0.6, ease: "easeOut" }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
    >
      {/* Project Image */}
      {project.image ? (
        <div className="relative h-48 overflow-hidden">
          <img 
            src={project.image} 
            alt={`${project.title} preview`}
            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          <div className={`absolute top-4 right-4 p-2 rounded-lg bg-gradient-to-br ${project.gradient} text-background`}>
            {project.icon}
          </div>
          
          {/* Byakugan Preview Button */}
          <button
            onClick={() => onPreview(project)}
            className="absolute top-4 left-4 p-2 rounded-full bg-purple-500/80 backdrop-blur-sm hover:bg-purple-400 text-white transition-colors opacity-0 group-hover:opacity-100"
            title="Byakugan Preview"
          >
            <Eye className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <div className={`relative h-48 bg-gradient-to-br ${project.gradient} opacity-20 flex items-center justify-center`}>
          <div className={`p-4 rounded-xl bg-gradient-to-br ${project.gradient} text-background`}>
            {project.icon}
          </div>
        </div>
      )}

      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          <span className="px-3 py-1 text-xs font-mono rounded-full bg-muted text-primary">
            {project.platform}
          </span>
        </div>

        {/* Description */}
        <p className="text-muted-foreground text-sm mb-4">
          {project.description}
        </p>

        {/* Result */}
        <div className="flex items-center gap-2 text-sm text-primary mb-4">
          <ArrowRight className="w-4 h-4" />
          <span className="font-medium">{project.result}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => onPreview(project)}
            className="inline-flex items-center gap-2 text-sm font-mono text-purple-400 hover:text-purple-300 transition-colors"
          >
            <Eye className="w-4 h-4" /> Preview
          </button>
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-mono text-muted-foreground hover:text-primary transition-colors"
          >
            Visit Site <ArrowRight className="w-3 h-3" />
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export const AIGallerySection = () => {
  const [previewProject, setPreviewProject] = useState<AIProject | null>(null);

  return (
    <section id="ai-gallery" className="py-32 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.p 
            className="font-mono text-primary mb-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            {"// AI-Powered Development"}
          </motion.p>
          <motion.h2 
            className="text-4xl md:text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <span className="gradient-text">AI & No-Code Gallery</span>
          </motion.h2>
          <motion.p 
            className="text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            Showcasing the power of AI-assisted development and prompt engineering. 
            Use <Eye className="w-4 h-4 inline text-purple-400" /> Byakugan to preview without leaving.
          </motion.p>
        </motion.div>

        {/* AI Skills Banner */}
        <motion.div
          className="glass-card p-8 mb-12 text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex flex-wrap justify-center gap-6 text-sm font-mono">
            <motion.div 
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <span className="w-2 h-2 rounded-full bg-neon-cyan animate-glow-pulse" />
              <span>Prompt Engineering Expert</span>
            </motion.div>
            <motion.div 
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <span className="w-2 h-2 rounded-full bg-neon-purple animate-glow-pulse" />
              <span>AI Agent Development</span>
            </motion.div>
            <motion.div 
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <span className="w-2 h-2 rounded-full bg-neon-pink animate-glow-pulse" />
              <span>No-Code Platform Mastery</span>
            </motion.div>
            <motion.div 
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              <span className="w-2 h-2 rounded-full bg-neon-green animate-glow-pulse" />
              <span>LLM Integration Specialist</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {aiProjects.map((project, index) => (
            <AIProjectCard 
              key={project.title} 
              project={project} 
              index={index}
              onPreview={setPreviewProject}
            />
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-muted-foreground mb-4">
            Interested in AI-powered development for your project?
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary to-secondary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
          >
            Let's Collaborate
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>

      {/* Byakugan Preview Modal */}
      <ByakuganPreview
        project={previewProject}
        isOpen={!!previewProject}
        onClose={() => setPreviewProject(null)}
      />
    </section>
  );
};
