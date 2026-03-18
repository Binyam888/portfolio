import React, { useState, Suspense, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, Html, Float, Text, ContactShadows, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import styles from './PortfolioScene.module.scss';

const SKILLS = [
  {
    name: "React",
    icon: "⚛",
    color: "#61DAFB",
    description: "Component-based UI for interactive web apps",
    position: [-3.2, 1.9, -2.5],
  },
  {
    name: "Next.js",
    icon: "▲",
    color: "#ffffff",
    description: "Full-stack React framework with SSR & routing",
    position: [-2.0, 2.6, -3.0],
  },
  {
    name: "WordPress",
    icon: "W",
    color: "#21759B",
    description: "Custom themes, plugins & headless CMS builds",
    position: [-0.8, 3.2, -3.5],
  },
  {
    name: "PHP",
    icon: "🐘",
    color: "#777BB4",
    description: "Server-side scripting & REST API development",
    position: [0.8, 3.2, -3.5],
  },
  {
    name: "Strapi",
    icon: "◎",
    color: "#4945FF",
    description: "Headless CMS for flexible content APIs",
    position: [2.0, 2.6, -3.0],
  },
  {
    name: "JS",
    icon: "JS",
    color: "#F7DF1E",
    description: "Modern ES2024+ — async, modules, performance",
    position: [3.2, 1.9, -2.5],
  },
  {
    name: "Sass",
    icon: "✦",
    color: "#CF649A",
    description: "Advanced CSS with variables & mixins",
    position: [3.8, 0.6, -2.0],
  },
  {
    name: "MongoDB",
    icon: "🍃",
    color: "#4DB33D",
    description: "NoSQL document database for scalable apps",
    position: [-3.8, 0.6, -2.0],
  },
  {
    name: "Express",
    icon: "⚡",
    color: "#aaaaaa",
    description: "Minimal Node.js framework for REST services",
    position: [-3.0, -0.8, -1.0],
  },
  {
    name: "Node.js",
    icon: "⬡",
    color: "#68A063",
    description: "Server-side JS runtime for high-performance APIs",
    position: [-1.8, -1.6, -0.5],
  },
  {
    name: "GitHub",
    icon: "◉",
    color: "#ffffff",
    description: "Version control, CI/CD & collaboration",
    position: [1.8, -1.6, -0.5],
  },
  {
    name: "Postman",
    icon: "✉",
    color: "#FF6C37",
    description: "API testing, automation & documentation",
    position: [3.0, -0.8, -1.0],
  },
  {
    name: "AI",
    icon: "✦",
    color: "#39FF14",
    description: "LLM integration, prompt engineering & AI tooling",
    position: [4.2, -0.6, -1.5],
  },
];

function SkillNode({ skill }) {
  const [hovered, setHovered] = useState(false);
  const { name, icon, color, description, position } = skill;

  return (
    <Float
      speed={hovered ? 0.3 : 1.8}
      rotationIntensity={hovered ? 0 : 0.15}
      floatIntensity={hovered ? 0.05 : 0.6}
      position={position}
    >
      <group
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
      >
        {/* Main pill */}
        <RoundedBox args={[1.1, 0.35, 0.08]} radius={0.08} smoothness={4}>
          <meshStandardMaterial
            color={hovered ? color : "#111111"}
            metalness={0.6}
            roughness={0.2}
            emissive={hovered ? color : color}
            emissiveIntensity={hovered ? 0.35 : 0.04}
          />
        </RoundedBox>

        {/* Colored left accent bar */}
        <mesh position={[-0.46, 0, 0.046]}>
          <boxGeometry args={[0.04, 0.22, 0.01]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.2} />
        </mesh>

        {/* Skill name text */}
        <Text
          fontSize={0.11}
          color={hovered ? "#000000" : "#ffffff"}
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
          position={[0.07, 0, 0.05]}
          letterSpacing={0.03}
        >
          {name}
        </Text>

        {/* HTML tooltip — expands smoothly on hover */}
        <Html
          distanceFactor={14}
          center
          position={[0, -0.55, 0]}
          style={{ pointerEvents: 'none' }}
          zIndexRange={[10, 0]}
        >
          <div
            style={{
              width: '160px',
              overflow: 'hidden',
              maxHeight: hovered ? '100px' : '0px',
              opacity: hovered ? 1 : 0,
              transform: hovered ? 'translateY(0px) scaleY(1)' : 'translateY(-8px) scaleY(0.85)',
              transformOrigin: 'top center',
              transition: 'max-height 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.3s ease, transform 0.3s ease',
            }}
          >
            <div
              style={{
                background: 'rgba(6, 6, 6, 0.92)',
                border: `1px solid ${color}55`,
                borderTop: `2px solid ${color}`,
                borderRadius: '8px',
                padding: '8px 12px',
                boxShadow: `0 4px 24px ${color}22, 0 0 0 1px rgba(255,255,255,0.03)`,
                backdropFilter: 'blur(8px)',
                marginTop: '6px',
              }}
            >
              {/* Icon + name row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '5px' }}>
                <span style={{ fontSize: '13px' }}>{icon}</span>
                <span style={{ color, fontSize: '11px', fontWeight: '800', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  {name}
                </span>
              </div>
              {/* Description */}
              <p style={{
                color: 'rgba(255,255,255,0.65)',
                fontSize: '10px',
                lineHeight: '1.5',
                margin: 0,
                fontFamily: 'system-ui, sans-serif',
              }}>
                {description}
              </p>
            </div>
          </div>
        </Html>
      </group>
    </Float>
  );
}

function AvatarModel(props) {
  const { nodes, scene } = useGLTF('/model-2.glb');

  useEffect(() => {
    scene.rotation.set(0, 0, 0);
    if (nodes.LeftArm) nodes.LeftArm.rotation.set(1.47, 0.56, 0.01);
    if (nodes.RightArm) nodes.RightArm.rotation.set(1.36, -0.42, -0.10);

    const fingers = ['Index', 'Middle', 'Ring', 'Pinky'];
    if (nodes.LeftHand) nodes.LeftHand.rotation.z = 0.1;
    fingers.forEach(finger => {
      if (nodes[`LeftHand${finger}1`]) nodes[`LeftHand${finger}1`].rotation.z = 0.3;
      if (nodes[`LeftHand${finger}2`]) nodes[`LeftHand${finger}2`].rotation.z = 0.2;
    });
    if (nodes.LeftHandThumb1) nodes.LeftHandThumb1.rotation.y = 0.2;
    if (nodes.RightHand) nodes.RightHand.rotation.z = -0.1;
    fingers.forEach(finger => {
      if (nodes[`RightHand${finger}1`]) nodes[`RightHand${finger}1`].rotation.z = -0.3;
      if (nodes[`RightHand${finger}2`]) nodes[`RightHand${finger}2`].rotation.z = -0.2;
    });
    if (nodes.RightHandThumb1) nodes.RightHandThumb1.rotation.y = -0.2;
  }, [nodes, scene]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    let targetBodyY = (state.pointer.x * Math.PI) / 10;
    let targetBodyX = -(state.pointer.y * Math.PI) / 20;
    targetBodyY = THREE.MathUtils.clamp(targetBodyY, -Math.PI / 6, Math.PI / 6);
    targetBodyX = THREE.MathUtils.clamp(targetBodyX, -Math.PI / 10, Math.PI / 10);
    scene.rotation.y = THREE.MathUtils.lerp(scene.rotation.y, targetBodyY, 2 * delta);
    scene.rotation.x = THREE.MathUtils.lerp(scene.rotation.x, targetBodyX, 2 * delta);

    const head = nodes.Head || scene.getObjectByName('Head');
    if (head) {
      let targetHeadX = -(state.pointer.y * Math.PI) / 6;
      let targetHeadY = (state.pointer.x * Math.PI) / 4;
      targetHeadX = THREE.MathUtils.clamp(targetHeadX, -Math.PI / 4, Math.PI / 4);
      targetHeadY = THREE.MathUtils.clamp(targetHeadY, -Math.PI / 3, Math.PI / 3);
      head.rotation.x = THREE.MathUtils.lerp(head.rotation.x, targetHeadX, 5 * delta);
      head.rotation.y = THREE.MathUtils.lerp(head.rotation.y, targetHeadY, 5 * delta);
    }

    const spine = nodes.Spine || nodes.mixamorigSpine || scene.getObjectByName('Spine');
    if (spine) spine.rotation.x = Math.sin(t * 1.5) * 0.02;

    if (nodes.LeftArm) nodes.LeftArm.rotation.set(1.47 + Math.sin(t * 1.2) * 0.02, 0.56, 0.01 + Math.sin(t * 0.8) * 0.03);
    if (nodes.RightArm) nodes.RightArm.rotation.set(1.36 + Math.sin(t * 1.1) * 0.02, -0.42, -0.10 + Math.cos(t * 0.9) * 0.03);
    if (nodes.LeftHand) nodes.LeftHand.rotation.z = Math.sin(t * 2) * 0.04;
    if (nodes.RightHand) nodes.RightHand.rotation.z = Math.cos(t * 2.2) * 0.04;
  });

  return (
    <group {...props} dispose={null}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload('/model-2.glb');

export default function PortfolioScene() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin: '300px 0px' }
    );
    const el = sectionRef.current;
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
  }, []);

  return (
    <section
      id="skills-scene"
      ref={sectionRef}
      className={styles.section}
    >
      {/* Background image */}
      <div
        className={styles.bgImage}
        style={{ backgroundImage: 'url(/portfolio-bg.png)' }}
      />

      {/* Radial vignette */}
      <div className={styles.vignette} />

      {/* Top/bottom gradient fade */}
      <div className={styles.gradientFade} />

      {/* Section label — top left */}
      <div className={styles.sectionLabel}>
        <p className={styles.labelTag}>// Tech Stack</p>
        <h2 className={styles.sectionTitle}>
          Skills &amp; <span className={styles.titleAccent}>Tools</span>
        </h2>
      </div>

      {/* Hint text — bottom center */}
      <div className={styles.hintText}>
        <p>Hover a skill for details</p>
      </div>

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0.5, 6], fov: 45 }}
        className={styles.canvas}
        style={{ visibility: isVisible ? 'visible' : 'hidden' }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[2, 5, 5]} intensity={1.2} color="#ffffff" />
        {/* Neon underfoot glow */}
        <pointLight position={[0, -0.8, 0]} intensity={4.0} distance={3} color="#39FF14" />
        {/* Cool rim light */}
        <pointLight position={[-4, 2, 2]} intensity={1.5} distance={8} color="#00e5ff" />

        <Suspense fallback={<Html center><div className={styles.loadingText}>LOADING SCENE...</div></Html>}>
          <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.15}>
            <group position={[0, -0.5, 0]}>
              <ContactShadows
                position={[0, -1.0, 0]}
                opacity={0.85}
                scale={3}
                blur={2.5}
                far={1.5}
                resolution={256}
                color="#000000"
              />
              <AvatarModel position={[0, -1, 0]} />
              {SKILLS.map((skill, index) => (
                <SkillNode key={index} skill={skill} />
              ))}
            </group>
          </Float>
          <Environment preset="night" />
        </Suspense>
      </Canvas>
    </section>
  );
}