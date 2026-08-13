"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

const PEOPLE = {
  sarah: { name: "Sarah", initials: "S", color: "bg-coral" },
  alex: { name: "Alex", initials: "A", color: "bg-amber" },
  you: { name: "You", initials: "Y", color: "bg-cobalt" },
};

const SCRIPT = [
  { from: "sarah", text: "omw, 5 mins 🚶‍♀️", time: "2:41 PM" },
  { from: "you", text: "no rush, grabbing seats", time: "2:41 PM" },
  { typing: "alex" },
  { from: "alex", text: "can I bring Jordan too?", time: "2:42 PM" },
  { from: "you", text: "yesss the more the merrier", time: "2:43 PM" },
];

const Avatar = ({ id, size = "h-7 w-7", ring = true }) => {
  const p = PEOPLE[id];
  return (
    <div
      className={`relative grid ${size} shrink-0 place-items-center rounded-full ${p.color} font-display text-[11px] font-bold text-paper ${
        ring ? "ring-2 ring-white" : ""
      }`}
    >
      {p.initials}
    </div>
  );
};

const TypingDots = () => (
  <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-paper-deep px-3 py-2.5">
    {[0, 1, 2].map((i) => (
      <motion.span
        key={i}
        className="h-1.5 w-1.5 rounded-full bg-ink-soft"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
      />
    ))}
  </div>
);

const ChatMockup = () => {
  const [visible, setVisible] = useState([]);
  const [typingUser, setTypingUser] = useState(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) {
      setVisible(SCRIPT.filter((s) => s.text));
      return;
    }

    let i = 0;
    let alive = true;
    const timeouts = [];

    const step = () => {
      if (!alive) return;
      if (i >= SCRIPT.length) {
        timeouts.push(
          setTimeout(() => {
            if (!alive) return;
            setVisible([]);
            setTypingUser(null);
            i = 0;
            step();
          }, 2400),
        );
        return;
      }
      const item = SCRIPT[i];
      if (item.typing) {
        setTypingUser(item.typing);
        timeouts.push(
          setTimeout(() => {
            setTypingUser(null);
            i++;
            step();
          }, 1100),
        );
      } else {
        setVisible((v) => [...v, item]);
        i++;
        timeouts.push(setTimeout(step, 1300));
      }
    };

    step();
    return () => {
      alive = false;
      timeouts.forEach(clearTimeout);
    };
  }, [reduce]);

  return (
    <div className="relative mx-auto w-full max-w-md lg:mx-0">
      {/* Floating badge: friend request */}
      <motion.div
        initial={{ opacity: 0, y: -12, rotate: -6 }}
        animate={{ opacity: 1, y: [0, -6, 0], rotate: -6 }}
        transition={{
          opacity: { duration: 0.5, delay: 0.6 },
          y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 },
        }}
        className="absolute -left-4 -top-6 z-10 hidden w-44 rounded-xl border-2 border-ink bg-white p-3 shadow-hard sm:block"
      >
        <div className="flex items-center gap-2">
          <Avatar id="alex" size="h-8 w-8" ring={false} />
          <p className="font-body text-xs leading-tight text-ink">
            <span className="font-semibold">Alex</span> added you as a friend
          </p>
        </div>
        <button className="mt-2 w-full rounded-md border-2 border-ink bg-amber px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-wide text-ink">
          Accept
        </button>
      </motion.div>

      {/* Floating badge: group created */}
      <motion.div
        initial={{ opacity: 0, y: 12, rotate: 4 }}
        animate={{ opacity: 1, y: [0, 6, 0], rotate: 4 }}
        transition={{
          opacity: { duration: 0.5, delay: 1 },
          y: { duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1.4 },
        }}
        className="absolute -bottom-8 -right-4 z-10 hidden w-48 rounded-xl border-2 border-ink bg-coral-soft p-3 shadow-hard sm:block"
      >
        <p className="font-mono text-[10px] uppercase tracking-wide text-ink-soft">
          Group created
        </p>
        <p className="mt-0.5 font-display text-sm font-semibold text-ink">
          Weekend Trip
        </p>
        <div className="mt-2 flex -space-x-2">
          <Avatar id="sarah" size="h-6 w-6" />
          <Avatar id="alex" size="h-6 w-6" />
          <Avatar id="you" size="h-6 w-6" />
        </div>
      </motion.div>

      {/* Chat window */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-0 overflow-hidden rounded-2xl border-2 border-ink bg-white shadow-hard-lg"
      >
        {/* Header */}
        <div className="flex items-center gap-3 border-b-2 border-ink/10 px-4 py-3.5">
          <div className="flex -space-x-2.5">
            <Avatar id="sarah" />
            <Avatar id="alex" />
            <Avatar id="you" />
          </div>
          <div className="min-w-0">
            <p className="truncate font-display text-sm font-semibold text-ink">
              Weekend Trip
            </p>
            <p className="flex items-center gap-1.5 font-mono text-[11px] text-ink-soft">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cobalt opacity-70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cobalt" />
              </span>
              3 online
            </p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex h-72 flex-col justify-end gap-2.5 overflow-hidden px-4 py-4">
          <AnimatePresence initial={false}>
            {visible.map((m, idx) => {
              const mine = m.from === "you";
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.28, ease: "easeOut" }}
                  className={`flex items-end gap-2 ${
                    mine ? "flex-row-reverse" : ""
                  }`}
                >
                  {!mine && <Avatar id={m.from} size="h-6 w-6" ring={false} />}
                  <div className={`max-w-[75%] ${mine ? "items-end" : ""}`}>
                    <div
                      className={`rounded-2xl px-3.5 py-2 text-sm ${
                        mine
                          ? "rounded-br-sm bg-cobalt text-paper"
                          : "rounded-bl-sm border border-ink/5 bg-paper-deep text-ink"
                      }`}
                    >
                      {m.text}
                    </div>
                    <p
                      className={`mt-1 font-mono text-[10px] text-ink-soft/70 ${
                        mine ? "text-right" : ""
                      }`}
                    >
                      {m.time}
                    </p>
                  </div>
                </motion.div>
              );
            })}
            {typingUser && (
              <motion.div
                key="typing"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-end gap-2"
              >
                <Avatar id={typingUser} size="h-6 w-6" ring={false} />
                <TypingDots />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input */}
        <div className="flex items-center gap-2 border-t-2 border-ink/10 px-3 py-3">
          <div className="flex-1 rounded-full border border-ink/10 bg-paper px-4 py-2 font-body text-sm text-ink-soft">
            Message Weekend Trip…
          </div>
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 border-ink bg-coral text-paper">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ChatMockup;
