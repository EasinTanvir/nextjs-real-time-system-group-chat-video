import ConversationDetails from "@/components/pages/ConversationDetails";
import { currentUser } from "@/lib/currentUser";
import React from "react";

const Conversation = async ({ params }) => {
  const user = await currentUser();
  const { conversationId } = await params;
  console.log(user);
  return (
    <div>
      <ConversationDetails user={user} conversationId={conversationId} />
    </div>
  );
};

export default Conversation;
