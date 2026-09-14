import React from "react";
import { Star } from "lucide-react";

const RatingBadge = ({ rating, size = "md" }) => {
  const formattedRating = Number(rating || 0).toFixed(1);

  const sizeStyles = {
    sm: { padding: "0.2rem 0.45rem", fontSize: "0.75rem", iconSize: 12 },
    md: { padding: "0.25rem 0.6rem", fontSize: "0.8125rem", iconSize: 14 },
    lg: { padding: "0.35rem 0.8rem", fontSize: "0.9375rem", iconSize: 16 },
  };

  const style = sizeStyles[size] || sizeStyles.md;

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.3rem",
        background: "rgba(245, 197, 24, 0.15)",
        color: "#f5c518",
        border: "1px solid rgba(245, 197, 24, 0.35)",
        borderRadius: "var(--radius-xs)",
        fontWeight: 700,
        padding: style.padding,
        fontSize: style.fontSize,
        lineHeight: 1,
        backdropFilter: "blur(4px)",
      }}
    >
      <Star size={style.iconSize} fill="#f5c518" color="#f5c518" />
      <span>{formattedRating}</span>
    </div>
  );
};

export default RatingBadge;
