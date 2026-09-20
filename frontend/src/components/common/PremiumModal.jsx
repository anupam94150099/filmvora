import React from "react";
import { X, Check, Sparkles, Shield, Zap, Film, Download } from "lucide-react";

const PremiumModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0, 0, 0, 0.85)",
        backdropFilter: "blur(8px)",
        padding: "1rem",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "linear-gradient(135deg, #131722 0%, #0a0c10 100%)",
          border: "1px solid rgba(229, 9, 20, 0.4)",
          borderRadius: "var(--radius-lg)",
          maxWidth: "680px",
          width: "100%",
          padding: "2rem",
          position: "relative",
          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(229, 9, 20, 0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1.2rem",
            right: "1.2rem",
            color: "var(--text-secondary)",
            background: "rgba(255, 255, 255, 0.08)",
            borderRadius: "50%",
            width: "36px",
            height: "36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "rgba(229, 9, 20, 0.15)",
              color: "var(--primary)",
              padding: "0.4rem 1rem",
              borderRadius: "var(--radius-full)",
              fontSize: "0.85rem",
              fontWeight: 700,
              marginBottom: "0.75rem",
            }}
          >
            <Sparkles size={16} />
            <span>FILMVORA VIP PASS</span>
          </div>
          <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#fff", marginBottom: "0.4rem" }}>
            Upgrade to Premium Experience
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
            Enjoy the ultimate legal movie discovery, zero advertisements, and highest bitrate streaming.
          </p>
        </div>

        {/* Pricing & Comparison Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "2rem" }}>
          {/* Free Plan */}
          <div
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "var(--radius-md)",
              padding: "1.5rem",
            }}
          >
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#fff", marginBottom: "0.2rem" }}>Free Explorer</h3>
            <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#fff", margin: "0.8rem 0" }}>
              $0 <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 400 }}>/ forever</span>
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: "1rem 0", display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.85rem" }}>
              <li style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-secondary)" }}>
                <Check size={16} color="var(--accent-emerald)" /> Universal Movie Search
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-secondary)" }}>
                <Check size={16} color="var(--accent-emerald)" /> Where to Watch OTT Guide
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-secondary)" }}>
                <Check size={16} color="var(--accent-emerald)" /> Public Domain Legal Stream
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-muted)" }}>
                ✕ Standard Ads Enabled
              </li>
            </ul>
          </div>

          {/* Premium VIP Plan */}
          <div
            style={{
              background: "linear-gradient(145deg, rgba(229, 9, 20, 0.12) 0%, rgba(20, 24, 34, 0.8) 100%)",
              border: "2px solid var(--primary)",
              borderRadius: "var(--radius-md)",
              padding: "1.5rem",
              position: "relative",
            }}
          >
            <span
              style={{
                position: "absolute",
                top: "-12px",
                right: "15px",
                background: "var(--primary)",
                color: "#fff",
                fontSize: "0.7rem",
                fontWeight: 700,
                padding: "0.2rem 0.6rem",
                borderRadius: "var(--radius-full)",
              }}
            >
              POPULAR
            </span>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#fff", marginBottom: "0.2rem" }}>VIP Premium</h3>
            <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--accent-amber)", margin: "0.8rem 0" }}>
              $3.99 <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 400 }}>/ month</span>
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: "1rem 0", display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.85rem" }}>
              <li style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#fff" }}>
                <Check size={16} color="var(--primary)" /> 100% Ad-Free Experience
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#fff" }}>
                <Check size={16} color="var(--primary)" /> 4K Ultra HD Streaming Bitrate
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#fff" }}>
                <Check size={16} color="var(--primary)" /> Direct Public Domain Downloads
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#fff" }}>
                <Check size={16} color="var(--primary)" /> Unlimited Cloud Watchlists
              </li>
            </ul>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => {
            alert("Thank you! FILMVORA Premium simulator activated for your session.");
            onClose();
          }}
          className="btn btn-primary"
          style={{
            width: "100%",
            padding: "0.9rem",
            fontSize: "1rem",
            fontWeight: 700,
            borderRadius: "var(--radius-sm)",
          }}
        >
          Upgrade to VIP Premium
        </button>
      </div>
    </div>
  );
};

export default PremiumModal;
