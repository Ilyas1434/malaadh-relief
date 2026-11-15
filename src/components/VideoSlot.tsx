import { PlayIcon, InstagramLogoIcon } from "@phosphor-icons/react/dist/ssr";
import type { VideoRef } from "@/lib/content";
import { Player } from "./Player";

export function VideoSlot({
  video,
  ratio = "9/16",
  label = "Video coming soon",
  className = "",
  tone = "light",
}: {
  video: VideoRef;
  ratio?: "9/16" | "16/9" | "1/1";
  label?: string;
  className?: string;
  tone?: "light" | "dark";
}) {
  const aspect =
    ratio === "9/16" ? "aspect-[9/16]" : ratio === "1/1" ? "aspect-square" : "aspect-video";
  const base = `relative overflow-hidden rounded-2xl ${aspect} ${className}`;

  if (video?.kind === "file") {
    return <Player src={video.src} poster={video.poster} title={label} className={className} />;
  }
  if (video?.kind === "instagram") {
    return (
      <a
        href={video.url}
        target="_blank"
        rel="noreferrer"
        className={`${base} flex items-center justify-center bg-espresso text-sand transition-transform duration-200 ease-[var(--ease-out-strong)] hover:scale-[1.01] active:scale-[0.99]`}
      >
        <span className="flex flex-col items-center gap-3">
          <InstagramLogoIcon size={40} weight="light" />
          <span className="text-sm font-semibold">Watch on Instagram</span>
        </span>
      </a>
    );
  }

  const palette =
    tone === "dark"
      ? "bg-espresso text-sand/70 border-sand/15"
      : "bg-dune/40 text-bark border-bark/15";
  return (
    <div className={`${base} ${palette} slot-stripes flex items-center justify-center border`}>
      <div className="flex flex-col items-center gap-3 px-6 text-center">
        <span className="grid size-14 place-items-center rounded-full border border-current/30">
          <PlayIcon size={22} weight="fill" />
        </span>
        <span className="text-xs font-semibold uppercase tracking-[0.14em]">{label}</span>
      </div>
    </div>
  );
}
