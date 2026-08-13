import ChatShell from "./_components/chat-shell";

// this layout for all chat Pages
// /chat/page.js
// caht/users
// caht/friends
// /chat/conversation/[converationId]/page.js
export default function ChatLayout({ children }) {
  return <ChatShell>{children}</ChatShell>;
}
