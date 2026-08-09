"use client";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "@/lib/api";

export default function UsersPage() {
  const [items, setItems] = useState([]),
    [search, setSearch] = useState(""),
    [loading, setLoading] = useState(true);
  const load = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/users", {
        params: { search, limit: 50 },
      });
      console.log(data);
      setItems(data.data.items);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }, [search]);
  useEffect(() => {
    const t = setTimeout(load, 250);

    s.on("friendship:updated", load);
    return () => {
      clearTimeout(t);
      s.off("friendship:updated", load);
    };
  }, [load]);
  const request = async (id) => {
    try {
      await api.post("/friend-requests", { receiverId: id });
      setItems((x) =>
        x.map((u) =>
          u.id === id ? { ...u, relationship: "outgoing_pending" } : u,
        ),
      );
      toast.success("Friend request sent.");
    } catch (e) {
      toast.error(e.message);
    }
  };
  const action = (u) =>
    u.relationship === "friends" ? (
      <span className="text-sm font-semibold text-emerald-600">Friends</span>
    ) : u.relationship === "outgoing_pending" ? (
      <span className="text-sm font-semibold text-amber-600">Pending</span>
    ) : u.relationship === "incoming_pending" ? (
      <a href="/chat/friends" className="text-sm font-semibold text-blue-600">
        Respond in Friends
      </a>
    ) : (
      <button
        className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
        onClick={() => request(u.id)}
      >
        Add friend
      </button>
    );
  return (
    <main className="mx-auto max-w-5xl p-5 sm:p-8">
      <h1 className="text-3xl font-bold">Discover users</h1>
      <input
        className="mt-6 w-full rounded-xl border border-slate-200 p-3"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name or username"
      />
      {items.map((u) => (
        <article
          key={u.id}
          className="mt-3 flex items-center justify-between gap-4 rounded-xl border border-slate-200 p-4"
        >
          <div className="min-w-0">
            <b>{u.displayName}</b>
            <p className="text-sm text-slate-500">@{u.username}</p>
            {u.bio && (
              <p className="truncate text-sm text-slate-600">{u.bio}</p>
            )}
          </div>
          {action(u)}
        </article>
      ))}
      {loading ? (
        <p className="mt-6 text-slate-500">Loading people…</p>
      ) : (
        !items.length && <p className="mt-6 text-slate-500">No users found.</p>
      )}
    </main>
  );
}
