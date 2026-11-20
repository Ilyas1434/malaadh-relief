import { Headline, Reveal } from "./motion";
import { statement } from "@/lib/content";

/** The mission statement. It answers what Malaadh Relief does; the section after it explains the name and the method. */
export function MissionStatement() {
  return (
    <section id="mission" data-route-label="Mission" className="bg-sand-light px-4 py-24 md:py-36">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-12">
        <div className="md:col-span-7">
          <Reveal>
            <p className="text-xs font-bold tracking-[0.18em] text-clay uppercase">{statement.eyebrow}</p>
          </Reveal>
          <Headline text={statement.belief} className="display mt-4 max-w-[16ch] text-[clamp(2.75rem,6.5vw,6rem)] text-espresso" />
        </div>
        <div className="space-y-5 text-lg leading-relaxed text-bark md:col-span-5 md:self-end md:text-xl">
          {statement.body.map((p, i) => (
            <Reveal as="p" key={i} delay={0.15 + i * 0.1}>
              {p}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
