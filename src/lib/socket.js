import { io } from "socket.io-client";

let socket;
export const getSocket = () => {
  if (!socket) {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";
    socket = io(new URL(apiUrl).origin, {
      autoConnect: false,
      auth: () => ({ token: "" }),
    });
  }
  return socket;
};
export const connectSocket = () =>
  new Promise((resolve, reject) => {
    const current = getSocket();
    if (current.connected) return resolve(current);
    const ready = () => {
      current.off("connect_error", failed);
      resolve(current);
    };
    const failed = (error) => {
      current.off("connect", ready);
      reject(error);
    };
    current.once("connect", ready);
    current.once("connect_error", failed);
    current.connect();
  });
export const socketCall = async (event, payload) => {
  await connectSocket();
  return new Promise((resolve, reject) =>
    getSocket().emit(event, payload, (result) =>
      result?.success
        ? resolve(result.data)
        : reject(new Error(result?.message || "Real-time request failed.")),
    ),
  );
};
