import type { Metadata } from "next";
import { Bebas_Neue, Manrope, Aref_Ruqaa } from "next/font/google";
import "./globals.css";

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
  title: "Malaadh Relief",
  description:
    "Refuge, delivered by hand. A student-run relief effort carrying aid directly to families and clinics in Sudan.",
  openGraph: {
    title: "Malaadh Relief",
    description: "Refuge, delivered by hand. Aid carried directly to families and clinics in Sudan.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${bebas.variable} ${manrope.variable} ${arabic.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <div className="grain" aria-hidden />
      </body>
    </html>
  );
}
