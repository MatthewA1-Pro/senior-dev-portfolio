import { useState, useEffect, useCallback } from "react";
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
import { SoundToggle } from "@/components/SoundToggle";
// import { useCinematicAudio } from "@/hooks/useCinematicAudio";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isIntroComplete, setIsIntroComplete] = useState(false);
  const [showNav, setShowNav] = useState(false);
  const [soundEnabledFromLoading, setSoundEnabledFromLoading] = useState(false);

  /* const {
    isSoundEnabled,
    toggleSound,
    playWhoosh,
    playTextReveal,
    playRevealMusic,
  } = useCinematicAudio(); */
  const isSoundEnabled = false;
  const toggleSound = () => {};
  const playWhoosh = () => {};
  const playTextReveal = () => {};
  const playRevealMusic = () => {};

  // Sync sound state from loading screen
  const handleSoundStateChange = useCallback((enabled: boolean) => {
    setSoundEnabledFromLoading(enabled);
    if (enabled && !isSoundEnabled) {
      toggleSound();
    }
  }, [isSoundEnabled, toggleSound]);

  // After loading completes, run the cinematic intro sequence with sounds
  useEffect(() => {
    if (!isLoading) {
      // Play epic reveal music
      if (isSoundEnabled) {
        setTimeout(() => playRevealMusic(), 200);
        setTimeout(() => playWhoosh(), 800);
        setTimeout(() => playTextReveal(), 1800);
        setTimeout(() => playTextReveal(), 2200);
      }
      
      // Delay before showing navigation
      const navTimer = setTimeout(() => setShowNav(true), 1500);
      // Enable scrolling after full intro
      const scrollTimer = setTimeout(() => setIsIntroComplete(true), 3000);
      
      return () => {
        clearTimeout(navTimer);
        clearTimeout(scrollTimer);
      };
    }
  }, [isLoading, isSoundEnabled, playWhoosh, playTextReveal, playRevealMusic]);

  return (
    <div className="min-h-screen bg-background selection:bg-primary/30">
      {isLoading ? (
        <LoadingScreen 
          onComplete={() => setIsLoading(false)} 
          onSoundStateChange={handleSoundStateChange}
        />
      ) : (
        <main className="relative bg-purple-900/20 min-h-screen">
          <div className="fixed top-0 left-0 z-[9999] bg-green-600 text-white p-4">SYSTEM STABLE - NO AUDIO/PARTICLES</div>
          <HeroSection isIntroComplete={true} />
          <SkillsSection />
          <ProjectsSection />
          <AIGallerySection />
          <ContactSection />
          <Footer />
        </main>
      )}
    </div>
  );
};

export default Index;
