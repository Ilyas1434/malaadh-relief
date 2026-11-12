"use client";
import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
} from "motion/react";
import type { BrandLayers } from "./BrandMark";
import { site } from "@/lib/content";
import Link from "next/link";

type Props = {
  layers: BrandLayers;
  svgs: { calligraphy: string; handLeft: string; handRight: string };
};

function pct(n: number, of: number) {
  return `${(n / of) * 100}%`;
}

export function HeroClient({ layers, svgs }: Props) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  // As the visitor scrolls, the hands let go and drift apart. The calligraphy stays, then fades.
  const lx = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -140]);
  const ly = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -70]);
  const rx = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 140]);
  const ry = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 70]);
  const cs = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.08]);
  const fade = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const leftT = useMotionTemplate`translate3d(${lx}px, ${ly}px, 0)`;
  const rightT = useMotionTemplate`translate3d(${rx}px, ${ry}px, 0)`;
  const calligT = useMotionTemplate`scale(${cs})`;

  const { original, layers: L } = layers;
  const box = (b: { x: number; y: number; w: number; h: number }) => ({
    left: pct(b.x, original.w),
    top: pct(b.y, original.h),
    width: pct(b.w, original.w),
    height: pct(b.h, original.h),
  });

  const words = site.name.split(" ");

  return (
    <section
      ref={ref}
      id="top"
      data-route-label="Malaadh"
      className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-sand px-4 pt-20 pb-12 text-center"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 42%, var(--color-sand-light) 0%, transparent 70%)",
        }}
      />

      {/* Logo composition: hands drift in from the edges and meet under the calligraphy. */}
      <motion.div
        style={{ opacity: fade }}
        className="relative aspect-[636/640] w-[min(72vw,max(46vmin,300px),460px)]"
        aria-label={`${site.arabic}, ${site.name} logo`}
        role="img"
      >
        <motion.div className="absolute" style={{ ...box(L["hand-left"]), transform: leftT }}>
          <div
            className="hero-hand-l h-full w-full text-clay [&>svg]:h-full [&>svg]:w-full"
            dangerouslySetInnerHTML={{ __html: svgs.handLeft }}
          />
        </motion.div>
        <motion.div className="absolute" style={{ ...box(L["hand-right"]), transform: rightT }}>
          <div
            className="hero-hand-r h-full w-full text-clay [&>svg]:h-full [&>svg]:w-full"
            dangerouslySetInnerHTML={{ __html: svgs.handRight }}
          />
        </motion.div>
        <motion.div className="absolute" style={{ ...box(L.calligraphy), transform: calligT }}>
          <div
            className="hero-callig h-full w-full text-espresso [&>svg]:h-full [&>svg]:w-full"
            dangerouslySetInnerHTML={{ __html: svgs.calligraphy }}
          />
        </motion.div>
      </motion.div>

      <h1 className="display mt-6 flex flex-wrap justify-center gap-x-[0.22em] text-[clamp(3.4rem,12vw,8.5rem)] text-espresso">
        {words.map((w, i) => (
          <span key={w} className="overflow-hidden pb-[0.06em]">
            <span className="hero-word inline-block" style={{ "--i": i } as React.CSSProperties}>
              {w}
            </span>
          </span>
        ))}
      </h1>

      <p
        className="hero-fade mt-5 max-w-[34ch] text-balance text-lg leading-relaxed text-bark md:text-xl"
        style={{ "--i": 0 } as React.CSSProperties}
      >
        <span className="font-semibold text-espresso">{site.tagline}</span> {site.heroSub}
      </p>

      <div className="hero-fade mt-8 flex flex-wrap items-center justify-center gap-3" style={{ "--i": 1 } as React.CSSProperties}>
        <Link href="/donate" className="btn btn-primary">
          Donate
        </Link>
        <a href="#sudan" className="btn btn-secondary">
          See the Sudan trip
        </a>
      </div>
    </section>
  );
}
