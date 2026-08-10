"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

import toast from "react-hot-toast";

const SocketContext = createContext(null);
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "http://localhost:4000";

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });

    // Connection established
    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
      setIsConnected(true);
    });

    // Authentication payload confirmed from server
    newSocket.on("authenticated", (data) => {
      console.log("Socket authenticated:", data);
    });

    // Incoming test / notification event
    newSocket.on("test", (data) => {
      console.log("Test notification received:", data);
    });

    // Handle disconnection
    newSocket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
      setIsConnected(false);

      if (reason === "io server disconnect") {
        // Server manually closed connection; reconnect manually if needed
        newSocket.connect();
      }
    });

    // Handle authentication or connection failures
    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
      setIsConnected(false);

      if (
        error.message === "UNAUTHORIZED" ||
        error.message === "TOKEN_EXPIRED"
      ) {
        toast.error("Session expired. Please log in again.");
        // Stop automatic reconnect attempts on auth failure
        newSocket.io.opts.reconnection = false;
        newSocket.disconnect();
      }
    });

    // Native Socket.IO event when max reconnection attempts are reached
    newSocket.io.on("reconnect_failed", () => {
      toast.error("Failed to connect to notifications. Please refresh.");
    });

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      console.log("Cleaning up socket connection");
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within SocketProvider");
  }
  return context;
};
