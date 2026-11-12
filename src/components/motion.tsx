"use client";
import { useEffect, useRef, type ReactNode, type CSSProperties, type RefObject } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
  useMotionTemplate,
} from "motion/react";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Headline whose words rise out of a clipped line, one after another, when scrolled into view.
 * The observer sits on the unclipped heading: a word hidden by overflow reports zero
 * intersection and would never fire on its own.
 */
export function Headline({
  text,
  as: Tag = "h2",
  className = "",
  delay = 0,
  stagger = 0.06,
  amount = 0.5,
}: {
  text: string;
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  delay?: number;
  stagger?: number;
  amount?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, amount });
  const show = inView || !!reduce;
  const words = text.split(" ");
  return (
    <Tag ref={ref as never} className={`flex flex-wrap gap-x-[0.24em] ${className}`} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.08em] -mb-[0.08em]" aria-hidden>
          <motion.span
            className="inline-block"
            initial={reduce ? false : { transform: "translate3d(0, 112%, 0)" }}
            animate={{ transform: show ? "translate3d(0, 0, 0)" : "translate3d(0, 112%, 0)" }}
            transition={{ duration: 0.85, delay: delay + i * stagger, ease: EASE }}
          >
            {w}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

type RevealVariant = "fade" | "clip" | "scale" | "left";
type RevealTag = "div" | "li" | "section" | "p" | "h2" | "h3" | "span";

const variants: Record<RevealVariant, { from: Record<string, string | number>; to: Record<string, string | number> }> = {
  fade: { from: { opacity: 0, transform: "translate3d(0, 22px, 0)" }, to: { opacity: 1, transform: "translate3d(0, 0, 0)" } },
  clip: {
    from: { clipPath: "inset(0 0 100% 0)", transform: "translate3d(0, 28px, 0)" },
    to: { clipPath: "inset(0 0 0% 0)", transform: "translate3d(0, 0, 0)" },
  },
  scale: { from: { opacity: 0, transform: "scale(0.94)" }, to: { opacity: 1, transform: "scale(1)" } },
  left: { from: { opacity: 0, transform: "translate3d(-28px, 0, 0)" }, to: { opacity: 1, transform: "translate3d(0, 0, 0)" } },
};

type AnyRef = RefObject<HTMLDivElement & HTMLLIElement & HTMLParagraphElement & HTMLHeadingElement & HTMLSpanElement>;

function Outer({ as, r, className, style, children }: { as: RevealTag; r: AnyRef; className?: string; style?: CSSProperties; children: ReactNode }) {
  switch (as) {
    case "li":
      return <li ref={r} className={className} style={style}>{children}</li>;
    case "section":
      return <section ref={r} className={className} style={style}>{children}</section>;
    case "p":
      return <p ref={r} className={className} style={style}>{children}</p>;
    case "h2":
      return <h2 ref={r} className={className} style={style}>{children}</h2>;
    case "h3":
      return <h3 ref={r} className={className} style={style}>{children}</h3>;
    case "span":
      return <span ref={r} className={className} style={style}>{children}</span>;
    default:
      return <div ref={r} className={className} style={style}>{children}</div>;
  }
}

export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
  variant = "fade",
  duration = 0.8,
  amount = 0.3,
  style,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: RevealTag;
  variant?: RevealVariant;
  duration?: number;
  amount?: number;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  // Opacity does not affect intersection, but clip-path does, so the clip variant
  // observes an unclipped outer element and clips an inner box.
  const inView = useInView(ref, { once: true, amount, margin: "0px 0px -60px 0px" });
  const show = inView || !!reduce;
  const v = variants[variant];
  const transition = { duration, delay, ease: EASE };

  if (variant === "clip") {
    return (
      <Outer as={as} r={ref as AnyRef} className={className} style={style}>
        <motion.div initial={reduce ? false : v.from} animate={show ? v.to : v.from} transition={transition}>
          {children}
        </motion.div>
      </Outer>
    );
  }
  const Tag = motion[as];
  return (
    <Tag
      ref={ref as never}
      className={className}
      style={style}
      initial={reduce ? false : v.from}
      animate={show ? v.to : v.from}
      transition={transition}
    >
      {children}
    </Tag>
  );
}

/** Moves children vertically as the section scrolls through the viewport. Range is in px. */
export function Parallax({
  children,
  range = [-40, 40],
  scale,
  className = "",
  style,
}: {
  children: ReactNode;
  range?: [number, number];
  scale?: [number, number];
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : range);
  const s = useTransform(scrollYProgress, [0, 1], reduce || !scale ? [1, 1] : scale);
  const t = useMotionTemplate`translate3d(0, ${y}px, 0) scale(${s})`;
  return (
    <motion.div ref={ref} className={className} style={{ ...style, transform: t }}>
      {children}
    </motion.div>
  );
}

/** Counts up from 0 when it enters the viewport. */
export function Counter({ value, className = "", duration = 1.4 }: { value: number; className?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduce = useReducedMotion();
  const mv = useMotionValue(reduce ? value : 0);
  const rounded = useTransform(mv, (v) => Math.round(v).toString());
  useEffect(() => {
    if (!inView || reduce) return;
    const c = animate(mv, value, { duration, ease: EASE });
    return () => c.stop();
  }, [inView, reduce, value, duration, mv]);
  return (
    <motion.span ref={ref} className={className}>
      {rounded}
    </motion.span>
  );
}
