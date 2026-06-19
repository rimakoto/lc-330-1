import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Float } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, SMAA } from '@react-three/postprocessing';
import * as THREE from 'three';
import { PocketWatch } from './PocketWatch';

export function WatchScene() {
  return (
    <Canvas
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      dpr={[1, 2]}
      camera={{ position: [0, 2.2, 6.5], fov: 42, near: 0.1, far: 100 }}
      shadows
      style={{ background: 'transparent' }}
    >
      <Suspense fallback={null}>
        <color attach="background" args={['#050810']} />

        <fog attach="fog" args={['#050810', 8, 22]} />

        <ambientLight intensity={0.45} color="#fff4dc" />

        <directionalLight
          position={[5, 7, 5]}
          intensity={1.35}
          color="#fff5dc"
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-camera-left={-5}
          shadow-camera-right={5}
          shadow-camera-top={5}
          shadow-camera-bottom={-5}
        />

        <directionalLight
          position={[-4, -3, -3]}
          intensity={0.45}
          color="#c8e0ff"
        />

        <pointLight
          position={[0, 5, -6]}
          intensity={0.8}
          color="#ffcc66"
          distance={18}
          decay={2}
        />

        <spotLight
          position={[0, 6, 0]}
          intensity={0.7}
          angle={0.6}
          penumbra={0.6}
          color="#ffd890"
          castShadow
        />

        <Float speed={1.1} rotationIntensity={0.15} floatIntensity={0.6}>
          <PocketWatch />
        </Float>

        <ContactShadows
          position={[0, -2.5, 0]}
          opacity={0.55}
          scale={12}
          blur={2.6}
          far={4.5}
          color="#000000"
        />

        <mesh position={[0, 0, -8]} rotation={[0, 0, 0]}>
          <planeGeometry args={[30, 20]} />
          <meshBasicMaterial color="#020410" transparent opacity={0.9} />
        </mesh>

        <OrbitControls
          enableDamping
          dampingFactor={0.08}
          minDistance={3.2}
          maxDistance={14}
          minPolarAngle={0.18}
          maxPolarAngle={Math.PI * 0.82}
          enablePan={false}
          target={new THREE.Vector3(0, 0, 0)}
        />

        <Environment preset="studio" />

        <EffectComposer multisampling={0}>
          <Bloom
            intensity={0.75}
            luminanceThreshold={0.25}
            luminanceSmoothing={0.9}
            mipmapBlur
          />
          <Vignette eskil={false} offset={0.15} darkness={0.85} />
          <SMAA />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}
