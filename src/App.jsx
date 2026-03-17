import { lazy, Suspense, useEffect, useRef } from "react";

import Navbar from "./components/Navbar";
import LandoHoverFace from "./components/LandoHoverFace";
import About from "./components/About";
import Work from "./components/Work";
import Footer from "./components/Footer";

// Lazy-load the heavy 3D sections so they don't block the initial paint
const PortfolioScene = lazy(() => import("./components/PortfolioScene"));
const Stats = lazy(() => import("./components/Stats"));

function App() {
  const cursorRef = useRef(null);

  useEffect(() => {
    // Use a direct DOM ref to avoid ANY React re-renders on mousemove.
    // The gradient background updates via direct style mutation — zero overhead.
    let rafId = null;
    const handleMouseMove = (e) => {
      if (rafId) return; // throttle to one update per animation frame
      rafId = requestAnimationFrame(() => {
        if (cursorRef.current) {
          cursorRef.current.style.background = `radial-gradient(600px circle at ${e.clientX}px ${e.clientY}px, rgba(57, 255, 20, 0.03), transparent 40%)`;
        }
        rafId = null;
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-noise bg-deep-charcoal selection:bg-neon-green selection:text-deep-charcoal">
      {/* Cursor gradient — updated via direct DOM mutation, no React state */}
      <div
        ref={cursorRef}
        className="pointer-events-none fixed inset-0 z-50 transition-opacity duration-300"
      />

      <Navbar />

      <main>
        <LandoHoverFace
          faceSrc="/bm-bg-f.webp"
          helmetSrc="/bm-bg-l.webp"
        />
        <About />

        {/* 3D scenes are code-split and lazy-loaded */}
        <Suspense fallback={<div className="w-full h-screen bg-deep-charcoal" />}>
          <PortfolioScene />
        </Suspense>

        <Suspense fallback={<div className="w-full h-[700px] bg-dark-gray" />}>
          <Stats />
        </Suspense>

        <Work />
      </main>

      <Footer />
    </div>
  );
}

export default App;
