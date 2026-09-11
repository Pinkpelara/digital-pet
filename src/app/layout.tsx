import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Outfit, Syne } from "next/font/google";
import { SiteShell } from "@/components/site/SiteShell";
import { OrganizationJsonLd } from "@/components/store/ProductJsonLd";
import { brand } from "@/lib/brand";
import { publicBasePath } from "@/lib/site";
import "./globals.css";

const sans = Outfit({
  variable: "--font-sans-face",
  subsets: ["latin"],
  display: "swap",
});

const display = Syne({
  variable: "--font-display-face",
  subsets: ["latin"],
  weight: ["700", "800"],
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
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: brand.name,
    title: brand.heroHeadline,
    description: brand.heroSub,
    url: "https://pinkpelara.github.io/digital-pet/",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: brand.heroHeadline }],
  },
  twitter: {
    card: "summary_large_image",
    title: brand.heroHeadline,
    description: brand.heroSub,
    images: ["/og.png"],
  },
  appleWebApp: {
    capable: true,
    title: brand.name,
    statusBarStyle: "black-translucent",
  },
  icons: {
    apple: `${publicBasePath()}/apple-touch-icon.png`,
  },
};

export const viewport = {
  themeColor: "#0C0021",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable} h-full antialiased`}>
      <body className="min-h-full">
        <OrganizationJsonLd />
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
