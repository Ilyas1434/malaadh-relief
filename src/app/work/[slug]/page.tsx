import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRightIcon, ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr";
import { CalligraphyMark } from "@/components/BrandMark";
import { Nav } from "@/components/Nav";
import { Trip } from "@/components/Trip";
import { Partnership } from "@/components/Partnership";
import { Follow } from "@/components/Follow";
import { DonateSection } from "@/components/DonateSection";
import { Footer } from "@/components/Footer";
import { Counter, Headline, Reveal } from "@/components/motion";
import { ScrollRoute } from "@/components/ScrollRoute";
import { programs, site, places, sudan, sudanStats } from "@/lib/content";

export const instant = false;

export function generateStaticParams() {
  return places.filter((s) => s.status === "active").map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = places.find((x) => x.slug === slug);
  if (!s) return {};
  return { title: `${s.name} | ${site.name}`, description: s.summary };
}

export default async function TripPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const place = places.find((x) => x.slug === slug && x.status === "active");
  if (!place || slug !== sudan.slug) notFound();
  const mark = <CalligraphyMark className="block h-full" />;

  return (
    <main data-route-root className="relative bg-sand text-espresso">
      <Nav mark={mark} />
      <Trip />

      <section data-route-label="Sudan today" className="bg-espresso px-4 py-24 text-sand md:py-32">
        <div className="mx-auto max-w-6xl">
          <Headline text="Sudan today" className="display max-w-[12ch] text-[clamp(3rem,8vw,7rem)] text-sand-light" />
          <Reveal as="p" delay={0.2} className="mt-4 max-w-[52ch] text-lg leading-relaxed text-sand/80">
            The war began in April 2023. These figures come from UN agencies and link to the release each one is taken from.
          </Reveal>
          <dl className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {sudanStats.map((st, i) => (
              <Reveal key={st.label} delay={0.1 + (i % 4) * 0.08} className="flex flex-col-reverse border-t border-sand/15 pt-5">
                <dt className="mt-2 text-sm leading-snug text-sand/75">
                  {st.label}
                  <a
                    href={st.source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-clay transition-colors hover:text-sand-light"
                  >
                    {st.source.name}, {st.source.date} <ArrowUpRightIcon size={12} weight="bold" />
                  </a>
                </dt>
                <dd className="display text-6xl text-sand-light md:text-7xl">
                  <Counter value={st.value} decimals={st.decimals} suffix={st.suffix} />
                </dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      <section data-route-label="Delivered" className="bg-bark px-4 py-24 text-sand md:py-32">
        <div className="mx-auto max-w-6xl">
          <Headline text="What we delivered" className="display max-w-[12ch] text-[clamp(3rem,8vw,7rem)] text-sand-light" />
          <ol className="mt-12 divide-y divide-sand/15 border-t border-sand/15">
            {programs.map((p, i) => (
              <Reveal as="li" key={p.slug} delay={0.08} variant="clip" amount={0.2}>
                <div className="grid gap-4 py-9 md:grid-cols-12 md:gap-10 md:py-12">
                  <p className="display text-5xl text-clay md:col-span-2">0{i + 1}</p>
                  <div className="md:col-span-7">
                    <h3 className="display text-4xl text-sand-light md:text-5xl">{p.title}</h3>
                    <div className="mt-3 space-y-3 text-lg leading-relaxed text-sand/80">
                      {p.example.body.map((t, j) => (
                        <p key={j}>{t}</p>
                      ))}
                    </div>
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {p.example.delivered.map((d, j) => (
                        <Reveal as="li" key={d} variant="scale" delay={0.3 + j * 0.08} className="rounded-full border border-sand/25 px-3 py-1 text-sm text-sand">
                          {d}
                        </Reveal>
                      ))}
                    </ul>
                  </div>
                  <div className="md:col-span-3 md:text-right">
                    <Link href={`/programs/${p.slug}`} className="group inline-flex items-center gap-2 text-sm font-semibold text-sand">
                      About {p.title.toLowerCase()}
                      <ArrowRightIcon size={16} weight="bold" className="text-clay transition-transform duration-200 ease-[var(--ease-out-strong)] group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <div id="partnership" data-route-label="SaveSpots">
        <Partnership />
      </div>
      <Follow />
      <DonateSection />
      <Footer mark={mark} />
      <ScrollRoute />
    </main>
  );
}
