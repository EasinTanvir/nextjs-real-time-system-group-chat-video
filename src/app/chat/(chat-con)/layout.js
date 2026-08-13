"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { useSocket } from "@/providers/SocketContext";
import GroupCreateModal from "@/components/shared/GroupCreateModal";

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
  const [groupModalOpen, setGroupModalOpen] = useState(false);
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

    const onSidebarUpdate = ({ conversationId, lastMessage, updatedAt }) => {
      const isActiveChat = String(activeId) === String(conversationId);

      setItems((prev) => {
        const exists = prev.some((c) => c.conversationId === conversationId);

        if (!exists) {
          fetchSingleConversation(conversationId);
          return prev;
        }

        const updated = prev.map((c) =>
          c.conversationId === conversationId
            ? {
                ...c,
                lastMessage,
                lastMessageAt: updatedAt,
                unreadCount: isActiveChat ? 0 : (c.unreadCount || 0) + 1,
              }
            : c,
        );

        return updated.sort(
          (a, b) =>
            new Date(b.lastMessageAt || 0) - new Date(a.lastMessageAt || 0),
        );
      });
    };

    const fetchSingleConversation = async (conversationId) => {
      try {
        const { data } = await api.get(`/conversations/${conversationId}`);
        setItems((prev) => {
          if (prev.some((c) => c.conversationId === conversationId))
            return prev;
          return [
            {
              conversationId: data.data.id,
              otherUser: data.data.otherUser,
              lastMessage: null,
              lastMessageAt: data.data.lastMessageAt,
              unreadCount: 1,
            },
            ...prev,
          ];
        });
      } catch {}
    };

    socket.on("sidebar:update", onSidebarUpdate);
    return () => socket.off("sidebar:update", onSidebarUpdate);
  }, [socket, activeId]);

  useEffect(() => {
    if (!socket) return;

    const onConversationRead = ({ conversationId }) => {
      setItems((prev) =>
        prev.map((c) =>
          c.conversationId === conversationId ? { ...c, unreadCount: 0 } : c,
        ),
      );
    };

    socket.on("conversation:read", onConversationRead);
    return () => socket.off("conversation:read", onConversationRead);
  }, [socket]);

  useEffect(() => {
    if (!socket) return;

    const onConversationNew = ({ conversation }) => {
      setItems((prev) => {
        if (prev.some((c) => c.conversationId === conversation.conversationId))
          return prev;
        return [conversation, ...prev];
      });
    };

    socket.on("conversation:new", onConversationNew);
    return () => socket.off("conversation:new", onConversationNew);
  }, [socket]);
  return (
    <div className="flex h-full overflow-hidden bg-slate-50">
      <aside className="flex w-full max-w-xs flex-col border-r border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-200 p-4">
          <h1 className="text-xl font-bold">Chats</h1>
          <Link
            href="/chat/users"
            className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm text-white"
          >
            + New
          </Link>

          <button
            onClick={() => setGroupModalOpen(true)}
            className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm text-white"
          >
            + Group
          </button>
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
            const displayName =
              c.type === "group" ? c.name : c.otherUser?.username;
            return (
              <Link
                key={c.conversationId}
                href={`/chat/conversation/${c.conversationId}`}
                className={`flex items-center gap-3 border-b border-slate-100 p-3 transition hover:bg-slate-50 ${active ? "bg-blue-50" : ""}`}
              >
                <Avatar name={displayName} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex min-w-0 items-center gap-1.5">
                      <b className="truncate text-sm">{displayName}</b>
                      {c.type === "group" && (
                        <span className="shrink-0 text-xs text-slate-400">
                          ({c.memberCount})
                        </span>
                      )}
                    </span>
                    {c.unreadCount > 0 && (
                      <span className="shrink-0 rounded-full bg-blue-600 px-1.5 py-0.5 text-[10px] text-white">
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

          <GroupCreateModal
            open={groupModalOpen}
            onClose={() => setGroupModalOpen(false)}
            onCreated={(conversation) =>
              setItems((prev) => [
                {
                  conversationId: conversation.id,
                  type: "group",
                  name: conversation.name,
                  memberCount: 0,
                  otherUser: null,
                  lastMessage: null,
                  unreadCount: 0,
                },
                ...prev,
              ])
            }
          />
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">{children}</div>

      <GroupCreateModal
        open={groupModalOpen}
        onClose={() => setGroupModalOpen(false)}
        onCreated={(conversation) =>
          setItems((prev) => [
            {
              conversationId: conversation.id,
              type: "group",
              name: conversation.name,
              memberCount: 0,
              otherUser: null,
              lastMessage: null,
              unreadCount: 0,
            },
            ...prev,
          ])
        }
      />
    </div>
  );
}
