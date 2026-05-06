import { motion, useScroll, useTransform, useSpring, MotionValue, useInView, useMotionValue } from "framer-motion";
import { useRef, ReactNode, useEffect, useState } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

// Smooth fade-up reveal on scroll with 3D rotation
export const ScrollReveal = ({ children, className = "", delay = 0 }: ScrollRevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 60, rotateX: -10 }}
      animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{ 
        duration: 0.8, 
        delay,
        ease: [0.25, 0.4, 0.25, 1]
      }}
      style={{ transformStyle: "preserve-3d", perspective: 1000 }}
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

  const y = useTransform(scrollYProgress, [0, 1], [0, speed * 150]);
  const smoothY = useSpring(y, {
    stiffness: 50,
    damping: 20,
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

// Scale up effect on scroll with rotation
export const ScrollScale = ({ children, className = "" }: ScrollScaleProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div 
      ref={ref} 
      className={className}
      initial={{ scale: 0.8, opacity: 0, rotateY: -15 }}
      animate={isInView ? { scale: 1, opacity: 1, rotateY: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </motion.div>
  );
};

interface HorizontalScrollProps {
  children: ReactNode;
  className?: string;
  direction?: 'left' | 'right';
}

// Horizontal scroll reveal with blur
export const HorizontalReveal = ({ children, className = "", direction = 'left' }: HorizontalScrollProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div 
      ref={ref} 
      className={className}
      initial={{ x: direction === 'left' ? -100 : 100, opacity: 0, filter: "blur(10px)" }}
      animate={isInView ? { x: 0, opacity: 1, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
};

interface StaggerRevealProps {
  children: ReactNode[];
  className?: string;
  staggerDelay?: number;
}

// Staggered children reveal with spring physics
export const StaggerReveal = ({ children, className = "", staggerDelay = 0.1 }: StaggerRevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div ref={ref} className={className}>
      {children.map((child, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ 
            duration: 0.6, 
            delay: i * staggerDelay,
            ease: [0.25, 0.4, 0.25, 1]
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

// Magnetic hover effect for interactive elements
interface MagneticProps {
  children: ReactNode;
  className?: string;
  strength?: number;
}

export const Magnetic = ({ children, className = "", strength = 0.3 }: MagneticProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 15 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * strength);
    y.set((e.clientY - centerY) * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  );
};

// Text reveal character by character
interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
}

export const TextReveal = ({ text, className = "", delay = 0 }: TextRevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div ref={ref} className={className} aria-label={text}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ 
            duration: 0.4, 
            delay: delay + i * 0.03,
            ease: [0.25, 0.4, 0.25, 1]
          }}
          style={{ display: "inline-block" }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.div>
  );
};

// Scroll-linked rotation effect
interface ScrollRotateProps {
  children: ReactNode;
  className?: string;
  intensity?: number;
}

export const ScrollRotate = ({ children, className = "", intensity = 20 }: ScrollRotateProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const rotate = useTransform(scrollYProgress, [0, 1], [-intensity, intensity]);
  const smoothRotate = useSpring(rotate, { stiffness: 50, damping: 20 });

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ rotateX: smoothRotate }}
    >
      {children}
    </motion.div>
  );
};

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

// Section divider with animated line
export const SectionDivider = ({ className = "" }: { className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      className={`flex items-center justify-center gap-4 ${className}`}
    >
      <motion.div
        className="h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent"
        initial={{ width: 0 }}
        animate={isInView ? { width: "100%" } : {}}
        transition={{ duration: 1.2, ease: [0.25, 0.4, 0.25, 1] }}
        style={{ maxWidth: "200px" }}
      />
      <motion.div
        className="w-2 h-2 rounded-full bg-primary"
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : {}}
        transition={{ duration: 0.4, delay: 0.6 }}
      />
      <motion.div
        className="h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent"
        initial={{ width: 0 }}
        animate={isInView ? { width: "100%" } : {}}
        transition={{ duration: 1.2, ease: [0.25, 0.4, 0.25, 1] }}
        style={{ maxWidth: "200px" }}
      />
    </motion.div>
  );
};

// Enhanced Cursor follower effect with shape morphing
export const CursorFollower = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState<'default' | 'hover' | 'click' | 'text'>('default');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [role="button"], .magnetic-hover')) {
        setCursorVariant('hover');
      } else if (target.closest('p, h1, h2, h3, h4, h5, h6, span, li')) {
        setCursorVariant('text');
      } else {
        setCursorVariant('default');
      }
    };

    const handleMouseDown = () => setCursorVariant('click');
    const handleMouseUp = () => setCursorVariant('default');
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.body.addEventListener('mouseleave', handleMouseLeave);
    document.body.addEventListener('mouseenter', handleMouseEnter);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
      document.body.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible]);

  const cursorConfig = {
    default: { size: 12, outerSize: 40, borderWidth: 1, opacity: 1 },
    hover: { size: 8, outerSize: 64, borderWidth: 2, opacity: 0.8 },
    click: { size: 6, outerSize: 32, borderWidth: 2, opacity: 1 },
    text: { size: 4, outerSize: 80, borderWidth: 1, opacity: 0.5 },
  };

  const config = cursorConfig[cursorVariant];

  const springConfig = { stiffness: 500, damping: 28 };
  const smoothX = useSpring(mousePosition.x, springConfig);
  const smoothY = useSpring(mousePosition.y, springConfig);

  const outerSpringConfig = { stiffness: 120, damping: 20 };
  const outerX = useSpring(mousePosition.x, outerSpringConfig);
  const outerY = useSpring(mousePosition.y, outerSpringConfig);

  // Trail particle springs (must be called unconditionally at top level)
  const trail0X = useSpring(mousePosition.x, { stiffness: 100, damping: 15 });
  const trail0Y = useSpring(mousePosition.y, { stiffness: 100, damping: 15 });
  const trail1X = useSpring(mousePosition.x, { stiffness: 80, damping: 20 });
  const trail1Y = useSpring(mousePosition.y, { stiffness: 80, damping: 20 });
  const trail2X = useSpring(mousePosition.x, { stiffness: 60, damping: 25 });
  const trail2Y = useSpring(mousePosition.y, { stiffness: 60, damping: 25 });
  const trails = [
    { x: trail0X, y: trail0Y },
    { x: trail1X, y: trail1Y },
    { x: trail2X, y: trail2Y },
  ];

  if (typeof window !== 'undefined' && 'ontouchstart' in window) {
    return null; // Hide on touch devices
  }

  return (
    <>
      {/* Main cursor dot */}
      <motion.div
        className="fixed top-0 left-0 rounded-full bg-primary pointer-events-none z-[9999] mix-blend-difference hidden md:block"
        style={{ 
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: config.size,
          height: config.size,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ duration: 0.15 }}
      />
      
      {/* Outer morphing ring */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9998] hidden md:flex items-center justify-center"
        style={{ 
          x: outerX,
          y: outerY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: config.outerSize,
          height: config.outerSize,
          borderWidth: config.borderWidth,
          opacity: isVisible ? config.opacity : 0,
          borderRadius: cursorVariant === 'text' ? '4px' : '50%',
        }}
        transition={{ 
          duration: 0.3,
          ease: [0.25, 0.4, 0.25, 1]
        }}
      >
        <motion.div
          className="absolute inset-0 rounded-full border-primary/50"
          style={{ borderWidth: 'inherit', borderStyle: 'solid', borderColor: 'hsl(var(--primary) / 0.5)', borderRadius: 'inherit' }}
        />
        
        {/* Glow effect on hover */}
        {cursorVariant === 'hover' && (
          <motion.div
            className="absolute inset-0 rounded-full bg-primary/10"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{ borderRadius: 'inherit' }}
          />
        )}
      </motion.div>

      {/* Trail particles */}
      {cursorVariant === 'hover' && (
        <>
          {trails.map((t, i) => (
            <motion.div
              key={i}
              className="fixed top-0 left-0 w-1 h-1 rounded-full bg-primary/30 pointer-events-none z-[9997] hidden md:block"
              style={{ 
                x: t.x,
                y: t.y,
                translateX: '-50%',
                translateY: '-50%',
              }}
              animate={{ opacity: 0.6 - i * 0.15 }}
            />
          ))}
        </>
      )}
    </>
  );
};

// Magnetic Button/Link wrapper with enhanced pull effect
interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  strength?: number;
  as?: 'button' | 'a' | 'div';
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
  target?: string;
  rel?: string;
}

export const MagneticButton = ({ 
  children, 
  className = "", 
  strength = 0.4,
  as = 'button',
  href,
  onClick,
  target,
  rel
}: MagneticButtonProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);

  const springConfig = { stiffness: 200, damping: 20 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);
  const springScale = useSpring(scale, { stiffness: 300, damping: 25 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    
    x.set(distanceX * strength);
    y.set(distanceY * strength);
  };

  const handleMouseEnter = () => {
    scale.set(1.05);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    scale.set(1);
  };

  const Component = motion.div;

  const content = (
    <Component
      ref={ref}
      className={`magnetic-hover inline-block ${className}`}
      style={{ x: springX, y: springY, scale: springScale }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {as === 'a' && href ? (
        <a href={href} target={target} rel={rel} onClick={onClick} className="block">
          {children}
        </a>
      ) : as === 'button' ? (
        <button onClick={onClick} className="block w-full">
          {children}
        </button>
      ) : (
        children
      )}
    </Component>
  );

  return content;
};
