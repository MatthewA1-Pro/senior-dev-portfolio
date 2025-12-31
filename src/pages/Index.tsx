import { useState } from "react";
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
import { ScrollProgress } from "@/components/ScrollReveal";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      {!isLoading && (
        <motion.main
          className="relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Scroll progress indicator */}
          <ScrollProgress />
          
          {/* Sakura petals floating effect */}
          <SakuraPetals />
          
          <Navigation />
          <HeroSection />
          <SkillsSection />
          <ProjectsSection />
          <AIGallerySection />
          <ContactSection />
          <Footer />
        </motion.main>
      )}
    </>
  );
};

export default Index;
