import { motion, useScroll, useTransform, useSpring, MotionValue } from "framer-motion";
import { useRef, ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

// Smooth fade-up reveal on scroll
export const ScrollReveal = ({ children, className = "", delay = 0 }: ScrollRevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start 0.8"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const opacity = useTransform(smoothProgress, [0, 1], [0, 1]);
  const y = useTransform(smoothProgress, [0, 1], [60, 0]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ opacity, y }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
};

interface ParallaxProps {
  children: ReactNode;
  className?: string;
  speed?: number;
}

// Parallax effect for backgrounds
export const Parallax = ({ children, className = "", speed = 0.5 }: ParallaxProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, speed * 100]);
  const smoothY = useSpring(y, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div ref={ref} className={className} style={{ y: smoothY }}>
      {children}
    </motion.div>
  );
};

interface ScrollScaleProps {
  children: ReactNode;
  className?: string;
}

// Scale up effect on scroll
export const ScrollScale = ({ children, className = "" }: ScrollScaleProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const scale = useTransform(smoothProgress, [0, 1], [0.8, 1]);
  const opacity = useTransform(smoothProgress, [0, 1], [0, 1]);

  return (
    <motion.div ref={ref} className={className} style={{ scale, opacity }}>
      {children}
    </motion.div>
  );
};

interface HorizontalScrollProps {
  children: ReactNode;
  className?: string;
}

// Horizontal scroll reveal
export const HorizontalReveal = ({ children, className = "" }: HorizontalScrollProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
  });

  const x = useTransform(smoothProgress, [0, 1], [-100, 0]);
  const opacity = useTransform(smoothProgress, [0, 1], [0, 1]);

  return (
    <motion.div ref={ref} className={className} style={{ x, opacity }}>
      {children}
    </motion.div>
  );
};

interface StaggerRevealProps {
  children: ReactNode[];
  className?: string;
  staggerDelay?: number;
}

// Staggered children reveal
export const StaggerReveal = ({ children, className = "", staggerDelay = 0.1 }: StaggerRevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start 0.6"],
  });

  return (
    <motion.div ref={ref} className={className}>
      {children.map((child, i) => (
        <StaggerChild key={i} index={i} scrollProgress={scrollYProgress} delay={staggerDelay}>
          {child}
        </StaggerChild>
      ))}
    </motion.div>
  );
};

const StaggerChild = ({ 
  children, 
  index, 
  scrollProgress, 
  delay 
}: { 
  children: ReactNode; 
  index: number; 
  scrollProgress: MotionValue<number>; 
  delay: number;
}) => {
  const opacity = useTransform(
    scrollProgress,
    [0.1 * index * delay, 0.2 + index * delay * 0.1],
    [0, 1]
  );
  const y = useTransform(
    scrollProgress,
    [0.1 * index * delay, 0.2 + index * delay * 0.1],
    [40, 0]
  );

  const smoothOpacity = useSpring(opacity, { stiffness: 100, damping: 30 });
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 });

  return (
    <motion.div style={{ opacity: smoothOpacity, y: smoothY }}>
      {children}
    </motion.div>
  );
};

interface SmoothScrollContainerProps {
  children: ReactNode;
}

// Smooth scroll progress indicator
export const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary via-secondary to-primary origin-left z-50"
      style={{ scaleX }}
    />
  );
};
