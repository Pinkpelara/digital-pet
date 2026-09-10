"use client";

import { FormEvent, useState } from "react";
import { items as seedItems } from "@/data/catalog";
import type { CatalogItem } from "@/lib/types";
import {
  DEMO_ADMIN_PASSWORD,
  isAdminUnlocked,
  readAdminItems,
  unlockAdmin,
  writeAdminItems,
} from "@/lib/state/admin-overlay";
import { useClientMounted } from "@/lib/state/use-client-mounted";

export function AdminDesk() {
  const mounted = useClientMounted();
  const [edits, setEdits] = useState<CatalogItem[] | null>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const unlocked = mounted && isAdminUnlocked();
  const items = edits ?? (mounted ? readAdminItems() : seedItems);

  function login(event: FormEvent) {
    event.preventDefault();
    if (!unlockAdmin(password)) {
      setError("That key did not turn.");
      return;
    }
    setError(null);
    setEdits(readAdminItems());
  }

  function save(item: CatalogItem) {
    const next = items.map((row) => (row.id === item.id ? item : row));
    setEdits(next);
    writeAdminItems(next);
  }

  if (!mounted) return <p className="text-ink-soft">Checking the lock…</p>;

  if (!unlocked) {
    return (
      <form onSubmit={login} className="max-w-sm space-y-3">
        <label htmlFor="admin-pass" className="block text-sm text-ink">
          Attic password
        </label>
        <input
          id="admin-pass"
          name="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-full border border-ink/15 px-4 py-3"
        />
        <button type="submit" className="rounded-full bg-ink px-5 py-3 text-paper">
          Unlock
        </button>
        <p className="text-xs text-ink-soft">Demo default: {DEMO_ADMIN_PASSWORD}</p>
        {error && <p className="text-sm text-peach">{error}</p>}
      </form>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-ink-soft">
        Protected CRUD. On GitHub Pages this writes a local overlay (this browser only). On a later Vercel deploy the
        same attic can talk to Supabase with the service role — never the browser.
      </p>
      <div className="overflow-x-auto rounded-[1.4rem] bg-paper ring-1 ring-ink/8">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-ink-soft">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Kind</th>
              <th className="px-4 py-3">Price (cents)</th>
              <th className="px-4 py-3">Active</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-ink/5">
                <td className="px-4 py-2">
                  <input
                    value={item.name}
                    onChange={(event) =>
                      setEdits(items.map((row) => (row.id === item.id ? { ...row, name: event.target.value } : row)))
                    }
                    className="w-full bg-transparent"
                  />
                </td>
                <td className="px-4 py-2 capitalize">{item.kind}</td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    value={item.priceCents}
                    onChange={(event) =>
                      setEdits(
                        items.map((row) =>
                          row.id === item.id ? { ...row, priceCents: Number(event.target.value) } : row,
                        ),
                      )
                    }
                    className="w-24 bg-transparent"
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="checkbox"
                    checked={item.active}
                    onChange={(event) =>
                      setEdits(items.map((row) => (row.id === item.id ? { ...row, active: event.target.checked } : row)))
                    }
                  />
                </td>
                <td className="px-4 py-2">
                  <button type="button" onClick={() => save(item)} className="text-moss underline">
                    Save
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
