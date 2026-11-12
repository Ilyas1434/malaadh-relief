"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { XIcon, EnvelopeSimpleIcon } from "@phosphor-icons/react/dist/ssr";
import { donate, site } from "@/lib/content";

const EVENT = "malaadh:open-donate";
export function openDonate() {
  window.dispatchEvent(new Event(EVENT));
}

export function DonateModal() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const reduce = useReducedMotion();
  const first = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const on = () => setOpen(true);
    window.addEventListener(EVENT, on);
    return () => window.removeEventListener(EVENT, on);
  }, []);

  useEffect(() => {
    if (!open) return;
    const key = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", key);
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => first.current?.focus(), 50);
    return () => {
      document.removeEventListener("keydown", key);
      document.body.style.overflow = "";
      clearTimeout(t);
    };
  }, [open]);

  const mailto = `mailto:${site.email}?subject=${encodeURIComponent("Tell me when donations open")}&body=${encodeURIComponent(
    `Please let me know when Malaadh Relief starts accepting donations.\n\nEmail: ${email}`,
  )}`;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="donate"
          className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            type="button"
            aria-label="Close"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="donate-title"
            className="relative w-full max-w-md rounded-3xl bg-sand-light p-7 text-espresso shadow-[0_30px_80px_-20px_rgba(43,29,20,0.5)] sm:p-8"
            initial={reduce ? { opacity: 0 } : { opacity: 0, transform: "translate3d(0, 24px, 0) scale(0.96)" }}
            animate={{ opacity: 1, transform: "translate3d(0, 0, 0) scale(1)" }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, transform: "translate3d(0, 12px, 0) scale(0.98)" }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute top-4 right-4 grid size-9 place-items-center rounded-full text-bark transition-[background-color,transform] duration-150 hover:bg-espresso/8 active:scale-95"
            >
              <XIcon size={18} weight="bold" />
            </button>
            <p className="font-arabic text-3xl text-clay" aria-hidden>
              {site.arabic}
            </p>
            <h2 id="donate-title" className="display mt-2 text-4xl">
              {donate.modalTitle}
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-bark">{donate.modalBody}</p>
            <form
              className="mt-6 flex flex-col gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                window.location.href = mailto;
              }}
            >
              <label htmlFor="donate-email" className="text-xs font-semibold uppercase tracking-[0.12em] text-bark">
                Email
              </label>
              <div className="flex gap-2">
                <input
                  ref={first}
                  id="donate-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="h-12 flex-1 rounded-full border border-bark/25 bg-white/60 px-4 text-[15px] text-espresso outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-bark/50 focus:border-espresso focus:ring-2 focus:ring-espresso/15"
                />
                <button type="submit" className="btn btn-primary px-5" aria-label="Notify me">
                  <EnvelopeSimpleIcon size={18} weight="bold" />
                  <span className="hidden sm:inline">Notify me</span>
                </button>
              </div>
              <p className="mt-1 text-xs text-bark/70">Opens your email app. No list, no spam.</p>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
