import { currentUser } from "@/lib/currentUser"; // adjust to your actual helper
import ConversationDetails from "@/components/pages/ConversationDetails";

const Conversation = async ({ params }) => {
  const user = await currentUser();
  const { conversationId } = await params;
  console.log({ user });
  return (
    <ConversationDetails user={user?.user} conversationId={conversationId} />
  );
};

export default Conversation;
