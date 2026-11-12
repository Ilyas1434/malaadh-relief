import Link from "next/link";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "./Reveal";
import { programs } from "@/lib/content";

export function Programs() {
  return (
    <section id="programs" data-route-label="What we fund" className="bg-bark px-4 py-28 text-sand md:py-36">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 className="display max-w-[12ch] text-[clamp(3rem,8vw,7rem)] text-sand-light">What we fund</h2>
          <p className="mt-4 max-w-[48ch] text-lg text-sand/80">The same three things on every trip, adjusted to what the place needs.</p>
        </Reveal>
        <ol className="mt-14 divide-y divide-sand/15 border-t border-sand/15">
          {programs.map((p, i) => (
            <Reveal as="li" key={p.slug} delay={0.05}>
              <Link href={`/programs/${p.slug}`} className="group grid gap-4 py-9 md:grid-cols-12 md:gap-10 md:py-12">
                <p className="display text-5xl text-clay md:col-span-2">0{i + 1}</p>
                <div className="md:col-span-7">
                  <h3 className="display text-4xl text-sand-light md:text-5xl">{p.title}</h3>
                  <p className="mt-3 max-w-[52ch] text-lg leading-relaxed text-sand/80">{p.short}</p>
                </div>
                <div className="flex items-start md:col-span-3 md:justify-end">
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-sand">
                    Read more
                    <ArrowRightIcon size={18} weight="bold" className="text-clay transition-transform duration-200 ease-[var(--ease-out-strong)] group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
