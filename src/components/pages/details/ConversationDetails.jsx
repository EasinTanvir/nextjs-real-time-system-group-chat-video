"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Loader2,
  Menu,
  MessageCircle,
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
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-[#f8fafc]">
      {/* ===================================================== */}
      {/* Conversation Header */}
      {/* ===================================================== */}

      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200/80 bg-white/95 px-3 py-3 backdrop-blur-xl sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          {/* Mobile back */}
          <button
            type="button"
            onClick={() => router.push("/chat")}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-slate-500 transition hover:bg-slate-50 hover:text-slate-950 md:hidden"
            aria-label="Back to conversations"
          >
            <ArrowLeft className="h-[18px] w-[18px]" />
          </button>

          {/* Avatar */}
          <span className="relative shrink-0">
            <Avatar name={headerName} size={40} />

            {!isGroup && isOtherUserOnline && (
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
            )}
          </span>

          {/* Name + status */}
          <div className="min-w-0">
            <h2 className="truncate font-display text-[14px] font-bold tracking-[-.01em] text-slate-950 sm:text-[15px]">
              {headerName}
            </h2>

            <p className="mt-0.5 truncate text-[10px] font-medium uppercase tracking-[.07em] text-slate-400">
              {isGroup ? (
                `${conversation.memberCount} members`
              ) : isOtherUserOnline ? (
                <span className="text-emerald-500">Online</span>
              ) : conversation.otherUser?.lastSeenAt ? (
                `Last seen ${new Date(
                  conversation.otherUser.lastSeenAt,
                ).toLocaleString()}`
              ) : (
                "Offline"
              )}
            </p>
          </div>
        </div>

        {/* ================================================= */}
        {/* Header Actions */}
        {/* ================================================= */}

        {isGroup && (
          <div className="flex shrink-0 items-center gap-1.5">
            <button
              onClick={() => setAddMembersOpen(true)}
              className="grid h-9 w-9 place-items-center rounded-xl text-slate-500 transition hover:bg-slate-50 hover:text-slate-950"
              title="Add members"
              type="button"
            >
              <UserPlus className="h-[17px] w-[17px]" />
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
          <div className="ml-auto flex shrink-0 items-center gap-1.5">
            {/* Audio call */}
            <button
              onClick={() =>
                startCall({
                  conversationId,
                  calleeId: conversation.otherUser.id,
                  calleeName: conversation.otherUser.username,
                  type: "audio",
                })
              }
              type="button"
              className="grid h-9 w-9 place-items-center rounded-xl text-slate-500 transition hover:bg-emerald-50 hover:text-emerald-600"
              aria-label="Start audio call"
            >
              <Phone className="h-[17px] w-[17px]" />
            </button>

            {/* Video call */}
            <button
              onClick={() =>
                startCall({
                  conversationId,
                  calleeId: conversation.otherUser.id,
                  calleeName: conversation.otherUser.username,
                  type: "video",
                })
              }
              type="button"
              className="grid h-9 w-9 place-items-center rounded-xl text-slate-500 transition hover:bg-cyan-50 hover:text-cyan-600"
              aria-label="Start video call"
            >
              <Video className="h-[17px] w-[17px]" />
            </button>
          </div>
        )}
      </header>

      {/* ===================================================== */}
      {/* Messages */}
      {/* ===================================================== */}

      <section className="min-h-0 flex-1 overflow-y-auto bg-[#f8fafc] px-3 py-5 sm:px-6 sm:py-6 chat-scrollbar">
        {!messages.length && (
          <div className="flex flex-col items-center justify-center pt-16 text-center">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-slate-400 shadow-[0_4px_20px_rgba(15,23,42,0.05)]">
              <MessageCircle className="h-5 w-5" />
            </div>

            <p className="mt-4 text-sm font-semibold text-slate-700">
              No messages yet
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Say hi and start the conversation 👋
            </p>
          </div>
        )}

        {messages.map((m) => {
          const senderId = m.senderId ?? m.sender?.id;

          const isMine = String(senderId) === currentUserId;

          return (
            <div
              key={m.id}
              className={`mb-4 flex items-end gap-2 ${
                isMine ? "flex-row-reverse" : ""
              }`}
            >
              {/* Avatar */}
              <Avatar
                name={isMine ? user?.username : m.sender?.username}
                size={28}
              />

              <div className="flex max-w-[82%] flex-col sm:max-w-[70%]">
                {/* Group sender */}
                {!isMine && isGroup && (
                  <span className="mb-1 ml-1 text-[10px] font-bold text-slate-400">
                    {m.sender?.username}
                  </span>
                )}

                {/* Bubble */}
                <div
                  className={`rounded-2xl px-4 py-2.5 text-[13px] leading-5 ${
                    isMine
                      ? "rounded-br-md bg-gradient-to-br from-cyan-500 to-emerald-500 text-white shadow-[0_5px_15px_rgba(16,185,129,0.12)]"
                      : "rounded-bl-md border border-slate-200/80 bg-white text-slate-800 shadow-[0_3px_12px_rgba(15,23,42,0.04)]"
                  } ${m.pending ? "opacity-60" : ""}`}
                >
                  <p className="whitespace-pre-wrap break-words">{m.content}</p>

                  <span
                    className={`mt-1 block text-[9px] font-mono ${
                      isMine ? "text-white/65" : "text-slate-400"
                    }`}
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

      {/* ===================================================== */}
      {/* Message Composer */}
      {/* ===================================================== */}

      <form
        onSubmit={send}
        className="shrink-0 border-t border-slate-200/80 bg-white p-3 sm:p-4"
      >
        <div className="mx-auto flex w-full max-w-5xl items-center gap-2">
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="h-11 min-w-0 flex-1 rounded-xl border border-slate-200 bg-[#f8fafc] px-4 text-[13px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-300 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
            placeholder="Write a message..."
          />

          <button
            disabled={sending || !content.trim()}
            type="submit"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 text-white shadow-[0_7px_18px_rgba(16,185,129,0.18)] transition hover:-translate-y-0.5 hover:shadow-[0_10px_22px_rgba(16,185,129,0.24)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
            aria-label="Send message"
          >
            {sending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </div>
      </form>

      {/* ===================================================== */}
      {/* Add Members */}
      {/* ===================================================== */}

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
