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
    <div className="flex h-full min-h-0 flex-col">
      {/* Header */}
      <div className="shrink-0 border-b border-ink/8 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-[19px] font-bold tracking-[-.03em] text-ink">
              Conversations
            </h1>

            {totalUnread > 0 && (
              <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[.05em] text-coral">
                {totalUnread} unread
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* New chat */}
            <Link
              prefetch
              href="/chat/users"
              title="New chat"
              className="grid h-9 w-9 place-items-center rounded-lg bg-cobalt text-white transition hover:bg-cobalt-deep"
            >
              <UserPlus className="h-4 w-4" />
            </Link>

            {/* New group */}
            <button
              type="button"
              onClick={onGroupOpen}
              title="New group"
              className="grid h-9 w-9 place-items-center rounded-lg bg-ink text-white transition hover:bg-ink/85"
            >
              <UsersRound className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Conversation list */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        {/* Loading */}
        {loading && (
          <div className="space-y-1 p-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex animate-pulse items-center gap-3 rounded-xl p-3"
              >
                <div className="h-10 w-10 shrink-0 rounded-full bg-paper-deep" />

                <div className="flex-1 space-y-2">
                  <div className="h-2.5 w-2/3 rounded bg-paper-deep" />
                  <div className="h-2 w-1/2 rounded bg-paper-deep" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
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
                className={`relative flex items-center gap-3 border-b border-ink/6 px-4 py-3.5 transition ${
                  active ? "bg-cobalt/[.06]" : "hover:bg-paper"
                }`}
              >
                {/* Active indicator */}
                {active && (
                  <span className="absolute left-0 top-1/2 h-8 w-[3px] -translate-y-1/2 rounded-r-full bg-cobalt" />
                )}

                {/* Avatar */}
                <Avatar name={displayName} />

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex min-w-0 items-center gap-1.5">
                      <b className="truncate text-[13px] font-bold text-ink">
                        {displayName}
                      </b>

                      {conversation.type === "group" && (
                        <span className="shrink-0 font-mono text-[9.5px] text-ink-soft">
                          ({conversation.memberCount})
                        </span>
                      )}
                    </span>

                    {conversation.unreadCount > 0 && (
                      <span className="shrink-0 rounded-full bg-coral px-1.5 py-0.5 text-[10px] font-bold text-white">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>

                  <p className="truncate text-[11.5px] text-ink-soft">
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
