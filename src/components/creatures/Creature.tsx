import { companionById } from "@/data/catalog";
import type { CreatureMood, EquipmentLoadout, SkillId, SpeciesId } from "@/lib/types";
import { EquipmentLayers } from "@/components/creatures/equipment";

export type CreatureProps = {
  species: SpeciesId;
  size?: number;
  equipped?: EquipmentLoadout;
  mood?: CreatureMood;
  skill?: SkillId | null;
  looking?: { x: number; y: number } | null;
  name?: string;
  className?: string;
  reducedMotion?: boolean;
  decorative?: boolean;
};

function eyeOffset(looking: CreatureProps["looking"], origin: { x: number; y: number }): { x: number; y: number } {
  if (!looking) return { x: 0, y: 0 };
  const dx = looking.x - origin.x;
  const dy = looking.y - origin.y;
  const distance = Math.max(1, Math.hypot(dx, dy));
  return { x: (dx / distance) * 3.2, y: (dy / distance) * 2.2 };
}

function extras(species: SpeciesId) {
  switch (species) {
    case "bloop":
      return (
        <g>
          <line x1="80" y1="42" x2="80" y2="22" stroke="#2A8F88" strokeWidth="3" />
          <circle cx="80" cy="16" r="8" fill="#8EE6DF" />
          <circle cx="78" cy="13" r="2.4" fill="#fff" opacity="0.8" />
        </g>
      );
    case "mochi":
      return (
        <g>
          <ellipse cx="54" cy="58" rx="10" ry="8" fill="#F3A6AE" />
          <ellipse cx="106" cy="58" rx="10" ry="8" fill="#F3A6AE" />
        </g>
      );
    case "sprout":
      return (
        <g>
          <path d="M80 44 C78 22, 104 16, 102 40 C94 30, 84 36, 80 44 Z" fill="#7CB342" />
          <path d="M80 44 C82 24, 56 18, 58 40 C66 30, 76 36, 80 44 Z" fill="#5A8A2C" />
        </g>
      );
    case "niblet":
      return (
        <g>
          <path d="M50 62 L42 34 L64 54 Z" fill="#E8A44A" />
          <path d="M110 62 L118 34 L96 54 Z" fill="#E8A44A" />
          <path d="M50 62 L46 40 L62 54 Z" fill="#FFE6BE" />
          <path d="M110 62 L114 40 L98 54 Z" fill="#FFE6BE" />
        </g>
      );
  }
}

function mouth(species: SpeciesId, mood: CreatureMood, skill?: SkillId | null) {
  if (mood === "nap" || skill === "nap") {
    return <path d="M72 104 Q80 100 88 104" fill="none" stroke="#4A3328" strokeWidth="2.4" strokeLinecap="round" />;
  }
  if (species === "niblet") {
    return <path d="M70 102 Q80 112 92 100" fill="none" stroke="#4A3328" strokeWidth="2.6" strokeLinecap="round" />;
  }
  if (species === "mochi") {
    return <path d="M74 104 Q80 108 86 104" fill="none" stroke="#4A3328" strokeWidth="2.2" strokeLinecap="round" />;
  }
  return <path d="M72 102 Q80 110 88 102" fill="none" stroke="#4A3328" strokeWidth="2.4" strokeLinecap="round" />;
}

export function Creature({
  species,
  size = 160,
  equipped = {},
  mood = "idle",
  skill = null,
  looking = null,
  name,
  className,
  reducedMotion = false,
  decorative = false,
}: CreatureProps) {
  const palette = companionById.get(species);
  if (!palette) return null;

  const motion = !reducedMotion;
  const pose = skill ?? mood;
  const left = eyeOffset(looking, { x: 64, y: 86 });
  const right = eyeOffset(looking, { x: 96, y: 86 });
  const napping = pose === "nap";
  const hiding = pose === "hide";
  const title = name ?? palette.name;

  return (
    <svg
      viewBox="0 0 160 180"
      width={size}
      height={size * 1.12}
      className={["creature-svg", motion ? `is-${pose}` : "is-still", hiding ? "is-hiding" : "", className]
        .filter(Boolean)
        .join(" ")}
      role={decorative ? "presentation" : "img"}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : `${title}, a ${palette.name} companion`}
    >
      <ellipse className="creature-shadow" cx="80" cy="166" rx="36" ry="8" fill="#241C16" opacity="0.12" />
      <g className="creature-bob">
        {extras(species)}
        <g className="creature-feet">
          <ellipse cx="64" cy="150" rx="10" ry="7" fill={palette.shade} />
          <ellipse cx="96" cy="150" rx="10" ry="7" fill={palette.shade} />
        </g>
        <ellipse cx="80" cy="104" rx={species === "mochi" ? 50 : 46} ry={species === "sprout" ? 50 : 46} fill={palette.accent} />
        <ellipse cx="80" cy="114" rx="28" ry="22" fill={palette.belly} />
        <ellipse cx="58" cy="108" rx="10" ry="7" fill={palette.highlight} opacity="0.55" />
        <g className="creature-face">
          {napping ? (
            <>
              <path d="M56 86 Q64 90 72 86" fill="none" stroke="#241C16" strokeWidth="3" strokeLinecap="round" />
              <path d="M88 86 Q96 90 104 86" fill="none" stroke="#241C16" strokeWidth="3" strokeLinecap="round" />
              <text x="112" y="70" fontSize="14" fill="#5C5046">
                z
              </text>
            </>
          ) : (
            <>
              <ellipse cx={64 + left.x} cy={86 + left.y} rx="8" ry="9" fill="#241C16" />
              <ellipse cx={96 + right.x} cy={86 + right.y} rx="8" ry="9" fill="#241C16" />
              <circle cx={61.5 + left.x} cy={83 + left.y} r="2.2" fill="#fff" />
              <circle cx={93.5 + right.x} cy={83 + right.y} r="2.2" fill="#fff" />
            </>
          )}
          <ellipse cx="56" cy="98" rx="7" ry="4" fill="#F4B4B0" opacity="0.85" />
          <ellipse cx="104" cy="98" rx="7" ry="4" fill="#F4B4B0" opacity="0.85" />
          {mouth(species, mood, skill)}
        </g>
        <EquipmentLayers equipped={equipped} />
        {skill === "juggle" && (
          <g className="juggle-orbs">
            <circle className="orb orb-a" cx="48" cy="48" r="6" fill="#E89B6C" />
            <circle className="orb orb-b" cx="80" cy="28" r="6" fill="#7E8CFF" />
            <circle className="orb orb-c" cx="112" cy="48" r="6" fill="#3DB8B0" />
          </g>
        )}
      </g>
    </svg>
  );
}
