import { motion } from "framer-motion";
import { Code2, Database, Palette, Brain, Terminal, Cloud } from "lucide-react";

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
    color: "from-neon-cyan to-neon-cyan/50",
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
    color: "from-neon-purple to-neon-purple/50",
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
    color: "from-neon-green to-neon-green/50",
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
    color: "from-neon-pink to-neon-pink/50",
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
    color: "from-neon-cyan to-neon-purple",
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
    color: "from-neon-purple to-neon-pink",
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
      className="glass-card p-6 hover:neon-border transition-all duration-500 group"
      initial={{ opacity: 0, y: 30, rotateX: -10 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ 
        y: -5,
        transition: { duration: 0.2 }
      }}
      style={{ transformStyle: "preserve-3d", perspective: 1000 }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-2 rounded-lg bg-gradient-to-br ${category.color} text-background`}>
          {category.icon}
        </div>
        <h3 className="font-bold text-lg">{category.title}</h3>
      </div>

      {/* Skills */}
      <div className="space-y-4">
        {category.skills.map((skill, skillIndex) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 + skillIndex * 0.05 }}
          >
            <div className="flex justify-between mb-1">
              <span className="font-mono text-sm text-muted-foreground">{skill.name}</span>
              <span className="font-mono text-sm text-primary">{skill.level}%</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <motion.div
                className={`h-full bg-gradient-to-r ${category.color} rounded-full`}
                initial={{ width: 0 }}
                whileInView={{ width: `${skill.level}%` }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 + skillIndex * 0.05 + 0.3, duration: 0.8, ease: "easeOut" }}
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
    <section id="skills" className="py-32 relative">
      {/* Background effects */}
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="font-mono text-primary mb-2">{"// Skills & Expertise"}</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Tech Stack</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Years of experience across multiple domains, from traditional development to cutting-edge AI tools.
          </p>
        </motion.div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((category, index) => (
            <SkillCard key={category.title} category={category} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};
