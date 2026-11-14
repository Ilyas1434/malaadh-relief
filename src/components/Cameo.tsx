"use client";
import { useEffect, useRef } from "react";

/**
 * Ryan's niqab character, dropping in on a section the way she does in her videos.
 *
 * Every pose is one of her own drawings (scripts/ryan-cameo). Nothing slides or fades:
 * the motion is only one drawing replacing the next, at her pace of a drawing every
 * tenth of a second with long holds on the poses that matter.
 */

type Sheet = { src: string; cols: number; rows: number; w: number; h: number; gap: number };

// Numbers printed by scripts/ryan-cameo/build_sprites.py
const RISE: Sheet = { src: "/ryan/rise.webp", cols: 4, rows: 4, w: 480, h: 450, gap: 8 };
const PEEK: Sheet = { src: "/ryan/peek.webp", cols: 4, rows: 2, w: 420, h: 781, gap: 8 };

/** Drawings in rise.webp: she comes up from below a ledge. */
const R = {
  stand: 0,
  armLow: 1,
  armMid: 2,
  thumbUp: 3,
  thumbHeld: 4,
  waveBlur: 5,
  point: 6,
  grinA: 7,
  grinB: 8,
  grin: 9,
  crown: 10,
  squint: 11,
  hands: 12,
  eyes: 13,
  fingertips: 14,
  eyesWave: 15,
} as const;

/** Drawings in peek.webp: she leans in from the side. */
const P = { tucked: 0, swingLow: 1, swingUp: 2, waveA: 3, waveB: 4, waveC: 5, leanIn: 6, sliver: 7 } as const;

const T = 100;
/** [drawing, how long it stays up, optional puff frame] */
type Step = readonly [frame: number, ms: number, puff?: 1 | 2 | 3];

const UP: Step[] = [[R.fingertips, T, 1], [R.hands, T, 2], [R.crown, T, 3], [R.crown, T], [R.squint, T]];
const DOWN: Step[] = [[R.squint, T], [R.crown, T, 1], [R.hands, T, 2], [R.fingertips, T, 3]];

type Anchor = "bottom" | "side" | "hang";
type Act = { sheet: Sheet; anchor: Anchor; play: Step[]; leave: Step[] };

const ACTS = {
  /** Comes up from the bottom edge and gives a thumbs up. */
  thumbsUp: {
    sheet: RISE,
    anchor: "bottom",
    play: [
      ...UP,
      [R.stand, 600],
      [R.armLow, T],
      [R.armMid, T],
      [R.thumbUp, T],
      [R.thumbHeld, 1100],
      [R.thumbUp, T],
      [R.armMid, T],
      [R.armLow, T],
      [R.stand, 450],
    ],
    leave: [[R.stand, T], ...DOWN],
  },
  /** Comes up from the bottom edge and points at the visitor, smiling. */
  pointAtYou: {
    sheet: RISE,
    anchor: "bottom",
    play: [...UP, [R.stand, 500], [R.waveBlur, T], [R.point, T], [R.grinA, T], [R.grinB, T], [R.grin, 1400], [R.stand, 300]],
    leave: [[R.stand, T], ...DOWN],
  },
  /** Only her eyes clear the bottom edge, then a small wave. */
  peekWave: {
    sheet: RISE,
    anchor: "bottom",
    play: [...UP, [R.eyes, 700], [R.eyesWave, 260], [R.eyes, 180], [R.eyesWave, 260], [R.eyes, 180], [R.eyesWave, 500], [R.eyes, 600]],
    leave: DOWN,
  },
  /** The same peek, upside down from the top of the section. */
  hangWave: {
    sheet: RISE,
    anchor: "hang",
    play: [...UP, [R.eyes, 700], [R.eyesWave, 260], [R.eyes, 180], [R.eyesWave, 260], [R.eyes, 180], [R.eyesWave, 500], [R.eyes, 900]],
    leave: DOWN,
  },
  /** Leans in from the side of the screen, swings an arm out and waves. */
  sideWave: {
    sheet: PEEK,
    anchor: "side",
    play: [
      [P.sliver, T, 1],
      [P.leanIn, T, 2],
      [P.tucked, T, 3],
      [P.tucked, 450],
      [P.swingLow, T],
      [P.swingUp, T],
      [P.waveA, 180],
      [P.waveB, 120],
      [P.waveC, 120],
      [P.waveB, 120],
      [P.waveA, 120],
      [P.waveB, 120],
      [P.waveC, 120],
      [P.waveB, 120],
      [P.waveA, 450],
      [P.swingUp, T],
      [P.swingLow, T],
      [P.tucked, 350],
    ],
    leave: [[P.leanIn, T, 1], [P.sliver, T, 2]],
  },
} satisfies Record<string, Act>;

export type CameoAct = keyof typeof ACTS;

/** Little air puffs where she breaks the edge, drawn in each sheet's own pixel space. */
const PUFFS: Record<string, string[][]> = {
  [RISE.src]: [
    ["M88 440q-16-6-18-24", "M436 440q14-6 16-22"],
    ["M70 428q-22-6-26-32", "M96 414q-8-10-6-22", "M448 428q16-8 18-30", "M428 412q6-10 4-22"],
    ["M40 392q-6-8-6-16", "M84 384q-2-8 2-14", "M462 392q5-8 5-16", "M432 382q0-8-3-14"],
  ],
  [PEEK.src]: [
    ["M14 250q8-18 28-18", "M14 590q10 16 30 14"],
    ["M30 222q12-24 40-20", "M60 250q10-8 22-6", "M30 618q14 20 42 14", "M62 590q10 8 22 4"],
    ["M70 196q10-10 22-8", "M72 644q10 8 22 4"],
  ],
};

const PLACE: Record<Anchor, Record<"left" | "right", string>> = {
  bottom: {
    left: "fixed -bottom-px left-0 z-30 w-[clamp(10rem,44vw,16rem)]",
    right: "fixed -bottom-px right-0 z-30 w-[clamp(10rem,44vw,16rem)] -scale-x-100",
  },
  side: {
    left: "fixed top-[44%] -left-px z-30 w-[clamp(7.5rem,32vw,12rem)]",
    right: "fixed top-[44%] -right-px z-30 w-[clamp(7.5rem,32vw,12rem)] -scale-x-100",
  },
  hang: {
    left: "absolute -top-px left-[7%] z-10 w-[clamp(11rem,48vw,16rem)] rotate-180 -scale-x-100",
    right: "absolute -top-px right-[7%] z-10 w-[clamp(11rem,48vw,16rem)] rotate-180",
  },
};

// Only one cameo is ever on screen.
let onStage: object | null = null;
const COOLDOWN = 10_000;

// A tap on her turns the sound on: browsers only allow audio after a touch.
let audio: AudioContext | null = null;
function tone(ctx: AudioContext, from: number, to: number, ms: number) {
  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(from, t);
  osc.frequency.exponentialRampToValueAtTime(to, t + ms / 1000);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(0.07, t + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + ms / 1000);
  osc.connect(gain).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + ms / 1000 + 0.03);
}
function blip(from: number, to: number, ms: number) {
  const ctx = audio;
  if (!ctx) return;
  if (ctx.state === "running") tone(ctx, from, to, ms);
  else ctx.resume().then(() => tone(ctx, from, to, ms), () => {});
}
const popIn = () => blip(380, 820, 110);
const popOut = () => blip(700, 300, 130);

/**
 * Put one inside a <section>. She appears once the section reaches the middle of the
 * screen, plays her act, and leaves. Tapping her sends her off early.
 */
export function Cameo({ act, side = "right" }: { act: CameoAct; side?: "left" | "right" }) {
  const { sheet, anchor }: Act = ACTS[act];
  const box = useRef<HTMLDivElement>(null);
  const sprite = useRef<HTMLDivElement>(null);
  const hit = useRef<HTMLDivElement>(null);
  const puffs = useRef<SVGSVGElement>(null);
  const dismiss = useRef<() => void>(() => {});

  useEffect(() => {
    const el = box.current;
    const img = sprite.current;
    const host = el?.closest("section");
    if (!el || !img || !host) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const { play, leave }: Act = ACTS[act];
    const me = {};
    const mounted = performance.now();
    const puffFrames = puffs.current ? Array.from(puffs.current.querySelectorAll<SVGGElement>("g")) : [];
    let state: "off" | "playing" | "leaving" = "off";
    let inView = false;
    let ready = false;
    let lastExit = -COOLDOWN;
    let stepTimer = 0;
    let waitTimer = 0;

    const draw = (frame: number, puff?: number) => {
      const col = frame % sheet.cols;
      const row = Math.floor(frame / sheet.cols);
      img.style.backgroundPosition = `${(col / (sheet.cols - 1)) * 100}% ${(row / (sheet.rows - 1)) * 100}%`;
      img.style.visibility = "visible";
      if (hit.current) hit.current.style.pointerEvents = "auto";
      puffFrames.forEach((g, i) => g.setAttribute("visibility", i + 1 === puff ? "visible" : "hidden"));
    };
    const clear = () => {
      img.style.visibility = "hidden";
      if (hit.current) hit.current.style.pointerEvents = "none";
      puffFrames.forEach((g) => g.setAttribute("visibility", "hidden"));
    };
    const run = (steps: readonly Step[], done: () => void) => {
      let i = 0;
      const next = () => {
        if (i >= steps.length) return done();
        const [frame, ms, puff] = steps[i++];
        draw(frame, puff);
        stepTimer = window.setTimeout(next, ms);
      };
      next();
    };
    const exit = () => {
      if (state !== "playing") return;
      window.clearTimeout(stepTimer);
      state = "leaving";
      popOut();
      run(leave, () => {
        clear();
        state = "off";
        lastExit = performance.now();
        if (onStage === me) onStage = null;
      });
    };
    const enter = () => {
      if (!inView || state !== "off") return;
      if (performance.now() - lastExit < COOLDOWN) return;
      if (!ready || onStage) {
        waitTimer = window.setTimeout(enter, 400);
        return;
      }
      onStage = me;
      state = "playing";
      popIn();
      run(play, () => {
        state = "playing";
        exit();
      });
    };
    dismiss.current = exit;

    // Fetch the drawings only once the section is close.
    const near = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        near.disconnect();
        const file = new Image();
        file.onload = () => {
          img.style.backgroundImage = `url(${sheet.src})`;
          ready = true;
        };
        file.src = sheet.src;
      },
      { rootMargin: "150% 0px" },
    );
    near.observe(host);

    // The hanging cameo scrolls with the page, so it waits for its own spot to be on screen.
    // The others wait for their section to cross the middle of the screen.
    const stage = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        window.clearTimeout(waitTimer);
        // A short pause so she is not triggered by a fast scroll past, and a longer one
        // on a fresh page so it has settled before she shows up.
        if (inView) waitTimer = window.setTimeout(enter, Math.max(350, 1600 - (performance.now() - mounted)));
        else exit();
      },
      anchor === "hang" ? { rootMargin: "-12% 0px -30% 0px", threshold: 0.7 } : { rootMargin: "-45% 0px -45% 0px" },
    );
    stage.observe(anchor === "hang" ? el : host);

    return () => {
      near.disconnect();
      stage.disconnect();
      window.clearTimeout(stepTimer);
      window.clearTimeout(waitTimer);
      clear();
      if (onStage === me) onStage = null;
    };
  }, [act, anchor, sheet]);

  const tap = () => {
    if (!audio) {
      const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (Ctx) audio = new Ctx();
    }
    dismiss.current();
  };

  const sheetW = sheet.cols * sheet.w + (sheet.cols - 1) * sheet.gap;
  const sheetH = sheet.rows * sheet.h + (sheet.rows - 1) * sheet.gap;

  return (
    <div
      ref={box}
      aria-hidden
      className={`pointer-events-none select-none ${PLACE[anchor][side]}`}
      style={{ aspectRatio: `${sheet.w} / ${sheet.h}` }}
    >
      <div
        ref={sprite}
        className="absolute inset-0 bg-no-repeat"
        style={{ visibility: "hidden", backgroundSize: `${(sheetW / sheet.w) * 100}% ${(sheetH / sheet.h) * 100}%` }}
      />
      {/* Taps land on her, not on the empty corners of the drawing. */}
      <div
        ref={hit}
        onClick={tap}
        className={`absolute cursor-pointer [-webkit-tap-highlight-color:transparent] ${
          anchor === "side" ? "inset-[0_28%_45%_0]" : "inset-[5%_5%_0_23%]"
        }`}
        style={{ pointerEvents: "none" }}
      />
      <svg ref={puffs} viewBox={`0 0 ${sheet.w} ${sheet.h}`} className="absolute inset-0 h-full w-full overflow-visible" fill="none" strokeLinecap="round">
        {PUFFS[sheet.src].map((paths, i) => (
          <g key={i} visibility="hidden">
            {paths.map((d) => (
              <path key={d} d={d} stroke="var(--color-bone)" strokeWidth="11" />
            ))}
            {paths.map((d) => (
              <path key={d} d={d} stroke="var(--color-ink)" strokeWidth="4" />
            ))}
          </g>
        ))}
      </svg>
    </div>
  );
}
