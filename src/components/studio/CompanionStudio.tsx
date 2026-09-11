"use client";

import { useMemo, useState } from "react";
import { items } from "@/data/catalog";
import { PlayableStage } from "@/components/stage/PlayableStage";
import { track } from "@/lib/analytics";
import { demoActionForItem } from "@/lib/demo-actions";
import { useNest } from "@/lib/state/nest-context";
import { fullLabels } from "@/lib/personality";
import type { CompanionInstance, DemoActionId, EquipSlot, SkillId } from "@/lib/types";

const tabs = ["LOOK", "GADGET", "SKILLS"] as const;
type Tab = (typeof tabs)[number];

const tabKinds: Record<Tab, Array<"outfit" | "drop" | "gadget" | "skill">> = {
  LOOK: ["outfit", "drop"],
  GADGET: ["gadget"],
  SKILLS: ["skill"],
};

export function CompanionStudio({ instance }: { instance: CompanionInstance }) {
  const { owns, saveOutfit } = useNest();
  const [tab, setTab] = useState<Tab>("LOOK");
  const [equipped, setEquipped] = useState(instance.equipped);
  const [skill, setSkill] = useState<SkillId | null>(null);
  const [playAction, setPlayAction] = useState<DemoActionId | null>(null);
  const [saved, setSaved] = useState(false);

  const options = useMemo(
    () => items.filter((item) => (tabKinds[tab] as readonly string[]).includes(item.kind)),
    [tab],
  );
  const remaining = fullLabels(instance.seed).length - instance.discovered.length;

  function toggle(itemId: string, slot?: EquipSlot, skillId?: SkillId) {
    const item = items.find((entry) => entry.id === itemId);
    if (slot) {
      setEquipped((prev) => {
        const next = { ...prev };
        if (next[slot] === itemId) delete next[slot];
        else next[slot] = itemId;
        return next;
      });
      setSaved(false);
    }
    const action = item ? demoActionForItem(item) : null;
    if (action) setPlayAction(action);
    if (skillId) {
      setSkill(skillId);
      track("skill_performed", { skill: skillId, instanceId: instance.id });
      window.setTimeout(() => setSkill(null), 2800);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
      <div className="min-h-[52vh] overflow-hidden rounded-[1.8rem] bg-cream stage-frame lg:min-h-[64vh]">
        <PlayableStage
          species={instance.speciesId}
          equipped={equipped}
          skill={skill}
          playAction={playAction}
          className="h-full min-h-[52vh] w-full lg:min-h-[64vh]"
          cameraZ={5.5}
          companionName={instance.name}
          unlockedSkills={instance.unlockedSkills}
          hint="Tap them — Moonwalk, Skateboard, Umbrella."
        />
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
                    <span className="block text-sm text-ink-soft">
                      {item.behaviorNote ?? item.tagline}
                    </span>
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
            Save this look
          </button>
          {saved && <p className="text-sm text-moss">Saved to {instance.name}.</p>}
        </div>

        <div className="mt-8 rounded-[1.4rem] bg-paper p-5 ring-1 ring-ink/8">
          <p className="text-xs uppercase tracking-[0.16em] text-ink-soft">Personality discovered</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {instance.discovered.length > 0 ? (
              instance.discovered.map((entry) => (
                <li
                  key={entry.label}
                  className="rounded-full border border-ink/15 px-3 py-1 text-sm text-ink"
                >
                  {entry.label}
                </li>
              ))
            ) : (
              <li className="text-ink-soft">Nothing obvious yet.</li>
            )}
          </ul>
          <p className="mt-3 text-sm text-ink-soft">
            {remaining > 0
              ? `There ${remaining === 1 ? "is" : "are"} ${remaining} more trait${remaining === 1 ? "" : "s"} you have not seen yet. You cannot set them. You cannot buy them.`
              : "You have seen everything there is to see. For now."}
          </p>
        </div>

        <p className="mt-6 text-sm text-ink-soft">
          Dress them here. Every look gets a quick show-off before you save it. Clothes and gadgets
          change what they wear and what they can do — who they are is not something you can equip.
        </p>
      </div>
    </div>
  );
}
