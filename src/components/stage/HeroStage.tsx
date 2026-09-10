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
  press,
}: {
  pointer: { x: number; y: number };
  scroll: number;
  mobile: boolean;
  press: number;
}) {
  const group = useRef<Group>(null);
  useFrame((state) => {
    const cam = state.camera;
    const targetX = mobile ? pointer.x * 0.22 : 0.48 + pointer.x * 0.38;
    const targetY = 0.38 + pointer.y * -0.14;
    const targetZ = (mobile ? 5.2 : 4.85) + scroll * 1.15;
    cam.position.x = MathUtils.lerp(cam.position.x, targetX, 0.045);
    cam.position.y = MathUtils.lerp(cam.position.y, targetY, 0.045);
    cam.position.z = MathUtils.lerp(cam.position.z, targetZ, 0.05);
    cam.lookAt(mobile ? 0 : 0.62, 0.22, 0);
    if (group.current) {
      group.current.rotation.y = MathUtils.lerp(group.current.rotation.y, pointer.x * 0.2, 0.045);
    }
  });
  return (
    <group ref={group} position={mobile ? [0, 0.28, 0] : [0.72, 0.32, 0]} scale={mobile ? 1.22 : 1.38}>
      <FigurineMesh species="bloop" followPointer pointer={pointer} press={press} />
    </group>
  );
}

export function HeroStage({ scroll = 0 }: { scroll?: number }) {
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [press, setPress] = useState(0);
  const [mobile, setMobile] = useState(false);
  const reduce = useRef(false);

  useEffect(() => {
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mq = window.matchMedia("(max-width: 768px)");
    const syncMobile = () => setMobile(mq.matches);
    syncMobile();
    mq.addEventListener("change", syncMobile);
    return () => mq.removeEventListener("change", syncMobile);
  }, []);

  return (
    <StageCanvas
      className="absolute inset-0"
      alpha={false}
      dprMax={1.75}
      camera={{ position: [0.2, 0.38, 4.9], fov: 32, far: 40 }}
      onPointerMove={(event) => {
        if (reduce.current) return;
        const x = (event.clientX / window.innerWidth) * 2 - 1;
        const y = (event.clientY / window.innerHeight) * 2 - 1;
        setPointer({ x, y });
      }}
      onPointerDown={() => setPress(1)}
      onPointerUp={() => setPress(0)}
    >
      <color attach="background" args={["#070809"]} />
      <fog attach="fog" args={["#070809", 7.5, 16]} />
      <StudioLights />
      <StudioSill width={12} position={[0.4, -1.12, 0.15]} />
      <Rig pointer={pointer} scroll={scroll} mobile={mobile} press={press} />
      <StudioShadows position={[0, -0.96, 0]} scale={12} />
    </StageCanvas>
  );
}
