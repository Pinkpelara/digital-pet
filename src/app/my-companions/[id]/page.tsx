import { notFound } from "next/navigation";
import { CompanionStudio } from "@/components/studio/CompanionStudio";
import { getInstance } from "@/lib/server/grants";

export const dynamic = "force-dynamic";

export default async function CompanionStudioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const instance = getInstance(id);
  if (!instance) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <p className="text-xs uppercase tracking-[0.2em] text-moss">Studio</p>
      <h1 className="mt-2 font-display text-5xl text-ink">{instance.name}</h1>
      <p className="mt-2 text-ink-soft">LOOK · GADGET · SKILLS · PERSONALITY</p>
      <div className="mt-8">
        <CompanionStudio instance={instance} />
      </div>
    </div>
  );
}
