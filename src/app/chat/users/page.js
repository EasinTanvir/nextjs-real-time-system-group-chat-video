import React from "react";
import { cookies } from "next/headers";
import UsersPage from "@/components/pages/users/User";
import api from "@/lib/api";

const UserPage = async () => {
  const cookieStore = await cookies();
  const sid = cookieStore.get("sid")?.value;

  const { data } = await api.get("/users/discover", {
    headers: {
      Cookie: `sid=${sid}`,
    },
  });

  const users = data.data || [];

  return (
    <div className="h-full">
      <UsersPage users={users} />
    </div>
  );
};

export default UserPage;
