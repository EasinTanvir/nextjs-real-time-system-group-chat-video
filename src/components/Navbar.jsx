"use client";
import Link from "next/link";
import { Menu, MessageCircle } from "lucide-react";

import Container from "./Container";
import { logout } from "@/lib/cookies";
import { usePathname } from "next/navigation";

function BrandMark() {
  return (
    <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-ink text-coral">
      <MessageCircle className="h-[18px] w-[18px]" strokeWidth={2.4} />
      <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-coral ring-2 ring-paper">
        <span className="absolute inset-0 animate-ping rounded-full bg-coral opacity-75" />
      </span>
    </span>
  );
}

const navLinks = [
  ["Features", "#features"],
  ["Presence", "#presence"],
  ["Pricing", "#pricing"],
  ["About", "#about"],
  ["Contact", "#contact"],
];

export default function Navbar({ isAuthenticated }) {
  const pathname = usePathname();
  if (pathname.startsWith("/chat")) {
    return null;
  }

  return (
    <header className="border-b border-ink/8 bg-paper/80 backdrop-blur-md">
      <Container>
        <div className="flex h-[76px] items-center">
          <Link
            href="/"
            aria-label="Chatify home"
            className="flex items-center gap-2.5"
          >
            <BrandMark />
            <span className="font-display text-[21px] font-bold tracking-[-.04em] text-ink">
              Chatify
            </span>
          </Link>

          <nav
            aria-label="Main navigation"
            className="mx-auto hidden items-center gap-9 lg:flex"
          >
            {navLinks.map(([label, href]) => (
              <Link
                key={label}
                href={href}
                className="font-mono text-[11px] font-medium uppercase tracking-[.08em] text-ink-soft transition hover:text-ink"
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto hidden items-center gap-5 sm:flex">
            {isAuthenticated ? (
              <>
                <Link
                  href="/chat"
                  className="rounded-xl bg-cobalt px-5 py-3 text-[13px] font-bold text-white shadow-[0_10px_20px_rgba(36,81,255,.25)] transition hover:-translate-y-0.5 hover:bg-cobalt-deep"
                >
                  Open Chatify
                </Link>
                <form action={logout}>
                  <button
                    type="submit"
                    className="text-[13px] font-semibold text-ink-soft transition hover:text-coral"
                  >
                    Logout
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-[13px] font-semibold text-ink transition hover:text-cobalt"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="rounded-xl bg-cobalt px-5 py-3 text-[13px] font-bold text-white shadow-[0_10px_20px_rgba(36,81,255,.25)] transition hover:-translate-y-0.5 hover:bg-cobalt-deep"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            aria-label="Open menu"
            className="ml-auto grid h-10 w-10 place-items-center rounded-lg text-ink sm:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </Container>
    </header>
  );
}
