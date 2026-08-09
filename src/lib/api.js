import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1",
  timeout: 15000,
});
// api.interceptors.request.use((config) => {
//   const token = getToken();
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });
// api.interceptors.response.use(
//   (response) => response.data.data,
//   (error) => {
//     const message =
//       error.response?.data?.message ||
//       error.message ||
//       "Unable to reach the server.";
//     if (error.response?.status === 401) {
//       clearToken();
//       window.dispatchEvent(new Event("chatify:unauthorized"));
//     }
//     return Promise.reject(new Error(message));
//   },
// );
export default api;
