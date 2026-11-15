import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr";
import { CalligraphyMark } from "@/components/BrandMark";
import { Library } from "@/components/Library";
import { site } from "@/lib/content";
import { videos } from "@/lib/videos";

type Params = { slug?: string[] };

export const instant = false;

// One route serves both the library (/watch) and a single video (/watch/part-3), so
// opening and closing a video never reloads the page.
export function generateStaticParams() {
  return [{ slug: [] }, ...videos.map((v) => ({ slug: [v.slug] }))];
}

function find(slug?: string[]) {
  if (!slug || slug.length === 0) return null;
  return (slug.length === 1 && videos.find((v) => v.slug === slug[0])) || undefined;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const video = find(slug);
  if (!video) return { title: `Watch | ${site.name}`, description: "Every video from our trips, in order." };
  return {
    title: `Part ${video.part}: ${video.title} | ${site.name}`,
    description: `Watch part ${video.part} of our trip.`,
    openGraph: { images: [video.poster] },
  };
}

export default async function WatchPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const video = find(slug);
  if (video === undefined) notFound();

  return (
    <main className="min-h-[100dvh] bg-sand text-espresso">
      <div className="mx-auto max-w-6xl px-4 pt-6 pb-24 md:pb-32">
        <div className="flex items-center justify-between">
          <Link href="/#follow" className="inline-flex items-center gap-2 text-sm font-semibold text-bark transition-colors hover:text-espresso">
            <ArrowLeftIcon size={16} weight="bold" /> Back to {site.name}
          </Link>
          <Link href="/" aria-label={site.name} className="h-7 text-espresso">
            <CalligraphyMark className="block h-full" />
          </Link>
        </div>
        <h1 className="display mt-12 text-[clamp(3.4rem,9vw,7rem)] text-espresso md:mt-16">Watch</h1>
        <p className="mt-3 max-w-[44ch] text-lg leading-relaxed text-bark">Every video from our trips, in order. Start at part 1.</p>
        <div className="mt-14">
          <Library open={video?.slug ?? null} />
        </div>
      </div>
    </main>
  );
}
