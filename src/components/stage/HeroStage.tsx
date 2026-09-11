"use client";

import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { MathUtils } from "three";
import { FigurineMesh } from "@/components/stage/FigurineMesh";
import { StageCanvas } from "@/components/stage/StageCanvas";
import { StudioLights, StudioShadows } from "@/components/stage/StudioKit";
import type { CreatureMood, DemoActionId, EquipmentLoadout, SkillId } from "@/lib/types";

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
}: {
  pointer: { x: number; y: number };
  scroll: number;
  mobile: boolean;
  mood: CreatureMood;
  skill: SkillId | null;
  demo: DemoActionId | null;
  sulk: boolean;
  equipped: EquipmentLoadout;
}) {
  const group = useRef<Group>(null);
  useFrame((state) => {
    const cam = state.camera;
    const targetX = mobile ? pointer.x * 0.22 : 0.48 + pointer.x * 0.32;
    const targetY = 0.42 + pointer.y * -0.14;
    const targetZ = (mobile ? 5.9 : 5.45) + scroll * 0.45;
    cam.position.x = MathUtils.lerp(cam.position.x, targetX, 0.045);
    cam.position.y = MathUtils.lerp(cam.position.y, targetY, 0.045);
    cam.position.z = MathUtils.lerp(cam.position.z, targetZ, 0.05);
    cam.lookAt(mobile ? 0 : 0.68, 0.18, 0);
    if (group.current && !demo && !sulk) {
      group.current.rotation.y = MathUtils.lerp(group.current.rotation.y, pointer.x * 0.16, 0.045);
    }
  });
  return (
    <group ref={group} position={mobile ? [0, 0, 0] : [0.82, 0.02, 0]} scale={mobile ? 1.16 : 1.32}>
      <FigurineMesh
        species="bloop"
        followPointer={!demo && !sulk}
        pointer={pointer}
        quality="high"
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
}: {
  mood?: CreatureMood;
  skill?: SkillId | null;
  demo?: DemoActionId | null;
  sulk?: boolean;
  equipped?: EquipmentLoadout;
}) {
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [scroll, setScroll] = useState(0);
  const [mobile, setMobile] = useState(false);
  const [mood, setMood] = useState<CreatureMood>("follow");
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
    if (!reduce.current && !demo) {
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
  }, [demo]);

  return (
    <StageCanvas
      className="absolute inset-0"
      alpha
      dprMax={1.75}
      camera={{ position: [0.2, 0.42, 5.6], fov: 30, far: 40 }}
      onPointerMove={(event) => {
        if (reduce.current) return;
        const x = (event.clientX / window.innerWidth) * 2 - 1;
        const y = (event.clientY / window.innerHeight) * 2 - 1;
        setPointer({ x, y });
      }}
    >
      <StudioLights />
      <Rig
        pointer={pointer}
        scroll={scroll}
        mobile={mobile}
        mood={moodOverride ?? (demo ? "skill" : mood)}
        skill={skill}
        demo={demo}
        sulk={sulk}
        equipped={equipped}
      />
      <StudioShadows position={[0, -0.96, 0]} scale={10} />
    </StageCanvas>
  );
}
