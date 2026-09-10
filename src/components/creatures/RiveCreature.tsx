"use client";

import { useRive } from "@rive-app/react-canvas";
import { Creature, type CreatureProps } from "@/components/creatures/Creature";

type RiveCreatureProps = CreatureProps & { riveSrc?: string };

export function RiveCreature({ riveSrc, ...props }: RiveCreatureProps) {
  if (!riveSrc) return <Creature {...props} />;
  return <MountedRive riveSrc={riveSrc} fallback={<Creature {...props} />} size={props.size ?? 160} />;
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
