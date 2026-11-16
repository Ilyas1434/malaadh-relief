import type { MetadataRoute } from "next";
import { places, programs } from "@/lib/content";
import { abs, videoDescription } from "@/lib/seo";
import { videos } from "@/lib/videos";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: abs("/"), changeFrequency: "weekly", priority: 1 },
    ...places
      .filter((p) => p.status === "active")
      .map((p) => ({ url: abs(`/work/${p.slug}`), changeFrequency: "monthly" as const, priority: 0.9 })),
    ...programs.map((p) => ({ url: abs(`/programs/${p.slug}`), changeFrequency: "monthly" as const, priority: 0.8 })),
    { url: abs("/about"), changeFrequency: "monthly", priority: 0.9 },
    { url: abs("/naloxone-in-sudan"), changeFrequency: "monthly", priority: 0.7 },
    { url: abs("/donate"), changeFrequency: "monthly", priority: 0.8 },
    { url: abs("/watch"), changeFrequency: "weekly", priority: 0.7 },
    ...videos.map((v) => ({
      url: abs(`/watch/${v.slug}`),
      ...(v.published ? { lastModified: v.published } : {}),
      priority: 0.6,
      videos: [
        {
          title: `Part ${v.part}: ${v.title}`,
          thumbnail_loc: abs(v.poster),
          description: videoDescription(v),
          content_loc: abs(v.src),
          duration: v.seconds,
          ...(v.published ? { publication_date: v.published } : {}),
        },
      ],
    })),
  ];
}
