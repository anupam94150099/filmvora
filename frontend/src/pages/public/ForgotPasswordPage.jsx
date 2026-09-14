import React, { useState } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";
import { useToast } from "../../context/ToastContext";
import { Film, Mail, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";

const ForgotPasswordPage = () => {
  const { success, error } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      error("Please enter your email address");
      return;
    }

    setLoading(true);
    try {
      const res = await API.post("/auth/forgot-password", { email });
      if (res.data.success) {
        setSubmitted(true);
        success(res.data.message);
      }
    } catch (err) {
      error(err.response?.data?.message || "Failed to process request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="forgot-password-page fade-in flex-center"
      style={{
        minHeight: "calc(100vh - 160px)",
        padding: "3rem 1rem",
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
            }}
          >
            <Film size={24} color="#fff" />
          </div>
          <h2 style={{ fontSize: "1.75rem", fontWeight: 800 }}>Reset Password</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginTop: "0.3rem" }}>
            Enter your email and we'll dispatch password recovery instructions.
          </p>
        </div>

        {submitted ? (
          <div style={{ textAlign: "center", padding: "1rem 0" }}>
            <CheckCircle2 size={48} color="var(--accent-emerald)" style={{ margin: "0 auto 1rem" }} />
            <h3 style={{ fontSize: "1.15rem", marginBottom: "0.5rem" }}>Instructions Sent!</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>
              We've dispatched recovery steps to <strong>{email}</strong>.
            </p>
            <Link to="/login" className="btn btn-primary" style={{ width: "100%" }}>
              Back to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Account Email Address</label>
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

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: "100%", marginTop: "1rem", padding: "0.85rem" }}
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <span>Send Reset Instructions</span>}
            </button>
          </form>
        )}

        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <Link
            to="/login"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              fontSize: "0.875rem",
              color: "var(--text-secondary)",
            }}
          >
            <ArrowLeft size={16} /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
