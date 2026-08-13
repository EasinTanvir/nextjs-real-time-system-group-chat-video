import Reveal from "./Reveal";

const AddFriendIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="9" cy="8" r="4" />
    <path d="M2 21c0-4 3-6.5 7-6.5" />
    <path d="M17 8v6M14 11h6" />
  </svg>
);

const ChatIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 11.5a8.5 8.5 0 0 1-11.7 7.9L3 21l1.6-6.3A8.5 8.5 0 1 1 21 11.5Z" />
    <circle cx="8.5" cy="11.5" r=".6" fill="currentColor" stroke="none" />
    <circle cx="12" cy="11.5" r=".6" fill="currentColor" stroke="none" />
    <circle cx="15.5" cy="11.5" r=".6" fill="currentColor" stroke="none" />
  </svg>
);

const GroupIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="9" cy="8" r="3.2" />
    <circle cx="17" cy="9.5" r="2.6" />
    <path d="M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6" />
    <path d="M15.5 14.2c2.5.3 4.5 2.4 4.5 5.3" />
  </svg>
);

const STEPS = [
  {
    n: "01",
    title: "Add a friend",
    desc: "Search a username, send a request, and wait for the dot to turn green.",
    icon: AddFriendIcon,
    tint: "bg-coral/10 text-coral",
  },
  {
    n: "02",
    title: "Start the conversation",
    desc: "Messages land the moment they're sent — no refresh, no delay.",
    icon: ChatIcon,
    tint: "bg-cobalt/10 text-cobalt",
  },
  {
    n: "03",
    title: "Spin up a group",
    desc: "Name it, add people, and the whole thread moves together.",
    icon: GroupIcon,
    tint: "bg-amber/20 text-amber",
  },
];

const HowItWorks = () => (
  <section id="how-it-works" className="mx-auto max-w-6xl px-5 py-24 lg:px-8">
    <Reveal>
      <p className="font-mono text-xs uppercase tracking-widest text-ink-soft">
        The flow
      </p>
      <h2 className="mt-3 max-w-lg font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        Three steps between a stranger and a group chat.
      </h2>
    </Reveal>

    <div className="relative mt-14 grid gap-10 sm:grid-cols-3 sm:gap-6">
      <div className="absolute left-0 right-0 top-6 hidden h-px bg-ink/10 sm:block" />
      {STEPS.map((s, i) => (
        <Reveal key={s.n} delay={i * 0.1} className="relative">
          <div
            className={`relative z-10 grid h-12 w-12 place-items-center rounded-xl border-2 border-ink bg-paper ${s.tint}`}
          >
            <s.icon />
          </div>
          <p className="mt-5 font-mono text-xs text-ink-soft">{s.n}</p>
          <h3 className="mt-1 font-display text-xl font-semibold text-ink">
            {s.title}
          </h3>
          <p className="mt-2 max-w-xs font-body text-sm leading-relaxed text-ink-soft">
            {s.desc}
          </p>
        </Reveal>
      ))}
    </div>
  </section>
);

export default HowItWorks;
