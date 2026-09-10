"use client";

import { Suspense } from "react";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { PageView } from "@/components/site/PageView";
import { NestProvider } from "@/lib/state/nest-context";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <NestProvider>
      <PageView />
      <div className="flex min-h-full flex-col">
        <Suspense>
          <SiteHeader />
        </Suspense>
        <main id="content" className="relative z-10 flex-1">
          {children}
        </main>
        <SiteFooter />
      </div>
    </NestProvider>
  );
}
