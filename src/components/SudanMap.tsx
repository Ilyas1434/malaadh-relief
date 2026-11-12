"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";

const OUTLINE =
  "M427.0,476.4 L420.8,476.4 L420.2,475.0 L420.3,471.0 L420.9,468.0 L423.2,463.3 L422.6,460.7 L423.0,456.9 L421.3,452.7 L406.6,440.6 L403.7,437.2 L395.8,434.2 L397.2,430.8 L393.9,405.9 L395.5,403.0 L396.0,394.9 L397.9,388.5 L398.1,385.8 L382.4,385.6 L382.2,388.4 L382.9,392.6 L361.0,392.7 L369.8,402.5 L370.1,406.7 L369.8,415.5 L370.3,417.7 L372.6,422.1 L372.5,422.9 L371.9,423.9 L356.4,436.9 L353.8,443.0 L347.3,451.4 L333.1,465.3 L330.8,466.2 L320.1,466.7 L317.7,467.6 L308.5,459.4 L293.0,449.6 L279.9,456.6 L279.8,461.3 L278.3,463.7 L275.5,466.3 L267.9,468.0 L264.0,469.4 L259.3,472.1 L254.7,476.5 L254.4,478.8 L254.8,480.9 L228.7,480.8 L227.0,479.1 L223.2,471.8 L220.5,472.3 L196.6,471.4 L193.2,472.2 L186.4,475.2 L183.0,475.7 L179.4,474.3 L166.9,459.8 L164.2,458.1 L161.3,454.7 L158.6,453.1 L157.7,452.0 L157.5,447.3 L156.6,445.3 L154.7,444.9 L137.8,448.2 L135.4,447.9 L130.6,449.1 L129.2,451.0 L128.5,456.9 L127.2,459.1 L122.4,464.0 L121.3,466.1 L121.3,474.3 L117.7,478.8 L116.8,485.7 L113.6,491.4 L113.0,495.3 L105.4,497.7 L102.5,499.2 L100.4,502.6 L93.0,501.2 L85.0,500.4 L81.8,499.3 L80.3,497.7 L80.8,493.5 L78.7,491.8 L77.9,490.0 L78.0,487.8 L82.2,483.0 L83.1,480.4 L84.2,468.2 L83.9,464.5 L80.6,457.7 L72.9,446.0 L61.5,434.0 L58.0,428.5 L60.6,419.5 L60.8,417.0 L60.1,414.5 L57.7,412.6 L55.5,412.3 L50.8,408.9 L49.2,406.8 L48.0,403.8 L48.9,393.3 L48.3,391.9 L45.9,391.5 L45.3,390.7 L45.4,388.7 L42.6,377.7 L43.4,375.0 L41.3,371.2 L37.4,369.6 L29.8,370.8 L27.4,370.6 L25.7,369.9 L24.0,366.9 L24.5,364.5 L26.7,360.0 L29.4,356.3 L34.9,353.0 L37.2,349.2 L37.4,346.9 L36.4,342.4 L33.3,336.0 L33.2,333.7 L34.0,332.1 L35.4,330.1 L38.4,327.9 L46.5,323.0 L47.5,321.8 L47.1,320.5 L44.5,317.8 L43.7,312.7 L42.3,309.1 L45.1,306.3 L50.5,304.5 L51.8,303.4 L52.1,299.2 L54.8,294.3 L60.4,288.9 L61.6,284.0 L60.5,276.7 L62.9,273.7 L66.1,271.2 L77.7,270.8 L82.5,269.7 L85.9,269.8 L93.7,271.1 L94.6,270.5 L95.0,268.6 L94.9,130.0 L127.7,129.7 L127.8,64.2 L332.6,64.2 L334.3,64.0 L337.5,57.9 L338.9,57.4 L341.0,57.8 L341.7,59.2 L340.0,64.2 L518.8,64.2 L519.2,71.7 L520.7,77.7 L525.7,86.2 L530.0,90.8 L531.6,93.4 L531.5,95.6 L530.2,94.4 L528.0,93.5 L527.7,97.5 L528.7,105.8 L530.6,111.5 L529.2,116.8 L529.4,125.9 L531.7,136.7 L531.2,143.6 L535.0,159.7 L538.6,168.6 L540.6,170.8 L542.8,172.0 L547.1,172.8 L553.4,177.3 L558.4,182.1 L562.6,187.4 L565.3,186.2 L566.9,188.4 L574.8,193.2 L576.0,195.4 L573.2,197.6 L569.8,201.4 L568.2,204.9 L564.7,208.2 L564.3,209.3 L559.2,211.2 L556.8,210.8 L554.3,211.5 L551.4,213.0 L548.8,213.4 L544.7,216.4 L541.1,217.8 L539.8,219.0 L538.0,224.9 L536.6,226.5 L528.6,227.1 L523.4,226.6 L522.3,232.9 L522.4,235.1 L519.4,240.8 L520.2,251.6 L516.9,261.6 L512.5,270.4 L507.3,286.0 L504.2,289.9 L507.4,318.7 L504.8,327.5 L504.9,332.4 L503.0,339.5 L497.2,351.1 L495.4,357.0 L494.3,368.0 L493.7,369.0 L484.3,370.4 L481.3,371.2 L479.3,372.4 L476.9,375.3 L465.6,394.4 L461.0,399.0 L460.0,401.2 L456.0,416.7 L456.3,420.5 L454.8,427.1 L455.0,430.3 L451.2,433.7 L449.8,434.2 L443.2,429.8 L438.6,432.8 L435.7,437.1 L433.5,441.3 L434.6,452.4 L429.6,463.5 L428.4,467.6 Z";

const VIEW_W = 600;
const VIEW_H = 560;

// Port Sudan -> Atbara, bowing slightly south of the straight line.
const ROUTE = "M530.3 142.3 Q488 193 423.7 205.5";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Timeline (seconds): outline 0 to 1.6, route 1.2 to 2.1, dots as the route reaches them.
const T_ROUTE_DELAY = 1.2;
const T_ROUTE_DUR = 0.9;
const T_ROUTE_END = T_ROUTE_DELAY + T_ROUTE_DUR;

type CityId = "port-sudan" | "atbara" | "khartoum";

type City = {
  id: CityId;
  name: string;
  detail: string;
  x: number;
  y: number;
  label: { x: number; y: number; anchor: "start" | "end" };
  delay: number;
};

const CITIES: City[] = [
  {
    id: "port-sudan",
    name: "Port Sudan",
    detail:
      "Where we landed. Khartoum's airport is closed, so flights come in here on the Red Sea coast.",
    x: 530.3,
    y: 142.3,
    label: { x: 518.3, y: 134.3, anchor: "end" },
    delay: T_ROUTE_DELAY,
  },
  {
    id: "atbara",
    name: "Atbara",
    detail: "Base of operations. A quieter city on the Nile where the aid was delivered.",
    x: 423.7,
    y: 205.5,
    label: { x: 439.7, y: 210.5, anchor: "start" },
    delay: T_ROUTE_END - 0.05,
  },
  {
    id: "khartoum",
    name: "Khartoum",
    detail: "The capital, under active conflict. We stayed clear.",
    x: 376.1,
    y: 276.2,
    label: { x: 388.1, y: 281.2, anchor: "start" },
    delay: T_ROUTE_END - 0.05 + 0.12,
  },
];

const pct = (v: number, total: number) => `${((v / total) * 100).toFixed(2)}%`;

export function SudanMap({ className }: { className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { once: true, amount: 0.4 });
  const reduce = useReducedMotion() ?? false;
  const show = reduce || inView;

  // Hover/focus state and tap-pinned state. The tooltip shows pinned first, then hovered.
  const [active, setActive] = useState<CityId | null>(null);
  const [pinned, setPinned] = useState<CityId | null>(null);
  const openId = pinned ?? active;
  const openCity = openId ? CITIES.find((c) => c.id === openId) ?? null : null;

  // Parallax tilt. Pointer position lives in motion values, never in React state.
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const rotateX = useSpring(tiltX, { stiffness: 120, damping: 18, mass: 0.6 });
  const rotateY = useSpring(tiltY, { stiffness: 120, damping: 18, mass: 0.6 });
  const tiltEnabled = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => {
      tiltEnabled.current = mq.matches;
    };
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (reduce || !tiltEnabled.current || e.pointerType === "touch") return;
      const rect = e.currentTarget.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      tiltY.set(nx * 6); // -3deg .. 3deg
      tiltX.set(-ny * 6);
    },
    [reduce, tiltX, tiltY]
  );

  const resetTilt = useCallback(() => {
    tiltX.set(0);
    tiltY.set(0);
  }, [tiltX, tiltY]);

  // Tap or click outside any city closes a pinned tooltip. Escape closes everything.
  useEffect(() => {
    if (pinned === null) return;
    const onDown = (e: PointerEvent) => {
      const target = e.target as Element | null;
      if (target?.closest?.("[data-city]")) return;
      setPinned(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPinned(null);
        setActive(null);
      }
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [pinned]);

  const drawTransition = (delay: number, duration: number) =>
    reduce ? { duration: 0 } : { delay, duration, ease: EASE };

  return (
    <div
      ref={rootRef}
      className={["relative", className].filter(Boolean).join(" ")}
      onPointerMove={onPointerMove}
      onPointerLeave={resetTilt}
      style={{ perspective: 900 }}
    >
      <motion.div
        className="relative"
        style={{ rotateX, rotateY, willChange: "transform" }}
      >
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          className="block h-auto w-full overflow-visible"
          role="img"
          aria-labelledby="sudanmap-title"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title id="sudanmap-title">Map of Sudan with the route from Port Sudan to Atbara</title>
          <defs>
            <filter id="sudanmap-sketch" x="-5%" y="-5%" width="110%" height="110%">
              <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="3" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" />
            </filter>
            {/* The dashed route is revealed through a mask that draws itself, so the
                dash-offset loop in globals.css can keep running independently. */}
            <mask id="sudanmap-route-mask" maskUnits="userSpaceOnUse" x="0" y="0" width={VIEW_W} height={VIEW_H}>
              <motion.path
                d={ROUTE}
                fill="none"
                stroke="#fff"
                strokeWidth={8}
                strokeLinecap="round"
                initial={reduce ? false : { pathLength: 0 }}
                animate={{ pathLength: show ? 1 : 0 }}
                transition={drawTransition(T_ROUTE_DELAY, T_ROUTE_DUR)}
              />
            </mask>
          </defs>

          {/* Country outline, hand-drawn via displacement, draws itself on first view. */}
          <motion.path
            d={OUTLINE}
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinejoin="round"
            strokeLinecap="round"
            filter="url(#sudanmap-sketch)"
            initial={reduce ? false : { pathLength: 0, opacity: 0 }}
            animate={{ pathLength: show ? 1 : 0, opacity: show ? 1 : 0 }}
            transition={
              reduce
                ? { duration: 0 }
                : { pathLength: { duration: 1.6, ease: EASE }, opacity: { duration: 0.3 } }
            }
          />

          {/* Route Port Sudan -> Atbara */}
          <g mask="url(#sudanmap-route-mask)">
            <path
              className="map-route"
              d={ROUTE}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeDasharray="6 8"
              strokeLinecap="round"
            />
          </g>

          {/* Atbara ring: fades in once the route has arrived, then pulses via CSS. */}
          <motion.g
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: show ? 1 : 0 }}
            transition={drawTransition(T_ROUTE_END + 0.3, 0.5)}
          >
            <circle
              className="map-pulse"
              cx={423.7}
              cy={205.5}
              r={11}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            />
          </motion.g>

          {CITIES.map((city) => {
            const isOpen = openId === city.id;
            return (
              <g
                key={city.id}
                data-city={city.id}
                role="button"
                tabIndex={0}
                aria-label={`${city.name}. ${city.detail}`}
                aria-expanded={isOpen}
                aria-describedby={isOpen ? "sudanmap-tooltip" : undefined}
                style={{ cursor: "pointer", outline: "none" }}
                onPointerEnter={(e) => {
                  if (e.pointerType === "touch") return;
                  setActive(city.id);
                }}
                onPointerLeave={(e) => {
                  if (e.pointerType === "touch") return;
                  setActive((cur) => (cur === city.id ? null : cur));
                }}
                onFocus={(e) => {
                  let visible = true;
                  try {
                    visible = (e.currentTarget as Element).matches(":focus-visible");
                  } catch {
                    visible = true;
                  }
                  if (visible) setActive(city.id);
                }}
                onBlur={() => setActive((cur) => (cur === city.id ? null : cur))}
                onClick={() => setPinned((cur) => (cur === city.id ? null : city.id))}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setPinned((cur) => (cur === city.id ? null : city.id));
                  }
                }}
              >
                {/* Generous invisible hit area */}
                <circle cx={city.x} cy={city.y} r={18} fill="transparent" />

                {/* Pop-in wrapper (delayed), with a spring-scaled dot inside for hover. */}
                <motion.g
                  initial={reduce ? false : { scale: 0.6, opacity: 0 }}
                  animate={{ scale: show ? 1 : 0.6, opacity: show ? 1 : 0 }}
                  transition={
                    reduce
                      ? { duration: 0 }
                      : {
                          delay: city.delay,
                          opacity: { duration: 0.3 },
                          scale: { type: "spring", stiffness: 320, damping: 18 },
                        }
                  }
                >
                  <motion.circle
                    cx={city.x}
                    cy={city.y}
                    r={5}
                    fill="currentColor"
                    animate={{ scale: isOpen ? 1.45 : 1 }}
                    transition={
                      reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 20 }
                    }
                  />
                </motion.g>

                <motion.text
                  x={city.label.x}
                  y={city.label.y}
                  textAnchor={city.label.anchor}
                  fontSize={15}
                  fill="currentColor"
                  className="font-[inherit] select-none"
                  initial={reduce ? false : { opacity: 0 }}
                  animate={{ opacity: show ? 1 : 0 }}
                  transition={drawTransition(city.delay + 0.1, 0.4)}
                >
                  {city.name}
                </motion.text>
              </g>
            );
          })}
        </svg>

        {/* Tooltip layer: HTML so text wraps naturally. Positioned above the dot. */}
        <AnimatePresence mode="wait">
          {openCity && (
            <div
              key={openCity.id}
              className="pointer-events-none absolute z-10"
              style={{
                left: `clamp(7rem, ${pct(openCity.x, VIEW_W)}, calc(100% - 7rem))`,
                top: pct(openCity.y, VIEW_H),
                transform: "translate(-50%, calc(-100% - 16px))",
              }}
            >
              <motion.div
                id="sudanmap-tooltip"
                role="tooltip"
                className="relative w-max max-w-[14rem] rounded-xl px-3.5 py-2.5 text-left shadow-[0_8px_24px_-8px_rgba(43,29,20,0.45)]"
                style={{
                  backgroundColor: "#2b1d14",
                  color: "#efdcc4",
                  transformOrigin: "50% 100%",
                }}
                initial={reduce ? false : { opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={
                  reduce
                    ? { opacity: 0, transition: { duration: 0 } }
                    : { opacity: 0, scale: 0.98, transition: { duration: 0.1, ease: "easeIn" } }
                }
                transition={
                  reduce
                    ? { duration: 0 }
                    : { duration: 0.16, ease: EASE, opacity: { duration: 0.12 } }
                }
              >
                <p className="text-[13px] font-semibold leading-tight tracking-wide">{openCity.name}</p>
                <p className="mt-1 text-[12.5px] leading-snug opacity-85">{openCity.detail}</p>
                <span
                  aria-hidden
                  className="absolute left-1/2 top-full h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-[2px]"
                  style={{ backgroundColor: "#2b1d14" }}
                />
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
