import React, { useState, Suspense, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, Html, Float, Text, ContactShadows, RoundedBox, Edges } from '@react-three/drei';
import * as THREE from 'three';



const SKILLS = [
  // Shifted all skills DOWN on the Y axis by ~0.6 to prevent them from clipping the top gradient
  { name: "React", position: [-3.2, 1.9, -2.5] },
  { name: "Next.js", position: [-2.0, 2.6, -3.0] },
  { name: "WordPress", position: [-0.8, 3.2, -3.5] },
  { name: "PHP", position: [0.8, 3.2, -3.5] },
  { name: "Strapi", position: [2.0, 2.6, -3.0] },
  { name: "JS", position: [3.2, 1.9, -2.5] },
  { name: "Sass", position: [3.8, 0.6, -2.0] },

  // Lower tier arc
  { name: "MongoDB", position: [-3.8, 0.6, -2.0] },
  { name: "Express", position: [-3.0, -0.8, -1.0] },
  { name: "Node.js", position: [-1.8, -1.6, -0.5] },

  { name: "GitHub", position: [1.8, -1.6, -0.5] },
  { name: "Postman", position: [3.0, -0.8, -1.0] },
  { name: "AI", position: [4.2, -0.6, -1.5] },
];



function SkillNode({ name, position }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Float speed={hovered ? 0.5 : 2} rotationIntensity={hovered ? 0.05 : 0.4} floatIntensity={hovered ? 0.1 : 0.8} position={position}>
      <group
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
      >
        {/* SHRUNK THE BOX: Changed args from [1.1, 0.4, 0.1] to [0.8, 0.25, 0.05] */}
        <RoundedBox
          args={[0.8, 0.25, 0.05]}
          radius={0.05}
          smoothness={4}
          position={[0, 0, -0.05]}
        >
          <meshStandardMaterial
            color={hovered ? "#22cc11" : "#1a1a1a"}
            metalness={0.7}
            roughness={0.15}
            emissive={hovered ? "#116600" : "#000000"}
            emissiveIntensity={hovered ? 0.4 : 0}
          />
        </RoundedBox>

        {/* SHRUNK THE TEXT: Changed fontSize to 0.10 */}
        <Text
          fontSize={0.10}
          color={hovered ? "#000000" : "#ffffff"}
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
          position={[0, 0, 0.01]}
        >
          {name}
        </Text>
      </group>
    </Float>
  );
}

function AvatarModel(props) {
  const { nodes, scene } = useGLTF('/model-2.glb');

  useEffect(() => {
    scene.rotation.set(0, 0, 0);

    // --- FINAL ARM POSES ---
    if (nodes.LeftArm) nodes.LeftArm.rotation.set(1.47, 0.56, 0.01);
    if (nodes.RightArm) nodes.RightArm.rotation.set(1.36, -0.42, -0.10);

    // --- RELAX FINGERS (Removes statue hands) ---
    const fingers = ['Index', 'Middle', 'Ring', 'Pinky'];

    // Left Hand curl
    if (nodes.LeftHand) nodes.LeftHand.rotation.z = 0.1; // Turn palm slightly inward
    fingers.forEach(finger => {
      if (nodes[`LeftHand${finger}1`]) nodes[`LeftHand${finger}1`].rotation.z = 0.3; // First knuckle
      if (nodes[`LeftHand${finger}2`]) nodes[`LeftHand${finger}2`].rotation.z = 0.2; // Second knuckle
    });
    if (nodes.LeftHandThumb1) nodes.LeftHandThumb1.rotation.y = 0.2;

    // Right Hand curl
    if (nodes.RightHand) nodes.RightHand.rotation.z = -0.1; // Turn palm slightly inward
    fingers.forEach(finger => {
      // Note: Right hand Z rotations are usually negative to mirror the left
      if (nodes[`RightHand${finger}1`]) nodes[`RightHand${finger}1`].rotation.z = -0.3;
      if (nodes[`RightHand${finger}2`]) nodes[`RightHand${finger}2`].rotation.z = -0.2;
    });
    if (nodes.RightHandThumb1) nodes.RightHandThumb1.rotation.y = -0.2;

  }, [nodes, scene]);

  useFrame((state, delta) => {
    // Grab the total time the scene has been running (perfect for continuous loops)
    const t = state.clock.elapsedTime;

    // --- 1. FULL BODY SWAY (Mouse Tracking) ---
    let targetBodyY = (state.pointer.x * Math.PI) / 10;
    let targetBodyX = -(state.pointer.y * Math.PI) / 20;
    targetBodyY = THREE.MathUtils.clamp(targetBodyY, -Math.PI / 6, Math.PI / 6);
    targetBodyX = THREE.MathUtils.clamp(targetBodyX, -Math.PI / 10, Math.PI / 10);
    scene.rotation.y = THREE.MathUtils.lerp(scene.rotation.y, targetBodyY, 2 * delta);
    scene.rotation.x = THREE.MathUtils.lerp(scene.rotation.x, targetBodyX, 2 * delta);

    // --- 2. HEAD TRACKING ---
    const head = nodes.Head || scene.getObjectByName('Head');
    if (head) {
      let targetHeadX = -(state.pointer.y * Math.PI) / 6;
      let targetHeadY = (state.pointer.x * Math.PI) / 4;
      targetHeadX = THREE.MathUtils.clamp(targetHeadX, -Math.PI / 4, Math.PI / 4);
      targetHeadY = THREE.MathUtils.clamp(targetHeadY, -Math.PI / 3, Math.PI / 3);
      head.rotation.x = THREE.MathUtils.lerp(head.rotation.x, targetHeadX, 5 * delta);
      head.rotation.y = THREE.MathUtils.lerp(head.rotation.y, targetHeadY, 5 * delta);
    }

    // --- 3. PROCEDURAL IDLE ANIMATIONS (The "Alive" factor) ---

    // Breathing: Very subtle rotation of the spine
    const spine = nodes.Spine || nodes.mixamorigSpine || scene.getObjectByName('Spine');
    if (spine) {
      // Breathes in and out every ~3 seconds
      spine.rotation.x = Math.sin(t * 1.5) * 0.02;
    }

    // Arms: Base Leva values + a tiny sine wave drift
    if (nodes.LeftArm) {
      nodes.LeftArm.rotation.set(
        1.47 + Math.sin(t * 1.2) * 0.02, // Subtle X drift
        0.56,
        0.01 + Math.sin(t * 0.8) * 0.03  // Subtle Z drift
      );
    }

    if (nodes.RightArm) {
      nodes.RightArm.rotation.set(
        1.36 + Math.sin(t * 1.1) * 0.02, // Different speed (1.1) so they don't look robotic
        -0.42,
        -0.10 + Math.cos(t * 0.9) * 0.03 // Using cos instead of sin offsets the timing
      );
    }

    // Hands/Wrists: Tiny finger-area micro-movements
    if (nodes.LeftHand) {
      nodes.LeftHand.rotation.z = Math.sin(t * 2) * 0.04;
    }
    if (nodes.RightHand) {
      nodes.RightHand.rotation.z = Math.cos(t * 2.2) * 0.04;
    }
  });

  return (
    <group {...props} dispose={null}>
      <primitive object={scene} />
    </group>
  );
}



// Add this right above your PortfolioScene function
function CustomIsland(props) {
  // IMPORTANT: Change 'my-island.glb' to the exact name of your file in the public folder!
  const { scene } = useGLTF('/my-island.glb');

  return <primitive object={scene} {...props} />;
}

// Preloading helps the 3D model load faster when the website boots up
useGLTF.preload('/my-island.glb');

useGLTF.preload('/model-2.glb');

export default function PortfolioScene() {
  return (
    <section id="skills-scene" className="relative w-full overflow-hidden border-b border-neon-green/10" style={{ height: '100vh', background: 'transparent' }}>
      <div className="absolute inset-0 bg-gradient-to-b from-deep-charcoal via-transparent to-deep-charcoal opacity-90 z-10 pointer-events-none" />
      <div className="absolute inset-0 opacity-20 pointer-events-none z-0" style={{ backgroundImage: 'url(/bg-subtle-3d.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed', mixBlendMode: 'luminosity' }}></div>

      <Canvas camera={{ position: [0, 0.5, 6], fov: 45 }} className="relative z-10 w-full h-full pt-10">

        {/* You might need to tweak these lights depending on how bright your new GLB is */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 5, 5]} intensity={1.5} color="#ffffff" />
        <pointLight position={[0, -0.8, 0]} intensity={5.0} distance={3} color="#00e5ff" />

        <Suspense fallback={<Html center><div className="text-neon-green font-bold tracking-widest text-sm animate-pulse">LOADING 3D SCENE...</div></Html>}>

          <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.15}>
            <group position={[0, -0.5, 0]}>

              {/* YOUR NEW CUSTOM ISLAND */}
              {/* Y: -1.05 places the surface right beneath his shoes */}
              <CustomIsland position={[0, -2.8, 0]} scale={1} />

              <ContactShadows
                position={[0, -1.0, 0]} // Keep this right at his feet! (His feet are at -1.0)
                opacity={0.8}
                scale={3}
                blur={2}
                far={1.5}
                resolution={512}
                color="#000000"
              />

              {/* THE CHARACTER */}
              <AvatarModel position={[0, -1, 0]} />

              {/* THE SKILLS */}
              {SKILLS.map((skill, index) => (
                <SkillNode key={index} name={skill.name} position={skill.position} />
              ))}

            </group>
          </Float>

          <Environment preset="night" />
        </Suspense>
      </Canvas>
    </section>
  );
}