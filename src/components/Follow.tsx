import { InstagramLogoIcon, YoutubeLogoIcon } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "./Reveal";
import { VideoSlot } from "./VideoSlot";
import { reels, site } from "@/lib/content";

export function Follow() {
  return (
    <section id="follow" className="bg-sand px-4 py-28 md:py-36">
      <div className="mx-auto max-w-6xl">
        <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="display text-[clamp(3rem,8vw,7rem)] text-espresso">Come with us</h2>
            <p className="mt-3 max-w-[40ch] text-lg text-bark">
              Every trip is filmed and animated, start to finish. Follow along from the airport to the doorstep.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href={site.instagram} target="_blank" rel="noreferrer" className="btn btn-primary">
              <InstagramLogoIcon size={18} weight="bold" /> {site.instagramHandle}
            </a>
            <a href={site.youtube} target="_blank" rel="noreferrer" className="btn btn-secondary">
              <YoutubeLogoIcon size={18} weight="bold" /> YouTube
            </a>
          </div>
        </Reveal>
        <ul className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6">
          {reels.map((r, i) => (
            <Reveal as="li" key={r.title} delay={i * 0.07}>
              <VideoSlot video={r.video} ratio="9/16" label={r.title} />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
