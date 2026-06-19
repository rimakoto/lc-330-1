import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { GearConfig } from '../../types';
import { createGearGeometry } from '../../utils/gearGeometry';
import { useWatchStore } from '../../store/useWatchStore';

interface GearProps {
  config: GearConfig;
  animationOffset?: number;
}

export function Gear({ config, animationOffset = 0 }: GearProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const selectedGearId = useWatchStore((s) => s.selectedGearId);
  const setSelectedGearId = useWatchStore((s) => s.setSelectedGearId);
  const timeScale = useWatchStore((s) => s.timeScale);
  const isPlaying = useWatchStore((s) => s.isPlaying);

  const isSelected = selectedGearId === config.id;

  const geometry = useMemo(() => {
    return createGearGeometry({
      teeth: config.teeth,
      radius: config.radius,
      thickness: config.thickness,
      holeRadius: Math.max(0.06, config.radius * 0.12),
      spokes: config.spokes ?? 0,
    });
  }, [config.teeth, config.radius, config.thickness, config.spokes]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    if (!isPlaying || Math.abs(config.baseSpeed) < 0.0001) return;

    const angleDelta = config.baseSpeed * timeScale * delta;
    if (config.rotationAxis === 'z') {
      meshRef.current.rotation.z += angleDelta;
    } else if (config.rotationAxis === 'x') {
      meshRef.current.rotation.x += angleDelta;
    } else if (config.rotationAxis === 'y') {
      meshRef.current.rotation.y += angleDelta;
    }
  });

  const emissiveColor = useMemo(() => {
    if (isSelected) return '#ffb347';
    if (hovered) return '#ff8c00';
    return '#000000';
  }, [isSelected, hovered]);

  const emissiveIntensity = useMemo(() => {
    if (isSelected) return 0.8;
    if (hovered) return 0.4;
    return 0;
  }, [isSelected, hovered]);

  const scale = useMemo(() => {
    if (isSelected) return 1.06;
    if (hovered) return 1.02;
    return 1;
  }, [isSelected, hovered]);

  const initialRotZ = (config.rotationOffset ?? 0) + animationOffset;

  return (
    <group position={config.position}>
      <mesh
        ref={meshRef}
        rotation={[Math.PI / 2, 0, initialRotZ]}
        scale={scale}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedGearId(isSelected ? null : config.id);
        }}
      >
        <primitive object={geometry} attach="geometry" />
        <meshStandardMaterial
          color={config.color}
          metalness={0.85}
          roughness={0.25}
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity}
          envMapIntensity={0.8}
        />
      </mesh>

      <mesh position={[0, 0, -config.thickness * 0.5 - 0.02]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry
          args={[Math.max(0.05, config.radius * 0.1), Math.max(0.05, config.radius * 0.1), 0.02, 24]}
        />
        <meshStandardMaterial color="#4a3a1a" metalness={0.7} roughness={0.35} />
      </mesh>
    </group>
  );
}
