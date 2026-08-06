import Link from "next/link";
import { ArrowLeft, MessageCircle } from "lucide-react";

export default function AuthPageShell({ title, description, children }) {
  return (
    <main className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-[#fbfcff] px-4 py-10 text-slate-900 sm:px-6">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_16%_12%,rgba(219,234,254,.82),transparent_30%),radial-gradient(circle_at_84%_88%,rgba(224,231,255,.88),transparent_34%)]" />
      <div className="w-full max-w-[440px]">
        <Link
          href="/"
          className="group mx-auto mb-9 flex w-fit items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-blue-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          Back to home
        </Link>
        <div className="text-center">
          <Link
            href="/"
            aria-label="Chatify home"
            className="mx-auto inline-flex items-center gap-2.5 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600"
          >
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-[0_9px_18px_rgba(37,99,235,.25)]">
              <MessageCircle className="h-5 w-5" strokeWidth={2.4} />
            </span>
            <span className="text-[25px] font-bold tracking-[-.055em] text-slate-900">
              Chatify
            </span>
          </Link>
          <h1 className="mt-8 text-3xl font-extrabold tracking-[-.045em] text-slate-900 sm:text-[34px]">
            {title}
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500">
            {description}
          </p>
        </div>
        <section className="mt-8 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-[0_18px_45px_rgba(37,99,235,.10)] sm:p-8">
          {children}
        </section>
      </div>
    </main>
  );
}
