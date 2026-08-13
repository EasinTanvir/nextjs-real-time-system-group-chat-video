import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

const fetchConversationMessages = async (conversationId) => {
  const { data } = await api.get(`/conversations/${conversationId}/messages`, {
    params: {
      limit: 100,
    },
  });

  return data.data || [];
};

export const useConversationMessages = (conversationId) => {
  return useQuery({
    queryKey: ["conversation-messages", conversationId],
    queryFn: () => fetchConversationMessages(conversationId),
    enabled: !!conversationId,
  });
};
