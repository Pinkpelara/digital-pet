"use client";

import { useRive } from "@rive-app/react-canvas";
import { LiveStage } from "@/components/stage/LiveStage";
import { Creature, type CreatureProps } from "@/components/creatures/Creature";

type RiveCreatureProps = CreatureProps & { riveSrc?: string };

export function RiveCreature({ riveSrc, ...props }: RiveCreatureProps) {
  if (riveSrc) return <MountedRive riveSrc={riveSrc} fallback={<Creature {...props} />} size={props.size ?? 160} />;
  return (
    <LiveStage
      species={props.species}
      equipped={props.equipped}
      mood={props.mood}
      skill={props.skill}
      className="h-[360px] w-full"
      cameraZ={3.4}
    />
  );
}

function MountedRive({
  riveSrc,
  fallback,
  size,
}: {
  riveSrc: string;
  fallback: React.ReactNode;
  size: number;
}) {
  const { rive, RiveComponent } = useRive({
    src: riveSrc,
    autoplay: true,
  });

  if (!rive) {
    return (
      <div className="relative">
        {fallback}
      </div>
    );
  }

  return <RiveComponent style={{ width: size, height: size * 1.12 }} />;
}
