import { io } from "socket.io-client"; import { getToken } from "./api";
let socket;
export const getSocket = () => { if (!socket) { const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1"; socket = io(new URL(apiUrl).origin, { autoConnect: false, auth: () => ({ token: getToken() }) }); } return socket; };
export const socketCall = (event, payload) => new Promise((resolve, reject) => getSocket().emit(event, payload, (result) => result?.success ? resolve(result.data) : reject(new Error(result?.message || "Real-time request failed."))));
