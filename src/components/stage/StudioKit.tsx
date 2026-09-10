"use client";

import { ContactShadows, RoundedBox } from "@react-three/drei";

export function StudioLights({ intensity = 1 }: { intensity?: number }) {
  return (
    <>
      <hemisphereLight args={["#d5ddd8", "#101214", 0.42 * intensity]} />
      <directionalLight
        castShadow
        position={[3.2, 5.4, 3.1]}
        intensity={2.35 * intensity}
        color="#f3f1ea"
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={16}
        shadow-camera-near={0.5}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
      />
      <directionalLight position={[-3.8, 1.6, -2.4]} intensity={1.45 * intensity} color="#7f97a2" />
      <spotLight
        position={[0.2, 3.6, 4.2]}
        angle={0.48}
        penumbra={0.72}
        intensity={1.15 * intensity}
        color="#eef1ec"
      />
      <pointLight position={[0, -0.4, 2.4]} intensity={0.28 * intensity} color="#c9c6bc" />
    </>
  );
}

export function StudioSill({ width = 8, position = [0, -1.08, 0.12] as [number, number, number] }) {
  return (
    <RoundedBox args={[width, 0.26, 2.35]} radius={0.07} smoothness={4} position={position} receiveShadow>
      <meshStandardMaterial color="#141615" roughness={0.68} metalness={0.08} />
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
  return <ContactShadows position={position} opacity={0.52} scale={scale} blur={2.6} far={3.4} color="#000" />;
}
