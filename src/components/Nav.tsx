"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ListIcon, XIcon } from "@phosphor-icons/react/dist/ssr";
import { nav, site } from "@/lib/content";
import { openDonate } from "./DonateModal";
import type { ReactNode } from "react";

export function Nav({ mark }: { mark: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="nav-in fixed inset-x-0 top-4 z-40 flex justify-center px-4">
      <nav
        aria-label="Primary"
        className="flex h-14 w-full max-w-3xl items-center gap-2 rounded-full border border-espresso/10 bg-sand-light/80 pr-2 pl-4 shadow-[0_10px_40px_-20px_rgba(43,29,20,0.45)] backdrop-blur-xl"
      >
        <a href="#top" className="flex items-center gap-2 text-espresso" aria-label={`${site.name}, back to top`}>
          <span className="h-6 text-espresso">{mark}</span>
          <span className="display pt-[2px] text-xl tracking-[0.04em]">{site.name}</span>
        </a>
        <ul className="ml-auto hidden items-center gap-1 md:flex">
          {nav.map((n) => (
            <li key={n.href}>
              <a
                href={n.href}
                className="rounded-full px-3 py-2 text-sm font-semibold text-bark transition-[color,background-color] duration-150 hover:bg-espresso/6 hover:text-espresso"
              >
                {n.label}
              </a>
            </li>
          ))}
        </ul>
        <button type="button" onClick={openDonate} className="btn btn-primary ml-auto h-10 px-5 text-sm md:ml-1">
          Donate
        </button>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label="Menu"
          className="grid size-10 place-items-center rounded-full text-espresso transition-[background-color,transform] duration-150 hover:bg-espresso/6 active:scale-95 md:hidden"
        >
          {open ? <XIcon size={20} weight="bold" /> : <ListIcon size={20} weight="bold" />}
        </button>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="absolute top-16 right-4 left-4 origin-top rounded-3xl border border-espresso/10 bg-sand-light/95 p-2 shadow-[0_20px_60px_-20px_rgba(43,29,20,0.5)] backdrop-blur-xl md:hidden"
            initial={{ opacity: 0, transform: "scale(0.97) translate3d(0,-6px,0)" }}
            animate={{ opacity: 1, transform: "scale(1) translate3d(0,0,0)" }}
            exit={{ opacity: 0, transform: "scale(0.98) translate3d(0,-4px,0)" }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          >
            <ul className="flex flex-col">
              {nav.map((n) => (
                <li key={n.href}>
                  <a
                    href={n.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-2xl px-4 py-3 text-base font-semibold text-espresso active:bg-espresso/6"
                  >
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
