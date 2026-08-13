"use server";

import { cookies } from "next/headers";
import { logoutRequest } from "./logoutRequest";

export async function getCookie(name) {
  const cookieStore = await cookies();
  return cookieStore.get(name)?.value;
}

export async function logout() {
  const cookieStore = await cookies();

  await logoutRequest();

  cookieStore.set("sid", "", {
    domain:
      process.env.NODE_ENV === "production" ? ".easintanvir.com" : undefined,
    path: "/",
    maxAge: 0,
  });
}
