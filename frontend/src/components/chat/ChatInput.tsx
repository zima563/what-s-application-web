import React, { useState, useRef, useEffect } from "react";
import { Smile, Paperclip, Send, Mic, Image, FileText, X } from "lucide-react";
import { MessageType } from "../../types";

interface ChatInputProps {
  onSendMessage: (content: string, type?: MessageType, mediaUrl?: string) => void;
  onTypingStart: () => void;
  onTypingStop: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, onTypingStart, onTypingStop }) => {
  const [text, setText] = useState("");
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [selectedMediaUrl, setSelectedMediaUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<MessageType>(MessageType.TEXT);

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);

    // Emit typing indicator
    onTypingStart();

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      onTypingStop();
    }, 2000);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() && !selectedMediaUrl) return;

    onSendMessage(text, selectedMediaUrl ? mediaType : MessageType.TEXT, selectedMediaUrl || undefined);

    setText("");
    setSelectedMediaUrl(null);
    setMediaType(MessageType.TEXT);
    setShowAttachmentMenu(false);

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    onTypingStop();
  };

  const selectSampleImage = () => {
    setSelectedMediaUrl("https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80");
    setMediaType(MessageType.IMAGE);
    setShowAttachmentMenu(false);
  };

  return (
    <div style={{
      padding: "10px 16px",
      backgroundColor: "var(--bg-header)",
      borderTop: "1px solid var(--border-color)",
      position: "relative"
    }}>

      {/* Media Attachment Drawer Preview */}
      {selectedMediaUrl && (
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "8px 12px",
          backgroundColor: "var(--bg-input)",
          borderRadius: "8px",
          marginBottom: "8px"
        }}>
          <img src={selectedMediaUrl} alt="preview" style={{ width: "40px", height: "40px", borderRadius: "6px", objectFit: "cover" }} />
          <span style={{ fontSize: "13px", color: "var(--text-secondary)", flex: 1 }}>Photo attachment ready</span>
          <button onClick={() => setSelectedMediaUrl(null)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
            <X size={18} />
          </button>
        </div>
      )}

      {/* Attachment Popover Menu */}
      {showAttachmentMenu && (
        <div style={{
          position: "absolute",
          bottom: "65px",
          left: "50px",
          backgroundColor: "var(--bg-sidebar)",
          border: "1px solid var(--border-color)",
          borderRadius: "12px",
          padding: "10px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
          display: "flex",
          gap: "12px",
          zIndex: 50
        }} className="animate-fade-in">
          <button
            onClick={selectSampleImage}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px",
              background: "none",
              border: "none",
              color: "var(--text-primary)",
              cursor: "pointer",
              fontSize: "12px"
            }}
          >
            <div style={{ padding: "10px", backgroundColor: "#bf59cf", borderRadius: "50%" }}>
              <Image size={20} color="#ffffff" />
            </div>
            Photos
          </button>

          <button
            onClick={() => {
              onSendMessage("Project_Documentation.pdf", MessageType.DOCUMENT);
              setShowAttachmentMenu(false);
            }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px",
              background: "none",
              border: "none",
              color: "var(--text-primary)",
              cursor: "pointer",
              fontSize: "12px"
            }}
          >
            <div style={{ padding: "10px", backgroundColor: "#5f66cd", borderRadius: "50%" }}>
              <FileText size={20} color="#ffffff" />
            </div>
            Document
          </button>
        </div>
      )}

      {/* Main Composer Bar */}
      <form onSubmit={handleSend} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <button
          type="button"
          onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
          style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", padding: "6px" }}
        >
          <Paperclip size={22} />
        </button>

        <button
          type="button"
          onClick={() => setText((prev) => prev + " 😊")}
          style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", padding: "6px" }}
        >
          <Smile size={22} />
        </button>

        <input
          type="text"
          value={text}
          onChange={handleInputChange}
          placeholder="Type a message"
          style={{
            flex: 1,
            padding: "11px 16px",
            borderRadius: "8px",
            backgroundColor: "var(--bg-input)",
            border: "1px solid var(--border-color)",
            color: "var(--text-primary)",
            fontSize: "14px",
            outline: "none"
          }}
        />

        {text.trim() || selectedMediaUrl ? (
          <button
            type="submit"
            style={{
              backgroundColor: "var(--accent-green)",
              color: "#ffffff",
              border: "none",
              borderRadius: "50%",
              width: "42px",
              height: "42px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              flexShrink: 0
            }}
          >
            <Send size={18} />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onSendMessage("Voice Memo Recording", MessageType.AUDIO)}
            style={{
              backgroundColor: "transparent",
              color: "var(--text-secondary)",
              border: "none",
              borderRadius: "50%",
              width: "42px",
              height: "42px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer"
            }}
          >
            <Mic size={22} />
          </button>
        )}
      </form>
    </div>
  );
};
