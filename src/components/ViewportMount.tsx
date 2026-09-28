import { useRef, type ReactNode } from 'react';
import { useInView } from 'framer-motion';

interface ViewportMountProps {
  children: ReactNode;
  className?: string;
  /** How far ahead of the viewport to mount, so it is ready on arrival. */
  margin?: `${number}px`;
}

/**
 * Defers mounting until the slot nears the viewport.
 *
 * Every section of this page renders from the first frame (main is present but
 * transparent during the intro), so without this gate all four WebGL canvases
 * spin up at once and the loading screen blocks on every model in the site
 * before the opening shot can start. Only the hero needs to be eager.
 */
export const ViewportMount = ({ children, className, margin = '500px' }: ViewportMountProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin });

  return (
    <div ref={ref} className={className}>
      {inView ? children : null}
    </div>
  );
};
