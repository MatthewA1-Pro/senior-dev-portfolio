import { motion } from "framer-motion";
import { Code2, Database, Palette, Brain, Terminal, Cloud } from "lucide-react";
import { ScrollReveal, Parallax } from "./ScrollReveal";

interface Skill {
  name: string;
  level: number;
}

interface SkillCategory {
  title: string;
  icon: React.ReactNode;
  color: string;
  skills: Skill[];
}

const skillCategories: SkillCategory[] = [
  {
    title: "Languages",
    icon: <Code2 className="w-6 h-6" />,
    color: "from-orange-500 to-orange-600",
    skills: [
      { name: "JavaScript/TypeScript", level: 95 },
      { name: "Python", level: 90 },
      { name: "Go", level: 80 },
      { name: "Rust", level: 70 },
      { name: "Java", level: 85 },
    ],
  },
  {
    title: "Frontend",
    icon: <Palette className="w-6 h-6" />,
    color: "from-red-600 to-red-700",
    skills: [
      { name: "React/Next.js", level: 95 },
      { name: "Vue.js", level: 85 },
      { name: "Three.js/WebGL", level: 80 },
      { name: "Tailwind CSS", level: 95 },
      { name: "Framer Motion", level: 90 },
    ],
  },
  {
    title: "Backend",
    icon: <Terminal className="w-6 h-6" />,
    color: "from-purple-600 to-purple-700",
    skills: [
      { name: "Node.js/Express", level: 95 },
      { name: "FastAPI/Django", level: 90 },
      { name: "GraphQL", level: 85 },
      { name: "REST APIs", level: 95 },
      { name: "Microservices", level: 85 },
    ],
  },
  {
    title: "Database",
    icon: <Database className="w-6 h-6" />,
    color: "from-amber-500 to-amber-600",
    skills: [
      { name: "PostgreSQL", level: 90 },
      { name: "MongoDB", level: 90 },
      { name: "Redis", level: 85 },
      { name: "Supabase", level: 95 },
      { name: "Prisma ORM", level: 90 },
    ],
  },
  {
    title: "Cloud & DevOps",
    icon: <Cloud className="w-6 h-6" />,
    color: "from-orange-600 to-red-600",
    skills: [
      { name: "AWS/GCP", level: 85 },
      { name: "Docker/Kubernetes", level: 80 },
      { name: "CI/CD Pipelines", level: 90 },
      { name: "Vercel/Railway", level: 95 },
      { name: "Linux/Nginx", level: 85 },
    ],
  },
  {
    title: "AI & No-Code",
    icon: <Brain className="w-6 h-6" />,
    color: "from-purple-500 to-red-500",
    skills: [
      { name: "Lovable/Cursor", level: 95 },
      { name: "Prompt Engineering", level: 95 },
      { name: "OpenAI/Anthropic APIs", level: 90 },
      { name: "LangChain", level: 85 },
      { name: "AI Agents", level: 80 },
    ],
  },
];

const SkillCard = ({ category, index }: { category: SkillCategory; index: number }) => {
  return (
    <motion.div
      className="glass-card p-4 sm:p-6 hover:neon-border transition-all duration-500 group"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.15, duration: 0.6 }}
      whileHover={{ 
        y: -5,
        transition: { duration: 0.3 }
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className={`p-1.5 sm:p-2 rounded-lg bg-gradient-to-br ${category.color} text-background`}>
          {category.icon}
        </div>
        <h3 className="font-bold text-base sm:text-lg">{category.title}</h3>
      </div>

      {/* Skills */}
      <div className="space-y-3 sm:space-y-4">
        {category.skills.map((skill, skillIndex) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.15 + skillIndex * 0.08, duration: 0.5 }}
          >
            <div className="flex justify-between mb-1">
              <span className="font-mono text-xs sm:text-sm text-muted-foreground">{skill.name}</span>
              <span className="font-mono text-xs sm:text-sm text-primary">{skill.level}%</span>
            </div>
            <div className="h-1 sm:h-1.5 bg-muted rounded-full overflow-hidden">
              <motion.div
                className={`h-full bg-gradient-to-r ${category.color} rounded-full`}
                initial={{ width: 0 }}
                whileInView={{ width: `${skill.level}%` }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 + skillIndex * 0.08 + 0.4, duration: 1, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export const SkillsSection = () => {
  return (
    <section id="skills" className="py-16 sm:py-24 lg:py-32 relative overflow-hidden">
      {/* Background effects with parallax */}
      <Parallax speed={-0.3} className="absolute inset-0">
        <div className="grid-bg opacity-20 w-full h-full" />
      </Parallax>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 sm:w-96 h-64 sm:h-96 bg-primary/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <ScrollReveal className="text-center mb-10 sm:mb-16">
          <p className="font-mono text-primary mb-2 text-xs sm:text-sm">{"// Skills & Expertise"}</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display tracking-wide mb-3 sm:mb-4">
            <span className="gradient-text">Tech Stack</span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-4">
            Years of experience across multiple domains, from traditional development to cutting-edge AI tools.
          </p>
        </ScrollReveal>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {skillCategories.map((category, index) => (
            <SkillCard key={category.title} category={category} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};
