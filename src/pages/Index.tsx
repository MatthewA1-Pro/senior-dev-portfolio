// Deployment Trigger: 2026-05-08
import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LoadingScreen } from "@/components/LoadingScreen";
import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { SkillsSection } from "@/components/SkillsSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { AIGallerySection } from "@/components/AIGallerySection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { SakuraPetals } from "@/components/SakuraPetals";
import { ScrollProgress, CursorFollower } from "@/components/ScrollReveal";
import { SoundToggle } from "@/components/SoundToggle";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isIntroComplete, setIsIntroComplete] = useState(false);
  const [showNav, setShowNav] = useState(false);

  // After loading completes, run the cinematic intro sequence
  useEffect(() => {
    if (!isLoading) {
      // Delay before showing navigation
      const navTimer = setTimeout(() => setShowNav(true), 1000);
      // Enable scrolling after full intro
      const scrollTimer = setTimeout(() => setIsIntroComplete(true), 2500);
      
      return () => {
        clearTimeout(navTimer);
        clearTimeout(scrollTimer);
      };
    }
  }, [isLoading]);

  return (
    <div className="min-h-screen bg-background selection:bg-primary/30">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <LoadingScreen 
            key="loader"
            onComplete={() => setIsLoading(false)} 
          />
        ) : (
          <motion.main
            key="main"
            className={`relative ${!isIntroComplete ? 'overflow-hidden h-screen' : ''}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {/* Custom Premium Cursor */}
            <CursorFollower />
            
            {/* Scroll progress indicator */}
            {isIntroComplete && <ScrollProgress />}
            
            {/* Sakura petals */}
            <SakuraPetals />
            
            {/* Navigation */}
            <AnimatePresence>
              {showNav && (
                <motion.div
                  initial={{ y: -100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  <Navigation />
                </motion.div>
              )}
            </AnimatePresence>
            
            <HeroSection isIntroComplete={isIntroComplete} />
            <AboutSection />
            <SkillsSection />
            <ProjectsSection />
            <AIGallerySection />
            <ContactSection />
            <Footer />
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
