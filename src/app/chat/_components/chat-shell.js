"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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
import { useAuth } from "@/providers/auth-provider";
import api from "@/lib/api";
import { connectSocket, getSocket } from "@/lib/socket";

const navigation = [
  [MessageCircle, "Chats", "/chat"],
  [UsersRound, "Users", "/chat/users"],
  [UserRoundPlus, "Friends", "/chat/friends"],
];

function Brand() {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label="Chatify home">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-[0_9px_18px_rgba(37,99,235,.25)]">
        <MessageCircle className="h-5 w-5" strokeWidth={2.4} />
      </span>
      <span className="text-[23px] font-bold tracking-[-.055em] text-slate-900">Chatify</span>
    </Link>
  );
}

function Avatar({ initials, color, size = "md" }) {
  const sizes = { sm: "h-7 w-7 text-[8px]", md: "h-9 w-9 text-[10px]" };
  return <span className={`grid shrink-0 place-items-center rounded-full bg-gradient-to-br ${color} font-bold text-slate-700 ${sizes[size]}`}>{initials}</span>;
}

function Sidebar({ close }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  return (
    <aside className="flex h-full w-[260px] flex-col border-r border-slate-200/80 bg-white px-5 py-7">
      <div className="flex items-center justify-between">
        <Brand />
        <button onClick={close} className="grid h-9 w-9 place-items-center rounded-lg text-slate-500 lg:hidden" aria-label="Close navigation">
          <X className="h-5 w-5" />
        </button>
      </div>
      <nav className="mt-9 space-y-1" aria-label="Chat navigation">
        {navigation.map(([Icon, label, href, count]) => {
          const active = pathname === href;
          return (
            <Link key={label} href={href} onClick={close} aria-current={active ? "page" : undefined} className={`flex h-12 items-center gap-4 rounded-xl px-4 text-[15px] font-semibold transition ${active ? "bg-gradient-to-r from-blue-50 to-indigo-50/90 text-blue-600" : "text-slate-700 hover:bg-slate-50 hover:text-blue-600"}`}>
              <Icon className="h-5 w-5" strokeWidth={active ? 2.4 : 2} />
              <span>{label}</span>
              {count && <span className={`ml-auto grid h-6 min-w-6 place-items-center rounded-full px-1 text-xs font-bold ${active ? "bg-blue-100 text-blue-600" : "bg-indigo-100 text-indigo-600"}`}>{count}</span>}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto flex items-center gap-3 border-t border-slate-100 pt-5">
        <span className="relative"><Avatar initials={(user?.displayName || "U").slice(0,2).toUpperCase()} color="from-amber-300 to-orange-200" /><span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" /></span>
        <div className="min-w-0"><p className="truncate text-sm font-bold text-slate-900">{user?.displayName || "Loading…"}</p><p className="text-xs text-slate-500">Online</p></div>
        <button type="button" onClick={logout} className="ml-auto grid h-9 w-9 place-items-center rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100" aria-label="Log out"><LogOut className="h-5 w-5" /></button>
      </div>
    </aside>
  );
}

export default function ChatShell({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]); const [unread, setUnread] = useState(0); const [notificationsOpen, setNotificationsOpen] = useState(false);
  const loadNotifications = async () => { try { const [items, count] = await Promise.all([api.get("/notifications"), api.get("/notifications/unread-count")]); setNotifications(items); setUnread(count.count); } catch {} };
  useEffect(() => { const timer = setTimeout(loadNotifications, 0); const socket = getSocket(); const received = ({ notification }) => { setNotifications((items) => [notification, ...items.filter((item) => item.id !== notification.id)].slice(0, 10)); setUnread((count) => count + 1); }; socket.on("notification:new", received); connectSocket().catch(() => {}); return () => { clearTimeout(timer); socket.off("notification:new", received); }; }, []);
  const openNotifications = async () => { setNotificationsOpen((open) => !open); if (!notificationsOpen && unread) { try { await api.patch("/notifications/read-all"); setNotifications((items) => items.map((item) => ({ ...item, readAt: item.readAt || new Date().toISOString() }))); setUnread(0); } catch {} } };
  return (
    <div className="min-h-screen bg-[#fcfdff] text-slate-900 lg:flex">
      <div className="hidden h-screen shrink-0 lg:sticky lg:top-0 lg:block"><Sidebar close={() => {}} /></div>
      {menuOpen && <button className="fixed inset-0 z-40 bg-slate-950/20 lg:hidden" onClick={() => setMenuOpen(false)} aria-label="Close navigation overlay" />}
      <div className={`fixed inset-y-0 left-0 z-50 transition-transform lg:hidden ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}><Sidebar close={() => setMenuOpen(false)} /></div>
      <div className="min-w-0 flex-1">
        <header className="flex h-[90px] items-center gap-3 border-b border-slate-200/80 bg-white px-4 sm:px-8 lg:px-8">
          <button onClick={() => setMenuOpen(true)} className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-slate-200 text-slate-700 lg:hidden" aria-label="Open navigation"><Menu className="h-5 w-5" /></button>
          <label className="flex h-11 min-w-0 max-w-[770px] flex-1 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/70 px-4 text-slate-500 shadow-[0_2px_5px_rgba(15,23,42,.02)]">
            <CircleUserRound className="h-5 w-5 shrink-0" />
            <input className="min-w-0 flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-500" type="search" placeholder="Search anything..." aria-label="Search anything" />
            <kbd className="hidden rounded-md text-xs font-semibold text-slate-500 sm:inline">⌘ K</kbd>
          </label>
          <div className="ml-auto flex items-center gap-2 sm:gap-5">
            <div className="relative"><button onClick={openNotifications} className="relative grid h-10 w-10 place-items-center rounded-xl text-slate-600 transition hover:bg-slate-50 hover:text-blue-600" aria-label="Notifications" aria-expanded={notificationsOpen}><Bell className="h-5 w-5" />{unread > 0 && <span className="absolute right-1 top-1 grid min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">{unread > 9 ? "9+" : unread}</span>}</button>{notificationsOpen && <section className="absolute right-0 z-30 mt-2 w-80 rounded-xl border border-slate-200 bg-white p-3 shadow-xl" aria-label="Recent notifications"><h2 className="px-2 pb-2 text-sm font-bold">Notifications</h2>{notifications.length ? notifications.map((item) => <div key={item.id} className={`rounded-lg px-2 py-2 text-sm ${item.readAt ? "text-slate-600" : "bg-blue-50 text-slate-900"}`}><p className="font-semibold">{item.title}</p><p className="text-xs">{item.description}</p></div>) : <p className="px-2 py-4 text-sm text-slate-500">You&apos;re all caught up.</p>}</section>}</div>
            <span className="relative hidden sm:block"><Avatar initials="ET" color="from-amber-300 to-orange-200" /><span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" /></span>
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}
