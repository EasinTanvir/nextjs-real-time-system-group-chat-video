"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Loader2,
  Menu,
  Phone,
  Send,
  UserPlus,
  Video,
} from "lucide-react";
import api from "@/lib/api";
import { useSocket } from "@/providers/SocketContext";
import { useConversation } from "@/hooks/useConversations";
import { useConversationMessages } from "@/hooks/useConversationMessages";
import ActiveMembersDropdown from "./ActiveMembersDropdown";
import Avatar from "@/components/shared/Avatar";
import AddMembersModal from "@/components/shared/AddMembersModal";
import { useCall } from "@/providers/CallProvider";
import { useChatList } from "@/components/pages/chatDetails/ChatDetailsLayout";
import { useRouter } from "next/navigation";

export default function ConversationDetails({ user, conversationId }) {
  const { socket, onlineUsers } = useSocket();
  const { startCall } = useCall();
  const { toggleList } = useChatList();
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [addMembersOpen, setAddMembersOpen] = useState(false);

  const bottomRef = useRef(null);

  const currentUserId = String(user?.id);
  const isGroup = conversation?.type === "group";

  const {
    data: conversationData,
    isLoading: conversationLoading,
    error: conversationError,
  } = useConversation(conversationId);

  const {
    data: messagesData,
    isLoading: messagesLoading,
    error: messagesError,
  } = useConversationMessages(conversationId);

  const loading = conversationLoading || messagesLoading;

  const scrollToBottom = () =>
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });

  useEffect(() => {
    if (conversationData) {
      setConversation(conversationData);
    }
  }, [conversationData]);

  useEffect(() => {
    if (messagesData) {
      setMessages(messagesData);
    }
  }, [messagesData]);

  useEffect(() => {
    const error = conversationError || messagesError;

    if (!error) return;

    toast.error(
      error.response?.data?.message ||
        error.message ||
        "Failed to load conversation",
    );
  }, [conversationError, messagesError]);

  useEffect(() => {
    if (!conversationId || loading) return;

    const markAsRead = async () => {
      try {
        await api.post(`/conversations/${conversationId}/read`);
      } catch (e) {
        toast.error(e.response?.data?.message || e.message);
      }
    };

    markAsRead();
  }, [conversationId, loading]);

  useEffect(() => {
    if (!socket || !conversationId) return;

    const joinRoom = () => {
      console.log("Emitting conversation:join for:", conversationId);
      socket.emit("conversation:join", conversationId);
    };

    // 1. Try joining immediately if socket is connected
    if (socket.connected) {
      joinRoom();
    }

    // 2. Listen for native connect
    socket.on("connect", joinRoom);

    // 3. Listen for your backend's custom "authenticated" event (Fires on reload after session check)
    socket.on("authenticated", joinRoom);

    const onError = ({ message }) => {
      console.log("conversation error:", message);
      toast.error(message);
    };

    socket.on("error", onError);

    return () => {
      console.log("conversation leaving");
      if (socket.connected) {
        socket.emit("conversation:leave", conversationId);
      }
      socket.off("connect", joinRoom);
      socket.off("authenticated", joinRoom);
      socket.off("error", onError);
    };
  }, [socket, conversationId]);

  useEffect(() => {
    if (!socket) return;

    const onNewMessage = ({ message }) => {
      console.log({ message });
      if (String(message.conversationId) !== String(conversationId)) return;
      const isOwnRegularMessage =
        String(message.senderId) === currentUserId && !message.isSystemMessage;
      if (isOwnRegularMessage) return; // still skip own regular messages (handled optimistically)
      setMessages((prev) =>
        prev.some((m) => m.id === message.id) ? prev : [...prev, message],
      );
    };

    socket.on("message:new", onNewMessage);

    return () => {
      socket.off("message:new", onNewMessage);
    };
  }, [socket, conversationId, currentUserId]);

  useLayoutEffect(() => {
    scrollToBottom();
  }, [messages]);

  const send = async (e) => {
    e.preventDefault();

    if (!content.trim() || sending) return;

    const text = content.trim();

    setContent("");

    const tempId = `temp-${Date.now()}`;

    const optimisticMessage = {
      id: tempId,
      conversationId,
      senderId: user.id,
      content: text,
      createdAt: new Date().toISOString(),
      sender: {
        id: user.id,
        username: user.username,
      },
      pending: true,
    };

    setMessages((prev) => [...prev, optimisticMessage]);

    setSending(true);

    try {
      const { data } = await api.post(
        `/conversations/${conversationId}/messages`,
        { content: text },
      );

      setMessages((prev) => prev.map((m) => (m.id === tempId ? data.data : m)));
    } catch (e) {
      toast.error(e.response?.data?.message || e.message);
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      setContent(text);
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    if (!socket) return;
    const onMembersAdded = ({
      conversationId: cid,
      addedUsers,
      memberCount,
    }) => {
      if (String(cid) !== String(conversationId)) return;
      setConversation((prev) => {
        if (!prev) return prev;
        const existingIds = new Set((prev.members || []).map((m) => m.userId));
        const newMembers = addedUsers.filter((u) => !existingIds.has(u.id));
        return {
          ...prev,
          memberCount,
          members: [
            ...(prev.members || []),
            ...newMembers.map((u) => ({
              userId: u.id,
              username: u.username,
              avatarUrl: u.avatarUrl,
              role: "member",
            })),
          ],
        };
      });
    };
    socket.on("group:members-added", onMembersAdded);
    return () => socket.off("group:members-added", onMembersAdded);
  }, [socket, conversationId]);
  const router = useRouter();
  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center bg-paper">
        <p className="flex items-center gap-2 text-[13px] font-medium text-ink-soft">
          <Loader2 className="h-4 w-4 animate-spin text-cobalt" />
          Loading conversation…
        </p>
      </div>
    );
  }
  if (!conversation) {
    return (
      <div className="flex flex-1 items-center justify-center bg-paper">
        <p className="text-[13px] font-medium text-ink-soft">
          Conversation not found
        </p>
      </div>
    );
  }

  const headerName = isGroup
    ? conversation.name
    : conversation.otherUser?.username;
  const isOtherUserOnline =
    !isGroup && onlineUsers.has(String(conversation.otherUser?.id));

  return (
    <div className="flex flex-1 h-full flex-col ">
      <header className="flex items-center justify-between gap-3 border-b border-ink/8 bg-white p-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push("/chat")}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-ink-soft transition hover:bg-paper hover:text-ink md:hidden"
            aria-label="Back to conversations"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <span className="relative">
            <Avatar name={headerName} size={40} />
            {!isGroup && isOtherUserOnline && (
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-coral ring-2 ring-white" />
            )}
          </span>
          <div>
            <h2 className="font-display text-[15px] font-bold text-ink">
              {headerName}
            </h2>
            <p className="font-mono text-[10.5px] uppercase tracking-[.03em] text-ink-soft">
              {isGroup ? (
                `${conversation.memberCount} members`
              ) : isOtherUserOnline ? (
                <span className="text-coral">Online</span>
              ) : conversation.otherUser?.lastSeenAt ? (
                `Last seen ${new Date(conversation.otherUser.lastSeenAt).toLocaleString()}`
              ) : (
                "Offline"
              )}
            </p>
          </div>
        </div>

        {isGroup && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAddMembersOpen(true)}
              className="grid h-9 w-9 place-items-center rounded-xl text-slate-600 hover:bg-slate-100"
              title="Add members"
            >
              <UserPlus className="h-4 w-4" />
            </button>
            <ActiveMembersDropdown
              members={
                conversation?.members?.filter(
                  (item) => item?.userId !== user?.id,
                ) || []
              }
              onlineUsers={onlineUsers}
            />
          </div>
        )}

        {!isGroup && (
          <div className="ml-auto flex gap-2">
            <button
              onClick={() =>
                startCall({
                  conversationId,
                  calleeId: conversation.otherUser.id,
                  calleeName: conversation.otherUser.username,
                  type: "audio",
                })
              }
              className="grid h-10 w-10 place-items-center rounded-xl text-slate-600 hover:bg-slate-100"
            >
              <Phone className="h-5 w-5" />
            </button>
            <button
              onClick={() =>
                startCall({
                  conversationId,
                  calleeId: conversation.otherUser.id,
                  calleeName: conversation.otherUser.username,
                  type: "video",
                })
              }
              className="grid h-10 w-10 place-items-center rounded-xl text-slate-600 hover:bg-slate-100"
            >
              <Video className="h-5 w-5" />
            </button>
          </div>
        )}
      </header>

      <section className="flex-1 overflow-y-auto p-4 chat-scrollbar">
        {!messages.length && (
          <p className="mt-10 text-center text-[13px] text-ink-soft">
            No messages yet. Say hi 👋
          </p>
        )}

        {messages.map((m) => {
          const senderId = m.senderId ?? m.sender?.id;
          const isMine = String(senderId) === currentUserId;
          return (
            <div
              key={m.id}
              className={`mb-3 flex items-end gap-2 ${isMine ? "flex-row-reverse" : ""}`}
            >
              <Avatar
                name={isMine ? user?.username : m.sender?.username}
                size={28}
              />
              <div className="flex max-w-[70%] flex-col">
                {!isMine && isGroup && (
                  <span className="mb-0.5 ml-1 text-[10.5px] font-bold text-ink-soft">
                    {m.sender?.username}
                  </span>
                )}
                <div
                  className={`rounded-2xl px-4 py-2.5 text-[13px] leading-5 ${
                    isMine
                      ? "rounded-br-sm bg-cobalt text-white"
                      : "rounded-bl-sm bg-white text-ink shadow-[0_1px_2px_rgba(20,22,27,.06)]"
                  } ${m.pending ? "opacity-60" : ""}`}
                >
                  <p className="whitespace-pre-wrap break-words">{m.content}</p>
                  <span
                    className={`mt-1 block text-[9.5px] font-mono ${isMine ? "text-white/70" : "text-ink-soft"}`}
                  >
                    {m.pending
                      ? "Sending…"
                      : new Date(m.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </section>

      <form
        onSubmit={send}
        className="flex items-center gap-2 border-t border-ink/8 bg-white p-3"
      >
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-1 rounded-full border border-ink/10 bg-paper px-4 py-2.5 text-[13px] text-ink placeholder:text-ink-soft focus:outline-none focus:ring-2 focus:ring-cobalt/40"
          placeholder="Write a message"
        />
        <button
          disabled={sending || !content.trim()}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-cobalt text-white transition hover:bg-cobalt-deep disabled:opacity-40"
        >
          {sending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </button>
      </form>

      <AddMembersModal
        open={addMembersOpen}
        onClose={() => setAddMembersOpen(false)}
        conversationId={conversationId}
        existingMemberIds={(conversation.members || []).map((m) => m.userId)}
        onAdded={({ addedUsers, memberCount }) => {
          setConversation((prev) => ({
            ...prev,
            memberCount,
            members: [
              ...(prev.members || []),
              ...addedUsers.map((u) => ({
                userId: u.id,
                username: u.username,
                avatarUrl: u.avatarUrl,
                role: "member",
              })),
            ],
          }));
        }}
      />
    </div>
  );
}
