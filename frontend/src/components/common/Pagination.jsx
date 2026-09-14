import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    // Show first, last, current, and surrounding pages
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
        marginTop: "3rem",
      }}
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="btn btn-glass"
        style={{
          padding: "0.5rem 0.8rem",
          opacity: currentPage === 1 ? 0.4 : 1,
          cursor: currentPage === 1 ? "not-allowed" : "pointer",
        }}
      >
        <ChevronLeft size={18} />
      </button>

      {pages.map((page, idx) =>
        page === "..." ? (
          <span key={idx} style={{ color: "var(--text-muted)", padding: "0 0.5rem" }}>
            ...
          </span>
        ) : (
          <button
            key={idx}
            onClick={() => onPageChange(page)}
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "var(--radius-sm)",
              background: currentPage === page ? "var(--primary)" : "var(--bg-card)",
              color: "#fff",
              fontWeight: 600,
              fontSize: "0.9rem",
              border: "1px solid var(--border-subtle)",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="btn btn-glass"
        style={{
          padding: "0.5rem 0.8rem",
          opacity: currentPage === totalPages ? 0.4 : 1,
          cursor: currentPage === totalPages ? "not-allowed" : "pointer",
        }}
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
};

export default Pagination;
