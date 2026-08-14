"use client";

import Link from "next/link";
import { ArrowRight, MessageCircle, Menu, X } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";

const Navbar = ({ isAuthenticated = false }) => {
  const pathName = usePathname();
  const [open, setOpen] = useState(false);
  const paths = [
    "/chat",
    "/login",
    "/register",
    "/chat/users",
    "/chat/friends",
    "/chat/conversation",
  ];
  console.log({ pathName });
  if (paths.includes(pathName) || pathName.startsWith("/chat/conversation/")) {
    return null;
  }
  return (
    <header className="relative z-[100] bg-[#f8fafc]">
      <nav className="mx-auto max-w-7xl px-5 pt-4 sm:pt-6 lg:px-8">
        <div className="flex h-16 items-center justify-between rounded-2xl border border-slate-200/80 bg-white/85 px-4 shadow-[0_10px_35px_rgba(15,23,42,0.05)] backdrop-blur-xl sm:px-5">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 text-white shadow-sm">
              <MessageCircle className="h-[18px] w-[18px]" />
            </span>

            <span className="font-display text-lg font-bold tracking-tight text-slate-950">
              Chatify
            </span>
          </Link>

          <div className="hidden items-center gap-8 lg:flex">
            <a
              href="#features"
              className="text-sm font-semibold text-slate-500 transition hover:text-slate-950"
            >
              Features
            </a>

            <a
              href="#calls"
              className="text-sm font-semibold text-slate-500 transition hover:text-slate-950"
            >
              Calls
            </a>

            <a
              href="#security"
              className="text-sm font-semibold text-slate-500 transition hover:text-slate-950"
            >
              Security
            </a>
          </div>

          <div className="hidden items-center gap-3 sm:flex">
            {isAuthenticated ? (
              <Link
                href="/chat"
                className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800"
              >
                Open Chat
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-3 py-2 text-sm font-semibold text-slate-600 transition hover:text-slate-950"
                >
                  Log in
                </Link>

                <Link
                  href="/register"
                  className="rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-400"
                >
                  Get started
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-700 sm:hidden"
            aria-label="Toggle navigation"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <div className="mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-xl sm:hidden">
            <div className="flex flex-col">
              <a
                href="#features"
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Features
              </a>

              <a
                href="#calls"
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Calls
              </a>

              <a
                href="#security"
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Security
              </a>

              <div className="my-2 h-px bg-slate-100" />

              {isAuthenticated ? (
                <Link
                  href="/chat"
                  className="rounded-xl bg-slate-950 px-4 py-3 text-center text-sm font-bold text-white"
                >
                  Open Chat
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="rounded-xl px-4 py-3 text-center text-sm font-semibold text-slate-600"
                  >
                    Log in
                  </Link>

                  <Link
                    href="/register"
                    className="rounded-xl bg-emerald-500 px-4 py-3 text-center text-sm font-bold text-white"
                  >
                    Get started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
