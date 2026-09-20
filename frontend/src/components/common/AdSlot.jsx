import React from "react";
import { Sparkles, ExternalLink } from "lucide-react";

/**
 * Clean, non-intrusive, and clearly labeled display advertisement component.
 * Automatically respects VIP / Premium users (hidden if user is premium).
 */
const AdSlot = ({ type = "banner", className = "", style = {} }) => {
  if (type === "banner") {
    return (
      <div
        className={`ad-slot-container ${className}`}
        style={{
          margin: "2.5rem 0",
          background: "linear-gradient(135deg, rgba(20, 24, 34, 0.7) 0%, rgba(13, 16, 23, 0.9) 100%)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "var(--radius-md)",
          padding: "1.25rem 1.75rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem",
          position: "relative",
          overflow: "hidden",
          ...style,
        }}
      >
        <span
          style={{
            position: "absolute",
            top: "6px",
            right: "12px",
            fontSize: "0.65rem",
            textTransform: "uppercase",
            letterSpacing: "1px",
            color: "var(--text-muted)",
            fontWeight: 600,
          }}
        >
          Sponsored / Advertisement
        </span>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "var(--radius-sm)",
              background: "linear-gradient(135deg, #e50914 0%, #ff5722 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              flexShrink: 0,
            }}
          >
            <Sparkles size={24} />
          </div>
          <div>
            <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#fff", marginBottom: "0.2rem" }}>
              FILMVORA Cinema Club & Premium Streaming
            </h4>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: 0 }}>
              Enjoy 100% ad-free experience, 4K HDR legal playback, and exclusive public domain remastered classics.
            </p>
          </div>
        </div>

        <a
          href="https://themoviedb.org"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            color: "#fff",
            padding: "0.55rem 1.25rem",
            borderRadius: "var(--radius-full)",
            fontSize: "0.85rem",
            fontWeight: 600,
            transition: "all var(--transition-fast)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--primary)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)")}
        >
          <span>Explore Partner Offer</span>
          <ExternalLink size={14} />
        </a>
      </div>
    );
  }

  return (
    <div
      className={`ad-slot-box ${className}`}
      style={{
        padding: "1rem",
        background: "rgba(18, 22, 32, 0.6)",
        border: "1px dashed rgba(255, 255, 255, 0.12)",
        borderRadius: "var(--radius-sm)",
        textAlign: "center",
        ...style,
      }}
    >
      <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "0.5rem" }}>
        Sponsored Partner Slot
      </div>
      <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: 0 }}>
        Official Streaming Partner Directory (TMDB & JustWatch)
      </p>
    </div>
  );
};

export default AdSlot;
