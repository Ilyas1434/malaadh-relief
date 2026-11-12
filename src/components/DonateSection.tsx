import Link from "next/link";
import { Headline, Parallax, Reveal } from "./motion";
import { donate, site } from "@/lib/content";

export function DonateSection() {
  return (
    <section id="donate" data-route-label="Give" className="relative overflow-hidden bg-espresso px-4 py-32 text-center text-sand md:py-44">
      <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none">
        <Parallax range={[60, -60]} scale={[0.9, 1.1]} className="text-center">
          <p aria-hidden className="font-arabic text-[60vw] leading-none text-sand/[0.05] md:text-[34vw]">
            {site.arabic}
          </p>
        </Parallax>
      </div>
      <div className="relative mx-auto max-w-3xl">
        <Headline text={donate.heading} className="display justify-center text-[clamp(3.4rem,10vw,8.5rem)] text-sand-light" />
        <Reveal as="p" delay={0.3} className="mx-auto mt-5 max-w-[46ch] text-lg leading-relaxed text-sand/80">
          {donate.body}
        </Reveal>
        <Reveal delay={0.4} variant="scale" className="mt-9">
          <Link href="/donate" className="btn btn-on-dark h-14 px-8 text-base">
            Donate
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
