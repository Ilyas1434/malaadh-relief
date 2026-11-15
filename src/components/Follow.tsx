import { InstagramLogoIcon } from "@phosphor-icons/react/dist/ssr";
import { Headline, Reveal } from "./motion";
import { LatestVideos } from "./LatestVideos";
import { follow, site } from "@/lib/content";

export function Follow() {
  return (
    <section id="follow" data-route-label="Follow" className="relative bg-sand px-4 py-28 md:py-36">
      <div className="mx-auto grid max-w-6xl gap-y-10 md:grid-cols-[minmax(0,1fr)_21rem] md:gap-x-16 lg:grid-cols-[minmax(0,1fr)_23rem] lg:gap-x-24">
        <div className="md:col-start-1 md:row-start-1 md:self-end">
          <Headline text={follow.heading} className="display text-[clamp(3rem,8vw,7rem)] text-espresso" />
          <Reveal as="p" delay={0.25} className="mt-3 max-w-[40ch] text-lg text-bark">
            {follow.body}
          </Reveal>
          <Reveal delay={0.35} className="mt-6">
            <a href={site.instagram} target="_blank" rel="noreferrer" className="btn btn-primary">
              <InstagramLogoIcon size={18} weight="bold" /> {site.instagramHandle}
            </a>
          </Reveal>
        </div>
        <LatestVideos />
      </div>
    </section>
  );
}
