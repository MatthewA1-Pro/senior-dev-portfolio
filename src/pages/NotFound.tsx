import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import sageCrimson from "@/assets/naruto/sage-crimson.webp";

/** Lost off the path - Sage Naruto, arms crossed, waiting to walk you back. */
const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <main className="relative flex min-h-screen items-center overflow-hidden bg-[#770416]">
      <img
        src={sageCrimson}
        alt="Sage Mode Naruto with arms crossed against a crimson backdrop"
        className="absolute bottom-0 right-0 h-[92%] w-auto max-w-none object-contain object-bottom sm:right-[4%]"
        // #770416 above is sampled from this poster, and the edges are feathered,
        // so the image's rectangle disappears into the page.
        style={{
          WebkitMaskImage: "radial-gradient(ellipse 70% 80% at 50% 60%, #000 60%, transparent 100%)",
          maskImage: "radial-gradient(ellipse 70% 80% at 50% 60%, #000 60%, transparent 100%)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#770416] via-[#770416]/85 to-transparent" />

      <div className="container relative z-10 mx-auto px-6">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.4em] text-[hsl(var(--sunset))]">
          <span className="font-japanese mr-3 text-sm">迷子</span>Off the path
        </p>
        <h1 className="mb-4 font-display text-8xl text-white md:text-9xl">404</h1>
        <p className="mb-2 max-w-md text-xl text-white/85">
          This trail doesn't lead anywhere - <span className="font-mono text-base">{location.pathname}</span>
        </p>
        <p className="mb-10 max-w-md text-white/65">
          Even Sage Mode can't find it. But I never go back on my word: I'll get you home.
        </p>
        <a
          href="/"
          className="inline-flex items-center gap-3 rounded-full bg-primary px-8 py-4 text-sm font-bold uppercase tracking-widest text-primary-foreground transition-transform hover:scale-105"
        >
          <ArrowLeft className="h-4 w-4" /> Back to the village
        </a>
      </div>
    </main>
  );
};

export default NotFound;
