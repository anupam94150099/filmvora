import React from "react";
import MovieCard from "./MovieCard";
import SkeletonCard from "./SkeletonCard";
import { Film } from "lucide-react";

const MovieGrid = ({ movies = [], loading = false, emptyMessage = "No movies found matching your criteria." }) => {
  if (loading) {
    return (
      <div className="movie-grid-container">
        {Array.from({ length: 10 }).map((_, idx) => (
          <SkeletonCard key={idx} />
        ))}
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div
        className="flex-center"
        style={{
          flexDirection: "column",
          padding: "5rem 1rem",
          textAlign: "center",
          gap: "1rem",
          color: "var(--text-muted)",
        }}
      >
        <Film size={48} strokeWidth={1.5} color="var(--text-muted)" />
        <h3 style={{ color: "var(--text-secondary)", fontSize: "1.2rem" }}>
          {emptyMessage}
        </h3>
        <p style={{ maxWidth: "450px", fontSize: "0.9rem" }}>
          Try adjusting your search keywords, clearing filters, or exploring popular trending titles.
        </p>
      </div>
    );
  }

  return (
    <div className="movie-grid-container">
      {movies.map((movie) => (
        <MovieCard key={movie._id} movie={movie} />
      ))}
    </div>
  );
};

export default MovieGrid;
