import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "./Reveal";
import { VideoSlot } from "./VideoSlot";
import { partnership } from "@/lib/content";

export function Partnership() {
  return (
    <section id="partners" className="bg-sand-light px-4 py-28 md:py-36">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-7">
          <Reveal>
            <p className="text-sm font-semibold text-bark">
              In partnership with{" "}
              <a
                href={partnership.partnerUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-espresso underline decoration-clay/60 underline-offset-4 transition-colors hover:decoration-espresso"
              >
                {partnership.partner} <ArrowUpRightIcon size={14} weight="bold" />
              </a>
            </p>
            <h2 className="display mt-4 max-w-[16ch] text-[clamp(2.8rem,7vw,6.5rem)] text-espresso">
              {partnership.heading}
            </h2>
          </Reveal>
          <div className="mt-8 space-y-5 text-lg leading-relaxed text-bark">
            {partnership.body.map((p, i) => (
              <Reveal as="p" key={i} delay={0.08 + i * 0.08}>
                {p}
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.25}>
            <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-bark/15 pt-8">
              {partnership.facts.map((f) => (
                <div key={f.label} className="flex flex-col-reverse">
                  <dt className="mt-1 text-xs font-semibold text-bark/80 sm:text-sm">{f.label}</dt>
                  <dd className="display text-6xl text-espresso md:text-7xl">{f.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
        <Reveal className="md:col-span-4 md:col-start-9" delay={0.15}>
          <VideoSlot video={partnership.video} ratio="9/16" label="Video coming soon" />
        </Reveal>
      </div>
    </section>
  );
}
