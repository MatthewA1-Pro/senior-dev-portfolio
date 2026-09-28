import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { MagneticButton } from "./ScrollReveal";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { useCinematicAudio } from "@/hooks/useCinematicAudio";

const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "The Ninja Way" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "S-Rank Missions" },
  { href: "#ai-gallery", label: "AI Gallery" },
  { href: "#contact", label: "Ichiraku" },
];

export const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { handleSmoothScroll } = useSmoothScroll();
  const { playScrollTransition, isSoundEnabled } = useCinematicAudio();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    handleSmoothScroll(e, href);
    if (isSoundEnabled) {
      playScrollTransition();
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? "bg-background/95 border-b border-white/[0.06] shadow-lg shadow-black/40" 
            : "bg-transparent"
        }`}
      >
        
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between relative z-10">
          <a 
            href="#home" 
            onClick={(e) => handleNavClick(e, '#home')}
            className="font-display text-xl sm:text-2xl tracking-wider group"
          >
            <span className="text-primary group-hover:drop-shadow-[0_0_8px_hsl(var(--primary))] transition-all duration-300">M</span>
            <span className="text-foreground">.</span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4 lg:gap-8">
            {navLinks.map((link) => (
              <MagneticButton
                key={link.href}
                as="a"
                href={link.href}
                onClick={(e: React.MouseEvent<HTMLAnchorElement>) => handleNavClick(e, link.href)}
                className="font-mono text-xs lg:text-sm text-muted-foreground hover:text-primary transition-all duration-300 relative group py-2"
                strength={0.3}
              >
                {link.label}
                <span className="absolute -bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary transition-all duration-300 group-hover:w-full rounded-full" />
              </MagneticButton>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground hover:text-primary transition-colors rounded-lg hover:bg-primary/10"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Glassmorphism backdrop */}
            <motion.div 
              className="absolute inset-0 bg-background/80 backdrop-blur-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-secondary/10" />
            
            <div className="flex flex-col items-center justify-center h-full gap-6 sm:gap-8 relative z-10 pt-16">
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  className="font-mono text-xl sm:text-2xl text-foreground hover:text-primary transition-all duration-300 relative group"
                  onClick={(e) => {
                    handleNavClick(e, link.href);
                    setIsMobileMenuOpen(false);
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                >
                  {link.label}
                  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary transition-all duration-300 group-hover:w-full rounded-full" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
