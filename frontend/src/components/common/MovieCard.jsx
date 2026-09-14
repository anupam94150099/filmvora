import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Play, Bookmark, Check, Info, Star } from "lucide-react";
import { useWatchlist } from "../../context/WatchlistContext";
import RatingBadge from "./RatingBadge";

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const inWatchlist = isInWatchlist(movie._id);
  const [isHovered, setIsHovered] = useState(false);

  const handlePlayClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/watch/${movie.slug || movie._id}`);
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
          src={movie.poster}
          alt={movie.title}
          loading="lazy"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.4s ease",
            transform: isHovered ? "scale(1.06)" : "scale(1)",
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
          {movie.quality && (
            <span
              style={{
                background: "rgba(0, 0, 0, 0.65)",
                backdropFilter: "blur(4px)",
                color: "#e2e8f0",
                fontSize: "0.65rem",
                fontWeight: 700,
                padding: "0.15rem 0.4rem",
                borderRadius: "3px",
                border: "1px solid rgba(255, 255, 255, 0.15)",
              }}
            >
              {movie.quality}
            </span>
          )}
        </div>

        {/* Hover Overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, rgba(0, 0, 0, 0.2) 0%, rgba(10, 12, 16, 0.95) 100%)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "0.75rem",
            opacity: isHovered ? 1 : 0,
            transition: "opacity 0.25s ease",
            padding: "1rem",
            zIndex: 2,
          }}
        >
          <button
            onClick={handlePlayClick}
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "50%",
              background: "var(--primary)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 20px rgba(229, 9, 20, 0.6)",
              transform: isHovered ? "scale(1)" : "scale(0.8)",
              transition: "transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            }}
            title="Stream Movie"
          >
            <Play size={24} fill="#fff" style={{ marginLeft: "3px" }} />
          </button>

          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              onClick={handleWatchlistClick}
              className="btn-icon"
              style={{
                width: "36px",
                height: "36px",
                background: inWatchlist ? "rgba(229, 9, 20, 0.3)" : "rgba(255, 255, 255, 0.15)",
                color: inWatchlist ? "var(--primary)" : "#fff",
                border: inWatchlist ? "1px solid var(--primary)" : "1px solid rgba(255, 255, 255, 0.2)",
              }}
              title={inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
            >
              {inWatchlist ? <Check size={16} /> : <Bookmark size={16} />}
            </button>

            <Link
              to={`/movie/${movie.slug || movie._id}`}
              className="btn-icon"
              style={{
                width: "36px",
                height: "36px",
                background: "rgba(255, 255, 255, 0.15)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
              title="View Details"
              onClick={(e) => e.stopPropagation()}
            >
              <Info size={16} />
            </Link>
          </div>
        </div>
      </div>

      {/* Card Info Footer */}
      <div style={{ padding: "0.75rem 0.85rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
        <h4
          style={{
            fontSize: "0.95rem",
            fontWeight: 600,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            color: isHovered ? "var(--primary)" : "var(--text-main)",
            transition: "color 0.2s ease",
          }}
          title={movie.title}
        >
          {movie.title}
        </h4>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "0.8rem",
            color: "var(--text-muted)",
          }}
        >
          <span>{movie.releaseYear || "2025"}</span>
          <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
            {movie.genre || (movie.genres && movie.genres[0]) || "Cinema"}
          </span>
          {movie.duration && (
            <span>{Math.floor(movie.duration / 60)}h {movie.duration % 60}m</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
