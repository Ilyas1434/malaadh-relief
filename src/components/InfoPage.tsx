import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr";
import { CalligraphyMark } from "./BrandMark";
import { Footer } from "./Footer";
import { Reveal } from "./Reveal";
import { site } from "@/lib/content";

type Section = { title: string; body: string[] };

/** Shared shell for the plain reading pages (About, Naloxone in Sudan). */
export function InfoPage({
  eyebrow,
  heading,
  intro,
  sections,
  children,
}: {
  eyebrow: string;
  heading: string;
  intro: string;
  sections: Section[];
  children?: ReactNode;
}) {
  return (
    <main className="bg-sand text-espresso">
      <section className="relative overflow-hidden bg-bark px-4 pt-6 pb-16 text-sand md:pb-24">
        <p aria-hidden className="font-arabic pointer-events-none absolute -top-8 -right-4 select-none text-[40vw] leading-none text-sand/[0.05] md:text-[22vw]">
          {site.arabic}
        </p>
        <div className="relative mx-auto max-w-6xl">
          <div className="flex items-center justify-between">
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-sand/80 transition-colors hover:text-sand-light">
              <ArrowLeftIcon size={16} weight="bold" /> Back to {site.name}
            </Link>
            <Link href="/" aria-label={site.name} className="h-7 text-sand-light">
              <CalligraphyMark className="block h-full" />
            </Link>
          </div>
          <p className="mt-12 text-xs font-bold uppercase tracking-[0.14em] text-clay md:mt-16">{eyebrow}</p>
          <h1 className="display mt-3 max-w-[18ch] text-[clamp(2.8rem,7vw,6rem)] text-sand-light">{heading}</h1>
          <p className="mt-6 max-w-[56ch] text-xl leading-relaxed text-sand/85">{intro}</p>
        </div>
      </section>

      <section className="px-4 py-16 md:py-24">
        <div className="mx-auto max-w-6xl divide-y divide-bark/15 border-t border-bark/15">
          {sections.map((s) => (
            <Reveal key={s.title} className="grid gap-4 py-10 md:grid-cols-12 md:gap-10 md:py-14">
              <h2 className="display text-4xl text-espresso md:col-span-4 md:text-5xl">{s.title}</h2>
              <div className="space-y-5 text-lg leading-relaxed text-bark md:col-span-7 md:col-start-6">
                {s.body.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {children}

      <section className="border-t border-bark/15 px-4 py-14">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-[44ch] text-bark">Donations go directly to aid. See where the last round went, or help fund the next one.</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/work/sudan" className="btn btn-secondary">
              Sudan, June 2026
            </Link>
            <Link href="/donate" className="btn btn-primary">
              Donate
            </Link>
          </div>
        </div>
      </section>
      <Footer mark={<CalligraphyMark className="block h-full" />} />
    </main>
  );
}
