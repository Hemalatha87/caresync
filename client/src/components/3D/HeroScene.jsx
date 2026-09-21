import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshWobbleMaterial, OrbitControls, Sphere, Torus, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

// 3D Glass Medical Cross Shape
function MedicalCross(props) {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      // Subtle mouse parallax lerp
      const targetX = (state.pointer.x * Math.PI) / 14;
      const targetY = (state.pointer.y * Math.PI) / 14;
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetY, 0.05);
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetX + state.clock.getElapsedTime() * 0.25, 0.05);
    }
  });

  return (
    <group ref={meshRef} {...props}>
      {/* Vertical Pillar */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.7, 2.4, 0.7]} />
        <meshPhysicalMaterial
          color="#0284C7"
          roughness={0.1}
          metalness={0.15}
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
          roughness={0.1}
          metalness={0.15}
          transmission={0.85}
          thickness={0.8}
          transparent
          opacity={0.92}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>
      {/* Inner Glowing Core */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.42, 32, 32]} />
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
      ring1.current.rotation.x = Math.sin(t * 0.35) * 0.5;
      ring1.current.rotation.y = t * 0.45;
    }
    if (ring2.current) {
      ring2.current.rotation.x = t * 0.35;
      ring2.current.rotation.z = Math.cos(t * 0.25) * 0.5;
    }
  });

  return (
    <group>
      <group ref={ring1}>
        <Torus args={[2.2, 0.035, 16, 100]}>
          <meshBasicMaterial color="#38BDF8" transparent opacity={0.6} />
        </Torus>
      </group>
      <group ref={ring2}>
        <Torus args={[2.8, 0.025, 16, 100]}>
          <meshBasicMaterial color="#06B6D4" transparent opacity={0.5} />
        </Torus>
      </group>
    </group>
  );
}

// Floating DNA / Healthcare Spheres
function FloatingSpheres() {
  return (
    <group>
      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <Sphere args={[0.25, 32, 32]} position={[-2.2, 1.5, -0.5]}>
          <MeshWobbleMaterial color="#0284C7" factor={0.4} speed={2} roughness={0.2} />
        </Sphere>
      </Float>
      <Float speed={2.5} rotationIntensity={1.5} floatIntensity={2.5}>
        <Sphere args={[0.3, 32, 32]} position={[2.4, -1.2, 0.5]}>
          <MeshWobbleMaterial color="#06B6D4" factor={0.5} speed={3} roughness={0.1} />
        </Sphere>
      </Float>
      <Float speed={1.8} rotationIntensity={0.8} floatIntensity={1.5}>
        <Sphere args={[0.18, 32, 32]} position={[1.8, 1.8, -1]}>
          <meshStandardMaterial color="#BAE6FD" roughness={0.3} />
        </Sphere>
      </Float>
    </group>
  );
}

export default function HeroScene() {
  return (
    <div className="w-full h-[480px] lg:h-[580px] relative cursor-grab active:cursor-grabbing select-none">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[5, 8, 5]} intensity={1.8} color="#F0F9FF" />
        <pointLight position={[-5, -5, -2]} intensity={1.2} color="#06B6D4" />
        
        <Sparkles count={45} scale={8} size={2.5} speed={0.4} opacity={0.65} color="#38BDF8" />

        <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
          <MedicalCross />
          <OrbitingRings />
          <FloatingSpheres />
        </Float>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 3}
          rotateSpeed={0.5}
        />
      </Canvas>
      {/* Dynamic ambient backdrop glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-brand-500/20 dark:bg-cyan-500/25 rounded-full blur-3xl pointer-events-none -z-10" />
    </div>
  );
}
