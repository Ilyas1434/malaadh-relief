"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";

type Node = { y: number; label: string };
type Geom = { h: number; d: string; nodes: Node[] };

const X = 44; // line x inside the gutter column
const WOBBLE = 16;

function buildPath(nodes: Node[], h: number) {
  if (nodes.length === 0) return "";
  const pts = [{ x: X, y: 0 }, ...nodes.map((n, i) => ({ x: X + (i % 2 === 0 ? -WOBBLE : WOBBLE), y: n.y })), { x: X, y: h }];
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1];
    const b = pts[i];
    const dy = (b.y - a.y) * 0.5;
    d += ` C ${a.x} ${a.y + dy}, ${b.x} ${b.y - dy}, ${b.x} ${b.y}`;
  }
  return d;
}

/**
 * A route line drawn down the left gutter as the visitor scrolls, with a waypoint
 * for each section that declares data-route-label. The head dot rides the path.
 */
export function ScrollRoute() {
  const pathRef = useRef<SVGPathElement>(null);
  const headRef = useRef<SVGGElement>(null);
  const [geom, setGeom] = useState<Geom | null>(null);
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();

  useEffect(() => {
    const main = document.querySelector<HTMLElement>("main[data-route-root]");
    if (!main) return;
    let frame = 0;
    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const top = main.getBoundingClientRect().top + window.scrollY;
        const h = main.offsetHeight;
        const nodes = Array.from(main.querySelectorAll<HTMLElement>("[data-route-label]")).map((el) => {
          const r = el.getBoundingClientRect();
          const sectionTop = r.top + window.scrollY - top;
          return { y: sectionTop + Math.min(180, r.height * 0.35), label: el.dataset.routeLabel ?? "" };
        });
        setGeom({ h, d: buildPath(nodes, h), nodes });
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(main);
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      cancelAnimationFrame(frame);
    };
  }, []);

  // Fraction of the route drawn: the head sits a little above the middle of the viewport.
  const progress = useTransform(scrollY, (y) => {
    if (!geom) return 0;
    const head = y + window.innerHeight * 0.45;
    return Math.min(1, Math.max(0, head / geom.h));
  });

  useMotionValueEvent(progress, "change", (p) => {
    const path = pathRef.current;
    const head = headRef.current;
    if (!path || !head || !geom) return;
    const len = path.getTotalLength();
    const pt = path.getPointAtLength(len * p);
    head.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
    const y = p * geom.h;
    let n = 0;
    for (let i = 0; i < geom.nodes.length; i++) if (geom.nodes[i].y <= y + 8) n = i + 1;
    if (n !== active) setActive(n);
  });

  if (!geom) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute top-0 left-0 hidden w-[160px] xl:block"
      style={{ height: geom.h }}
    >
      <svg width="160" height={geom.h} viewBox={`0 0 160 ${geom.h}`} className="block overflow-visible text-clay">
        {/* faint full route */}
        <path d={geom.d} fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 7" strokeLinecap="round" opacity="0.35" />
        {/* drawn route */}
        <motion.path
          ref={pathRef}
          d={geom.d}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          style={{ pathLength: reduce ? 1 : progress }}
        />
        {geom.nodes.map((n, i) => {
          const x = X + (i % 2 === 0 ? -WOBBLE : WOBBLE);
          const on = reduce || i < active;
          return (
            <g key={n.label + i} transform={`translate(${x} ${n.y})`}>
              <circle
                r="9"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                opacity={on ? 1 : 0.4}
                style={{ transition: "opacity 300ms ease" }}
              />
              <circle
                r="4"
                fill="currentColor"
                style={{
                  transform: on ? "scale(1)" : "scale(0)",
                  transformOrigin: "center",
                  transformBox: "fill-box",
                  transition: "transform 400ms var(--ease-out-strong)",
                }}
              />
              <text
                x={x < X ? 20 : 20}
                y="4"
                fontSize="11"
                fontWeight="700"
                letterSpacing="0.14em"
                fill="currentColor"
                opacity={on ? 1 : 0.5}
                className="hidden uppercase min-[1400px]:block"
                style={{ transition: "opacity 300ms ease", fontFamily: "var(--font-sans)" }}
              >
                {n.label}
              </text>
            </g>
          );
        })}
        {/* head */}
        <g ref={headRef} transform={`translate(${X} 0)`}>
          <circle r="14" fill="currentColor" opacity="0.18">
            {!reduce && <animate attributeName="r" values="10;16;10" dur="2.4s" repeatCount="indefinite" />}
          </circle>
          <circle r="5" fill="currentColor" />
        </g>
      </svg>
    </div>
  );
}
