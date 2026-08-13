"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#features", label: "Features" },
];

const PulsingDot = () => (
  <span className="relative flex h-2.5 w-2.5">
    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-coral opacity-75" />
    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-coral" />
  </span>
);

const Navbar = ({ isAuthenticated }) => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathName = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathName.startsWith("/chat")) return;
  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "border-b border-ink/10 bg-paper/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <PulsingDot />
          <span className="font-display text-xl font-bold tracking-tight text-ink">
            Chatify
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="font-mono text-[13px] uppercase tracking-wide text-ink-soft transition-colors hover:text-ink"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <Link
              href="/chat"
              className="rounded-lg border-2 border-ink bg-ink px-4 py-2 font-display text-sm font-semibold text-paper shadow-[3px_3px_0_0_var(--color-cobalt)] transition-transform hover:-translate-y-0.5"
            >
              Open inbox
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="font-display text-sm font-semibold text-ink-soft hover:text-ink"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="rounded-lg border-2 border-ink bg-cobalt px-4 py-2 font-display text-sm font-semibold text-paper shadow-hard transition-all hover:-translate-y-0.5 hover:shadow-hard-lg"
              >
                Get started
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setOpen((o) => !o)}
          className="grid h-9 w-9 place-items-center rounded-md border-2 border-ink md:hidden"
          aria-label="Toggle menu"
        >
          <div className="space-y-1">
            <span
              className={`block h-0.5 w-5 bg-ink transition-transform ${
                open ? "translate-y-1.5 rotate-45" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-5 bg-ink transition-opacity ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-5 bg-ink transition-transform ${
                open ? "-translate-y-1.5 -rotate-45" : ""
              }`}
            />
          </div>
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-ink/10 bg-paper md:hidden"
          >
            <div className="flex flex-col gap-4 px-5 py-5">
              {NAV_LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="font-mono text-sm uppercase tracking-wide text-ink-soft"
                >
                  {l.label}
                </a>
              ))}
              <div className="flex flex-col gap-2 pt-2">
                {isAuthenticated ? (
                  <Link
                    href="/chat"
                    className="rounded-lg border-2 border-ink bg-ink px-4 py-2 text-center font-display text-sm font-semibold text-paper"
                  >
                    Open inbox
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="rounded-lg border-2 border-ink px-4 py-2 text-center font-display text-sm font-semibold text-ink"
                    >
                      Log in
                    </Link>
                    <Link
                      href="/register"
                      className="rounded-lg border-2 border-ink bg-cobalt px-4 py-2 text-center font-display text-sm font-semibold text-paper"
                    >
                      Get started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
