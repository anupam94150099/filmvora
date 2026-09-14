import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { genreService } from "../../services/genreService";
import { movieService } from "../../services/movieService";
import MovieGrid from "../../components/common/MovieGrid";
import { Layers, Loader2 } from "lucide-react";

const GenrePage = () => {
  const { slug } = useParams();

  const [allGenres, setAllGenres] = useState([]);
  const [currentGenre, setCurrentGenre] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGenreData = async () => {
      setLoading(true);
      try {
        if (slug) {
          const res = await genreService.getGenreBySlug(slug);
          if (res.success) {
            setCurrentGenre(res.genre);
            setMovies(res.movies || []);
            document.title = `${res.genre.name} Movies - FILMVORA`;
          }
        } else {
          const res = await genreService.getGenres();
          if (res.success) {
            setAllGenres(res.genres || []);
            document.title = "Browse Genres - FILMVORA";
          }
        }
      } catch (err) {
        console.error("Error loading genre data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadGenreData();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: "75vh" }}>
        <Loader2 size={40} className="animate-spin" color="var(--primary)" />
      </div>
    );
  }

  // If viewing a specific genre by slug
  if (slug && currentGenre) {
    return (
      <div className="genre-detail-page fade-in" style={{ paddingBottom: "5rem" }}>
        {/* Genre Banner */}
        <div
          style={{
            position: "relative",
            minHeight: "350px",
            display: "flex",
            alignItems: "center",
            backgroundImage: `url(${currentGenre.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            marginBottom: "3rem",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(10,12,16,0.4) 0%, rgba(10,12,16,0.95) 100%), linear-gradient(90deg, rgba(10,12,16,0.9) 0%, rgba(10,12,16,0.5) 100%)",
            }}
          />

          <div className="container" style={{ position: "relative", zIndex: 10 }}>
            <span className="badge badge-red" style={{ marginBottom: "0.5rem" }}>GENRE SPOTLIGHT</span>
            <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, marginBottom: "0.5rem" }}>
              {currentGenre.name} Movies
            </h1>
            <p style={{ color: "#cbd5e1", maxWidth: "600px", fontSize: "1rem", lineHeight: 1.6 }}>
              {currentGenre.description || `Explore the finest collection of ${currentGenre.name} cinema and short films.`}
            </p>
          </div>
        </div>

        {/* Movies in this genre */}
        <div className="container">
          <MovieGrid
            movies={movies}
            emptyMessage={`No movies currently listed under the ${currentGenre.name} genre.`}
          />
        </div>
      </div>
    );
  }

  // If viewing all genres catalog
  return (
    <div className="genres-hub-page fade-in" style={{ padding: "2.5rem 0 5rem" }}>
      <div className="container">
        <div style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto 3rem" }}>
          <h1 style={{ fontSize: "2.2rem", fontWeight: 800, marginBottom: "0.75rem" }}>
            Explore All Genres
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
            Dive into cinema across every category, from high-octane sci-fi to touching dramas and heart-pounding thrillers.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {allGenres.map((genre) => (
            <Link
              key={genre._id}
              to={`/genre/${genre.slug}`}
              style={{
                position: "relative",
                height: "180px",
                borderRadius: "var(--radius-md)",
                overflow: "hidden",
                boxShadow: "var(--shadow-md)",
                display: "flex",
                alignItems: "flex-end",
                padding: "1.5rem",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                backgroundColor: "var(--bg-card)",
              }}
              className="genre-card"
            >
              <img
                src={genre.image}
                alt={genre.name}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  filter: "brightness(0.6)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(10,12,16,0.95) 100%)",
                }}
              />
              <div style={{ position: "relative", zIndex: 2 }}>
                <h3 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#fff", marginBottom: "0.2rem" }}>
                  {genre.name}
                </h3>
                <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                  {genre.movieCount !== undefined ? `${genre.movieCount} Movies Available` : "Explore Genre"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GenrePage;
