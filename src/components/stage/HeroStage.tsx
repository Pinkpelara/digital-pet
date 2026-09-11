"use client";

import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { MathUtils } from "three";
import { FigurineMesh } from "@/components/stage/FigurineMesh";
import { FollowLight } from "@/components/stage/FollowLight";
import { StageCanvas } from "@/components/stage/StageCanvas";
import { StudioLights, StudioShadows } from "@/components/stage/StudioKit";
import { STAGE_BG, STAGE_FOG } from "@/lib/stage-theme";
import type { CreatureMood, DemoActionId, EquipmentLoadout, SkillId, SpeciesId } from "@/lib/types";

const moods: CreatureMood[] = ["follow", "climb", "happy", "follow", "nap", "follow"];

function Rig({
  pointer,
  scroll,
  mobile,
  mood,
  skill,
  demo,
  sulk,
  equipped,
  species,
}: {
  pointer: { x: number; y: number };
  scroll: number;
  mobile: boolean;
  mood: CreatureMood;
  skill: SkillId | null;
  demo: DemoActionId | null;
  sulk: boolean;
  equipped: EquipmentLoadout;
  species: SpeciesId;
}) {
  const group = useRef<Group>(null);
  useFrame((state) => {
    const cam = state.camera;
    const targetX = mobile ? pointer.x * 0.38 : 0.28 + pointer.x * 0.55;
    const targetY = 0.38 + pointer.y * -0.22;
    const targetZ = (mobile ? 5.7 : 5.15) + scroll * 0.55;
    cam.position.x = MathUtils.lerp(cam.position.x, targetX, 0.05);
    cam.position.y = MathUtils.lerp(cam.position.y, targetY, 0.05);
    cam.position.z = MathUtils.lerp(cam.position.z, targetZ, 0.055);
    cam.lookAt(mobile ? 0 : 0.42, 0.16, 0);
    if (group.current && !demo && !sulk) {
      group.current.rotation.y = MathUtils.lerp(group.current.rotation.y, pointer.x * 0.28, 0.055);
      group.current.rotation.x = MathUtils.lerp(group.current.rotation.x, pointer.y * -0.08, 0.05);
    }
  });
  return (
    <group ref={group} position={mobile ? [0, 0.04, 0] : [0.48, 0.02, 0]} scale={mobile ? 1.28 : 1.48}>
      <FigurineMesh
        species={species}
        followPointer={!demo && !sulk}
        pointer={pointer}
        quality={mobile ? "medium" : "high"}
        mood={mood}
        skill={skill}
        demo={demo}
        sulk={sulk}
        equipped={equipped}
      />
    </group>
  );
}

export function HeroStage({
  mood: moodOverride,
  skill = null,
  demo = null,
  sulk = false,
  equipped = {},
  species = "bloop",
}: {
  mood?: CreatureMood;
  skill?: SkillId | null;
  demo?: DemoActionId | null;
  sulk?: boolean;
  equipped?: EquipmentLoadout;
  species?: SpeciesId;
}) {
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [scroll, setScroll] = useState(0);
  const [mobile, setMobile] = useState(true);
  const [mood, setMood] = useState<CreatureMood>("follow");
  const [reducedMotion, setReducedMotion] = useState(false);
  const reduce = useRef(false);

  useEffect(() => {
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReducedMotion(reduce.current);
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
    if (!reduce.current && !demo && !moodOverride) {
      let index = 0;
      const timer = window.setInterval(() => {
        index = (index + 1) % moods.length;
        setMood(moods[index]);
      }, 4200);
      return () => {
        window.removeEventListener("scroll", onScroll);
        mq.removeEventListener("change", syncMobile);
        window.clearInterval(timer);
      };
    }
    return () => {
      window.removeEventListener("scroll", onScroll);
      mq.removeEventListener("change", syncMobile);
    };
  }, [demo, moodOverride]);

  return (
    <StageCanvas
      className="absolute inset-0"
      alpha={false}
      eager
      dprMax={mobile ? 1 : 1.35}
      camera={{ position: [0.2, 0.42, 5.4], fov: 32, far: 40 }}
      onPointerMove={(event) => {
        if (reduce.current) return;
        const x = (event.clientX / window.innerWidth) * 2 - 1;
        const y = (event.clientY / window.innerHeight) * 2 - 1;
        setPointer({ x, y });
      }}
    >
      <color attach="background" args={[STAGE_BG]} />
      <fog attach="fog" args={[STAGE_FOG, 10, 24]} />
      <StudioLights />
      {!reducedMotion && !mobile ? <FollowLight pointer={pointer} /> : null}
      <Rig
        pointer={pointer}
        scroll={scroll}
        mobile={mobile}
        mood={moodOverride ?? (demo ? "skill" : mood)}
        skill={skill}
        demo={demo}
        sulk={sulk}
        equipped={equipped}
        species={species}
      />
      <StudioShadows position={[0, -0.96, 0]} scale={12} />
    </StageCanvas>
  );
}
