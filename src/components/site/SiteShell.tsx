"use client";

import { usePathname } from "next/navigation";
import { WorldLayer } from "@/components/creatures/WorldLayer";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { PageView } from "@/components/site/PageView";
import { NestProvider } from "@/lib/state/nest-context";

const quiet = new Set(["/admin", "/adopt/success"]);

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isQuiet = quiet.has(pathname) || pathname.startsWith("/admin");

  return (
    <NestProvider>
      <PageView />
      <div className="flex min-h-full flex-col">
        <SiteHeader />
        {!isQuiet && <WorldLayer enabled={pathname === "/"} />}
        <main id="content" className="relative z-10 flex-1">
          {children}
        </main>
        <SiteFooter />
      </div>
    </NestProvider>
  );
}
