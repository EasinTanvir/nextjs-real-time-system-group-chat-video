"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { MessageCircle, UserPlus, UsersRound } from "lucide-react";
import api from "@/lib/api";
import { useSocket } from "@/providers/SocketContext";
import GroupCreateModal from "@/components/shared/GroupCreateModal";
import { useQueryClient } from "@tanstack/react-query";
import { useConversations } from "@/hooks/useConversations";
import Avatar from "@/components/shared/Avatar";

const ChatDetailsLayout = ({ children }) => {
  const [groupModalOpen, setGroupModalOpen] = useState(false);

  const pathname = usePathname();
  const activeId = pathname.split("/chat/conversation/")[1];

  const { socket } = useSocket();
  const queryClient = useQueryClient();
  const [items, setItems] = useState([]);

  const { data, isLoading: loading } = useConversations();

  useEffect(() => {
    if (data) {
      setItems(data);
    }
  }, [data]);

  useEffect(() => {
    if (!socket) return;

    const fetchSingleConversation = async (conversationId) => {
      try {
        const { data } = await api.get(`/conversations/${conversationId}`);

        queryClient.setQueryData(["conversations"], (prev = []) => {
          if (prev.some((c) => c.conversationId === conversationId)) {
            return prev;
          }

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

    const onSidebarUpdate = ({ conversationId, lastMessage, updatedAt }) => {
      const isActiveChat = String(activeId) === String(conversationId);

      queryClient.setQueryData(["conversations"], (prev = []) => {
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

    socket.on("sidebar:update", onSidebarUpdate);

    return () => {
      socket.off("sidebar:update", onSidebarUpdate);
    };
  }, [socket, activeId, queryClient]);

  useEffect(() => {
    if (!socket) return;

    const onConversationRead = ({ conversationId }) => {
      queryClient.setQueryData(["conversations"], (prev = []) =>
        prev.map((c) =>
          c.conversationId === conversationId
            ? {
                ...c,
                unreadCount: 0,
              }
            : c,
        ),
      );
    };

    socket.on("conversation:read", onConversationRead);

    return () => {
      socket.off("conversation:read", onConversationRead);
    };
  }, [socket, queryClient]);

  useEffect(() => {
    if (!socket) return;

    const onConversationNew = ({ conversation }) => {
      queryClient.setQueryData(["conversations"], (prev = []) => {
        if (
          prev.some((c) => c.conversationId === conversation.conversationId)
        ) {
          return prev;
        }

        return [conversation, ...prev];
      });
    };

    socket.on("conversation:new", onConversationNew);

    return () => {
      socket.off("conversation:new", onConversationNew);
    };
  }, [socket, queryClient]);

  useEffect(() => {
    if (!socket) return;
    const onMembersAdded = ({ conversationId, memberCount }) => {
      setItems((prev) =>
        prev.map((c) =>
          c.conversationId === conversationId ? { ...c, memberCount } : c,
        ),
      );
    };
    socket.on("group:members-added", onMembersAdded);
    return () => socket.off("group:members-added", onMembersAdded);
  }, [socket]);

  const totalUnread = items.reduce((sum, c) => sum + (c.unreadCount || 0), 0);

  return (
    <div className="flex h-full overflow-hidden bg-paper">
      <aside className="flex w-full max-w-xs flex-col border-r border-ink/8 bg-white">
        <div className="border-b border-ink/8 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-[19px] font-bold tracking-[-.03em] text-ink">
                Chats
              </h1>
              {totalUnread > 0 && (
                <p className="font-mono text-[10px] uppercase tracking-[.05em] text-coral">
                  {totalUnread} unread
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/chat/users"
                title="New chat"
                className="grid h-9 w-9 place-items-center rounded-lg bg-cobalt text-white transition hover:bg-cobalt-deep"
              >
                <UserPlus className="h-4 w-4" />
              </Link>

              <button
                onClick={() => setGroupModalOpen(true)}
                title="New group"
                className="grid h-9 w-9 place-items-center rounded-lg bg-ink text-white transition hover:bg-ink/85"
              >
                <UsersRound className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading && (
            <div className="space-y-1 p-2">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex animate-pulse items-center gap-3 p-2"
                >
                  <div className="h-10 w-10 rounded-full bg-paper-deep" />
                  <div className="flex-1 space-y-2">
                    <div className="h-2.5 w-2/3 rounded bg-paper-deep" />
                    <div className="h-2 w-1/2 rounded bg-paper-deep" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && !items.length && (
            <div className="flex flex-col items-center gap-2 px-6 py-14 text-center">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-paper-deep text-ink-soft">
                <MessageCircle className="h-5 w-5" />
              </span>
              <p className="text-[13px] font-semibold text-ink">
                No conversations yet
              </p>
              <p className="text-[11.5px] leading-5 text-ink-soft">
                Add a friend or start a group to begin chatting.
              </p>
            </div>
          )}

          {items.map((c) => {
            const active = c.conversationId === activeId;
            const displayName =
              c.type === "group" ? c.name : c.otherUser?.username;
            return (
              <Link
                key={c.conversationId}
                href={`/chat/conversation/${c.conversationId}`}
                className={`relative flex items-center gap-3 border-b border-ink/6 px-4 py-3 transition ${
                  active ? "bg-cobalt/[.06]" : "hover:bg-paper"
                }`}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 h-8 w-[3px] -translate-y-1/2 rounded-r-full bg-cobalt" />
                )}

                <Avatar name={displayName} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex min-w-0 items-center gap-1.5">
                      <b className="truncate text-[13px] font-bold text-ink">
                        {displayName}
                      </b>
                      {c.type === "group" && (
                        <span className="shrink-0 font-mono text-[9.5px] text-ink-soft">
                          ({c.memberCount})
                        </span>
                      )}
                    </span>
                    {c.unreadCount > 0 && (
                      <span className="shrink-0 rounded-full bg-coral px-1.5 py-0.5 text-[10px] font-bold text-white">
                        {c.unreadCount}
                      </span>
                    )}
                  </div>
                  <p className="truncate text-[11.5px] text-ink-soft">
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
              setItems((prev) => {
                if (prev.some((c) => c.conversationId === conversation.id))
                  return prev;
                return [
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
                ];
              })
            }
          />
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">{children}</div>
    </div>
  );
};

export default ChatDetailsLayout;
