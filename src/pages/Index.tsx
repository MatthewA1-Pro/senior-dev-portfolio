import { useState, useEffect, Suspense } from "react";
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
import { RunningNaruto } from "@/components/three/NarutoModels";

const Index = () => {
  const [appState, setAppState] = useState<'loading' | 'running' | 'revealed'>('loading');
  const [showNav, setShowNav] = useState(false);

  // Handle Scroll Locking
  useEffect(() => {
    if (appState === 'loading' || appState === 'running') {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
      // Fade in nav after scroll unlocks
      const navTimer = setTimeout(() => setShowNav(true), 800);
      return () => clearTimeout(navTimer);
    }
  }, [appState]);

  // Transition from Running to Revealed
  useEffect(() => {
    if (appState === 'running') {
      const timer = setTimeout(() => setAppState('revealed'), 2800);
      return () => clearTimeout(timer);
    }
  }, [appState]);

  return (
    <div className="min-h-screen bg-background selection:bg-primary/30 relative">
      {/* Global Cinematic Cursor */}
      <CursorFollower />

      <AnimatePresence mode="wait">
        {/* PHASE 1: Loading Screen (Minimalist) */}
        {appState === 'loading' && (
          <LoadingScreen 
            key="loader"
            onComplete={() => setAppState('running')} 
          />
        )}

        {/* PHASE 2: Entry Animation (The Run) */}
        {appState === 'running' && (
          <motion.div 
            key="running-intro"
            className="fixed inset-0 z-[100] bg-background flex items-center justify-center pointer-events-none"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="w-full h-full"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 2.5, ease: "linear" }}
            >
              <RunningNaruto scale={1.5} />
              {/* Chakra Trail */}
              <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent blur-sm" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PHASE 3: Main Content */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={appState === 'revealed' ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1 }}
      >
        {/* Scroll Progress Bar */}
        {appState === 'revealed' && <ScrollProgress />}
        
        {/* Navigation */}
        <AnimatePresence>
          {showNav && (
            <motion.div
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <Navigation />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sections */}
        <HeroSection isIntroComplete={appState === 'revealed'} />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <AIGallerySection />
        <ContactSection />
        <Footer />
        
        {/* Ambient Effects */}
        <SakuraPetals />
      </motion.main>
    </div>
  );
};

export default Index;
