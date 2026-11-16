import type { Metadata } from "next";
import { Bebas_Neue, Manrope, Aref_Ruqaa } from "next/font/google";
import "./globals.css";
import { JsonLd } from "@/components/JsonLd";
import { seo, site } from "@/lib/content";
import { organizationLd, websiteLd } from "@/lib/seo";

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const arabic = Aref_Ruqaa({
  weight: ["400", "700"],
  subsets: ["arabic"],
  variable: "--font-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://malaadh.org"),
  title: { default: seo.home.title, template: `%s | ${site.name}` },
  description: seo.home.description,
  applicationName: site.name,
  openGraph: { type: "website", siteName: site.name, locale: "en_US" },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${bebas.variable} ${manrope.variable} ${arabic.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <JsonLd data={[organizationLd, websiteLd]} />
        <div className="grain" aria-hidden />
      </body>
    </html>
  );
}
