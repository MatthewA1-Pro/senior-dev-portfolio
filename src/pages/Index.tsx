import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LoadingScreen } from "@/components/LoadingScreen";
import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { SkillsSection } from "@/components/SkillsSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { AIGallerySection } from "@/components/AIGallerySection";
import { IchirakuFooter } from "@/components/IchirakuFooter";
import { SakuraPetals } from "@/components/SakuraPetals";
import { ScrollProgress } from "@/components/ScrollReveal";
import { IntroSequence } from "@/components/three/IntroSequence";
import ErrorBoundary from "@/components/ErrorBoundary";

type AppState = "loading" | "intro" | "revealed";

const Index = () => {
  const [appState, setAppState] = useState<AppState>("loading");
  const [showNav, setShowNav] = useState(false);

  // The page must not scroll underneath the opening shot.
  useEffect(() => {
    const locked = appState !== "revealed";
    document.body.style.overflow = locked ? "hidden" : "auto";
    if (locked) return;

    const navTimer = window.setTimeout(() => setShowNav(true), 900);
    return () => window.clearTimeout(navTimer);
  }, [appState]);

  useEffect(() => {
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleLoaded = useCallback(() => setAppState("intro"), []);
  const handleIntroDone = useCallback(() => setAppState("revealed"), []);

  const revealed = appState === "revealed";

  return (
    <div className="min-h-screen bg-background selection:bg-primary/30 relative">
      <AnimatePresence mode="wait">
        {appState === "loading" && <LoadingScreen key="loader" onComplete={handleLoaded} />}

        {appState === "intro" && (
          /* If WebGL fails here the visitor would be stranded on a black screen,
             so a failed opening shot skips straight to the site. */
          <ErrorBoundary key="intro" fallback={<SkipIntro onMount={handleIntroDone} />}>
            <IntroSequence onComplete={handleIntroDone} />
          </ErrorBoundary>
        )}
      </AnimatePresence>

      {/* Carries the white-out of the rasengan impact across the handoff, so the
          hero canvas mounts while the frame is still blown out. */}
      <AnimatePresence>
        {revealed && (
          <motion.div
            key="impact-fade"
            className="fixed inset-0 z-[110] bg-white pointer-events-none"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: revealed ? 1 : 0 }}
        transition={{ duration: 0.8 }}
        aria-hidden={!revealed}
      >
        {revealed && <ScrollProgress />}

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

        <HeroSection isIntroComplete={revealed} />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <AIGallerySection />
        <IchirakuFooter />

        <SakuraPetals />
      </motion.main>
    </div>
  );
};

/** Fallback that immediately advances past a broken opening sequence. */
const SkipIntro = ({ onMount }: { onMount: () => void }) => {
  useEffect(() => {
    onMount();
  }, [onMount]);
  return null;
};

export default Index;
