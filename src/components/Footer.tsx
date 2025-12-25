import { motion } from "framer-motion";
import { Heart } from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 border-t border-border">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <motion.a
            href="#home"
            className="font-mono text-xl font-bold"
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-primary">M</span>
            <span className="text-foreground">.</span>
          </motion.a>

          {/* Copyright & Email */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground font-mono flex items-center gap-1 justify-center">
              © {currentYear} Matthew. Built with{" "}
              <Heart className="w-4 h-4 text-destructive inline" /> and{" "}
              <span className="text-primary">AI</span>
            </p>
            <a 
              href="mailto:base44.dev1@gmail.com" 
              className="text-sm text-muted-foreground hover:text-primary transition-colors font-mono"
            >
              base44.dev1@gmail.com
            </a>
          </div>

          {/* Quick Links */}
          <div className="flex items-center gap-6">
            <a href="#skills" className="text-sm text-muted-foreground hover:text-primary transition-colors font-mono">
              Skills
            </a>
            <a href="#projects" className="text-sm text-muted-foreground hover:text-primary transition-colors font-mono">
              Projects
            </a>
            <a href="#contact" className="text-sm text-muted-foreground hover:text-primary transition-colors font-mono">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
