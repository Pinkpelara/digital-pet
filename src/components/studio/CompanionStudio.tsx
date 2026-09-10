"use client";

import { useMemo, useState } from "react";
import { items } from "@/data/catalog";
import { RiveCreature } from "@/components/creatures/RiveCreature";
import { track } from "@/lib/analytics";
import { useNest } from "@/lib/state/nest-context";
import type { CompanionInstance, EquipSlot, SkillId } from "@/lib/types";

const tabs = ["LOOK", "GADGET", "SKILLS", "PERSONALITY"] as const;
type Tab = (typeof tabs)[number];

const tabKinds: Record<Tab, Array<"outfit" | "drop" | "gadget" | "skill" | "personality">> = {
  LOOK: ["outfit", "drop"],
  GADGET: ["gadget"],
  SKILLS: ["skill"],
  PERSONALITY: ["personality"],
};

export function CompanionStudio({ instance }: { instance: CompanionInstance }) {
  const { owns, saveOutfit } = useNest();
  const [tab, setTab] = useState<Tab>("LOOK");
  const [equipped, setEquipped] = useState(instance.equipped);
  const [skill, setSkill] = useState<SkillId | null>(null);
  const [saved, setSaved] = useState(false);

  const options = useMemo(
    () =>
      items.filter(
        (item) =>
          (tabKinds[tab] as readonly string[]).includes(item.kind) &&
          (owns(item.id) || item.kind === "skill" || item.kind === "personality"),
      ),
    [owns, tab],
  );

  function toggle(itemId: string, slot?: EquipSlot, skillId?: SkillId) {
    if (slot) {
      setEquipped((prev) => {
        const next = { ...prev };
        if (next[slot] === itemId) delete next[slot];
        else next[slot] = itemId;
        return next;
      });
      setSaved(false);
    }
    if (skillId) {
      setSkill(skillId);
      track("skill_performed", { skill: skillId, instanceId: instance.id });
      window.setTimeout(() => setSkill(null), 2800);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
      <div className="rounded-[2rem] bg-cream px-6 py-12">
        <RiveCreature species={instance.speciesId} size={320} equipped={equipped} skill={skill} name={instance.name} />
      </div>
      <div>
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Customize">
          {tabs.map((entry) => (
            <button
              key={entry}
              type="button"
              role="tab"
              aria-selected={tab === entry}
              onClick={() => setTab(entry)}
              className={`rounded-full px-4 py-2 text-sm ${
                tab === entry ? "bg-ink text-paper" : "bg-paper text-ink-soft ring-1 ring-ink/10"
              }`}
            >
              {entry}
            </button>
          ))}
        </div>
        <ul className="mt-6 space-y-2">
          {options.map((item) => {
            const owned = owns(item.id) || (item.skillId ? instance.unlockedSkills.includes(item.skillId) : false);
            const active = item.slot ? equipped[item.slot] === item.id : false;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => toggle(item.id, item.slot, item.skillId)}
                  className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left ${
                    active ? "border-moss bg-moss/10" : "border-ink/8 bg-paper"
                  }`}
                >
                  <span>
                    <span className="block font-medium text-ink">{item.name}</span>
                    <span className="block text-sm text-ink-soft">{item.tagline}</span>
                  </span>
                  <span className="text-xs uppercase tracking-wider text-ink-soft">
                    {owned ? (active ? "On" : item.skillId ? "Play" : "Equip") : "Preview"}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              saveOutfit(instance.id, equipped);
              setSaved(true);
            }}
            className="rounded-full bg-ink px-5 py-3 text-paper"
          >
            Save outfit
          </button>
          {saved && <p className="text-sm text-moss">Packed into their nest.</p>}
        </div>
        <dl className="mt-8 grid grid-cols-2 gap-3 text-sm">
          {Object.entries(instance.stats).map(([key, value]) => (
            <div key={key} className="rounded-2xl bg-paper px-3 py-2">
              <dt className="capitalize text-ink-soft">{key}</dt>
              <dd className="font-display text-2xl text-ink">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
