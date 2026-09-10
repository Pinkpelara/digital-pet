import type { Metadata } from "next";
import { Fraunces, Nunito } from "next/font/google";
import { SiteShell } from "@/components/site/SiteShell";
import { brand } from "@/lib/brand";
import { publicBasePath } from "@/lib/site";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const nunito = Nunito({
  variable: "--font-nunito",
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
  themeColor: "#3f6f4e",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fraunces.variable} ${nunito.variable} h-full antialiased`}>
      <body className="min-h-full">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
