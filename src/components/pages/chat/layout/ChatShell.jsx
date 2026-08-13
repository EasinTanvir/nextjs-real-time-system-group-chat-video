"use client";

import { useSocket } from "@/providers/SocketContext";
import { useState } from "react";
import { Menu, Bell } from "lucide-react";
import Sidebar from "./Sidebar";
import Avatar from "./Avatar";
import Link from "next/link";

const ChatShell = ({ children }) => {
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
                            <Link href="/chat/friends">
                              <p className="font-semibold">{item.title}</p>
                              <p className="text-[11.5px]">
                                {item.description}
                              </p>{" "}
                            </Link>
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
};

export default ChatShell;
