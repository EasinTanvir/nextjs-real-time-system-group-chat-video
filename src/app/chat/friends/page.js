"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MessageCircle, UsersRound, Check, X as XIcon } from "lucide-react";
import api from "@/lib/api";

const TONES = [
  "from-cobalt to-cobalt-deep",
  "from-coral to-[#E8461F]",
  "from-ink to-[#3A3F4B]",
];
function toneFromName(name = "") {
  const code = name.charCodeAt(0) || 0;
  return TONES[code % TONES.length];
}

function Avatar({ name }) {
  const initial = name?.[0]?.toUpperCase() || "?";
  return (
    <span
      className={`grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br font-bold text-white ${toneFromName(name)}`}
    >
      {initial}
    </span>
  );
}

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
    <main className="mx-auto h-full max-w-5xl overflow-y-auto p-5 sm:p-8">
      {incoming.length > 0 && (
        <section className="mb-9">
          <p className="font-mono text-[10.5px] font-bold uppercase tracking-[.08em] text-coral">
            {incoming.length} pending
          </p>
          <h2 className="mt-1 font-display text-[19px] font-bold text-ink">
            Friend requests
          </h2>

          <div className="mt-4 space-y-2.5">
            {incoming.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-coral/25 bg-coral-soft/40 p-4"
              >
                <div className="flex items-center gap-3">
                  <Avatar name={r.sender?.username} />
                  <b className="text-[14px] font-bold text-ink">
                    {r.sender?.username}
                  </b>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => acceptRequest(r.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-coral px-3.5 py-2 text-[12.5px] font-bold text-white transition hover:bg-[#E8461F]"
                  >
                    <Check className="h-3.5 w-3.5" /> Accept
                  </button>
                  <button
                    onClick={() => rejectRequest(r.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-ink/12 px-3.5 py-2 text-[12.5px] font-semibold text-ink-soft transition hover:border-ink/25 hover:text-ink"
                  >
                    <XIcon className="h-3.5 w-3.5" /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <p className="font-mono text-[10.5px] font-bold uppercase tracking-[.08em] text-cobalt">
        Your circle
      </p>
      <h1 className="mt-1 font-display text-[26px] font-bold tracking-[-.03em] text-ink">
        Friends
      </h1>

      {loading && (
        <div className="mt-5 space-y-2.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="flex animate-pulse items-center gap-3 rounded-xl border border-ink/8 bg-white p-4"
            >
              <div className="h-11 w-11 rounded-full bg-paper-deep" />
              <div className="h-3 w-32 rounded bg-paper-deep" />
            </div>
          ))}
        </div>
      )}

      {!loading && (
        <div className="mt-5 space-y-2.5">
          {friends.map((f) => (
            <div
              key={f.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-ink/8 bg-white p-4 transition hover:border-ink/15"
            >
              <div className="flex items-center gap-3">
                <Avatar name={f.username} />
                <b className="text-[14px] font-bold text-ink">{f.username}</b>
              </div>
              {f.conversationId && (
                <Link
                  href={`/chat/conversation/${f.conversationId}`}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-cobalt px-3.5 py-2 text-[12.5px] font-bold text-white transition hover:bg-cobalt-deep"
                >
                  <MessageCircle className="h-3.5 w-3.5" /> Message
                </Link>
              )}
            </div>
          ))}
        </div>
      )}

      {!loading && !friends.length && (
        <div className="mt-14 flex flex-col items-center gap-2 text-center">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-paper text-ink-soft">
            <UsersRound className="h-5 w-5" />
          </span>
          <p className="text-[13px] font-semibold text-ink">No friends yet</p>
          <p className="text-[12px] text-ink-soft">
            Head to{" "}
            <Link href="/chat/users" className="font-semibold text-cobalt">
              Discover
            </Link>{" "}
            to find people.
          </p>
        </div>
      )}
    </main>
  );
};

export default FriendPage;
