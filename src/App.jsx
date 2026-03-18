import { useEffect, useRef } from "react";
import styles from "./App.module.scss";

import Navbar from "./components/Navbar";
import LandoHoverFace from "./components/LandoHoverFace";
import About from "./components/About";
import PortfolioScene from "./components/PortfolioScene";
import Stats from "./components/Stats";
import Work from "./components/Work";
import Footer from "./components/Footer";

function App() {
  const cursorRef = useRef(null);

  useEffect(() => {
    let rafId = null;
    const handleMouseMove = (e) => {
      if (rafId) return;
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
    <div className={styles.app}>
      <div ref={cursorRef} className={styles.cursorGradient} />

      <Navbar />

      <main>
        <LandoHoverFace
          faceSrc="/bm-bg-f.webp"
          helmetSrc="/bm-bg-l.webp"
        />
        <About />
        <PortfolioScene />
        <Stats />
        <Work />
      </main>

      <Footer />
    </div>
  );
}

export default App;
