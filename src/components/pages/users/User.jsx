"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { UserRoundPlus, Clock, Check } from "lucide-react";

import api from "@/lib/api";
import Avatar from "@/components/shared/Avatar";

const UsersPage = ({ users = [] }) => {
  const router = useRouter();

  const [actionLoading, setActionLoading] = useState(null);

  const sendRequest = async (receiverId) => {
    try {
      setActionLoading(receiverId);

      await api.post("/friends/requests", {
        receiverId,
      });

      toast.success("Friend request sent");

      router.refresh();
    } catch (e) {
      toast.error(e.response?.data?.message || e.message);
    } finally {
      setActionLoading(null);
    }
  };

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

  const cancelRequest = async (requestId) => {
    try {
      setActionLoading(requestId);

      await api.delete(`/friends/requests/${requestId}`);

      toast.success("Request cancelled");

      router.refresh();
    } catch (e) {
      toast.error(e.response?.data?.message || e.message);
    } finally {
      setActionLoading(null);
    }
  };

  const renderAction = (u) => {
    const isLoading = actionLoading === u.id || actionLoading === u.requestId;

    if (u.friendStatus === "none") {
      return (
        <button
          disabled={isLoading}
          onClick={() => sendRequest(u.id)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-cobalt px-3.5 py-2 text-[12.5px] font-bold text-white transition hover:bg-cobalt-deep disabled:cursor-not-allowed disabled:opacity-50"
        >
          <UserRoundPlus className="h-3.5 w-3.5" />

          {isLoading ? "Sending..." : "Add friend"}
        </button>
      );
    }

    if (u.friendStatus === "pending_sent") {
      return (
        <button
          disabled={isLoading}
          onClick={() => cancelRequest(u.requestId)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-ink/12 px-3.5 py-2 text-[12.5px] font-semibold text-ink-soft transition hover:border-ink/25 hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Clock className="h-3.5 w-3.5" />

          {isLoading ? "Cancelling..." : "Cancel request"}
        </button>
      );
    }

    if (u.friendStatus === "pending_received") {
      return (
        <button
          disabled={isLoading}
          onClick={() => acceptRequest(u.requestId)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-coral px-3.5 py-2 text-[12.5px] font-bold text-white transition hover:bg-[#E8461F] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Check className="h-3.5 w-3.5" />

          {isLoading ? "Accepting..." : "Accept request"}
        </button>
      );
    }

    return null;
  };

  return (
    <main className="mx-auto h-full max-w-5xl overflow-y-auto p-5 sm:p-8">
      <p className="font-mono text-[10.5px] font-bold uppercase tracking-[.08em] text-cobalt">
        People
      </p>

      <h1 className="mt-1 font-display text-[26px] font-bold tracking-[-.03em] text-ink">
        Discover users
      </h1>

      <div className="mt-5 space-y-2.5">
        {users.map((u) => (
          <div
            key={u.id}
            className="flex items-center justify-between gap-3 rounded-xl border border-ink/8 bg-white p-4 transition hover:border-ink/15"
          >
            <div className="flex min-w-0 items-center gap-3">
              <Avatar name={u.username} />

              <b className="truncate text-[14px] font-bold text-ink">
                {u.username}
              </b>
            </div>

            {renderAction(u)}
          </div>
        ))}
      </div>

      {!users.length && (
        <div className="mt-14 flex flex-col items-center gap-2 text-center">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-paper text-ink-soft">
            <UserRoundPlus className="h-5 w-5" />
          </span>

          <p className="text-[13px] font-semibold text-ink">No users to show</p>

          <p className="text-[12px] text-ink-soft">
            Check back later — new people join all the time.
          </p>
        </div>
      )}
    </main>
  );
};

export default UsersPage;
