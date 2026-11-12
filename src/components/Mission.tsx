import { Reveal } from "./Reveal";
import { mission, site } from "@/lib/content";

export function Mission() {
  return (
    <section id="mission" className="relative overflow-hidden bg-espresso px-4 py-28 text-sand md:py-40">
      <p
        aria-hidden
        className="font-arabic pointer-events-none absolute -top-10 -right-6 select-none text-[38vw] leading-none text-sand/[0.05] md:text-[26vw]"
      >
        {site.arabic}
      </p>
      <div className="relative mx-auto max-w-6xl">
        <Reveal>
          <h2 className="display max-w-[14ch] text-[clamp(3rem,8vw,7.5rem)] text-sand-light">
            {mission.heading}
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-8 md:mt-14 md:grid-cols-12">
          <Reveal className="md:col-span-3" delay={0.05}>
            <p className="font-arabic text-5xl text-clay md:text-6xl" lang="ar" dir="rtl">
              {site.arabic}
            </p>
            <p className="mt-2 text-sm text-sand/60">{site.meaning}</p>
          </Reveal>
          <div className="space-y-6 text-lg leading-relaxed text-sand/85 md:col-span-7 md:col-start-5 md:text-xl">
            {mission.body.map((p, i) => (
              <Reveal as="p" key={i} delay={0.1 + i * 0.08}>
                {p}
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
