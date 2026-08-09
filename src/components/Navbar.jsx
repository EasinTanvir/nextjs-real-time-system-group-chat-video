"use client";
import Link from "next/link";
import { Menu, MessageCircle } from "lucide-react";

import Container from "./Container";
import { logout } from "@/lib/cookies";
function BrandMark() {
  return (
    <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-[0_6px_14px_rgba(37,99,235,.25)]">
      <MessageCircle className="h-[18px] w-[18px]" strokeWidth={2.4} />
    </span>
  );
}

export default function Navbar({ isAuthenticated }) {
  return (
    <header className="border-b border-slate-200/80">
      <Container>
        <div className="flex h-[78px] items-center">
          {/* Logo */}
          <Link
            href="/"
            aria-label="Chatify home"
            className="flex items-center gap-2"
          >
            <BrandMark />

            <span className="text-[23px] font-bold tracking-[-.06em]">
              Chatify
            </span>
          </Link>

          {/* Navigation */}
          <nav
            aria-label="Main navigation"
            className="mx-auto hidden items-center gap-10 text-[13px] font-medium lg:flex"
          >
            <Link href="#features" className="transition hover:text-blue-600">
              Features
            </Link>

            <Link href="#security" className="transition hover:text-blue-600">
              Security
            </Link>

            <Link href="#pricing" className="transition hover:text-blue-600">
              Pricing
            </Link>

            <Link href="#about" className="transition hover:text-blue-600">
              About
            </Link>

            <Link href="#contact" className="transition hover:text-blue-600">
              Contact
            </Link>
          </nav>

          {/* Authentication */}
          <div className="ml-auto hidden items-center gap-4 sm:flex">
            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className="rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 px-5 py-3 text-[13px] font-bold text-white shadow-[0_10px_20px_rgba(37,99,235,.22)] transition hover:-translate-y-0.5"
                >
                  Get Started
                </Link>

                <form action={logout}>
                  <button
                    type="submit"
                    className="text-[13px] font-semibold text-slate-700 transition hover:text-red-600"
                  >
                    Logout
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-[13px] font-semibold transition hover:text-blue-600"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 px-5 py-3 text-[13px] font-bold text-white shadow-[0_10px_20px_rgba(37,99,235,.22)] transition hover:-translate-y-0.5"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <button
            type="button"
            aria-label="Open menu"
            className="ml-auto grid h-10 w-10 place-items-center rounded-lg text-slate-700 sm:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </Container>
    </header>
  );
}
