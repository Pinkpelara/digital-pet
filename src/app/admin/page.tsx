import { AdminDesk } from "@/components/admin/AdminDesk";

export const metadata = { title: "Admin" };

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <p className="text-xs uppercase tracking-[0.2em] text-moss">Admin</p>
      <h1 className="mt-2 font-display text-5xl text-ink">The attic</h1>
      <div className="mt-8">
        <AdminDesk />
      </div>
    </div>
  );
}
