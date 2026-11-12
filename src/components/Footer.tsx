import type { ReactNode } from "react";
import { nav, site } from "@/lib/content";

export function Footer({ mark }: { mark: ReactNode }) {
  return (
    <footer className="border-t border-sand/15 bg-ink px-4 py-14 text-sand/80">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="flex items-center gap-3 text-sand-light">
            <span className="h-8">{mark}</span>
            <span className="display pt-1 text-2xl">{site.name}</span>
          </div>
          <p className="mt-4 max-w-[40ch] text-sm leading-relaxed">{site.registration}</p>
        </div>
        <div className="md:col-span-3">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sand/50">Site</p>
          <ul className="mt-3 space-y-2 text-sm">
            {nav.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="transition-colors hover:text-sand-light">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sand/50">Contact</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a href={`mailto:${site.email}`} className="transition-colors hover:text-sand-light">
                {site.email}
              </a>
            </li>
            <li>
              <a href={site.instagram} target="_blank" rel="noreferrer" className="transition-colors hover:text-sand-light">
                Instagram {site.instagramHandle}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <p className="mx-auto mt-12 max-w-6xl text-xs text-sand/45">
        © 2026 {site.name}. All rights reserved.
      </p>
    </footer>
  );
}
