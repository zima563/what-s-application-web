import React, { useState, useEffect } from "react";
import { User } from "../../types";
import { authApi, chatApi } from "../../services/api";
import { Users, X, Check, Loader2 } from "lucide-react";

interface NewGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGroupCreated: (conversation: any) => void;
}

export const NewGroupModal: React.FC<NewGroupModalProps> = ({ isOpen, onClose, onGroupCreated }) => {
  const [groupName, setGroupName] = useState("");
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const fetchUsers = async () => {
        setLoading(true);
        try {
          const res = await authApi.get("/users");
          setAvailableUsers(res.data.data.users);
        } catch (err) {
          console.error("Failed to load users:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchUsers();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleUserSelect = (id: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((uId) => uId !== id) : [...prev, id]
    );
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim() || selectedUserIds.length === 0) return;

    setSubmitting(true);
    try {
      const response = await chatApi.post("/conversations", {
        name: groupName,
        isGroup: true,
        participantIds: selectedUserIds
      });
      onGroupCreated(response.data.data.conversation);
      onClose();
    } catch (err) {
      console.error("Failed to create group:", err);
    } finally {
      setSubmitting(false);
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
        maxWidth: "480px",
        backgroundColor: "var(--bg-sidebar)",
        border: "1px solid var(--border-color)",
        borderRadius: "16px",
        padding: "24px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.5)"
      }} className="animate-fade-in">
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
          <h3 style={{ fontSize: "18px", fontWeight: "700", color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "8px" }}>
            <Users size={20} color="var(--accent-green)" /> Create New Group
          </h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer" }}>
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleCreateGroup}>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-secondary)", marginBottom: "6px", display: "block" }}>
              Group Subject / Name
            </label>
            <input
              type="text"
              required
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="e.g. Project Developers"
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "8px",
                backgroundColor: "var(--bg-input)",
                border: "1px solid var(--border-color)",
                color: "var(--text-primary)",
                fontSize: "14px",
                outline: "none"
              }}
            />
          </div>

          <label style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-secondary)", marginBottom: "8px", display: "block" }}>
            Add Participants ({selectedUserIds.length} selected)
          </label>

          <div style={{ maxHeight: "240px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "6px", marginBottom: "20px" }}>
            {loading ? (
              <div style={{ display: "flex", justifyContent: "center", padding: "16px" }}><Loader2 size={24} className="animate-spin" /></div>
            ) : (
              availableUsers.map((u) => {
                const isSelected = selectedUserIds.includes(u.id);
                return (
                  <div
                    key={u.id}
                    onClick={() => toggleUserSelect(u.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "8px 12px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      backgroundColor: isSelected ? "var(--bg-active)" : "var(--bg-header)",
                      border: isSelected ? "1px solid var(--accent-green)" : "1px solid transparent"
                    }}
                  >
                    <img src={u.avatar} alt={u.username} style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover" }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-primary)" }}>{u.username}</div>
                    </div>
                    {isSelected && <Check size={18} color="var(--accent-green)" />}
                  </div>
                );
              })
            )}
          </div>

          <button
            type="submit"
            disabled={submitting || !groupName || selectedUserIds.length === 0}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              backgroundColor: "var(--accent-green)",
              color: "#ffffff",
              fontWeight: "600",
              border: "none",
              cursor: submitting ? "not-allowed" : "pointer"
            }}
          >
            {submitting ? "Creating Group..." : "Create Group Chat"}
          </button>
        </form>
      </div>
    </div>
  );
};
