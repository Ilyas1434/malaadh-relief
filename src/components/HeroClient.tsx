"use client";
import { useRef } from "react";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
} from "motion/react";
import type { BrandLayers } from "./BrandMark";
import { site } from "@/lib/content";

type Props = {
  layers: BrandLayers;
  svgs: { calligraphy: string; handLeft: string; handRight: string };
};

export function HeroClient({ svgs }: Props) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  // Pointer parallax: hands lean toward the cursor, calligraphy barely moves.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 60, damping: 18, mass: 0.8 });
  const smy = useSpring(my, { stiffness: 60, damping: 18, mass: 0.8 });

  // Scroll: the hands let go and drift apart, the whole backdrop fades.
  const k = reduce ? 0 : 1;
  const lx = useTransform([scrollYProgress, smx], ([p, m]: number[]) => k * (p * -220 + m * 26));
  const ly = useTransform([scrollYProgress, smy], ([p, m]: number[]) => k * (p * -120 + m * 18));
  const rx = useTransform([scrollYProgress, smx], ([p, m]: number[]) => k * (p * 220 + m * -26));
  const ry = useTransform([scrollYProgress, smy], ([p, m]: number[]) => k * (p * 120 + m * -18));
  const bgFade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const textFade = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 80]);

  const leftT = useMotionTemplate`translate3d(${lx}px, ${ly}px, 0)`;
  const rightT = useMotionTemplate`translate3d(${rx}px, ${ry}px, 0)`;
  const textT = useMotionTemplate`translate3d(0, ${textY}px, 0)`;

  const words = site.name.split(" ");

  return (
    <section
      ref={ref}
      id="top"
      data-route-label="Malaadh"
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(((e.clientX - r.left) / r.width - 0.5) * 2);
        my.set(((e.clientY - r.top) / r.height - 0.5) * 2);
      }}
      onPointerLeave={() => {
        mx.set(0);
        my.set(0);
      }}
      className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-sand px-4 pt-24 pb-16 text-center"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(55% 45% at 50% 50%, var(--color-sand-light) 0%, transparent 72%)",
        }}
      />

      {/* Backdrop: the two hands from the logo, one reaching in from the top left and one from the bottom right. They do not meet. */}
      <motion.div aria-hidden style={{ opacity: bgFade }} className="pointer-events-none absolute inset-0 select-none">
        <motion.div
          className="absolute -top-[2vh] -left-[4vw] w-[min(58vw,64vmin,560px)] md:top-[2vh] md:left-[2vw] md:w-[min(40vw,58vmin,560px)]"
          style={{ aspectRatio: "248 / 273", transform: leftT }}
        >
          <div className="hero-hand-l h-full w-full">
            <div
              className="hero-breathe-l h-full w-full text-clay [&>svg]:h-full [&>svg]:w-full"
              dangerouslySetInnerHTML={{ __html: svgs.handLeft }}
            />
          </div>
        </motion.div>
        <motion.div
          className="absolute -right-[4vw] -bottom-[2vh] w-[min(58vw,64vmin,560px)] md:right-[2vw] md:bottom-[2vh] md:w-[min(40vw,58vmin,560px)]"
          style={{ aspectRatio: "250 / 283", transform: rightT }}
        >
          <div className="hero-hand-r h-full w-full">
            <div
              className="hero-breathe-r h-full w-full text-clay [&>svg]:h-full [&>svg]:w-full"
              dangerouslySetInnerHTML={{ __html: svgs.handRight }}
            />
          </div>
        </motion.div>
      </motion.div>

      <motion.div style={{ opacity: textFade, transform: textT }} className="relative flex flex-col items-center">
        <h1 className="display flex flex-wrap justify-center gap-x-[0.22em] text-[clamp(3.8rem,14vw,12rem)] text-espresso">
          {words.map((w, i) => (
            <span key={w} className="overflow-hidden pb-[0.06em]">
              <span className="hero-word inline-block" style={{ "--i": i } as React.CSSProperties}>
                {w}
              </span>
            </span>
          ))}
        </h1>

        <p className="hero-fade mt-6 text-xl font-semibold text-espresso md:text-2xl" style={{ "--i": 0 } as React.CSSProperties}>
          {site.tagline}
        </p>
        <p
          className="hero-fade mt-3 max-w-[40ch] text-balance text-base leading-relaxed text-bark md:text-lg"
          style={{ "--i": 1 } as React.CSSProperties}
        >
          {site.heroSub}
        </p>

        <div className="hero-fade mt-8 flex flex-wrap items-center justify-center gap-3" style={{ "--i": 2 } as React.CSSProperties}>
          <Link href="/donate" className="btn btn-primary">
            Donate
          </Link>
          <a href="#mission" className="btn btn-secondary">
            Our mission
          </a>
        </div>
      </motion.div>
    </section>
  );
}
