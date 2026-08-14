"use client";

import { motion } from "framer-motion";
import {
  Check,
  Fingerprint,
  KeyRound,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
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
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const securityItems = [
  {
    icon: LockKeyhole,
    title: "Private conversations",
    description:
      "Your conversations are designed to stay between the people they're meant for.",
  },
  {
    icon: KeyRound,
    title: "Protected sessions",
    description:
      "Authentication and session handling keep access tied to the right account.",
  },
  {
    icon: Fingerprint,
    title: "Privacy by design",
    description:
      "Security is considered throughout the product instead of being added at the end.",
  },
];

const Security = () => {
  return (
    <section
      id="security"
      className="relative overflow-hidden bg-[#f8fafc] py-24 sm:py-32"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-emerald-100/50 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        {/* Principles */}
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {securityItems.map(({ icon: Icon, title, description }, index) => (
            <motion.div
              key={title}
              initial={{
                opacity: 0,
                y: 20,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.2,
              }}
              transition={{
                duration: 0.6,
                delay: index * 0.08,
              }}
              className="rounded-2xl border border-slate-200 bg-white p-6"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-700">
                <Icon className="h-4 w-4" />
              </div>

              <h3 className="mt-5 text-sm font-bold text-slate-900">{title}</h3>

              <p className="mt-2 text-xs leading-6 text-slate-500">
                {description}
              </p>

              <div className="mt-5 flex items-center gap-2 text-[10px] font-semibold text-emerald-600">
                <Check className="h-3.5 w-3.5" />
                Built into Chatify
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Security;
