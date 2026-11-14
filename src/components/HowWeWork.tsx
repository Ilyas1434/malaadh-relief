import { Headline, Reveal } from "./motion";
import { how } from "@/lib/content";

const starts = ["md:col-start-1", "md:col-start-4", "md:col-start-7"];

export function HowWeWork() {
  return (
    <section id="how" data-route-label="How" className="bg-sand-light px-4 py-28 md:py-36">
      <div className="mx-auto max-w-6xl">
        <Headline text={how.heading} className="display max-w-[12ch] text-[clamp(3rem,8vw,7rem)] text-espresso" />
        <ol className="mt-14 grid gap-12 md:grid-cols-12 md:gap-y-16">
          {how.steps.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 0.12} variant="clip" className={`md:col-span-6 ${starts[i]}`}>
              <div className="flex gap-5 border-t border-bark/20 pt-6">
                <span className="display text-5xl leading-none text-clay">0{i + 1}</span>
                <div>
                  <h3 className="display text-4xl text-espresso">{s.title}</h3>
                  <p className="mt-3 max-w-[46ch] text-lg leading-relaxed text-bark">{s.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
