import { CalligraphyMark } from "@/components/BrandMark";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Mission } from "@/components/Mission";
import { MissionStatement } from "@/components/MissionStatement";
import { HowWeWork } from "@/components/HowWeWork";
import { Programs } from "@/components/Programs";
import { Where } from "@/components/Where";
import { Partners } from "@/components/Partners";
import { Follow } from "@/components/Follow";
import { DonateSection } from "@/components/DonateSection";
import { Footer } from "@/components/Footer";
import { ScrollRoute } from "@/components/ScrollRoute";
import { seo } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta("/", seo.home.title, seo.home.description);

export default function Home() {
  const mark = <CalligraphyMark className="block h-full" />;
  return (
    <main data-route-root className="relative flex-1">
      <Nav mark={mark} />
      <Hero />
      <MissionStatement />
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
