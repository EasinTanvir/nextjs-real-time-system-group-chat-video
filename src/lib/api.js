import axios from "axios";

const api = axios.create({
  // baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1",
  baseURL: "/api/v1",
  timeout: 15000,
  withCredentials: true,
});
export const apiServer = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,

  timeout: 15000,
  withCredentials: true,
});

export default api;
