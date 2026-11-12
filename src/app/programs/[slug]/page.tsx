import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon } from "@phosphor-icons/react/dist/ssr";
import { CalligraphyMark } from "@/components/BrandMark";
import { VideoSlot } from "@/components/VideoSlot";
import { Reveal } from "@/components/Reveal";
import { programs, site } from "@/lib/content";

type Params = { slug: string };

export const instant = false;

export function generateStaticParams() {
  return programs.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const p = programs.find((x) => x.slug === slug);
  if (!p) return {};
  return { title: `${p.title} | ${site.name}`, description: p.short };
}

export default async function ProgramPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const index = programs.findIndex((x) => x.slug === slug);
  if (index === -1) notFound();
  const p = programs[index];
  const next = programs[(index + 1) % programs.length];

  return (
    <main className="bg-sand text-espresso">
      <section className="relative overflow-hidden bg-bark px-4 pt-6 pb-16 text-sand md:pb-24">
        <p aria-hidden className="font-arabic pointer-events-none absolute -top-8 -right-4 select-none text-[40vw] leading-none text-sand/[0.05] md:text-[22vw]">
          {site.arabic}
        </p>
        <div className="relative mx-auto max-w-6xl">
          <div className="flex items-center justify-between">
            <Link href="/#programs" className="inline-flex items-center gap-2 text-sm font-semibold text-sand/80 transition-colors hover:text-sand-light">
              <ArrowLeftIcon size={16} weight="bold" /> All programs
            </Link>
            <Link href="/" aria-label={site.name} className="h-7 text-sand-light">
              <CalligraphyMark className="block h-full" />
            </Link>
          </div>
          <p className="display mt-12 text-5xl text-clay md:mt-16">0{index + 1}</p>
          <h1 className="display mt-2 max-w-[14ch] text-[clamp(3rem,8vw,7rem)] text-sand-light">{p.title}</h1>
          <p className="mt-6 max-w-[52ch] text-xl leading-relaxed text-sand/85">{p.intro}</p>
        </div>
      </section>

      <section className="px-4 py-16 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-12">
          <div className="space-y-6 text-lg leading-relaxed text-bark md:col-span-7">
            {p.body.map((para, i) => (
              <Reveal as="p" key={i} delay={i * 0.06}>
                {para}
              </Reveal>
            ))}
            <Reveal delay={0.15}>
              <div className="mt-4 rounded-3xl bg-sand-light p-6 ring-1 ring-bark/10 md:p-8">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-clay">On the ground</p>
                <Link href={p.example.href} className="display mt-1 inline-flex items-center gap-2 text-3xl text-espresso">
                  {p.example.label}
                  <ArrowRightIcon size={20} weight="bold" className="text-clay" />
                </Link>
                <div className="mt-4 space-y-4 text-base leading-relaxed text-bark">
                  {p.example.body.map((t, j) => (
                    <p key={j}>{t}</p>
                  ))}
                </div>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {p.example.delivered.map((d) => (
                    <li key={d} className="inline-flex items-center gap-2 rounded-full border border-bark/20 px-3 py-1.5 text-sm text-espresso">
                      <CheckIcon size={14} weight="bold" className="text-clay" /> {d}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
          <Reveal className="md:col-span-4 md:col-start-9" delay={0.1}>
            <VideoSlot video={p.video} ratio="9/16" label={p.videoLabel} />
          </Reveal>
        </div>
      </section>

      <section className="border-t border-bark/15 px-4 py-14">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-bark">Support the work</p>
            <Link href="/donate" className="btn btn-primary mt-3">
              Donate
            </Link>
          </div>
          <Link href={`/programs/${next.slug}`} className="group inline-flex items-center gap-3 text-right">
            <span>
              <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-bark/70">Next</span>
              <span className="display block text-3xl text-espresso">{next.title}</span>
            </span>
            <ArrowRightIcon size={22} weight="bold" className="text-clay transition-transform duration-200 ease-[var(--ease-out-strong)] group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </main>
  );
}
