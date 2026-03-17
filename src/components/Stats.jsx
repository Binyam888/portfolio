import { useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, Html, Box, Torus, Octahedron, Dodecahedron, MeshDistortMaterial, Stars } from "@react-three/drei";
import * as THREE from "three";

const statItems = [
  { label: "Years Experience", value: "1.5", suffix: "+", color: "#39FF14", distance: 3.5, speed: 0.4, size: 0.5, shape: "dodecahedron" },
  { label: "Projects Completed", value: "120", suffix: "", color: "#00ffff", distance: 5.5, speed: 0.25, size: 0.5, shape: "box" },
  { label: "Global Clients", value: "45", suffix: "", color: "#ff00ff", distance: 7.5, speed: 0.15, size: 0.4, shape: "torus" },
  { label: "Awards Won", value: "08", suffix: "", color: "#ffaa00", distance: 9.5, speed: 0.1, size: 0.4, shape: "octahedron" },
];

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
  
  // Random starting angle for the orbit
  const angleRef = useRef(Math.random() * Math.PI * 2);

  useFrame((state, delta) => {
    // Stop orbiting when hovered
    if (!hovered) {
      angleRef.current += delta * item.speed;
    }
    
    // Orbital rotation positioning
    const x = Math.cos(angleRef.current) * item.distance;
    const z = Math.sin(angleRef.current) * item.distance;
    groupRef.current.position.set(x, 0, z);
    
    // Planet's own axis rotation
    if (meshRef.current) {
      meshRef.current.rotation.y += delta;
      meshRef.current.rotation.x += delta * 0.5;
    }

    // Smooth scaling on hover
    const targetScale = hovered ? 1.5 : 1;
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 5);
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

        {/* Info Label attached to the planet */}
        <Html distanceFactor={15} center position={[0, item.size + 1.5, 0]}>
          <div 
            className="pointer-events-none transition-all duration-300"
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
            <div className="text-2xl font-black mb-1" style={{ color: hovered ? item.color : 'white' }}>
              {item.value}<span style={{ color: item.color }}>{item.suffix}</span>
            </div>
            <div className="text-[10px] uppercase tracking-[0.15em] opacity-60 text-white font-medium whitespace-nowrap">
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

  // Procedurally generate "buildings" standing directly upwards from the surface of the globe
  const buildings = useMemo(() => {
    const b = [];
    for (let i = 0; i < 60; i++) {
        const theta = Math.random() * Math.PI * 2; // Longitude
        const phi = Math.acos((Math.random() * 2) - 1); // Latitude
        
        const r = 1.45; // Start just inside the sphere
        
        // Convert spherical coords to cartesian based on center of globe
        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta);
        const z = r * Math.cos(phi);
        const p = new THREE.Vector3(x, y, z);
        
        // Calculate the quaternion so the top of the box points away from the center (origin)
        const q = new THREE.Quaternion().setFromUnitVectors(
             new THREE.Vector3(0, 1, 0), // Default Box Y-axis
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
      {/* Base "Cyber" Earth */}
      <Sphere args={[1.5, 64, 64]}>
        <MeshDistortMaterial color="#0a0a0a" attach="material" distort={0.2} speed={1.5} roughness={0.9} />
      </Sphere>
      
      {/* Wireframe overlay to look technological */}
      <Sphere args={[1.51, 16, 16]}>
        <meshBasicMaterial color="#39FF14" wireframe transparent opacity={0.15} />
      </Sphere>

      {/* Buildings sticking out of the planet surface */}
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

      {/* Core neon light emanating from the IT Park */}
      <pointLight color="#39FF14" intensity={30} distance={50} />
      <pointLight color="#ffffff" intensity={10} distance={100} />
    </group>
  );
}

function GalaxyBackground() {
  const ref = useRef();
  
  useFrame((state, delta) => {
    // Add a very subtle continuous rotation to the starfield
    ref.current.rotation.y -= delta * 0.02;
    ref.current.rotation.x -= delta * 0.01;
  });

  return (
    <group ref={ref}>
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
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
  return (
    <section id="stats" className="py-32 bg-dark-gray relative z-10 border-t border-white/5 overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 relative z-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
          <div className="max-w-xl">
            <h3 className="text-neon-green font-bold tracking-widest uppercase mb-4 text-sm">
              // Performance Data
            </h3>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight text-white uppercase">
              Driven by data.<br/>
              <span className="text-white/50 uppercase">Designed for impact.</span>
            </h2>
          </div>
          
          <p className="text-white/60 max-w-sm md:text-right">
            Drag the solar system to explore the metrics. Hover over a planet to pause its orbit and view full details.
          </p>
        </div>
      </div>

      {/* 3D Canvas Area */}
      <div className="w-full h-[600px] mt-[-20px] cursor-grab active:cursor-grabbing relative">
        {/* Subtle background glow */}
        <div className="absolute inset-0 bg-neon-green/5 blur-[120px] rounded-full scale-150 pointer-events-none" />
        
        <Canvas camera={{ position: [0, 8, 16], fov: 45 }}>
          <ambientLight intensity={0.2} />
          
          <SolarSystem />

          {/* Allows user to drag/rotate the entire solar system */}
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
