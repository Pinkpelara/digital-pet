import { AdminDesk } from "@/components/admin/AdminDesk";
import { PageHero } from "@/components/site/KineticTitle";

export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminPage() {
  return (
    <div className="bg-paper pb-16">
      <PageHero kicker="Admin" title="The attic" />
      <div className="mx-auto max-w-5xl px-5 md:px-10">
        <AdminDesk />
      </div>
    </div>
  );
}
