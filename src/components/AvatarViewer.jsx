import { useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { Suspense } from 'react';
import styles from './AvatarViewer.module.scss';

function AvatarModel() {
  const { nodes, scene } = useGLTF('/model-2.glb');

  // 1. REMOVED: const { invalidate } = useThree(); 

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
    const head = nodes.Head || scene.getObjectByName('Head');
    if (head) {
      let targetHeadX = -(state.pointer.y * Math.PI) / 6;
      let targetHeadY = (state.pointer.x * Math.PI) / 4;
      targetHeadX = THREE.MathUtils.clamp(targetHeadX, -Math.PI / 4, Math.PI / 4);
      targetHeadY = THREE.MathUtils.clamp(targetHeadY, -Math.PI / 3, Math.PI / 3);
      head.rotation.x = THREE.MathUtils.lerp(head.rotation.x, targetHeadX, 3 * delta);
      head.rotation.y = THREE.MathUtils.lerp(head.rotation.y, targetHeadY, 3 * delta);
    }

    let targetBodyY = (state.pointer.x * Math.PI) / 12;
    targetBodyY = THREE.MathUtils.clamp(targetBodyY, -Math.PI / 8, Math.PI / 8);
    scene.rotation.y = THREE.MathUtils.lerp(scene.rotation.y, targetBodyY, 2 * delta);

    // 2. REMOVED: invalidate();
  });

  return (
    <group dispose={null} position={[0, -0.5, 0]}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload('/model-2.glb');

export default function AvatarViewer() {
  const [contextLost, setContextLost] = useState(false);

  if (contextLost) {
    return (
      <div className={styles.fallbackContainer}>
        <div className={styles.fallbackContent}>
          <p className={styles.fallbackTitle}>3D Model Unavailable</p>
          <button
            onClick={() => setContextLost(false)}
            className={styles.retryButton}
          >
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.viewerContainer}>
      <Canvas
        camera={{ position: [0, 1, 2.8], fov: 55 }}
        gl={{
          alpha: true,
          antialias: false,
          stencil: false,
          depth: true,
          powerPreference: 'low-power',
        }}
        dpr={1}
        onContextLost={() => setContextLost(true)}
        onContextRestored={() => setContextLost(false)}
        onCreated={({ gl, scene }) => {
          gl.setClearColor(0x000000, 0);
          scene.background = null;
          gl.toneMapping = THREE.NoToneMapping;
        }}
        className={styles.canvas}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[2, 4, 4]} intensity={1.0} />
        <directionalLight position={[-2, 2, -2]} intensity={0.3} color="#39FF14" />

        <Suspense fallback={null}>
          <AvatarModel />
        </Suspense>
      </Canvas>
    </div>
  );
}