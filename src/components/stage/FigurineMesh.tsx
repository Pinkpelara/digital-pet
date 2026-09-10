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
    />
  );
}

function VinylSphere({
  color,
  position,
  scale = 1,
  args = [1, 48, 48],
}: {
  color: string;
  position?: [number, number, number];
  scale?: number | [number, number, number];
  args?: [number, number, number];
}) {
  return (
    <mesh castShadow receiveShadow position={position} scale={scale}>
      <sphereGeometry args={args} />
      <VinylMaterial color={color} />
    </mesh>
  );
}

function extras(species: SpeciesId, look: (typeof figurineLook)[SpeciesId]) {
  switch (species) {
    case "bloop":
      return (
        <group>
          <mesh castShadow position={[0, 1.12, 0]}>
            <cylinderGeometry args={[0.035, 0.04, 0.42, 12]} />
            <VinylMaterial color={look.shade} />
          </mesh>
          <VinylSphere color={look.extra} position={[0, 1.38, 0]} scale={0.16} args={[1, 24, 24]} />
        </group>
      );
    case "mochi":
      return (
        <group>
          <VinylSphere color={look.body} position={[-0.72, 0.28, 0.05]} scale={[0.22, 0.18, 0.16]} />
          <VinylSphere color={look.body} position={[0.72, 0.28, 0.05]} scale={[0.22, 0.18, 0.16]} />
        </group>
      );
    case "sprout":
      return (
        <group position={[0, 0.92, 0]} rotation={[0.15, 0.4, 0.2]}>
          <mesh castShadow rotation={[0.6, 0, -0.4]} position={[-0.12, 0.08, 0]}>
            <sphereGeometry args={[0.28, 20, 16]} />
            <VinylMaterial color={look.extra} />
          </mesh>
          <mesh castShadow rotation={[0.5, 0, 0.45]} position={[0.14, 0.1, -0.04]} scale={[1, 0.45, 0.7]}>
            <sphereGeometry args={[0.26, 20, 16]} />
            <VinylMaterial color={look.shade} />
          </mesh>
        </group>
      );
    case "niblet":
      return (
        <group>
          <mesh castShadow position={[-0.55, 0.72, 0]} rotation={[0, 0, 0.55]}>
            <coneGeometry args={[0.16, 0.42, 4]} />
            <VinylMaterial color={look.extra} />
          </mesh>
          <mesh castShadow position={[0.55, 0.72, 0]} rotation={[0, 0, -0.55]}>
            <coneGeometry args={[0.16, 0.42, 4]} />
            <VinylMaterial color={look.extra} />
          </mesh>
        </group>
      );
  }
}

function Gear({ equipped }: { equipped: EquipmentLoadout }) {
  const body = equipped.body;
  const face = equipped.face;
  const head = equipped.head;
  const back = equipped.back;
  const hand = equipped.hand;
  const feet = equipped.feet;
  return (
    <group>
      {(body === "outfit-raincoat" || body === "drop-starrycoat") && (
        <mesh castShadow position={[0, -0.12, 0.02]} scale={[1.18, 0.72, 1.12]}>
          <sphereGeometry args={[0.78, 40, 28, 0, Math.PI * 2, 0, Math.PI * 0.62]} />
          <VinylMaterial color={body === "drop-starrycoat" ? "#3a4450" : "#c4a24a"} />
        </mesh>
      )}
      {body === "outfit-hoodie" && (
        <mesh castShadow position={[0, 0.05, 0]} scale={[1.12, 0.85, 1.08]}>
          <sphereGeometry args={[0.78, 36, 24, 0, Math.PI * 2, 0, Math.PI * 0.7]} />
          <VinylMaterial color="#4a524e" />
        </mesh>
      )}
      {body === "drop-cape" && (
        <mesh castShadow position={[0, -0.1, -0.35]} rotation={[0.35, 0, 0]}>
          <capsuleGeometry args={[0.42, 0.7, 8, 16]} />
          <VinylMaterial color="#2c3340" />
        </mesh>
      )}
      {face === "outfit-sunglasses" && (
        <group position={[0, 0.28, 0.72]}>
          <mesh>
            <boxGeometry args={[0.72, 0.06, 0.06]} />
            <meshStandardMaterial color="#1a1c1b" metalness={0.4} roughness={0.25} />
          </mesh>
          <mesh position={[-0.2, 0, 0.04]}>
            <circleGeometry args={[0.14, 20]} />
            <meshStandardMaterial color="#111" metalness={0.6} roughness={0.15} />
          </mesh>
          <mesh position={[0.2, 0, 0.04]}>
            <circleGeometry args={[0.14, 20]} />
            <meshStandardMaterial color="#111" metalness={0.6} roughness={0.15} />
          </mesh>
        </group>
      )}
      {head === "outfit-sproutcap" && (
        <group position={[0, 0.95, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.42, 0.48, 0.22, 24]} />
            <VinylMaterial color="#5a6848" />
          </mesh>
          <mesh position={[0, -0.06, 0.28]} rotation={[0.2, 0, 0]}>
            <boxGeometry args={[0.7, 0.04, 0.28]} />
            <VinylMaterial color="#4a533c" />
          </mesh>
        </group>
      )}
      {head === "outfit-scarf" && (
        <mesh castShadow position={[0, 0.02, 0.1]} rotation={[0.2, 0.4, 0]}>
          <torusGeometry args={[0.55, 0.1, 12, 24]} />
          <VinylMaterial color="#6a7c86" />
        </mesh>
      )}
      {back === "gadget-balloon" && (
        <group position={[0.55, 1.15, -0.2]}>
          <VinylSphere color="#8a9aa3" scale={0.28} />
          <mesh position={[0, -0.42, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 0.5, 8]} />
            <meshStandardMaterial color="#c5c8c2" />
          </mesh>
        </group>
      )}
      {hand === "gadget-umbrella" && (
        <group position={[0.7, 0.1, 0.35]} rotation={[0.2, 0, -0.4]}>
          <mesh>
            <cylinderGeometry args={[0.025, 0.025, 0.9, 8]} />
            <meshStandardMaterial color="#d8d6cf" />
          </mesh>
          <mesh position={[0, 0.42, 0]}>
            <coneGeometry args={[0.32, 0.2, 16, 1, true]} />
            <VinylMaterial color="#6a7c86" />
          </mesh>
        </group>
      )}
      {feet === "outfit-rainboots" && (
        <group>
          <VinylSphere color="#3a3d3b" position={[-0.28, -0.92, 0.12]} scale={[0.2, 0.14, 0.26]} />
          <VinylSphere color="#3a3d3b" position={[0.28, -0.92, 0.12]} scale={[0.2, 0.14, 0.26]} />
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
}: {
  species: SpeciesId;
  equipped?: EquipmentLoadout;
  mood?: CreatureMood;
  skill?: SkillId | null;
  followPointer?: boolean;
  pointer?: { x: number; y: number };
}) {
  const root = useRef<Group>(null);
  const look = figurineLook[species];
  const bodyScale = useMemo<[number, number, number]>(() => {
    if (species === "mochi") return [1.18, 0.92, 1.12];
    if (species === "sprout") return [0.92, 1.08, 0.95];
    if (species === "niblet") return [0.95, 0.9, 1];
    return [1, 1.02, 1];
  }, [species]);

  useFrame((state) => {
    const group = root.current;
    if (!group) return;
    const t = state.clock.elapsedTime;
    const targetY = followPointer ? (pointer?.x ?? 0) * 0.45 : Math.sin(t * 0.35) * 0.08;
    const targetX = followPointer ? (pointer?.y ?? 0) * -0.18 : Math.sin(t * 0.27) * 0.04;
    group.rotation.y += (targetY - group.rotation.y) * 0.06;
    group.rotation.x += (targetX - group.rotation.x) * 0.06;
    const nap = mood === "nap" || skill === "nap";
    group.position.y = nap ? -0.08 : Math.sin(t * (skill ? 3.2 : 1.15)) * (skill ? 0.08 : 0.045);
    if (skill === "moonwalk") group.position.x = Math.sin(t * 2) * 0.12;
    if (skill === "dance") group.rotation.z = Math.sin(t * 6) * 0.08;
  });

  const napping = mood === "nap" || skill === "nap";

  return (
    <group ref={root} position={[0, 0.15, 0]}>
      <group scale={bodyScale}>
        {extras(species, look)}
        <VinylSphere color={look.body} scale={0.82} />
        <VinylSphere color={look.belly} position={[0, -0.12, 0.38]} scale={[0.48, 0.38, 0.32]} />
        <VinylSphere color={look.gloss} position={[-0.28, 0.18, 0.55]} scale={0.12} args={[1, 16, 16]} />
        <VinylSphere color={look.shade} position={[-0.28, -0.78, 0.08]} scale={[0.18, 0.12, 0.16]} />
        <VinylSphere color={look.shade} position={[0.28, -0.78, 0.08]} scale={[0.18, 0.12, 0.16]} />
        <group position={[0, 0.22, 0.62]}>
          {napping ? (
            <>
              <mesh position={[-0.18, 0, 0]} rotation={[0, 0, 0.2]}>
                <boxGeometry args={[0.16, 0.025, 0.02]} />
                <meshStandardMaterial color="#1c1e1d" />
              </mesh>
              <mesh position={[0.18, 0, 0]} rotation={[0, 0, -0.2]}>
                <boxGeometry args={[0.16, 0.025, 0.02]} />
                <meshStandardMaterial color="#1c1e1d" />
              </mesh>
            </>
          ) : (
            <>
              <VinylSphere color="#161816" position={[-0.18, 0.02, 0.02]} scale={[0.09, 0.11, 0.08]} args={[1, 16, 16]} />
              <VinylSphere color="#161816" position={[0.18, 0.02, 0.02]} scale={[0.09, 0.11, 0.08]} args={[1, 16, 16]} />
              <mesh position={[-0.16, 0.05, 0.08]}>
                <sphereGeometry args={[0.025, 10, 10]} />
                <meshStandardMaterial color="#f4f6f3" emissive="#f4f6f3" emissiveIntensity={0.4} />
              </mesh>
              <mesh position={[0.2, 0.05, 0.08]}>
                <sphereGeometry args={[0.025, 10, 10]} />
                <meshStandardMaterial color="#f4f6f3" emissive="#f4f6f3" emissiveIntensity={0.4} />
              </mesh>
            </>
          )}
        </group>
        <Gear equipped={equipped} />
      </group>
    </group>
  );
}
