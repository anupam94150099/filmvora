import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { Shield, Lock, Mail, Loader2, Key } from "lucide-react";

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { success, error } = useToast();

  const [email, setEmail] = useState("admin@filmvora.com");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(email, password);
      if (res?.success) {
        if (res.user.role === "admin") {
          success("Administrator authenticated successfully!");
          navigate("/admin");
        } else {
          error("Access denied. Administrator privileges required.");
        }
      }
    } catch (err) {
      error(err.response?.data?.message || "Invalid administrative credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="admin-login-page fade-in flex-center"
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--bg-main)",
        padding: "2rem 1rem",
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: "100%",
          maxWidth: "420px",
          padding: "2.5rem 2rem",
          boxShadow: "0 20px 50px rgba(0,0,0,0.8)",
          border: "1px solid rgba(229, 9, 20, 0.3)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            style={{
              width: "50px",
              height: "50px",
              background: "linear-gradient(135deg, #ff1a2b, #b30710)",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1rem",
              boxShadow: "0 0 25px rgba(229, 9, 20, 0.5)",
            }}
          >
            <Shield size={28} color="#fff" />
          </div>
          <h2 style={{ fontSize: "1.75rem", fontWeight: 800 }}>FILMVORA</h2>
          <span className="badge badge-red" style={{ marginTop: "0.25rem" }}>
            ADMIN ACCESS PORTAL
          </span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Administrator Email</label>
            <div style={{ position: "relative" }}>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                style={{ paddingLeft: "2.5rem" }}
              />
              <Mail
                size={16}
                color="var(--text-muted)"
                style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)" }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Master Password</label>
            <div style={{ position: "relative" }}>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                style={{ paddingLeft: "2.5rem" }}
              />
              <Lock
                size={16}
                color="var(--text-muted)"
                style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)" }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: "100%", marginTop: "1.25rem", padding: "0.85rem" }}
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <span>Authorize Access</span>}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <Link to="/" style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
            &larr; Return to Public Platform
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
