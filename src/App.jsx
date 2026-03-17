import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import Stats from "./components/Stats";
import Work from "./components/Work";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import LandoHoverFace from "./components/LandoHoverFace";
import About from "./components/About";

import PortfolioScene from "./components/PortfolioScene";

function App() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-noise bg-deep-charcoal selection:bg-neon-green selection:text-deep-charcoal">
      {/* Custom Cursor Helper (Optional subtle glow following mouse) */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-50 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(57, 255, 20, 0.03), transparent 40%)`,
        }}
      />
      
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
