import ChatShell from "@/components/pages/chat/layout/ChatShell";
import CallModal from "@/components/shared/CallModal";
import { CallProvider } from "@/providers/CallProvider";

export default function ChatLayout({ children }) {
  return (
    <CallProvider>
      <ChatShell>{children}</ChatShell>
      <CallModal />
    </CallProvider>
  );
}
