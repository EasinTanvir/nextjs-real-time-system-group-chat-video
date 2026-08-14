"use client";

import { motion } from "framer-motion";
import {
  Check,
  LockKeyhole,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const stagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const SectionLabel = ({ icon: Icon, children }) => (
  <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3.5 py-2 text-xs font-semibold text-slate-600 shadow-sm backdrop-blur">
    <Icon className="h-3.5 w-3.5 text-emerald-500" />
    {children}
  </div>
);

const FeatureCard = ({
  icon: Icon,
  title,
  description,
  large = false,
  children,
}) => {
  return (
    <motion.div
      variants={fadeUp}
      className={`group relative overflow-hidden rounded-[28px] border border-slate-200 bg-white p-7 shadow-[0_15px_50px_rgba(15,23,42,0.05)] ${
        large ? "md:col-span-2" : ""
      }`}
    >
      <div className="relative z-10">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-50 text-slate-700 transition-colors group-hover:bg-emerald-50 group-hover:text-emerald-600">
          <Icon className="h-5 w-5" />
        </div>

        <h3 className="mt-6 font-display text-xl font-semibold tracking-tight text-slate-950">
          {title}
        </h3>

        <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
          {description}
        </p>
      </div>

      {children}
    </motion.div>
  );
};

const MiniConversation = () => {
  return (
    <div className="mt-8 flex max-w-md items-end gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold text-slate-600">
        JC
      </div>

      <div className="rounded-2xl rounded-bl-md bg-slate-50 px-4 py-3">
        <p className="text-xs text-slate-600">
          Can you check this before I send it?
        </p>
      </div>

      <motion.div
        animate={{ scale: [1, 1.08, 1] }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
        className="mb-1 text-sm"
      >
        ❤️
      </motion.div>
    </div>
  );
};

const LivePeople = () => {
  const people = ["AB", "MR", "SK", "JL", "TN"];

  return (
    <div className="mt-8 flex items-center">
      {people.map((person, index) => (
        <div
          key={person}
          className={`flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-slate-200 to-slate-300 text-[9px] font-bold text-slate-600 ${
            index > 0 ? "-ml-2" : ""
          }`}
        >
          {person}
        </div>
      ))}

      <div className="ml-3 text-xs font-semibold text-slate-500">
        +2.5k people connected
      </div>
    </div>
  );
};

export default function Features() {
  return (
    <section id="features" className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{
            once: true,
            amount: 0.2,
          }}
          className="max-w-2xl"
        >
          <motion.div variants={fadeUp}>
            <SectionLabel icon={Sparkles}>Built around people</SectionLabel>
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="mt-6 font-display text-4xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl"
          >
            Simple on the surface.
            <br />
            <span className="text-slate-400">Thoughtful underneath.</span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="mt-5 max-w-xl text-base leading-7 text-slate-500"
          >
            Every interaction is designed to keep you close to the conversation
            instead of getting in its way.
          </motion.p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{
            once: true,
            amount: 0.15,
          }}
          className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3"
        >
          <FeatureCard
            icon={MessageCircle}
            title="Real-time messaging"
            description="Messages arrive instantly, with presence, delivery states and reactions that make conversations feel natural."
            large
          >
            <MiniConversation />
          </FeatureCard>

          <FeatureCard
            icon={Users}
            title="Groups that feel personal"
            description="Create spaces for your closest people, teams, projects or communities."
          >
            <LivePeople />
          </FeatureCard>

          <FeatureCard
            icon={Zap}
            title="Instant everywhere"
            description="Your conversations stay synchronized across the experience so you can pick up exactly where you left off."
          >
            <div className="mt-8 flex items-center gap-3">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                <motion.div
                  initial={{ width: "0%" }}
                  whileInView={{ width: "100%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5 }}
                  className="h-full rounded-full bg-emerald-500"
                />
              </div>

              <span className="text-[10px] font-bold text-emerald-600">
                synced
              </span>
            </div>
          </FeatureCard>

          <FeatureCard
            icon={ShieldCheck}
            title="Privacy comes first"
            description="Security isn't an afterthought. Chatify is designed around keeping your conversations private and protected."
          >
            <div className="mt-8 flex items-center gap-3 rounded-2xl bg-emerald-50 p-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
                <LockKeyhole className="h-4 w-4" />
              </div>

              <div>
                <p className="text-xs font-bold text-slate-700">
                  Secure session
                </p>

                <p className="text-[10px] text-slate-400">
                  Protected connection
                </p>
              </div>

              <Check className="ml-auto h-4 w-4 text-emerald-500" />
            </div>
          </FeatureCard>
        </motion.div>
      </div>
    </section>
  );
}
