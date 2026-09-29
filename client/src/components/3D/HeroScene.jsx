import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshWobbleMaterial, Torus, Sphere, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

// 3D Glass Medical Cross Shape
function MedicalCross(props) {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      // Subtle mouse parallax lerp
      const targetX = (state.pointer.x * Math.PI) / 16;
      const targetY = (state.pointer.y * Math.PI) / 16;
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetY, 0.04);
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetX + state.clock.getElapsedTime() * 0.2, 0.04);
    }
  });

  return (
    <group ref={meshRef} {...props}>
      {/* Vertical Pillar */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.7, 2.4, 0.7]} />
        <meshPhysicalMaterial
          color="#0284C7"
          roughness={0.12}
          metalness={0.1}
          transmission={0.85}
          thickness={0.8}
          transparent
          opacity={0.92}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>
      {/* Horizontal Bar */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.4, 0.7, 0.7]} />
        <meshPhysicalMaterial
          color="#06B6D4"
          roughness={0.12}
          metalness={0.1}
          transmission={0.85}
          thickness={0.8}
          transparent
          opacity={0.92}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>
      {/* Inner Glowing Healthcare Core */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.42, 24, 24]} />
        <meshBasicMaterial color="#38BDF8" transparent opacity={0.65} />
      </mesh>
    </group>
  );
}

// Glowing Orbit Rings
function OrbitingRings() {
  const ring1 = useRef();
  const ring2 = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ring1.current) {
      ring1.current.rotation.x = Math.sin(t * 0.3) * 0.45;
      ring1.current.rotation.y = t * 0.4;
    }
    if (ring2.current) {
      ring2.current.rotation.x = t * 0.3;
      ring2.current.rotation.z = Math.cos(t * 0.25) * 0.45;
    }
  });

  return (
    <group>
      <group ref={ring1}>
        <Torus args={[2.2, 0.03, 16, 64]}>
          <meshBasicMaterial color="#38BDF8" transparent opacity={0.55} />
        </Torus>
      </group>
      <group ref={ring2}>
        <Torus args={[2.7, 0.02, 16, 64]}>
          <meshBasicMaterial color="#06B6D4" transparent opacity={0.45} />
        </Torus>
      </group>
    </group>
  );
}

// Floating Healthcare Spheres
function FloatingSpheres() {
  return (
    <group>
      <Float speed={1.8} rotationIntensity={0.8} floatIntensity={1.5}>
        <Sphere args={[0.22, 24, 24]} position={[-2.1, 1.4, -0.5]}>
          <MeshWobbleMaterial color="#0284C7" factor={0.3} speed={1.8} roughness={0.2} />
        </Sphere>
      </Float>
      <Float speed={2.2} rotationIntensity={1.2} floatIntensity={2}>
        <Sphere args={[0.26, 24, 24]} position={[2.3, -1.1, 0.5]}>
          <MeshWobbleMaterial color="#06B6D4" factor={0.4} speed={2.5} roughness={0.15} />
        </Sphere>
      </Float>
      <Float speed={1.5} rotationIntensity={0.6} floatIntensity={1.2}>
        <Sphere args={[0.16, 20, 20]} position={[1.7, 1.6, -0.8]}>
          <meshStandardMaterial color="#BAE6FD" roughness={0.3} />
        </Sphere>
      </Float>
    </group>
  );
}

export default function HeroScene() {
  return (
    <div className="w-full h-[440px] sm:h-[480px] lg:h-[540px] relative select-none">
      <Canvas
        camera={{ position: [0, 0, 5.8], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.95} />
        <directionalLight position={[5, 8, 5]} intensity={1.6} color="#F0F9FF" />
        <pointLight position={[-5, -5, -2]} intensity={1.1} color="#06B6D4" />

        <Sparkles count={35} scale={7} size={2.2} speed={0.35} opacity={0.6} color="#38BDF8" />

        <Float speed={1.4} rotationIntensity={0.4} floatIntensity={0.8}>
          <MedicalCross />
          <OrbitingRings />
          <FloatingSpheres />
        </Float>
      </Canvas>
      {/* Dynamic ambient backdrop glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-brand-500/15 dark:bg-cyan-500/20 rounded-full blur-3xl pointer-events-none -z-10" />
    </div>
  );
}
