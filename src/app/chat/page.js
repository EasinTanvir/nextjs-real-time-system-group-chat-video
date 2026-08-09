"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "@/lib/api";

export default function ChatPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <main className="mx-auto max-w-5xl p-5 sm:p-8">
      <h1 className="text-3xl font-bold">Conversations</h1>

      {items.map((c) => (
        <Link
          key={c.conversationId}
          href={`/chat/conversation/${c.conversationId}`}
          className="mt-3 block rounded-xl border border-slate-200 p-4 transition hover:bg-slate-50"
        >
          <div className="flex items-center justify-between">
            <b>{c.otherUser?.username}</b>
            {c.unreadCount > 0 && (
              <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs text-white">
                {c.unreadCount}
              </span>
            )}
          </div>
          <p className="truncate text-sm text-slate-500">
            {c.lastMessage?.content || "No messages yet"}
          </p>
        </Link>
      ))}

      {loading ? (
        <p className="mt-8 text-slate-500">Loading conversations…</p>
      ) : (
        !items.length && (
          <p className="mt-8 text-slate-500">
            No conversations yet. Add friends to start chatting.
          </p>
        )
      )}
    </main>
  );
}
