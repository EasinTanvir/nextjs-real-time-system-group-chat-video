"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MessageCircle, UsersRound, Check, X as XIcon } from "lucide-react";

import api from "@/lib/api";
import Avatar from "@/components/shared/Avatar";
import { useSocket } from "@/providers/SocketContext";

const Friend = ({ friendData, incoming: incomingProp = [] }) => {
  const [friends, setFriends] = useState([]);
  const [incoming, setIncoming] = useState([]);
  const { socket } = useSocket();
  const router = useRouter();

  const [actionLoading, setActionLoading] = useState(null);

  const acceptRequest = async (requestId) => {
    try {
      setActionLoading(requestId);
      await api.post(`/friends/requests/${requestId}/accept`);
      toast.success("Friend request accepted");
      router.refresh();
    } catch (e) {
      toast.error(e.response?.data?.message || e.message);
    } finally {
      setActionLoading(null);
    }
  };

  const rejectRequest = async (requestId) => {
    try {
      setActionLoading(requestId);
      await api.post(`/friends/requests/${requestId}/reject`);
      toast.success("Friend request rejected");
      setIncoming((prev) => prev.filter((r) => r.id !== requestId)); // optimistic, instant
    } catch (e) {
      toast.error(e.response?.data?.message || e.message);
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => {
    if (!friendData) return;
    setFriends(friendData);
  }, [friendData]);

  useEffect(() => {
    setIncoming(incomingProp);
  }, [incomingProp]);

  useEffect(() => {
    if (!socket) return;

    const onRequestReceived = ({ request }) => {
      setIncoming((prev) =>
        prev.some((r) => r.id === request.id) ? prev : [request, ...prev],
      );
    };

    const onAccepted = () => {
      router.refresh(); // friends list needs full server data (username, conversationId etc.)
    };

    const onRejected = ({ requestId }) => {
      // safety net in case this fires from the OTHER side of a reject (not the one who clicked)
      setIncoming((prev) => prev.filter((r) => r.id !== requestId));
    };

    socket.on("friend:request-received", onRequestReceived);
    socket.on("friend:accepted", onAccepted);
    socket.on("friend:request-rejected", onRejected);

    return () => {
      socket.off("friend:request-received", onRequestReceived);
      socket.off("friend:accepted", onAccepted);
      socket.off("friend:request-rejected", onRejected);
    };
  }, [socket, router]);

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
            {incoming.map((r) => {
              const isLoading = actionLoading === r.id;

              return (
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
                      disabled={isLoading}
                      onClick={() => acceptRequest(r.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-coral px-3.5 py-2 text-[12.5px] font-bold text-white transition hover:bg-[#E8461F] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Check className="h-3.5 w-3.5" />

                      {isLoading ? "Processing..." : "Accept"}
                    </button>

                    <button
                      disabled={isLoading}
                      onClick={() => rejectRequest(r.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-ink/12 px-3.5 py-2 text-[12.5px] font-semibold text-ink-soft transition hover:border-ink/25 hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <XIcon className="h-3.5 w-3.5" />
                      Reject
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <p className="font-mono text-[10.5px] font-bold uppercase tracking-[.08em] text-cobalt">
        Your circle
      </p>

      <h1 className="mt-1 font-display text-[26px] font-bold tracking-[-.03em] text-ink">
        Friends
      </h1>

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
                prefetch
                href={`/chat/conversation/${f.conversationId}`}
                className="inline-flex items-center gap-1.5 rounded-lg bg-cobalt px-3.5 py-2 text-[12.5px] font-bold text-white transition hover:bg-cobalt-deep"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                Message
              </Link>
            )}
          </div>
        ))}
      </div>

      {!friends.length && (
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

export default Friend;
