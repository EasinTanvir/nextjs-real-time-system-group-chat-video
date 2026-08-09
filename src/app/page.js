import {
  ArrowRight,
  AtSign,
  Bookmark,
  CheckCheck,
  ChevronDown,
  Globe2,
  LockKeyhole,
  MessageCircle,
  MoreHorizontal,
  Paperclip,
  Phone,
  Play,
  Plus,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Smile,
  UsersRound,
  Video,
  Zap,
} from "lucide-react";

import Container from "@/components/Container";

import {
  conversations,
  favorites,
  featureCards,
  navItems,
  statistics,
} from "@/data/home";

function BrandMark({ small = false }) {
  return (
    <span
      className={`grid place-items-center ${
        small ? "h-5 w-5 rounded-md" : "h-8 w-8 rounded-lg"
      } bg-gradient-to-br from-blue-500 to-indigo-600 text-white`}
    >
      <MessageCircle
        className={small ? "h-3 w-3" : "h-[18px] w-[18px]"}
        strokeWidth={2.4}
      />
    </span>
  );
}

function Avatar({ initials, color, size = "md" }) {
  const sizes = {
    sm: "h-6 w-6 text-[8px]",
    md: "h-8 w-8 text-[10px]",
    lg: "h-10 w-10 text-xs",
  };

  return (
    <span
      className={`grid shrink-0 place-items-center rounded-full bg-gradient-to-br ${color} font-bold text-slate-700 ${sizes[size]}`}
    >
      {initials}
    </span>
  );
}

function FeaturePoint({ icon: Icon, title, children }) {
  return (
    <div className="flex max-w-[154px] gap-2.5">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-blue-50 text-blue-600">
        <Icon className="h-4 w-4" />
      </span>

      <div>
        <p className="text-[11px] font-bold text-slate-900">{title}</p>

        <p className="mt-0.5 text-[10px] leading-4 text-slate-500">
          {children}
        </p>
      </div>
    </div>
  );
}

function SideNav() {
  return (
    <aside className="hidden w-[188px] shrink-0 border-r border-slate-100 bg-white px-3 py-4 lg:block">
      <div className="flex items-center justify-between px-1.5">
        <div className="flex items-center gap-2">
          <BrandMark small />

          <span className="text-[13px] font-bold">Chatify</span>
        </div>

        <span className="text-slate-500">⌑</span>
      </div>

      <div className="mt-5 flex h-7 items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-2 text-[9px] text-slate-400">
        <Search className="h-3 w-3" />

        <span>Search conversations...</span>

        <kbd className="ml-auto text-[8px]">⌘K</kbd>
      </div>

      <nav aria-label="Chat preview navigation" className="mt-4 space-y-0.5">
        {navItems.map(([Icon, label, active]) => (
          <div
            key={label}
            className={`flex h-7 items-center gap-2 rounded-md px-2 text-[10px] font-medium ${
              active ? "bg-blue-50 text-blue-600" : "text-slate-700"
            }`}
          >
            <Icon className="h-3.5 w-3.5" />

            {label}

            {active && (
              <span className="ml-auto grid h-3.5 w-3.5 place-items-center rounded-full bg-blue-600 text-[7px] text-white">
                8
              </span>
            )}
          </div>
        ))}
      </nav>

      <p className="mt-5 px-2 text-[9px] font-medium text-slate-400">
        Favorites
      </p>

      <div className="mt-2 space-y-2 px-1">
        {favorites.map(([initials, name, color]) => (
          <div key={name} className="flex items-center gap-2">
            <Avatar initials={initials} color={color} size="sm" />

            <span className="truncate text-[10px] font-medium">{name}</span>

            <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-3">
        <Avatar initials="JD" color="from-slate-300 to-slate-100" />

        <div className="min-w-0">
          <p className="truncate text-[10px] font-bold">John Doe</p>

          <p className="text-[8px] text-slate-500">Online</p>
        </div>

        <ChevronDown className="ml-auto h-3 w-3 text-slate-500" />
      </div>
    </aside>
  );
}

function ConversationList() {
  return (
    <section className="w-[220px] shrink-0 border-r border-slate-100 bg-white py-4 sm:w-[250px]">
      <div className="flex items-center justify-between px-4">
        <div className="flex items-center gap-1.5">
          <h2 className="text-sm font-bold">Inbox</h2>

          <ChevronDown className="h-3.5 w-3.5" />
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            aria-label="New conversation"
            className="grid h-6 w-6 place-items-center rounded-md bg-blue-50 text-blue-600"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            aria-label="More inbox options"
            className="grid h-6 w-6 place-items-center rounded-md bg-slate-50 text-slate-500"
          >
            <MoreHorizontal className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="mt-4">
        {conversations.map((chat, index) => (
          <div
            key={chat.name}
            className={`flex gap-2 px-4 py-2.5 ${
              index === 0 ? "bg-blue-50/70" : ""
            }`}
          >
            <Avatar initials={chat.initials} color={chat.color} />

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1">
                <p className="truncate text-[10px] font-bold">{chat.name}</p>

                <span className="shrink-0 text-[8px] text-slate-500">
                  {chat.time}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <p className="truncate text-[9px] text-slate-500">
                  {chat.text}
                </p>

                {chat.unread && (
                  <span className="ml-auto grid h-3.5 w-3.5 shrink-0 place-items-center rounded-full bg-blue-600 text-[7px] text-white">
                    {chat.unread}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ChatPreview() {
  return (
    <div className="overflow-x-auto rounded-2xl bg-white shadow-[0_24px_55px_rgba(37,99,235,.14)] ring-1 ring-slate-200/80">
      <div className="flex min-w-[740px] overflow-hidden rounded-2xl">
        <SideNav />

        <ConversationList />

        <section className="min-w-[330px] flex-1 bg-white">
          <header className="flex h-[59px] items-center border-b border-slate-100 px-5">
            <Avatar initials="EJ" color="from-rose-300 to-orange-200" />

            <div className="ml-2">
              <p className="text-[10px] font-bold">Emma Johnson</p>

              <p className="flex items-center gap-1 text-[8px] text-slate-500">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Online
              </p>
            </div>

            <div className="ml-auto flex gap-3 text-slate-500">
              <Phone className="h-3.5 w-3.5" />
              <Video className="h-3.5 w-3.5" />
              <MoreHorizontal className="h-3.5 w-3.5" />
            </div>
          </header>

          <div className="px-5 py-5">
            <p className="text-center text-[8px] font-medium text-slate-400">
              Today
            </p>

            <div className="mt-4 flex items-start gap-2">
              <Avatar initials="EJ" color="from-rose-300 to-orange-200" />

              <div>
                <div className="rounded-xl rounded-tl-sm bg-slate-100 px-3 py-2 text-[10px] text-slate-800">
                  Hey! How are you doing today?
                </div>

                <p className="mt-1 text-[8px] text-slate-400">10:30 AM</p>
              </div>
            </div>

            <div className="ml-auto mt-4 w-fit">
              <div className="rounded-xl rounded-tr-sm bg-gradient-to-br from-blue-500 to-indigo-600 px-3 py-2 text-[10px] leading-4 text-white">
                I&apos;m doing great! Just working
                <br />
                on the new project.
              </div>

              <p className="mt-1 flex items-center justify-end gap-1 text-[8px] text-slate-400">
                10:31 AM
                <CheckCheck className="h-3 w-3 text-blue-500" />
              </p>
            </div>

            <div className="mt-4 flex items-start gap-2">
              <Avatar initials="EJ" color="from-rose-300 to-orange-200" />

              <div>
                <div className="rounded-xl rounded-tl-sm bg-slate-100 px-3 py-2 text-[10px] text-slate-800">
                  That&apos;s awesome! Can&apos;t wait
                  <br />
                  to see it.
                </div>

                <p className="mt-1 text-[8px] text-slate-400">10:32 AM</p>
              </div>
            </div>

            <div className="ml-auto mt-4 w-fit">
              <div className="rounded-xl rounded-tr-sm bg-gradient-to-br from-blue-500 to-indigo-600 px-3 py-2 text-[10px] leading-4 text-white">
                Sure! I&apos;ll share it with you
                <br />
                once it&apos;s ready.
              </div>

              <p className="mt-1 flex items-center justify-end gap-1 text-[8px] text-slate-400">
                10:33 AM
                <CheckCheck className="h-3 w-3 text-blue-500" />
              </p>
            </div>
          </div>

          <div className="mx-5 mb-4 flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-3 text-[9px] text-slate-400">
            <span>Type a message...</span>

            <Smile className="ml-auto h-3.5 w-3.5 text-slate-500" />

            <Paperclip className="h-3.5 w-3.5 text-slate-500" />

            <button
              type="button"
              aria-label="Send preview message"
              className="grid h-7 w-7 place-items-center rounded-full bg-blue-600 text-white"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fbfcff] text-slate-900">
      {/* Hero background */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-[620px] bg-[radial-gradient(circle_at_80%_40%,rgba(219,234,254,.8),transparent_31%),radial-gradient(circle_at_47%_18%,rgba(238,242,255,.85),transparent_29%)]" />

      {/* Hero */}
      <Container>
        <section
          id="top"
          className="relative z-10 grid items-center gap-12 pb-16 pt-12 lg:grid-cols-[.88fr_1.2fr] lg:gap-16 lg:pb-20 lg:pt-20"
        >
          <div className="max-w-[540px]">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-100/80 px-3 py-1.5 text-[11px] font-semibold text-blue-700">
              <span>✣</span>
              Modern chat for teams and friends
            </div>

            <h1 className="mt-6 text-[42px] font-extrabold leading-[1.13] tracking-[-.05em] text-slate-900 sm:text-[56px]">
              Real-time conversations,
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-600 bg-clip-text text-transparent">
                meaningful connections.
              </span>
            </h1>

            <p className="mt-5 max-w-[480px] text-[16px] leading-7 text-slate-500">
              Chatify is a modern chat application built for everyone. Clean
              design, real-time messaging, and powerful features to keep you
              connected.
            </p>

            <div className="mt-7 flex flex-wrap gap-4">
              <a
                href="/register"
                className="inline-flex items-center gap-3 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 px-5 py-3.5 text-[13px] font-bold text-white shadow-[0_10px_22px_rgba(37,99,235,.23)] transition hover:-translate-y-0.5"
              >
                Get Started for Free
                <ArrowRight className="h-4 w-4" />
              </a>

              <a
                href="#features"
                className="inline-flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-[13px] font-bold text-slate-900 shadow-sm transition hover:border-blue-200 hover:bg-blue-50"
              >
                <span>See Features</span>
                <Play className="h-4 w-4 text-slate-500" />
              </a>
            </div>

            <div className="mt-12 flex flex-wrap gap-x-7 gap-y-5">
              <FeaturePoint icon={ShieldCheck} title="Secure & Private">
                Your data is always protected
              </FeaturePoint>

              <FeaturePoint icon={Zap} title="Lightning Fast">
                Real-time messaging at scale
              </FeaturePoint>

              <FeaturePoint icon={UsersRound} title="For Everyone">
                Built for teams, friends & communities
              </FeaturePoint>
            </div>
          </div>

          <ChatPreview />
        </section>
      </Container>

      {/* Features */}
      <section
        id="features"
        className="relative z-10 border-t border-slate-100 bg-white py-16 sm:py-20"
      >
        <Container>
          <div className="text-center">
            <p className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-blue-600">
              Powerful Features
            </p>

            <h2 className="mt-2 text-[29px] font-extrabold tracking-[-.04em] sm:text-[31px]">
              Everything you need in one place
            </h2>

            <p className="mt-1 text-[14px] text-slate-500">
              Designed to help you communicate better and get more done.
            </p>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featureCards.map(({ title, description, icon: Icon, tone }) => (
              <article
                key={title}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_4px_12px_rgba(15,23,42,.025)]"
              >
                <span
                  className={`grid h-10 w-10 place-items-center rounded-lg ${tone}`}
                >
                  <Icon className="h-5 w-5" />
                </span>

                <h3 className="mt-3 text-[14px] font-bold">{title}</h3>

                <p className="mt-2 text-[11px] leading-[1.55] text-slate-500">
                  {description}
                </p>
              </article>
            ))}
          </div>

          {/* Statistics */}
          <div
            id="security"
            className="mt-4 grid rounded-xl bg-gradient-to-r from-blue-50/90 via-indigo-50/50 to-blue-50/80 px-4 py-5 sm:grid-cols-4 sm:px-8"
          >
            {statistics.map(([Icon, number, label], index) => (
              <div
                key={label}
                className={`flex items-center justify-center gap-4 py-2 ${
                  index ? "sm:border-l sm:border-slate-300/70" : ""
                }`}
              >
                <Icon className="h-7 w-7 text-blue-600" />

                <div>
                  <p className="text-[20px] font-extrabold tracking-[-.04em]">
                    {number}
                  </p>

                  <p className="text-[10px] font-medium text-slate-500">
                    {label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Placeholder sections */}
      <span id="pricing" className="sr-only" />
      <span id="about" className="sr-only" />
      <span id="contact" className="sr-only" />
    </main>
  );
}
