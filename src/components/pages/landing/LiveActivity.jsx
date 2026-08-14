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

const liveActivities = [
  {
    avatar: "SC",
    name: "Sarah",
    text: "is typing...",
    type: "typing",
  },
  {
    avatar: "JC",
    name: "James",
    text: "sent a message",
    type: "message",
  },
  {
    avatar: "AW",
    name: "Alex",
    text: "reacted ❤️",
    type: "reaction",
  },
  {
    avatar: "MK",
    name: "Mike",
    text: "joined the call",
    type: "call",
  },
];

const LiveActivity = () => {
  return (
    <motion.div
      initial={{
        opacity: 0,
        x: 20,
        y: 10,
      }}
      animate={{
        opacity: 1,
        x: 0,
        y: 0,
      }}
      transition={{
        duration: 0.7,
        delay: 1.3,
      }}
      className="absolute right-[-10px] top-[32%] z-50 w-[190px]"
    >
      <div className="overflow-hidden rounded-2xl border border-white/80 bg-white/90 p-3 shadow-[0_20px_50px_rgba(15,23,42,0.12)] backdrop-blur-xl">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />

              <span className="relative h-2 w-2 rounded-full bg-emerald-500" />
            </span>

            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
              Live
            </span>
          </div>

          <span className="text-[9px] text-slate-300">now</span>
        </div>

        <div className="relative min-h-[42px]">
          {liveActivities.map((activity, index) => (
            <motion.div
              key={activity.name}
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: [0, 1, 1, 0],
                y: [10, 0, 0, -8],
              }}
              transition={{
                duration: 4.5,
                repeat: Infinity,
                delay: index * 2.2,
                times: [0, 0.15, 0.75, 1],
                ease: "easeInOut",
              }}
              className="absolute inset-x-0 top-0 flex items-center gap-2"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-slate-100 to-slate-200 text-[8px] font-bold text-slate-600">
                {activity.avatar}
              </div>

              <div className="min-w-0">
                <p className="truncate text-[10px] font-bold text-slate-800">
                  {activity.name}
                </p>

                <p className="truncate text-[9px] text-slate-400">
                  {activity.text}
                </p>
              </div>

              {activity.type === "typing" && (
                <div className="ml-auto flex gap-0.5">
                  {[0, 1, 2].map((dot) => (
                    <motion.span
                      key={dot}
                      animate={{
                        y: [0, -2, 0],
                      }}
                      transition={{
                        duration: 0.7,
                        repeat: Infinity,
                        delay: dot * 0.1,
                      }}
                      className="h-1 w-1 rounded-full bg-emerald-400"
                    />
                  ))}
                </div>
              )}

              {activity.type === "message" && (
                <MessageCircle className="ml-auto h-3.5 w-3.5 text-blue-500" />
              )}

              {activity.type === "reaction" && (
                <span className="ml-auto text-xs">❤️</span>
              )}

              {activity.type === "call" && (
                <Video className="ml-auto h-3.5 w-3.5 text-emerald-500" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default LiveActivity;
