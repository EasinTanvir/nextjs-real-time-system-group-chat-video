import api from "./api";

export async function logoutRequest() {
  return api.post("/auth/logout");
}
