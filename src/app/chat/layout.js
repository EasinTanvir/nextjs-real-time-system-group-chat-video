import ChatShell from "@/components/pages/chat/layout/ChatShell";
import CallModal from "@/components/shared/CallModal";
import { CallProvider } from "@/providers/CallProvider";
import { SocketProvider } from "@/providers/SocketContext";

export default function ChatLayout({ children }) {
  return (
    <SocketProvider>
      <CallProvider>
        <ChatShell>{children}</ChatShell>
        <CallModal />
      </CallProvider>{" "}
    </SocketProvider>
  );
}
