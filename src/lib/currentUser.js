"use server";

import api from "./api";
import { getCookie } from "./cookies";

export const currentUser = async () => {
  try {
    const cookie = await getCookie("sid");
    if (!cookie) return null;
    const res = await api.get("/me", { headers: { Cookie: `sid=${cookie}` } });
    return res.data.data;
  } catch (err) {
    console.error(err);
    return null;
  }
};
