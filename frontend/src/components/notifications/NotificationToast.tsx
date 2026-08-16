import React, { useEffect, useState } from "react";
import { useSocket } from "../../context/SocketContext";
import { useAuth } from "../../context/AuthContext";
import { Message } from "../../types";
import { Bell, X } from "lucide-react";

export const NotificationToast: React.FC = () => {
  const { socket } = useSocket();
  const { user } = useAuth();
  const [toast, setToast] = useState<{ title: string; body: string; avatar?: string } | null>(null);

  useEffect(() => {
    if (!socket || !user) return;

    const handleReceiveMessage = (msg: Message) => {
      // Do NOT trigger sound/toast alert for the sender's own outgoing message
      if (msg.senderId === user.id) return;

      // Play soft audio alert tone for incoming messages
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.value = 587.33; // D5 note
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.3);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
      } catch (e) {
        // Audio context may be restricted before user interaction
      }

      setToast({
        title: msg.sender?.username || "New Message",
        body: msg.content || "Sent an attachment",
        avatar: msg.sender?.avatar
      });

      const timer = setTimeout(() => {
        setToast(null);
      }, 4000);

      return () => clearTimeout(timer);
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [socket, user]);

  if (!toast) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        backgroundColor: "var(--bg-sidebar)",
        border: "1px solid var(--accent-green)",
        borderRadius: "12px",
        padding: "14px 18px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        gap: "14px",
        zIndex: 2000,
        maxWidth: "360px"
      }}
      className="animate-fade-in"
    >
      <div style={{ position: "relative" }}>
        {toast.avatar ? (
          <img src={toast.avatar} alt={toast.title} style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }} />
        ) : (
          <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "var(--accent-green)", display: "flex", alignItems: "center", justifyCenter: "center" }}>
            <Bell size={20} color="#ffffff" />
          </div>
        )}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: "14px", fontWeight: "700", color: "var(--text-primary)" }}>{toast.title}</div>
        <div style={{ fontSize: "13px", color: "var(--text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {toast.body}
        </div>
      </div>

      <button onClick={() => setToast(null)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
        <X size={18} />
      </button>
    </div>
  );
};
