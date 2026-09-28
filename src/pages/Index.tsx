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
import { RasenganBurst } from "@/components/RasenganBurst";
import { NinjaWayBand } from "@/components/NinjaWayBand";

type AppState = "loading" | "intro" | "revealed";

const Index = () => {
  const [appState, setAppState] = useState<AppState>("loading");
  const [showNav, setShowNav] = useState(false);
  const [bursting, setBursting] = useState(false);

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
  const handleIntroDone = useCallback(() => {
    setBursting(true);
    setAppState("revealed");
  }, []);
  const handleBurstDone = useCallback(() => setBursting(false), []);

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

      {/* The rasengan detonates open from the centre to reveal the site. */}
      {bursting && <RasenganBurst onDone={handleBurstDone} />}

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: revealed ? 1 : 0 }}
        // Near-instant: the page has to already be there for the burst's hole
        // to reveal it.
        transition={{ duration: 0.15 }}
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
        <NinjaWayBand />
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
