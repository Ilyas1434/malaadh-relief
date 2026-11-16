import type { Metadata } from "next";
import { site, seo } from "./content";
import { series, type Video } from "./videos";

export const SITE_URL = "https://malaadh.org";
export const ORG_ID = `${SITE_URL}/#organization`;

export const abs = (path: string) => new URL(path, SITE_URL).toString();

// The card drawn by app/opengraph-image.tsx. Pages that set their own share text must name it again.
const SHARE_CARD = { url: "/opengraph-image", width: 1200, height: 630, alt: "Malaadh Relief. Refuge, delivered by hand." };

/** Title, description, canonical, and matching share-card text for one page. */
export function pageMeta(path: string, title: string, description: string, image?: string): Metadata {
  const full = path === "/" ? title : `${title} | ${site.name}`;
  return {
    title: path === "/" ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: site.name,
      locale: "en_US",
      url: path,
      title: full,
      description,
      images: [image ? { url: image } : SHARE_CARD],
    },
    twitter: { card: "summary_large_image", title: full, description, images: [image ?? SHARE_CARD.url] },
  };
}

export const organizationLd = {
  "@context": "https://schema.org",
  "@type": "NGO",
  "@id": ORG_ID,
  name: site.name,
  alternateName: ["Malaadh", site.arabic],
  url: SITE_URL,
  logo: abs("/brand/calligraphy.png"),
  description: seo.home.description,
  slogan: site.tagline,
  email: site.email,
  sameAs: [site.instagram],
  address: { "@type": "PostalAddress", addressLocality: "Nashville", addressRegion: "TN", addressCountry: "US" },
  areaServed: { "@type": "Country", name: "Sudan" },
  knowsAbout: ["Humanitarian aid in Sudan", "Orphan care", "Food aid", "Medical aid", "Naloxone distribution"],
};

export const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: site.name,
  url: SITE_URL,
  inLanguage: "en",
  publisher: { "@id": ORG_ID },
};

export function breadcrumbLd(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: site.name, path: "/" }, ...trail].map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: abs(t.path),
    })),
  };
}

export function webPageLd(path: string, name: string, description: string, type = "WebPage") {
  return {
    "@context": "https://schema.org",
    "@type": type,
    "@id": abs(path),
    url: abs(path),
    name,
    description,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": ORG_ID },
  };
}

export function videoDescription(v: Video) {
  const s = series.find((x) => x.id === v.series);
  return `Part ${v.part} of ${s ? s.title : "our trip"}: "${v.title}". Malaadh Relief films the journey of carrying aid by hand to families and clinics in Sudan.`;
}

export function videoLd(v: Video) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: `Part ${v.part}: ${v.title}`,
    description: videoDescription(v),
    thumbnailUrl: [abs(v.poster)],
    contentUrl: abs(v.src),
    url: abs(`/watch/${v.slug}`),
    duration: `PT${Math.floor(v.seconds / 60)}M${v.seconds % 60}S`,
    ...(v.published ? { uploadDate: `${v.published}T12:00:00-06:00` } : {}),
    publisher: { "@id": ORG_ID },
  };
}

export function faqLd(faq: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}
