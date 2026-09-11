"use client";

import { ContactShadows, RoundedBox } from "@react-three/drei";
import { useStageBudget } from "@/components/stage/stage-budget";
import { STAGE_PLATFORM, STAGE_SHADOW } from "@/lib/stage-theme";

export function StudioLights({ intensity = 1 }: { intensity?: number }) {
  const budget = useStageBudget();
  if (budget) {
    return (
      <>
        <hemisphereLight args={["#6a3a9a", "#0C0021", 0.95 * intensity]} />
        <directionalLight position={[2.4, 4.4, 3]} intensity={1.85 * intensity} color="#fff1e8" />
        <directionalLight position={[-2.6, 1.4, 2]} intensity={0.55 * intensity} color="#5CE6D8" />
      </>
    );
  }
  return (
    <>
      <hemisphereLight args={["#7a48b0", "#0C0021", 0.72 * intensity]} />
      <directionalLight
        castShadow
        position={[2.8, 5.2, 3.4]}
        intensity={2.15 * intensity}
        color="#fff4ea"
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={16}
        shadow-camera-near={0.5}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
      />
      <directionalLight position={[-3.6, 2.4, -1.8]} intensity={1.15 * intensity} color="#FF5AA8" />
      <directionalLight position={[-2.2, 1.4, 3.2]} intensity={0.62 * intensity} color="#5CE6D8" />
      <pointLight position={[0.5, 1.4, 2.8]} intensity={0.55 * intensity} color="#F2C14E" distance={9} />
    </>
  );
}

export function StudioSill({ width = 8, position = [0, -1.08, 0.12] as [number, number, number] }) {
  return (
    <RoundedBox args={[width, 0.18, 2.2]} radius={0.08} smoothness={4} position={position} receiveShadow>
      <meshStandardMaterial color={STAGE_PLATFORM} roughness={0.42} metalness={0.18} />
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
  return <ContactShadows position={position} opacity={0.55} scale={scale} blur={2.4} far={3.4} color={STAGE_SHADOW} />;
}
