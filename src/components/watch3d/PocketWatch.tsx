import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { GearTrain } from './GearTrain';
import { Escapement } from './Escapement';
import { WatchCase } from './WatchCase';

export function PocketWatch() {
  const groupRef = useRef<any>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.position.y = Math.sin(t * 0.6) * 0.05;
    groupRef.current.rotation.z = Math.sin(t * 0.35) * 0.02;
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <WatchCase />
      <group position={[0, 0, 0]} rotation={[Math.PI, 0, 0]}>
        <GearTrain />
      </group>
      <Escapement />
    </group>
  );
}
