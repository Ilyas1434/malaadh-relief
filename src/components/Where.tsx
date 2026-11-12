import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, MapPinIcon } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "./Reveal";
import { places } from "@/lib/content";

export function Where() {
  const active = places.filter((s) => s.status === "active");
  const next = places.filter((s) => s.status === "next");
  return (
    <section id="where" data-route-label="Sudan" className="bg-sand px-4 py-28 md:py-36">
      <div className="mx-auto max-w-6xl">
        <Reveal className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <h2 className="display max-w-[12ch] text-[clamp(3rem,8vw,7rem)] text-espresso">Where we work</h2>
          <p className="max-w-[36ch] text-lg text-bark">Sudan so far. Each place gets its own page with what was delivered and to whom.</p>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-12">
          {active.map((s) => (
            <Reveal key={s.slug} className="md:col-span-7">
              <Link
                href={`/work/${s.slug}`}
                className="group relative block aspect-[4/5] overflow-hidden rounded-3xl bg-espresso text-sand sm:aspect-[16/11] md:aspect-auto md:h-full md:min-h-[520px]"
              >
                <Image
                  src="/img/sudan-wing.jpg"
                  alt=""
                  fill
                  sizes="(min-width: 768px) 60vw, 100vw"
                  className="object-cover opacity-50 transition-[transform,opacity] duration-700 ease-[var(--ease-out-strong)] group-hover:scale-[1.03] group-hover:opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/40 to-transparent" />
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
                      See the work
                      <ArrowRightIcon size={18} weight="bold" className="transition-transform duration-200 ease-[var(--ease-out-strong)] group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
          {next.map((s) => (
            <Reveal key={s.slug} delay={0.1} className="md:col-span-5">
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
      </div>
    </section>
  );
}
