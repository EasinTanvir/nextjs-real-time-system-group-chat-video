"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "@/lib/api";

const FriendPage = () => {
  const [friends, setFriends] = useState([]);
  const [incoming, setIncoming] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const [f, i] = await Promise.all([
        api.get("/friends"),
        api.get("/friends/requests/incoming"),
      ]);
      setFriends(f.data.data || []);
      setIncoming(i.data.data || []);
    } catch (e) {
      toast.error(e.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const acceptRequest = async (requestId) => {
    try {
      await api.post(`/friends/requests/${requestId}/accept`);
      toast.success("Friend request accepted");
      load();
    } catch (e) {
      toast.error(e.response?.data?.message || e.message);
    }
  };

  const rejectRequest = async (requestId) => {
    try {
      await api.post(`/friends/requests/${requestId}/reject`);
      toast.success("Friend request rejected");
      load();
    } catch (e) {
      toast.error(e.response?.data?.message || e.message);
    }
  };

  return (
    <main className="mx-auto max-w-5xl p-5 sm:p-8">
      {incoming.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold">Friend Requests</h2>
          {incoming.map((r) => (
            <div
              key={r.id}
              className="mt-3 flex items-center justify-between rounded-xl border border-slate-200 p-4"
            >
              <b>{r.sender?.username}</b>
              <div className="flex gap-2">
                <button
                  onClick={() => acceptRequest(r.id)}
                  className="rounded-lg bg-green-600 px-3 py-1.5 text-sm text-white"
                >
                  Accept
                </button>
                <button
                  onClick={() => rejectRequest(r.id)}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-600"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </section>
      )}

      <h1 className="text-3xl font-bold">Friends</h1>
      {friends.map((f) => (
        <div
          key={f.id}
          className="mt-3 flex items-center justify-between rounded-xl border border-slate-200 p-4"
        >
          <b>{f.username}</b>
          {f.conversationId && (
            <Link
              href={`/chat/conversation/${f.conversationId}`}
              className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm text-white"
            >
              Message
            </Link>
          )}
        </div>
      ))}

      {loading ? (
        <p className="mt-8 text-slate-500">Loading friends…</p>
      ) : (
        !friends.length && (
          <p className="mt-8 text-slate-500">No friends yet.</p>
        )
      )}
    </main>
  );
};

export default FriendPage;
