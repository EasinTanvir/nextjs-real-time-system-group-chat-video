"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { statusOptions, presenceFriends } from "@/data/home";

export default function StatusSwitcher() {
  const [active, setActive] = useState("online");
  const current = statusOptions.find((s) => s.key === active);

  return (
    <div className="rounded-[26px] border border-ink/8 bg-white p-6 shadow-[0_24px_60px_rgba(20,22,27,.08)] sm:p-8">
      <div className="flex flex-wrap gap-2">
        {statusOptions.map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => setActive(s.key)}
            className="relative rounded-full px-4 py-2 text-[11px] font-bold transition"
            style={{ color: active === s.key ? "#fff" : "var(--color-ink)" }}
          >
            {active === s.key && (
              <motion.span
                layoutId="status-pill"
                className="absolute inset-0 rounded-full"
                style={{ backgroundColor: s.color }}
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <span className="relative flex items-center gap-1.5">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: active === s.key ? "#fff" : s.color }}
              />
              {s.label}
            </span>
          </button>
        ))}
      </div>

      <p className="mt-4 min-h-[20px] text-[13px] text-ink-soft">
        {current.note}
      </p>

      <div className="mt-6 space-y-3 border-t border-ink/6 pt-5">
        <p className="font-mono text-[9px] font-medium uppercase tracking-[.08em] text-ink-soft">
          Your friends see
        </p>
        {presenceFriends.map((f) => (
          <div key={f.name} className="flex items-center gap-2.5">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-paper-deep text-[9px] font-bold text-ink">
              {f.initials}
            </span>
            <span className="text-[11.5px] font-medium text-ink">{f.name}</span>
            <span className="ml-auto flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[.05em] text-ink-soft">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{
                  backgroundColor:
                    f.status === "online"
                      ? "var(--color-coral)"
                      : f.status === "away"
                        ? "var(--color-amber)"
                        : "var(--color-ink-soft)",
                }}
              />
              {f.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
