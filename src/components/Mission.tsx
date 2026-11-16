import { Headline, Parallax, Reveal } from "./motion";
import Link from "next/link";
import { mission, site } from "@/lib/content";

export function Mission() {
  return (
    <section id="mission" data-route-label="Why" className="relative overflow-hidden bg-espresso px-4 py-28 text-sand md:py-40">
      <Parallax range={[80, -120]} className="pointer-events-none absolute -top-10 -right-6 select-none">
        <p aria-hidden className="font-arabic text-[38vw] leading-none text-sand/[0.05] md:text-[26vw]">
          {site.arabic}
        </p>
      </Parallax>
      <div className="relative mx-auto max-w-6xl">
        <Headline text={mission.heading} className="display max-w-[14ch] text-[clamp(3rem,8vw,7.5rem)] text-sand-light" />
        <div className="mt-10 grid gap-8 md:mt-14 md:grid-cols-12">
          <Reveal className="md:col-span-3" delay={0.2} variant="left">
            <p className="font-arabic text-5xl text-clay md:text-6xl" lang="ar" dir="rtl">
              {site.arabic}
            </p>
            <p className="mt-2 text-sm text-sand/60">{site.meaning}</p>
          </Reveal>
          <div className="space-y-6 text-lg leading-relaxed text-sand/85 md:col-span-7 md:col-start-5 md:text-xl">
            {mission.body.map((p, i) => (
              <Reveal as="p" key={i} delay={0.25 + i * 0.1}>
                {p}
              </Reveal>
            ))}
            <Reveal delay={0.45}>
              <Link href="/about" className="text-base font-semibold text-sand-light underline decoration-clay/70 underline-offset-4 transition-colors hover:decoration-sand-light">
                About Malaadh Relief
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
