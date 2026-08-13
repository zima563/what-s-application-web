import React, { useState, useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import { useSocket } from "./context/SocketContext";
import { chatApi } from "./services/api";
import { Conversation } from "./types";
import { Login } from "./components/auth/Login";
import { Register } from "./components/auth/Register";
import { Sidebar } from "./components/sidebar/Sidebar";
import { ChatWindow } from "./components/chat/ChatWindow";
import { NotificationToast } from "./components/notifications/NotificationToast";
import { Loader2 } from "lucide-react";

export const App: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { socket } = useSocket();

  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [loadingConversations, setLoadingConversations] = useState(false);

  const fetchConversations = async () => {
    if (!user) return;
    setLoadingConversations(true);
    try {
      const response = await chatApi.get("/conversations");
      setConversations(response.data.data.conversations);
    } catch (err) {
      console.error("Failed to load conversations:", err);
    } finally {
      setLoadingConversations(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  // Listen for socket real-time conversation updates
  useEffect(() => {
    if (!socket) return;

    const handleConversationUpdated = () => {
      fetchConversations();
    };

    socket.on("conversation_updated", handleConversationUpdated);

    return () => {
      socket.off("conversation_updated", handleConversationUpdated);
    };
  }, [socket]);

  if (authLoading) {
    return (
      <div style={{
        height: "100vh",
        backgroundColor: "var(--bg-app)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--accent-green)"
      }}>
        <Loader2 size={36} className="animate-spin" />
      </div>
    );
  }

  if (!user) {
    return authMode === "login" ? (
      <Login onSwitchToRegister={() => setAuthMode("register")} />
    ) : (
      <Register onSwitchToLogin={() => setAuthMode("login")} />
    );
  }

  return (
    <div style={{
      width: "100vw",
      height: "100vh",
      display: "flex",
      backgroundColor: "var(--bg-app)",
      overflow: "hidden"
    }}>
      <NotificationToast />
      
      {/* WhatsApp Sidebar */}
      <Sidebar
        conversations={conversations}
        activeConversationId={activeConversation?.id || null}
        onSelectConversation={(conv) => setActiveConversation(conv)}
        onRefreshConversations={fetchConversations}
      />

      {/* Active Conversation Main Screen */}
      <ChatWindow conversation={activeConversation} />
    </div>
  );
};

export default App;
