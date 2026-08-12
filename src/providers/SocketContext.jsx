"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import api from "@/lib/api";

const SocketContext = createContext(null);
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState(new Set());

  const loadNotifications = async () => {
    try {
      const [list, count] = await Promise.all([
        api.get("/notifications"),
        api.get("/notifications/unread-count"),
      ]);
      setNotifications(list.data.data || []);
      setUnread(count.data.data.count || 0);
    } catch {}
  };

  const markAllRead = async () => {
    if (!unread) return;
    try {
      await api.post("/notifications/read-all");
      setNotifications((items) =>
        items.map((n) => ({
          ...n,
          readAt: n.readAt || new Date().toISOString(),
        })),
      );
      setUnread(0);
    } catch {}
  };

  useEffect(() => {
    loadNotifications();

    const newSocket = io(SOCKET_URL, {
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });

    newSocket.on("connect", () => setIsConnected(true));

    newSocket.on("authenticated", (data) => {
      console.log("Socket authenticated:", data);
      if (Array.isArray(data.onlineUsers)) {
        setOnlineUsers(new Set(data.onlineUsers));
      }
    });

    newSocket.on("presence:update", ({ userId, status }) => {
      setOnlineUsers((prevUsers) => {
        const updated = new Set(prevUsers);
        if (status === "online") {
          updated.add(userId);
        } else if (status === "offline") {
          updated.delete(userId);
        }
        return updated;
      });
    });

    // remove the old presence:snapshot listener entirely

    // real-time notifications
    newSocket.on("notification:new", ({ notification }) => {
      setNotifications((prev) =>
        [notification, ...prev.filter((n) => n.id !== notification.id)].slice(
          0,
          20,
        ),
      );
      setUnread((c) => c + 1);
      toast.success(notification.title, { icon: "🔔" });
    });

    newSocket.on("disconnect", (reason) => {
      setIsConnected(false);
      if (reason === "io server disconnect") newSocket.connect();
    });

    newSocket.on("connect_error", (error) => {
      setIsConnected(false);
      if (
        error.message === "UNAUTHORIZED" ||
        error.message === "TOKEN_EXPIRED"
      ) {
        toast.error("Session expired. Please log in again.");
        newSocket.io.opts.reconnection = false;
        newSocket.disconnect();
      }
    });

    newSocket.io.on("reconnect_failed", () => {
      toast.error("Failed to connect to notifications. Please refresh.");
    });

    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        notifications,
        unread,
        markAllRead,
        onlineUsers,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) throw new Error("useSocket must be used within SocketProvider");
  return context;
};
