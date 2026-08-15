export const dynamic = "force-dynamic";

import Friend from "@/components/pages/friends/FriendPage";
import { apiServer } from "@/lib/api";
import { getCookie } from "@/lib/cookies";

const FriendPage = async () => {
  const cookie = await getCookie("sid");

  const [friendsResponse, incomingResponse] = await Promise.all([
    apiServer.get("/friends", {
      headers: {
        Cookie: `sid=${cookie}`,
      },
    }),
    apiServer.get("/friends/requests/incoming", {
      headers: {
        Cookie: `sid=${cookie}`,
      },
    }),
  ]);
  const friends = friendsResponse.data.data || [];
  const incoming = incomingResponse.data.data || [];

  return (
    <div className="h-full">
      <Friend friendData={friends} incoming={incoming} />
    </div>
  );
};

export default FriendPage;
