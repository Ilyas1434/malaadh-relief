import { Reveal } from "./Reveal";
import { VideoSlot } from "./VideoSlot";
import { programs } from "@/lib/content";

export function Impact() {
  return (
    <section id="impact" className="bg-bark px-4 py-28 text-sand md:py-36">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 className="display max-w-[12ch] text-[clamp(3rem,8vw,7rem)] text-sand-light">
            What we did on the ground
          </h2>
        </Reveal>

        <ol className="mt-14 divide-y divide-sand/15 border-t border-sand/15">
          {programs.map((p, i) => (
            <Reveal as="li" key={p.key} delay={0.05} className="grid gap-6 py-10 md:grid-cols-12 md:gap-10 md:py-14">
              <p className="display text-5xl text-clay md:col-span-2">0{i + 1}</p>
              <div className="md:col-span-6">
                <h3 className="display text-4xl text-sand-light md:text-5xl">{p.title}</h3>
                <p className="mt-4 max-w-[52ch] text-lg leading-relaxed text-sand/80">{p.body}</p>
              </div>
              <div className="md:col-span-4">
                <VideoSlot video={p.video} ratio="16/9" tone="dark" />
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
