"use client";
import { Cameo } from "./Cameo";
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

// The hand artwork is drawn on a 420 x 415 canvas whose origin sits at (-120, -80) in logo pixels,
// so the forearm runs on well past the corner of the screen. The positioned box below is the
// 248 x 273 region the hand itself occupies in the logo; these offsets hang the full canvas on it.
// The right hand is the same drawing turned 180 degrees, so its offsets mirror.
const HAND_BOX = { width: `${(420 / 248) * 100}%`, height: `${(415 / 273) * 100}%` } as const;
const HAND_INSET_X = `${(-120 / 248) * 100}%`;
const HAND_INSET_Y = `${(-121 / 273) * 100}%`;

// Where the fingertips sit inside each 248 x 273 box, in logo pixels: the left hand's pinch is at
// (275, 271), the right hand's (turned 180 degrees) at (-27, 2). Expressed as multiples of the box
// width so a box can be placed by its fingertips, and as a transform-origin for the tilt.
const TIP_L = { x: 275 / 248, y: 271 / 248, origin: `${(275 / 248) * 100}% ${(271 / 273) * 100}%` } as const;
const TIP_R = { x: -27 / 248, y: 2 / 248, origin: `${(-27 / 248) * 100}% ${(2 / 273) * 100}%` } as const;

// Layout of the pair, set as CSS variables on the backdrop.
// --cx/--cy: middle of the gap between the fingertips, measured from the top of the title block.
// --gx/--gy: half that gap. --hw: width of one hand box. --rot: tilt around the fingertips.
// The fingertips sit just above the title, about 12% of the screen width apart. The right hand runs
// behind the end of the title and off the right edge, clear of the copy below.
// From md up, --hw shrinks with the room between the nav and the title, so the left hand stays out
// from under the nav. It never goes below 24vw, or the forearms would stop short of the screen edges.
// Under 760px tall there is no room above the title, so the hands come in flatter and lower.
const HANDS_LAYOUT = [
  "pointer-events-none absolute inset-0 select-none",
  "[--cx:50%] [--gy:calc(0.02_*_var(--hw))] [--cy:calc(1rem_-_0.1_*_var(--hw))] [--rot:-20deg]",
  "[--hw:min(58vw,62vmin,600px)] [--gx:7vw]",
  "md:[--gx:6vw] md:[--hw:max(24vw,min(40vw,56vmin,600px,calc((50dvh_-_9rem_-_0.48_*_clamp(3.8rem,14vw,12rem))_*_2.4)))]",
  "md:[@media(height<47.5rem)]:[--hw:max(23vw,min(26vw,46vmin))] md:[@media(height<47.5rem)]:[--cy:calc(0.96_*_clamp(3.8rem,14vw,12rem)_+_14rem)] md:[@media(height<47.5rem)]:[--gx:10.5rem] md:[@media(height<47.5rem)]:[--gy:0.4rem] md:[@media(height<47.5rem)]:[--rot:-32deg]",
].join(" ");

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

      {/* The hands are placed against this block, so they stay anchored to the title whatever the copy below it does. */}
      <div className="relative w-full">
        {/* Backdrop: the two hands from the logo, one reaching in from the top left and one up from the bottom right. Their fingertips nearly meet just above the title. */}
        <motion.div
          aria-hidden
          style={{ opacity: bgFade }}
          className={HANDS_LAYOUT}
        >
          <motion.div
            className="absolute"
            style={{
              width: "var(--hw)",
              aspectRatio: "248 / 273",
              left: `calc(var(--cx) - var(--gx) - var(--hw) * ${TIP_L.x})`,
              top: `calc(var(--cy) - var(--gy) - var(--hw) * ${TIP_L.y})`,
              transform: leftT,
            }}
          >
            <div className="h-full w-full" style={{ transform: "rotate(var(--rot))", transformOrigin: TIP_L.origin }}>
              <div className="hero-hand-l h-full w-full">
                <div className="hero-breathe-l relative h-full w-full text-clay">
                  <div
                    className="absolute [&>svg]:block [&>svg]:h-full [&>svg]:w-full"
                    style={{ ...HAND_BOX, left: HAND_INSET_X, top: HAND_INSET_Y }}
                    dangerouslySetInnerHTML={{ __html: svgs.handLeft }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div
            className="absolute"
            style={{
              width: "var(--hw)",
              aspectRatio: "248 / 273",
              left: `calc(var(--cx) + var(--gx) - var(--hw) * ${TIP_R.x})`,
              top: `calc(var(--cy) + var(--gy) - var(--hw) * ${TIP_R.y})`,
              transform: rightT,
            }}
          >
            <div className="h-full w-full" style={{ transform: "rotate(var(--rot))", transformOrigin: TIP_R.origin }}>
              <div className="hero-hand-r h-full w-full">
                <div className="hero-breathe-r relative h-full w-full text-clay">
                  <div
                    className="absolute [&>svg]:block [&>svg]:h-full [&>svg]:w-full"
                    style={{ ...HAND_BOX, right: HAND_INSET_X, bottom: HAND_INSET_Y }}
                    dangerouslySetInnerHTML={{ __html: svgs.handRight }}
                  />
                </div>
              </div>
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
      </div>
      <Cameo act="sideWave" side="right" say="Assalamu alaikum!" wait={3600} />
    </section>
  );
}
