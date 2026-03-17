import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { Bike } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const containerRef = useRef(null);
  const timelineRef = useRef(null);
  const bikeRef = useRef(null);
  const tiltCardRef = useRef(null);
  const ringsRef = useRef([]);
  const ringDotsRef = useRef([]);

  // === 3D Tilt Setup (Framer Motion) ===
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e) => {
    if (!tiltCardRef.current) return;
    const rect = tiltCardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // === GSAP ScrollTrigger ===
  useGSAP(() => {
    const getBikeY = (i) => {
      if (!ringsRef.current[i] || !ringDotsRef.current[i] || !bikeRef.current) return 0;
      const groupTop = ringsRef.current[i].offsetTop;
      const dotTop = ringDotsRef.current[i].offsetTop;
      const dotHeight = ringDotsRef.current[i].offsetHeight;
      const bikeHeight = bikeRef.current.offsetHeight;
      return groupTop + dotTop + (dotHeight / 2) - (bikeHeight / 2);
    };

    let mm = gsap.matchMedia();

    // Desktop/Tablet: Pin the whole section & ride bike
    mm.add("(min-width: 1024px)", () => {
      gsap.set(bikeRef.current, { y: getBikeY(0) });
      gsap.set(ringDotsRef.current[0], { 
        borderColor: "rgba(57,255,20,1)", 
        backgroundColor: "rgba(57,255,20,0.2)",
        boxShadow: "0 0 10px rgba(57,255,20,0.5)" 
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "center center",
          end: "+=150%", // How long to stay pinned
          pin: true,
          scrub: 1, // Smooth scrub
          invalidateOnRefresh: true, // Recalculate on window resize
        }
      });

      for (let i = 1; i < experiences.length; i++) {
        tl.to(bikeRef.current, {
          y: () => getBikeY(i),
          ease: "none",
          duration: 1
        });
        tl.to(ringDotsRef.current[i], {
          borderColor: "rgba(57,255,20,1)", 
          backgroundColor: "rgba(57,255,20,0.2)",
          boxShadow: "0 0 10px rgba(57,255,20,0.5)",
          duration: 0.1
        }, ">-0.1");
      }
    });

    // Mobile: No pinning to prevent overlap breaking, bike rides as you scroll past
    mm.add("(max-width: 1023px)", () => {
      gsap.set(bikeRef.current, { y: getBikeY(0) });
      gsap.set(ringDotsRef.current[0], { 
        borderColor: "rgba(57,255,20,1)", 
        backgroundColor: "rgba(57,255,20,0.2)",
        boxShadow: "0 0 10px rgba(57,255,20,0.5)" 
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: timelineRef.current,
          start: "top 60%", // Start animating when timeline top hits passing point
          end: "bottom 40%", // Finish animation when timeline bottom hits here
          scrub: 1,
          invalidateOnRefresh: true,
        }
      });

      for (let i = 1; i < experiences.length; i++) {
        tl.to(bikeRef.current, {
          y: () => getBikeY(i),
          ease: "none",
          duration: 1
        });
        tl.to(ringDotsRef.current[i], {
          borderColor: "rgba(57,255,20,1)", 
          backgroundColor: "rgba(57,255,20,0.2)",
          boxShadow: "0 0 10px rgba(57,255,20,0.5)",
          duration: 0.1
        }, ">-0.1");
      }
    });
  }, { scope: containerRef });

  const experiences = [
    { role: "Senior Frontend Engineer", company: "Tech Innovators", duration: "2022 - Present" },
    { role: "Creative Developer", company: "Design Studio X", duration: "2019 - 2022" },
    { role: "Web Developer", company: "Digital Solutions", duration: "2017 - 2019" },
  ];

  return (
    <section id="about" ref={containerRef} className="bg-deep-charcoal relative z-10 border-t border-white/5 w-full min-h-screen flex items-center py-20 lg:py-0 overflow-hidden">
      
      {/* Background ambient text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15vw] md:text-[12vw] font-black uppercase tracking-tighter text-white/5 pointer-events-none whitespace-nowrap z-0">
        WHO AM I
      </div>

      <div className="container mx-auto md:pt-[50px] px-6 md:px-12 relative z-10">
        <motion.div
           initial={{ opacity: 0, y: 50 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8 }}
           className="mb-8 md:mb-12 pt-12 lg:pt-0 text-center md:text-left"
        >
          <h3 className="text-neon-green font-bold tracking-widest uppercase mb-2 text-xs md:text-sm">
            // About Me
          </h3>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tight leading-none uppercase">
            Mohammed <br/><span className="text-white/50">Binyamin</span>
          </h2>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center lg:items-start justify-between">
          
          {/* Left Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full lg:w-1/2"
          >
            <p className="text-lg md:text-xl text-white/70 leading-relaxed font-light mb-6">
              I am a passionate <strong className="text-white font-medium">Creative Developer</strong> focused on crafting immersive, high-performance web experiences. Merging deep technical expertise with a sharp eye for design aesthetics.
            </p>
            <p className="text-sm md:text-base text-white/50 leading-relaxed mb-8">
              Armed with a Bachelor of Technology in Computer Science from Visvesvaraya Technological University, my foray into the technological realm is marked by a keen expertise in User Interface Design and REST APIs. The toolkit I've honed is a product of both comprehensive academic grounding and a self-directed deep dive into the intricacies of the MERN stack.
            </p>
            
            <div ref={timelineRef} className="space-y-10 md:space-y-16 border-l w-full border-white/10 pl-8 md:pl-10 relative ml-2 md:ml-4 py-4 md:py-8 pb-12 md:pb-24 h-full">
              {/* Highlighted track */}
              <div className="absolute left-[-2px] top-0 bottom-0 w-[4px] bg-gradient-to-b from-neon-green/80 via-neon-green/30 to-transparent shadow-[0_0_15px_rgba(57,255,20,0.3)]" />
              
              {/* The Moving Bike SVG */}
              <div 
                ref={bikeRef}
                className="absolute left-[-22px] top-0 w-11 h-11 bg-deep-charcoal border-2 border-neon-green rounded-full flex items-center justify-center z-20 text-neon-green drop-shadow-[0_0_15px_rgba(57,255,20,0.8)] will-change-transform"
              >
                <Bike className="w-5 h-5" />
              </div>

              {experiences.map((exp, i) => (
                <div 
                  ref={(el) => (ringsRef.current[i] = el)}
                  key={i} 
                  className="group relative"
                >
                  <div 
                    ref={(el) => (ringDotsRef.current[i] = el)}
                    className="absolute left-[calc(-2rem-6.5px)] md:left-[calc(-2.5rem-6.5px)] top-1.5 md:top-2.5 w-3 h-3 md:w-4 md:h-4 rounded-full bg-deep-charcoal border-2 border-white/20 group-hover:border-neon-green group-hover:bg-neon-green/20 transition-all duration-300 z-10" 
                  />
                  <h4 className="text-xl md:text-2xl font-bold text-white group-hover:text-neon-green transition-colors">{exp.role}</h4>
                  <div className="flex flex-col sm:flex-row sm:items-start sm:items-center gap-1 sm:gap-4 text-sm mt-2 md:mt-3">
                    <span className="text-white/70 text-base md:text-lg">{exp.company}</span>
                    <span className="hidden sm:inline text-white/30">•</span>
                    <span className="text-neon-green/70 font-mono tracking-wider">{exp.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right 3D Interactive Card */}
          <div className="w-full lg:w-1/2 flex justify-center perspective-[1000px] mt-8 lg:mt-0">
            <motion.div
              ref={tiltCardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
                willChange: "transform",
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative w-full max-w-[320px] sm:max-w-md aspect-square rounded-[2rem] bg-gradient-to-br from-white/10 to-white/5 border border-white/10 backdrop-blur-xl p-6 sm:p-8 flex flex-col justify-end group cursor-crosshair drop-shadow-2xl mx-auto"
            >
              <div 
                className="absolute inset-0 bg-noise opacity-30 rounded-[2rem] mix-blend-overlay pointer-events-none" 
                style={{ transform: "translateZ(1px)" }}
              />

              {/* Glowing Orb Behind Card */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-neon-green/20 blur-[80px] rounded-full pointer-events-none -z-10 group-hover:bg-neon-green/30 transition-colors duration-500" />

              {/* 3D Floating Elements Inside Card */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <motion.div 
                  className="text-7xl sm:text-9xl font-black text-white/5"
                  style={{ transform: "translateZ(60px)" }}
                >
                  BM
                </motion.div>
              </div>

              <div 
                style={{ transform: "translateZ(80px)" }}
                className="relative z-10"
              >
                <div className="w-12 sm:w-16 h-1 bg-neon-green mb-4 sm:mb-6 rounded-full" />
                <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mb-2">Let's Connect</h3>
                <p className="text-white/60 text-xs sm:text-sm font-medium">Currently open for new opportunities and exciting collaborations.</p>
                <a 
                  href="https://www.linkedin.com/in/mohammedbinyamin/" 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-block mt-6 sm:mt-8 px-6 sm:px-8 py-3 sm:py-4 bg-white/5 border border-white/10 hover:border-neon-green hover:bg-neon-green/10 text-white font-bold uppercase tracking-widest text-[10px] sm:text-xs rounded-full transition-all duration-300 pointer-events-auto"
                >
                  View LinkedIn
                </a>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
