import { CalligraphyMark } from "@/components/BrandMark";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Mission } from "@/components/Mission";
import { HowWeWork } from "@/components/HowWeWork";
import { Programs } from "@/components/Programs";
import { Where } from "@/components/Where";
import { Partners } from "@/components/Partners";
import { Follow } from "@/components/Follow";
import { DonateSection } from "@/components/DonateSection";
import { Footer } from "@/components/Footer";
import { ScrollRoute } from "@/components/ScrollRoute";

export default function Home() {
  const mark = <CalligraphyMark className="block h-full" />;
  return (
    <main data-route-root className="relative flex-1">
      <Nav mark={mark} />
      <Hero />
      <Mission />
      <HowWeWork />
      <Programs />
      <Where />
      <Partners />
      <Follow />
      <DonateSection />
      <Footer mark={mark} />
      <ScrollRoute />
    </main>
  );
}
