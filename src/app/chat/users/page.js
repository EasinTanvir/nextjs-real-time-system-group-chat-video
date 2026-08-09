"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "@/lib/api";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/users/discover");
      setUsers(data.data || []);
    } catch (e) {
      toast.error(e.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const sendRequest = async (receiverId) => {
    try {
      await api.post("/friends/requests", { receiverId });
      toast.success("Friend request sent");
      load();
    } catch (e) {
      toast.error(e.response?.data?.message || e.message);
    }
  };

  const acceptRequest = async (requestId) => {
    try {
      await api.post(`/friends/requests/${requestId}/accept`);
      toast.success("Friend request accepted");
      load();
    } catch (e) {
      toast.error(e.response?.data?.message || e.message);
    }
  };

  const cancelRequest = async (requestId) => {
    try {
      await api.delete(`/friends/requests/${requestId}`);
      toast.success("Request cancelled");
      load();
    } catch (e) {
      toast.error(e.response?.data?.message || e.message);
    }
  };

  const renderAction = (u) => {
    if (u.friendStatus === "none") {
      return (
        <button
          onClick={() => sendRequest(u.id)}
          className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm text-white"
        >
          Add Friend
        </button>
      );
    }
    if (u.friendStatus === "pending_sent") {
      return (
        <button
          onClick={() => cancelRequest(u.requestId)}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-600"
        >
          Cancel Request
        </button>
      );
    }
    if (u.friendStatus === "pending_received") {
      return (
        <button
          onClick={() => acceptRequest(u.requestId)}
          className="rounded-lg bg-green-600 px-3 py-1.5 text-sm text-white"
        >
          Accept Request
        </button>
      );
    }
    return null;
  };

  return (
    <main className="mx-auto max-w-5xl p-5 sm:p-8">
      <h1 className="text-3xl font-bold">Discover Users</h1>

      {users.map((u) => (
        <div
          key={u.id}
          className="mt-3 flex items-center justify-between rounded-xl border border-slate-200 p-4"
        >
          <div>
            <b>{u.username}</b>
          </div>
          {renderAction(u)}
        </div>
      ))}

      {loading ? (
        <p className="mt-8 text-slate-500">Loading users…</p>
      ) : (
        !users.length && (
          <p className="mt-8 text-slate-500">No users to show.</p>
        )
      )}
    </main>
  );
};

export default UsersPage;
