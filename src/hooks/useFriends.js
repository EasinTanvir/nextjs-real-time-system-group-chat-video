import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import api from "@/lib/api";

const friendsKeys = {
  all: ["friends"],
  list: () => [...friendsKeys.all, "list"],
  incoming: () => [...friendsKeys.all, "incoming"],
};

const fetchFriends = async () => {
  const response = await api.get("/friends");
  return response.data.data || [];
};

const fetchIncomingRequests = async () => {
  const response = await api.get("/friends/requests/incoming");
  return response.data.data || [];
};

export const useFriends = () => {
  const queryClient = useQueryClient();

  const friendsQuery = useQuery({
    queryKey: friendsKeys.list(),
    queryFn: fetchFriends,
  });

  const incomingQuery = useQuery({
    queryKey: friendsKeys.incoming(),
    queryFn: fetchIncomingRequests,
  });

  const acceptRequestMutation = useMutation({
    mutationFn: async (requestId) => {
      const response = await api.post(`/friends/requests/${requestId}/accept`);

      return response.data;
    },

    onSuccess: () => {
      toast.success("Friend request accepted");

      queryClient.invalidateQueries({
        queryKey: friendsKeys.list(),
      });

      queryClient.invalidateQueries({
        queryKey: friendsKeys.incoming(),
      });
    },

    onError: (error) => {
      toast.error(error.response?.data?.message || error.message);
    },
  });

  const rejectRequestMutation = useMutation({
    mutationFn: async (requestId) => {
      const response = await api.post(`/friends/requests/${requestId}/reject`);

      return response.data;
    },

    onSuccess: () => {
      toast.success("Friend request rejected");

      queryClient.invalidateQueries({
        queryKey: friendsKeys.incoming(),
      });
    },

    onError: (error) => {
      toast.error(error.response?.data?.message || error.message);
    },
  });

  return {
    friends: friendsQuery.data || [],
    incoming: incomingQuery.data || [],

    loading: friendsQuery.isLoading || incomingQuery.isLoading,

    error: friendsQuery.error || incomingQuery.error,

    isAccepting: acceptRequestMutation.isPending,
    isRejecting: rejectRequestMutation.isPending,

    acceptRequest: acceptRequestMutation.mutateAsync,
    rejectRequest: rejectRequestMutation.mutateAsync,

    refetchFriends: friendsQuery.refetch,
    refetchIncoming: incomingQuery.refetch,
  };
};
