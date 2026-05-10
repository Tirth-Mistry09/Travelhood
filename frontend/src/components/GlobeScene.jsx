import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial, Stars } from "@react-three/drei";

const RotatingGlobe = () => {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.004;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef}>
      <Sphere args={[1.6, 64, 64]}>
        <MeshDistortMaterial
          color="#3b82f6"
          attach="material"
          distort={0.25}
          speed={1.5}
          roughness={0.1}
          metalness={0.8}
          opacity={0.85}
          transparent
        />
      </Sphere>
    </mesh>
  );
};

const FloatingRing = () => {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.3;
      ref.current.rotation.z = state.clock.elapsedTime * 0.1;
    }
  });
  return (
    <mesh ref={ref}>
      <torusGeometry args={[2.2, 0.03, 16, 100]} />
      <meshStandardMaterial color="#8b5cf6" opacity={0.4} transparent />
    </mesh>
  );
};

const GlobeScene = () => (
  <div className="w-full h-72 md:h-96">
    <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
      <Suspense fallback={null}>
        <Stars radius={80} depth={50} count={3000} factor={4} fade speed={1} />
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={1.2} color="#3b82f6" />
        <pointLight position={[-5, -5, -5]} intensity={0.6} color="#8b5cf6" />
        <RotatingGlobe />
        <FloatingRing />
      </Suspense>
    </Canvas>
  </div>
);

export default GlobeScene;