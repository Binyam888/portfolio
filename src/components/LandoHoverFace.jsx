import React, { useRef } from "react";
import { 
  motion, 
  useMotionValue, 
  useSpring, 
  useTransform, 
  useMotionTemplate,
  useScroll // Add useScroll for parallax
} from "framer-motion";



const LandoHoverFace = ({ faceSrc, helmetSrc }) => {
  const ref = useRef(null);

  // === A. Parallax Scroll Setup ===
  const containerRef = useRef(null);
  
  // 1. Track scroll progress of the tall container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"] // 0 at top of viewport, 1 at bottom
  });

  // 2. Create distinct vertical movement (Y) for each layer based on progress [0 to 1]
  // Layer 1 (Watermark): Subtle movement down
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 300]); 
  // Layer 2 (Image + Glow): Moderate movement down
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 150]); 
  // Layer 3 (Foreground Text): Fast movement up
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -150]); 
  
  // Scale effect for the image to grow bigger when scrolling
  const scaleFace = useTransform(scrollYProgress, [0, 0.8], [1, 2.5]);

  // Smooth out the parallax slightly with a spring
  const smoothY1 = useSpring(y1, { damping: 25, stiffness: 100 });
  const smoothY2 = useSpring(y2, { damping: 25, stiffness: 100 });
  const smoothY3 = useSpring(y3, { damping: 25, stiffness: 100 });


  // === B. 3D Tilt Setup (Original, Unchanged) ===
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const tiltXSpring = useSpring(tiltX, { stiffness: 100, damping: 30 });
  const tiltYSpring = useSpring(tiltY, { stiffness: 100, damping: 30 });
  
  const rotateX = useTransform(tiltYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(tiltXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  // === C. Mask Reveal Setup (Original, Unchanged) ===
  const maskX = useMotionValue(0);
  const maskY = useMotionValue(0);
  const maskRadius = useMotionValue(0);
  const smoothRadius = useSpring(maskRadius, { damping: 25, stiffness: 200 });

  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    
    // Tilt calculations (relative to center)
    tiltX.set((e.clientX - rect.left) / rect.width - 0.5);
    tiltY.set((e.clientY - rect.top) / rect.height - 0.5);

    // Mask calculations (relative to top-left)
    maskX.set(e.clientX - rect.left);
    maskY.set(e.clientY - rect.top);
  };

  const handleMouseEnter = () => {
    maskRadius.set(80); // Size of the "flashlight"
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
      className="relative h-[250vh] bg-black w-full"
    >
      {/* Sticky wrapper pinning content to the viewport while parallax completes */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
      
      {/* 1. Background Text (y1: Subtle Parallax) */}
      <motion.h1 
        style={{ y: smoothY1, willChange: "transform" }}
        className="absolute text-[15vw] font-black text-[#1a1a1a] uppercase select-none z-0 tracking-tighter"
      >
        BINYAM
      </motion.h1>

      {/* 2. 3D Tilting Image + Glow (y2: Medium Parallax) */}
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          y: smoothY2, // Apply scroll parallax
          scale: scaleFace,
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
        className="relative w-[300px] md:w-[450px] aspect-[3/4] z-10 cursor-crosshair"
      >
        {/* Pulsing Neon Glow */}
        <div className="absolute inset-0 bg-[#3fff3f]/15 blur-[100px] rounded-full scale-125 z-0 pointer-events-none" />

        {/* Layer 1: Base Image (Your Face) */}
        <img
          src={faceSrc}
          alt="Base Face"
          className="relative absolute inset-0 w-full h-full object-cover z-10 transition-transform duration-500 hover:scale-[1.03]"
          style={{ transform: "translateZ(30px)" }} // Pops the image off the background slightly
        />

        {/* Layer 2: Reveal Image (The Helmet) */}
        <motion.div
          className="absolute inset-0 w-full h-full z-20 pointer-events-none"
          style={{
            WebkitMaskImage: maskImage,
            maskImage: maskImage,
            transform: "translateZ(31px)", // Sits exactly 1px above the base face
          }}
        >
          <img
            src={helmetSrc}
            alt="Hover Helmet"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </motion.div>
      </motion.div>

      {/* 3. Foreground Text (y3: Fast Parallax - New from image_6.png) */}
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