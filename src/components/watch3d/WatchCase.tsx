import { useMemo } from 'react';
import * as THREE from 'three';

export function WatchCase() {
  const outerRadius = 2.3;
  const caseThickness = 0.85;
  const crystalThickness = 0.04;
  const bezelWidth = 0.18;

  const caseBodyGeom = useMemo(() => {
    const outer = new THREE.Shape();
    outer.absarc(0, 0, outerRadius, 0, Math.PI * 2, false);
    const inner = new THREE.Path();
    inner.absarc(0, 0, outerRadius - bezelWidth, 0, Math.PI * 2, true);
    outer.holes.push(inner);
    const geom = new THREE.ExtrudeGeometry(outer, {
      depth: caseThickness,
      bevelEnabled: true,
      bevelThickness: 0.04,
      bevelSize: 0.04,
      bevelSegments: 3,
    });
    geom.center();
    return geom;
  }, [outerRadius, bezelWidth, caseThickness]);

  const dialGeom = useMemo(() => {
    const shape = new THREE.Shape();
    shape.absarc(0, 0, outerRadius - bezelWidth - 0.02, 0, Math.PI * 2, false);
    const geom = new THREE.ExtrudeGeometry(shape, {
      depth: 0.02,
      bevelEnabled: false,
    });
    geom.center();
    return geom;
  }, [outerRadius, bezelWidth]);

  const crownGeom = useMemo(
    () => new THREE.CylinderGeometry(0.1, 0.1, 0.28, 24),
    [],
  );

  return (
    <group>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <primitive object={caseBodyGeom} attach="geometry" />
        <meshStandardMaterial
          color="#d4af37"
          metalness={0.95}
          roughness={0.18}
          emissive="#1a1408"
          emissiveIntensity={0.25}
        />
      </mesh>

      <mesh position={[0, 0, caseThickness * 0.48]} rotation={[0, 0, 0]}>
        <cylinderGeometry
          args={[outerRadius - bezelWidth - 0.01, outerRadius - bezelWidth - 0.01, crystalThickness, 64]}
        />
        <meshPhysicalMaterial
          color="#e8f4ff"
          transparent
          opacity={0.25}
          metalness={0}
          roughness={0.05}
          transmission={0.85}
          thickness={0.3}
          ior={1.5}
          clearcoat={1}
          clearcoatRoughness={0.05}
          envMapIntensity={1.5}
        />
      </mesh>

      <mesh position={[0, 0, -caseThickness * 0.48]} rotation={[0, 0, 0]}>
        <cylinderGeometry
          args={[outerRadius - bezelWidth - 0.01, outerRadius - bezelWidth - 0.01, crystalThickness, 64]}
        />
        <meshPhysicalMaterial
          color="#e8f4ff"
          transparent
          opacity={0.22}
          metalness={0}
          roughness={0.05}
          transmission={0.85}
          thickness={0.3}
          ior={1.5}
          clearcoat={1}
          clearcoatRoughness={0.05}
        />
      </mesh>

      <group position={[0, 0, -0.02]} rotation={[Math.PI / 2, 0, 0]}>
        <mesh position={[0, 0, -0.2]}>
          <primitive object={dialGeom} attach="geometry" />
          <meshStandardMaterial
            color="#f5f0e6"
            metalness={0.4}
            roughness={0.55}
            emissive="#fff8e8"
            emissiveIntensity={0.08}
          />
        </mesh>

        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * Math.PI) / 6;
          const isHour = i % 3 === 0;
          const r = outerRadius - bezelWidth - 0.15;
          const x = Math.sin(angle) * r;
          const y = -Math.cos(angle) * r;
          const w = isHour ? 0.06 : 0.025;
          const h = isHour ? 0.16 : 0.08;
          return (
            <mesh
              key={i}
              position={[x, y, -0.19]}
              rotation={[0, 0, -angle]}
            >
              <boxGeometry args={[w, h, 0.015]} />
              <meshStandardMaterial
                color={isHour ? '#8b6914' : '#6b5a3a'}
                metalness={0.85}
                roughness={0.3}
              />
            </mesh>
          );
        })}

        <mesh position={[0, 0, -0.16]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.06, 16]} />
          <meshStandardMaterial color="#4a3a1a" metalness={0.9} roughness={0.25} />
        </mesh>
      </group>

      <mesh position={[outerRadius + 0.05, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <primitive object={crownGeom} attach="geometry" />
        <meshStandardMaterial
          color="#c8a050"
          metalness={0.95}
          roughness={0.2}
          emissive="#2a1e08"
          emissiveIntensity={0.3}
        />
      </mesh>

      {[0, 1, 2].map((i) => (
        <mesh
          key={`bow-${i}`}
          position={[0, outerRadius - 0.05 + i * 0.04, 0]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <torusGeometry args={[0.2, 0.035, 12, 36, Math.PI]} />
          <meshStandardMaterial
            color={i === 1 ? '#d4af37' : '#a07a20'}
            metalness={0.95}
            roughness={0.18}
            emissive="#1a1004"
            emissiveIntensity={i === 1 ? 0.3 : 0.2}
          />
        </mesh>
      ))}
    </group>
  );
}
