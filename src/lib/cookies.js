"use server";

import { cookies } from "next/headers";

export async function getCookie(name) {
  const cookieStore = await cookies();
  return cookieStore.get(name)?.value;
}

export async function logout() {
  const cookieStore = await cookies();

  cookieStore.delete("sid");
}
