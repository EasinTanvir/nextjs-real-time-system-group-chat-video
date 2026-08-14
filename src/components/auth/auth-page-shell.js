import Link from "next/link";
import { ArrowLeft, MessageCircle } from "lucide-react";

export default function AuthPageShell({ title, description, children }) {
  return (
    <main className="relative isolate flex min-h-[calc(100vh-80px)] items-center justify-center overflow-hidden bg-[#f8fafc] px-4 py-10 text-slate-950 sm:px-6">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-cyan-200/30 blur-3xl" />

        <div className="absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-emerald-200/25 blur-3xl" />

        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/80 blur-3xl" />
      </div>

      <div className="w-full max-w-[440px]">
        {/* Back */}
        <Link
          href="/"
          className="group mx-auto mb-8 flex w-fit items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-500"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
          Back to home
        </Link>

        {/* Header */}
        <div className="text-center">
          <Link
            href="/"
            aria-label="Chatify home"
            className="group mx-auto inline-flex items-center gap-2.5 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-500"
          >
            <span className="relative grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 text-white shadow-[0_9px_24px_rgba(16,185,129,0.18)] transition-transform duration-200 group-hover:scale-105">
              <MessageCircle className="h-5 w-5" strokeWidth={2.4} />

              <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-400" />
            </span>

            <span className="font-display text-[25px] font-bold tracking-[-.055em] text-slate-950">
              Chatify
            </span>
          </Link>
        </div>

        {/* Form card */}
        <section className="mt-8 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_20px_55px_rgba(15,23,42,0.07)] sm:p-8">
          {children}
        </section>
      </div>
    </main>
  );
}
