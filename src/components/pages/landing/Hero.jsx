"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import ChatMockup from "./ChatMockup";
import { useEffect } from "react";
import api from "@/lib/api";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

const Hero = () => {
  const fetchData = async () => {
    await api.get(process.env.NEXT_PUBLIC_API_URL);
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <section className="relative overflow-hidden bg-dot-grid">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-paper via-paper/95 to-paper" />
      <div className="relative mx-auto grid max-w-6xl gap-16 px-5 pb-24 pt-14 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:px-8 lg:pb-32 lg:pt-20">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.span
            variants={item}
            className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-ink-soft"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-coral opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-coral" />
            </span>
            Live · one-to-one &amp; group
          </motion.span>

          <motion.h1
            variants={item}
            className="mt-6 font-display text-[2.6rem] font-semibold leading-[1.06] tracking-tight text-ink sm:text-6xl"
          >
            Type it. Send it.
            <br />
            <span className="text-cobalt">It&rsquo;s already there.</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-6 max-w-md font-body text-lg text-ink-soft"
          >
            Chatify keeps every conversation instant — direct messages, group
            threads, and who&rsquo;s online, synced the second you hit enter.
          </motion.p>

          <motion.div variants={item} className="mt-9 flex flex-wrap gap-4">
            <Link
              href="/register"
              className="rounded-lg border-2 border-ink bg-coral px-6 py-3 font-display text-sm font-semibold text-ink shadow-hard transition-all hover:-translate-y-0.5 hover:shadow-hard-lg"
            >
              Get started free
            </Link>
          </motion.div>
        </motion.div>

        <ChatMockup />
      </div>
    </section>
  );
};

export default Hero;
