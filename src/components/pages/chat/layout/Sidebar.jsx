"use client";

import { usePathname, useRouter } from "next/navigation";
import { LogOut, X } from "lucide-react";
import Link from "next/link";

import Brand from "./Brand";
import Avatar from "./Avatar";
import { navigation } from "@/lib/navigation";
import { logout } from "@/lib/cookies";

function Sidebar({ close }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="flex h-full w-[260px] flex-col border-r border-slate-200/80 bg-white px-4 py-5">
      {/* Brand */}
      <div className="flex h-12 items-center justify-between px-2">
        <Brand />

        <button
          type="button"
          onClick={close}
          className="grid h-9 w-9 place-items-center rounded-xl text-slate-400 transition hover:bg-slate-50 hover:text-slate-700 lg:hidden"
          aria-label="Close navigation"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="mt-7 space-y-1" aria-label="Chat navigation">
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
          Workspace
        </p>

        {navigation.map(([Icon, label, href]) => {
          const active = pathname === href;

          return (
            <Link
              key={label}
              href={href}
              onClick={close}
              aria-current={active ? "page" : undefined}
              className={`group relative flex h-11 items-center gap-3 rounded-xl px-3.5 text-[13px] font-semibold transition-all ${
                active
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {/* Active indicator */}
              {active && (
                <span className="absolute left-0 h-5 w-1 rounded-r-full bg-emerald-500" />
              )}

              <Icon
                className={`h-[18px] w-[18px] shrink-0 transition-colors ${
                  active
                    ? "text-emerald-600"
                    : "text-slate-400 group-hover:text-slate-600"
                }`}
                strokeWidth={active ? 2.3 : 2}
              />

              <span>{label}</span>

              {active && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-500" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom account */}
      <div className="mt-auto border-t border-slate-100 pt-4">
        <div className="flex items-center gap-3 rounded-2xl px-2 py-2">
          {/* Avatar */}
          <span className="relative shrink-0">
            <Avatar initials="U" size="md" />

            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
          </span>

          {/* Account information */}
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12px] font-bold text-slate-800">
              Account
            </p>

            <div className="mt-0.5 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

              <p className="font-mono text-[9px] font-medium uppercase tracking-[0.08em] text-slate-400">
                Online
              </p>
            </div>
          </div>

          {/* Logout */}
          <button
            type="button"
            onClick={async () => {
              await logout();

              router.push("/login");
              router.refresh();
            }}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-slate-400 transition hover:bg-red-50 hover:text-red-500"
            aria-label="Log out"
          >
            <LogOut className="h-[17px] w-[17px]" />
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
