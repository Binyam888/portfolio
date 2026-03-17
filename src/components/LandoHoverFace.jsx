import React, { useRef } from "react";
import { 
  motion, 
  useMotionValue, 
  useSpring, 
  useTransform, 
  useMotionTemplate,
  useScroll
} from "framer-motion";

const LandoHoverFace = ({ faceSrc, helmetSrc }) => {
  const ref = useRef(null);
  const containerRef = useRef(null);

  // === A. Parallax Scroll Setup ===
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 300]); 
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 150]); 
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -150]); 
  const scaleFaceRaw = useTransform(scrollYProgress, [0, 0.8], [1, 2.5]);

  const springConfig = { damping: 25, stiffness: 100, mass: 0.5, restDelta: 0.0001 };

  const smoothY1 = useSpring(y1, springConfig);
  const smoothY2 = useSpring(y2, springConfig);
  const smoothY3 = useSpring(y3, springConfig);
  const scaleFace = useSpring(scaleFaceRaw, springConfig);

  // === B. 3D Tilt Setup ===
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const tiltXSpring = useSpring(tiltX, { stiffness: 100, damping: 30 });
  const tiltYSpring = useSpring(tiltY, { stiffness: 100, damping: 30 });
  
  const rotateX = useTransform(tiltYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(tiltXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  // === C. Mask Reveal Setup ===
  const maskX = useMotionValue(0);
  const maskY = useMotionValue(0);
  const maskRadius = useMotionValue(0);
  const smoothRadius = useSpring(maskRadius, { damping: 25, stiffness: 200 });

  // RAF guard: ensures mousemove only processes once per animation frame
  const rafPending = useRef(false);

  const handleMouseMove = (e) => {
    if (rafPending.current) return;
    rafPending.current = true;
    requestAnimationFrame(() => {
      rafPending.current = false;
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      tiltX.set((e.clientX - rect.left) / rect.width - 0.5);
      tiltY.set((e.clientY - rect.top) / rect.height - 0.5);
      maskX.set(e.clientX - rect.left);
      maskY.set(e.clientY - rect.top);
    });
  };

  const handleMouseEnter = () => {
    maskRadius.set(80);
  };

  const handleMouseLeave = () => {
    tiltX.set(0);
    tiltY.set(0);
    maskRadius.set(0);
  };

  const maskImage = useMotionTemplate`radial-gradient(${smoothRadius}px circle at ${maskX}px ${maskY}px, black 50%, transparent 100%)`;

  return (
    <section 
      ref={containerRef} 
      id="hero"
      className="relative h-[250svh] bg-black w-full"
    >
      <div className="sticky top-0 h-[100svh] w-full flex items-center justify-center overflow-hidden">
      
      {/* 1. Background Text */}
      <motion.h1 
        style={{ y: smoothY1, willChange: "transform" }}
        className="absolute text-[15vw] font-black text-[#1a1a1a] uppercase select-none z-0 tracking-tighter"
      >
        BINYAM
      </motion.h1>

      {/* 2. 3D Tilting Image + Glow */}
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          y: smoothY2,
          scale: scaleFace,
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
        className="relative w-[300px] md:w-[450px] aspect-[3/4] z-10 cursor-crosshair"
      >
        {/* Pulsing Neon Glow */}
        <div className="absolute inset-0 bg-[#3fff3f]/15 blur-[100px] rounded-full scale-125 z-0 pointer-events-none" />

        {/* Layer 1: Base Image — LCP element, load eagerly */}
        <img
          src={faceSrc}
          alt="Binyam — Creative Developer"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="relative absolute inset-0 w-full h-full object-cover z-10"
          style={{ transform: "translateZ(30px)" }}
        />

        {/* Layer 2: Reveal Image (Helmet) */}
        <motion.div
          className="absolute inset-0 w-full h-full z-20 pointer-events-none"
          style={{
            WebkitMaskImage: maskImage,
            maskImage: maskImage,
            transform: "translateZ(31px)",
          }}
        >
          <img
            src={helmetSrc}
            alt=""
            aria-hidden="true"
            loading="eager"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </motion.div>
      </motion.div>

      {/* 3. Foreground Text */}
      <motion.div 
        style={{ y: smoothY3, willChange: "transform" }} 
        className="absolute inset-0 flex flex-col items-center justify-center text-center z-30 pointer-events-none mt-[8vh]"
      >
        <h2 className="text-[7vw] font-black text-white leading-[0.85] uppercase tracking-tighter drop-shadow-xl">
          CREATIVE<br />DEVELOPER
        </h2>
        <p className="mt-8 text-sm font-mono text-[#3fff3f] uppercase tracking-widest opacity-70">
          Scroll to explore
        </p>
      </motion.div>
      
      </div>
    </section>
  );
};

export default LandoHoverFace;