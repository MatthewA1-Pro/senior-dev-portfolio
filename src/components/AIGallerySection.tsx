import { motion } from "framer-motion";
import { Sparkles, Zap, MessageSquare, Wand2, ArrowRight } from "lucide-react";

interface AIProject {
  title: string;
  description: string;
  platform: string;
  prompt?: string;
  result: string;
  icon: React.ReactNode;
  gradient: string;
  stats?: { label: string; value: string }[];
}

const aiProjects: AIProject[] = [
  {
    title: "SaaS Dashboard Builder",
    description: "Complete analytics dashboard built entirely with AI-assisted development in under 4 hours.",
    platform: "Lovable",
    prompt: "Create a modern analytics dashboard with real-time charts, user management, and dark theme...",
    result: "Fully functional SaaS product with auth, payments, and admin panel",
    icon: <Sparkles className="w-6 h-6" />,
    gradient: "from-neon-cyan to-neon-purple",
    stats: [
      { label: "Build Time", value: "4 hrs" },
      { label: "Components", value: "50+" },
      { label: "Lines Saved", value: "10k+" },
    ],
  },
  {
    title: "E-commerce Store Generator",
    description: "AI-generated complete e-commerce solution with product management, cart, and checkout flow.",
    platform: "Cursor + GPT-4",
    prompt: "Build a modern e-commerce platform with Stripe integration and inventory management...",
    result: "Production-ready store deployed and serving real customers",
    icon: <Zap className="w-6 h-6" />,
    gradient: "from-neon-purple to-neon-pink",
    stats: [
      { label: "Build Time", value: "6 hrs" },
      { label: "Features", value: "25+" },
      { label: "Revenue", value: "$10k+" },
    ],
  },
  {
    title: "AI Chatbot Framework",
    description: "Custom chatbot framework with context memory, tool use, and multi-modal capabilities.",
    platform: "OpenAI + LangChain",
    prompt: "Design an extensible chatbot framework with RAG capabilities and custom tool integration...",
    result: "Reusable SDK adopted by 3 enterprise clients",
    icon: <MessageSquare className="w-6 h-6" />,
    gradient: "from-neon-green to-neon-cyan",
    stats: [
      { label: "Clients", value: "3" },
      { label: "Messages/day", value: "50k+" },
      { label: "Accuracy", value: "94%" },
    ],
  },
  {
    title: "Automated Code Review Agent",
    description: "AI agent that reviews pull requests, suggests improvements, and auto-fixes common issues.",
    platform: "Anthropic Claude",
    prompt: "Create an autonomous code review agent that understands context and provides actionable feedback...",
    result: "Reduced code review time by 60% for development team",
    icon: <Wand2 className="w-6 h-6" />,
    gradient: "from-neon-pink to-neon-purple",
    stats: [
      { label: "Time Saved", value: "60%" },
      { label: "PRs Reviewed", value: "500+" },
      { label: "Issues Found", value: "2k+" },
    ],
  },
];

const AIProjectCard = ({ project, index }: { project: AIProject; index: number }) => {
  return (
    <motion.div
      className="glass-card p-6 group hover:neon-border transition-all duration-500"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.15, duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${project.gradient} text-background`}>
          {project.icon}
        </div>
        <span className="px-3 py-1 text-xs font-mono rounded-full bg-muted text-primary">
          {project.platform}
        </span>
      </div>

      {/* Title & Description */}
      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
        {project.title}
      </h3>
      <p className="text-muted-foreground text-sm mb-4">
        {project.description}
      </p>

      {/* Prompt Preview */}
      {project.prompt && (
        <div className="mb-4 p-3 rounded-lg bg-muted/50 border-l-2 border-primary">
          <p className="font-mono text-xs text-muted-foreground italic line-clamp-2">
            "{project.prompt}"
          </p>
        </div>
      )}

      {/* Result */}
      <div className="flex items-center gap-2 text-sm text-primary mb-4">
        <ArrowRight className="w-4 h-4" />
        <span className="font-medium">{project.result}</span>
      </div>

      {/* Stats */}
      {project.stats && (
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
          {project.stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-lg font-bold text-primary">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export const AIGallerySection = () => {
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
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="font-mono text-primary mb-2">{"// AI-Powered Development"}</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">AI & No-Code Gallery</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Showcasing the power of AI-assisted development and prompt engineering. 
            Building production-ready apps at unprecedented speed.
          </p>
        </motion.div>

        {/* AI Skills Banner */}
        <motion.div
          className="glass-card p-8 mb-12 text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-wrap justify-center gap-6 text-sm font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-neon-cyan animate-glow-pulse" />
              <span>Prompt Engineering Expert</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-neon-purple animate-glow-pulse" />
              <span>AI Agent Development</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-neon-pink animate-glow-pulse" />
              <span>No-Code Platform Mastery</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-neon-green animate-glow-pulse" />
              <span>LLM Integration Specialist</span>
            </div>
          </div>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {aiProjects.map((project, index) => (
            <AIProjectCard key={project.title} project={project} index={index} />
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
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
    </section>
  );
};
