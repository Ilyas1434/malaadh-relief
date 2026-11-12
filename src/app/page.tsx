import { CalligraphyMark } from "@/components/BrandMark";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Mission } from "@/components/Mission";
import { Trip } from "@/components/Trip";
import { Impact } from "@/components/Impact";
import { Partnership } from "@/components/Partnership";
import { Follow } from "@/components/Follow";
import { DonateSection } from "@/components/DonateSection";
import { Footer } from "@/components/Footer";
import { DonateModal } from "@/components/DonateModal";

export default function Home() {
  const mark = <CalligraphyMark className="block h-full" />;
  return (
    <main className="flex-1">
      <Nav mark={mark} />
      <Hero />
      <Mission />
      <Trip />
      <Impact />
      <Partnership />
      <Follow />
      <DonateSection />
      <Footer mark={mark} />
      <DonateModal />
    </main>
  );
}
