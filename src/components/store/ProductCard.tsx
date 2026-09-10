import Link from "next/link";
import { Creature } from "@/components/creatures/Creature";
import { formatPrice } from "@/lib/format";
import type { CatalogItem, EquipmentLoadout, SpeciesId } from "@/lib/types";

function previewLoadout(item: CatalogItem): { species: SpeciesId; equipped: EquipmentLoadout } {
  const species = item.speciesId ?? (item.id.includes("mochi") ? "mochi" : item.id.includes("sprout") ? "sprout" : item.id.includes("niblet") ? "niblet" : "bloop");
  const equipped: EquipmentLoadout = {};
  if (item.slot) equipped[item.slot] = item.id;
  return { species, equipped };
}

export function ProductCard({
  item,
  href,
  owned = false,
}: {
  item: CatalogItem;
  href: string;
  owned?: boolean;
}) {
  const preview = previewLoadout(item);
  return (
    <Link
      href={href}
      className="group card-lift rounded-[1.6rem] border border-ink/8 bg-paper p-4 shadow-sm"
    >
      <div className="relative flex h-44 items-end justify-center overflow-hidden rounded-[1.2rem] bg-cream">
        <Creature
          species={preview.species}
          size={150}
          equipped={preview.equipped}
          mood={item.skillId === "nap" ? "nap" : "idle"}
          skill={item.skillId}
          decorative
        />
        {item.limited && (
          <span className="absolute left-3 top-3 rounded-full bg-ink px-2 py-1 text-[10px] uppercase tracking-wider text-paper">
            Limited
          </span>
        )}
        {owned && (
          <span className="absolute right-3 top-3 rounded-full bg-moss px-2 py-1 text-[10px] uppercase tracking-wider text-paper">
            In nest
          </span>
        )}
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-xl text-ink">{item.name}</p>
          <p className="mt-1 text-sm text-ink-soft">{item.tagline}</p>
        </div>
        <p className="rounded-full bg-cream px-3 py-1 text-sm text-ink">{formatPrice(item.priceCents)}</p>
      </div>
    </Link>
  );
}
