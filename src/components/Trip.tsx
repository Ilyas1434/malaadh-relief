import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "./Reveal";
import { SudanMap } from "./SudanMap";
import { VideoSlot } from "./VideoSlot";
import { trip } from "@/lib/content";

export function Trip() {
  return (
    <section id="sudan" className="relative overflow-hidden bg-sand px-4 py-28 md:py-36">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-clay">
            {trip.label} <span className="mx-2 text-bark/40">/</span> {trip.when}
          </p>
          <h2 className="display mt-3 text-[clamp(4rem,16vw,13rem)] text-espresso">{trip.place}</h2>
        </Reveal>

        <div className="mt-8 grid items-start gap-10 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-5">
            <Reveal delay={0.05}>
              <ol className="flex flex-wrap items-center gap-x-2 gap-y-2 text-sm font-semibold text-bark">
                {trip.route.map((stop, i) => (
                  <li key={stop} className="flex items-center gap-2">
                    <span className={i === trip.route.length - 1 ? "text-espresso" : ""}>{stop}</span>
                    {i < trip.route.length - 1 && <ArrowRightIcon size={14} weight="bold" className="text-clay" />}
                  </li>
                ))}
              </ol>
            </Reveal>
            <div className="mt-6 space-y-5 text-lg leading-relaxed text-bark">
              {trip.story.map((p, i) => (
                <Reveal as="p" key={i} delay={0.1 + i * 0.08}>
                  {p}
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.25} className="mt-8">
              <p className="text-sm font-semibold text-espresso">Base of operations</p>
              <p className="text-bark">{trip.city}</p>
            </Reveal>
          </div>

          <Reveal className="md:col-span-4" delay={0.15}>
            <SudanMap className="w-full text-espresso" />
          </Reveal>

          <Reveal className="md:col-span-3" delay={0.2}>
            <VideoSlot video={trip.video} ratio="9/16" label={trip.videoCaption} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
