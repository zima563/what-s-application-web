import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./AuthContext";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  onlineUserIds: Set<string>;
  typingStatus: Record<string, { username: string; isTyping: boolean }>;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  onlineUserIds: new Set(),
  typingStatus: {}
});

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUserIds, setOnlineUserIds] = useState<Set<string>>(new Set());
  const [typingStatus, setTypingStatus] = useState<Record<string, { username: string; isTyping: boolean }>>({});

  useEffect(() => {
    if (!token || !user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5002";
    const newSocket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket", "polling"]
    });

    newSocket.on("connect", () => {
      console.log("⚡ [SocketContext] Connected to Chat WebSockets server.");
      setIsConnected(true);
    });

    newSocket.on("disconnect", () => {
      console.log("🔌 [SocketContext] Disconnected from Chat server.");
      setIsConnected(false);
    });

    newSocket.on("user_status_change", (data: { userId: string; isOnline: boolean }) => {
      setOnlineUserIds((prev) => {
        const next = new Set(prev);
        if (data.isOnline) next.add(data.userId);
        else next.delete(data.userId);
        return next;
      });
    });

    newSocket.on("user_typing", (data: { conversationId: string; userId: string; username: string; isTyping: boolean }) => {
      if (data.userId === user.id) return;
      setTypingStatus((prev) => ({
        ...prev,
        [data.conversationId]: { username: data.username, isTyping: data.isTyping }
      }));
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [token, user]);

  return (
    <SocketContext.Provider value={{ socket, isConnected, onlineUserIds, typingStatus }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
