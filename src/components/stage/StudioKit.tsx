"use client";

import { ContactShadows, RoundedBox } from "@react-three/drei";
import { useStageBudget } from "@/components/stage/stage-budget";
import { STAGE_PLATFORM, STAGE_SHADOW } from "@/lib/stage-theme";

export function StudioLights({ intensity = 1 }: { intensity?: number }) {
  const budget = useStageBudget();
  if (budget) {
    return (
      <>
        <hemisphereLight args={["#fff6ea", "#e8d8c4", 1.12 * intensity]} />
        <directionalLight position={[2.4, 4.4, 3]} intensity={1.7 * intensity} color="#fff4e4" />
      </>
    );
  }
  return (
    <>
      <hemisphereLight args={["#fff6ea", "#e8d8c4", 1.05 * intensity]} />
      <directionalLight
        castShadow
        position={[2.8, 5.2, 3.4]}
        intensity={2.05 * intensity}
        color="#fff4e4"
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={16}
        shadow-camera-near={0.5}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
      />
      <directionalLight position={[-3.4, 2.2, -1.6]} intensity={0.55 * intensity} color="#9ad4e8" />
      <pointLight position={[0.4, 1.2, 2.6]} intensity={0.45 * intensity} color="#ffe0c4" />
    </>
  );
}

export function StudioSill({ width = 8, position = [0, -1.08, 0.12] as [number, number, number] }) {
  return (
    <RoundedBox args={[width, 0.22, 2.2]} radius={0.1} smoothness={4} position={position} receiveShadow>
      <meshStandardMaterial color={STAGE_PLATFORM} roughness={0.82} metalness={0} />
    </RoundedBox>
  );
}

export function StudioShadows({
  position = [0, -0.94, 0] as [number, number, number],
  scale = 10,
}: {
  position?: [number, number, number];
  scale?: number;
}) {
  const budget = useStageBudget();
  if (budget) return null;
  return <ContactShadows position={position} opacity={0.28} scale={scale} blur={2.8} far={3.4} color={STAGE_SHADOW} />;
}
