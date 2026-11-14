"use client";
import { useEffect, useRef } from "react";

/**
 * Ryan's niqab character, dropping in on a section the way she does in her videos.
 *
 * Every pose is one of her own drawings (scripts/ryan-cameo). Nothing slides or fades:
 * the motion is only one drawing replacing the next, in her rhythm of quick drawings
 * with long holds on the poses that matter.
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
/** Her videos run at 1. The site plays a little quicker so a cameo never drags. */
const SPEED = 0.62;
/** [drawing, how long it stays up, optional puff frame] */
type Step = readonly [frame: number, ms: number, puff?: 1 | 2 | 3];

const UP: Step[] = [[R.fingertips, T, 1], [R.hands, T, 2], [R.crown, T, 3], [R.crown, T], [R.squint, T]];
const DOWN: Step[] = [[R.squint, T], [R.crown, T, 1], [R.hands, T, 2], [R.fingertips, T, 3]];

type Anchor = "bottom" | "side" | "hang";
/** `say` is the span of `play` steps during which the speech bubble is up. */
type Act = {
  sheet: Sheet;
  anchor: Anchor;
  play: Step[];
  leave: Step[];
  say?: readonly [from: number, to: number];
  /** With `stay`, she pauses after this many `play` steps and repeats `idle` until the visitor scrolls. */
  rest?: number;
  idle?: Step[];
};

const ACTS = {
  /** Comes up from the bottom of the section and gives a thumbs up. */
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
  /** Comes up from the bottom of the section and points at the visitor, smiling. */
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
    play: [...UP, [R.eyes, 700], [R.eyesWave, 260], [R.eyes, 180], [R.eyesWave, 260], [R.eyes, 180], [R.eyesWave, 500], [R.eyes, 1500]],
    leave: DOWN,
    say: [5, 12],
  },
  /** Leans in from the side of the section, swings an arm out and waves. */
  sideWave: {
    sheet: PEEK,
    anchor: "side",
    say: [3, 15],
    rest: 15,
    idle: [[P.waveA, 2200], [P.waveB, 120], [P.waveC, 120], [P.waveB, 120]],
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

const SIZE: Record<Anchor, string> = {
  bottom: "w-[clamp(6.5rem,26vw,9.5rem)]",
  hang: "w-[clamp(6.5rem,26vw,9.5rem)]",
  side: "w-[clamp(5.25rem,22vw,8rem)]",
};
// She lives in the empty padding at the edge of her section, so she never sits on text.
const PLACE: Record<Anchor, Record<"left" | "right", string>> = {
  bottom: { left: "-bottom-px left-0", right: "-bottom-px right-0" },
  side: { left: "bottom-[6%] -left-px", right: "bottom-[6%] -right-px" },
  hang: { left: "-top-px left-[7%]", right: "-top-px right-[7%]" },
};
// Her drawings face one way. Flip them for the other side, and turn them over to hang.
const TURN: Record<Anchor, Record<"left" | "right", string>> = {
  bottom: { left: "", right: "-scale-x-100" },
  side: { left: "", right: "-scale-x-100" },
  hang: { left: "rotate-180 -scale-x-100", right: "rotate-180" },
};

// Where the speech bubble sits beside her head. No entry means the act has no room for one.
const BUBBLE: Partial<Record<Anchor, string>> = { side: "top-[2%]", hang: "top-[16%]" };
const BUBBLE_X: Record<Anchor, Record<"left" | "right", string>> = {
  side: { left: "left-[74%]", right: "right-[74%]" },
  hang: { left: "left-[78%]", right: "right-[78%]" },
  bottom: { left: "", right: "" },
};
const BUBBLE_POP = ["scale(0.55) rotate(-6deg)", "scale(1.12) rotate(3deg)", "scale(0.96) rotate(-1deg)"];

// Only one cameo plays at a time, with a breather before the next one.
let onStage: object | null = null;
let lastExitAnywhere = -Infinity;
const BREATHER = 2500;
const COOLDOWN = 12_000;

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
 * Put one inside a `relative` <section>. She sits at the edge of that section and scrolls
 * with it. Once her spot is on screen she plays her act through and leaves. Tapping her
 * sends her off early.
 *
 * `say` adds a speech bubble for acts that have room for one. `wait` holds her back after
 * the page loads, in milliseconds. `stay` keeps her there until the visitor scrolls.
 */
export function Cameo({
  act,
  side = "right",
  say,
  wait = 1600,
  stay = false,
}: {
  act: CameoAct;
  side?: "left" | "right";
  say?: string;
  wait?: number;
  /** Keep her on screen until the visitor starts scrolling. */
  stay?: boolean;
}) {
  const { sheet, anchor }: Act = ACTS[act];
  const box = useRef<HTMLDivElement>(null);
  const sprite = useRef<HTMLDivElement>(null);
  const hit = useRef<HTMLDivElement>(null);
  const bubble = useRef<HTMLParagraphElement>(null);
  const puffs = useRef<SVGSVGElement>(null);
  const dismiss = useRef<() => void>(() => {});

  useEffect(() => {
    const el = box.current;
    const img = sprite.current;
    if (!el || !img) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const { play, leave, say: sayAt, rest, idle }: Act = ACTS[act];
    const me = {};
    const mounted = performance.now();
    const puffFrames = puffs.current ? Array.from(puffs.current.querySelectorAll<SVGGElement>("g")) : [];
    let state: "off" | "playing" | "leaving" = "off";
    let inView = false;
    let ready = false;
    let lastExit = -Infinity;
    let stepTimer = 0;
    let waitTimer = 0;
    let onScroll = () => {};

    // The bubble moves in steps like she does: three frames to pop in, then it rocks
    // between two tilts.
    let bubbleTimer = 0;
    let speaking = false;
    const speak = (on: boolean) => {
      const b = bubble.current;
      if (!b || on === speaking) return;
      speaking = on;
      window.clearInterval(bubbleTimer);
      b.style.display = on ? "block" : "none";
      if (!on) return;
      let tick = 0;
      const pose = () => {
        const pop = BUBBLE_POP[tick];
        b.style.transform = pop ?? (Math.floor(tick / 4) % 2 ? "rotate(1.5deg) translateY(-1px)" : "rotate(-1.5deg)");
        tick++;
      };
      pose();
      bubbleTimer = window.setInterval(pose, 65);
    };
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
      speak(false);
    };
    const run = (steps: readonly Step[], done: () => void, onStep?: (i: number) => void) => {
      let i = 0;
      const next = () => {
        if (i >= steps.length) return done();
        onStep?.(i);
        const [frame, ms, puff] = steps[i++];
        draw(frame, puff);
        stepTimer = window.setTimeout(next, ms * SPEED);
      };
      next();
    };
    const exit = () => {
      if (state !== "playing") return;
      window.clearTimeout(stepTimer);
      state = "leaving";
      speak(false);
      popOut();
      run(leave, () => {
        clear();
        state = "off";
        lastExit = lastExitAnywhere = performance.now();
        if (onStage === me) onStage = null;
      });
    };
    const enter = () => {
      if (!inView || state !== "off") return;
      const now = performance.now();
      if (now - lastExit < COOLDOWN) return;
      if (!ready || onStage || now - lastExitAnywhere < BREATHER) {
        waitTimer = window.setTimeout(enter, 300);
        return;
      }
      onStage = me;
      state = "playing";
      popIn();
      const talk = (i: number) => {
        if (sayAt) speak(i >= sayAt[0] && i < sayAt[1]);
      };
      if (!stay || rest === undefined || !idle) return run(play, exit, talk);
      // Play up to the resting pose, idle there until the page moves, then finish the act.
      const from = window.scrollY;
      let resting = false;
      let moved = false;
      const finish = () => run(play.slice(rest), exit, (i) => talk(i + rest));
      onScroll = () => {
        if (moved || Math.abs(window.scrollY - from) < 24) return;
        moved = true;
        window.removeEventListener("scroll", onScroll);
        // Already resting: leave right away instead of waiting out the pose.
        if (resting && state === "playing") {
          window.clearTimeout(stepTimer);
          finish();
        }
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      const loop = () => {
        if (state !== "playing") return;
        resting = true;
        if (moved) return finish();
        run(idle, loop);
      };
      run(play.slice(0, rest), loop, talk);
    };
    dismiss.current = exit;

    // Fetch the drawings only once she is close to the screen.
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
    near.observe(el);

    // She starts once most of her spot is on screen. After that the act always plays
    // through, even if the visitor keeps scrolling, so it is never cut short.
    const stage = new IntersectionObserver(
      ([entry]) => {
        inView = entry.intersectionRatio >= 0.75;
        window.clearTimeout(waitTimer);
        // Fully off screen: stop quietly and free the stage for the next cameo.
        if (!entry.isIntersecting && state !== "off") {
          window.clearTimeout(stepTimer);
          clear();
          state = "off";
          lastExit = lastExitAnywhere = performance.now();
          if (onStage === me) onStage = null;
        }
        // A short pause so a fast scroll past does not set her off, and a longer one on a
        // fresh page so it has settled first.
        if (inView) waitTimer = window.setTimeout(enter, Math.max(200, wait - (performance.now() - mounted)));
      },
      { threshold: [0, 0.75] },
    );
    stage.observe(el);

    return () => {
      near.disconnect();
      stage.disconnect();
      window.clearTimeout(stepTimer);
      window.clearTimeout(waitTimer);
      window.clearInterval(bubbleTimer);
      window.removeEventListener("scroll", onScroll);
      clear();
      if (onStage === me) onStage = null;
    };
  }, [act, sheet, wait, stay]);

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
      className={`pointer-events-none absolute z-10 select-none ${SIZE[anchor]} ${PLACE[anchor][side]}`}
      style={{ aspectRatio: `${sheet.w} / ${sheet.h}` }}
    >
      <div className={`absolute inset-0 ${TURN[anchor][side]}`}>
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
      {say && BUBBLE[anchor] && (
        <p
          ref={bubble}
          className={`absolute rounded-full border-2 border-ink bg-bone px-3 pt-1.5 pb-1 font-display text-[clamp(0.95rem,4vw,1.2rem)] leading-none tracking-wide whitespace-nowrap text-ink ${BUBBLE[anchor]} ${
            side === "right" ? "origin-[100%_80%]" : "origin-[0%_80%]"
          } ${side === "right" ? BUBBLE_X[anchor].right : BUBBLE_X[anchor].left}`}
          style={{ display: "none" }}
        >
          {say}
          <span
            className={`absolute top-[52%] size-2.5 border-2 border-b-0 border-l-0 border-ink bg-bone ${
              side === "right" ? "-right-[0.4rem] rotate-45" : "-left-[0.4rem] -rotate-[135deg]"
            }`}
          />
        </p>
      )}
    </div>
  );
}
