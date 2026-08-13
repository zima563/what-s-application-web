import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { authApi } from "../../services/api";
import { MessageSquare, Lock, Mail, User as UserIcon, Image, ArrowRight, Loader2 } from "lucide-react";

interface RegisterProps {
  onSwitchToLogin: () => void;
}

export const Register: React.FC<RegisterProps> = ({ onSwitchToLogin }) => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authApi.post("/register", {
        username,
        email,
        password,
        avatar: avatar || undefined,
        statusMessage: statusMessage || undefined
      });
      const { token, user } = response.data.data;
      login(token, user);
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "var(--bg-app)",
      padding: "20px"
    }}>
      <div style={{
        width: "100%",
        maxWidth: "460px",
        backgroundColor: "var(--bg-sidebar)",
        border: "1px solid var(--border-color)",
        borderRadius: "16px",
        padding: "36px 30px",
        boxShadow: "var(--shadow-sm)"
      }} className="animate-fade-in">
        
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            backgroundColor: "var(--accent-green)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "12px"
          }}>
            <MessageSquare size={30} color="#ffffff" />
          </div>
          <h2 style={{ fontSize: "24px", fontWeight: "700", color: "var(--text-primary)" }}>
            Create WhatsApp Account
          </h2>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "4px" }}>
            Join the real-time microservices chat platform
          </p>
        </div>

        {error && (
          <div style={{
            backgroundColor: "rgba(239, 68, 68, 0.15)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            color: "#f87171",
            padding: "10px",
            borderRadius: "8px",
            fontSize: "14px",
            marginBottom: "16px",
            textAlign: "center"
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-secondary)", marginBottom: "4px", display: "block" }}>
              Username
            </label>
            <div style={{ position: "relative" }}>
              <UserIcon size={18} color="var(--text-muted)" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="john_doe"
                style={{
                  width: "100%",
                  padding: "10px 14px 10px 42px",
                  borderRadius: "8px",
                  backgroundColor: "var(--bg-input)",
                  border: "1px solid var(--border-color)",
                  color: "var(--text-primary)",
                  fontSize: "14px",
                  outline: "none"
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-secondary)", marginBottom: "4px", display: "block" }}>
              Email Address
            </label>
            <div style={{ position: "relative" }}>
              <Mail size={18} color="var(--text-muted)" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                style={{
                  width: "100%",
                  padding: "10px 14px 10px 42px",
                  borderRadius: "8px",
                  backgroundColor: "var(--bg-input)",
                  border: "1px solid var(--border-color)",
                  color: "var(--text-primary)",
                  fontSize: "14px",
                  outline: "none"
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-secondary)", marginBottom: "4px", display: "block" }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <Lock size={18} color="var(--text-muted)" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: "100%",
                  padding: "10px 14px 10px 42px",
                  borderRadius: "8px",
                  backgroundColor: "var(--bg-input)",
                  border: "1px solid var(--border-color)",
                  color: "var(--text-primary)",
                  fontSize: "14px",
                  outline: "none"
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-secondary)", marginBottom: "4px", display: "block" }}>
              Avatar Image URL (Optional)
            </label>
            <div style={{ position: "relative" }}>
              <Image size={18} color="var(--text-muted)" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
              <input
                type="url"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                style={{
                  width: "100%",
                  padding: "10px 14px 10px 42px",
                  borderRadius: "8px",
                  backgroundColor: "var(--bg-input)",
                  border: "1px solid var(--border-color)",
                  color: "var(--text-primary)",
                  fontSize: "14px",
                  outline: "none"
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: "10px",
              padding: "13px",
              borderRadius: "8px",
              backgroundColor: "var(--accent-green)",
              color: "#ffffff",
              fontWeight: "600",
              fontSize: "15px",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px"
            }}
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : <>Register Account <ArrowRight size={18} /></>}
          </button>
        </form>

        <div style={{ marginTop: "20px", textAlign: "center", fontSize: "14px", color: "var(--text-secondary)" }}>
          Already have an account?{" "}
          <button
            onClick={onSwitchToLogin}
            style={{
              background: "none",
              border: "none",
              color: "var(--accent-green)",
              fontWeight: "600",
              cursor: "pointer",
              textDecoration: "underline"
            }}
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};
