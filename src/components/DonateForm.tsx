"use client";
import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { LockSimpleIcon } from "@phosphor-icons/react/dist/ssr";
import { donate, site } from "@/lib/content";

type Freq = "once" | "monthly";

export function DonateForm() {
  const [freq, setFreq] = useState<Freq>("once");
  const [amount, setAmount] = useState<number>(donate.tiers[2].amount);
  const [other, setOther] = useState("");
  const [email, setEmail] = useState("");
  const reduce = useReducedMotion();

  const otherNum = Number(other);
  const chosen = other && otherNum > 0 ? otherNum : amount;

  const mailto = `mailto:${site.email}?subject=${encodeURIComponent(`Donation pledge: $${chosen} ${freq === "monthly" ? "monthly" : "one time"}`)}&body=${encodeURIComponent(
    `I would like to give $${chosen} ${freq === "monthly" ? "per month" : "one time"} once online giving opens.\n\nEmail: ${email}`,
  )}`;

  return (
    <form
      className="rounded-3xl bg-bone p-6 text-espresso shadow-[0_30px_80px_-30px_rgba(23,18,16,0.6)] ring-1 ring-espresso/10 md:p-8"
      onSubmit={(e) => {
        e.preventDefault();
        window.location.href = mailto;
      }}
    >
      <div role="radiogroup" aria-label="Frequency" className="relative grid grid-cols-2 rounded-full bg-sand p-1">
        {(["once", "monthly"] as Freq[]).map((f) => (
          <button
            key={f}
            type="button"
            role="radio"
            aria-checked={freq === f}
            onClick={() => setFreq(f)}
            className={`relative z-10 rounded-full px-4 py-2.5 text-sm font-bold transition-colors duration-200 ${freq === f ? "text-sand-light" : "text-bark"}`}
          >
            {freq === f && (
              <motion.span
                layoutId="freq-pill"
                className="absolute inset-0 -z-10 rounded-full bg-espresso"
                transition={reduce ? { duration: 0 } : { type: "spring", duration: 0.45, bounce: 0.15 }}
              />
            )}
            {f === "once" ? "One-time" : "Monthly"}
          </button>
        ))}
      </div>

      <p className="mt-6 text-xs font-bold uppercase tracking-[0.14em] text-bark/70">Choose an amount</p>
      <ul className="mt-3 flex flex-col gap-2">
        {donate.tiers.map((t) => {
          const active = !other && amount === t.amount;
          return (
            <li key={t.amount}>
              <button
                type="button"
                aria-pressed={active}
                onClick={() => {
                  setAmount(t.amount);
                  setOther("");
                }}
                className={`flex w-full flex-col items-start gap-2 rounded-2xl px-5 py-3.5 text-left sm:flex-row sm:items-center sm:justify-between sm:gap-3 transition-[background-color,color,transform] duration-150 active:scale-[0.99] ${
                  active ? "bg-espresso text-sand-light" : "bg-sand/60 text-espresso hover:bg-sand"
                }`}
              >
                <span>
                  <span className="display block text-3xl leading-none">${t.amount}</span>
                  <span className={`mt-1 block text-sm ${active ? "text-sand/85" : "text-bark"}`}>{t.label}</span>
                </span>
                <span className={`max-w-full shrink-0 truncate rounded-full px-3 py-1 text-xs font-semibold ${active ? "bg-sand/15 text-sand" : "bg-espresso/8 text-bark"}`}>
                  {t.note}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <label className="mt-4 block">
        <span className="text-xs font-semibold text-bark">Other amount in US dollars</span>
        <span className="mt-1 flex items-center gap-2 rounded-2xl border border-espresso/15 bg-white/70 px-4 focus-within:border-espresso focus-within:ring-2 focus-within:ring-espresso/15">
          <span className="text-bark">$</span>
          <input
            type="number"
            min={1}
            inputMode="numeric"
            value={other}
            onChange={(e) => setOther(e.target.value)}
            placeholder="0"
            className="h-12 w-full bg-transparent text-espresso outline-none placeholder:text-bark/40"
          />
        </span>
      </label>

      <label className="mt-5 block">
        <span className="text-xs font-semibold text-bark">Email</span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="mt-1 h-12 w-full rounded-2xl border border-espresso/15 bg-white/70 px-4 text-espresso outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-bark/40 focus:border-espresso focus:ring-2 focus:ring-espresso/15"
        />
      </label>

      <button type="submit" className="btn btn-primary mt-6 h-14 w-full text-base">
        Pledge ${chosen}
        {freq === "monthly" ? " / month" : ""}
      </button>

      <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-bark/80">
        <LockSimpleIcon size={14} weight="bold" className="mt-0.5 shrink-0" />
        {donate.status}
      </p>
    </form>
  );
}
