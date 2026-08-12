"use client";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { useSocket } from "@/providers/SocketContext";

function Avatar({ name, size = 32 }) {
  const initial = name?.[0]?.toUpperCase() || "?";
  return (
    <div
      style={{ width: size, height: size }}
      className="flex shrink-0 items-center justify-center rounded-full bg-slate-400 text-xs font-semibold text-white"
    >
      {initial}
    </div>
  );
}

export default function ConversationDetails({ user, conversationId }) {
  const { socket } = useSocket();
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);

  const currentUserId = String(user?.id);

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

  // real-time incoming messages
  useEffect(() => {
    if (!socket) return;

    const onNewMessage = ({ message }) => {
      if (String(message.conversationId) !== String(conversationId)) return;
      if (String(message.senderId) === currentUserId) return; // own messages handled by send()
      setMessages((prev) =>
        prev.some((m) => m.id === message.id) ? prev : [...prev, message],
      );
      //api.post(`/conversations/${conversationId}/read`).catch(() => {});
    };
    socket.on("message:new", onNewMessage);
    return () => socket.off("message:new", onNewMessage);
  }, [socket, conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const send = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
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
    };

    // show instantly
    setMessages((prev) => [...prev, optimisticMessage]);

    try {
      const { data } = await api.post(
        `/conversations/${conversationId}/messages`,
        {
          content: text,
        },
      );
      // swap temp message for the real one
      setMessages((prev) => prev.map((m) => (m.id === tempId ? data.data : m)));
    } catch (e) {
      toast.error(e.response?.data?.message || e.message);
      setMessages((prev) => prev.filter((m) => m.id !== tempId)); // rollback
      setContent(text);
    } finally {
    }
  };

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

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-slate-400">Loading conversation…</p>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-slate-400">Conversation not found</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center gap-3 border-b border-slate-200 bg-white p-4">
        <Avatar name={conversation.otherUser?.username} size={40} />
        <div>
          <p className="text-xs text-slate-400">
            {conversation.otherUser?.lastSeenAt
              ? `Last seen ${new Date(conversation.otherUser.lastSeenAt).toLocaleString()}`
              : "Offline"}
          </p>
        </div>
      </header>

      <section className="flex-1 overflow-y-auto bg-slate-50 p-4">
        {!messages.length && (
          <p className="mt-10 text-center text-sm text-slate-400">
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
                name={
                  isMine ? user?.username : conversation.otherUser?.username
                }
                size={28}
              />
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                  isMine
                    ? "rounded-br-sm bg-blue-600 text-white"
                    : "rounded-bl-sm bg-white text-slate-800"
                } `}
              >
                <p className="whitespace-pre-wrap break-words">{m.content}</p>
                <span
                  className={`mt-1 block text-[10px] ${isMine ? "text-blue-100" : "text-slate-400"}`}
                >
                  {new Date(m.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </section>

      <form
        onSubmit={send}
        className="flex items-center gap-2 border-t border-slate-200 bg-white p-3"
      >
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-1 rounded-full border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Write a message"
        />
        <button
          disabled={!content.trim()}
          className="rounded-full bg-blue-600 px-5 py-2.5 text-sm text-white disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}
