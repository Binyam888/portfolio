import React, { useState, Suspense, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, Html, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

function AvatarModel(props) {
  const { nodes, scene, animations } = useGLTF('/model-2.glb');
  const { actions } = useAnimations(animations, scene);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    // ✅ FIX 1: Reset any baked-in rotation so the character faces forward
    scene.rotation.set(0, 0, 0);

    if (actions) {
      const firstAnimation = Object.values(actions)[0];
      firstAnimation?.play();
    }
  }, [actions, scene]);

  useFrame(({ camera }) => {
    camera.lookAt(0, 1, 0);
  });

  useFrame((state) => {
    // const t = state.clock.elapsedTime;
    // const rightArm = nodes.RightArm;
    // const rightForeArm = nodes.RightForeArm;

    // if (rightArm && rightForeArm) {
    //   if (isHovering) {
    //     // ✅ FIX 2: Raise arm UP using rotation.x (forward/back axis for shoulder)
    //     // and use rotation.z to tilt it outward so it's visible
    //     rightArm.rotation.x = THREE.MathUtils.lerp(
    //       rightArm.rotation.x,
    //       -1.4,   // raises arm up in front
    //       0.12
    //     );
    //     rightArm.rotation.z = THREE.MathUtils.lerp(
    //       rightArm.rotation.z,
    //       -0.4,   // slight outward tilt so it's not clipping
    //       0.12
    //     );

    //     // Forearm swings back and forth on z for the waving motion
    //     rightForeArm.rotation.z = Math.sin(t * 6) * 0.5;
    //   } else {
    //     // Reset arm smoothly back to rest
    //     rightArm.rotation.x = THREE.MathUtils.lerp(rightArm.rotation.x, 0, 0.1);
    //     rightArm.rotation.z = THREE.MathUtils.lerp(rightArm.rotation.z, 0, 0.1);
    //     rightForeArm.rotation.z = THREE.MathUtils.lerp(rightForeArm.rotation.z, 0, 0.1);
    //   }
    // }

    // Head tracking
    const head = nodes.Head;
    if (head) {
      const targetX = -(state.pointer.y * Math.PI) / 6;
      const targetY = (state.pointer.x * Math.PI) / 4;
      head.rotation.x = THREE.MathUtils.lerp(head.rotation.x, targetX, 0.1);
      head.rotation.y = THREE.MathUtils.lerp(head.rotation.y, targetY, 0.1);
    }
  });

  return (
    <group {...props} dispose={null}>
      <primitive
        object={scene}
        onPointerOver={() => setIsHovering(true)}
        onPointerOut={() => setIsHovering(false)}
      />
    </group>
  );
}

useGLTF.preload('/model-2.glb');

export default function PortfolioScene() {
  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#1a1a1a' }}>
      <Canvas camera={{ position: [0, 1.5, 4], fov: 40 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[2, 2, 5]} intensity={1.5} />
        <spotLight position={[-2, 2, 2]} intensity={0.5} />

        <Suspense fallback={
          <Html center style={{ color: 'white' }}>Loading Avatar...</Html>
        }>
          <AvatarModel position={[0, 0, 0]} />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}