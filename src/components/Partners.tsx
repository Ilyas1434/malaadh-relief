import Link from "next/link";
import { ArrowUpRightIcon, ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import { Headline, Reveal } from "./motion";
import { partnersIntro, partnership } from "@/lib/content";

export function Partners() {
  return (
    <section id="partners" data-route-label="Partners" className="bg-sand-light px-4 py-28 md:py-36">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-12">
        <div className="md:col-span-5">
          <Headline text={partnersIntro.heading} className="display max-w-[12ch] text-[clamp(3rem,7vw,6rem)] text-espresso" />
          <Reveal as="p" delay={0.2} className="mt-5 max-w-[44ch] text-lg leading-relaxed text-bark">{partnersIntro.body}</Reveal>
        </div>
        <Reveal delay={0.2} variant="scale" className="md:col-span-6 md:col-start-7">
          <div className="rounded-3xl bg-espresso p-7 text-sand md:p-9">
            <a
              href={partnership.partnerUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-sand/80 transition-colors hover:text-sand-light"
            >
              {partnership.partner} <ArrowUpRightIcon size={14} weight="bold" />
            </a>
            <p className="mt-1 text-sm text-sand/60">{partnership.partnerBlurb}</p>
            <p className="display mt-6 text-4xl text-sand-light md:text-5xl">{partnership.heading}</p>
            <p className="mt-4 text-base leading-relaxed text-sand/80">{partnership.body[0]}</p>
            <Link href="/work/sudan#partnership" className="group mt-6 inline-flex items-center gap-2 font-semibold text-sand-light">
              Read more
              <ArrowRightIcon size={18} weight="bold" className="text-clay transition-transform duration-200 ease-[var(--ease-out-strong)] group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
