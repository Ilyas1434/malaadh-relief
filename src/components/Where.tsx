import Link from "next/link";
import { ArrowRightIcon, MapPinIcon } from "@phosphor-icons/react/dist/ssr";
import { Headline, Reveal } from "./motion";
import { SudanMap } from "./SudanMap";
import { WhyStat } from "./WhyStat";
import { places, sudan } from "@/lib/content";

export function Where() {
  const active = places.filter((s) => s.status === "active");
  const next = places.filter((s) => s.status === "next");
  return (
    <section id="where" data-route-label="Sudan" className="bg-sand px-4 py-28 md:py-36">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <Headline text="Where we work" className="display max-w-[12ch] text-[clamp(3rem,8vw,7rem)] text-espresso" />
          <Reveal as="p" delay={0.3} className="max-w-[36ch] text-lg text-bark">Sudan so far.</Reveal>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-12">
          {active.map((s) => (
            <Reveal key={s.slug} className="md:col-span-7" variant="clip" duration={1}>
              <Link
                href={`/work/${s.slug}`}
                className="group relative block aspect-[4/5] overflow-hidden rounded-3xl bg-espresso text-sand sm:aspect-[16/11] md:aspect-auto md:h-full md:min-h-[520px]"
              >
                <div className="pointer-events-none absolute -top-[6%] -right-[8%] w-[70%] text-clay opacity-70 transition-transform duration-700 ease-[var(--ease-out-strong)] group-hover:scale-[1.03] sm:w-[58%] md:w-[66%]">
                  <SudanMap className="w-full" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/30 to-transparent" />
                <div className="relative flex h-full flex-col justify-between p-7 md:p-9">
                  <div className="flex items-center justify-between text-sm font-semibold">
                    <span className="inline-flex items-center gap-2 rounded-full bg-sand/10 px-3 py-1 backdrop-blur">
                      <MapPinIcon size={14} weight="fill" /> {s.city}
                    </span>
                    <span className="text-sand/80">{s.when}</span>
                  </div>
                  <div>
                    <p className="display text-[clamp(3.5rem,9vw,7rem)] leading-none text-sand-light">{s.name}</p>
                    <p className="mt-4 max-w-[48ch] text-base leading-relaxed text-sand/80">{s.summary}</p>
                    <span className="mt-6 inline-flex items-center gap-2 font-semibold text-sand-light">
                      Read more
                      <ArrowRightIcon size={18} weight="bold" className="transition-transform duration-200 ease-[var(--ease-out-strong)] group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
          {next.map((s) => (
            <Reveal key={s.slug} delay={0.2} variant="scale" className="md:col-span-5">
              <div className="flex h-full flex-col justify-between rounded-3xl border-2 border-dashed border-bark/30 p-7 text-espresso md:p-9">
                <div className="flex items-center gap-2 text-sm font-semibold text-bark">
                  <MapPinIcon size={14} /> {s.name}
                </div>
                <div className="mt-16 md:mt-0">
                  <p className="display text-4xl text-espresso md:text-5xl">{s.city}</p>
                  <p className="mt-4 text-base leading-relaxed text-bark">{s.summary}</p>
                  <Link href="/donate" className="btn btn-secondary mt-6">
                    Donate
                  </Link>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <WhyStat why={sudan.why} layout="row" delay={0.1} className="mt-5" />
      </div>
    </section>
  );
}
