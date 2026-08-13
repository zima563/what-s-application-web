import React, { useEffect, useRef, useState } from "react";
import { Conversation, Message, MessageType } from "../../types";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext";
import { chatApi } from "../../services/api";
import { MessageBubble } from "./MessageBubble";
import { ChatInput } from "./ChatInput";
import { Phone, Video, Search, MoreVertical, MessageSquare, ShieldCheck } from "lucide-react";

interface ChatWindowProps {
  conversation: Conversation | null;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ conversation }) => {
  const { user } = useAuth();
  const { socket, onlineUserIds, typingStatus } = useSocket();

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const otherParticipant = conversation && !conversation.isGroup
    ? conversation.participants.find((p) => p.id !== user?.id)
    : null;

  const title = conversation?.isGroup
    ? conversation.name || "Group Chat"
    : otherParticipant?.username || "Direct Chat";

  const avatar = conversation?.isGroup
    ? conversation.groupAvatar || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=250&q=80"
    : otherParticipant?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80";

  const isOnline = otherParticipant ? onlineUserIds.has(otherParticipant.id) || otherParticipant.isOnline : false;
  const currentTyping = conversation ? typingStatus[conversation.id] : null;

  // Load conversation messages
  useEffect(() => {
    if (!conversation) return;

    const fetchMessages = async () => {
      setLoading(true);
      try {
        const response = await chatApi.get(`/messages/${conversation.id}`);
        setMessages(response.data.data.messages);
      } catch (err) {
        console.error("Failed to load messages:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // Join room & mark read via Socket
    if (socket) {
      socket.emit("join_conversation", conversation.id);
      socket.emit("mark_read", { conversationId: conversation.id });
    }

    return () => {
      if (socket) socket.emit("leave_conversation", conversation.id);
    };
  }, [conversation?.id, socket]);

  // Listen for incoming real-time socket messages
  useEffect(() => {
    if (!socket || !conversation) return;

    const handleReceiveMessage = (newMessage: Message) => {
      if (newMessage.conversationId === conversation.id) {
        setMessages((prev) => [...prev, newMessage]);
        // Auto mark read if active
        socket.emit("mark_read", { conversationId: conversation.id });
      }
    };

    const handleMessagesRead = (data: { conversationId: string; readBy: string }) => {
      if (data.conversationId === conversation.id) {
        setMessages((prev) =>
          prev.map((msg) => ({ ...msg, status: "read" as any }))
        );
      }
    };

    socket.on("receive_message", handleReceiveMessage);
    socket.on("messages_read", handleMessagesRead);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
      socket.off("messages_read", handleMessagesRead);
    };
  }, [socket, conversation?.id]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (content: string, type: MessageType = MessageType.TEXT, mediaUrl?: string) => {
    if (!conversation) return;

    if (socket && socket.connected) {
      socket.emit("send_message", {
        conversationId: conversation.id,
        content,
        type,
        mediaUrl
      });
    } else {
      // Fallback HTTP POST
      try {
        const response = await chatApi.post("/messages", {
          conversationId: conversation.id,
          content,
          type,
          mediaUrl
        });
        setMessages((prev) => [...prev, response.data.data.message]);
      } catch (err) {
        console.error("HTTP send message failed:", err);
      }
    }
  };

  const handleTypingStart = () => {
    if (socket && conversation) {
      socket.emit("typing_start", { conversationId: conversation.id });
    }
  };

  const handleTypingStop = () => {
    if (socket && conversation) {
      socket.emit("typing_stop", { conversationId: conversation.id });
    }
  };

  if (!conversation) {
    return (
      <div style={{
        flex: 1,
        height: "100%",
        backgroundColor: "var(--bg-chat)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        borderBottom: "6px solid var(--accent-green)"
      }}>
        <div style={{ textAlign: "center", maxWidth: "420px", padding: "20px" }}>
          <div style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            backgroundColor: "rgba(0, 168, 132, 0.15)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "20px"
          }}>
            <MessageSquare size={40} color="var(--accent-green)" />
          </div>
          <h2 style={{ fontSize: "26px", fontWeight: "300", color: "var(--text-primary)", marginBottom: "10px" }}>
            WhatsApp Web Microservices
          </h2>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: "1.6", marginBottom: "24px" }}>
            Send and receive messages in real-time. Connect your devices and enjoy end-to-end synchronized chat experience.
          </p>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "var(--text-muted)" }}>
            <ShieldCheck size={16} color="var(--accent-green)" /> End-to-end encrypted microservices pipeline
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      flex: 1,
      height: "100%",
      display: "flex",
      flexDirection: "column",
      backgroundColor: "var(--bg-chat)"
    }}>
      {/* Header */}
      <div style={{
        padding: "10px 16px",
        backgroundColor: "var(--bg-header)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid var(--border-color)",
        boxShadow: "var(--shadow-sm)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <img src={avatar} alt={title} style={{ width: "42px", height: "42px", borderRadius: "50%", objectFit: "cover" }} />
          <div>
            <div style={{ fontWeight: "600", fontSize: "16px", color: "var(--text-primary)" }}>{title}</div>
            <div style={{ fontSize: "12px", color: currentTyping?.isTyping ? "var(--accent-green)" : "var(--text-secondary)", fontWeight: currentTyping?.isTyping ? "600" : "400" }}>
              {currentTyping?.isTyping
                ? `${currentTyping.username} is typing...`
                : conversation.isGroup
                ? `${conversation.participants.length} participants`
                : isOnline
                ? "online"
                : "offline"}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button title="Video Call" style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer" }}>
            <Video size={20} />
          </button>
          <button title="Voice Call" style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer" }}>
            <Phone size={19} />
          </button>
          <div style={{ width: "1px", height: "20px", backgroundColor: "var(--border-color)" }} />
          <button title="Search in Chat" style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer" }}>
            <Search size={19} />
          </button>
          <button title="Menu" style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer" }}>
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        padding: "16px 24px",
        display: "flex",
        flexDirection: "column"
      }}>
        {loading ? (
          <div style={{ textAlign: "center", color: "var(--text-muted)", marginTop: "40px", fontSize: "14px" }}>
            Loading messages...
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isOutgoing={msg.senderId === user?.id}
              showSenderName={conversation.isGroup}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Composer */}
      <ChatInput
        onSendMessage={handleSendMessage}
        onTypingStart={handleTypingStart}
        onTypingStop={handleTypingStop}
      />
    </div>
  );
};
