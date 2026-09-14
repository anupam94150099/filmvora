import React from "react";
import { TrendingUp } from "lucide-react";

const StatCard = ({ title, value, icon: Icon, color = "var(--primary)", change, subtitle }) => {
  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-md)",
        padding: "1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="flex-between">
        <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-secondary)" }}>
          {title}
        </span>
        <div
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "var(--radius-sm)",
            background: `rgba(255, 255, 255, 0.05)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: color,
          }}
        >
          {Icon && <Icon size={22} />}
        </div>
      </div>

      <div>
        <h3 style={{ fontSize: "1.85rem", fontWeight: 800, color: "#fff" }}>
          {typeof value === "number" ? value.toLocaleString() : value}
        </h3>
        {subtitle && (
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
            {subtitle}
          </div>
        )}
      </div>

      {change && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8rem", color: "var(--accent-emerald)" }}>
          <TrendingUp size={14} />
          <span>{change} from previous cycle</span>
        </div>
      )}

      {/* Subtle top glow line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: color,
        }}
      />
    </div>
  );
};

export default StatCard;
