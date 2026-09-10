"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import type { Group } from "three";
import { MathUtils } from "three";
import { figurineLook, vinyl } from "@/lib/figurine-look";
import type { CreatureMood, EquipmentLoadout, SkillId, SpeciesId } from "@/lib/types";

function Clay({ color }: { color: string }) {
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
      envMapIntensity={0.7}
    />
  );
}

function Block({
  color,
  position,
  args,
  radius = 0.16,
  rotation,
}: {
  color: string;
  position?: [number, number, number];
  args: [number, number, number];
  radius?: number;
  rotation?: [number, number, number];
}) {
  return (
    <RoundedBox
      args={args}
      radius={Math.min(radius, args[0] / 2 - 0.01, args[1] / 2 - 0.01, args[2] / 2 - 0.01)}
      smoothness={5}
      position={position}
      rotation={rotation}
      castShadow
      receiveShadow
    >
      <Clay color={color} />
    </RoundedBox>
  );
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
        <Block
          color={body === "drop-starrycoat" ? "#3a4450" : "#c4a24a"}
          position={[0, -0.16, 0.04]}
          args={[1.08, 0.72, 0.78]}
          radius={0.18}
        />
      )}
      {body === "outfit-hoodie" && (
        <Block color="#4a524e" position={[0, -0.14, 0.02]} args={[1.08, 0.78, 0.76]} radius={0.2} />
      )}
      {body === "drop-cape" && (
        <Block color="#2c3340" position={[0, -0.2, -0.42]} args={[0.85, 0.9, 0.18]} radius={0.08} />
      )}
      {face === "outfit-sunglasses" && (
        <group position={[0, 0.62, 0.54]}>
          <mesh>
            <boxGeometry args={[0.62, 0.06, 0.06]} />
            <meshStandardMaterial color="#1a1c1b" metalness={0.45} roughness={0.22} />
          </mesh>
          <mesh position={[-0.16, 0, 0.03]}>
            <boxGeometry args={[0.22, 0.16, 0.04]} />
            <meshStandardMaterial color="#111" metalness={0.55} roughness={0.12} />
          </mesh>
          <mesh position={[0.16, 0, 0.03]}>
            <boxGeometry args={[0.22, 0.16, 0.04]} />
            <meshStandardMaterial color="#111" metalness={0.55} roughness={0.12} />
          </mesh>
        </group>
      )}
      {head === "outfit-sproutcap" && (
        <group position={[0, 1.1, 0]}>
          <Block color="#5a6848" args={[0.95, 0.22, 0.95]} radius={0.08} />
          <Block color="#4a533c" position={[0, -0.04, 0.28]} args={[0.7, 0.06, 0.28]} radius={0.02} />
        </group>
      )}
      {head === "outfit-scarf" && (
        <Block color="#6a7c86" position={[0, 0.18, 0.08]} args={[1.05, 0.18, 0.7]} radius={0.08} />
      )}
      {back === "gadget-balloon" && (
        <group position={[0.62, 1.15, -0.2]}>
          <mesh castShadow>
            <sphereGeometry args={[0.22, 20, 20]} />
            <Clay color="#8a9aa3" />
          </mesh>
          <mesh position={[0, -0.32, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 0.4, 8]} />
            <meshStandardMaterial color="#c5c8c2" />
          </mesh>
        </group>
      )}
      {hand === "gadget-umbrella" && (
        <group position={[0.72, 0.05, 0.28]} rotation={[0.15, 0, -0.3]}>
          <mesh>
            <cylinderGeometry args={[0.024, 0.024, 0.78, 8]} />
            <meshStandardMaterial color="#d8d6cf" />
          </mesh>
          <mesh position={[0, 0.36, 0]}>
            <coneGeometry args={[0.26, 0.16, 16, 1, true]} />
            <Clay color="#6a7c86" />
          </mesh>
        </group>
      )}
      {feet === "outfit-rainboots" && (
        <group>
          <Block color="#3a3d3b" position={[-0.22, -0.86, 0.12]} args={[0.32, 0.2, 0.4]} radius={0.06} />
          <Block color="#3a3d3b" position={[0.22, -0.86, 0.12]} args={[0.32, 0.2, 0.4]} radius={0.06} />
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
  press = 0,
}: {
  species: SpeciesId;
  equipped?: EquipmentLoadout;
  mood?: CreatureMood;
  skill?: SkillId | null;
  followPointer?: boolean;
  pointer?: { x: number; y: number };
  press?: number;
  quality?: "high" | "medium";
}) {
  const root = useRef<Group>(null);
  const squash = useRef<Group>(null);
  const look = figurineLook[species];
  const shape = useMemo(() => {
    if (species === "mochi") return { head: 1.12, body: 1.18, tall: 0.88 };
    if (species === "sprout") return { head: 0.94, body: 0.9, tall: 1.08 };
    if (species === "niblet") return { head: 1.04, body: 0.92, tall: 0.94 };
    return { head: 1, body: 1, tall: 1 };
  }, [species]);

  useFrame((state) => {
    const group = root.current;
    const body = squash.current;
    if (!group) return;
    const t = state.clock.elapsedTime;
    const targetY = followPointer ? (pointer?.x ?? 0) * 0.42 : Math.sin(t * 0.32) * 0.08;
    const targetX = followPointer ? (pointer?.y ?? 0) * -0.16 : Math.sin(t * 0.24) * 0.04;
    group.rotation.y += (targetY - group.rotation.y) * 0.08;
    group.rotation.x += (targetX - group.rotation.x) * 0.08;
    const nap = mood === "nap" || skill === "nap";
    group.position.y = nap ? -0.08 : Math.sin(t * (skill ? 3.1 : 1.05)) * (skill ? 0.07 : 0.035);
    if (skill === "moonwalk") group.position.x = Math.sin(t * 2) * 0.1;
    if (skill === "dance") group.rotation.z = Math.sin(t * 6) * 0.07;
    if (body) {
      const p = MathUtils.clamp(press, 0, 1);
      const sy = 1 - p * 0.28;
      const sx = 1 + p * 0.16;
      body.scale.x = MathUtils.lerp(body.scale.x, sx, 0.18);
      body.scale.y = MathUtils.lerp(body.scale.y, sy, 0.18);
      body.scale.z = MathUtils.lerp(body.scale.z, sx, 0.18);
    }
  });

  const napping = mood === "nap" || skill === "nap";

  return (
    <group ref={root}>
      <group ref={squash}>
        <group scale={[shape.body, shape.tall, shape.body]}>
          <Block color={look.body} position={[0, -0.16, 0]} args={[0.95, 0.72, 0.68]} radius={0.2} />
          <Block color={look.belly} position={[0, -0.2, 0.22]} args={[0.62, 0.42, 0.28]} radius={0.12} />
          <Block color={look.body} position={[-0.62, -0.1, 0]} args={[0.3, 0.62, 0.3]} radius={0.12} />
          <Block color={look.body} position={[0.62, -0.1, 0]} args={[0.3, 0.62, 0.3]} radius={0.12} />
          <Block color={look.shade} position={[-0.22, -0.72, 0.04]} args={[0.32, 0.4, 0.34]} radius={0.1} />
          <Block color={look.shade} position={[0.22, -0.72, 0.04]} args={[0.32, 0.4, 0.34]} radius={0.1} />
        </group>

        <group position={[0, 0.58, 0]} scale={shape.head}>
          <Block color={look.body} args={[1.02, 0.92, 1.02]} radius={0.22} />
          <mesh position={[-0.22, 0.14, 0.42]} castShadow>
            <sphereGeometry args={[0.08, 12, 12]} />
            <meshStandardMaterial color={look.gloss} roughness={0.2} />
          </mesh>
          <group position={[0, 0.04, 0.52]}>
            {napping ? (
              <>
                <mesh position={[-0.18, 0, 0]} rotation={[0, 0, 0.2]}>
                  <boxGeometry args={[0.16, 0.03, 0.03]} />
                  <meshStandardMaterial color="#1c1e1d" />
                </mesh>
                <mesh position={[0.18, 0, 0]} rotation={[0, 0, -0.2]}>
                  <boxGeometry args={[0.16, 0.03, 0.03]} />
                  <meshStandardMaterial color="#1c1e1d" />
                </mesh>
              </>
            ) : (
              <>
                <Block color="#141615" position={[-0.18, 0.04, 0]} args={[0.2, 0.24, 0.12]} radius={0.06} />
                <Block color="#141615" position={[0.18, 0.04, 0]} args={[0.2, 0.24, 0.12]} radius={0.06} />
                <mesh position={[-0.14, 0.1, 0.07]}>
                  <sphereGeometry args={[0.035, 10, 10]} />
                  <meshStandardMaterial color="#f4f6f3" emissive="#f4f6f3" emissiveIntensity={0.5} />
                </mesh>
                <mesh position={[0.22, 0.1, 0.07]}>
                  <sphereGeometry args={[0.035, 10, 10]} />
                  <meshStandardMaterial color="#f4f6f3" emissive="#f4f6f3" emissiveIntensity={0.5} />
                </mesh>
              </>
            )}
          </group>
          {species === "bloop" && (
            <group position={[0, 0.58, 0]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.045, 0.05, 0.28, 12]} />
                <Clay color={look.shade} />
              </mesh>
              <Block color={look.extra} position={[0, 0.2, 0]} args={[0.22, 0.22, 0.22]} radius={0.08} />
            </group>
          )}
          {species === "sprout" && (
            <group position={[0.12, 0.52, -0.05]} rotation={[0.2, 0.3, 0.2]}>
              <Block color={look.extra} args={[0.42, 0.12, 0.28]} radius={0.05} rotation={[0.4, 0, -0.3]} />
              <Block color={look.shade} position={[0.12, 0.02, 0]} args={[0.36, 0.1, 0.24]} radius={0.04} />
            </group>
          )}
          {species === "niblet" && (
            <group>
              <mesh castShadow position={[-0.38, 0.42, 0]} rotation={[0, 0, 0.45]}>
                <coneGeometry args={[0.14, 0.32, 4]} />
                <Clay color={look.extra} />
              </mesh>
              <mesh castShadow position={[0.38, 0.42, 0]} rotation={[0, 0, -0.45]}>
                <coneGeometry args={[0.14, 0.32, 4]} />
                <Clay color={look.extra} />
              </mesh>
            </group>
          )}
        </group>
        <Gear equipped={equipped} />
      </group>
    </group>
  );
}
