import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createHairspringGeometry, createBalanceWheelGeometry } from '../../utils/gearGeometry';
import { useWatchStore } from '../../store/useWatchStore';

export function Escapement() {
  const movement = useWatchStore((s) => s.getCurrentMovement());
  const timeScale = useWatchStore((s) => s.timeScale);
  const isPlaying = useWatchStore((s) => s.isPlaying);

  const balanceRef = useRef<THREE.Group>(null);
  const palletRef = useRef<THREE.Group>(null);
  const hairspringRef = useRef<THREE.Mesh>(null);
  const cageRef = useRef<THREE.Group>(null);

  const offset = movement.escapementOffset ?? [1.4, 0.6, 0.5];

  const hairspringGeom = useMemo(() => createHairspringGeometry(12, 0.38, 0.06, 0.006), []);
  const balanceGeom = useMemo(() => createBalanceWheelGeometry(0.48, 0.06, 0.05), []);
  const tourbillonCageGeom = useMemo(() => {
    const shape = new THREE.Shape();
    shape.absarc(0, 0, 0.55, 0, Math.PI * 2, false);
    const hole = new THREE.Path();
    hole.absarc(0, 0, 0.48, 0, Math.PI * 2, true);
    shape.holes.push(hole);
    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.04,
      bevelEnabled: true,
      bevelThickness: 0.008,
      bevelSize: 0.008,
      bevelSegments: 1,
    });
  }, []);

  const beatFrequency = movement.hasTourbillon ? 3 : 4;
  const cageRotSpeed = movement.hasTourbillon ? 0.1047 : 0;

  useFrame((state, delta) => {
    if (!isPlaying) return;
    const t = state.clock.elapsedTime * timeScale;
    const amplitude = 0.55;
    const phase = t * beatFrequency * Math.PI * 2;

    if (balanceRef.current) {
      balanceRef.current.rotation.z = Math.sin(phase) * amplitude;
    }

    if (palletRef.current) {
      const palletPhase = Math.sin(phase) * 0.22 + Math.cos(phase * 2) * 0.02;
      palletRef.current.rotation.z = palletPhase;
    }

    if (hairspringRef.current) {
      const breathe = 1 + Math.sin(phase) * 0.08;
      hairspringRef.current.scale.setScalar(breathe);
      hairspringRef.current.rotation.z = Math.sin(phase) * amplitude * 0.8;
    }

    if (cageRef.current) {
      cageRef.current.rotation.z += cageRotSpeed * timeScale * delta;
    }
  });

  return (
    <group position={offset}>
      {movement.hasTourbillon && (
        <group ref={cageRef}>
          <mesh position={[0, 0, 0]}>
            <primitive object={tourbillonCageGeom} attach="geometry" />
            <meshStandardMaterial color="#8b7355" metalness={0.9} roughness={0.2} />
          </mesh>
          {[0, 1, 2, 3].map((i) => (
            <mesh
              key={i}
              rotation={[0, 0, (i * Math.PI) / 2]}
              position={[0, 0, -0.08]}
            >
              <boxGeometry args={[0.015, 0.9, 0.04]} />
              <meshStandardMaterial color="#6b5a45" metalness={0.85} roughness={0.25} />
            </mesh>
          ))}

          <EscapementCore
            balanceRef={balanceRef as any}
            palletRef={palletRef as any}
            hairspringRef={hairspringRef as any}
            balanceGeom={balanceGeom}
            hairspringGeom={hairspringGeom}
          />
        </group>
      )}

      {!movement.hasTourbillon && (
        <EscapementCore
          balanceRef={balanceRef as any}
          palletRef={palletRef as any}
          hairspringRef={hairspringRef as any}
          balanceGeom={balanceGeom}
          hairspringGeom={hairspringGeom}
        />
      )}
    </group>
  );
}

interface EscapementCoreProps {
  balanceRef: any;
  palletRef: any;
  hairspringRef: any;
  balanceGeom: THREE.BufferGeometry;
  hairspringGeom: THREE.BufferGeometry;
}

function EscapementCore({
  balanceRef,
  palletRef,
  hairspringRef,
  balanceGeom,
  hairspringGeom,
}: EscapementCoreProps) {
  return (
    <>
      <group ref={balanceRef}>
        <mesh>
          <primitive object={balanceGeom} attach="geometry" />
          <meshStandardMaterial
            color="#c0a060"
            metalness={0.92}
            roughness={0.18}
            emissive="#3a2a08"
            emissiveIntensity={0.15}
          />
        </mesh>
        {[0, 1, 2, 3, 4].map((i) => (
          <mesh
            key={i}
            rotation={[0, 0, (i * Math.PI * 2) / 5]}
          >
            <boxGeometry args={[0.01, 0.86, 0.03]} />
            <meshStandardMaterial color="#a08050" metalness={0.9} roughness={0.22} />
          </mesh>
        ))}

        <group position={[0, 0, 0.08]}>
          <mesh ref={hairspringRef}>
            <primitive object={hairspringGeom} attach="geometry" />
            <meshStandardMaterial
              color="#4a88b8"
              metalness={0.95}
              roughness={0.12}
              emissive="#1a3a5a"
              emissiveIntensity={0.2}
            />
          </mesh>
        </group>

        <mesh position={[0, 0, 0.16]}>
          <boxGeometry args={[0.05, 0.05, 0.05]} />
          <meshStandardMaterial color="#5a4a30" metalness={0.85} roughness={0.3} />
        </mesh>
      </group>

      <group ref={palletRef} position={[-0.4, -0.05, 0]}>
        <mesh>
          <boxGeometry args={[0.48, 0.06, 0.04]} />
          <meshStandardMaterial
            color="#707a82"
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>
        <mesh position={[0.2, 0.05, 0]} rotation={[0, 0, 0.3]}>
          <boxGeometry args={[0.08, 0.02, 0.03]} />
          <meshStandardMaterial color="#505860" metalness={0.92} roughness={0.18} />
        </mesh>
        <mesh position={[0.2, -0.05, 0]} rotation={[0, 0, -0.3]}>
          <boxGeometry args={[0.08, 0.02, 0.03]} />
          <meshStandardMaterial color="#505860" metalness={0.92} roughness={0.18} />
        </mesh>
        <mesh position={[-0.2, 0.1, 0]}>
          <boxGeometry args={[0.04, 0.04, 0.06]} />
          <meshStandardMaterial color="#606870" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>
    </>
  );
}
