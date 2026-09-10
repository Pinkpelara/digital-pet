"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import type { Group } from "three";
import { MathUtils } from "three";
import { FigurineMesh } from "@/components/stage/FigurineMesh";

function Rig({ pointer, scroll }: { pointer: { x: number; y: number }; scroll: number }) {
  const group = useRef<Group>(null);
  useFrame((state) => {
    const cam = state.camera;
    cam.position.x = MathUtils.lerp(cam.position.x, pointer.x * 0.55, 0.045);
    cam.position.y = MathUtils.lerp(cam.position.y, 0.22 + pointer.y * -0.2, 0.045);
    cam.position.z = MathUtils.lerp(cam.position.z, 3.05 + scroll * 0.9, 0.05);
    cam.lookAt(0, 0.2, 0);
    if (group.current) {
      group.current.rotation.y = MathUtils.lerp(group.current.rotation.y, pointer.x * 0.22, 0.04);
    }
  });
  return (
    <group ref={group}>
      <FigurineMesh species="bloop" equipped={{ body: "outfit-raincoat" }} followPointer pointer={pointer} />
    </group>
  );
}

export function HeroStage() {
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [scroll, setScroll] = useState(0);
  const reduce = useRef(false);

  useEffect(() => {
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    function onScroll() {
      const max = Math.max(1, window.innerHeight);
      setScroll(Math.min(1, window.scrollY / max));
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="absolute inset-0"
      onPointerMove={(event) => {
        if (reduce.current) return;
        const x = (event.clientX / window.innerWidth) * 2 - 1;
        const y = (event.clientY / window.innerHeight) * 2 - 1;
        setPointer({ x, y });
      }}
    >
      <Canvas
        shadows
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        camera={{ position: [0, 0.25, 3.05], fov: 26, near: 0.1, far: 40 }}
      >
        <color attach="background" args={["#0a0b0c"]} />
        <fog attach="fog" args={["#0a0b0c", 5.5, 11]} />
        <Suspense fallback={null}>
          <hemisphereLight args={["#cfd6d1", "#121413", 0.42]} />
          <directionalLight
            castShadow
            position={[3.4, 5.2, 2.8]}
            intensity={2.4}
            color="#f4f1ea"
            shadow-mapSize={[1024, 1024]}
          />
          <directionalLight position={[-4, 1.8, -2.5]} intensity={1.6} color="#7f97a3" />
          <spotLight position={[0, 3.4, 4]} angle={0.5} penumbra={0.7} intensity={1.1} color="#e8ece7" />
          <Rig pointer={pointer} scroll={scroll} />
          <ContactShadows position={[0, -1.12, 0]} opacity={0.55} scale={10} blur={2.8} far={3.2} color="#000" />
        </Suspense>
      </Canvas>
    </div>
  );
}
