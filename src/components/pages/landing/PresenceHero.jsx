"use client";

import { motion, useReducedMotion } from "framer-motion";
import { UserPlus, UsersRound, CheckCheck } from "lucide-react";
import { conversationDemo, friendSuggestion, groupDraft } from "@/data/home";

function Avatar({ initials, tone = "cobalt", size = "md" }) {
  const sizes = { sm: "h-7 w-7 text-[9px]", md: "h-9 w-9 text-[11px]" };
  const tones = {
    cobalt: "from-cobalt to-cobalt-deep text-white",
    coral: "from-coral to-[#E8461F] text-white",
    ink: "from-ink to-[#3A3F4B] text-white",
  };
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-full bg-gradient-to-br font-bold ${tones[tone]} ${sizes[size]}`}
    >
      {initials}
    </span>
  );
}

function PulseLine({ d, delay = 0 }) {
  return (
    <>
      <path
        d={d}
        stroke="var(--color-ink)"
        strokeOpacity="0.08"
        strokeWidth="1.5"
        fill="none"
      />
      <motion.path
        d={d}
        stroke="var(--color-coral)"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeDasharray="10 220"
        animate={{ strokeDashoffset: [0, -230] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "linear", delay }}
      />
    </>
  );
}

export default function PresenceHero() {
  const reduceMotion = useReducedMotion();
  const float = reduceMotion
    ? {}
    : {
        y: [0, -8, 0],
        transition: { duration: 5, repeat: Infinity, ease: "easeInOut" },
      };

  return (
    <div className="relative mx-auto w-full max-w-[440px] py-6 lg:py-10">
      {/* connector lines, desktop only */}
      <svg
        className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block"
        viewBox="0 0 440 460"
        fill="none"
      >
        <PulseLine d="M60,90 C 120,140 160,180 190,220" />
        <PulseLine d="M380,340 C 320,300 280,270 250,240" delay={1.1} />
      </svg>

      {/* Add friend card */}
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        {...(reduceMotion ? {} : { whileInView: undefined })}
        className="relative z-10 mb-[-28px] w-[240px] rounded-2xl border border-ink/8 bg-white p-4 shadow-[0_18px_40px_rgba(20,22,27,.1)] lg:absolute lg:left-0 lg:top-2 lg:mb-0"
      >
        <motion.div animate={float}>
          <div className="flex items-center gap-1.5 font-mono text-[9px] font-medium uppercase tracking-[.08em] text-ink-soft">
            <UserPlus className="h-3 w-3" /> Add friend
          </div>
          <div className="mt-3 flex items-center gap-2.5">
            <Avatar initials={friendSuggestion.initials} tone="ink" size="sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[11px] font-bold text-ink">
                {friendSuggestion.name}
              </p>
              <p className="text-[9px] text-ink-soft">
                {friendSuggestion.mutuals} mutual friends
              </p>
            </div>
            <button
              type="button"
              tabIndex={-1}
              className="shrink-0 rounded-full bg-coral px-3 py-1.5 text-[9px] font-bold text-white"
            >
              + Add
            </button>
          </div>
        </motion.div>
      </motion.div>

      {/* Main conversation card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="relative z-0 rounded-[26px] border border-ink/8 bg-white p-5 shadow-[0_30px_70px_rgba(20,22,27,.14)]"
      >
        <div className="flex items-center gap-2.5 border-b border-ink/6 pb-3">
          <span className="relative">
            <Avatar
              initials={conversationDemo.contact.initials}
              tone="cobalt"
            />
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-coral ring-2 ring-white" />
          </span>
          <div>
            <p className="text-[12px] font-bold text-ink">
              {conversationDemo.contact.name}
            </p>
            <p className="font-mono text-[9px] uppercase tracking-[.06em] text-coral">
              Online
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {conversationDemo.messages.map((m, i) => (
            <div
              key={i}
              className={
                m.from === "me"
                  ? "ml-auto w-fit max-w-[80%]"
                  : "w-fit max-w-[80%]"
              }
            >
              <div
                className={`rounded-2xl px-3.5 py-2.5 text-[11.5px] leading-5 ${
                  m.from === "me"
                    ? "rounded-tr-sm bg-cobalt text-white"
                    : "rounded-tl-sm bg-paper-deep text-ink"
                }`}
              >
                {m.text}
              </div>
              <p
                className={`mt-1 flex items-center gap-1 text-[9px] text-ink-soft ${
                  m.from === "me" ? "justify-end" : ""
                }`}
              >
                {m.time}
                {m.from === "me" && (
                  <CheckCheck className="h-3 w-3 text-cobalt" />
                )}
              </p>
            </div>
          ))}

          {conversationDemo.typing && (
            <div className="flex w-fit items-center gap-1 rounded-2xl rounded-tl-sm bg-paper-deep px-3.5 py-3">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="h-1.5 w-1.5 rounded-full bg-ink-soft"
                  animate={reduceMotion ? {} : { opacity: [0.3, 1, 0.3] }}
                  transition={{
                    duration: 1.1,
                    repeat: Infinity,
                    delay: i * 0.15,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* New group card */}
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.45 }}
        className="relative z-10 mt-[-24px] ml-auto w-[240px] rounded-2xl border border-ink/8 bg-white p-4 shadow-[0_18px_40px_rgba(20,22,27,.1)] lg:absolute lg:bottom-2 lg:right-0 lg:mt-0"
      >
        <motion.div animate={float}>
          <div className="flex items-center gap-1.5 font-mono text-[9px] font-medium uppercase tracking-[.08em] text-ink-soft">
            <UsersRound className="h-3 w-3" /> New group
          </div>
          <p className="mt-3 text-[11px] font-bold text-ink">
            {groupDraft.name}
          </p>
          <div className="mt-2 flex items-center">
            {groupDraft.members.map((m, i) => (
              <span key={i} className={i > 0 ? "-ml-2" : ""}>
                <Avatar
                  initials={m.initials}
                  tone={i % 2 ? "coral" : "ink"}
                  size="sm"
                />
              </span>
            ))}
            <span className="-ml-2 grid h-7 w-7 place-items-center rounded-full bg-paper-deep text-[9px] font-bold text-ink-soft ring-2 ring-white">
              +{groupDraft.memberCount - groupDraft.members.length}
            </span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
