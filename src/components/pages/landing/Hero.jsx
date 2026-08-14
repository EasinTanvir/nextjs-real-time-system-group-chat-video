"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  LockKeyhole,
  MessageCircle,
  Paperclip,
  Phone,
  Send,
  ShieldCheck,
  Video,
  Zap,
} from "lucide-react";

import { image1, image2 } from "@/constant";

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

const SectionLabel = ({ icon: Icon, children }) => {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3.5 py-2 text-xs font-semibold text-slate-600 shadow-sm backdrop-blur">
      <Icon className="h-3.5 w-3.5 text-emerald-500" />
      {children}
    </div>
  );
};

const MobileConversation = () => {
  return (
    <div className="relative mx-auto w-full max-w-[390px]">
      <div className="absolute -inset-10 rounded-full bg-emerald-400/10 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 30, rotate: 2 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{
          duration: 0.8,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="relative overflow-hidden rounded-[34px] border border-white bg-white shadow-[0_35px_100px_rgba(15,23,42,0.14)]"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-slate-200 to-slate-300 text-sm font-bold text-slate-700">
                JC
              </div>

              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
            </div>

            <div>
              <p className="text-sm font-bold text-slate-900">James Carter</p>

              <p className="text-[11px] text-emerald-600">Online now</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 text-slate-500"
            >
              <Phone className="h-4 w-4" />
            </button>

            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 text-slate-500"
            >
              <Video className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="relative min-h-[510px] space-y-4 bg-gradient-to-b from-slate-50/80 to-white px-4 py-6">
          <div className="mx-auto w-fit rounded-full bg-white px-3 py-1 text-[10px] font-semibold text-slate-400 shadow-sm">
            Today
          </div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.45 }}
            className="max-w-[78%]"
          >
            <div className="rounded-2xl rounded-tl-md bg-white px-4 py-3 shadow-sm ring-1 ring-slate-100">
              <p className="text-sm leading-6 text-slate-700">
                Hey! Are you free for a quick call?
              </p>

              <p className="mt-1 text-right text-[10px] text-slate-400">
                10:31 AM
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.35, duration: 0.45 }}
            className="ml-auto max-w-[78%]"
          >
            <div className="rounded-2xl rounded-tr-md bg-emerald-500 px-4 py-3 text-white shadow-sm">
              <p className="text-sm leading-6">
                Absolutely. Give me a minute 👋
              </p>

              <div className="mt-1 flex items-center justify-end gap-1 text-[10px] text-emerald-50">
                10:32 AM
                <Check className="h-3 w-3" />
              </div>
            </div>
          </motion.div>

          {/* Typing */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.9 }}
            className="flex items-center gap-2"
          >
            <div className="flex items-center gap-1 rounded-2xl rounded-tl-md bg-white px-4 py-3 shadow-sm ring-1 ring-slate-100">
              {[0, 1, 2].map((dot) => (
                <motion.span
                  key={dot}
                  animate={{ y: [0, -3, 0] }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: dot * 0.12,
                  }}
                  className="h-1.5 w-1.5 rounded-full bg-slate-400"
                />
              ))}
            </div>

            <span className="text-[10px] text-slate-400">typing...</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 2.7, duration: 0.45 }}
            className="max-w-[82%]"
          >
            <div className="rounded-2xl rounded-tl-md bg-white px-4 py-3 shadow-sm ring-1 ring-slate-100">
              <p className="text-sm leading-6 text-slate-700">
                Perfect. I&rsquo;ll send the meeting link now.
              </p>

              <div className="mt-3 flex items-center gap-2 rounded-xl bg-slate-50 p-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                  <Video className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-[11px] font-bold text-slate-700">
                    Video call
                  </p>

                  <p className="text-[10px] text-slate-400">Ready to join</p>
                </div>
              </div>

              <p className="mt-1 text-right text-[10px] text-slate-400">
                10:33 AM
              </p>
            </div>
          </motion.div>

          {/* Reaction */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: 3.3,
              type: "spring",
              stiffness: 300,
              damping: 20,
            }}
            className="absolute bottom-24 right-5 flex items-center gap-2 rounded-full border border-white bg-white px-3 py-2 shadow-lg"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-50 text-rose-500">
              ❤️
            </span>

            <span className="text-xs font-semibold text-slate-700">1</span>
          </motion.div>
        </div>

        {/* Composer */}
        <div className="border-t border-slate-100 bg-white p-3">
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2">
            <MessageCircle className="h-4 w-4 text-slate-400" />

            <span className="flex-1 text-xs text-slate-400">
              Type a message...
            </span>

            <motion.button
              whileTap={{ scale: 0.9 }}
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white"
            >
              <Send className="h-3.5 w-3.5" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute -right-3 top-24 hidden rounded-2xl border border-white bg-white px-3 py-2 shadow-xl sm:flex"
      >
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />

          <span className="text-xs font-semibold text-slate-600">
            Delivered instantly
          </span>
        </div>
      </motion.div>
    </div>
  );
};

const DesktopProductVisual = () => {
  return (
    <div className="relative hidden min-h-[650px] lg:block">
      <div className="absolute right-10 top-20 h-[420px] w-[420px] rounded-full bg-blue-300/20 blur-[100px]" />

      <div className="absolute bottom-10 left-10 h-[300px] w-[300px] rounded-full bg-emerald-300/15 blur-[100px]" />

      {/* Main chat */}
      <motion.div
        initial={{
          opacity: 0,
          y: 35,
          scale: 0.96,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        transition={{
          duration: 0.9,
          delay: 0.15,
        }}
        className="absolute left-0 top-8 z-20 w-[min(100%,680px)] overflow-hidden rounded-[24px] border border-white/80 bg-white shadow-[0_35px_100px_rgba(15,23,42,0.15)]"
      >
        <Image
          src={image1}
          alt="Chatify messaging interface"
          width={1536}
          height={1024}
          className="h-auto w-full"
          priority
        />
      </motion.div>

      {/* Video */}
      <motion.div
        initial={{
          opacity: 0,
          y: 50,
          scale: 0.9,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        transition={{
          duration: 0.8,
          delay: 0.65,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="absolute bottom-0 right-0 z-30 w-[310px] overflow-hidden rounded-[22px] border-[5px] border-slate-950 bg-slate-950 shadow-[0_30px_80px_rgba(15,23,42,0.3)]"
      >
        <Image
          src={image2}
          alt="Chatify video calling interface"
          width={1536}
          height={1024}
          className="h-auto w-full"
        />
      </motion.div>

      {/* Privacy badge */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.1 }}
        className="absolute right-0 top-0 z-40 rounded-2xl border border-white bg-white/90 p-4 shadow-xl backdrop-blur"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <LockKeyhole className="h-5 w-5" />
          </div>

          <div>
            <p className="text-xs font-bold text-slate-900">
              Private by design
            </p>

            <p className="mt-0.5 text-[10px] text-slate-400">
              Your conversations stay yours
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_28%,rgba(59,130,246,0.10),transparent_25%),radial-gradient(circle_at_20%_50%,rgba(16,185,129,0.07),transparent_28%)]" />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-5 pb-20 pt-14 sm:pb-28 sm:pt-20 lg:grid-cols-[0.78fr_1.22fr] lg:items-center lg:px-8 lg:pb-32 lg:pt-24">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="relative z-40"
        >
          <motion.div variants={fadeUp}>
            <SectionLabel icon={MessageCircle}>
              Conversations, without the clutter
            </SectionLabel>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="mt-6 max-w-2xl font-display text-[3rem] font-semibold leading-[0.98] tracking-[-0.055em] text-slate-950 sm:text-6xl lg:text-[4.7rem]"
          >
            Talk to people.
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 bg-clip-text text-transparent">
              Stay connected.
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-xl text-base leading-7 text-slate-500 sm:text-lg"
          >
            Chatify brings messages, groups, voice and video calls together in
            one beautifully simple place. Built for conversations that actually
            matter.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <Link
              href="/register"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-3.5 text-sm font-bold text-white shadow-[0_12px_30px_rgba(15,23,42,0.18)] transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(15,23,42,0.22)]"
            >
              Get started free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="#features"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50"
            >
              Explore Chatify
            </Link>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 text-xs font-medium text-slate-400"
          >
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              Private conversations
            </span>

            <span className="hidden h-4 w-px bg-slate-200 sm:block" />

            <span className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-blue-500" />
              Real-time delivery
            </span>
          </motion.div>
        </motion.div>

        <DesktopProductVisual />

        <div className="lg:hidden">
          <MobileConversation />
        </div>
      </div>
    </section>
  );
}
