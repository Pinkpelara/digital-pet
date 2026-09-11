"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { PageView } from "@/components/site/PageView";
import { PwaRegister } from "@/components/live/PwaRegister";
import { IdleMount } from "@/components/site/IdleMount";
import { NestProvider } from "@/lib/state/nest-context";

const HomeCreatures = dynamic(
  () => import("@/components/creatures/HomeCreatures").then((mod) => mod.HomeCreatures),
  { ssr: false },
);

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
          <IdleMount delay={4000}>
            <HomeCreatures />
          </IdleMount>
        </Suspense>
        <main id="content" className="relative z-10 flex-1">
          {children}
        </main>
        <SiteFooter />
      </div>
      <div aria-hidden className="site-grain grain-layer" />
    </NestProvider>
  );
}
