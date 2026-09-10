"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { figurineLook, vinyl } from "@/lib/figurine-look";
import type { CreatureMood, EquipmentLoadout, SkillId, SpeciesId } from "@/lib/types";

function VinylMaterial({ color }: { color: string }) {
  return (
    <meshPhysicalMaterial
      color={color}
      roughness={vinyl.roughness}
      metalness={vinyl.metalness}
      clearcoat={vinyl.clearcoat}
      clearcoatRoughness={vinyl.clearcoatRoughness}
      sheen={vinyl.sheen}
      sheenRoughness={vinyl.sheenRoughness}
      sheenColor={vinyl.sheenColor}
      envMapIntensity={0.85}
    />
  );
}

function Ball({
  color,
  position,
  scale = 1,
  segs = 40,
  radius = 1,
}: {
  color: string;
  position?: [number, number, number];
  scale?: number | [number, number, number];
  segs?: number;
  radius?: number;
}) {
  return (
    <mesh castShadow receiveShadow position={position} scale={scale}>
      <sphereGeometry args={[radius, segs, segs]} />
      <VinylMaterial color={color} />
    </mesh>
  );
}

function Gear({ equipped, segs }: { equipped: EquipmentLoadout; segs: number }) {
  const body = equipped.body;
  const face = equipped.face;
  const head = equipped.head;
  const back = equipped.back;
  const hand = equipped.hand;
  const feet = equipped.feet;
  return (
    <group>
      {(body === "outfit-raincoat" || body === "drop-starrycoat") && (
        <mesh castShadow position={[0, -0.22, 0.02]} scale={[1.18, 0.78, 1.14]}>
          <sphereGeometry args={[0.52, 36, 22, 0, Math.PI * 2, 0, Math.PI * 0.68]} />
          <VinylMaterial color={body === "drop-starrycoat" ? "#3a4450" : "#c4a24a" } />
        </mesh>
      )}
      {body === "outfit-hoodie" && (
        <mesh castShadow position={[0, -0.12, 0]} scale={[1.2, 0.95, 1.16]}>
          <sphereGeometry args={[0.52, 32, 20, 0, Math.PI * 2, 0, Math.PI * 0.78]} />
          <VinylMaterial color="#4a524e" />
        </mesh>
      )}
      {body === "drop-cape" && (
        <mesh castShadow position={[0, -0.18, -0.38]} rotation={[0.38, 0, 0]}>
          <capsuleGeometry args={[0.34, 0.62, 8, 16]} />
          <VinylMaterial color="#2c3340" />
        </mesh>
      )}
      {face === "outfit-sunglasses" && (
        <group position={[0, 0.56, 0.48]}>
          <mesh>
            <boxGeometry args={[0.58, 0.05, 0.05]} />
            <meshStandardMaterial color="#1a1c1b" metalness={0.4} roughness={0.25} />
          </mesh>
          <mesh position={[-0.16, 0, 0.03]}>
            <circleGeometry args={[0.12, 20]} />
            <meshStandardMaterial color="#111" metalness={0.6} roughness={0.15} />
          </mesh>
          <mesh position={[0.16, 0, 0.03]}>
            <circleGeometry args={[0.12, 20]} />
            <meshStandardMaterial color="#111" metalness={0.6} roughness={0.15} />
          </mesh>
        </group>
      )}
      {head === "outfit-sproutcap" && (
        <group position={[0, 1.02, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.38, 0.44, 0.2, 24]} />
            <VinylMaterial color="#5a6848" />
          </mesh>
          <mesh position={[0, -0.05, 0.24]} rotation={[0.2, 0, 0]}>
            <boxGeometry args={[0.62, 0.035, 0.24]} />
            <VinylMaterial color="#4a533c" />
          </mesh>
        </group>
      )}
      {head === "outfit-scarf" && (
        <mesh castShadow position={[0, 0.22, 0.08]} rotation={[0.18, 0.35, 0]}>
          <torusGeometry args={[0.42, 0.08, 12, 24]} />
          <VinylMaterial color="#6a7c86" />
        </mesh>
      )}
      {back === "gadget-balloon" && (
        <group position={[0.58, 1.22, -0.18]}>
          <Ball color="#8a9aa3" scale={0.24} segs={Math.max(16, segs / 2)} />
          <mesh position={[0, -0.38, 0]}>
            <cylinderGeometry args={[0.01, 0.01, 0.46, 8]} />
            <meshStandardMaterial color="#c5c8c2" />
          </mesh>
        </group>
      )}
      {hand === "gadget-umbrella" && (
        <group position={[0.62, 0.02, 0.32]} rotation={[0.18, 0, -0.38]}>
          <mesh>
            <cylinderGeometry args={[0.022, 0.022, 0.82, 8]} />
            <meshStandardMaterial color="#d8d6cf" />
          </mesh>
          <mesh position={[0, 0.38, 0]}>
            <coneGeometry args={[0.28, 0.18, 16, 1, true]} />
            <VinylMaterial color="#6a7c86" />
          </mesh>
        </group>
      )}
      {feet === "outfit-rainboots" && (
        <group>
          <Ball color="#3a3d3b" position={[-0.2, -0.92, 0.12]} scale={[0.18, 0.13, 0.24]} segs={20} />
          <Ball color="#3a3d3b" position={[0.2, -0.92, 0.12]} scale={[0.18, 0.13, 0.24]} segs={20} />
        </group>
      )}
    </group>
  );
}

export function FigurineMesh({
  species,
  equipped = {},
  mood = "idle",
  skill = null,
  followPointer = false,
  pointer,
  quality = "high",
}: {
  species: SpeciesId;
  equipped?: EquipmentLoadout;
  mood?: CreatureMood;
  skill?: SkillId | null;
  followPointer?: boolean;
  pointer?: { x: number; y: number };
  quality?: "high" | "medium";
}) {
  const root = useRef<Group>(null);
  const look = figurineLook[species];
  const segs = quality === "high" ? 48 : 28;
  const proportions = useMemo(() => {
    if (species === "mochi") return { body: [1.22, 0.88, 1.12] as const, head: [1.12, 0.92, 1.08] as const };
    if (species === "sprout") return { body: [0.9, 1.08, 0.92] as const, head: [0.92, 1.04, 0.95] as const };
    if (species === "niblet") return { body: [0.95, 0.9, 1] as const, head: [1.02, 0.95, 1] as const };
    return { body: [1, 1, 1] as const, head: [1, 1.02, 1] as const };
  }, [species]);

  useFrame((state) => {
    const group = root.current;
    if (!group) return;
    const t = state.clock.elapsedTime;
    const maxY = 0.38;
    const targetY = followPointer ? (pointer?.x ?? 0) * maxY : Math.sin(t * 0.32) * 0.07;
    const targetX = followPointer ? (pointer?.y ?? 0) * -0.14 : Math.sin(t * 0.24) * 0.035;
    group.rotation.y += (targetY - group.rotation.y) * 0.07;
    group.rotation.x += (targetX - group.rotation.x) * 0.07;
    const nap = mood === "nap" || skill === "nap";
    group.position.y = nap ? -0.06 : Math.sin(t * (skill ? 3.1 : 1.05)) * (skill ? 0.07 : 0.04);
    if (skill === "moonwalk") group.position.x = Math.sin(t * 2) * 0.1;
    if (skill === "dance") group.rotation.z = Math.sin(t * 6) * 0.07;
  });

  const napping = mood === "nap" || skill === "nap";

  return (
    <group ref={root}>
      <group position={[0, -0.02, 0]}>
        <group scale={proportions.body}>
          <Ball color={look.body} position={[0, -0.16, 0]} scale={0.54} segs={segs} />
          <Ball color={look.belly} position={[0, -0.22, 0.28]} scale={[0.34, 0.28, 0.22]} segs={segs} />
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.12, 0]} castShadow>
            <torusGeometry args={[0.42, 0.012, 8, 28]} />
            <meshStandardMaterial color={look.shade} roughness={0.55} metalness={0.04} />
          </mesh>
          <Ball color={look.shade} position={[-0.2, -0.88, 0.06]} scale={[0.16, 0.11, 0.15]} segs={20} />
          <Ball color={look.shade} position={[0.2, -0.88, 0.06]} scale={[0.16, 0.11, 0.15]} segs={20} />
          <Ball color={look.body} position={[-0.48, -0.08, 0.08]} scale={[0.14, 0.16, 0.14]} segs={24} />
          <Ball color={look.body} position={[0.48, -0.08, 0.08]} scale={[0.14, 0.16, 0.14]} segs={24} />
          {species === "mochi" && (
            <>
              <Ball color={look.body} position={[-0.62, 0.08, 0.04]} scale={[0.2, 0.16, 0.14]} segs={segs} />
              <Ball color={look.body} position={[0.62, 0.08, 0.04]} scale={[0.2, 0.16, 0.14]} segs={segs} />
            </>
          )}
        </group>

        <group position={[0, 0.52, 0]} scale={proportions.head}>
          <Ball color={look.body} scale={0.5} segs={segs} />
          <Ball color={look.gloss} position={[-0.18, 0.12, 0.32]} scale={0.09} segs={16} />
          <group position={[0, 0.04, 0.42]}>
            {napping ? (
              <>
                <mesh position={[-0.14, 0, 0]} rotation={[0, 0, 0.18]}>
                  <boxGeometry args={[0.13, 0.022, 0.02]} />
                  <meshStandardMaterial color="#1c1e1d" />
                </mesh>
                <mesh position={[0.14, 0, 0]} rotation={[0, 0, -0.18]}>
                  <boxGeometry args={[0.13, 0.022, 0.02]} />
                  <meshStandardMaterial color="#1c1e1d" />
                </mesh>
              </>
            ) : (
              <>
                <Ball color="#141615" position={[-0.15, 0.02, 0.02]} scale={[0.09, 0.115, 0.08]} segs={16} />
                <Ball color="#141615" position={[0.15, 0.02, 0.02]} scale={[0.09, 0.115, 0.08]} segs={16} />
                <mesh position={[-0.13, 0.055, 0.08]}>
                  <sphereGeometry args={[0.028, 10, 10]} />
                  <meshStandardMaterial color="#f4f6f3" emissive="#f4f6f3" emissiveIntensity={0.45} />
                </mesh>
                <mesh position={[0.17, 0.055, 0.08]}>
                  <sphereGeometry args={[0.028, 10, 10]} />
                  <meshStandardMaterial color="#f4f6f3" emissive="#f4f6f3" emissiveIntensity={0.45} />
                </mesh>
                <mesh position={[0, -0.12, 0.02]}>
                  <sphereGeometry args={[0.035, 10, 8]} />
                  <meshStandardMaterial color={look.shade} roughness={0.5} />
                </mesh>
              </>
            )}
          </group>
          {species === "bloop" && (
            <group position={[0, 0.52, 0]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.03, 0.038, 0.34, 12]} />
                <VinylMaterial color={look.shade} />
              </mesh>
              <Ball color={look.extra} position={[0, 0.24, 0]} scale={0.13} segs={Math.max(16, segs / 2)} />
            </group>
          )}
          {species === "sprout" && (
            <group position={[0, 0.48, -0.02]} rotation={[0.2, 0.35, 0.15]}>
              <mesh castShadow rotation={[0.55, 0, -0.35]} position={[-0.1, 0.08, 0]}>
                <sphereGeometry args={[0.24, 20, 16]} />
                <VinylMaterial color={look.extra} />
              </mesh>
              <mesh castShadow rotation={[0.45, 0, 0.4]} position={[0.12, 0.1, -0.04]} scale={[1, 0.42, 0.68]}>
                <sphereGeometry args={[0.22, 20, 16]} />
                <VinylMaterial color={look.shade} />
              </mesh>
            </group>
          )}
          {species === "niblet" && (
            <group>
              <mesh castShadow position={[-0.32, 0.32, 0]} rotation={[0, 0, 0.48]}>
                <coneGeometry args={[0.13, 0.36, 4]} />
                <VinylMaterial color={look.extra} />
              </mesh>
              <mesh castShadow position={[0.32, 0.32, 0]} rotation={[0, 0, -0.48]}>
                <coneGeometry args={[0.13, 0.36, 4]} />
                <VinylMaterial color={look.extra} />
              </mesh>
            </group>
          )}
        </group>
        <Gear equipped={equipped} segs={segs} />
      </group>
    </group>
  );
}
