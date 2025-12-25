import { motion } from "framer-motion";
import { ExternalLink, ArrowUpRight } from "lucide-react";

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

const ProjectCard = ({ project, index }: { project: Project; index: number }) => {
  return (
    <motion.div
      className={`glass-card overflow-hidden group ${
        project.featured ? "md:col-span-2 md:row-span-2" : ""
      }`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-video">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        
        {/* Links overlay */}
        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <ExternalLink className="w-5 h-5" />
            </a>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
        
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs font-mono rounded-md bg-muted text-muted-foreground"
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
  return (
    <section id="projects" className="py-32 relative">
      {/* Background effects */}
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="font-mono text-primary mb-2">{"// Featured Work"}</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Project Showcase</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A selection of projects showcasing full-stack development, from complex architectures to elegant user interfaces.
          </p>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};
