import type { Metadata } from "next";
import { Instrument_Serif, Outfit } from "next/font/google";
import { SiteShell } from "@/components/site/SiteShell";
import { brand } from "@/lib/brand";
import { publicBasePath } from "@/lib/site";
import "./globals.css";

const display = Instrument_Serif({
  variable: "--font-display-face",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

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
    statusBarStyle: "black-translucent",
  },
  icons: {
    apple: `${publicBasePath()}/apple-touch-icon.png`,
  },
};

export const viewport = {
  themeColor: "#070809",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} h-full antialiased`}>
      <body className="min-h-full">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
