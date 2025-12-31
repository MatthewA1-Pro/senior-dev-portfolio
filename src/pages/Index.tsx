import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LoadingScreen } from "@/components/LoadingScreen";
import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { SkillsSection } from "@/components/SkillsSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { AIGallerySection } from "@/components/AIGallerySection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { SakuraPetals } from "@/components/SakuraPetals";
import { ScrollProgress, CursorFollower } from "@/components/ScrollReveal";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isIntroComplete, setIsIntroComplete] = useState(false);
  const [showNav, setShowNav] = useState(false);

  // After loading completes, run the cinematic intro sequence
  useEffect(() => {
    if (!isLoading) {
      // Delay before showing navigation
      const navTimer = setTimeout(() => setShowNav(true), 1500);
      // Enable scrolling after full intro
      const scrollTimer = setTimeout(() => setIsIntroComplete(true), 3000);
      
      return () => {
        clearTimeout(navTimer);
        clearTimeout(scrollTimer);
      };
    }
  }, [isLoading]);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      {!isLoading && (
        <motion.main
          className={`relative cursor-none md:cursor-none ${!isIntroComplete ? 'overflow-hidden h-screen' : ''}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          style={{ overflow: isIntroComplete ? 'auto' : 'hidden' }}
        >
          {/* Custom cursor follower */}
          <CursorFollower />
          
          {/* Scroll progress indicator - only show after intro */}
          <AnimatePresence>
            {isIntroComplete && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <ScrollProgress />
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Sakura petals - fade in cinematically */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 2 }}
          >
            <SakuraPetals />
          </motion.div>
          
          {/* Navigation - slides in after hero reveal */}
          <AnimatePresence>
            {showNav && (
              <motion.div
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
              >
                <Navigation />
              </motion.div>
            )}
          </AnimatePresence>
          
          <HeroSection isIntroComplete={isIntroComplete} />
          <SkillsSection />
          <ProjectsSection />
          <AIGallerySection />
          <ContactSection />
          <Footer />
          
          {/* Scroll hint - appears after intro */}
          <AnimatePresence>
            {isIntroComplete && (
              <motion.div
                className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: [0, 1, 1, 0], y: [20, 0, 0, -10] }}
                transition={{ duration: 3, times: [0, 0.2, 0.8, 1], delay: 0.5 }}
              >
                <span className="font-mono text-xs text-muted-foreground/50 mb-2">Scroll to explore</span>
                <motion.div
                  className="w-5 h-8 border-2 border-muted-foreground/30 rounded-full flex justify-center pt-2"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, repeat: 2 }}
                >
                  <motion.div
                    className="w-1 h-2 bg-primary/50 rounded-full"
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.5, repeat: 2 }}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.main>
      )}
    </>
  );
};

export default Index;
