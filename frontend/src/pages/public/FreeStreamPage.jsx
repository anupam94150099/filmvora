import React, { useState, useEffect } from "react";
import { movieService } from "../../services/movieService";
import MovieGrid from "../../components/common/MovieGrid";
import AdSlot from "../../components/common/AdSlot";
import { ShieldCheck, Play, Sparkles, Gift } from "lucide-react";

const FreeStreamPage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFreeMovies = async () => {
      setLoading(true);
      try {
        const res = await movieService.getCategoryMovies("free-stream");
        if (res.success) {
          setMovies(res.movies || []);
        }
      } catch (err) {
        console.error("Error fetching free streaming movies:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFreeMovies();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="free-stream-page fade-in" style={{ padding: "2.5rem 0 5rem" }}>
      <div className="container">
        {/* Header Hero Banner */}
        <div
          style={{
            padding: "2.5rem",
            background: "linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(13, 16, 23, 0.95) 100%)",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            borderRadius: "var(--radius-lg)",
            marginBottom: "3rem",
            boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "rgba(16, 185, 129, 0.2)",
              color: "#10b981",
              padding: "0.35rem 0.85rem",
              borderRadius: "var(--radius-full)",
              fontSize: "0.8rem",
              fontWeight: 700,
              marginBottom: "1rem",
            }}
          >
            <ShieldCheck size={16} />
            <span>100% LEGAL & AUTHORIZED FREE STREAMING</span>
          </div>

          <h1 style={{ fontSize: "2.5rem", fontWeight: 800, color: "#fff", marginBottom: "0.75rem" }}>
            Public Domain & Open Cinema Vault
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "1.05rem", maxWidth: "720px", lineHeight: 1.6 }}>
            Enjoy legendary historical cinema, open-source animated short masterpieces, and iconic cultural heritage films. Free to watch online and authorized for personal offline download under Public Domain & Creative Commons licenses.
          </p>
        </div>

        {/* Catalog Grid */}
        <div style={{ marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#fff", marginBottom: "1.25rem" }}>
            Available Titles ({movies.length})
          </h2>
          <MovieGrid
            movies={movies}
            loading={loading}
            emptyMessage="No free streaming titles currently found in this category."
          />
        </div>

        {/* Ad Slot */}
        <AdSlot type="banner" />
      </div>
    </div>
  );
};

export default FreeStreamPage;
