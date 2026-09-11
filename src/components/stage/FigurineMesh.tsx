"use client";

import { createContext, useContext, useMemo, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { clay, figurineLook } from "@/lib/figurine-look";
import { actionFromLoadout } from "@/lib/demo-actions";
import type { CreatureMood, DemoActionId, EquipmentLoadout, SkillId, SpeciesId } from "@/lib/types";

type MeshQuality = "high" | "medium" | "low";

const MeshQualityContext = createContext<MeshQuality>("high");

function ClayMaterial({ color }: { color: string }) {
  const quality = useContext(MeshQualityContext);
  if (quality !== "high") {
    return <meshStandardMaterial color={color} roughness={clay.roughness} metalness={clay.metalness} />;
  }
  return (
    <meshPhysicalMaterial
      color={color}
      roughness={clay.roughness}
      metalness={clay.metalness}
      clearcoat={clay.clearcoat}
      clearcoatRoughness={clay.clearcoatRoughness}
      sheen={clay.sheen}
      sheenRoughness={clay.sheenRoughness}
      sheenColor={clay.sheenColor}
      envMapIntensity={0.55}
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
      <ClayMaterial color={color} />
    </mesh>
  );
}

function Gear({
  equipped,
  segs,
  skating,
  photographing,
  raining,
  umbrellaRef,
}: {
  equipped: EquipmentLoadout;
  segs: number;
  skating: boolean;
  photographing: boolean;
  raining: boolean;
  umbrellaRef: RefObject<Group | null>;
}) {
  const body = equipped.body;
  const face = equipped.face;
  const head = equipped.head;
  const back = equipped.back;
  const hand = photographing ? "gadget-camera" : raining ? "gadget-umbrella" : equipped.hand;
  const feet = skating ? "gadget-skateboard" : equipped.feet;
  return (
    <group>
      {(body === "outfit-raincoat" || body === "drop-starrycoat") && (
        <group>
          <mesh castShadow position={[0, -0.2, 0.03]} scale={[1.24, 1.02, 1.2]}>
            <sphereGeometry args={[0.52, 36, 22, 0, Math.PI * 2, 0.12, Math.PI * 0.78]} />
            <ClayMaterial color={body === "drop-starrycoat" ? "#3a4a72" : "#F2C14E"} />
          </mesh>
          <mesh castShadow position={[0, 0.48, -0.16]} rotation={[0.35, 0, 0]} scale={[0.62, 0.5, 0.55]}>
            <sphereGeometry args={[0.42, 20, 16, 0, Math.PI * 2, 0, Math.PI * 0.62]} />
            <ClayMaterial color={body === "drop-starrycoat" ? "#2c3a5c" : "#E8B43C"} />
          </mesh>
        </group>
      )}
      {body === "outfit-hoodie" && (
        <mesh castShadow position={[0, -0.12, 0]} scale={[1.2, 0.95, 1.16]}>
          <sphereGeometry args={[0.52, 32, 20, 0, Math.PI * 2, 0, Math.PI * 0.78]} />
          <ClayMaterial color="#C5D4E0" />
        </mesh>
      )}
      {body === "drop-cape" && (
        <mesh castShadow position={[0, -0.18, -0.38]} rotation={[0.38, 0, 0]}>
          <capsuleGeometry args={[0.34, 0.62, 8, 16]} />
          <ClayMaterial color="#3a3a5c" />
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
            <ClayMaterial color="#6AA33A" />
          </mesh>
          <mesh position={[0, -0.05, 0.24]} rotation={[0.2, 0, 0]}>
            <boxGeometry args={[0.62, 0.035, 0.24]} />
            <ClayMaterial color="#5A8A2C" />
          </mesh>
        </group>
      )}
      {head === "outfit-scarf" && (
        <mesh castShadow position={[0, 0.22, 0.08]} rotation={[0.18, 0.35, 0]}>
          <torusGeometry args={[0.42, 0.08, 12, 24]} />
          <ClayMaterial color="#6a7c86" />
        </mesh>
      )}
      {head === "gadget-headphones" && (
        <group position={[0, 0.58, 0.04]}>
          <mesh rotation={[0, 0, Math.PI / 2]} position={[0, 0.16, -0.04]}>
            <torusGeometry args={[0.38, 0.035, 8, 18, Math.PI]} />
            <meshStandardMaterial color="#2a2a2a" roughness={0.4} />
          </mesh>
          <mesh castShadow position={[-0.42, 0.04, 0.12]} rotation={[0, 0.4, 0]}>
            <cylinderGeometry args={[0.16, 0.16, 0.09, 16]} />
            <ClayMaterial color="#1a1a1a" />
          </mesh>
          <mesh castShadow position={[0.42, 0.04, 0.12]} rotation={[0, -0.4, 0]}>
            <cylinderGeometry args={[0.16, 0.16, 0.09, 16]} />
            <ClayMaterial color="#1a1a1a" />
          </mesh>
        </group>
      )}
      {head === "gadget-partyhat" && (
        <group position={[0, 1.08, 0]} rotation={[0.12, 0.2, -0.08]}>
          <mesh castShadow>
            <coneGeometry args={[0.24, 0.5, 8]} />
            <ClayMaterial color="#E86B6B" />
          </mesh>
          <mesh position={[0, 0.28, 0]}>
            <sphereGeometry args={[0.06, 10, 10]} />
            <ClayMaterial color="#F2C14E" />
          </mesh>
        </group>
      )}
      {back === "gadget-balloon" && (
        <group position={[0.58, 1.22, -0.18]}>
          <Ball color="#E86B6B" scale={0.24} segs={Math.max(16, segs / 2)} />
          <mesh position={[0, -0.38, 0]}>
            <cylinderGeometry args={[0.01, 0.01, 0.46, 8]} />
            <meshStandardMaterial color="#c5c8c2" />
          </mesh>
        </group>
      )}
      {(hand === "gadget-umbrella" || raining) && (
        <group ref={umbrellaRef} position={[0.62, 0.02, 0.32]} rotation={[0.18, 0, -0.38]} scale={raining ? 0.01 : 1}>
          <mesh>
            <cylinderGeometry args={[0.022, 0.022, 0.82, 8]} />
            <meshStandardMaterial color="#d8d6cf" />
          </mesh>
          <mesh position={[0, 0.38, 0]}>
            <coneGeometry args={[0.28, 0.18, 16, 1, true]} />
            <ClayMaterial color="#5B8DEF" />
          </mesh>
        </group>
      )}
      {hand === "gadget-camera" && (
        <group position={[0.42, 0.22, 0.62]} rotation={[0.08, -0.55, 0.12]} scale={1.35}>
          <mesh castShadow>
            <boxGeometry args={[0.38, 0.26, 0.22]} />
            <ClayMaterial color="#3a3a3a" />
          </mesh>
          <mesh position={[0, 0.02, 0.14]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.09, 0.09, 0.12, 20]} />
            <meshStandardMaterial color="#9BE7F2" metalness={0.45} roughness={0.18} />
          </mesh>
          <mesh position={[0.1, 0.16, 0]}>
            <boxGeometry args={[0.1, 0.08, 0.12]} />
            <ClayMaterial color="#6B6B6B" />
          </mesh>
          <mesh position={[-0.12, 0.14, 0.04]}>
            <sphereGeometry args={[0.035, 10, 10]} />
            <meshStandardMaterial color="#E86B6B" emissive="#E86B6B" emissiveIntensity={0.6} />
          </mesh>
        </group>
      )}
      {hand === "gadget-broom" && (
        <group position={[0.58, -0.08, 0.28]} rotation={[0.35, 0.2, -0.55]}>
          <mesh>
            <cylinderGeometry args={[0.018, 0.022, 0.92, 8]} />
            <meshStandardMaterial color="#C4A574" />
          </mesh>
          <mesh position={[0, -0.48, 0]} rotation={[0.15, 0, 0]}>
            <coneGeometry args={[0.14, 0.26, 8]} />
            <ClayMaterial color="#E8C98A" />
          </mesh>
        </group>
      )}
      {feet === "gadget-skateboard" && (
        <group position={[0, -0.78, 0.28]} rotation={[0.12, 0.18, 0.04]}>
          <mesh castShadow>
            <boxGeometry args={[1.28, 0.1, 0.42]} />
            <ClayMaterial color="#C47F28" />
          </mesh>
          <mesh position={[0, 0.06, 0]}>
            <boxGeometry args={[1.02, 0.04, 0.22]} />
            <meshStandardMaterial color="#5B8DEF" roughness={0.4} />
          </mesh>
          <mesh position={[-0.42, -0.08, 0.16]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.09, 0.09, 0.1, 14]} />
            <meshStandardMaterial color="#1a1c1b" />
          </mesh>
          <mesh position={[0.42, -0.08, 0.16]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.09, 0.09, 0.1, 14]} />
            <meshStandardMaterial color="#1a1c1b" />
          </mesh>
          <mesh position={[-0.42, -0.08, -0.16]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.09, 0.09, 0.1, 14]} />
            <meshStandardMaterial color="#1a1c1b" />
          </mesh>
          <mesh position={[0.42, -0.08, -0.16]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.09, 0.09, 0.1, 14]} />
            <meshStandardMaterial color="#1a1c1b" />
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
  demo = null,
  sulk = false,
  followPointer = false,
  pointer,
  quality = "high",
  loop = false,
}: {
  species: SpeciesId;
  equipped?: EquipmentLoadout;
  mood?: CreatureMood;
  skill?: SkillId | null;
  demo?: DemoActionId | null;
  sulk?: boolean;
  followPointer?: boolean;
  pointer?: { x: number; y: number };
  quality?: MeshQuality;
  loop?: boolean;
}) {
  const root = useRef<Group>(null);
  const umbrella = useRef<Group>(null);
  const actionStarted = useRef(0);
  const lastAction = useRef<string | null>(null);
  const look = figurineLook[species];
  const segs = quality === "high" ? 48 : quality === "medium" ? 28 : 16;
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
    const action: DemoActionId | null = actionFromLoadout(equipped, skill, demo);
    if (action !== lastAction.current) {
      lastAction.current = action;
      actionStarted.current = t;
    }
    const local = t - actionStarted.current;
    if (umbrella.current) {
      const cycle = 4;
      const rainT = action === "rain-walk" && loop ? local % cycle : local;
      const open = action === "rain-walk" ? Math.min(1, Math.max(0, (rainT - 0.38) / 0.2)) : 1;
      umbrella.current.scale.setScalar(open);
      umbrella.current.visible = open > 0.02;
    }
    const maxY = 0.42;
    const watching = !action && (followPointer || mood === "follow");
    const nap = !action && (mood === "nap" || skill === "nap");
    const climbing = action === "climb" || (!action && mood === "climb");
    const hiding = action === "hide" || (!action && mood === "hide");
    const sulking = sulk && !action;

    group.position.x = 0;
    group.position.z = 0;
    group.rotation.z = 0;
    group.scale.setScalar(1);

    const lookY = watching ? (pointer?.x ?? 0) * maxY : Math.sin(t * 0.32) * 0.09;
    const lookX = watching ? (pointer?.y ?? 0) * -0.16 : Math.sin(t * 0.24) * 0.04;
    if (!action && !sulking) {
      group.rotation.y += (lookY - group.rotation.y) * 0.08;
      group.rotation.x += (lookX - group.rotation.x) * 0.08;
    }

    if (sulking) {
      group.rotation.y += (0.9 - group.rotation.y) * 0.06;
      group.rotation.x += (0.12 - group.rotation.x) * 0.06;
      group.position.y = -0.1;
      group.scale.setScalar(0.9);
      return;
    }

    if (action === "moonwalk") {
      const walk = 1.65;
      const duration = loop ? 3.6 : walk;
      const t = loop ? local % duration : Math.min(local, walk);
      const walkT = Math.min(t, walk);
      const traveling = t < walk;
      group.position.x = -(walkT / 0.55) * 0.16;
      group.rotation.y += (-0.85 - group.rotation.y) * 0.2;
      group.rotation.x += (0.06 - group.rotation.x) * 0.16;
      group.rotation.z = traveling ? Math.sin(walkT * 10) * 0.08 : 0;
      group.position.y = 0.06 + (traveling ? Math.abs(Math.sin(walkT * 14)) * 0.04 : 0);
      return;
    }
    if (action === "skate") {
      group.position.x = Math.sin(local * 3.2) * 0.55;
      group.rotation.z = Math.sin(local * 3.2) * 0.32;
      group.rotation.y += (0.55 - group.rotation.y) * 0.22;
      group.position.y = 0.2 + Math.abs(Math.sin(local * 6.4)) * 0.1;
      group.scale.setScalar(1.04);
      return;
    }
    if (action === "rain-walk") {
      const cycle = 4;
      const t = loop ? local % cycle : local;
      const opened = t > 0.38;
      group.position.x = opened ? Math.sin((t - 0.38) * 1.6) * 0.18 : 0;
      group.rotation.z = opened ? Math.sin((t - 0.38) * 3.4) * 0.08 : 0;
      group.rotation.y += (0.28 - group.rotation.y) * 0.12;
      group.position.y = opened ? Math.abs(Math.sin((t - 0.38) * 3.4)) * 0.05 : 0;
      return;
    }
    if (action === "twirl") {
      const duration = 1.6;
      const t = loop ? local % duration : Math.min(local, duration);
      group.rotation.y = t * (Math.PI * 2) / duration;
      group.position.y = 0.08 + Math.abs(Math.sin(t * 8)) * 0.04;
      return;
    }
    if (action === "mood-peek") {
      const duration = 1.6;
      const t = loop ? local % duration : Math.min(local, duration);
      const lean = Math.sin((t / duration) * Math.PI);
      group.position.z = lean * 0.28;
      group.rotation.x += ((-0.18 * lean) - group.rotation.x) * 0.16;
      group.rotation.y += (0.12 * Math.sin(t * 3) - group.rotation.y) * 0.12;
      group.scale.setScalar(1 + lean * 0.06);
      return;
    }
    if (action === "gift") {
      const duration = 2;
      const t = loop ? local % duration : Math.min(local, duration);
      group.position.y = Math.abs(Math.sin(t * 6)) * 0.1;
      group.rotation.z = Math.sin(t * 6) * 0.1;
      group.rotation.y += (0.35 - group.rotation.y) * 0.12;
      return;
    }
    if (action === "study") {
      group.position.y = -0.08 + Math.sin(local * 1.1) * 0.02;
      group.rotation.x += (0.22 - group.rotation.x) * 0.1;
      group.rotation.y += (-0.18 - group.rotation.y) * 0.08;
      return;
    }
    if (action === "mad") {
      const duration = 1.5;
      const t = loop ? local % duration : Math.min(local, duration);
      group.rotation.z = Math.sin(t * 18) * 0.08;
      group.position.x = Math.sin(t * 22) * 0.04;
      group.rotation.y += (0.15 - group.rotation.y) * 0.2;
      group.position.y = Math.abs(Math.sin(t * 10)) * 0.03;
      return;
    }
    if (action === "focus") {
      group.position.y = -0.04 + Math.sin(local * 0.9) * 0.015;
      group.rotation.x += (0.08 - group.rotation.x) * 0.1;
      group.rotation.y += (-0.12 - group.rotation.y) * 0.08;
      return;
    }
    if (action === "stretch") {
      const duration = 2.8;
      const t = loop ? local % duration : Math.min(local, duration);
      const reach = Math.sin((t / duration) * Math.PI);
      group.scale.set(1, 1 + reach * 0.18, 1);
      group.position.y = reach * 0.12;
      group.rotation.x += ((-0.22 * reach) - group.rotation.x) * 0.12;
      return;
    }
    if (action === "adventure") {
      const duration = 3.2;
      const t = loop ? local % duration : Math.min(local, duration);
      const enter = Math.min(1, t / 0.7);
      group.position.x = (1 - enter) * 1.1;
      group.position.y = 0.08 + Math.abs(Math.sin(t * 8)) * 0.05 * enter;
      group.rotation.y += (0.4 - group.rotation.y) * 0.12;
      return;
    }
    if (action === "party") {
      group.position.y = Math.abs(Math.sin(local * 7)) * 0.12;
      group.rotation.z = Math.sin(local * 7) * 0.14;
      group.rotation.y += (Math.sin(local * 2.4) * 0.4 - group.rotation.y) * 0.12;
      return;
    }
    if (action === "chaos") {
      group.position.x = Math.sin(local * 9) * 0.28;
      group.position.y = Math.abs(Math.sin(local * 11)) * 0.14;
      group.rotation.z = Math.sin(local * 13) * 0.28;
      group.rotation.y += (Math.sin(local * 4) * 0.8 - group.rotation.y) * 0.2;
      return;
    }
    if (action === "climb" || climbing) {
      group.position.y = 0.22 + Math.sin(local * 2.5) * 0.14;
      group.rotation.z = Math.sin(local * 2.5) * 0.1;
      group.rotation.x += (-0.12 - group.rotation.x) * 0.08;
      return;
    }
    if (action === "nap" || nap) {
      group.position.y = -0.14 + Math.sin(t * 0.8) * 0.012;
      group.rotation.z += (0.62 - group.rotation.z) * 0.1;
      group.rotation.y += (0.2 - group.rotation.y) * 0.08;
      group.scale.setScalar(0.94);
      return;
    }
    if (action === "photo-pose") {
      const snap = Math.sin(local * 6.4) > 0.5 ? 1.14 : 1;
      group.rotation.y += (0.7 - group.rotation.y) * 0.28;
      group.rotation.z += (-0.18 - group.rotation.z) * 0.28;
      group.position.y = 0.1;
      group.scale.setScalar(snap);
      return;
    }
    if (action === "hover" || action === "balloon-bunch") {
      const lift = action === "balloon-bunch" ? 0.55 : 0.42;
      group.position.y = lift + Math.sin(local * 1.8) * 0.12;
      group.rotation.z = Math.sin(local * 1.5) * 0.1;
      group.rotation.y += (Math.sin(local * 0.9) * 0.28 - group.rotation.y) * 0.1;
      return;
    }
    if (action === "tidy") {
      group.rotation.z = Math.sin(local * 8) * 0.32;
      group.position.x = Math.sin(local * 4) * 0.16;
      group.position.y = Math.abs(Math.sin(local * 8)) * 0.06;
      group.scale.setScalar(1.05);
      return;
    }
    if (action === "dance") {
      group.rotation.z = Math.sin(local * 7.2) * 0.16;
      group.position.y = Math.abs(Math.sin(local * 7.2)) * 0.09;
      group.rotation.y += (Math.sin(local * 3) * 0.25 - group.rotation.y) * 0.1;
      return;
    }
    if (action === "cartwheel") {
      group.rotation.z = local * 5.2;
      group.position.y = 0.22 + Math.sin(local * 5.2) * 0.04;
      return;
    }
    if (action === "juggle") {
      group.position.y = Math.abs(Math.sin(local * 5.4)) * 0.06;
      group.rotation.z = Math.sin(local * 5.4) * 0.05;
      return;
    }
    if (action === "hide" || hiding) {
      group.scale.setScalar(0.7);
      group.position.y = -0.2;
      group.position.x = 0.2;
      group.rotation.y += (0.8 - group.rotation.y) * 0.1;
      return;
    }

    group.position.y =
      Math.sin(t * 1.15) * 0.045 + (mood === "happy" ? Math.abs(Math.sin(t * 4)) * 0.05 : 0);
  });

  const napping = mood === "nap" || skill === "nap" || demo === "nap";
  const juggling = demo === "juggle" || skill === "juggle";
  const liveAction = actionFromLoadout(equipped, skill, demo);
  const skating = liveAction === "skate";
  const photographing = liveAction === "photo-pose";
  const raining = liveAction === "rain-walk";
  const studying = liveAction === "study" || liveAction === "focus";
  const gifting = liveAction === "gift";
  const bunch = liveAction === "balloon-bunch" || liveAction === "party";
  const sticker = liveAction === "adventure";

  return (
    <MeshQualityContext.Provider value={quality}>
    <group ref={root}>
      <group position={[0, -0.02, 0]}>
        <group scale={proportions.body}>
          <Ball color={look.body} position={[0, -0.16, 0]} scale={0.54} segs={segs} />
          <Ball color={look.belly} position={[0, -0.22, 0.28]} scale={[0.34, 0.28, 0.22]} segs={segs} />
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.12, 0]} castShadow>
            <torusGeometry args={[0.42, 0.012, 8, 28]} />
            <meshStandardMaterial color={look.shade} roughness={0.55} metalness={0.04} />
          </mesh>
          {!skating && (
            <>
              <Ball color={look.shade} position={[-0.2, -0.88, 0.06]} scale={[0.16, 0.11, 0.15]} segs={20} />
              <Ball color={look.shade} position={[0.2, -0.88, 0.06]} scale={[0.16, 0.11, 0.15]} segs={20} />
            </>
          )}
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
                <ClayMaterial color={look.shade} />
              </mesh>
              <Ball color={look.extra} position={[0, 0.24, 0]} scale={0.13} segs={Math.max(16, segs / 2)} />
            </group>
          )}
          {species === "sprout" && (
            <group position={[0, 0.48, -0.02]} rotation={[0.2, 0.35, 0.15]}>
              <mesh castShadow rotation={[0.55, 0, -0.35]} position={[-0.1, 0.08, 0]}>
                <sphereGeometry args={[0.24, 20, 16]} />
                <ClayMaterial color={look.extra} />
              </mesh>
              <mesh castShadow rotation={[0.45, 0, 0.4]} position={[0.12, 0.1, -0.04]} scale={[1, 0.42, 0.68]}>
                <sphereGeometry args={[0.22, 20, 16]} />
                <ClayMaterial color={look.shade} />
              </mesh>
            </group>
          )}
          {species === "niblet" && (
            <group>
              <mesh castShadow position={[-0.32, 0.32, 0]} rotation={[0, 0, 0.48]}>
                <coneGeometry args={[0.13, 0.36, 4]} />
                <ClayMaterial color={look.extra} />
              </mesh>
              <mesh castShadow position={[0.32, 0.32, 0]} rotation={[0, 0, -0.48]}>
                <coneGeometry args={[0.13, 0.36, 4]} />
                <ClayMaterial color={look.extra} />
              </mesh>
            </group>
          )}
        </group>
        <Gear
          equipped={equipped}
          segs={segs}
          skating={skating}
          photographing={photographing}
          raining={raining}
          umbrellaRef={umbrella}
        />
        {studying && (
          <group position={[0.08, -0.52, 0.52]} rotation={[-0.42, 0.18, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.46, 0.03, 0.3]} />
              <ClayMaterial color="#3a3a3a" />
            </mesh>
            <mesh position={[0, 0.14, -0.12]} rotation={[1.05, 0, 0]}>
              <boxGeometry args={[0.44, 0.26, 0.018]} />
              <meshStandardMaterial color="#9BE7F2" roughness={0.25} metalness={0.2} />
            </mesh>
          </group>
        )}
        {gifting && (
          <group position={[-0.52, -0.32, 0.38]}>
            <mesh castShadow>
              <boxGeometry args={[0.28, 0.22, 0.28]} />
              <ClayMaterial color="#E86B6B" />
            </mesh>
            <mesh position={[0, 0.14, 0]}>
              <boxGeometry args={[0.32, 0.06, 0.32]} />
              <ClayMaterial color="#F2C14E" />
            </mesh>
          </group>
        )}
        {bunch && (
          <group position={[-0.5, 1.05, -0.12]}>
            <Ball color="#E86B6B" position={[0, 0, 0]} scale={0.18} segs={12} />
            <Ball color="#5B8DEF" position={[0.22, 0.08, -0.06]} scale={0.15} segs={12} />
            <Ball color="#F2C14E" position={[-0.16, 0.14, 0.08]} scale={0.14} segs={12} />
          </group>
        )}
        {sticker && (
          <mesh position={[0.18, -0.08, 0.48]} rotation={[0.2, -0.3, 0.15]}>
            <circleGeometry args={[0.12, 6]} />
            <meshStandardMaterial color="#F2C14E" emissive="#F2C14E" emissiveIntensity={0.25} />
          </mesh>
        )}
        {juggling && (
          <group position={[0, 0.7, 0.35]}>
            <Ball color="#E89B6C" position={[-0.22, 0.28, 0]} scale={0.08} segs={12} />
            <Ball color="#7E8CFF" position={[0.02, 0.48, 0.04]} scale={0.08} segs={12} />
            <Ball color="#F2C14E" position={[0.24, 0.22, 0]} scale={0.08} segs={12} />
          </group>
        )}
      </group>
    </group>
    </MeshQualityContext.Provider>
  );
}
