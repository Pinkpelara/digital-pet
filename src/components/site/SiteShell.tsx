"use client";

import { Suspense } from "react";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { PageView } from "@/components/site/PageView";
import { PwaRegister } from "@/components/live/PwaRegister";
import { HomeCreatures } from "@/components/creatures/HomeCreatures";
import { IdleMount } from "@/components/site/IdleMount";
import { NestProvider } from "@/lib/state/nest-context";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <NestProvider>
      <PageView />
      <PwaRegister />
      <div className="flex min-h-full flex-col">
        <Suspense>
          <SiteHeader />
        </Suspense>
        <Suspense fallback={null}>
          <IdleMount delay={1400}>
            <HomeCreatures />
          </IdleMount>
        </Suspense>
        <main id="content" className="relative z-10 flex-1">
          {children}
        </main>
        <SiteFooter />
      </div>
    </NestProvider>
  );
}
