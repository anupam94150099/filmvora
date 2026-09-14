import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { Film, Lock, Mail, Loader2, ShieldCheck, UserCheck } from "lucide-react";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { success, error } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const redirectPath = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      error("Please provide both email and password");
      return;
    }

    setLoading(true);
    try {
      const res = await login(email, password);
      if (res?.success) {
        success(`Welcome back, ${res.user.name}!`);
        if (res.user.role === "admin" && redirectPath === "/") {
          navigate("/admin");
        } else {
          navigate(redirectPath, { replace: true });
        }
      }
    } catch (err) {
      error(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // One-click demo credentials
  const fillDemoAdmin = () => {
    setEmail("admin@filmvora.com");
    setPassword("admin123");
  };

  const fillDemoUser = () => {
    setEmail("user@filmvora.com");
    setPassword("user123");
  };

  return (
    <div
      className="login-page fade-in flex-center"
      style={{
        minHeight: "calc(100vh - 160px)",
        padding: "3rem 1rem",
        position: "relative",
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: "100%",
          maxWidth: "440px",
          padding: "2.5rem 2rem",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            style={{
              width: "44px",
              height: "44px",
              background: "linear-gradient(135deg, #ff1a2b, #b30710)",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1rem",
              boxShadow: "0 0 20px rgba(229, 9, 20, 0.4)",
            }}
          >
            <Film size={24} color="#fff" />
          </div>
          <h2 style={{ fontSize: "1.75rem", fontWeight: 800 }}>Welcome Back</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginTop: "0.3rem" }}>
            Sign in to access your custom watchlist and 4K stream library
          </p>
        </div>

        {/* Demo One-Click Fill Options */}
        <div
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-sm)",
            padding: "0.75rem",
            marginBottom: "1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>
            Quick Demo Autofill:
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
            <button
              type="button"
              onClick={fillDemoAdmin}
              className="btn btn-glass btn-sm"
              style={{ fontSize: "0.8rem", padding: "0.4rem 0.5rem" }}
            >
              <ShieldCheck size={14} color="var(--primary)" /> Demo Admin
            </button>
            <button
              type="button"
              onClick={fillDemoUser}
              className="btn btn-glass btn-sm"
              style={{ fontSize: "0.8rem", padding: "0.4rem 0.5rem" }}
            >
              <UserCheck size={14} color="var(--accent-cyan)" /> Demo User
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: "relative" }}>
              <input
                type="email"
                required
                placeholder="name@example.com"
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

          <div className="form-group" style={{ marginBottom: "0.75rem" }}>
            <div className="flex-between">
              <label className="form-label">Password</label>
              <Link
                to="/forgot-password"
                style={{ fontSize: "0.75rem", color: "var(--primary)", fontWeight: 500 }}
              >
                Forgot Password?
              </Link>
            </div>
            <div style={{ position: "relative" }}>
              <input
                type="password"
                required
                placeholder="Enter your password"
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
            {loading ? <Loader2 size={18} className="animate-spin" /> : <span>Sign In</span>}
          </button>
        </form>

        {/* Register link */}
        <div style={{ textAlign: "center", marginTop: "1.75rem", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
          Don't have an account yet?{" "}
          <Link to="/register" style={{ color: "var(--primary)", fontWeight: 600 }}>
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
