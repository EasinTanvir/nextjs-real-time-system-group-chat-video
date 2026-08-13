export const conversationDemo = {
  contact: { name: "Maya Chen", initials: "MC", status: "online" },
  messages: [
    {
      from: "them",
      text: "sent the new mockups, take a look",
      time: "10:24 AM",
    },
    {
      from: "me",
      text: "these look great, love the new palette",
      time: "10:26 AM",
    },
  ],
  typing: true,
};

export const friendSuggestion = {
  name: "Owen Park",
  initials: "OP",
  mutuals: 4,
};

export const groupDraft = {
  name: "Design Crew",
  members: [{ initials: "MC" }, { initials: "OP" }, { initials: "RS" }],
  memberCount: 8,
};

export const statusOptions = [
  {
    key: "online",
    label: "Online",
    color: "var(--color-coral)",
    note: "Visible to everyone in your threads.",
  },
  {
    key: "away",
    label: "Away",
    color: "var(--color-amber)",
    note: "Friends see you stepped out, messages still land.",
  },
  {
    key: "offline",
    label: "Offline",
    color: "var(--color-ink-soft)",
    note: "You'll see everything the moment you're back.",
  },
];

export const presenceFriends = [
  { name: "Maya Chen", initials: "MC", status: "online" },
  { name: "Owen Park", initials: "OP", status: "online" },
  { name: "Riya Shah", initials: "RS", status: "away" },
  { name: "Leo Fischer", initials: "LF", status: "offline" },
];

export const featureCards = [
  {
    title: "Real-time sync",
    description:
      "Messages, edits, and reactions land the instant they're sent — no refresh, no delay.",
    iconKey: "zap",
    tone: "bg-coral-soft text-coral",
  },
  {
    title: "Group threads",
    description:
      "Spin up a group in seconds, pull anyone in from your contacts, keep everyone on one page.",
    iconKey: "users",
    tone: "bg-cobalt/10 text-cobalt",
  },
  {
    title: "Presence & status",
    description:
      "Online, away, or offline — your status updates everywhere the moment it changes.",
    iconKey: "signal",
    tone: "bg-amber/15 text-amber",
  },
  {
    title: "Private by design",
    description:
      "Conversations are encrypted in transit — only the people in the thread can read them.",
    iconKey: "lock",
    tone: "bg-ink/8 text-ink",
  },
];

export const capabilityTags = [
  "Read receipts",
  "Typing indicators",
  "File & image sharing",
  "Cross-platform sync",
  "Message reactions",
  "Voice & video calls",
];

export const statistics = [
  ["zap", "<50ms", "message latency"],
  ["globe", "180+", "countries"],
  ["users", "2.4M+", "daily active users"],
  ["shield", "99.98%", "uptime"],
];
