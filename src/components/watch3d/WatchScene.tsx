import { useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { PocketWatch } from './PocketWatch';

function SceneLights() {
  return (
    <>
      <hemisphereLight args={['#fff4dc', '#1a2540', 0.9]} />
      <ambientLight intensity={0.7} color="#ffffff" />
      <directionalLight position={[6, 8, 5]} intensity={1.8} color="#fff8dc" />
      <directionalLight position={[-5, -2, -4]} intensity={0.6} color="#b8d0ff" />
      <pointLight position={[3, 2, 4]} intensity={1.0} color="#ffcc66" distance={20} decay={2} />
      <pointLight position={[-3, 1, 3]} intensity={0.8} color="#88bbff" distance={20} decay={2} />
      <spotLight position={[0, 8, 0]} intensity={1.2} angle={0.6} penumbra={0.7} color="#ffe8a0" />
    </>
  );
}

function CustomOrbit() {
  const { camera, gl } = useThree();
  const stateRef = useRef({
    dragging: false,
    lastX: 0,
    lastY: 0,
    theta: Math.atan2(camera.position.x, camera.position.z),
    phi: Math.acos(camera.position.y / camera.position.length()),
    radius: camera.position.length(),
    target: new THREE.Vector3(0, 0, 0),
    dampingTheta: 0,
    dampingPhi: 0,
  });

  useEffect(() => {
    const dom = gl.domElement;
    const s = stateRef.current;

    const onDown = (e: PointerEvent) => {
      s.dragging = true;
      s.lastX = e.clientX;
      s.lastY = e.clientY;
      dom.setPointerCapture(e.pointerId);
    };
    const onUp = (e: PointerEvent) => {
      s.dragging = false;
      try { dom.releasePointerCapture(e.pointerId); } catch {}
    };
    const onMove = (e: PointerEvent) => {
      if (!s.dragging) return;
      const dx = e.clientX - s.lastX;
      const dy = e.clientY - s.lastY;
      s.lastX = e.clientX;
      s.lastY = e.clientY;
      s.dampingTheta -= dx * 0.005;
      s.dampingPhi -= dy * 0.005;
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      s.radius = Math.max(3, Math.min(15, s.radius + e.deltaY * 0.005));
    };

    dom.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointermove', onMove);
    dom.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      dom.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointermove', onMove);
      dom.removeEventListener('wheel', onWheel);
    };
  }, [gl.domElement]);

  useFrame(() => {
    const s = stateRef.current;
    s.theta += s.dampingTheta;
    s.phi = Math.max(0.15, Math.min(Math.PI * 0.85, s.phi + s.dampingPhi));
    s.dampingTheta *= 0.92;
    s.dampingPhi *= 0.92;

    const sinPhi = Math.sin(s.phi);
    camera.position.x = s.radius * sinPhi * Math.sin(s.theta);
    camera.position.y = s.radius * Math.cos(s.phi);
    camera.position.z = s.radius * sinPhi * Math.cos(s.theta);
    camera.lookAt(s.target);
  });

  return null;
}

function ContactShadow() {
  const geom = useMemo(() => new THREE.PlaneGeometry(24, 24, 1, 1), []);
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, 0]}>
      <primitive object={geom} attach="geometry" />
      <meshBasicMaterial color="#000000" transparent opacity={0.35} />
    </mesh>
  );
}

export function WatchScene() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const glRef = useRef<any>(null);

  useEffect(() => {
    const handleResize = () => {
      const gl = glRef.current;
      if (!gl) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      gl.setSize(w, h, false);
      gl.domElement.style.width = w + 'px';
      gl.domElement.style.height = h + 'px';
      gl.domElement.style.display = 'block';
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      ref={wrapperRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      <Canvas
        gl={{ antialias: true, alpha: false, powerPreference: 'default' }}
        dpr={[1, 1.5]}
        camera={{ position: [3, 1.0, 10.5], fov: 50, near: 0.1, far: 200 }}
        shadows={false}
        style={{ width: '556px', height: '848px', display: 'block' }}
        onCreated={({ gl, camera }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.1;
          glRef.current = gl;

          const w = window.innerWidth;
          const h = window.innerHeight;
          gl.setSize(w, h, false);
          gl.domElement.style.width = w + 'px';
          gl.domElement.style.height = h + 'px';
          gl.domElement.style.display = 'block';

          console.log('[R3F Canvas Created] OK', { w, h });
        }}
      >
        <color attach="background" args={['#050810']} />
        <fog attach="fog" args={['#050810', 12, 30]} />

        <SceneLights />

        <PocketWatch />

        <ContactShadow />

        <CustomOrbit />
      </Canvas>
    </div>
  );
}
