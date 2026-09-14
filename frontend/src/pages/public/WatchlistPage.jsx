import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useWatchlist } from "../../context/WatchlistContext";
import MovieCard from "../../components/common/MovieCard";
import { Bookmark, Film, Trash2, Play, Sparkles } from "lucide-react";

const WatchlistPage = () => {
  const navigate = useNavigate();
  const { watchlist, loading, toggleWatchlist } = useWatchlist();

  return (
    <div className="watchlist-page fade-in" style={{ padding: "2.5rem 0 5rem" }}>
      <div className="container">
        {/* Header */}
        <div
          className="flex-between"
          style={{
            marginBottom: "2rem",
            borderBottom: "1px solid var(--border-subtle)",
            paddingBottom: "1.25rem",
          }}
        >
          <div>
            <h1 style={{ fontSize: "2rem", fontWeight: 800, display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <Bookmark size={28} color="var(--primary)" />
              <span>My Watchlist</span>
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginTop: "0.25rem" }}>
              {watchlist.length} {watchlist.length === 1 ? "title" : "titles"} saved for later streaming
            </p>
          </div>

          {watchlist.length > 0 && (
            <Link to="/movies" className="btn btn-secondary btn-sm">
              Explore More Movies
            </Link>
          )}
        </div>

        {/* Watchlist Grid */}
        {watchlist.length === 0 ? (
          <div
            className="flex-center"
            style={{
              flexDirection: "column",
              padding: "6rem 1rem",
              textAlign: "center",
              gap: "1.25rem",
              background: "var(--bg-secondary)",
              borderRadius: "var(--radius-lg)",
              border: "1px dashed var(--border-subtle)",
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                background: "rgba(229, 9, 20, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--primary)",
              }}
            >
              <Bookmark size={32} />
            </div>
            <div>
              <h3 style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: "0.4rem" }}>
                Your Watchlist is Empty
              </h3>
              <p style={{ color: "var(--text-muted)", maxWidth: "420px", fontSize: "0.925rem" }}>
                Save movies you want to watch later by clicking the bookmark icon on any title.
              </p>
            </div>
            <Link to="/movies" className="btn btn-primary" style={{ marginTop: "0.5rem" }}>
              <Film size={18} />
              <span>Browse Catalog</span>
            </Link>
          </div>
        ) : (
          <div className="movie-grid-container">
            {watchlist.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchlistPage;
