import { useCallback } from 'react';
import { useCinematicAudio } from './useCinematicAudio';

export const useSmoothScroll = () => {
  const handleSmoothScroll = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    
    const targetId = href.replace('#', '');
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      // Add a brief visual flash effect to the section
      targetElement.style.transition = 'box-shadow 0.5s ease-out';
      targetElement.style.boxShadow = '0 0 60px 10px hsl(var(--primary) / 0.15)';
      
      setTimeout(() => {
        targetElement.style.boxShadow = 'none';
      }, 800);

      // Smooth scroll with easing
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, []);

  return { handleSmoothScroll };
};
