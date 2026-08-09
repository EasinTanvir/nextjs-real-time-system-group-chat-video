"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth"; // replace with however you access current user

export default function ConversationPage() {
  const { conversationId } = useParams();
  const { user } = useAuth(); // must expose { id, username, ... }

  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

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
      setMessages(m.data.data);
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

  const send = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    try {
      const { data } = await api.post(
        `/conversations/${conversationId}/messages`,
        {
          content,
        },
      );
      setMessages((prev) => [
        ...prev,
        { ...data.data, sender: { id: user.id, username: user.username } },
      ]);
      setContent("");
    } catch (e) {
      toast.error(e.response?.data?.message || e.message);
    }
  };

  if (loading) return <main className="p-8">Loading conversation…</main>;
  if (!conversation) return <main className="p-8">Conversation not found</main>;

  return (
    <main className="mx-auto flex h-[calc(100vh-90px)] max-w-5xl flex-col p-6">
      <header className="border-b pb-4">
        <h1 className="text-2xl font-bold">
          {conversation.otherUser?.username}
        </h1>
      </header>

      <section className="flex-1 overflow-y-auto py-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`mb-3 ${m.senderId === user?.id ? "text-right" : ""}`}
          >
            <span
              className={`inline-block max-w-[75%] rounded-xl px-4 py-2 ${
                m.senderId === user?.id
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100"
              }`}
            >
              {m.content}
            </span>
          </div>
        ))}
      </section>

      <form onSubmit={send} className="flex gap-2">
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-1 rounded-xl border p-3"
          placeholder="Write a message"
        />
        <button className="rounded-xl bg-blue-600 px-5 text-white">Send</button>
      </form>
    </main>
  );
}
