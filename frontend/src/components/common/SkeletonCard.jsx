import React from "react";

export const SkeletonCard = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <div
        className="skeleton"
        style={{
          width: "100%",
          aspectRatio: "2/3",
          borderRadius: "var(--radius-md)",
        }}
      />
      <div className="skeleton" style={{ height: "1.1rem", width: "80%" }} />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div className="skeleton" style={{ height: "0.85rem", width: "40%" }} />
        <div className="skeleton" style={{ height: "0.85rem", width: "25%" }} />
      </div>
    </div>
  );
};

export const SkeletonHero = () => {
  return (
    <div
      className="skeleton"
      style={{
        width: "100%",
        height: "65vh",
        minHeight: "450px",
        borderRadius: "var(--radius-lg)",
        marginBottom: "2.5rem",
      }}
    />
  );
};

export default SkeletonCard;
