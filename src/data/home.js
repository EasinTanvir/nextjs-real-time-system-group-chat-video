import {
  AtSign,
  Bookmark,
  LockKeyhole,
  MessageCircle,
  Phone,
  Settings,
  ShieldCheck,
  UsersRound,
  Zap,
  Globe2,
  Send,
} from "lucide-react";

export const featureCards = [
  {
    title: "Real-time Messaging",
    description:
      "Instant messaging with real-time updates. See when people are typing and stay in sync.",
    icon: MessageCircle,
    tone: "bg-blue-100 text-blue-600",
  },
  {
    title: "Group Conversations",
    description:
      "Create groups, add members, and collaborate together in organized spaces.",
    icon: UsersRound,
    tone: "bg-emerald-100 text-emerald-600",
  },
  {
    title: "Secure & Private",
    description:
      "End-to-end security keeps your conversations private and your data protected.",
    icon: LockKeyhole,
    tone: "bg-amber-100 text-amber-600",
  },
  {
    title: "Voice & Video Calls",
    description:
      "High-quality voice and video calls to connect face-to-face, anytime, anywhere.",
    icon: Phone,
    tone: "bg-rose-100 text-rose-500",
  },
];

export const conversations = [
  {
    name: "Emma Johnson",
    text: "Hey! How are you doing today?",
    time: "10:30 AM",
    initials: "EJ",
    color: "from-rose-300 to-orange-200",
    unread: 2,
  },
  {
    name: "Design Team",
    text: "Alex: Here's the file",
    time: "9:45 AM",
    initials: "DT",
    color: "from-sky-300 to-indigo-300",
    unread: 1,
    group: true,
  },
  {
    name: "Liam Wilson",
    text: "See you tomorrow",
    time: "9:30 AM",
    initials: "LW",
    color: "from-emerald-300 to-teal-200",
  },
  {
    name: "Olivia Brown",
    text: "Thank you!",
    time: "Yesterday",
    initials: "OB",
    color: "from-pink-300 to-violet-300",
  },
  {
    name: "Noah Davis",
    text: "Okay!",
    time: "Yesterday",
    initials: "ND",
    color: "from-amber-300 to-orange-300",
  },
  {
    name: "Best Friends",
    text: "Sarah: It’s movie night!",
    time: "Yesterday",
    initials: "BF",
    color: "from-purple-300 to-fuchsia-300",
    group: true,
  },
  {
    name: "Project Alpha",
    text: "You: Great team! 🎉",
    time: "Mon",
    initials: "PA",
    color: "from-cyan-300 to-blue-300",
    group: true,
  },
];

export const favorites = [
  ["EJ", "Emma Johnson", "from-rose-300 to-orange-200"],
  ["DT", "Design Team", "from-sky-300 to-indigo-300"],
  ["BF", "Best Friends", "from-purple-300 to-fuchsia-300"],
  ["LW", "Liam Wilson", "from-emerald-300 to-teal-200"],
];

export const navItems = [
  [MessageCircle, "Inbox", true],
  [AtSign, "Mentions"],
  [UsersRound, "Friends"],
  [UsersRound, "Groups"],
  [Bookmark, "Bookmarks"],
  [Settings, "Settings"],
];

export const statistics = [
  [UsersRound, "50K+", "Active Users"],
  [Send, "1M+", "Messages Sent"],
  [Globe2, "99.9%", "Uptime"],
  [ShieldCheck, "256-bit", "SSL Encryption"],
];
