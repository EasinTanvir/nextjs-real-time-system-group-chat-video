"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MessageCircle, ShieldCheck, Sparkles } from "lucide-react";

const FinalCTA = () => {
  return (
    <section className="relative overflow-hidden bg-slate-950 px-5 py-24 sm:py-32">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-emerald-500/[0.08] blur-[120px]" />

        <div className="absolute bottom-0 left-[15%] h-[300px] w-[300px] rounded-full bg-blue-500/[0.05] blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-4xl text-center">
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.9,
          }}
          whileInView={{
            opacity: 1,
            scale: 1,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.6,
          }}
          className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-[0_0_50px_rgba(16,185,129,0.25)]"
        >
          <MessageCircle className="h-6 w-6" />
        </motion.div>

        <motion.div
          initial={{
            opacity: 0,
            y: 25,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.7,
            delay: 0.1,
          }}
        >
          <h2 className="mt-8 font-display text-4xl font-semibold leading-[1.02] tracking-[-0.05em] text-white sm:text-6xl lg:text-7xl">
            Start a conversation.
            <br />
            <span className="text-emerald-400">Stay close.</span>
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-slate-400 sm:text-lg">
            Bring your people together with messaging, voice and video — all in
            one simple place.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/register"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 text-sm font-bold text-white shadow-[0_15px_40px_rgba(16,185,129,0.18)] transition-all hover:-translate-y-0.5 hover:bg-emerald-400"
            >
              Get started free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
            >
              Log in
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-[11px] font-semibold text-slate-500">
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              Privacy focused
            </span>

            <span className="hidden h-3 w-px bg-white/10 sm:block" />

            <span className="flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-blue-400" />
              Real-time communication
            </span>

            <span className="hidden h-3 w-px bg-white/10 sm:block" />

            <span>Free to get started</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTA;
