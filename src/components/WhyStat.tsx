import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "./motion";
import type { Why } from "@/lib/content";

/** One sourced figure that explains why a place or program matters. */
export function WhyStat({
  why,
  tone = "light",
  layout = "stack",
  delay = 0,
  amount,
  className = "",
  surface,
}: {
  why: Why;
  tone?: "light" | "dark";
  layout?: "stack" | "row";
  delay?: number;
  amount?: number;
  className?: string;
  /** Override the card fill, e.g. when the section background matches the default. */
  surface?: string;
}) {
  const dark = tone === "dark";
  const box = surface ?? (dark ? "bg-sand/[0.06] ring-sand/15" : "bg-sand-light ring-bark/10");
  const row = layout === "row" && why.figure;
  return (
    <Reveal delay={delay} amount={amount} variant="clip" duration={0.9} className={className}>
      <div className={`rounded-3xl p-6 ring-1 md:p-8 ${box} ${row ? "md:flex md:items-end md:gap-10" : ""}`}>
        <div className={row ? "md:shrink-0" : ""}>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-clay">{why.eyebrow}</p>
          {why.figure && (
            <p className={`display mt-2 text-[clamp(3rem,7vw,5rem)] leading-none ${dark ? "text-sand-light" : "text-espresso"}`}>
              {why.figure}
            </p>
          )}
        </div>
        <div className={row ? "mt-4 md:mt-0" : "mt-4"}>
          <p className={`max-w-[52ch] text-base leading-relaxed md:text-lg ${dark ? "text-sand/85" : "text-bark"}`}>{why.body}</p>
          <a
            href={why.source.url}
            target="_blank"
            rel="noreferrer"
            className={`mt-3 inline-flex items-center gap-1 text-xs font-semibold transition-colors ${
              dark ? "text-clay hover:text-sand-light" : "text-clay hover:text-espresso"
            }`}
          >
            {why.source.name} <ArrowUpRightIcon size={12} weight="bold" />
          </a>
        </div>
      </div>
    </Reveal>
  );
}
