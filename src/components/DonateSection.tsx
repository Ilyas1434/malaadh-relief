import Link from "next/link";
import { Reveal } from "./Reveal";
import { donate, site } from "@/lib/content";

export function DonateSection() {
  return (
    <section id="donate" className="relative overflow-hidden bg-espresso px-4 py-32 text-center text-sand md:py-44">
      <p
        aria-hidden
        className="font-arabic pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none text-center text-[60vw] leading-none text-sand/[0.05] md:text-[34vw]"
      >
        {site.arabic}
      </p>
      <div className="relative mx-auto max-w-3xl">
        <Reveal>
          <h2 className="display text-[clamp(3.4rem,10vw,8.5rem)] text-sand-light">{donate.heading}</h2>
        </Reveal>
        <Reveal as="p" delay={0.08} className="mx-auto mt-5 max-w-[46ch] text-lg leading-relaxed text-sand/80">
          {donate.body}
        </Reveal>
        <Reveal delay={0.16} className="mt-9">
          <Link href="/donate" className="btn btn-on-dark h-14 px-8 text-base">
            Donate
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
