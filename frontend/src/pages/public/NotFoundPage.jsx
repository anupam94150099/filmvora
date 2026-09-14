import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Film, Home, Search, ArrowLeft } from "lucide-react";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div
      className="not-found-page fade-in flex-center"
      style={{
        minHeight: "calc(100vh - 160px)",
        padding: "3rem 1rem",
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: "540px" }}>
        <div
          style={{
            fontSize: "clamp(5rem, 12vw, 8rem)",
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: "-0.05em",
            color: "var(--primary)",
            textShadow: "0 0 40px rgba(229, 9, 20, 0.4)",
            marginBottom: "1rem",
          }}
        >
          404
        </div>
        <h2 style={{ fontSize: "1.85rem", fontWeight: 800, marginBottom: "0.75rem" }}>
          Scene Not Found
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "1rem", lineHeight: 1.6, marginBottom: "2rem" }}>
          The reel you are looking for might have been moved, deleted, or was never filmed. Let's get you back to the featured premiere.
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
          <button onClick={() => navigate(-1)} className="btn btn-secondary">
            <ArrowLeft size={18} /> Go Back
          </button>
          <Link to="/" className="btn btn-primary">
            <Home size={18} /> Back to Home
          </Link>
          <Link to="/movies" className="btn btn-glass">
            <Film size={18} /> Browse Movies
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
