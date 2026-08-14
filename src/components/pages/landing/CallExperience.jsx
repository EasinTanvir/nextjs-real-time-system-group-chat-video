"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  Check,
  MessageCircle,
  Mic,
  MonitorUp,
  Phone,
  Sparkles,
  Users,
  Video,
} from "lucide-react";

import { image2 } from "@/constant";

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
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

const SectionLabel = ({ children }) => {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3.5 py-2 text-xs font-semibold text-slate-300 backdrop-blur">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
      {children}
    </div>
  );
};

const CallControl = ({ icon: Icon, label, active = false }) => {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-full ${
          active ? "bg-white text-slate-950" : "bg-white/[0.08] text-white"
        }`}
      >
        <Icon className="h-4 w-4" />
      </div>

      <span className="text-[10px] font-medium text-slate-400">{label}</span>
    </div>
  );
};

const CallExperience = () => {
  return (
    <section
      id="calls"
      className="relative overflow-hidden bg-[#080b0f] py-24 text-white sm:py-32"
    >
      {/* Ambient lighting */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[10%] top-[20%] h-[400px] w-[400px] rounded-full bg-blue-500/[0.07] blur-[120px]" />

        <div className="absolute bottom-[10%] right-[10%] h-[450px] w-[450px] rounded-full bg-emerald-500/[0.08] blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{
            once: true,
            amount: 0.2,
          }}
          className="grid gap-16 lg:grid-cols-[0.72fr_1.28fr] lg:items-center"
        >
          {/* Copy */}
          <div>
            <motion.div variants={fadeUp}>
              <SectionLabel>Voice & video calls</SectionLabel>
            </motion.div>

            <motion.h2
              variants={fadeUp}
              className="mt-7 max-w-xl font-display text-4xl font-semibold leading-[1.02] tracking-[-0.05em] text-white sm:text-5xl lg:text-[4.3rem]"
            >
              When a message
              <br />
              <span className="text-emerald-400">isn't enough.</span>
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="mt-6 max-w-lg text-base leading-7 text-slate-400 sm:text-lg"
            >
              Start with a message. Switch to a call when the conversation needs
              a little more presence. Everything stays connected.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-8 grid max-w-md grid-cols-2 gap-3"
            >
              {["HD video", "Group calls", "Screen sharing", "Live chat"].map(
                (feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-3.5 py-3"
                  >
                    <Check className="h-3.5 w-3.5 shrink-0 text-emerald-400" />

                    <span className="text-xs font-semibold text-slate-300">
                      {feature}
                    </span>
                  </div>
                ),
              )}
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="mt-9 flex items-center gap-3"
            >
              <div className="flex -space-x-2">
                {["JC", "AW", "MK"].map((person) => (
                  <div
                    key={person}
                    className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#080b0f] bg-slate-700 text-[9px] font-bold text-white"
                  >
                    {person}
                  </div>
                ))}
              </div>

              <p className="text-xs text-slate-500">
                Built for conversations that deserve more than text.
              </p>
            </motion.div>
          </div>

          {/* Call UI */}
          <motion.div variants={fadeUp} className="relative">
            <div className="absolute -inset-8 rounded-[40px] bg-emerald-500/[0.07] blur-3xl" />

            <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#101419] p-2 shadow-[0_40px_100px_rgba(0,0,0,0.45)] sm:p-3">
              {/* Top bar */}
              <div className="flex items-center justify-between px-3 py-3 sm:px-4">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.06] text-slate-300"
                  >
                    <Phone className="h-3.5 w-3.5 rotate-[225deg]" />
                  </button>

                  <div>
                    <p className="text-xs font-bold text-white">James Carter</p>

                    <div className="mt-0.5 flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

                      <span className="text-[10px] text-slate-500">
                        02:34 · Online
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    className="hidden h-8 w-8 items-center justify-center rounded-full bg-white/[0.06] text-slate-300 sm:flex"
                  >
                    <Users className="h-3.5 w-3.5" />
                  </button>

                  <button
                    type="button"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.06] text-slate-300"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Video area */}
              <div className="relative aspect-[16/9] overflow-hidden rounded-[20px] bg-slate-900">
                <Image
                  src={image2}
                  alt="Chatify video calling experience"
                  fill
                  className="object-cover"
                />

                {/* subtle gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />

                {/* Participant status */}
                <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-xl border border-white/10 bg-black/50 px-3 py-2 backdrop-blur-md">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

                  <span className="text-[10px] font-semibold text-white">
                    James Carter
                  </span>

                  <div className="ml-1 flex items-end gap-0.5">
                    <span className="h-2 w-0.5 rounded-full bg-emerald-400" />
                    <span className="h-3 w-0.5 rounded-full bg-emerald-400" />
                    <span className="h-2 w-0.5 rounded-full bg-emerald-400" />
                  </div>
                </div>

                {/* Live badge */}
                <motion.div
                  animate={{
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                  className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/40 px-2.5 py-1.5 backdrop-blur-md"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

                  <span className="text-[9px] font-bold text-white">LIVE</span>
                </motion.div>
              </div>

              {/* Controls */}
              <div className="flex items-end justify-center gap-5 px-3 pb-3 pt-5 sm:gap-8 sm:pt-6">
                <CallControl icon={Mic} label="Mute" />

                <CallControl icon={Video} label="Video" active />

                <CallControl icon={MonitorUp} label="Share" />

                <CallControl icon={MessageCircle} label="Chat" />

                <div className="flex flex-col items-center gap-2">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-red-500 text-white shadow-lg shadow-red-500/20"
                  >
                    <Phone className="h-4 w-4 rotate-[135deg]" />
                  </motion.div>

                  <span className="text-[10px] font-medium text-slate-400">
                    End
                  </span>
                </div>
              </div>
            </div>

            {/* Floating quality card */}
            <motion.div
              initial={{
                opacity: 0,
                x: 20,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                delay: 0.5,
              }}
              className="absolute -bottom-5 -right-3 hidden rounded-2xl border border-white/10 bg-[#151a20]/95 p-3 shadow-2xl backdrop-blur-xl sm:block"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                  <Sparkles className="h-3.5 w-3.5" />
                </div>

                <div>
                  <p className="text-[10px] font-bold text-white">
                    Excellent connection
                  </p>

                  <p className="mt-0.5 text-[9px] text-slate-500">
                    Call quality is stable
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CallExperience;
