"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { MessageCircle, UserPlus, UsersRound } from "lucide-react";

import api from "@/lib/api";
import { useSocket } from "@/providers/SocketContext";
import GroupCreateModal from "@/components/shared/GroupCreateModal";
import { useQueryClient } from "@tanstack/react-query";
import { useConversations } from "@/hooks/useConversations";
import Avatar from "@/components/shared/Avatar";

const ChatListContext = createContext(null);

export const useChatList = () => useContext(ChatListContext);

function ChatList({ items, loading, totalUnread, activeId, onGroupOpen }) {
  return (
    <div className="flex h-full min-h-0 flex-col bg-white">
      {/* ================================================= */}
      {/* Header */}
      {/* ================================================= */}

      <div className="shrink-0 border-b border-slate-200/80 bg-white px-4 py-4 sm:px-5">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="font-display text-[19px] font-bold tracking-[-.035em] text-slate-950">
              Conversations
            </h1>

            {totalUnread > 0 ? (
              <div className="mt-1 flex items-center gap-1.5">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />

                  <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </span>

                <p className="font-mono text-[9.5px] font-medium uppercase tracking-[.08em] text-emerald-600">
                  {totalUnread} unread
                </p>
              </div>
            ) : (
              <p className="mt-1 text-[11px] text-slate-400">
                Your recent conversations
              </p>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            {/* New chat */}
            <Link
              prefetch
              href="/chat/users"
              title="New chat"
              aria-label="Start a new chat"
              className="group grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 text-white shadow-[0_6px_16px_rgba(16,185,129,0.16)] transition-all hover:-translate-y-0.5 hover:shadow-[0_9px_20px_rgba(16,185,129,0.22)]"
            >
              <UserPlus className="h-[16px] w-[16px] transition-transform group-hover:scale-105" />
            </Link>

            {/* New group */}
            <button
              type="button"
              onClick={onGroupOpen}
              title="New group"
              aria-label="Create a new group"
              className="grid h-9 w-9 place-items-center rounded-xl bg-slate-950 text-white transition-all hover:-translate-y-0.5 hover:bg-slate-800"
            >
              <UsersRound className="h-[16px] w-[16px]" />
            </button>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* Conversation list */}
      {/* ================================================= */}

      <div className="min-h-0 flex-1 overflow-y-auto">
        {/* Loading */}
        {loading && (
          <div className="space-y-1.5 p-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex animate-pulse items-center gap-3 rounded-xl px-3 py-3"
              >
                <div className="h-10 w-10 shrink-0 rounded-full bg-slate-100" />

                <div className="min-w-0 flex-1 space-y-2">
                  <div className="h-2.5 w-2/3 rounded-full bg-slate-100" />
                  <div className="h-2 w-1/2 rounded-full bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !items.length && (
          <div className="flex h-full min-h-[300px] flex-col items-center justify-center px-6 py-14 text-center">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-50 text-slate-400 ring-1 ring-slate-100">
              <MessageCircle className="h-5 w-5" />
            </span>

            <p className="mt-4 text-[13px] font-bold text-slate-700">
              No conversations yet
            </p>

            <p className="mt-1.5 max-w-[220px] text-[11.5px] leading-5 text-slate-400">
              Add a friend or start a group to begin chatting.
            </p>

            <Link
              href="/chat/users"
              className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-slate-950 px-3.5 py-2 text-[11px] font-bold text-white transition hover:bg-slate-800"
            >
              <UserPlus className="h-3.5 w-3.5" />
              Find people
            </Link>
          </div>
        )}

        {/* Conversations */}
        {!loading &&
          items.map((conversation) => {
            const active =
              String(conversation.conversationId) === String(activeId);

            const displayName =
              conversation.type === "group"
                ? conversation.name
                : conversation.otherUser?.username;

            return (
              <Link
                key={conversation.conversationId}
                href={`/chat/conversation/${conversation.conversationId}`}
                className={`group relative flex items-center gap-3 border-b border-slate-100 px-4 py-3.5 transition-all sm:px-5 ${
                  active
                    ? "bg-gradient-to-r from-emerald-50/80 to-cyan-50/40"
                    : "hover:bg-slate-50/80"
                }`}
              >
                {/* Active indicator */}
                {active && (
                  <span className="absolute left-0 top-1/2 h-8 w-[3px] -translate-y-1/2 rounded-r-full bg-gradient-to-b from-cyan-500 to-emerald-500" />
                )}

                {/* Avatar */}
                <div className="relative shrink-0">
                  <Avatar name={displayName} />

                  {active && (
                    <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
                  )}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex min-w-0 items-center gap-1.5">
                      <b
                        className={`truncate text-[13px] font-bold ${
                          active ? "text-slate-950" : "text-slate-800"
                        }`}
                      >
                        {displayName}
                      </b>

                      {conversation.type === "group" && (
                        <span className="shrink-0 rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-[8.5px] font-medium text-slate-400">
                          {conversation.memberCount}
                        </span>
                      )}
                    </span>

                    {conversation.unreadCount > 0 && (
                      <span className="grid min-w-[20px] shrink-0 place-items-center rounded-full bg-emerald-500 px-1.5 py-0.5 text-[9px] font-bold text-white shadow-sm">
                        {conversation.unreadCount > 99
                          ? "99+"
                          : conversation.unreadCount}
                      </span>
                    )}
                  </div>

                  <p
                    className={`mt-0.5 truncate text-[11.5px] leading-5 ${
                      conversation.unreadCount > 0
                        ? "font-medium text-slate-600"
                        : "text-slate-400"
                    }`}
                  >
                    {conversation.lastMessage?.content || "No messages yet"}
                  </p>
                </div>
              </Link>
            );
          })}
      </div>
    </div>
  );
}

const ChatDetailsLayout = ({ children }) => {
  const pathname = usePathname();

  const { socket } = useSocket();
  const queryClient = useQueryClient();

  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const [items, setItems] = useState([]);

  const { data, isLoading: loading } = useConversations();

  /*
   * Determines whether we're currently inside
   * /chat/conversation/[conversationId]
   */
  const isConversationDetails = pathname.startsWith("/chat/conversation/");

  /*
   * Extract conversation ID from URL.
   *
   * /chat/conversation
   * → null
   *
   * /chat/conversation/123
   * → 123
   */
  const activeId = isConversationDetails
    ? pathname.split("/chat/conversation/")[1]
    : null;

  /*
   * Sync query data into local list state.
   */
  useEffect(() => {
    if (data) {
      setItems(data);
    }
  }, [data]);

  /*
   * -----------------------------------------------
   * SOCKET: sidebar update
   * -----------------------------------------------
   */
  useEffect(() => {
    if (!socket) return;

    const fetchSingleConversation = async (conversationId) => {
      try {
        const { data } = await api.get(`/conversations/${conversationId}`);

        queryClient.setQueryData(["conversations"], (previous = []) => {
          if (
            previous.some(
              (conversation) => conversation.conversationId === conversationId,
            )
          ) {
            return previous;
          }

          return [
            {
              conversationId: data.data.id,
              otherUser: data.data.otherUser,
              lastMessage: null,
              lastMessageAt: data.data.lastMessageAt,
              unreadCount: 1,
            },
            ...previous,
          ];
        });
      } catch {
        // Ignore fetch errors from socket updates.
      }
    };

    const onSidebarUpdate = ({ conversationId, lastMessage, updatedAt }) => {
      const isActiveChat = String(activeId) === String(conversationId);

      queryClient.setQueryData(["conversations"], (previous = []) => {
        const exists = previous.some(
          (conversation) => conversation.conversationId === conversationId,
        );

        /*
         * Conversation doesn't exist in cache.
         * Fetch it and add it.
         */
        if (!exists) {
          fetchSingleConversation(conversationId);

          return previous;
        }

        const updated = previous.map((conversation) =>
          conversation.conversationId === conversationId
            ? {
                ...conversation,
                lastMessage,
                lastMessageAt: updatedAt,
                unreadCount: isActiveChat
                  ? 0
                  : (conversation.unreadCount || 0) + 1,
              }
            : conversation,
        );

        /*
         * Newest conversations first.
         */
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

  /*
   * -----------------------------------------------
   * SOCKET: conversation read
   * -----------------------------------------------
   */
  useEffect(() => {
    if (!socket) return;

    const onConversationRead = ({ conversationId }) => {
      queryClient.setQueryData(["conversations"], (previous = []) =>
        previous.map((conversation) =>
          conversation.conversationId === conversationId
            ? {
                ...conversation,
                unreadCount: 0,
              }
            : conversation,
        ),
      );
    };

    socket.on("conversation:read", onConversationRead);

    return () => {
      socket.off("conversation:read", onConversationRead);
    };
  }, [socket, queryClient]);

  /*
   * -----------------------------------------------
   * SOCKET: new conversation
   * -----------------------------------------------
   */
  useEffect(() => {
    if (!socket) return;

    const onConversationNew = ({ conversation }) => {
      queryClient.setQueryData(["conversations"], (previous = []) => {
        if (
          previous.some(
            (item) => item.conversationId === conversation.conversationId,
          )
        ) {
          return previous;
        }

        return [conversation, ...previous];
      });
    };

    socket.on("conversation:new", onConversationNew);

    return () => {
      socket.off("conversation:new", onConversationNew);
    };
  }, [socket, queryClient]);

  /*
   * -----------------------------------------------
   * SOCKET: group members added
   * -----------------------------------------------
   */
  useEffect(() => {
    if (!socket) return;

    const onMembersAdded = ({ conversationId, memberCount }) => {
      setItems((previous) =>
        previous.map((conversation) =>
          conversation.conversationId === conversationId
            ? {
                ...conversation,
                memberCount,
              }
            : conversation,
        ),
      );
    };

    socket.on("group:members-added", onMembersAdded);

    return () => {
      socket.off("group:members-added", onMembersAdded);
    };
  }, [socket]);

  const totalUnread = items.reduce(
    (sum, conversation) => sum + (conversation.unreadCount || 0),
    0,
  );

  return (
    <ChatListContext.Provider
      value={{
        /*
         * No drawer anymore.
         *
         * Keep these values temporarily so any existing
         * ConversationDetails code using useChatList()
         * doesn't crash.
         */
        listOpen: !isConversationDetails,

        toggleList: () => {},
      }}
    >
      <div className="flex h-full min-h-0 w-full overflow-hidden bg-paper">
        {/* ================================================= */}
        {/* DESKTOP / TABLET — md and above                  */}
        {/* ================================================= */}

        <aside className="hidden h-full w-full max-w-sm shrink-0 border-r border-ink/8 bg-white md:flex md:flex-col">
          <ChatList
            items={items}
            loading={loading}
            totalUnread={totalUnread}
            activeId={activeId}
            onGroupOpen={() => setGroupModalOpen(true)}
          />
        </aside>

        {/* ================================================= */}
        {/* MAIN AREA                                         */}
        {/* ================================================= */}

        <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          {/* Desktop details */}
          <div className="hidden h-full min-h-0 md:flex">{children}</div>

          {/* Mobile */}
          <div className="flex h-full min-h-0 md:hidden">
            {isConversationDetails ? (
              /*
               * Conversation selected:
               * details take the entire screen.
               */
              <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-white">
                {children}
              </div>
            ) : (
              /*
               * No conversation selected:
               * list takes the entire screen.
               */
              <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-white">
                <ChatList
                  items={items}
                  loading={loading}
                  totalUnread={totalUnread}
                  activeId={activeId}
                  onGroupOpen={() => setGroupModalOpen(true)}
                />
              </div>
            )}
          </div>
        </main>

        {/* Group creation modal */}
        <GroupCreateModal
          open={groupModalOpen}
          onClose={() => setGroupModalOpen(false)}
          onCreated={(conversation) => {
            setItems((previous) => {
              if (
                previous.some((item) => item.conversationId === conversation.id)
              ) {
                return previous;
              }

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
                ...previous,
              ];
            });
          }}
        />
      </div>
    </ChatListContext.Provider>
  );
};

export default ChatDetailsLayout;
