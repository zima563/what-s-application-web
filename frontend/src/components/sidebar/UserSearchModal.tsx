import React, { useState } from "react";
import { User } from "../../types";
import { authApi, chatApi } from "../../services/api";
import { Search, X, MessageSquarePlus, Loader2 } from "lucide-react";

interface UserSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectUser: (conversation: any) => void;
}

export const UserSearchModal: React.FC<UserSearchModalProps> = ({ isOpen, onClose, onSelectUser }) => {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSearch = async (val: string) => {
    setQuery(val);
    if (!val.trim()) {
      setUsers([]);
      return;
    }
    setLoading(true);
    try {
      const response = await authApi.get(`/search?q=${encodeURIComponent(val)}`);
      setUsers(response.data.data.users);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartChat = async (recipientId: string) => {
    try {
      const response = await chatApi.post("/conversations", { recipientId, isGroup: false });
      onSelectUser(response.data.data.conversation);
      onClose();
    } catch (err) {
      console.error("Failed to start chat:", err);
    }
  };

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      backgroundColor: "rgba(0,0,0,0.65)",
      backdropFilter: "blur(4px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: "20px"
    }}>
      <div style={{
        width: "100%",
        maxWidth: "460px",
        backgroundColor: "var(--bg-sidebar)",
        border: "1px solid var(--border-color)",
        borderRadius: "16px",
        padding: "24px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.5)"
      }} className="animate-fade-in">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
          <h3 style={{ fontSize: "18px", fontWeight: "700", color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "8px" }}>
            <MessageSquarePlus size={20} color="var(--accent-green)" /> Start New Chat
          </h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer" }}>
            <X size={22} />
          </button>
        </div>

        {/* Search Input */}
        <div style={{ position: "relative", marginBottom: "20px" }}>
          <Search size={18} color="var(--text-muted)" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search contacts by name or email..."
            style={{
              width: "100%",
              padding: "10px 14px 10px 38px",
              borderRadius: "8px",
              backgroundColor: "var(--bg-input)",
              border: "1px solid var(--border-color)",
              color: "var(--text-primary)",
              fontSize: "14px",
              outline: "none"
            }}
            autoFocus
          />
        </div>

        {/* Users List */}
        <div style={{ maxHeight: "300px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "8px" }}>
          {loading && (
            <div style={{ display: "flex", justifyContent: "center", padding: "20px", color: "var(--text-secondary)" }}>
              <Loader2 size={24} className="animate-spin" />
            </div>
          )}

          {!loading && users.length === 0 && query.trim() !== "" && (
            <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "16px", fontSize: "14px" }}>
              No contacts found matching "{query}"
            </p>
          )}

          {users.map((u) => (
            <div
              key={u.id}
              onClick={() => handleStartChat(u.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "10px",
                borderRadius: "8px",
                cursor: "pointer",
                backgroundColor: "var(--bg-header)",
                transition: "background 0.2s"
              }}
            >
              <img src={u.avatar} alt={u.username} style={{ width: "42px", height: "42px", borderRadius: "50%", objectFit: "cover" }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: "600", fontSize: "14px", color: "var(--text-primary)" }}>{u.username}</div>
                <div style={{ fontSize: "12px", color: "var(--text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {u.statusMessage}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
