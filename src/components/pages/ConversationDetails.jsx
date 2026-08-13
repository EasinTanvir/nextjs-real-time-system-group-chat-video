"use client";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Loader2, Send } from "lucide-react";
import api from "@/lib/api";
import { useSocket } from "@/providers/SocketContext";

const TONES = [
  "from-cobalt to-cobalt-deep",
  "from-coral to-[#E8461F]",
  "from-ink to-[#3A3F4B]",
];

function toneFromName(name = "") {
  const code = name.charCodeAt(0) || 0;
  return TONES[code % TONES.length];
}

function Avatar({ name, size = 32 }) {
  const initial = name?.[0]?.toUpperCase() || "?";
  return (
    <div
      style={{ width: size, height: size }}
      className={`flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br font-bold text-white ${toneFromName(name)}`}
    >
      {initial}
    </div>
  );
}

function ActiveMembersDropdown({ members, onlineUsers }) {
  const [open, setOpen] = useState(false);
  const activeCount = members.filter((m) =>
    onlineUsers.has(String(m.userId)),
  ).length;

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button className="flex items-center gap-1.5 rounded-full bg-coral-soft px-3 py-1.5 font-mono text-[10.5px] font-bold uppercase tracking-[.04em] text-coral">
        <span className="h-1.5 w-1.5 rounded-full bg-coral" />
        {activeCount} active
      </button>
      {open && (
        <div className="absolute right-0 top-full z-30 mt-2 w-56 rounded-xl border border-ink/8 bg-white p-2 shadow-[0_16px_40px_rgba(20,22,27,.14)]">
          {members.map((m) => {
            const isOnline = onlineUsers.has(String(m.userId));
            return (
              <div
                key={m.userId}
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-[12.5px]"
              >
                <span
                  className={`h-2 w-2 shrink-0 rounded-full ${isOnline ? "bg-coral" : "bg-ink-soft/40"}`}
                />
                <span className="truncate text-ink">{m.username}</span>
                {!isOnline && (
                  <span className="ml-auto font-mono text-[9.5px] uppercase text-ink-soft">
                    Offline
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function ConversationDetails({ user, conversationId }) {
  const { socket, onlineUsers } = useSocket();
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  const currentUserId = String(user?.id);
  const isGroup = conversation?.type === "group";

  const scrollToBottom = () =>
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });

  const load = async () => {
    try {
      setLoading(true);
      const [c, m] = await Promise.all([
        api.get(`/conversations/${conversationId}`),
        api.get(`/conversations/${conversationId}/messages`, {
          params: { limit: 100 },
        }),
      ]);
      setConversation(c.data.data);
      setMessages(m.data.data || []);
      await api.post(`/conversations/${conversationId}/read`);
    } catch (e) {
      toast.error(e.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [conversationId]);

  useEffect(() => {
    if (!socket) return;
    socket.emit("conversation:join", conversationId);
    const onError = ({ message }) => toast.error(message);
    socket.on("error", onError);
    return () => {
      socket.emit("conversation:leave", conversationId);
      socket.off("error", onError);
    };
  }, [socket, conversationId]);

  useEffect(() => {
    if (!socket) return;
    const onNewMessage = ({ message }) => {
      if (String(message.conversationId) !== String(conversationId)) return;
      if (String(message.senderId) === currentUserId) return;
      setMessages((prev) =>
        prev.some((m) => m.id === message.id) ? prev : [...prev, message],
      );
    };
    socket.on("message:new", onNewMessage);
    return () => socket.off("message:new", onNewMessage);
  }, [socket, conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

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
      sender: { id: user.id, username: user.username },
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
    <div className="flex h-full flex-col bg-paper">
      <header className="flex items-center justify-between gap-3 border-b border-ink/8 bg-white p-4">
        <div className="flex items-center gap-3">
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
          <ActiveMembersDropdown
            members={conversation.members || []}
            onlineUsers={onlineUsers}
          />
        )}
      </header>

      <section className="flex-1 overflow-y-auto p-4">
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
    </div>
  );
}
