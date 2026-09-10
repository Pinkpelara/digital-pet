"use client";

import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { MathUtils } from "three";
import { FigurineMesh } from "@/components/stage/FigurineMesh";
import { StageCanvas } from "@/components/stage/StageCanvas";
import { StudioLights, StudioShadows, StudioSill } from "@/components/stage/StudioKit";

function Rig({
  pointer,
  scroll,
  mobile,
}: {
  pointer: { x: number; y: number };
  scroll: number;
  mobile: boolean;
}) {
  const group = useRef<Group>(null);
  useFrame((state) => {
    const cam = state.camera;
    const targetX = mobile ? pointer.x * 0.28 : 0.55 + pointer.x * 0.42;
    const targetY = 0.42 + pointer.y * -0.16;
    const targetZ = (mobile ? 5.8 : 5.55) + scroll * 0.65;
    cam.position.x = MathUtils.lerp(cam.position.x, targetX, 0.045);
    cam.position.y = MathUtils.lerp(cam.position.y, targetY, 0.045);
    cam.position.z = MathUtils.lerp(cam.position.z, targetZ, 0.05);
    cam.lookAt(mobile ? 0 : 0.72, 0.18, 0);
    if (group.current) {
      group.current.rotation.y = MathUtils.lerp(group.current.rotation.y, pointer.x * 0.18, 0.045);
    }
  });
  return (
    <group ref={group} position={mobile ? [0, 0, 0] : [0.85, 0.02, 0]} scale={mobile ? 1.08 : 1.18}>
      <FigurineMesh species="bloop" followPointer pointer={pointer} quality="high" />
    </group>
  );
}

export function HeroStage() {
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [scroll, setScroll] = useState(0);
  const [mobile, setMobile] = useState(false);
  const reduce = useRef(false);

  useEffect(() => {
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mq = window.matchMedia("(max-width: 768px)");
    const syncMobile = () => setMobile(mq.matches);
    syncMobile();
    mq.addEventListener("change", syncMobile);
    function onScroll() {
      const max = Math.max(1, window.innerHeight);
      setScroll(Math.min(1, window.scrollY / max));
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      mq.removeEventListener("change", syncMobile);
    };
  }, []);

  return (
    <StageCanvas
      className="absolute inset-0"
      alpha={false}
      dprMax={1.75}
      camera={{ position: [0.2, 0.42, 5.6], fov: 30, far: 40 }}
      onPointerMove={(event) => {
        if (reduce.current) return;
        const x = (event.clientX / window.innerWidth) * 2 - 1;
        const y = (event.clientY / window.innerHeight) * 2 - 1;
        setPointer({ x, y });
      }}
    >
      <color attach="background" args={["#070809"]} />
      <fog attach="fog" args={["#070809", 7.5, 16]} />
      <StudioLights />
      <StudioSill width={12} position={[0.4, -1.1, 0.15]} />
      <Rig pointer={pointer} scroll={scroll} mobile={mobile} />
      <StudioShadows position={[0, -0.96, 0]} scale={12} />
    </StageCanvas>
  );
}
