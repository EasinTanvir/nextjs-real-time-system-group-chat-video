"use client";

import { useSocket } from "@/providers/SocketContext";
import { useState } from "react";
import { Bell, Menu, MessageCircle } from "lucide-react";
import Link from "next/link";

import Sidebar from "./Sidebar";
import Avatar from "./Avatar";

const ChatLogo = () => {
  return (
    <Link
      href="/"
      className="group flex items-center gap-2.5"
      aria-label="Chatify home"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 text-white shadow-sm transition-transform duration-200 group-hover:scale-105">
        <MessageCircle className="h-[18px] w-[18px]" />
      </span>

      <span className="font-display text-[18px] font-bold tracking-tight text-slate-950">
        Chatify
      </span>
    </Link>
  );
};

const ChatShell = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const { notifications, unread, markAllRead } = useSocket();

  const openNotifications = async () => {
    const willOpen = !notificationsOpen;

    setNotificationsOpen(willOpen);

    if (willOpen) {
      await markAllRead();
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f8fafc] text-slate-950">
      {/* Desktop sidebar */}
      <div className="hidden h-full shrink-0 lg:block">
        <Sidebar close={() => {}} />
      </div>

      {/* Mobile overlay */}
      {menuOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-slate-950/25 backdrop-blur-[2px] lg:hidden"
          onClick={() => setMenuOpen(false)}
          aria-label="Close navigation overlay"
        />
      )}

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transition-transform duration-300 lg:hidden ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar close={() => setMenuOpen(false)} />
      </div>

      {/* Main application */}
      <div className="flex h-full min-w-0 flex-1 flex-col">
        {/* Header */}
        <header className="relative z-30 flex h-[72px] shrink-0 items-center border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-xl sm:px-6 lg:h-[78px] lg:px-8">
          {/* Mobile menu */}
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="mr-3 grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 lg:hidden"
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Mobile logo */}
          <div className="lg:hidden">
            <ChatLogo />
          </div>

          {/* Desktop subtle page area */}
          <div className="hidden lg:block">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />

              <span className="text-xs font-semibold text-slate-400">
                Messages
              </span>
            </div>
          </div>

          {/* Right actions */}
          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            {/* Notifications */}
            <div className="relative">
              <button
                type="button"
                onClick={openNotifications}
                className={`relative grid h-10 w-10 place-items-center rounded-xl border transition ${
                  notificationsOpen
                    ? "border-emerald-200 bg-emerald-50 text-emerald-600"
                    : "border-transparent text-slate-500 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                }`}
                aria-label="Notifications"
                aria-expanded={notificationsOpen}
              >
                <Bell className="h-[18px] w-[18px]" />

                {unread > 0 && (
                  <span className="absolute right-1 top-1 grid min-w-[16px] place-items-center rounded-full bg-emerald-500 px-1 text-[9px] font-bold leading-4 text-white shadow-sm">
                    {unread > 9 ? "9+" : unread}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <>
                  {/* Outside click */}
                  <button
                    type="button"
                    className="fixed inset-0 z-20 cursor-default"
                    onClick={() => setNotificationsOpen(false)}
                    aria-label="Close notifications"
                  />

                  {/* Notification panel */}
                  <section
                    className="absolute right-0 z-30 mt-3 w-[calc(100vw-32px)] max-w-[340px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_25px_70px_rgba(15,23,42,0.14)]"
                    aria-label="Recent notifications"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3.5">
                      <div>
                        <h2 className="font-display text-sm font-bold text-slate-900">
                          Notifications
                        </h2>

                        <p className="mt-0.5 text-[10px] text-slate-400">
                          Recent activity
                        </p>
                      </div>

                      {unread > 0 && (
                        <span className="rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-bold text-emerald-600">
                          {unread} new
                        </span>
                      )}
                    </div>

                    {/* Notification list */}
                    <div className="max-h-80 overflow-y-auto p-2">
                      {notifications.length ? (
                        notifications.map((item) => (
                          <Link
                            key={item.id}
                            href="/chat/friends"
                            onClick={() => setNotificationsOpen(false)}
                            className={`block rounded-xl px-3 py-3 transition hover:bg-slate-50 ${
                              item.readAt ? "" : "bg-emerald-50/60"
                            }`}
                          >
                            <div className="flex gap-3">
                              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                                <Bell className="h-3.5 w-3.5" />
                              </div>

                              <div className="min-w-0">
                                <p className="text-xs font-bold text-slate-800">
                                  {item.title}
                                </p>

                                <p className="mt-0.5 text-[11px] leading-5 text-slate-500">
                                  {item.description}
                                </p>
                              </div>
                            </div>
                          </Link>
                        ))
                      ) : (
                        <div className="px-3 py-8 text-center">
                          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
                            <Bell className="h-4 w-4" />
                          </div>

                          <p className="mt-3 text-xs font-semibold text-slate-600">
                            You&rsquo;re all caught up
                          </p>

                          <p className="mt-1 text-[10px] text-slate-400">
                            No new notifications.
                          </p>
                        </div>
                      )}
                    </div>
                  </section>
                </>
              )}
            </div>

            {/* Profile */}
            <button
              type="button"
              className="relative rounded-full outline-none ring-offset-2 transition focus-visible:ring-2 focus-visible:ring-emerald-500"
              aria-label="Open profile"
            >
              <Avatar initials="ET" size="md" />

              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
            </button>
          </div>
        </header>

        {/* Page */}
        <div className="min-h-0 flex-1">{children}</div>
      </div>
    </div>
  );
};

export default ChatShell;
