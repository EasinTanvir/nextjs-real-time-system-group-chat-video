"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { getSocket, socketCall } from "@/lib/socket";

export default function ConversationPage() {
  const { conversationId } = useParams();

  const user = { id: "user-1" }; // Replace with actual user data if available
  const [conversation, setConversation] = useState(null),
    [messages, setMessages] = useState([]),
    [content, setContent] = useState(""),
    [typing, setTyping] = useState(false);
  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const [c, m] = await Promise.all([
          api.get(`/conversations/${conversationId}`),
          api.get(`/conversations/${conversationId}/messages`, {
            params: { limit: 100 },
          }),
        ]);
        if (active) {
          setConversation(c);
          setMessages(m.items.reverse());
          await socketCall("conversation:join", { conversationId });
        }
      } catch (e) {
        toast.error(e.message);
      }
    };
    load();
    const s = getSocket();
    const onMessage = ({ message }) =>
      message.conversationId === conversationId &&
      setMessages((x) =>
        x.some((m) => m.id === message.id) ? x : [...x, message],
      );
    const onTyping = (x) =>
      x.conversationId === conversationId && setTyping(x.isTyping);
    s.on("message:new", onMessage);
    s.on("typing:updated", onTyping);
    return () => {
      active = false;
      s.off("message:new", onMessage);
      s.off("typing:updated", onTyping);
      socketCall("conversation:leave", { conversationId }).catch(() => {});
    };
  }, [conversationId]);
  const send = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    try {
      await socketCall("message:send", { conversationId, content });
      setContent("");
      socketCall("typing:stop", { conversationId });
    } catch (e) {
      toast.error(e.message);
    }
  };
  if (!conversation) return <main className="p-8">Loading conversation…</main>;
  return (
    <main className="mx-auto flex h-[calc(100vh-90px)] max-w-5xl flex-col p-6">
      <header className="border-b pb-4">
        <h1 className="text-2xl font-bold">
          {conversation.type === "group"
            ? conversation.name
            : conversation.members.find((m) => m.user.id !== user?.id)?.user
                .displayName || "Direct conversation"}
        </h1>
        <p className="text-sm text-slate-500">
          {typing
            ? "Someone is typing…"
            : conversation.type === "group"
              ? `${conversation.members.length} members`
              : ""}
        </p>
      </header>
      <section className="flex-1 overflow-y-auto py-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`mb-3 ${m.senderId === user?.id ? "text-right" : ""}`}
          >
            <span
              className={`inline-block max-w-[75%] rounded-xl px-4 py-2 ${m.senderId === user?.id ? "bg-blue-600 text-white" : "bg-slate-100"}`}
            >
              <b className="mr-2 text-xs">{m.sender?.displayName}</b>
              {m.content}
            </span>
          </div>
        ))}
      </section>
      <form onSubmit={send} className="flex gap-2">
        <input
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            socketCall("typing:start", { conversationId }).catch(() => {});
          }}
          onBlur={() =>
            socketCall("typing:stop", { conversationId }).catch(() => {})
          }
          className="flex-1 rounded-xl border p-3"
          placeholder="Write a message"
        />
        <button className="rounded-xl bg-blue-600 px-5 text-white">Send</button>
      </form>
    </main>
  );
}
