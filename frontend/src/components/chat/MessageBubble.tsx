import React from "react";
import { Message, MessageStatus, MessageType } from "../../types";
import { Check, CheckCheck, FileText, Image as ImageIcon, Volume2 } from "lucide-react";

interface MessageBubbleProps {
  message: Message;
  isOutgoing: boolean;
  showSenderName?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOutgoing, showSenderName }) => {
  const formatTime = (timeStr: string) => {
    const d = new Date(timeStr);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const renderStatusTicks = () => {
    if (!isOutgoing) return null;
    if (message.status === MessageStatus.READ) {
      return <CheckCheck size={16} color="var(--tick-blue)" />;
    }
    if (message.status === MessageStatus.DELIVERED) {
      return <CheckCheck size={16} color="var(--text-muted)" />;
    }
    return <Check size={16} color="var(--text-muted)" />;
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: isOutgoing ? "flex-end" : "flex-start",
        margin: "4px 0",
        width: "100%"
      }}
      className="animate-fade-in"
    >
      <div
        style={{
          maxWidth: "65%",
          padding: "8px 12px 6px 12px",
          borderRadius: isOutgoing ? "8px 0px 8px 8px" : "0px 8px 8px 8px",
          backgroundColor: isOutgoing ? "var(--bg-bubble-outgoing)" : "var(--bg-bubble-incoming)",
          color: "var(--text-primary)",
          boxShadow: "var(--shadow-sm)",
          position: "relative"
        }}
      >
        {/* Group Chat Sender Name */}
        {!isOutgoing && showSenderName && message.sender && (
          <div style={{ fontSize: "12px", fontWeight: "700", color: "var(--accent-green)", marginBottom: "3px" }}>
            {message.sender.username}
          </div>
        )}

        {/* Media Preview Attachment */}
        {message.type === MessageType.IMAGE && message.mediaUrl && (
          <div style={{ marginBottom: "6px", borderRadius: "6px", overflow: "hidden" }}>
            <img
              src={message.mediaUrl}
              alt="attachment"
              style={{ maxWidth: "100%", maxHeight: "250px", objectFit: "cover", display: "block" }}
            />
          </div>
        )}

        {/* Audio Memo */}
        {message.type === MessageType.AUDIO && (
          <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "6px 0", color: "var(--text-primary)" }}>
            <div style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              backgroundColor: "var(--accent-green)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <Volume2 size={18} color="#ffffff" />
            </div>
            <div style={{ flex: 1, fontSize: "13px", fontStyle: "italic", color: "var(--text-secondary)" }}>
              Voice Note (0:15)
            </div>
          </div>
        )}

        {/* Document */}
        {message.type === MessageType.DOCUMENT && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "4px 0" }}>
            <FileText size={20} color="var(--accent-green)" />
            <span style={{ fontSize: "13px", underline: "true" }}>{message.content}</span>
          </div>
        )}

        {/* Message Content Text */}
        {message.type === MessageType.TEXT && (
          <p style={{ fontSize: "14px", lineHeight: "1.45", wordBreak: "break-word" }}>
            {message.content}
          </p>
        )}

        {/* Footer Meta (Timestamp + Double Ticks) */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: "4px",
          marginTop: "4px",
          fontSize: "11px",
          color: "var(--text-muted)",
          userSelect: "none"
        }}>
          <span>{formatTime(message.createdAt)}</span>
          {renderStatusTicks()}
        </div>
      </div>
    </div>
  );
};
