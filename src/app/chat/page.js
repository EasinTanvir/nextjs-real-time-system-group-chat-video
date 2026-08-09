"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "@/lib/api";

export default function ChatPage() {
  const [items, setItems] = useState([]),
    [name, setName] = useState(""),
    [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/conversations", {
        params: { limit: 100 },
        withCredentials: true,
      });

      setItems(data.items || []);
    } catch (e) {
      console.log("chat error", e);
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);

  return (
    <main className="mx-auto max-w-5xl p-5 sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold">Conversations</h1>
        <form className="flex gap-2">
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3"
            placeholder="New group name"
          />
          <button className="rounded-xl bg-blue-600 px-3 py-2 text-white">
            Create group
          </button>
        </form>
      </div>
      {items.map((c) => (
        <Link
          key={c.id}
          href={`/chat/conversation/${c.id}`}
          className="mt-3 block rounded-xl border border-slate-200 p-4 transition hover:bg-slate-50"
        >
          <b>{c.type === "group" ? c.name : "Direct conversation"}</b>
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
            No conversations yet. Start from Friends or create a group.
          </p>
        )
      )}
    </main>
  );
}
