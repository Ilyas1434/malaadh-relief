import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeftIcon, HandHeartIcon, StorefrontIcon, UsersThreeIcon } from "@phosphor-icons/react/dist/ssr";
import { DonateForm } from "@/components/DonateForm";
import { CalligraphyMark } from "@/components/BrandMark";
import { donate, site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Donate | Malaadh Relief",
  description: donate.pageBody,
};

const icons = [HandHeartIcon, StorefrontIcon, UsersThreeIcon];

export default function DonatePage() {
  return (
    <main className="min-h-[100dvh] bg-espresso text-sand">
      <div className="mx-auto max-w-6xl px-4 pt-6 pb-20 md:pb-28">
        <div className="flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-sand/80 transition-colors hover:text-sand-light">
            <ArrowLeftIcon size={16} weight="bold" /> Back to {site.name}
          </Link>
          <Link href="/" aria-label={site.name} className="h-7 text-sand-light">
            <CalligraphyMark className="block h-full" />
          </Link>
        </div>

        <div className="mt-12 grid gap-12 md:mt-16 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-6 lg:col-span-5">
            <p className="inline-block rounded-full bg-sand/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-sand">
              Donate
            </p>
            <h1 className="display mt-5 text-[clamp(3rem,7vw,5.5rem)] text-sand-light">{donate.pageHeading}</h1>
            <p className="mt-6 max-w-[48ch] text-lg leading-relaxed text-sand/85">{donate.pageBody}</p>

            <ul className="mt-10 space-y-6">
              {donate.reasons.map((r, i) => {
                const Icon = icons[i];
                return (
                  <li key={r.title} className="flex gap-4">
                    <span className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-full border border-sand/20 text-sand">
                      <Icon size={20} weight="regular" />
                    </span>
                    <div>
                      <p className="font-semibold text-sand-light">{r.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-sand/75">{r.body}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="md:col-span-6 lg:col-span-6 lg:col-start-7">
            <DonateForm />
          </div>
        </div>

        <div className="mt-16 max-w-2xl space-y-3 text-xs leading-relaxed text-sand/55">
          <p>{site.registration} Questions about giving? Email <a className="underline underline-offset-2 hover:text-sand" href={`mailto:${site.email}`}>{site.email}</a>.</p>
          <p>Gifts are unrestricted and go wherever the need is greatest.</p>
        </div>
      </div>
    </main>
  );
}
