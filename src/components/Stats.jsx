import { useRef, useState, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, Html, Box, Torus, Octahedron, Dodecahedron, MeshDistortMaterial, Stars } from "@react-three/drei";
import * as THREE from "three";
import styles from "./Stats.module.scss";

const statItems = [
  { label: "Years Experience", value: "1.5", suffix: "+", color: "#39FF14", distance: 3.5, speed: 0.4, size: 0.5, shape: "dodecahedron" },
  { label: "Projects Completed", value: "120", suffix: "", color: "#00ffff", distance: 5.5, speed: 0.25, size: 0.5, shape: "box" },
  { label: "Global Clients", value: "45", suffix: "", color: "#ff00ff", distance: 7.5, speed: 0.15, size: 0.4, shape: "torus" },
  { label: "Awards Won", value: "08", suffix: "", color: "#ffaa00", distance: 9.5, speed: 0.1, size: 0.4, shape: "octahedron" },
];

// Shared Vector3 to avoid `new THREE.Vector3()` allocation every frame (GC pressure)
const _scaleVec = new THREE.Vector3();

function OrbitRing({ radius }) {
  const lineGeometry = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 64; i++) {
        const angle = (i / 64) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
    }
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [radius]);

  return (
    <line geometry={lineGeometry}>
      <lineBasicMaterial color="#ffffff" transparent opacity={0.1} />
    </line>
  );
}

function Planet({ item }) {
  const groupRef = useRef();
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const angleRef = useRef(Math.random() * Math.PI * 2);

  useFrame((state, delta) => {
    if (!hovered) {
      angleRef.current += delta * item.speed;
    }

    const x = Math.cos(angleRef.current) * item.distance;
    const z = Math.sin(angleRef.current) * item.distance;
    groupRef.current.position.set(x, 0, z);

    if (meshRef.current) {
      meshRef.current.rotation.y += delta;
      meshRef.current.rotation.x += delta * 0.5;
    }

    // Use the shared _scaleVec instead of allocating a new Vector3 each frame
    const targetScale = hovered ? 1.5 : 1;
    _scaleVec.set(targetScale, targetScale, targetScale);
    groupRef.current.scale.lerp(_scaleVec, delta * 5);
  });

  const materialProps = {
    color: hovered ? "#ffffff" : item.color,
    wireframe: true,
    emissive: hovered ? item.color : "#000000",
    emissiveIntensity: hovered ? 2 : 0,
  };

  const renderShape = () => {
    switch(item.shape) {
      case "box": return <Box ref={meshRef} args={[item.size, item.size, item.size]}><meshStandardMaterial {...materialProps} /></Box>;
      case "torus": return <Torus ref={meshRef} args={[item.size, item.size * 0.3, 16, 32]}><meshStandardMaterial {...materialProps} /></Torus>;
      case "octahedron": return <Octahedron ref={meshRef} args={[item.size, 0]}><meshStandardMaterial {...materialProps} /></Octahedron>;
      case "dodecahedron": return <Dodecahedron ref={meshRef} args={[item.size, 0]}><meshStandardMaterial {...materialProps} /></Dodecahedron>;
      default: return <Sphere ref={meshRef} args={[item.size, 32, 32]}><meshStandardMaterial {...materialProps} /></Sphere>;
    }
  };

  return (
    <>
      <OrbitRing radius={item.distance} />
      <group ref={groupRef}>
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
          {renderShape()}
        </group>

        <Html distanceFactor={15} center position={[0, item.size + 1.5, 0]}>
          <div
            className={styles.tooltip}
            style={{
              background: 'rgba(10, 10, 10, 0.85)',
              border: `1px solid ${hovered ? item.color : 'rgba(255,255,255,0.1)'}`,
              padding: '10px 16px',
              borderRadius: '12px',
              textAlign: 'center',
              backdropFilter: 'blur(4px)',
              transform: hovered ? 'scale(1.1) translateY(-10px)' : 'scale(1)',
              boxShadow: hovered ? `0 0 20px ${item.color}40` : 'none',
              opacity: hovered ? 1 : 0.6
            }}
          >
            <div className={styles.tooltipValue} style={{ color: hovered ? item.color : 'white' }}>
              {item.value}<span style={{ color: item.color }}>{item.suffix}</span>
            </div>
            <div className={styles.tooltipLabel}>
              {item.label}
            </div>
          </div>
        </Html>
      </group>
    </>
  );
}

function ITParkGlobe() {
  const globeRef = useRef();

  useFrame((state, delta) => {
    globeRef.current.rotation.y -= delta * 0.1;
    globeRef.current.rotation.x -= delta * 0.05;
  });

  const buildings = useMemo(() => {
    const b = [];
    for (let i = 0; i < 60; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        const r = 1.45;
        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta);
        const z = r * Math.cos(phi);
        const p = new THREE.Vector3(x, y, z);
        const q = new THREE.Quaternion().setFromUnitVectors(
             new THREE.Vector3(0, 1, 0),
             p.clone().normalize()
        );
        b.push({
           position: p,
           quaternion: q,
           height: 0.2 + Math.random() * 0.8,
           isLit: Math.random() > 0.6,
           isWire: Math.random() > 0.8
        });
    }
    return b;
  }, []);

  return (
    <group ref={globeRef}>
      <Sphere args={[1.5, 64, 64]}>
        <MeshDistortMaterial color="#0a0a0a" attach="material" distort={0.2} speed={1.5} roughness={0.9} />
      </Sphere>
      <Sphere args={[1.51, 16, 16]}>
        <meshBasicMaterial color="#39FF14" wireframe transparent opacity={0.15} />
      </Sphere>
      {buildings.map((b, i) => (
        <Box key={i} args={[0.08, b.height, 0.08]} position={b.position} quaternion={b.quaternion}>
          <meshStandardMaterial
            color="#222222"
            emissive={b.isLit ? "#39FF14" : "#000000"}
            emissiveIntensity={b.isLit ? 1.5 : 0}
            wireframe={b.isWire}
          />
        </Box>
      ))}
      <pointLight color="#39FF14" intensity={30} distance={50} />
      <pointLight color="#ffffff" intensity={10} distance={100} />
    </group>
  );
}

function GalaxyBackground() {
  const ref = useRef();

  useFrame((state, delta) => {
    ref.current.rotation.y -= delta * 0.02;
    ref.current.rotation.x -= delta * 0.01;
  });

  return (
    <group ref={ref}>
      <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
    </group>
  );
}

function SolarSystem() {
  return (
    <group>
      <GalaxyBackground />
      <ITParkGlobe />
      {statItems.map((stat, i) => (
        <Planet key={i} item={stat} />
      ))}
    </group>
  );
}

export default function Stats() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin: '200px 0px' }
    );
    const el = sectionRef.current;
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
  }, []);

  return (
    <section id="stats" ref={sectionRef} className={styles.section}>
      <div className={styles.container}>
        <div className={styles.headerRow}>
          <div className={styles.headerLeft}>
            <h3 className={styles.label}>// Performance Data</h3>
            <h2 className={styles.title}>
              Driven by data.<br/>
              <span className={styles.titleFaded}>Designed for impact.</span>
            </h2>
          </div>

          <p className={styles.headerDesc}>
            Drag the solar system to explore the metrics. Hover over a planet to pause its orbit and view full details.
          </p>
        </div>
      </div>

      {/* 3D Canvas Area */}
      <div className={styles.canvasWrap}>
        <div className={styles.canvasGlow} />

        <Canvas
          camera={{ position: [0, 8, 16], fov: 45 }}
          style={{ visibility: isVisible ? 'visible' : 'hidden' }}
        >
          <ambientLight intensity={0.2} />

          <SolarSystem />

          <OrbitControls
            enablePan={false}
            enableZoom={false}
            autoRotate
            autoRotateSpeed={0.5}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2}
          />
        </Canvas>
      </div>
    </section>
  );
}
