"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Globe2,
  LockKeyhole,
  Play,
  Shield,
  ShieldCheck,
  Signal,
  UserPlus,
  UsersRound,
  Zap,
} from "lucide-react";

import Container from "@/components/Container";
import PresenceHero from "@/components/pages/landing/PresenceHero";
import StatusSwitcher from "@/components/pages/landing/StatusSwitcher";
import { capabilityTags, featureCards, statistics } from "@/data/home";

const iconMap = {
  zap: Zap,
  users: UsersRound,
  signal: Signal,
  lock: LockKeyhole,
  globe: Globe2,
  shield: ShieldCheck,
};

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-paper text-ink">
      {/* Hero */}
      <Container>
        <section className="relative z-10 grid items-center gap-14 pb-16 pt-14 lg:grid-cols-[1fr_.95fr] lg:gap-10 lg:pb-24 lg:pt-20">
          <div className="max-w-[540px]">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 font-mono text-[10.5px] font-medium uppercase tracking-[.06em] text-ink-soft ring-1 ring-ink/8"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-coral opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-coral" />
              </span>
              12,482 people online right now
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-6 text-[44px] font-bold leading-[1.05] tracking-[-.04em] text-ink sm:text-[58px]"
            >
              Say it. Send it.
              <br />
              <span className="text-cobalt">Seen it</span> — instantly.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-5 max-w-[460px] text-[16px] leading-7 text-ink-soft"
            >
              Chatify keeps direct messages, group threads, and presence in sync
              down to the millisecond — so nobody's ever left on read.
            </motion.p>
          </div>

          <PresenceHero />
        </section>
      </Container>

      {/* Features */}
      <section
        id="features"
        className="relative z-10 border-t border-ink/8 bg-white py-16 sm:py-24"
      >
        <Container>
          <div className="max-w-[540px]">
            <p className="font-mono text-[10.5px] font-bold uppercase tracking-[.08em] text-cobalt">
              Built for conversation
            </p>
            <h2 className="mt-2 text-[30px] font-bold tracking-[-.03em] sm:text-[36px]">
              Everything a conversation needs, nothing it doesn't
            </h2>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featureCards.map(({ title, description, iconKey, tone }, i) => {
              const Icon = iconMap[iconKey];
              return (
                <motion.article
                  key={title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="rounded-2xl border border-ink/8 bg-paper p-5"
                >
                  <span
                    className={`grid h-10 w-10 place-items-center rounded-lg ${tone}`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-[14px] font-bold text-ink">
                    {title}
                  </h3>
                  <p className="mt-2 text-[12px] leading-[1.6] text-ink-soft">
                    {description}
                  </p>
                </motion.article>
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {capabilityTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-paper px-3.5 py-2 font-mono text-[10px] font-medium uppercase tracking-[.04em] text-ink-soft ring-1 ring-ink/8"
              >
                {tag}
              </span>
            ))}
          </div>
        </Container>
      </section>

      {/* Presence */}
      <section
        id="presence"
        className="relative z-10 border-t border-ink/8 bg-paper py-16 sm:py-24"
      >
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="font-mono text-[10.5px] font-bold uppercase tracking-[.08em] text-coral">
                Presence
              </p>
              <h2 className="mt-2 max-w-[420px] text-[30px] font-bold tracking-[-.03em] sm:text-[36px]">
                Your status, down to the second
              </h2>
              <p className="mt-4 max-w-[420px] text-[14px] leading-7 text-ink-soft">
                Switch between online, away, and offline — every friend and
                every thread reflects it the instant you change it, on every
                device.
              </p>
              <div className="mt-6 flex items-center gap-2 text-[12px] font-semibold text-ink-soft">
                <Play className="h-3.5 w-3.5 text-cobalt" /> Try it — tap a
                status below
              </div>
            </div>

            <StatusSwitcher />
          </div>

          <div className="mt-16 grid rounded-2xl bg-white px-4 py-6 ring-1 ring-ink/8 sm:grid-cols-4 sm:px-8">
            {statistics.map(([iconKey, number, label], index) => {
              const Icon = iconMap[iconKey];
              return (
                <div
                  key={label}
                  className={`flex items-center justify-center gap-3.5 py-2 ${
                    index ? "sm:border-l sm:border-ink/8" : ""
                  }`}
                >
                  <Icon className="h-6 w-6 text-cobalt" />
                  <div>
                    <p className="font-display text-[19px] font-bold tracking-[-.03em] text-ink">
                      {number}
                    </p>
                    <p className="font-mono text-[9.5px] uppercase tracking-[.04em] text-ink-soft">
                      {label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      <span id="pricing" className="sr-only" />
      <span id="about" className="sr-only" />
      <span id="contact" className="sr-only" />
    </main>
  );
}
