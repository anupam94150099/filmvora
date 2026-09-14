import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Film, Mail, ArrowRight, ShieldCheck, Heart } from "lucide-react";
import { useToast } from "../../context/ToastContext";

const Footer = () => {
  const [email, setEmail] = useState("");
  const { success } = useToast();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      success("Thank you for subscribing to Filmvora Premiere updates!");
      setEmail("");
    }
  };

  return (
    <footer
      style={{
        backgroundColor: "#07080b",
        borderTop: "1px solid var(--border-subtle)",
        padding: "4rem 0 2rem",
        marginTop: "auto",
      }}
    >
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "2.5rem",
            marginBottom: "3.5rem",
          }}
        >
          {/* Brand & Vision */}
          <div style={{ maxWidth: "320px" }}>
            <Link
              to="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "1.4rem",
                fontWeight: 900,
                letterSpacing: "0.08em",
                color: "#ffffff",
                marginBottom: "1rem",
              }}
            >
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  background: "linear-gradient(135deg, #ff1a2b, #b30710)",
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    width: 0,
                    height: 0,
                    borderTop: "5px solid transparent",
                    borderBottom: "5px solid transparent",
                    borderLeft: "8px solid #ffffff",
                    marginLeft: "2px",
                  }}
                />
              </div>
              <span>FILM<span style={{ color: "var(--primary)" }}>VORA</span></span>
            </Link>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: "1.2rem" }}>
              "Stories Worth Watching."
            </p>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", lineHeight: 1.5 }}>
              Filmvora is a next-generation cinematic streaming ecosystem committed to high-definition open cinema, independent masterpieces, and licensed entertainment.
            </p>
          </div>

          {/* Explore Links */}
          <div>
            <h4 style={{ fontSize: "1rem", color: "#fff", marginBottom: "1.2rem" }}>Explore Platform</h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.7rem", fontSize: "0.9rem" }}>
              <li>
                <Link to="/movies" style={{ color: "var(--text-secondary)" }}>
                  All Movies
                </Link>
              </li>
              <li>
                <Link to="/movies?trending=true" style={{ color: "var(--text-secondary)" }}>
                  Trending Hits
                </Link>
              </li>
              <li>
                <Link to="/genres" style={{ color: "var(--text-secondary)" }}>
                  Genre Hub
                </Link>
              </li>
              <li>
                <Link to="/watchlist" style={{ color: "var(--text-secondary)" }}>
                  My Watchlist
                </Link>
              </li>
              <li>
                <Link to="/about" style={{ color: "var(--text-secondary)" }}>
                  About Filmvora
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div>
            <h4 style={{ fontSize: "1rem", color: "#fff", marginBottom: "1.2rem" }}>Trust & Legal</h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.7rem", fontSize: "0.9rem" }}>
              <li>
                <Link to="/legal?tab=privacy" style={{ color: "var(--text-secondary)" }}>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/legal?tab=terms" style={{ color: "var(--text-secondary)" }}>
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/legal?tab=copyright" style={{ color: "var(--text-secondary)" }}>
                  Copyright & DMCA
                </Link>
              </li>
              <li>
                <Link to="/legal?tab=submissions" style={{ color: "var(--text-secondary)" }}>
                  Content Submissions
                </Link>
              </li>
              <li>
                <Link to="/contact" style={{ color: "var(--text-secondary)" }}>
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Subscribe */}
          <div>
            <h4 style={{ fontSize: "1rem", color: "#fff", marginBottom: "1.2rem" }}>Stay Updated</h4>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "1rem" }}>
              Get weekly curated recommendations and premiere festival releases directly to your inbox.
            </p>
            <form onSubmit={handleSubscribe} style={{ display: "flex", gap: "0.5rem" }}>
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                style={{ padding: "0.6rem 0.9rem", fontSize: "0.85rem" }}
              />
              <button type="submit" className="btn btn-primary btn-sm" style={{ padding: "0.6rem 1rem" }}>
                <ArrowRight size={16} />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: "1px solid var(--border-subtle)",
            paddingTop: "2rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
            fontSize: "0.8125rem",
            color: "var(--text-muted)",
          }}
        >
          <div>
            &copy; {new Date().getFullYear()} FILMVORA Inc. All rights reserved. Built with cinematic precision.
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <ShieldCheck size={16} color="var(--accent-emerald)" /> 100% Authorized & Certified Streaming
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
