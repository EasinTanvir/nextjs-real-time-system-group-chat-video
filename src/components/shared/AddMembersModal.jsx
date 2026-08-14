"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "@/lib/api";

export default function AddMembersModal({
  open,
  onClose,
  conversationId,
  existingMemberIds = [],
  onAdded,
}) {
  const [friends, setFriends] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    (async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/friends");
        setFriends(data.data || []);
      } catch (e) {
        toast.error(e.response?.data?.message || e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [open]);

  const toggle = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    if (selected.size === 0) return;
    setSubmitting(true);
    try {
      const { data } = await api.post(`/groups/${conversationId}/members`, {
        memberIds: Array.from(selected),
      });
      toast.success("Members added");
      onAdded?.(data.data);
      setSelected(new Set());
      onClose();
    } catch (e) {
      toast.error(e.response?.data?.message || e.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  const addableFriends = friends.filter(
    (f) => !existingMemberIds.includes(f.id),
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl">
        <h2 className="text-lg font-bold">Add Members</h2>
        <form onSubmit={submit} className="mt-4 space-y-4">
          <div className="max-h-60 overflow-y-auto rounded-xl border border-slate-100">
            {loading && (
              <p className="p-3 text-sm text-slate-400">Loading friends…</p>
            )}
            {!loading && !addableFriends.length && (
              <p className="p-3 text-sm text-slate-400">
                All your friends are already in this group.
              </p>
            )}
            {addableFriends.map((f) => (
              <label
                key={f.id}
                className="flex cursor-pointer items-center gap-3 border-b border-slate-50 px-3 py-2 last:border-0 hover:bg-slate-50"
              >
                <input
                  type="checkbox"
                  checked={selected.has(f.id)}
                  onChange={() => toggle(f.id)}
                  className="h-4 w-4"
                />
                <span className="text-sm">{f.username}</span>
              </label>
            ))}
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm"
            >
              Cancel
            </button>
            <button
              disabled={submitting || selected.size === 0}
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm text-white disabled:opacity-50"
            >
              {submitting ? "Adding…" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
