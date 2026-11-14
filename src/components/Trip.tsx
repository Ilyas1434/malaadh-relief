import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import { Headline, Reveal } from "./motion";
import { SudanMap } from "./SudanMap";
import { VideoSlot } from "./VideoSlot";
import { WhyStat } from "./WhyStat";
import { Cameo } from "./Cameo";
import { sudan as trip } from "@/lib/content";

export function Trip() {
  return (
    <>
      <section
        id="sudan"
        data-route-label="Sudan"
        className="relative overflow-hidden bg-sand px-4 pt-28 pb-16 md:pt-36 md:pb-24"
      >
        <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-12">
          <div className="md:col-span-6">
            <Reveal amount={0.1}>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-clay">
                {trip.label} <span className="mx-2 text-bark/40">/</span> {trip.when}
              </p>
            </Reveal>
            <Headline as="h1" text={trip.place} className="display mt-3 text-[clamp(4.5rem,18vw,14rem)] text-espresso" amount={0.1} />
            <Reveal as="p" delay={0.35} amount={0.1} className="mt-4 max-w-[46ch] text-xl leading-relaxed text-bark">
              {trip.intro}
            </Reveal>
            <WhyStat why={trip.why} delay={0.45} amount={0.1} className="mt-8" />
            <ol className="mt-8 flex flex-wrap items-center gap-x-2 gap-y-2 text-sm font-semibold text-bark">
              {trip.route.map((stop, i) => (
                <Reveal as="li" key={stop} variant="scale" delay={0.6 + i * 0.14} amount={0.1} className="flex items-center gap-2">
                  <span
                    className={`rounded-full border px-3 py-1 ${
                      i === trip.route.length - 1 ? "border-espresso bg-espresso text-sand-light" : "border-bark/25 text-espresso"
                    }`}
                  >
                    {stop}
                  </span>
                  {i < trip.route.length - 1 && <ArrowRightIcon size={14} weight="bold" className="text-clay" />}
                </Reveal>
              ))}
            </ol>
          </div>
          <Reveal className="md:col-span-6" variant="scale" delay={0.2} amount={0.1}>
            <SudanMap className="w-full text-espresso" />
          </Reveal>
        </div>
      </section>

      <section className="relative bg-sand-light px-4 py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-12">
          <div className="md:col-span-7">
            <Headline text="Getting there" className="display text-[clamp(2.6rem,6vw,5rem)] text-espresso" />
            <div className="mt-6 space-y-5 text-lg leading-relaxed text-bark">
              {trip.story.map((p, i) => (
                <Reveal as="p" key={i} delay={0.15 + i * 0.08}>
                  {p}
                </Reveal>
              ))}
            </div>
          </div>
          <Reveal className="md:col-span-4 md:col-start-9" variant="clip" delay={0.2}>
            <VideoSlot video={trip.video} ratio="9/16" label={trip.videoCaption} />
          </Reveal>
        </div>
        <Cameo act="peekWave" side="left" />
      </section>
    </>
  );
}
