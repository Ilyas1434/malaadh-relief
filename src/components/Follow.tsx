import { InstagramLogoIcon, YoutubeLogoIcon } from "@phosphor-icons/react/dist/ssr";
import { Headline, Reveal } from "./motion";
import { VideoSlot } from "./VideoSlot";
import { follow, reels, site } from "@/lib/content";

export function Follow() {
  return (
    <section id="follow" data-route-label="Follow" className="bg-sand px-4 py-28 md:py-36">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Headline text={follow.heading} className="display text-[clamp(3rem,8vw,7rem)] text-espresso" />
            <Reveal as="p" delay={0.25} className="mt-3 max-w-[40ch] text-lg text-bark">
              {follow.body}
            </Reveal>
          </div>
          <Reveal delay={0.35} className="flex flex-wrap gap-3">
            <a href={site.instagram} target="_blank" rel="noreferrer" className="btn btn-primary">
              <InstagramLogoIcon size={18} weight="bold" /> {site.instagramHandle}
            </a>
            <a href={site.youtube} target="_blank" rel="noreferrer" className="btn btn-secondary">
              <YoutubeLogoIcon size={18} weight="bold" /> YouTube
            </a>
          </Reveal>
        </div>
        <ul className="-mx-4 mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 md:gap-6">
          {reels.map((r, i) => (
            <Reveal as="li" key={r.title} delay={0.1 + i * 0.1} variant="scale" className="w-[72vw] max-w-[320px] shrink-0 snap-center sm:w-auto sm:max-w-none">
              <VideoSlot video={r.video} ratio="9/16" label={r.title} />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
