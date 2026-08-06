import {
  CheckCheck,
  CircleHelp,
  Filter,
  Paperclip,
  Phone,
  PlusSquare,
  Search,
  SendHorizontal,
  Smile,
  Video,
  Mic,
} from "lucide-react";

const conversations = [
  ["Emma Johnson", "That’s awesome! Can’t wait to see...", "10:32 AM", "EJ", "from-rose-300 to-orange-200", 2, true],
  ["Design Team", "Liam: Please check the new mockups", "9:45 AM", "DT", "from-violet-300 to-blue-200", 4, false],
  ["Liam Wilson", "See you tomorrow", "9:30 AM", "LW", "from-amber-300 to-orange-300", null, true],
  ["Olivia Brown", "Thank you! 🙌", "Yesterday", "OB", "from-pink-300 to-violet-200", 1, false],
  ["Noah Davis", "Okay! Let me know.", "Yesterday", "ND", "from-emerald-300 to-teal-200", null, true],
  ["Best Friends", "Sarah: It’s movie night! 🍿", "Yesterday", "BF", "from-sky-300 to-indigo-200", 3, false],
  ["Project Alpha", "You: Great work team! 🚀", "Mon", "PA", "from-slate-600 to-slate-800", null, false],
  ["Sophia Miller", "Let’s catch up later", "Mon", "SM", "from-rose-300 to-pink-200", null, false],
  ["Marketing Team", "Jason: Campaign is live!", "Sun", "MT", "from-slate-500 to-slate-700", null, false],
  ["Alexander Smith", "How was your weekend?", "Sun", "AS", "from-cyan-300 to-blue-200", null, true],
];

function Avatar({ initials, color, online, size = "md" }) {
  const classes = size === "lg" ? "h-12 w-12 text-sm" : "h-10 w-10 text-xs";
  return (
    <span className="relative shrink-0">
      <span className={`grid ${classes} place-items-center rounded-full bg-gradient-to-br ${color} font-bold text-slate-700`}>{initials}</span>
      {typeof online === "boolean" && <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${online ? "bg-emerald-500" : "bg-slate-300"}`} />}
    </span>
  );
}

function ConversationRow({ conversation, selected }) {
  const [name, preview, time, initials, color, unread, online] = conversation;
  return (
    <button aria-pressed={selected} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-blue-600 ${selected ? "bg-gradient-to-r from-blue-50 to-indigo-50/80" : ""}`}>
      <Avatar initials={initials} color={color} online={online} />
      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between gap-2"><span className="truncate text-sm font-bold text-slate-900">{name}</span><span className="shrink-0 text-xs text-slate-500">{time}</span></span>
        <span className="mt-1 flex items-center gap-2"><span className="truncate text-sm text-slate-600">{preview}</span>{unread && <span className="ml-auto grid h-5 min-w-5 place-items-center rounded-full bg-blue-600 px-1 text-[11px] font-bold text-white" aria-label={`${unread} unread messages`}>{unread}</span>}</span>
      </span>
    </button>
  );
}

function Bubble({ children, sent, time }) {
  return (
    <div className={`flex items-end gap-3 ${sent ? "justify-end" : "justify-start"}`}>
      {!sent && <Avatar initials="EJ" color="from-rose-300 to-orange-200" online size="lg" />}
      <div className={`max-w-[82%] rounded-2xl px-5 py-4 text-[16px] leading-7 shadow-[0_4px_10px_rgba(15,23,42,.025)] sm:max-w-[66%] ${sent ? "rounded-br-md bg-gradient-to-br from-blue-600 to-indigo-600 text-white" : "rounded-bl-md bg-slate-100 text-slate-900"}`}>
        <p>{children}</p>
        <p className={`mt-1.5 flex items-center gap-1 text-xs ${sent ? "justify-end text-blue-100" : "text-slate-500"}`}>{time}{sent && <CheckCheck className="h-4 w-4" aria-label="Read" />}</p>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <main className="h-[calc(100vh-90px)] min-h-[650px] overflow-hidden bg-white">
      <div className="flex h-full">
        <aside className="hidden w-[370px] shrink-0 border-r border-slate-200 bg-white md:flex md:flex-col" aria-label="Conversation list">
          <div className="flex items-center justify-between px-6 pb-5 pt-7"><h1 className="text-[25px] font-bold tracking-[-.04em] text-slate-950">Conversations</h1><button className="grid h-10 w-10 place-items-center rounded-xl text-slate-600 transition hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600" aria-label="New conversation"><PlusSquare className="h-5 w-5" /></button></div>
          <div className="px-5"><label className="flex h-11 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 text-slate-500"><Search className="h-5 w-5" /><input type="search" placeholder="Search conversations..." aria-label="Search conversations" className="min-w-0 flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-500" /><Filter className="h-4 w-4" /></label><div className="mt-5 flex gap-2"><button aria-pressed="true" className="rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 px-4 py-2 text-sm font-semibold text-blue-600">All</button><button aria-pressed="false" className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200">Unread</button><button aria-pressed="false" className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200">Groups</button><button aria-pressed="false" className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200">Direct</button></div></div>
          <div className="mt-5 flex-1 overflow-y-auto px-3 pb-5">{conversations.map((conversation, index) => <ConversationRow key={conversation[0]} conversation={conversation} selected={index === 0} />)}</div>
        </aside>
        <section className="flex min-w-0 flex-1 flex-col" aria-labelledby="active-chat-heading">
          <header className="flex min-h-[86px] items-center border-b border-slate-200 px-4 sm:px-8">
            <button className="mr-3 grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-slate-600 md:hidden" aria-label="Show conversations"><Search className="h-5 w-5" /></button>
            <Avatar initials="EJ" color="from-rose-300 to-orange-200" online size="lg" />
            <div className="ml-3 min-w-0"><h1 id="active-chat-heading" className="truncate text-lg font-bold text-slate-950">Emma Johnson</h1><p className="mt-0.5 flex items-center gap-1.5 text-sm text-slate-500"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />Online</p></div>
            <div className="ml-auto flex items-center gap-2 sm:gap-3"><button className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-blue-50 hover:text-blue-600" aria-label="Search this conversation"><Search className="h-5 w-5" /></button><button className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 text-slate-700 transition hover:bg-blue-50 hover:text-blue-600" aria-label="Start voice call"><Phone className="h-5 w-5" /></button><button className="hidden h-10 w-10 place-items-center rounded-full border border-slate-200 text-slate-700 transition hover:bg-blue-50 hover:text-blue-600 sm:grid" aria-label="Start video call"><Video className="h-5 w-5" /></button><button className="hidden h-10 w-10 place-items-center rounded-full border border-slate-200 text-slate-700 transition hover:bg-blue-50 hover:text-blue-600 sm:grid" aria-label="Conversation details"><CircleHelp className="h-5 w-5" /></button></div>
          </header>
          <div className="flex-1 overflow-y-auto px-4 py-7 sm:px-8 lg:px-10"><p className="text-center text-sm font-semibold text-slate-500">Today</p><div className="mx-auto mt-8 flex max-w-[980px] flex-col gap-8"><Bubble time="10:30 AM">Hey! How are you doing today?</Bubble><Bubble sent time="10:31 AM">I&apos;m doing great! Just working on the new project.</Bubble><Bubble time="10:32 AM">That&apos;s awesome! Can&apos;t wait to see it.</Bubble><Bubble sent time="10:33 AM">Sure! I&apos;ll share it with you once it&apos;s ready.</Bubble><Bubble time="10:34 AM">Sounds good! Let me know if you need any help.</Bubble><Bubble sent time="10:35 AM">Thanks! I might take you up on that. 😊</Bubble></div></div>
          <div className="border-t border-slate-100 bg-white px-4 py-4 sm:px-8" role="group" aria-label="Message composer"><div className="mx-auto flex max-w-[980px] items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 shadow-[0_4px_12px_rgba(15,23,42,.025)]"><input aria-label="Type a message" className="h-11 min-w-0 flex-1 bg-transparent px-1 text-[15px] text-slate-800 outline-none placeholder:text-slate-400" placeholder="Type a message..." /><button type="button" className="grid h-10 w-10 place-items-center rounded-xl text-slate-600 transition hover:bg-slate-100 hover:text-blue-600" aria-label="Choose emoji"><Smile className="h-5 w-5" /></button><button type="button" className="grid h-10 w-10 place-items-center rounded-xl text-slate-600 transition hover:bg-slate-100 hover:text-blue-600" aria-label="Attach a file"><Paperclip className="h-5 w-5" /></button><button type="button" className="hidden h-10 w-10 place-items-center rounded-xl text-slate-600 transition hover:bg-slate-100 hover:text-blue-600 sm:grid" aria-label="Record voice message"><Mic className="h-5 w-5" /></button><button type="button" className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-[0_8px_18px_rgba(37,99,235,.24)] transition hover:-translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600" aria-label="Send message"><SendHorizontal className="h-5 w-5" /></button></div></div>
        </section>
      </div>
    </main>
  );
}
