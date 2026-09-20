import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Play, Bookmark, Check, Info, Star, ExternalLink, ShieldCheck } from "lucide-react";
import { useWatchlist } from "../../context/WatchlistContext";
import RatingBadge from "./RatingBadge";

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const inWatchlist = isInWatchlist(movie._id);
  const [isHovered, setIsHovered] = useState(false);

  const posterSrc =
    movie.posterUrl ||
    movie.poster ||
    "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80";

  const isFreeLegal =
    movie.availability === "PUBLIC_DOMAIN" ||
    movie.availability === "CREATIVE_COMMONS" ||
    movie.availability === "LICENSED" ||
    movie.availability === "OWNED";

  const handleActionClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFreeLegal && movie.watchUrl) {
      navigate(`/watch/${movie.slug || movie._id}`);
    } else {
      navigate(`/movie/${movie.slug || movie._id}`);
    }
  };

  const handleWatchlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWatchlist(movie);
  };

  return (
    <div
      className="movie-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: "relative",
        borderRadius: "var(--radius-md)",
        overflow: "hidden",
        backgroundColor: "var(--bg-card)",
        transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease",
        transform: isHovered ? "translateY(-6px) scale(1.02)" : "translateY(0) scale(1)",
        boxShadow: isHovered
          ? "0 14px 28px rgba(0, 0, 0, 0.6), 0 0 20px rgba(229, 9, 20, 0.25)"
          : "0 4px 12px rgba(0, 0, 0, 0.3)",
        cursor: "pointer",
        userSelect: "none",
      }}
      onClick={() => navigate(`/movie/${movie.slug || movie._id}`)}
    >
      {/* Poster Image Container */}
      <div style={{ position: "relative", width: "100%", aspectRatio: "2/3", overflow: "hidden" }}>
        <img
          src={posterSrc}
          alt={movie.title}
          loading="lazy"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.4s ease",
            transform: isHovered ? "scale(1.06)" : "scale(1)",
            backgroundColor: "#161b26",
          }}
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80";
          }}
        />

        {/* Top Badges */}
        <div
          style={{
            position: "absolute",
            top: "0.5rem",
            left: "0.5rem",
            right: "0.5rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pointerEvents: "none",
          }}
        >
          <RatingBadge rating={movie.rating} size="sm" />
          
          {/* Availability Indicator Badge */}
          <span
            style={{
              background: isFreeLegal ? "rgba(16, 185, 129, 0.85)" : "rgba(10, 12, 16, 0.8)",
              backdropFilter: "blur(4px)",
              color: isFreeLegal ? "#ffffff" : "#f1f5f9",
              fontSize: "0.65rem",
              fontWeight: 700,
              padding: "0.2rem 0.45rem",
              borderRadius: "4px",
              border: isFreeLegal ? "1px solid rgba(16, 185, 129, 0.4)" : "1px solid rgba(255, 255, 255, 0.15)",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            {isFreeLegal ? "FREE STREAM" : "WHERE TO WATCH"}
          </span>
        </div>

        {/* Hover Overlay with Action Buttons */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(10, 12, 16, 0.75)",
            backdropFilter: "blur(2px)",
            opacity: isHovered ? 1 : 0,
            transition: "opacity 0.25s ease",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "0.6rem",
            padding: "1rem",
          }}
        >
          <button
            onClick={handleActionClick}
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              backgroundColor: isFreeLegal ? "var(--accent-emerald)" : "var(--primary)",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 16px rgba(0,0,0,0.5)",
              transition: "transform 0.15s ease",
              transform: isHovered ? "scale(1.08)" : "scale(0.8)",
            }}
            title={isFreeLegal ? "Watch Free Online" : "Where to Watch OTT Guide"}
          >
            {isFreeLegal ? <Play size={20} fill="#ffffff" style={{ marginLeft: "2px" }} /> : <ExternalLink size={18} />}
          </button>

          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#fff" }}>
            {isFreeLegal ? "Watch Online" : "Where to Watch"}
          </span>

          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.25rem" }}>
            <button
              onClick={handleWatchlistClick}
              style={{
                background: inWatchlist ? "rgba(229, 9, 20, 0.25)" : "rgba(255, 255, 255, 0.15)",
                border: inWatchlist ? "1px solid var(--primary)" : "1px solid rgba(255, 255, 255, 0.2)",
                color: inWatchlist ? "var(--primary)" : "#fff",
                borderRadius: "var(--radius-full)",
                padding: "0.35rem 0.75rem",
                fontSize: "0.75rem",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: "0.3rem",
                cursor: "pointer",
              }}
            >
              {inWatchlist ? <Check size={12} /> : <Bookmark size={12} />}
              <span>{inWatchlist ? "Saved" : "Watchlist"}</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/movie/${movie.slug || movie._id}`);
              }}
              style={{
                background: "rgba(255, 255, 255, 0.15)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                color: "#fff",
                borderRadius: "var(--radius-full)",
                padding: "0.35rem 0.75rem",
                fontSize: "0.75rem",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: "0.3rem",
                cursor: "pointer",
              }}
            >
              <Info size={12} />
              <span>Details</span>
            </button>
          </div>
        </div>
      </div>

      {/* Card Info Details */}
      <div style={{ padding: "0.875rem 0.75rem" }}>
        <h3
          style={{
            fontSize: "0.95rem",
            fontWeight: 700,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            marginBottom: "0.35rem",
            color: "#ffffff",
          }}
          title={movie.title}
        >
          {movie.title}
        </h3>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "0.8rem",
            color: "var(--text-secondary)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <span>{movie.releaseYear || "2024"}</span>
            <span>•</span>
            <span>{movie.genre || (movie.genres && movie.genres[0]) || "Cinema"}</span>
          </div>

          <span
            style={{
              fontSize: "0.7rem",
              fontWeight: 600,
              color: "var(--text-muted)",
              background: "rgba(255, 255, 255, 0.05)",
              padding: "0.1rem 0.35rem",
              borderRadius: "3px",
            }}
          >
            {movie.language || "EN"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
