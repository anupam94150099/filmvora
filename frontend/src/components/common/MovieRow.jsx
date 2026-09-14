import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MovieCard from "./MovieCard";
import SkeletonCard from "./SkeletonCard";

const MovieRow = ({ title, movies = [], loading = false, subtitle, viewAllLink }) => {
  const rowRef = useRef(null);

  const handleScroll = (direction) => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollAmount = clientWidth * 0.75;
      rowRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (!loading && movies.length === 0) return null;

  return (
    <section style={{ marginBottom: "2.75rem", position: "relative" }}>
      {/* Row Header */}
      <div
        className="flex-between"
        style={{ marginBottom: "1rem", alignItems: "baseline" }}
      >
        <div>
          <h2 style={{ fontSize: "1.45rem", fontWeight: 700, letterSpacing: "-0.01em" }}>
            {title}
          </h2>
          {subtitle && (
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "0.15rem" }}>
              {subtitle}
            </p>
          )}
        </div>

        {viewAllLink && (
          <a
            href={viewAllLink}
            style={{
              fontSize: "0.85rem",
              fontWeight: 600,
              color: "var(--primary)",
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
            }}
          >
            Explore All <ChevronRight size={16} />
          </a>
        )}
      </div>

      {/* Horizontal Carousel Container */}
      <div style={{ position: "relative" }} className="movie-row-wrapper">
        {/* Left Arrow */}
        <button
          onClick={() => handleScroll("left")}
          className="row-nav-btn row-nav-left"
          aria-label="Scroll left"
          style={{
            position: "absolute",
            left: "-12px",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 10,
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background: "rgba(16, 19, 26, 0.9)",
            border: "1px solid var(--border-subtle)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 16px rgba(0,0,0,0.6)",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          <ChevronLeft size={22} />
        </button>

        {/* Scrollable Track */}
        <div
          ref={rowRef}
          style={{
            display: "grid",
            gridAutoFlow: "column",
            gridAutoColumns: "minmax(190px, 230px)",
            gap: "1.2rem",
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            padding: "0.5rem 0.25rem 1rem",
            scrollbarWidth: "none", // Firefox
            msOverflowStyle: "none", // IE/Edge
          }}
          className="hide-scrollbar"
        >
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={{ scrollSnapAlign: "start" }}>
                <SkeletonCard />
              </div>
            ))
          ) : (
            movies.map((movie) => (
              <div key={movie._id} style={{ scrollSnapAlign: "start" }}>
                <MovieCard movie={movie} />
              </div>
            ))
          )}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => handleScroll("right")}
          className="row-nav-btn row-nav-right"
          aria-label="Scroll right"
          style={{
            position: "absolute",
            right: "-12px",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 10,
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background: "rgba(16, 19, 26, 0.9)",
            border: "1px solid var(--border-subtle)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 16px rgba(0,0,0,0.6)",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          <ChevronRight size={22} />
        </button>
      </div>
    </section>
  );
};

export default MovieRow;
