import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { movieService } from "../../services/movieService";
import { genreService } from "../../services/genreService";
import HeroBanner from "../../components/common/HeroBanner";
import MovieRow from "../../components/common/MovieRow";
import SkeletonHero from "../../components/common/SkeletonCard";
import { Sparkles, TrendingUp, Flame, Star, Compass, Play, Clapperboard, Film } from "lucide-react";

const HomePage = () => {
  const navigate = useNavigate();
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [latestMovies, setLatestMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);
        const [moviesRes, genresRes] = await Promise.all([
          movieService.getMovies({ limit: 20 }),
          genreService.getGenres(),
        ]);

        if (moviesRes.success) {
          const all = moviesRes.movies || [];
          const feat = all.filter((m) => m.isFeatured);
          setFeaturedMovies(feat.length > 0 ? feat : all.slice(0, 3));
          setTrendingMovies(all.filter((m) => m.isTrending));
          setLatestMovies([...all].sort((a, b) => b.releaseYear - a.releaseYear));
          setTopRatedMovies([...all].sort((a, b) => b.rating - a.rating));
        }

        if (genresRes.success) {
          setGenres(genresRes.genres || []);
        }
      } catch (err) {
        console.error("Error loading home page content:", err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  return (
    <div className="home-page fade-in" style={{ paddingBottom: "4rem" }}>
      {/* Hero Banner Spotlight */}
      <div className="container" style={{ paddingTop: "1rem" }}>
        {loading ? <SkeletonHero /> : <HeroBanner featuredMovies={featuredMovies} />}
      </div>

      <div className="container">
        {/* Trending Now */}
        <MovieRow
          title="Trending Now"
          subtitle="The most streamed titles across the platform this week"
          movies={trendingMovies}
          loading={loading}
          viewAllLink="/movies?trending=true"
        />

        {/* Latest Releases */}
        <MovieRow
          title="Latest Releases"
          subtitle="Freshly added cinema, premieres and studio productions"
          movies={latestMovies}
          loading={loading}
          viewAllLink="/movies?sort=newest"
        />

        {/* Browse By Genre Cards */}
        <section style={{ marginBottom: "3.5rem" }}>
          <div className="flex-between" style={{ marginBottom: "1.25rem" }}>
            <div>
              <h2 style={{ fontSize: "1.45rem", fontWeight: 700 }}>Browse by Genre</h2>
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                Curated collections tailored to every emotion and cinematic taste
              </p>
            </div>
            <Link
              to="/genres"
              style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)" }}
            >
              All Genres &rarr;
            </Link>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: "1.2rem",
            }}
          >
            {genres.slice(0, 8).map((genre) => (
              <Link
                key={genre._id}
                to={`/genre/${genre.slug}`}
                style={{
                  position: "relative",
                  height: "130px",
                  borderRadius: "var(--radius-md)",
                  overflow: "hidden",
                  boxShadow: "var(--shadow-sm)",
                  display: "flex",
                  alignItems: "flex-end",
                  padding: "1.25rem",
                  transition: "transform 0.25s ease, box-shadow 0.25s ease",
                  backgroundColor: "var(--bg-card)",
                }}
                className="genre-card"
              >
                {/* Background Image */}
                <img
                  src={genre.image}
                  alt={genre.name}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    filter: "brightness(0.65)",
                    transition: "transform 0.4s ease",
                  }}
                />

                {/* Dark Gradient Overlay */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(10,12,16,0.9) 100%)",
                  }}
                />

                {/* Content */}
                <div style={{ position: "relative", zIndex: 2 }}>
                  <h4 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#fff" }}>
                    {genre.name}
                  </h4>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                    {genre.movieCount !== undefined ? `${genre.movieCount} Movies` : "Explore Catalog"}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Top Rated Masterpieces */}
        <MovieRow
          title="Top Rated Masterpieces"
          subtitle="Critically acclaimed titles with exceptional audience ratings"
          movies={topRatedMovies}
          loading={loading}
          viewAllLink="/movies?sort=topRated"
        />

        {/* Call to Action Banner */}
        <section
          style={{
            position: "relative",
            background: "linear-gradient(135deg, rgba(229, 9, 20, 0.15) 0%, rgba(17, 19, 26, 0.95) 100%)",
            border: "1px solid rgba(229, 9, 20, 0.3)",
            borderRadius: "var(--radius-lg)",
            padding: "3.5rem 2rem",
            textAlign: "center",
            marginTop: "2rem",
            overflow: "hidden",
          }}
        >
          <div style={{ maxWidth: "600px", margin: "0 auto", position: "relative", zIndex: 2 }}>
            <span className="badge badge-red" style={{ marginBottom: "1rem" }}>
              UNLIMITED ENTERTAINMENT
            </span>
            <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)", fontWeight: 800, marginBottom: "1rem" }}>
              Discover your next favorite story.
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "1rem", lineHeight: 1.6, marginBottom: "2rem" }}>
              Join thousands of film enthusiasts enjoying crystal-clear 4K streams, offline watchlists, and curated festival selections.
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
              <button
                onClick={() => navigate("/movies")}
                className="btn btn-primary btn-lg"
              >
                <Clapperboard size={20} />
                <span>Explore All Movies</span>
              </button>
              <button
                onClick={() => navigate("/register")}
                className="btn btn-secondary btn-lg"
              >
                <span>Create Free Account</span>
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
