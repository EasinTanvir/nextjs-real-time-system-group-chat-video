"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  CircleUserRound,
  LogOut,
  Menu,
  MessageCircle,
  UsersRound,
  UserRoundPlus,
  Bell,
  X,
} from "lucide-react";

import { useSocket } from "@/providers/SocketContext";

const navigation = [
  [MessageCircle, "Chats", "/chat"],
  [UsersRound, "Users", "/chat/users"],
  [UserRoundPlus, "Friends", "/chat/friends"],
];

function Brand() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2.5"
      aria-label="Chatify home"
    >
      <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-ink text-coral">
        <MessageCircle className="h-[18px] w-[18px]" strokeWidth={2.4} />
        <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-coral ring-2 ring-white" />
      </span>
      <span className="font-display text-[21px] font-bold tracking-[-.04em] text-ink">
        Chatify
      </span>
    </Link>
  );
}

const TONES = [
  "from-cobalt to-cobalt-deep",
  "from-coral to-[#E8461F]",
  "from-ink to-[#3A3F4B]",
];
function toneFromName(name = "") {
  const code = name.charCodeAt(0) || 0;
  return TONES[code % TONES.length];
}

function Avatar({ initials, name, size = "md" }) {
  const sizes = { sm: "h-7 w-7 text-[9px]", md: "h-9 w-9 text-[11px]" };
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-full bg-gradient-to-br font-bold text-white ${toneFromName(name || initials)} ${sizes[size]}`}
    >
      {initials}
    </span>
  );
}

function Sidebar({ close }) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-[260px] flex-col border-r border-ink/8 bg-white px-5 py-7">
      <div className="flex items-center justify-between">
        <Brand />
        <button
          onClick={close}
          className="grid h-9 w-9 place-items-center rounded-lg text-ink-soft lg:hidden"
          aria-label="Close navigation"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="mt-9 space-y-1" aria-label="Chat navigation">
        {navigation.map(([Icon, label, href]) => {
          const active = pathname === href;
          return (
            <Link
              key={label}
              href={href}
              onClick={close}
              aria-current={active ? "page" : undefined}
              className={`flex h-12 items-center gap-4 rounded-xl px-4 text-[14.5px] font-semibold transition ${
                active
                  ? "bg-cobalt/[.08] text-cobalt"
                  : "text-ink-soft hover:bg-paper hover:text-ink"
              }`}
            >
              <Icon className="h-5 w-5" strokeWidth={active ? 2.4 : 2} />
              <span>{label}</span>
              {active && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-cobalt" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex items-center gap-3 border-t border-ink/8 pt-5">
        <span className="relative">
          <Avatar initials="U" size="md" />
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-coral" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-[13px] font-bold text-ink">Account</p>
          <p className="font-mono text-[10px] uppercase tracking-[.05em] text-coral">
            Online
          </p>
        </div>
        <button
          type="button"
          className="ml-auto grid h-9 w-9 place-items-center rounded-xl text-ink-soft transition hover:bg-paper hover:text-ink"
          aria-label="Log out"
        >
          <LogOut className="h-4.5 w-4.5" />
        </button>
      </div>
    </aside>
  );
}

export default function ChatShell({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { notifications, unread, markAllRead } = useSocket();
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const openNotifications = async () => {
    const willOpen = !notificationsOpen;
    setNotificationsOpen(willOpen);
    if (willOpen) await markAllRead();
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-paper text-ink">
      <div className="hidden h-full shrink-0 lg:block">
        <Sidebar close={() => {}} />
      </div>

      {menuOpen && (
        <button
          className="fixed inset-0 z-40 bg-ink/25 lg:hidden"
          onClick={() => setMenuOpen(false)}
          aria-label="Close navigation overlay"
        />
      )}
      <div
        className={`fixed inset-y-0 left-0 z-50 transition-transform lg:hidden ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <Sidebar close={() => setMenuOpen(false)} />
      </div>

      <div className="flex h-full min-w-0 flex-1 flex-col">
        <header className="flex h-[86px] shrink-0 items-center gap-3 border-b border-ink/8 bg-white px-4 sm:px-8 lg:px-8">
          <button
            onClick={() => setMenuOpen(true)}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-ink/10 text-ink-soft lg:hidden"
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </button>

          <label className="flex h-11 min-w-0 max-w-[770px] flex-1 items-center gap-3 rounded-xl bg-paper px-4 text-ink-soft">
            <CircleUserRound className="h-5 w-5 shrink-0" />
            <input
              className="min-w-0 flex-1 bg-transparent text-[13.5px] text-ink outline-none placeholder:text-ink-soft"
              type="search"
              placeholder="Search anything..."
              aria-label="Search anything"
            />
            <kbd className="hidden font-mono text-[10px] font-semibold text-ink-soft sm:inline">
              ⌘ K
            </kbd>
          </label>

          <div className="ml-auto flex items-center gap-2 sm:gap-5">
            <div className="relative">
              <button
                onClick={openNotifications}
                className="relative grid h-10 w-10 place-items-center rounded-xl text-ink-soft transition hover:bg-paper hover:text-cobalt"
                aria-label="Notifications"
                aria-expanded={notificationsOpen}
              >
                <Bell className="h-5 w-5" />
                {unread > 0 && (
                  <span className="absolute right-1 top-1 grid min-w-4 place-items-center rounded-full bg-coral px-1 text-[9.5px] font-bold text-white">
                    {unread > 9 ? "9+" : unread}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <>
                  <button
                    className="fixed inset-0 z-20"
                    onClick={() => setNotificationsOpen(false)}
                    aria-label="Close notifications"
                  />
                  <section
                    className="absolute right-0 z-30 mt-2 w-80 rounded-xl border border-ink/8 bg-white p-3 shadow-[0_20px_50px_rgba(20,22,27,.14)]"
                    aria-label="Recent notifications"
                  >
                    <h2 className="px-2 pb-2 font-display text-[13.5px] font-bold text-ink">
                      Notifications
                    </h2>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length ? (
                        notifications.map((item) => (
                          <div
                            key={item.id}
                            className={`rounded-lg px-2 py-2 text-[13px] ${
                              item.readAt
                                ? "text-ink-soft"
                                : "bg-cobalt/[.06] text-ink"
                            }`}
                          >
                            <p className="font-semibold">{item.title}</p>
                            <p className="text-[11.5px]">{item.description}</p>
                          </div>
                        ))
                      ) : (
                        <p className="px-2 py-4 text-[13px] text-ink-soft">
                          You&apos;re all caught up.
                        </p>
                      )}
                    </div>
                  </section>
                </>
              )}
            </div>

            <span className="relative hidden sm:block">
              <Avatar initials="ET" size="md" />
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-coral" />
            </span>
          </div>
        </header>

        <div className="min-h-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
