import { Headline, Parallax, Reveal } from "./motion";
import Link from "next/link";
import { mission, site } from "@/lib/content";

/** The name, set like a dictionary entry. What we do is in the mission statement above; how is in the section below. */
export function Mission() {
  return (
    <section id="refuge" data-route-label="Name" className="relative overflow-hidden bg-espresso px-4 py-24 text-sand md:py-32">
      <Parallax range={[80, -120]} className="pointer-events-none absolute -top-10 -right-6 select-none">
        <p aria-hidden className="font-arabic text-[38vw] leading-none text-sand/[0.05] md:text-[26vw]">
          {site.arabic}
        </p>
      </Parallax>
      <div className="relative mx-auto grid max-w-6xl items-end gap-10 md:grid-cols-12">
        <div className="md:col-span-5">
          <Reveal variant="left">
            <p className="font-arabic text-[clamp(6rem,22vw,13rem)] leading-[1.15] text-sand-light" lang="ar" dir="rtl">
              {site.arabic}
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-2 flex flex-wrap items-baseline gap-x-3 border-t border-sand/20 pt-4">
              <span className="display text-3xl text-sand-light">{mission.word}</span>
              <span className="text-sm text-sand/60 italic">{mission.kind}</span>
            </p>
          </Reveal>
        </div>
        <div className="md:col-span-6 md:col-start-7">
          <h2 className="sr-only">{mission.heading}</h2>
          <ol className="space-y-3">
            {mission.senses.map((sense, i) => (
              <li key={sense} className="flex items-baseline gap-4">
                <span className="text-sm font-bold text-clay tabular-nums">{i + 1}</span>
                {i === 0 ? (
                  <Headline as="p" text={sense} className="display text-[clamp(3.5rem,9vw,7.5rem)] text-sand-light" />
                ) : (
                  <Reveal as="p" delay={0.3} className="text-xl leading-relaxed text-sand/85 md:text-2xl">
                    {sense}
                  </Reveal>
                )}
              </li>
            ))}
          </ol>
          <Reveal as="p" delay={0.4} className="mt-8 max-w-[44ch] text-lg leading-relaxed text-sand/75">
            {mission.body}
          </Reveal>
          <Reveal delay={0.5} className="mt-6">
            <Link href="/about" className="text-base font-semibold text-sand-light underline decoration-clay/70 underline-offset-4 transition-colors hover:decoration-sand-light">
              About Malaadh Relief
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
