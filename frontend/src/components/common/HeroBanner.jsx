import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Film, Bookmark, Check, Info, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useWatchlist } from "../../context/WatchlistContext";
import RatingBadge from "./RatingBadge";
import TrailerModal from "./TrailerModal";

const HeroBanner = ({ featuredMovies = [] }) => {
  const navigate = useNavigate();
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTrailer, setShowTrailer] = useState(false);

  // Auto-rotate hero every 8 seconds
  useEffect(() => {
    if (featuredMovies.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [featuredMovies.length]);

  if (!featuredMovies || featuredMovies.length === 0) return null;

  const current = featuredMovies[currentIndex] || featuredMovies[0];
  const inWatchlist = isInWatchlist(current._id);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? featuredMovies.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
  };

  return (
    <div
      className="hero-banner"
      style={{
        position: "relative",
        minHeight: "75vh",
        maxHeight: "850px",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        marginBottom: "3rem",
        borderRadius: "var(--radius-lg)",
        boxShadow: "0 20px 50px rgba(0, 0, 0, 0.8)",
      }}
    >
      {/* Background Image Backdrop */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${current.bannerUrl || current.backdrop || current.posterUrl || current.poster})`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
          filter: "brightness(0.85)",
          transition: "background-image 0.8s ease-in-out",
        }}
      />

      {/* Cinematic Dark Gradient Overlays */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(90deg, rgba(10,12,16,0.98) 0%, rgba(10,12,16,0.85) 45%, rgba(10,12,16,0.2) 80%, rgba(10,12,16,0.7) 100%), linear-gradient(0deg, rgba(10,12,16,1) 0%, rgba(10,12,16,0.1) 40%, rgba(10,12,16,0.6) 100%)",
        }}
      />

      {/* Hero Content */}
      <div
        className="container"
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: "800px",
          margin: "0 auto 0 0",
          padding: "3rem 2rem",
        }}
      >
        {/* Meta badges row */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem", flexWrap: "wrap" }}>
          <span className="badge badge-red">SPOTLIGHT PREMIERE</span>
          <RatingBadge rating={current.rating} size="lg" />
          <span className="badge badge-glass">{current.releaseYear}</span>
          <span className="badge badge-glass">{current.quality || "4K UHD"}</span>
          <span className="badge badge-glass">{current.genre}</span>
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: "clamp(2.2rem, 5vw, 4rem)",
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: "1.2rem",
            textShadow: "0 4px 20px rgba(0,0,0,0.8)",
          }}
        >
          {current.title}
        </h1>

        {/* Description */}
        <p
          style={{
            fontSize: "1.05rem",
            color: "#cbd5e1",
            lineHeight: 1.6,
            marginBottom: "2rem",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            maxWidth: "650px",
          }}
        >
          {current.description}
        </p>

        {/* CTA Buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
          <button
            onClick={() => navigate(`/watch/${current.slug || current._id}`)}
            className="btn btn-primary btn-lg"
          >
            <Play size={20} fill="#fff" />
            <span>Watch Now</span>
          </button>

          {current.trailerUrl && (
            <button
              onClick={() => setShowTrailer(true)}
              className="btn btn-secondary btn-lg"
            >
              <Film size={20} />
              <span>Watch Trailer</span>
            </button>
          )}

          <button
            onClick={() => toggleWatchlist(current)}
            className="btn btn-glass"
            style={{
              height: "48px",
              padding: "0 1.25rem",
              color: inWatchlist ? "var(--primary)" : "#fff",
            }}
            title={inWatchlist ? "In Watchlist" : "Add to Watchlist"}
          >
            {inWatchlist ? <Check size={20} /> : <Bookmark size={20} />}
            <span>{inWatchlist ? "In Watchlist" : "Watchlist"}</span>
          </button>

          <button
            onClick={() => navigate(`/movie/${current.slug || current._id}`)}
            className="btn btn-glass"
            style={{ height: "48px", padding: "0 1.25rem" }}
          >
            <Info size={20} />
            <span>Details</span>
          </button>
        </div>
      </div>

      {/* Navigation Arrows for Featured Slider */}
      {featuredMovies.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            aria-label="Previous Slide"
            style={{
              position: "absolute",
              left: "1.5rem",
              bottom: "2rem",
              zIndex: 15,
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              background: "rgba(20, 24, 33, 0.7)",
              border: "1px solid var(--border-subtle)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <ChevronLeft size={22} />
          </button>

          <button
            onClick={nextSlide}
            aria-label="Next Slide"
            style={{
              position: "absolute",
              left: "5rem",
              bottom: "2rem",
              zIndex: 15,
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              background: "rgba(20, 24, 33, 0.7)",
              border: "1px solid var(--border-subtle)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <ChevronRight size={22} />
          </button>

          {/* Slide dots */}
          <div
            style={{
              position: "absolute",
              right: "2rem",
              bottom: "2.5rem",
              zIndex: 15,
              display: "flex",
              gap: "0.5rem",
            }}
          >
            {featuredMovies.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                style={{
                  width: currentIndex === idx ? "28px" : "10px",
                  height: "8px",
                  borderRadius: "4px",
                  background: currentIndex === idx ? "var(--primary)" : "rgba(255, 255, 255, 0.3)",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
              />
            ))}
          </div>
        </>
      )}

      {/* Trailer Modal */}
      <TrailerModal
        isOpen={showTrailer}
        onClose={() => setShowTrailer(false)}
        trailerUrl={current.trailerUrl}
        title={current.title}
      />
    </div>
  );
};

export default HeroBanner;
