import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function DropMesh() {
  const meshRef = useRef();

  const points = useMemo(() => {
    const pts = [];
    const segments = 32;
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const y = -1.4 + t * 2.8;
      const r = Math.sin(t * Math.PI) * (1.15 - t * 0.65);
      pts.push(new THREE.Vector2(Math.max(0, r), y));
    }
    return pts;
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    const { x, y } = state.pointer;
    meshRef.current.position.y = Math.sin(t * 1.8) * 0.12;
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, (x * 0.5) + (t * 0.25), 0.05);
    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, -y * 0.3, 0.05);
  });

  return (
    <group>
      <mesh ref={meshRef} castShadow receiveShadow>
        <latheGeometry args={[points, 64]} />
        <meshPhysicalMaterial
          color="#B3122B"
          roughness={0.12}
          metalness={0.15}
          clearcoat={1}
          clearcoatRoughness={0.08}
          transmission={0.35}
          ior={1.42}
        />
      </mesh>
      <mesh position={[0, -1.9, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.2, 32]} />
        <meshBasicMaterial color="#B3122B" opacity={0.15} transparent />
      </mesh>
    </group>
  );
}

export default function BloodDrop3D() {
  return (
    <div style={{ width: '100%', height: '380px' }}>
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 6, 4]} intensity={1.5} color="#FFFFFF" />
        <directionalLight position={[-5, -2, -2]} intensity={0.6} color="#FBEAEC" />
        <pointLight position={[0, 2, 2]} intensity={0.8} color="#FFCDD2" />
        <DropMesh />
      </Canvas>
    </div>
  );
}
