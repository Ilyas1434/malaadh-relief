import type { Metadata } from "next";
import { InfoPage } from "@/components/InfoPage";
import { JsonLd } from "@/components/JsonLd";
import { Reveal } from "@/components/Reveal";
import { about, seo } from "@/lib/content";
import { breadcrumbLd, faqLd, pageMeta, webPageLd } from "@/lib/seo";

export const metadata: Metadata = pageMeta("/about", seo.about.title, seo.about.description);

export default function AboutPage() {
  return (
    <InfoPage eyebrow={about.eyebrow} heading={about.heading} intro={about.intro} sections={about.sections}>
      <JsonLd
        data={[
          webPageLd("/about", seo.about.title, seo.about.description, "AboutPage"),
          breadcrumbLd([{ name: "About", path: "/about" }]),
          faqLd(about.faq),
        ]}
      />
      <section className="bg-sand-light px-4 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="display max-w-[14ch] text-[clamp(2.6rem,6vw,5rem)] text-espresso">{about.faqHeading}</h2>
          <dl className="mt-10 grid gap-x-10 gap-y-8 md:grid-cols-2">
            {about.faq.map((f) => (
              <Reveal key={f.q} className="border-t border-bark/15 pt-5">
                <dt className="text-lg font-bold text-espresso">{f.q}</dt>
                <dd className="mt-2 max-w-[52ch] leading-relaxed text-bark">{f.a}</dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>
    </InfoPage>
  );
}
