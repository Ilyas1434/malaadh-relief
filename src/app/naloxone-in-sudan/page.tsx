import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon, CheckIcon } from "@phosphor-icons/react/dist/ssr";
import { InfoPage } from "@/components/InfoPage";
import { JsonLd } from "@/components/JsonLd";
import { WhyStat } from "@/components/WhyStat";
import { naloxone, partnership, seo } from "@/lib/content";
import { breadcrumbLd, pageMeta, webPageLd } from "@/lib/seo";

export const metadata: Metadata = pageMeta("/naloxone-in-sudan", seo.naloxone.title, seo.naloxone.description);

export default function NaloxonePage() {
  return (
    <InfoPage eyebrow={naloxone.eyebrow} heading={naloxone.heading} intro={naloxone.intro} sections={naloxone.sections}>
      <JsonLd
        data={[
          webPageLd("/naloxone-in-sudan", seo.naloxone.title, seo.naloxone.description),
          breadcrumbLd([{ name: "Naloxone in Sudan", path: "/naloxone-in-sudan" }]),
        ]}
      />
      <section className="bg-sand-light px-4 py-16 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-12">
          <div className="md:col-span-6">
            <WhyStat why={partnership.why} surface="bg-sand ring-bark/10" />
          </div>
          <div className="md:col-span-5 md:col-start-8">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-clay">Delivered</p>
            <ul className="mt-4 space-y-3">
              {naloxone.delivered.map((d) => (
                <li key={d} className="flex items-center gap-2 text-lg text-espresso">
                  <CheckIcon size={18} weight="bold" className="shrink-0 text-clay" /> {d}
                </li>
              ))}
            </ul>
            <p className="mt-8 text-sm text-bark">
              In partnership with{" "}
              <a href={partnership.partnerUrl} target="_blank" rel="noreferrer" className="font-semibold text-espresso underline decoration-clay/60 underline-offset-4">
                {partnership.partner}
              </a>
              , a {partnership.partnerBlurb.charAt(0).toLowerCase() + partnership.partnerBlurb.slice(1)}.
            </p>
            <Link href="/programs/medical-aid" className="group mt-6 inline-flex items-center gap-2 font-semibold text-espresso">
              About our medical aid
              <ArrowRightIcon size={16} weight="bold" className="text-clay transition-transform duration-200 ease-[var(--ease-out-strong)] group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </InfoPage>
  );
}
