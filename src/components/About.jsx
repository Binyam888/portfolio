import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { Bike } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import styles from "./About.module.scss";

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
          end: "+=150%",
          pin: true,
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

    // Mobile: No pinning
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
          start: "top 60%",
          end: "bottom 40%",
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
    <section id="about" ref={containerRef} className={styles.section}>

      {/* Background ambient text */}
      <div className={styles.bgText}>WHO AM I</div>

      <div className={styles.container}>
        <motion.div
           initial={{ opacity: 0, y: 50 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8 }}
           className={styles.heading}
        >
          <h3 className={styles.label}>// About Me</h3>
          <h2 className={styles.name}>
            Mohammed <br/><span className={styles.nameFaded}>Binyamin</span>
          </h2>
        </motion.div>

        <div className={styles.flexRow}>

          {/* Left Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={styles.leftCol}
          >
            <p className={styles.descMain}>
              I am a passionate <strong>Creative Developer</strong> focused on crafting immersive, high-performance web experiences. Merging deep technical expertise with a sharp eye for design aesthetics.
            </p>
            <p className={styles.descSub}>
              Armed with a Bachelor of Technology in Computer Science from Visvesvaraya Technological University, my foray into the technological realm is marked by a keen expertise in User Interface Design and REST APIs. The toolkit I've honed is a product of both comprehensive academic grounding and a self-directed deep dive into the intricacies of the MERN stack.
            </p>

            <div ref={timelineRef} className={styles.timeline}>
              {/* Highlighted track */}
              <div className={styles.track} />

              {/* The Moving Bike SVG */}
              <div ref={bikeRef} className={styles.bikeIcon}>
                <Bike />
              </div>

              {experiences.map((exp, i) => (
                <div
                  ref={(el) => (ringsRef.current[i] = el)}
                  key={i}
                  className={styles.expItem}
                >
                  <div
                    ref={(el) => (ringDotsRef.current[i] = el)}
                    className={styles.expDot}
                  />
                  <h4 className={styles.expRole}>{exp.role}</h4>
                  <div className={styles.expMeta}>
                    <span className={styles.expCompany}>{exp.company}</span>
                    <span className={styles.expDivider}>•</span>
                    <span className={styles.expDuration}>{exp.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right 3D Interactive Card */}
          <div className={styles.rightCol}>
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
              className={styles.tiltCard}
            >
              <div className={styles.cardNoise} style={{ transform: "translateZ(1px)" }} />

              {/* Glowing Orb Behind Card */}
              <div className={styles.cardGlow} />

              {/* 3D Floating Elements Inside Card */}
              <div className={styles.cardInitialsWrap}>
                <motion.div
                  className={styles.cardInitials}
                  style={{ transform: "translateZ(60px)" }}
                >
                  BM
                </motion.div>
              </div>

              <div className={styles.cardContent} style={{ transform: "translateZ(80px)" }}>
                <div className={styles.cardAccent} />
                <h3 className={styles.cardTitle}>Let's Connect</h3>
                <p className={styles.cardDesc}>Currently open for new opportunities and exciting collaborations.</p>
                <a
                  href="https://www.linkedin.com/in/mohammedbinyamin/"
                  target="_blank"
                  rel="noreferrer"
                  className={styles.cardLink}
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
