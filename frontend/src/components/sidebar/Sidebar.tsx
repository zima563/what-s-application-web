import React, { useState } from "react";
import { Conversation } from "../../types";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { ChatListItem } from "./ChatListItem";
import { UserSearchModal } from "./UserSearchModal";
import { NewGroupModal } from "./NewGroupModal";
import {
  MessageSquarePlus,
  Users,
  Moon,
  Sun,
  LogOut,
  Search,
  CheckCheck
} from "lucide-react";

interface SidebarProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (conv: Conversation) => void;
  onRefreshConversations: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  onRefreshConversations
}) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [filterQuery, setFilterQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "unread" | "groups">("all");

  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);

  // Filter conversations based on tab & query
  const filteredConversations = conversations.filter((conv) => {
    // Search query filter
    const title = conv.isGroup
      ? conv.name || ""
      : conv.participants.find((p) => p.id !== user?.id)?.username || "";
    const matchesQuery = title.toLowerCase().includes(filterQuery.toLowerCase());

    if (!matchesQuery) return false;

    if (activeTab === "unread") return (conv.unreadCount || 0) > 0;
    if (activeTab === "groups") return conv.isGroup;
    return true;
  });

  return (
    <div style={{
      width: "380px",
      height: "100%",
      backgroundColor: "var(--bg-sidebar)",
      borderRight: "1px solid var(--border-color)",
      display: "flex",
      flexDirection: "column",
      flexShrink: 0
    }}>
      {/* Sidebar Header */}
      <div style={{
        padding: "12px 16px",
        backgroundColor: "var(--bg-header)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid var(--border-color)"
      }}>
        {/* User Info */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <img
            src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80"}
            alt={user?.username}
            style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }}
          />
          <div>
            <div style={{ fontWeight: "700", fontSize: "14px", color: "var(--text-primary)" }}>
              {user?.username}
            </div>
            <div style={{ fontSize: "11px", color: "var(--accent-green)", fontWeight: "600", display: "flex", alignItems: "center", gap: "4px" }}>
              <span style={{ width: "6px", height: "6px", backgroundColor: "var(--accent-green)", borderRadius: "50%", display: "inline-block" }} />
              Online • <span style={{ color: "#38bdf8", fontWeight: "700" }}>AWS Live</span> ⚡
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            onClick={toggleTheme}
            title="Toggle Light/Dark Theme"
            style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", padding: "6px", borderRadius: "50%" }}
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button
            onClick={() => setIsGroupModalOpen(true)}
            title="Create New Group"
            style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", padding: "6px" }}
          >
            <Users size={20} />
          </button>

          <button
            onClick={() => setIsSearchModalOpen(true)}
            title="Start New Direct Chat"
            style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", padding: "6px" }}
          >
            <MessageSquarePlus size={20} />
          </button>

          <button
            onClick={logout}
            title="Sign Out"
            style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer", padding: "6px" }}
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>

      {/* Local Filter Search Bar */}
      <div style={{ padding: "10px 14px", backgroundColor: "var(--bg-sidebar)" }}>
        <div style={{ position: "relative" }}>
          <Search size={16} color="var(--text-muted)" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Search or start new chat"
            style={{
              width: "100%",
              padding: "8px 12px 8px 36px",
              borderRadius: "8px",
              backgroundColor: "var(--bg-input)",
              border: "1px solid var(--border-color)",
              color: "var(--text-primary)",
              fontSize: "13px",
              outline: "none"
            }}
          />
        </div>

        {/* Filter Tabs */}
        <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
          {(["all", "unread", "groups"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "4px 12px",
                borderRadius: "16px",
                fontSize: "12px",
                fontWeight: "600",
                border: "none",
                textTransform: "capitalize",
                cursor: "pointer",
                backgroundColor: activeTab === tab ? "rgba(0, 168, 132, 0.2)" : "var(--bg-header)",
                color: activeTab === tab ? "var(--accent-green)" : "var(--text-secondary)"
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Conversations List */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {filteredConversations.length === 0 ? (
          <div style={{ padding: "32px 16px", textAlign: "center", color: "var(--text-muted)", fontSize: "14px" }}>
            <CheckCheck size={32} style={{ marginBottom: "8px", opacity: 0.5 }} />
            <p>No conversations found</p>
          </div>
        ) : (
          filteredConversations.map((conv) => (
            <ChatListItem
              key={conv.id}
              conversation={conv}
              isActive={conv.id === activeConversationId}
              onSelect={() => onSelectConversation(conv)}
            />
          ))
        )}
      </div>

      {/* Modals */}
      <UserSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSelectUser={(conv) => {
          onRefreshConversations();
          onSelectConversation(conv);
        }}
      />

      <NewGroupModal
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
        onGroupCreated={(conv) => {
          onRefreshConversations();
          onSelectConversation(conv);
        }}
      />
    </div>
  );
};
