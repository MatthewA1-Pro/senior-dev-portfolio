import { motion } from "framer-motion";
import { Sparkles, Wand2, ArrowRight, Eye } from "lucide-react";
import { useState, useCallback } from "react";
import { ByakuganPreview, type ByakuganItem } from "./ByakuganPreview";
import mangaWalk from "@/assets/naruto/manga-walk.webp";
import { useJutsuSounds } from "@/hooks/useJutsuSounds";
import { useTilt3D } from "@/hooks/useTilt3D";

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
    gradient: "from-blue-600 to-primary",
    image: projectSelfmapmaker,
  },
  {
    title: "InsureHub AI",
    description: "AI-driven insurance contracting platform connecting agents with carriers for fast approvals and competitive commissions.",
    platform: "Lovable",
    url: "https://insure-hub-ai.lovable.app",
    result: "Complete insurance SaaS with AI-powered recommendations",
    icon: <Sparkles className="w-6 h-6" />,
    gradient: "from-orange-500 to-secondary",
    image: projectInsurehubai,
  },
];

const AIProjectCard = ({ project, index, onPreview }: { project: AIProject; index: number; onPreview: (project: AIProject) => void }) => {
  const { ref, tiltStyle, handleMouseMove, handleMouseLeave } = useTilt3D(12);

  return (
    <motion.div
      ref={ref}
      className="glass-card overflow-hidden group hover:neon-border transition-all duration-500 relative"
      style={tiltStyle}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ delay: index * 0.2, duration: 0.6, ease: "easeOut" }}
    >
      {/* Glare effect */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
        style={{
          background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.1) 45%, transparent 50%)",
        }}
      />

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
            className="absolute top-4 left-4 p-2 rounded-full bg-[#cbbcff] text-[#15102a] hover:bg-[#ddd3ff] text-white transition-colors opacity-0 group-hover:opacity-100"
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
            className="inline-flex items-center gap-2 text-sm font-mono text-[#cbbcff] hover:text-[#e4dcff] transition-colors"
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
  const [preview, setPreview] = useState<ByakuganItem | null>(null);
  const { playByakuganSound } = useJutsuSounds();

  const handlePreview = (project: AIProject) => {
    playByakuganSound();
    setPreview({
      title: project.title,
      description: project.description,
      image: project.image,
      url: project.url,
      note: project.result,
      badge: `Built with ${project.platform}`,
    });
  };
  const closePreview = useCallback(() => setPreview(null), []);

  return (
    <section id="ai-gallery" className="py-32 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        {/* Header beside the manga poster: back turned, walking between the pages */}
        <div className="mb-16 grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
          <motion.figure
            className="relative mx-auto w-full max-w-[340px] overflow-hidden rounded-2xl border border-white/10 lg:col-span-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <img
              src={mangaWalk}
              alt="Naruto seen from behind, walking between walls of manga pages"
              className="block h-full w-full object-cover"
              loading="lazy"
            />
          </motion.figure>
        <motion.div
          className="text-center lg:text-left lg:col-span-8"
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
            className="text-4xl md:text-5xl font-display tracking-wide mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <span className="gradient-text">AI & No-Code Gallery</span>
          </motion.h2>
          <motion.p 
            className="text-muted-foreground max-w-2xl mx-auto lg:mx-0"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            Every chapter written with AI as a sparring partner - prompt engineering, agents and rapid
            builds. Use <Eye className="w-4 h-4 inline text-[#cbbcff]" /> Byakugan to inspect one without
            leaving the page.
          </motion.p>
        </motion.div>
        </div>

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
              <span className="w-2 h-2 rounded-full bg-secondary animate-glow-pulse" />
              <span>Prompt Engineering Expert</span>
            </motion.div>
            <motion.div 
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-glow-pulse" />
              <span>AI Agent Development</span>
            </motion.div>
            <motion.div 
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <span className="w-2 h-2 rounded-full bg-secondary animate-glow-pulse" />
              <span>No-Code Platform Mastery</span>
            </motion.div>
            <motion.div 
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-glow-pulse" />
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
              onPreview={handlePreview}
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

      <ByakuganPreview item={preview} onClose={closePreview} />
    </section>
  );
};
