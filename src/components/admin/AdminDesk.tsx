"use client";

import { useEffect, useState } from "react";
import type { CatalogItem } from "@/lib/types";

type Status = "checking" | "locked" | "open";

export function AdminDesk() {
  const [status, setStatus] = useState<Status>("checking");
  const [password, setPassword] = useState("");
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    const response = await fetch("/api/admin/products");
    if (response.status === 401) {
      setStatus("locked");
      return;
    }
    const data = (await response.json()) as { items: CatalogItem[] };
    setItems(data.items);
    setStatus("open");
  }

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      void refresh();
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  async function login(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!response.ok) {
      setError("That password did not open the attic.");
      return;
    }
    await refresh();
  }

  async function save(item: CatalogItem) {
    const response = await fetch("/api/admin/products", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    if (response.ok) await refresh();
  }

  if (status === "checking") return <p className="text-ink-soft">Checking the lock…</p>;

  if (status === "locked") {
    return (
      <form onSubmit={login} className="max-w-sm space-y-3">
        <label htmlFor="admin-pass" className="block text-sm text-ink">
          Attic password
        </label>
        <input
          id="admin-pass"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-full border border-ink/15 px-4 py-3"
        />
        <button type="submit" className="rounded-full bg-ink px-5 py-3 text-paper">
          Unlock
        </button>
        <p className="text-xs text-ink-soft">Demo default: sillkin-admin</p>
        {error && <p className="text-sm text-peach">{error}</p>}
      </form>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-ink-soft">
        Protected CRUD. In demo this writes an in-memory overlay. In production the same handlers talk to Supabase with
        the service role — never the browser.
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
                      setItems((prev) => prev.map((row) => (row.id === item.id ? { ...row, name: event.target.value } : row)))
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
                      setItems((prev) =>
                        prev.map((row) =>
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
                      setItems((prev) =>
                        prev.map((row) => (row.id === item.id ? { ...row, active: event.target.checked } : row)),
                      )
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
