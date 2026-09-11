import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { SiteShell } from "@/components/site/SiteShell";
import { brand } from "@/lib/brand";
import { publicBasePath } from "@/lib/site";
import "./globals.css";

const sans = Outfit({
  variable: "--font-sans-face",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${brand.name} — ${brand.tagline}`,
    template: `%s · ${brand.name}`,
  },
  description: brand.hero,
  applicationName: brand.name,
  metadataBase: new URL("https://pinkpelara.github.io/digital-pet"),
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: brand.name,
    statusBarStyle: "default",
  },
  icons: {
    apple: `${publicBasePath()}/apple-touch-icon.png`,
  },
};

export const viewport = {
  themeColor: "#faf6ef",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} h-full antialiased`}>
      <body className="min-h-full">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
