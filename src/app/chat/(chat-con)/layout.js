"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { useSocket } from "@/providers/SocketContext";

function Avatar({ name, size = 40 }) {
  const initial = name?.[0]?.toUpperCase() || "?";
  return (
    <div
      style={{ width: size, height: size }}
      className="flex shrink-0 items-center justify-center rounded-full bg-blue-600 font-semibold text-white"
    >
      {initial}
    </div>
  );
}

export default function ChatLayout({ children }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const activeId = pathname.split("/chat/conversation/")[1];
  const { socket } = useSocket();

  const load = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/conversations");
      setItems(data.data || []);
    } catch (e) {
      toast.error(e.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (!socket) return;
    const onNewMessage = () => load(); // simplest: just refetch list
    socket.on("message:new", onNewMessage);
    return () => socket.off("message:new", onNewMessage);
  }, [socket]);

  return (
    <div className="flex h-full overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <aside className="flex w-full max-w-xs flex-col border-r border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-200 p-4">
          <h1 className="text-xl font-bold">Chats</h1>
          <Link
            href="/chat/users"
            className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm text-white"
          >
            + New
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading && (
            <p className="p-4 text-sm text-slate-400">Loading conversations…</p>
          )}

          {!loading && !items.length && (
            <p className="p-4 text-sm text-slate-400">
              No conversations yet. Add friends to start chatting.
            </p>
          )}

          {items.map((c) => {
            const active = c.conversationId === activeId;
            return (
              <Link
                key={c.conversationId}
                href={`/chat/conversation/${c.conversationId}`}
                className={`flex items-center gap-3 border-b border-slate-100 p-3 transition hover:bg-slate-50 ${
                  active ? "bg-blue-50" : ""
                }`}
              >
                <Avatar name={c.otherUser?.username} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <b className="truncate text-sm">{c.otherUser?.username}</b>
                    {c.unreadCount > 0 && (
                      <span className="ml-2 rounded-full bg-blue-600 px-1.5 py-0.5 text-[10px] text-white">
                        {c.unreadCount}
                      </span>
                    )}
                  </div>
                  <p className="truncate text-xs text-slate-500">
                    {c.lastMessage?.content || "No messages yet"}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">{children}</div>
    </div>
  );
}
