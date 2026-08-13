import { MessageCircle } from "lucide-react";

export default function ChatHome() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 bg-paper text-center">
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white text-cobalt shadow-[0_10px_24px_rgba(20,22,27,.08)]">
        <MessageCircle className="h-6 w-6" />
      </span>
      <p className="font-display text-[17px] font-bold text-ink">
        Select a conversation
      </p>
      <p className="max-w-[240px] text-[13px] leading-5 text-ink-soft">
        Choose a chat from the sidebar, or add a friend to start a new one.
      </p>
    </div>
  );
}
