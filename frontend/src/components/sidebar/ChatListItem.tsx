import React from "react";
import { Conversation } from "../../types";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext";
import { Users } from "lucide-react";

interface ChatListItemProps {
  conversation: Conversation;
  isActive: boolean;
  onSelect: () => void;
}

export const ChatListItem: React.FC<ChatListItemProps> = ({ conversation, isActive, onSelect }) => {
  const { user } = useAuth();
  const { onlineUserIds, typingStatus } = useSocket();

  // Find other participant for direct chats
  const otherParticipant = conversation.isGroup
    ? null
    : conversation.participants.find((p) => p.id !== user?.id);

  const title = conversation.isGroup
    ? conversation.name || "Group Chat"
    : otherParticipant?.username || "Direct Chat";

  const avatar = conversation.isGroup
    ? conversation.groupAvatar || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=250&q=80"
    : otherParticipant?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80";

  const isOnline = otherParticipant ? onlineUserIds.has(otherParticipant.id) || otherParticipant.isOnline : false;
  const currentTyping = typingStatus[conversation.id];

  const formatTime = (timeStr?: string) => {
    if (!timeStr) return "";
    const date = new Date(timeStr);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div
      onClick={onSelect}
      style={{
        display: "flex",
        alignItems: "center",
        padding: "12px 16px",
        gap: "14px",
        cursor: "pointer",
        backgroundColor: isActive ? "var(--bg-active)" : "transparent",
        borderBottom: "1px solid var(--border-color)",
        transition: "background 0.15s ease"
      }}
      className="chat-list-item"
    >
      {/* Avatar Container */}
      <div style={{ position: "relative", flexShrink: 0 }}>
        <img
          src={avatar}
          alt={title}
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            objectFit: "cover"
          }}
        />
        {!conversation.isGroup && isOnline && (
          <span
            style={{
              position: "absolute",
              bottom: "2px",
              right: "2px",
              width: "12px",
              height: "12px",
              backgroundColor: "var(--accent-green)",
              borderRadius: "50%",
              border: "2px solid var(--bg-sidebar)"
            }}
          />
        )}
      </div>

      {/* Content Info */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "4px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{
            fontWeight: "600",
            fontSize: "15px",
            color: "var(--text-primary)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}>
            {conversation.isGroup && <Users size={15} color="var(--text-secondary)" />}
            {title}
          </span>
          <span style={{ fontSize: "12px", color: "var(--text-muted)", flexShrink: 0 }}>
            {formatTime(conversation.lastMessageTime)}
          </span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{
            fontSize: "13px",
            color: currentTyping?.isTyping ? "var(--accent-green)" : "var(--text-secondary)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontWeight: currentTyping?.isTyping ? "600" : "400"
          }}>
            {currentTyping?.isTyping
              ? `${currentTyping.username} typing...`
              : conversation.lastMessageContent || "No messages yet"}
          </span>

          {!!conversation.unreadCount && conversation.unreadCount > 0 && (
            <span style={{
              backgroundColor: "var(--accent-green)",
              color: "#ffffff",
              fontSize: "11px",
              fontWeight: "700",
              borderRadius: "10px",
              padding: "2px 7px",
              minWidth: "18px",
              textAlign: "center"
            }}>
              {conversation.unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
