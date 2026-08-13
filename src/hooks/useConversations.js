import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import toast from "react-hot-toast";

const fetchConversations = async () => {
  try {
    const { data } = await api.get("/conversations");
    return data.data || [];
  } catch (e) {
    toast.error(e.response?.data?.message || e.message);
    throw e;
  }
};

export const useConversations = () => {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: fetchConversations,
    retry: false,
  });
};

const fetchConversation = async (conversationId) => {
  const { data } = await api.get(`/conversations/${conversationId}`);

  return data.data;
};

export const useConversation = (conversationId) => {
  return useQuery({
    queryKey: ["conversation", conversationId],
    queryFn: () => fetchConversation(conversationId),
    enabled: !!conversationId,
  });
};
