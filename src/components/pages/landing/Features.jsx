import Reveal from "./Reveal";

const BoltIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" />
  </svg>
);
const GroupIcon = () => (
  <svg
    width="22"
    height="22"
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
const DotIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" />
  </svg>
);
const CheckIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12.5 9.5 17 19 7" />
    <path d="M2 12.5 6.5 17" opacity=".5" />
  </svg>
);

const FEATURES = [
  {
    title: "Instant delivery",
    desc: "Messages are pushed over a live socket connection — typed on one screen, read on another, same second.",
    icon: BoltIcon,
    tint: "bg-coral/10 text-coral",
  },
  {
    title: "Group threads",
    desc: "Spin up a room for any crew. Add or remove people without breaking the conversation history.",
    icon: GroupIcon,
    tint: "bg-cobalt/10 text-cobalt",
  },
  {
    title: "Presence & status",
    desc: "See who's online, away, or just closed their laptop — before you send the first message.",
    icon: DotIcon,
    tint: "bg-amber/20 text-amber",
  },
  {
    title: "Typing & read receipts",
    desc: "Know when someone's replying and when they've actually seen it. No guessing, no double texting.",
    icon: CheckIcon,
    tint: "bg-ink/5 text-ink",
  },
];

const Features = () => (
  <section id="features" className="border-y border-ink/10 bg-paper-deep/50">
    <div className="mx-auto max-w-6xl px-5 py-24 lg:px-8">
      <Reveal>
        <p className="font-mono text-xs uppercase tracking-widest text-ink-soft">
          Under the hood
        </p>
        <h2 className="mt-3 max-w-lg font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Built for conversations that don&rsquo;t wait.
        </h2>
      </Reveal>

      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        {FEATURES.map((f, i) => (
          <Reveal key={f.title} delay={i * 0.08}>
            <div className="group h-full rounded-2xl border-2 border-ink/10 bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:border-ink hover:shadow-hard">
              <div
                className={`grid h-11 w-11 place-items-center rounded-lg ${f.tint}`}
              >
                <f.icon />
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold text-ink">
                {f.title}
              </h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-ink-soft">
                {f.desc}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

export default Features;
