import { currentUser } from "@/lib/currentUser"; // adjust to your actual helper
import ConversationDetails from "@/components/pages/details/ConversationDetails";

const Conversation = async ({ params }) => {
  const user = await currentUser();
  const { conversationId } = await params;

  return (
    <ConversationDetails user={user?.user} conversationId={conversationId} />
  );
};

export default Conversation;
